import type { SavedApartment } from "@/lib/stores/apartment-store";
import type { ScoredNeighborhood } from "@/lib/engines/scoring";
import type { BudgetBreakdown, ExpenseItem } from "@/lib/engines/budget-calculator";
import type { KatieVisitData } from "@/lib/data/katie-visits";

// ---- CSV Export (Budget) ----

export function exportBudgetCSV(
  breakdown: BudgetBreakdown,
  expenses: ExpenseItem[],
  values: Record<string, number>
) {
  const rows = [
    ["Category", "Amount (CHF)"],
    ["--- INCOME ---", ""],
    ["Net Salary", "11450"],
    ["Expense Allowance", "700"],
    ["Total Income", String(breakdown.totalIncome)],
    ["", ""],
    ["--- FIXED OUTSIDE ---", ""],
    ["Vienna Costs", String(breakdown.fixedOutside)],
    ["", ""],
    ["--- ZURICH EXPENSES ---", ""],
    ...expenses.map((e) => [e.label, String(values[e.key] ?? e.value)]),
    ["Total Zurich", String(breakdown.zurichCosts)],
    ["", ""],
    ["--- SUMMARY ---", ""],
    ["Total Expenses", String(breakdown.totalExpenses)],
    ["Monthly Surplus", String(breakdown.surplus)],
    ["Savings Rate", `${breakdown.savingsRate.toFixed(1)}%`],
    ["Annual Surplus", String(breakdown.annualSurplus)],
  ];

  const csv = rows.map((r) => r.join(",")).join("\n");
  downloadFile(csv, "quaipulse-budget.csv", "text/csv");
}

// ---- ICS Export (Katie Visits) ----

export function exportKatieICS(visits: KatieVisitData[]) {
  const events = visits.map((v) => {
    const dtStart = v.startDate.replace(/-/g, "");
    const dtEnd = incrementDate(v.endDate).replace(/-/g, "");
    const summary = v.isSpecial
      ? `Katie Visit - ${v.specialLabel}`
      : "Katie Visit";
    const description = [
      v.transportMode === "flight" ? "Flight ZRH-VIE" : "Train (Railjet/NightJet)",
      v.notes ?? "",
    ]
      .filter(Boolean)
      .join("\\n");

    return [
      "BEGIN:VEVENT",
      `DTSTART;VALUE=DATE:${dtStart}`,
      `DTEND;VALUE=DATE:${dtEnd}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `UID:${v.id}@quaipulse`,
      "END:VEVENT",
    ].join("\r\n");
  });

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//QuaiPulse//Katie Visits//EN",
    "CALSCALE:GREGORIAN",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");

  downloadFile(ics, "katie-visits.ics", "text/calendar");
}

function incrementDate(dateStr: string): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

// ---- JSON Backup ----

export function exportFullBackup(data: {
  apartments: SavedApartment[];
  budgetValues: Record<string, number>;
  neighborhoods: ScoredNeighborhood[];
  completedChecklistIds: string[];
}) {
  const backup = {
    exportedAt: new Date().toISOString(),
    version: "0.1.0",
    ...data,
  };

  const json = JSON.stringify(backup, null, 2);
  downloadFile(json, "quaipulse-backup.json", "application/json");
}

// ---- Neighborhood Rankings CSV ----

export function exportRankingsCSV(neighborhoods: ScoredNeighborhood[]) {
  const headers = [
    "Rank",
    "Name",
    "Kreis",
    "Score",
    "Commute",
    "Gym",
    "Social",
    "Lake",
    "Airport",
    "Food",
    "Quiet",
    "Transit",
    "1BR Min",
    "1BR Max",
    "Vibe",
  ];

  const rows = neighborhoods.map((n) => [
    String(n.rank),
    n.name,
    String(n.kreis),
    n.weightedScore.toFixed(2),
    String(n.scores.commute),
    String(n.scores.gym),
    String(n.scores.social),
    String(n.scores.lake),
    String(n.scores.airport),
    String(n.scores.food),
    String(n.scores.quiet),
    String(n.scores.transit),
    String(n.rentOneBrMin),
    String(n.rentOneBrMax),
    `"${n.vibe}"`,
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  downloadFile(csv, "quaipulse-neighborhoods.csv", "text/csv");
}

// ---- Helper ----

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
