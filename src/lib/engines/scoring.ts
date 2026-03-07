import type { ScoreDimension, PriorityWeights } from "@/lib/types";
import type { NeighborhoodData } from "@/lib/data/neighborhoods";

export interface ScoredNeighborhood extends NeighborhoodData {
  weightedScore: number;
  rank: number;
  dimensionContributions: Record<ScoreDimension, number>;
}

const DIMENSIONS: ScoreDimension[] = [
  "commute",
  "gym",
  "social",
  "lake",
  "airport",
  "food",
  "quiet",
  "transit",
  "cost",
  "safety",
  "flightNoise",
  "parking",
];

/**
 * Weighted scoring: sum(score[i] * weight[i]) / sum(weight[i])
 * Returns 0-10 scale. Every number transparent and decomposable.
 */
export function calculateWeightedScore(
  scores: Record<ScoreDimension, number>,
  weights: PriorityWeights
): { total: number; contributions: Record<ScoreDimension, number> } {
  let weightedSum = 0;
  let weightTotal = 0;
  const contributions = {} as Record<ScoreDimension, number>;

  for (const dim of DIMENSIONS) {
    const w = weights[dim];
    const s = scores[dim];
    const contribution = s * w;
    contributions[dim] = contribution;
    weightedSum += contribution;
    weightTotal += w;
  }

  const total = weightTotal > 0 ? weightedSum / weightTotal : 0;
  return { total, contributions };
}

/**
 * Score and rank all neighborhoods based on current weights.
 * Returns sorted array (highest score first).
 */
export function rankNeighborhoods(
  neighborhoods: NeighborhoodData[],
  weights: PriorityWeights
): ScoredNeighborhood[] {
  const scored = neighborhoods.map((n) => {
    const { total, contributions } = calculateWeightedScore(n.scores, weights);
    return {
      ...n,
      weightedScore: Math.round(total * 100) / 100,
      rank: 0,
      dimensionContributions: contributions,
    };
  });

  scored.sort((a, b) => b.weightedScore - a.weightedScore);
  scored.forEach((n, i) => {
    n.rank = i + 1;
  });

  return scored;
}

/**
 * Get color class for a score value (1-10 scale).
 */
export function scoreColor(score: number): string {
  if (score >= 9) return "var(--score-10)";
  if (score >= 8) return "var(--score-9)";
  if (score >= 6.5) return "var(--score-7)";
  if (score >= 5) return "var(--score-5)";
  if (score >= 3) return "var(--score-3)";
  return "var(--score-1)";
}

/**
 * Get tailwind text color class for a score.
 */
export function scoreTextClass(score: number): string {
  if (score >= 9) return "text-emerald-400";
  if (score >= 8) return "text-green-400";
  if (score >= 6.5) return "text-lime-400";
  if (score >= 5) return "text-amber-400";
  if (score >= 3) return "text-orange-400";
  return "text-red-400";
}

/**
 * Format score for display — always 1 decimal.
 */
export function formatScore(score: number): string {
  return score.toFixed(1);
}
