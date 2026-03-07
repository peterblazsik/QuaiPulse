import type { SleepEntry } from "@/lib/stores/sleep-store";
import { SUPPLEMENTS, INTERVENTIONS, SUPPLEMENT_STACKS, type Supplement, type SleepIntervention } from "@/lib/data/sleep-defaults";

// ── Tonight's Protocol Engine ─────────────────────────────────────────────────

export interface ProtocolItem {
  type: "supplement" | "intervention";
  id: string;
  name: string;
  color: string;
  timing: string;
  avgQuality: number;      // avg quality when used
  delta: number;            // vs baseline
  count: number;            // times used
  tier?: number;            // supplement tier
  evidence?: string;        // supplement evidence level
  reason: string;           // why recommended
}

export interface TonightProtocol {
  supplements: ProtocolItem[];
  interventions: ProtocolItem[];
  predictedQuality: number;
  closestStack: string | null;  // ID of closest matching predefined stack
  totalItems: number;
}

export interface TopPerformer {
  type: "supplement" | "intervention";
  id: string;
  name: string;
  color: string;
  avgQuality: number;
  delta: number;
  count: number;
  hitRate: number;   // % of nights with quality >= 4
  tier?: number;
}

// ── Generate tonight's optimal protocol ───────────────────────────────────────
export function generateTonightProtocol(entries: SleepEntry[], maxSupplements = 6, maxInterventions = 4): TonightProtocol {
  if (entries.length < 3) {
    return { supplements: [], interventions: [], predictedQuality: 0, closestStack: "beginner", totalItems: 0 };
  }

  const baseline = entries.reduce((s, e) => s + e.quality, 0) / entries.length;

  // Score supplements
  const supScores: ProtocolItem[] = [];
  for (const sup of SUPPLEMENTS) {
    const withSup = entries.filter((e) => e.supplements.includes(sup.id));
    const withoutSup = entries.filter((e) => !e.supplements.includes(sup.id));
    if (withSup.length < 2) continue;

    const avgWith = withSup.reduce((s, e) => s + e.quality, 0) / withSup.length;
    const avgWithout = withoutSup.length > 0 ? withoutSup.reduce((s, e) => s + e.quality, 0) / withoutSup.length : baseline;
    const delta = avgWith - avgWithout;

    if (delta < 0) continue; // don't recommend negatives

    supScores.push({
      type: "supplement",
      id: sup.id,
      name: sup.name,
      color: sup.color,
      timing: sup.timing,
      avgQuality: avgWith,
      delta,
      count: withSup.length,
      tier: sup.tier,
      reason: delta >= 0.5
        ? `Boosts quality by ${delta.toFixed(1)} pts across ${withSup.length} nights`
        : `Consistent positive trend (${withSup.length} nights)`,
    });
  }

  // Score interventions
  const intvScores: ProtocolItem[] = [];
  for (const intv of INTERVENTIONS) {
    const withInt = entries.filter((e) => (e.interventions ?? []).includes(intv.id));
    const withoutInt = entries.filter((e) => !(e.interventions ?? []).includes(intv.id));
    if (withInt.length < 2) continue;

    const avgWith = withInt.reduce((s, e) => s + e.quality, 0) / withInt.length;
    const avgWithout = withoutInt.length > 0 ? withoutInt.reduce((s, e) => s + e.quality, 0) / withoutInt.length : baseline;
    const delta = avgWith - avgWithout;

    if (delta < 0) continue;

    intvScores.push({
      type: "intervention",
      id: intv.id,
      name: intv.name,
      color: "#3b82f6",
      timing: intv.timing,
      avgQuality: avgWith,
      delta,
      count: withInt.length,
      evidence: intv.evidenceLevel,
      reason: delta >= 0.5
        ? `+${delta.toFixed(1)} quality impact (${withInt.length} sessions)`
        : `Positive trend, ${intv.evidenceLevel} evidence`,
    });
  }

  // Sort by delta * log(count) for balanced ranking
  const weightedSort = (a: ProtocolItem, b: ProtocolItem) =>
    (b.delta * Math.log2(b.count + 1)) - (a.delta * Math.log2(a.count + 1));

  supScores.sort(weightedSort);
  intvScores.sort(weightedSort);

  const selectedSups = supScores.slice(0, maxSupplements);
  const selectedIntvs = intvScores.slice(0, maxInterventions);

  // Predict quality based on selected items
  const selectedIds = new Set([...selectedSups.map((s) => s.id), ...selectedIntvs.map((i) => i.id)]);
  const matchingEntries = entries.filter((e) => {
    const eItems = [...e.supplements, ...(e.interventions ?? [])];
    const overlap = eItems.filter((id) => selectedIds.has(id)).length;
    return overlap >= Math.floor(selectedIds.size * 0.6); // 60%+ overlap
  });
  const predictedQuality = matchingEntries.length >= 2
    ? matchingEntries.reduce((s, e) => s + e.quality, 0) / matchingEntries.length
    : baseline + selectedSups.slice(0, 3).reduce((s, item) => s + item.delta * 0.5, 0);

  // Match closest stack
  let closestStack: string | null = null;
  let bestOverlap = 0;
  for (const stack of SUPPLEMENT_STACKS) {
    const stackSupIds = new Set(stack.supplements.map((s) => s.supplementId));
    const overlap = selectedSups.filter((s) => stackSupIds.has(s.id)).length;
    const score = overlap / Math.max(stackSupIds.size, selectedSups.length);
    if (score > bestOverlap) {
      bestOverlap = score;
      closestStack = stack.id;
    }
  }

  return {
    supplements: selectedSups,
    interventions: selectedIntvs,
    predictedQuality: Math.min(5, Math.max(1, predictedQuality)),
    closestStack: bestOverlap >= 0.4 ? closestStack : null,
    totalItems: selectedSups.length + selectedIntvs.length,
  };
}

// ── Top performers (ranked watchlist) ─────────────────────────────────────────
export function getTopPerformers(entries: SleepEntry[], limit = 8): TopPerformer[] {
  if (entries.length < 3) return [];

  const baseline = entries.reduce((s, e) => s + e.quality, 0) / entries.length;
  const performers: TopPerformer[] = [];

  // Supplements
  for (const sup of SUPPLEMENTS) {
    const withSup = entries.filter((e) => e.supplements.includes(sup.id));
    if (withSup.length < 2) continue;

    const avgWith = withSup.reduce((s, e) => s + e.quality, 0) / withSup.length;
    const delta = avgWith - baseline;
    const goodNights = withSup.filter((e) => e.quality >= 4).length;

    performers.push({
      type: "supplement",
      id: sup.id,
      name: sup.name,
      color: sup.color,
      avgQuality: avgWith,
      delta,
      count: withSup.length,
      hitRate: goodNights / withSup.length,
      tier: sup.tier,
    });
  }

  // Interventions
  for (const intv of INTERVENTIONS) {
    const withInt = entries.filter((e) => (e.interventions ?? []).includes(intv.id));
    if (withInt.length < 2) continue;

    const avgWith = withInt.reduce((s, e) => s + e.quality, 0) / withInt.length;
    const delta = avgWith - baseline;
    const goodNights = withInt.filter((e) => e.quality >= 4).length;

    performers.push({
      type: "intervention",
      id: intv.id,
      name: intv.name,
      color: "#3b82f6",
      avgQuality: avgWith,
      delta,
      count: withInt.length,
      hitRate: goodNights / withInt.length,
    });
  }

  // Sort by delta
  performers.sort((a, b) => b.delta - a.delta);
  return performers.slice(0, limit);
}
