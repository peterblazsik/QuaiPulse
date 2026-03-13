/**
 * Normalizes Flatfox + Homegate listings into a unified format.
 * Handles deduplication by (zipcode, rooms, sqm, rent within 5%).
 */

import type { UnifiedListing, ListingSource, ValueScoreBreakdown } from "@/lib/types";
import type { ScrapedApartment } from "@/lib/engines/flatfox-scraper";
import { extractKreis } from "@/lib/engines/flatfox-scraper";

// Raw Homegate JSON shape from the XLSX export
export interface HomegateRaw {
  id: string;
  url: string;
  title: string;
  price: number;
  address: string;
  rooms: number | null;
  sqm: number | null;
  propertyType: string;
  description: string;
  timestamp: string;
  zipcode: number;
  isPremium: boolean;
}

// Kreis desirability for Peter (commute to Mythenquai, gym, social, lake)
const KREIS_DESIRABILITY: Record<number, number> = {
  1: 70, 2: 95, 3: 85, 4: 80, 5: 75,
  6: 65, 7: 60, 8: 75, 9: 50, 10: 55,
  11: 45, 12: 40,
};

// Rough commute minutes to Mythenquai (Kreis 2) by transit
const KREIS_COMMUTE: Record<number, number> = {
  1: 10, 2: 5, 3: 12, 4: 15, 5: 18,
  6: 20, 7: 22, 8: 12, 9: 25, 10: 28,
  11: 30, 12: 35,
};

const MONTHLY_NET = 12150;
const BUDGET_COMFORT_MAX = 2500; // ~20% of net
const BUDGET_STRETCH_MAX = 3000; // ~25% of net

function computeBudgetFitCategory(rent: number): UnifiedListing["budgetFit"] {
  if (rent <= BUDGET_COMFORT_MAX) return "comfortable";
  if (rent <= BUDGET_STRETCH_MAX) return "stretch";
  return "over";
}

export function normalizeFlatfox(apt: ScrapedApartment): UnifiedListing {
  const rent = apt.rentDisplay;
  const pricePerSqm = apt.sqm && apt.sqm > 0 ? Math.round(rent / apt.sqm) : null;

  return {
    id: apt.id,
    source: "flatfox",
    sourceUrl: apt.sourceUrl,
    title: apt.title,
    address: apt.address,
    zipcode: apt.zipcode,
    kreis: apt.kreis,
    rent,
    rooms: apt.rooms,
    sqm: apt.sqm,
    pricePerSqm,
    floor: apt.floor,
    description: null,
    imageUrl: apt.imageUrl,
    latitude: apt.latitude,
    longitude: apt.longitude,
    availableDate: apt.availableDate,
    attributes: apt.attributes,
    isFurnished: apt.isFurnished,
    isPremium: false,
    publishedAt: apt.publishedAt,
    valueScore: 0, // computed later
    valueScoreBreakdown: null, // computed later
    budgetFit: computeBudgetFitCategory(rent),
    commuteEstimate: KREIS_COMMUTE[apt.kreis] ?? null,
  };
}

export function normalizeHomegate(raw: HomegateRaw): UnifiedListing {
  const kreis = extractKreis(raw.zipcode);
  const pricePerSqm = raw.sqm && raw.sqm > 0 ? Math.round(raw.price / raw.sqm) : null;

  return {
    id: `hg-${raw.id}`,
    source: "homegate",
    sourceUrl: raw.url,
    title: raw.title,
    address: raw.address,
    zipcode: raw.zipcode,
    kreis,
    rent: raw.price,
    rooms: raw.rooms,
    sqm: raw.sqm,
    pricePerSqm,
    floor: null,
    description: raw.description,
    imageUrl: null,
    latitude: null,
    longitude: null,
    availableDate: null,
    attributes: [],
    isFurnished: false,
    isPremium: raw.isPremium,
    publishedAt: raw.timestamp,
    valueScore: 0,
    valueScoreBreakdown: null,
    budgetFit: computeBudgetFitCategory(raw.price),
    commuteEstimate: KREIS_COMMUTE[kreis] ?? null,
  };
}

/**
 * Dedup: two listings match if same zipcode, same rooms, same sqm (±5m²),
 * and rent within 5%. Keep the one with more data (Flatfox > Homegate).
 */
function isDuplicate(a: UnifiedListing, b: UnifiedListing): boolean {
  if (a.zipcode !== b.zipcode) return false;
  if (a.rooms !== b.rooms) return false;
  if (a.sqm == null || b.sqm == null) return false;
  if (Math.abs(a.sqm - b.sqm) > 5) return false;
  const rentDiff = Math.abs(a.rent - b.rent) / Math.max(a.rent, b.rent);
  return rentDiff < 0.05;
}

/**
 * Compute value score (0-100) based on weighted composite.
 * Returns both the final score and a breakdown of each dimension.
 */
export function computeValueScore(
  listing: UnifiedListing,
  medianPricePerSqm: number
): { score: number; breakdown: ValueScoreBreakdown } {
  let score = 50; // base

  // Price/m² vs median (30% weight) — lower is better
  let priceScore = 50;
  if (listing.pricePerSqm && medianPricePerSqm > 0) {
    const ratio = listing.pricePerSqm / medianPricePerSqm;
    priceScore = Math.max(0, Math.min(100, (2 - ratio) * 50));
    score = score * 0.7 + priceScore * 0.3;
  }

  // Kreis desirability (20% weight)
  const kreisScore = KREIS_DESIRABILITY[listing.kreis] ?? 30;
  score = score * 0.8 + kreisScore * 0.2;

  // Commute (20% weight) — shorter is better
  let commuteScore = 50;
  if (listing.commuteEstimate != null) {
    commuteScore = Math.max(0, 100 - listing.commuteEstimate * 3);
    score = score * 0.8 + commuteScore * 0.2;
  }

  // Room fit (15% weight) — 2-3 rooms ideal
  let roomScore = 50;
  if (listing.rooms != null) {
    roomScore =
      listing.rooms >= 2 && listing.rooms <= 3
        ? 100
        : listing.rooms >= 1.5 && listing.rooms <= 3.5
          ? 70
          : 30;
    score = score * 0.85 + roomScore * 0.15;
  }

  // Budget fit (15% weight)
  const budgetScore =
    listing.budgetFit === "comfortable" ? 100 :
    listing.budgetFit === "stretch" ? 60 : 20;
  score = score * 0.85 + budgetScore * 0.15;

  const finalScore = Math.round(Math.max(0, Math.min(100, score)));

  return {
    score: finalScore,
    breakdown: {
      priceScore: Math.round(priceScore),
      kreisScore,
      commuteScore: Math.round(commuteScore),
      roomScore,
      budgetScore,
      priceWeight: 0.30,
      kreisWeight: 0.20,
      commuteWeight: 0.20,
      roomWeight: 0.15,
      budgetWeight: 0.15,
      medianPricePerSqm,
    },
  };
}

/**
 * Merge, deduplicate, and score all listings.
 */
export function mergeListings(
  flatfox: ScrapedApartment[],
  homegate: HomegateRaw[]
): UnifiedListing[] {
  const ffNormalized = flatfox.map(normalizeFlatfox);
  const hgNormalized = homegate
    .filter((h) => h.price > 0)
    .map(normalizeHomegate);

  // Merge: start with Flatfox (richer data), add non-duplicate Homegate
  const merged = [...ffNormalized];
  for (const hg of hgNormalized) {
    const isDup = merged.some((existing) => isDuplicate(existing, hg));
    if (!isDup) merged.push(hg);
  }

  // Compute median price/m² for scoring
  const pricesPerSqm = merged
    .map((l) => l.pricePerSqm)
    .filter((p): p is number => p != null && p > 0);
  pricesPerSqm.sort((a, b) => a - b);
  const medianPricePerSqm =
    pricesPerSqm.length > 0
      ? pricesPerSqm[Math.floor(pricesPerSqm.length / 2)]
      : 40; // fallback

  // Score each listing
  for (const listing of merged) {
    const { score, breakdown } = computeValueScore(listing, medianPricePerSqm);
    listing.valueScore = score;
    listing.valueScoreBreakdown = breakdown;
  }

  return merged;
}

export { KREIS_DESIRABILITY, KREIS_COMMUTE, MONTHLY_NET };
