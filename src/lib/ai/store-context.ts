"use client";

import { useBudgetStore } from "@/lib/stores/budget-store";
import { usePriorityStore } from "@/lib/stores/priority-store";
import { useChecklistStore } from "@/lib/stores/checklist-store";
import { useApartmentStore } from "@/lib/stores/apartment-store";
import { useSubscriptionStore } from "@/lib/stores/subscription-store";
import { useLanguageStore } from "@/lib/stores/language-store";
import { useDossierStore } from "@/lib/stores/dossier-store";
import { useSleepStore } from "@/lib/stores/sleep-store";
import { useKatieStore } from "@/lib/stores/katie-store";

import { CHECKLIST_ITEMS } from "@/lib/data/checklist-items";
import { ALL_LOCATIONS } from "@/lib/data/neighborhoods";
import { DEFAULT_SUBSCRIPTIONS } from "@/lib/data/subscriptions";
import { rankNeighborhoods } from "@/lib/engines/scoring";
import { calculateBudget } from "@/lib/engines/budget-calculator";
import { getTaxDataByLocationId } from "@/lib/data/tax-rates";
import { getUpcomingDeadlines } from "@/lib/engines/notification-engine";
import { formatCHF } from "@/lib/utils";

/**
 * Serialize all Zustand store state into a concise markdown context block
 * for the AI assistant. Called client-side before sending a message.
 *
 * Designed to be informative but token-efficient (~500-800 tokens).
 */
export function buildStoreContext(): string {
  const sections: string[] = [];

  // ─── Budget ────────────────────────────────────────────────────────────
  try {
    const budget = useBudgetStore.getState();
    const taxData = budget.taxLocationId ? getTaxDataByLocationId(budget.taxLocationId) : undefined;
    const breakdown = calculateBudget({
      grossMonthlySalary: budget.grossMonthlySalary,
      has13thSalary: budget.has13thSalary,
      expenseAllowance: budget.expenseAllowance,
      bvgMonthly: budget.bvgMonthly,
      pillar3aMonthly: budget.pillar3aMonthly,
      taxEffectiveRate: taxData?.effectiveRate ?? 0,
      viennaRent: budget.viennaRent,
      childSupport: budget.childSupport,
      viennaUtils: budget.viennaUtils,
      carInsurance: budget.carInsurance,
      zurichValues: budget.values,
    });

    sections.push(`## Budget State
- Gross monthly salary: ${formatCHF(budget.grossMonthlySalary)} (${budget.has13thSalary ? "13th" : "12mo"}) → ${formatCHF(breakdown.grossAnnualSalary)}/yr
- Net take-home: ${formatCHF(breakdown.totalMonthlyIncome)}/mo (after AHV/ALV/BVG/tax)
- Monthly surplus: ${formatCHF(breakdown.surplus)} (${breakdown.savingsRate.toFixed(1)}% savings rate)
- Rent: ${formatCHF(budget.values.rent)}/mo | Food: ${formatCHF(budget.values.foodDining)}/mo | Subs: ${formatCHF(budget.values.subscriptions)}/mo
- Tax municipality: ${taxData ? `${taxData.municipality} (${taxData.effectiveRate}%, ${formatCHF(breakdown.monthlyTax)}/mo)` : "Not set"}
- Pillar 3a: ${formatCHF(budget.pillar3aMonthly)}/mo | Vienna costs: ${formatCHF(breakdown.fixedOutside)}/mo
- Annual surplus: ${formatCHF(breakdown.annualSurplus)}`);
  } catch { /* store not hydrated */ }

  // ─── Neighborhoods ─────────────────────────────────────────────────────
  try {
    const priorities = usePriorityStore.getState();
    const ranked = rankNeighborhoods(ALL_LOCATIONS, priorities.weights).slice(0, 5);
    const topWeights = Object.entries(priorities.weights)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)
      .map(([k, v]) => `${k}:${v}`)
      .join(", ");

    sections.push(`## Neighborhood Priorities
- Top weights: ${topWeights}
- Top 5 ranked: ${ranked.map((n, i) => `${i + 1}. ${n.name} (${n.weightedScore.toFixed(1)})`).join(", ")}`);
  } catch { /* */ }

  // ─── Checklist ─────────────────────────────────────────────────────────
  try {
    const checklist = useChecklistStore.getState();
    const total = CHECKLIST_ITEMS.length;
    const done = checklist.completedIds.length;
    const pct = Math.round((done / total) * 100);

    // Phase breakdown
    const phases = ["mar-apr", "may", "jun", "jul"] as const;
    const phaseProgress = phases.map((p) => {
      const items = CHECKLIST_ITEMS.filter((i) => i.phase === p);
      const completed = items.filter((i) => checklist.completedIds.includes(i.id));
      return `${p}: ${completed.length}/${items.length}`;
    });

    // Upcoming deadlines
    let deadlineInfo = "";
    try {
      const deadlines = getUpcomingDeadlines(checklist.completedIds);
      if (deadlines.length > 0) {
        const urgent = deadlines.slice(0, 3).map((d) =>
          `${d.item.title} (${d.urgency}, ${d.daysUntil}d)`
        );
        deadlineInfo = `\n- Urgent deadlines: ${urgent.join("; ")}`;
      }
    } catch { /* notification engine may not exist yet */ }

    sections.push(`## Checklist Progress
- Overall: ${done}/${total} (${pct}%)
- By phase: ${phaseProgress.join(" | ")}${deadlineInfo}`);
  } catch { /* */ }

  // ─── Apartments ────────────────────────────────────────────────────────
  try {
    const apts = useApartmentStore.getState();
    if (apts.apartments.length > 0) {
      const byStatus: Record<string, number> = {};
      for (const a of apts.apartments) {
        byStatus[a.status] = (byStatus[a.status] || 0) + 1;
      }
      const statusStr = Object.entries(byStatus).map(([k, v]) => `${k}: ${v}`).join(", ");
      const active = apts.apartments.filter((a) => a.status !== "rejected");
      const activeList = active.slice(0, 3).map((a) => `${a.title} (${formatCHF(a.rent)}, ${a.rooms} rooms, Kreis ${a.kreis})`);

      sections.push(`## Apartment Pipeline
- Total saved: ${apts.apartments.length} | ${statusStr}
- Active listings: ${activeList.join("; ")}`);
    }
  } catch { /* */ }

  // ─── Subscriptions ─────────────────────────────────────────────────────
  try {
    const subs = useSubscriptionStore.getState();
    const decided = Object.entries(subs.decisions);
    if (decided.length > 0) {
      const kept = decided.filter(([, a]) => a === "keep").length;
      const cut = decided.filter(([, a]) => a === "cut").length;
      const replaced = decided.filter(([, a]) => a === "replace").length;
      const undecided = DEFAULT_SUBSCRIPTIONS.length - decided.length;
      sections.push(`## Subscriptions
- Decisions: ${kept} keep, ${cut} cut, ${replaced} replace, ${undecided} undecided`);
    }
  } catch { /* */ }

  // ─── Language ──────────────────────────────────────────────────────────
  try {
    const lang = useLanguageStore.getState();
    const reviewed = Object.keys(lang.cardStates).length;
    if (reviewed > 0 || lang.reviewStreak > 0) {
      sections.push(`## German Learning
- Cards reviewed: ${reviewed} | Streak: ${lang.reviewStreak} days
- Last review: ${lang.lastReviewDate ?? "never"}`);
    }
  } catch { /* */ }

  // ─── Dossier ───────────────────────────────────────────────────────────
  try {
    const dossier = useDossierStore.getState();
    const statuses = Object.values(dossier.statuses);
    const obtained = statuses.filter((s) => s === "obtained").length;
    const uploaded = statuses.filter((s) => s === "uploaded").length;
    const inProgress = statuses.filter((s) => s === "in_progress").length;
    const missing = statuses.filter((s) => s === "missing").length;
    if (obtained > 0 || inProgress > 0 || uploaded > 0) {
      sections.push(`## Dossier Documents
- Obtained: ${obtained} | Uploaded: ${uploaded} | In progress: ${inProgress} | Missing: ${missing}`);
    }
  } catch { /* */ }

  // ─── Sleep ─────────────────────────────────────────────────────────────
  try {
    const sleep = useSleepStore.getState();
    if (sleep.entries.length > 0) {
      const recent = sleep.entries.slice(-7);
      const avgHours = recent.reduce((sum, e) => sum + e.hours, 0) / recent.length;
      const avgQuality = recent.reduce((sum, e) => sum + (e.quality as number), 0) / recent.length;
      sections.push(`## Sleep (last ${recent.length} entries)
- Avg hours: ${avgHours.toFixed(1)}h | Avg quality: ${avgQuality.toFixed(1)}/5`);
    }
  } catch { /* */ }

  // ─── Katie ─────────────────────────────────────────────────────────────
  try {
    const katie = useKatieStore.getState();
    if (katie.visits && katie.visits.length > 0) {
      const upcoming = katie.visits.filter((v) => new Date(v.startDate) > new Date());
      sections.push(`## Katie Visits
- Total planned: ${katie.visits.length} | Upcoming: ${upcoming.length}`);
    }
  } catch { /* */ }

  if (sections.length === 0) {
    return "";
  }

  return `\n\n# Current User Data (live from app stores)\n${sections.join("\n\n")}`;
}
