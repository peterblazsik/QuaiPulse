import type { SleepEntry } from "@/lib/stores/sleep-store";
import { SUPPLEMENTS, INTERVENTIONS } from "@/lib/data/sleep-defaults";

// ── Combo matrix: supplement × intervention quality heatmap ───────────────────

export interface ComboCell {
  supplementId: string;
  supplementName: string;
  interventionId: string;
  interventionName: string;
  avgQuality: number;
  avgLatency: number | null;
  avgAwakenings: number | null;
  count: number;
}

export interface ComboMatrix {
  cells: ComboCell[];
  supplementIds: string[];    // rows (only ones with data)
  interventionIds: string[];  // cols (only ones with data)
  baseline: number;           // overall avg quality
}

export function computeComboMatrix(entries: SleepEntry[]): ComboMatrix {
  if (entries.length === 0) {
    return { cells: [], supplementIds: [], interventionIds: [], baseline: 0 };
  }

  const baseline = entries.reduce((s, e) => s + e.quality, 0) / entries.length;
  const map = new Map<string, { qualitySum: number; latencySum: number; latencyCount: number; awakSum: number; awakCount: number; count: number }>();

  const usedSups = new Set<string>();
  const usedIntvs = new Set<string>();

  for (const e of entries) {
    const interventions = e.interventions ?? [];
    for (const supId of e.supplements) {
      for (const intvId of interventions) {
        const key = `${supId}||${intvId}`;
        const existing = map.get(key) ?? { qualitySum: 0, latencySum: 0, latencyCount: 0, awakSum: 0, awakCount: 0, count: 0 };
        existing.qualitySum += e.quality;
        existing.count++;
        if (e.sleepLatency != null) {
          existing.latencySum += e.sleepLatency;
          existing.latencyCount++;
        }
        if (e.awakenings != null) {
          existing.awakSum += e.awakenings;
          existing.awakCount++;
        }
        map.set(key, existing);
        usedSups.add(supId);
        usedIntvs.add(intvId);
      }
    }
  }

  const cells: ComboCell[] = [];
  for (const [key, data] of map) {
    if (data.count < 2) continue; // need at least 2 data points
    const [supId, intvId] = key.split("||");
    cells.push({
      supplementId: supId,
      supplementName: SUPPLEMENTS.find((s) => s.id === supId)?.name ?? supId,
      interventionId: intvId,
      interventionName: INTERVENTIONS.find((i) => i.id === intvId)?.name ?? intvId,
      avgQuality: data.qualitySum / data.count,
      avgLatency: data.latencyCount > 0 ? data.latencySum / data.latencyCount : null,
      avgAwakenings: data.awakCount > 0 ? data.awakSum / data.awakCount : null,
      count: data.count,
    });
  }

  // Only include supplements/interventions that appear in the matrix
  const supplementIds = SUPPLEMENTS.filter((s) => usedSups.has(s.id) && cells.some((c) => c.supplementId === s.id)).map((s) => s.id);
  const interventionIds = INTERVENTIONS.filter((i) => usedIntvs.has(i.id) && cells.some((c) => c.interventionId === i.id)).map((i) => i.id);

  return { cells, supplementIds, interventionIds, baseline };
}

// ── Helper: get cell color based on quality delta from baseline ────────────────
export function getComboCellColor(avgQuality: number, baseline: number): string {
  const delta = avgQuality - baseline;
  if (delta >= 1.0) return "#22c55e";   // strong positive
  if (delta >= 0.5) return "#3b82f6";   // positive
  if (delta >= 0) return "#1e3a5f";     // neutral-positive
  if (delta >= -0.5) return "#4a2c2a";  // neutral-negative
  return "#ef4444";                      // negative
}

export function getComboCellOpacity(count: number): number {
  if (count >= 6) return 1;
  if (count >= 4) return 0.85;
  if (count >= 2) return 0.6;
  return 0.35;
}
