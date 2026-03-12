/**
 * Rental Intelligence — pure analytics functions.
 * No side effects, no state. Takes UnifiedListing[] and returns data.
 */

import type { UnifiedListing, ListingSource } from "@/lib/types";
import { KREIS_COMMUTE, MONTHLY_NET } from "./listing-normalizer";

// ── Market Overview ──────────────────────────────────────────

export interface MarketOverview {
  totalListings: number;
  medianRent: number;
  medianPricePerSqm: number;
  budgetFitPercent: number;
  marketTemperature: "cold" | "cool" | "warm" | "hot";
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

export function computeMarketOverview(listings: UnifiedListing[]): MarketOverview {
  const rents = listings.map((l) => l.rent);
  const ppsm = listings
    .map((l) => l.pricePerSqm)
    .filter((p): p is number => p != null);

  const budgetFitCount = listings.filter(
    (l) => l.budgetFit === "comfortable" || l.budgetFit === "stretch"
  ).length;

  // Market temperature: based on price/m² vs Zurich average (~38 CHF/m²)
  const medPpsm = median(ppsm);
  const temperature: MarketOverview["marketTemperature"] =
    medPpsm <= 30 ? "cold" :
    medPpsm <= 38 ? "cool" :
    medPpsm <= 48 ? "warm" : "hot";

  return {
    totalListings: listings.length,
    medianRent: Math.round(median(rents)),
    medianPricePerSqm: Math.round(medPpsm),
    budgetFitPercent: listings.length > 0
      ? Math.round((budgetFitCount / listings.length) * 100)
      : 0,
    marketTemperature: temperature,
  };
}

// ── Price Distribution by Kreis ──────────────────────────────

export interface KreisDistribution {
  kreis: number;
  count: number;
  min: number;
  max: number;
  median: number;
  q1: number;
  q3: number;
  avg: number;
}

export function computePriceDistribution(
  listings: UnifiedListing[]
): KreisDistribution[] {
  const byKreis = new Map<number, number[]>();
  for (const l of listings) {
    if (l.kreis === 0) continue;
    const arr = byKreis.get(l.kreis) ?? [];
    arr.push(l.rent);
    byKreis.set(l.kreis, arr);
  }

  const result: KreisDistribution[] = [];
  for (const [kreis, rents] of byKreis.entries()) {
    result.push({
      kreis,
      count: rents.length,
      min: Math.min(...rents),
      max: Math.max(...rents),
      median: Math.round(median(rents)),
      q1: Math.round(percentile(rents, 25)),
      q3: Math.round(percentile(rents, 75)),
      avg: Math.round(rents.reduce((a, b) => a + b, 0) / rents.length),
    });
  }

  return result.sort((a, b) => a.kreis - b.kreis);
}

// ── Price per m² Heatmap ─────────────────────────────────────

export interface KreisPricePerSqm {
  kreis: number;
  medianPricePerSqm: number;
  count: number;
  tier: "budget" | "mid" | "premium" | "luxury";
}

export function computePricePerSqmByKreis(
  listings: UnifiedListing[]
): KreisPricePerSqm[] {
  const byKreis = new Map<number, number[]>();
  for (const l of listings) {
    if (l.kreis === 0 || l.pricePerSqm == null) continue;
    const arr = byKreis.get(l.kreis) ?? [];
    arr.push(l.pricePerSqm);
    byKreis.set(l.kreis, arr);
  }

  const result: KreisPricePerSqm[] = [];
  for (const [kreis, prices] of byKreis.entries()) {
    const med = Math.round(median(prices));
    const tier: KreisPricePerSqm["tier"] =
      med <= 30 ? "budget" :
      med <= 40 ? "mid" :
      med <= 55 ? "premium" : "luxury";

    result.push({
      kreis,
      medianPricePerSqm: med,
      count: prices.length,
      tier,
    });
  }

  return result.sort((a, b) => a.kreis - b.kreis);
}

// ── Budget Fit Analysis ──────────────────────────────────────

export interface BudgetAnalysis {
  totalIncome: number;
  comfortableCount: number;
  stretchCount: number;
  overCount: number;
  comfortablePercent: number;
  stretchPercent: number;
  overPercent: number;
  // Vienna comparison
  viennaCosts: number;
  zurichMedianRent: number;
  rentToIncomeRatio: number;
}

export function computeBudgetFit(listings: UnifiedListing[]): BudgetAnalysis {
  const comfortable = listings.filter((l) => l.budgetFit === "comfortable").length;
  const stretch = listings.filter((l) => l.budgetFit === "stretch").length;
  const over = listings.filter((l) => l.budgetFit === "over").length;
  const total = listings.length || 1;

  const medRent = median(listings.map((l) => l.rent));

  return {
    totalIncome: MONTHLY_NET,
    comfortableCount: comfortable,
    stretchCount: stretch,
    overCount: over,
    comfortablePercent: Math.round((comfortable / total) * 100),
    stretchPercent: Math.round((stretch / total) * 100),
    overPercent: Math.round((over / total) * 100),
    viennaCosts: 2760,
    zurichMedianRent: Math.round(medRent),
    rentToIncomeRatio: Math.round((medRent / MONTHLY_NET) * 100),
  };
}

// ── Supply by Kreis ──────────────────────────────────────────

export interface KreisSupply {
  kreis: number;
  count: number;
  competitionLevel: "low" | "medium" | "high";
  commuteMinutes: number;
}

export function computeSupplyByKreis(listings: UnifiedListing[]): KreisSupply[] {
  const counts = new Map<number, number>();
  for (const l of listings) {
    if (l.kreis === 0) continue;
    counts.set(l.kreis, (counts.get(l.kreis) ?? 0) + 1);
  }

  const avgCount = counts.size > 0
    ? [...counts.values()].reduce((a, b) => a + b, 0) / counts.size
    : 0;

  const result: KreisSupply[] = [];
  for (const [kreis, count] of counts.entries()) {
    const competitionLevel: KreisSupply["competitionLevel"] =
      count >= avgCount * 1.5 ? "high" :
      count >= avgCount * 0.5 ? "medium" : "low";

    result.push({
      kreis,
      count,
      competitionLevel,
      commuteMinutes: KREIS_COMMUTE[kreis] ?? 0,
    });
  }

  return result.sort((a, b) => a.kreis - b.kreis);
}

// ── Source Comparison ────────────────────────────────────────

export interface SourceStats {
  source: ListingSource;
  count: number;
  medianRent: number;
  medianPricePerSqm: number;
  avgRooms: number;
  avgSqm: number;
}

export function computeSourceComparison(
  listings: UnifiedListing[]
): SourceStats[] {
  const sources: ListingSource[] = ["flatfox", "homegate"];
  return sources.map((source) => {
    const subset = listings.filter((l) => l.source === source);
    const rents = subset.map((l) => l.rent);
    const ppsm = subset
      .map((l) => l.pricePerSqm)
      .filter((p): p is number => p != null);
    const rooms = subset
      .map((l) => l.rooms)
      .filter((r): r is number => r != null);
    const sqms = subset
      .map((l) => l.sqm)
      .filter((s): s is number => s != null);

    return {
      source,
      count: subset.length,
      medianRent: Math.round(median(rents)),
      medianPricePerSqm: Math.round(median(ppsm)),
      avgRooms: rooms.length > 0
        ? Math.round((rooms.reduce((a, b) => a + b, 0) / rooms.length) * 10) / 10
        : 0,
      avgSqm: sqms.length > 0
        ? Math.round(sqms.reduce((a, b) => a + b, 0) / sqms.length)
        : 0,
    };
  });
}

// ── Top Picks ────────────────────────────────────────────────

export function computeTopPicks(
  listings: UnifiedListing[],
  limit = 20
): UnifiedListing[] {
  return [...listings]
    .filter((l) => l.budgetFit !== "over" && l.kreis > 0)
    .sort((a, b) => b.valueScore - a.valueScore)
    .slice(0, limit);
}
