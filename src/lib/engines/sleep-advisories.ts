import type { SleepEntry } from "@/lib/stores/sleep-store";
import { SUPPLEMENTS, INTERVENTIONS, LOCATIONS } from "@/lib/data/sleep-defaults";

// ── Signal types ──────────────────────────────────────────────────────────────
export type SignalType = "STRONG_BUY" | "BUY" | "HOLD" | "SELL" | "PATTERN" | "INSIGHT";
export type SignalCategory = "supplement" | "intervention" | "location" | "behavior" | "combo";

export interface Advisory {
  id: string;
  signal: SignalType;
  category: SignalCategory;
  title: string;
  body: string;
  metric: string;       // e.g. "+0.8 quality" or "-12 min latency"
  confidence: number;   // 0-1 based on sample size
  itemId?: string;      // supplement/intervention ID for linking
}

const MIN_SAMPLES = 2;
const STRONG_BUY_THRESHOLD = 0.8;
const BUY_THRESHOLD = 0.3;
const SELL_THRESHOLD = -0.3;

function confidence(n: number): number {
  if (n < 2) return 0;
  if (n >= 10) return 1;
  return 0.3 + (n - 2) * (0.7 / 8); // linear 0.3 → 1.0 from 2 → 10 samples
}

// ── Main generator ────────────────────────────────────────────────────────────
export function generateAdvisories(entries: SleepEntry[]): Advisory[] {
  if (entries.length < 3) return [];

  const advisories: Advisory[] = [];

  // Supplement advisories
  advisories.push(...generateSupplementAdvisories(entries));

  // Intervention advisories
  advisories.push(...generateInterventionAdvisories(entries));

  // Location pattern advisories
  advisories.push(...generateLocationAdvisories(entries));

  // Behavioral pattern advisories
  advisories.push(...generateBehaviorAdvisories(entries));

  // Combo advisories (supplement + intervention synergy)
  advisories.push(...generateComboAdvisories(entries));

  // Sort: STRONG_BUY first, then BUY, SELL, PATTERN, HOLD, INSIGHT
  const signalOrder: Record<SignalType, number> = {
    STRONG_BUY: 0, BUY: 1, SELL: 2, PATTERN: 3, HOLD: 4, INSIGHT: 5,
  };
  advisories.sort((a, b) => signalOrder[a.signal] - signalOrder[b.signal]);

  return advisories;
}

// ── Supplement signals ────────────────────────────────────────────────────────
function generateSupplementAdvisories(entries: SleepEntry[]): Advisory[] {
  const results: Advisory[] = [];

  for (const sup of SUPPLEMENTS) {
    const withSup = entries.filter((e) => e.supplements.includes(sup.id));
    const withoutSup = entries.filter((e) => !e.supplements.includes(sup.id));

    if (withSup.length < MIN_SAMPLES || withoutSup.length < MIN_SAMPLES) continue;

    const avgWith = withSup.reduce((s, e) => s + e.quality, 0) / withSup.length;
    const avgWithout = withoutSup.reduce((s, e) => s + e.quality, 0) / withoutSup.length;
    const delta = avgWith - avgWithout;
    const conf = confidence(withSup.length);

    // Latency impact
    const withLatency = withSup.filter((e) => e.sleepLatency != null);
    const withoutLatency = withoutSup.filter((e) => e.sleepLatency != null);
    let latencyDelta = 0;
    if (withLatency.length >= 2 && withoutLatency.length >= 2) {
      const avgLatWith = withLatency.reduce((s, e) => s + (e.sleepLatency ?? 0), 0) / withLatency.length;
      const avgLatWithout = withoutLatency.reduce((s, e) => s + (e.sleepLatency ?? 0), 0) / withoutLatency.length;
      latencyDelta = avgLatWith - avgLatWithout;
    }

    let signal: SignalType;
    if (delta >= STRONG_BUY_THRESHOLD && withSup.length >= 4) {
      signal = "STRONG_BUY";
    } else if (delta >= BUY_THRESHOLD) {
      signal = "BUY";
    } else if (delta <= SELL_THRESHOLD) {
      signal = "SELL";
    } else {
      signal = "HOLD";
    }

    const metricParts: string[] = [];
    if (Math.abs(delta) >= 0.1) metricParts.push(`${delta > 0 ? "+" : ""}${delta.toFixed(1)} quality`);
    if (Math.abs(latencyDelta) >= 2) metricParts.push(`${latencyDelta > 0 ? "+" : ""}${Math.round(latencyDelta)} min latency`);

    results.push({
      id: `sup-${sup.id}`,
      signal,
      category: "supplement",
      title: sup.name,
      body: signal === "STRONG_BUY"
        ? `Consistently improves your sleep. ${withSup.length} nights tracked, quality jumps ${delta.toFixed(1)} points.`
        : signal === "BUY"
          ? `Positive correlation with better sleep. Worth continuing.`
          : signal === "SELL"
            ? `Your sleep is actually worse on nights you take this. Consider dropping.`
            : `No significant impact detected yet. Keep tracking.`,
      metric: metricParts.join(" · ") || `${delta > 0 ? "+" : ""}${delta.toFixed(2)} quality`,
      confidence: conf,
      itemId: sup.id,
    });
  }

  return results;
}

// ── Intervention signals ──────────────────────────────────────────────────────
function generateInterventionAdvisories(entries: SleepEntry[]): Advisory[] {
  const results: Advisory[] = [];

  for (const intv of INTERVENTIONS) {
    const withInt = entries.filter((e) => (e.interventions ?? []).includes(intv.id));
    const withoutInt = entries.filter((e) => !(e.interventions ?? []).includes(intv.id));

    if (withInt.length < MIN_SAMPLES || withoutInt.length < MIN_SAMPLES) continue;

    const avgWith = withInt.reduce((s, e) => s + e.quality, 0) / withInt.length;
    const avgWithout = withoutInt.reduce((s, e) => s + e.quality, 0) / withoutInt.length;
    const delta = avgWith - avgWithout;
    const conf = confidence(withInt.length);

    let signal: SignalType;
    if (delta >= STRONG_BUY_THRESHOLD && withInt.length >= 4) signal = "STRONG_BUY";
    else if (delta >= BUY_THRESHOLD) signal = "BUY";
    else if (delta <= SELL_THRESHOLD) signal = "SELL";
    else signal = "HOLD";

    results.push({
      id: `intv-${intv.id}`,
      signal,
      category: "intervention",
      title: intv.name,
      body: signal === "STRONG_BUY"
        ? `Strong positive impact. ${withInt.length} sessions tracked.`
        : signal === "BUY"
          ? `Positive trend — your sleep improves when you do this.`
          : signal === "SELL"
            ? `Correlates with worse sleep. May need timing adjustment.`
            : `Neutral impact so far. More data needed.`,
      metric: `${delta > 0 ? "+" : ""}${delta.toFixed(1)} quality`,
      confidence: conf,
      itemId: intv.id,
    });
  }

  return results;
}

// ── Location patterns ─────────────────────────────────────────────────────────
function generateLocationAdvisories(entries: SleepEntry[]): Advisory[] {
  const results: Advisory[] = [];
  const byLoc: Record<string, { sum: number; count: number; latencySum: number; latencyCount: number }> = {};

  for (const e of entries) {
    if (!byLoc[e.location]) byLoc[e.location] = { sum: 0, count: 0, latencySum: 0, latencyCount: 0 };
    byLoc[e.location].sum += e.quality;
    byLoc[e.location].count++;
    if (e.sleepLatency != null) {
      byLoc[e.location].latencySum += e.sleepLatency;
      byLoc[e.location].latencyCount++;
    }
  }

  const locs = Object.entries(byLoc).filter(([, v]) => v.count >= 2);
  if (locs.length < 2) return results;

  const avgs = locs.map(([loc, v]) => ({ loc, avg: v.sum / v.count, count: v.count }));
  avgs.sort((a, b) => b.avg - a.avg);

  const best = avgs[0];
  const worst = avgs[avgs.length - 1];

  if (best.avg - worst.avg >= 0.5) {
    const bestLabel = LOCATIONS.find((l) => l.value === best.loc)?.label ?? best.loc;
    const worstLabel = LOCATIONS.find((l) => l.value === worst.loc)?.label ?? worst.loc;

    results.push({
      id: "loc-pattern",
      signal: "PATTERN",
      category: "location",
      title: `${bestLabel} sleep is ${(best.avg - worst.avg).toFixed(1)} pts better`,
      body: `You sleep significantly better in ${bestLabel} (${best.avg.toFixed(1)}/5) than ${worstLabel} (${worst.avg.toFixed(1)}/5). Consider travel protocols.`,
      metric: `Δ${(best.avg - worst.avg).toFixed(1)} quality`,
      confidence: confidence(Math.min(best.count, worst.count)),
    });
  }

  return results;
}

// ── Behavioral patterns ───────────────────────────────────────────────────────
function generateBehaviorAdvisories(entries: SleepEntry[]): Advisory[] {
  const results: Advisory[] = [];
  const withBedtime = entries.filter((e) => e.bedtime);

  if (withBedtime.length < 5) return results;

  // Early bedtime vs late bedtime
  const bedtimeMinutes = withBedtime.map((e) => {
    const [h, m] = e.bedtime!.split(":").map(Number);
    return h < 12 ? (h + 24) * 60 + m : h * 60 + m;
  });
  const medianBedtime = bedtimeMinutes.sort((a, b) => a - b)[Math.floor(bedtimeMinutes.length / 2)];

  const early = withBedtime.filter((e) => {
    const [h, m] = e.bedtime!.split(":").map(Number);
    const mins = h < 12 ? (h + 24) * 60 + m : h * 60 + m;
    return mins <= medianBedtime;
  });
  const late = withBedtime.filter((e) => {
    const [h, m] = e.bedtime!.split(":").map(Number);
    const mins = h < 12 ? (h + 24) * 60 + m : h * 60 + m;
    return mins > medianBedtime;
  });

  if (early.length >= 3 && late.length >= 3) {
    const earlyQ = early.reduce((s, e) => s + e.quality, 0) / early.length;
    const lateQ = late.reduce((s, e) => s + e.quality, 0) / late.length;
    const delta = earlyQ - lateQ;

    if (Math.abs(delta) >= 0.3) {
      const medianH = Math.floor(medianBedtime / 60) % 24;
      const medianM = medianBedtime % 60;
      const timeStr = `${medianH.toString().padStart(2, "0")}:${medianM.toString().padStart(2, "0")}`;

      results.push({
        id: "behavior-bedtime",
        signal: "INSIGHT",
        category: "behavior",
        title: delta > 0 ? `Earlier bedtimes = better sleep` : `Later bedtimes work better for you`,
        body: delta > 0
          ? `Nights before ${timeStr}: quality ${earlyQ.toFixed(1)}/5. After: ${lateQ.toFixed(1)}/5.`
          : `Nights after ${timeStr}: quality ${lateQ.toFixed(1)}/5. Before: ${earlyQ.toFixed(1)}/5.`,
        metric: `${delta > 0 ? "+" : ""}${delta.toFixed(1)} quality`,
        confidence: confidence(Math.min(early.length, late.length)),
      });
    }
  }

  return results;
}

// ── Combo advisories (supplement + intervention synergy) ──────────────────────
function generateComboAdvisories(entries: SleepEntry[]): Advisory[] {
  const results: Advisory[] = [];

  // Find the top supplement+intervention combos
  const comboMap = new Map<string, { sum: number; count: number }>();
  const baseline = entries.reduce((s, e) => s + e.quality, 0) / entries.length;

  for (const e of entries) {
    const interventions = e.interventions ?? [];
    for (const supId of e.supplements) {
      for (const intvId of interventions) {
        const key = `${supId}||${intvId}`;
        const existing = comboMap.get(key) ?? { sum: 0, count: 0 };
        existing.sum += e.quality;
        existing.count++;
        comboMap.set(key, existing);
      }
    }
  }

  for (const [key, data] of comboMap) {
    if (data.count < 3) continue;
    const avg = data.sum / data.count;
    const delta = avg - baseline;
    if (delta < 0.5) continue;

    const [supId, intvId] = key.split("||");
    const supName = SUPPLEMENTS.find((s) => s.id === supId)?.name ?? supId;
    const intvName = INTERVENTIONS.find((i) => i.id === intvId)?.name ?? intvId;

    results.push({
      id: `combo-${supId}-${intvId}`,
      signal: delta >= 1.0 ? "STRONG_BUY" : "BUY",
      category: "combo",
      title: `${supName} + ${intvName}`,
      body: `This combo averages ${avg.toFixed(1)}/5 quality across ${data.count} nights — ${delta.toFixed(1)} pts above your baseline.`,
      metric: `+${delta.toFixed(1)} vs baseline`,
      confidence: confidence(data.count),
    });
  }

  return results;
}

// ── Signal display helpers ────────────────────────────────────────────────────
export function getSignalColor(signal: SignalType): string {
  switch (signal) {
    case "STRONG_BUY": return "#22c55e";
    case "BUY": return "#3b82f6";
    case "HOLD": return "#64748b";
    case "SELL": return "#ef4444";
    case "PATTERN": return "#a855f7";
    case "INSIGHT": return "#f59e0b";
  }
}

export function getSignalLabel(signal: SignalType): string {
  switch (signal) {
    case "STRONG_BUY": return "STRONG BUY";
    case "BUY": return "BUY";
    case "HOLD": return "HOLD";
    case "SELL": return "SELL";
    case "PATTERN": return "PATTERN";
    case "INSIGHT": return "INSIGHT";
  }
}
