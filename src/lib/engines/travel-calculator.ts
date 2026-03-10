/**
 * Travel Intelligence Engine
 *
 * Calculates the "true cost" of each Vienna-Zurich travel mode by combining:
 * - Ticket price
 * - Transit costs (parking, S-Bahn, etc.)
 * - Time cost (waking non-productive hours × hourly rate)
 * - Carbon cost (at social cost of carbon)
 * - Productivity value recovered (productive hours × hourly rate × productivity factor)
 *
 * The result often flips the perceived ranking:
 * Flight (cheapest ticket) → most expensive true cost
 * NightJet (longest journey) → cheapest true cost
 */

import {
  TRAVEL_ROUTES,
  type TravelRoute,
  type TravelMode,
  type RouteSegment,
} from "@/lib/data/travel-routes";

// ─── Constants ────────────────────────────────────────────────────────────────

/** Social cost of carbon, EUR per tonne (EU ETS ~EUR 65-90, we use mid-range) */
const CARBON_COST_EUR_PER_TONNE = 75;

/** Default hourly rate for time valuation (CHF, based on ~CHF 12k/mo income) */
export const DEFAULT_HOURLY_RATE_CHF = 75;

/** EUR to CHF conversion */
const EUR_TO_CHF = 0.94;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TravelAnalysis {
  mode: TravelMode;
  route: TravelRoute;

  // Time breakdown (minutes)
  totalDoorToDoorMin: number;
  productiveMin: number;
  deadTimeMin: number;
  sleepMin: number;
  transitMin: number;
  bufferMin: number;
  travelMin: number;

  // Productivity
  productivityRate: number; // 0-100%
  productiveHoursGained: number;

  // Cost breakdown (CHF)
  ticketCostCHF: number;
  transitCostCHF: number;
  timeCostCHF: number; // dead hours × hourly rate
  carbonCostCHF: number;
  productivityValueCHF: number; // negative = value recovered
  trueCostCHF: number; // ticket + transit + time + carbon - productivity

  // Per-trip carbon
  co2Kg: number;

  // Waking hours consumed (the killer metric)
  wakingHoursConsumed: number;

  // Annual projections (for N trips/year)
  annualTicketCHF: number;
  annualTrueCostCHF: number;
  annualCo2Kg: number;
  annualDeadHours: number;
  annualProductiveHours: number;
}

export interface TravelComparison {
  analyses: TravelAnalysis[];
  tripsPerYear: number;
  hourlyRateCHF: number;

  // Comparison insights
  cheapestTicket: TravelMode;
  cheapestTrueCost: TravelMode;
  mostProductive: TravelMode;
  leastWakingHours: TravelMode;
  greenest: TravelMode;

  // Savings vs flight (the default assumption people make)
  nightjetVsFlightAnnualSavingsCHF: number;
  railjetVsFlightProductiveHoursGained: number;
  trainVsFlightCo2SavedKg: number;
}

// ─── Segment analysis ─────────────────────────────────────────────────────────

function analyzeSegments(segments: RouteSegment[]) {
  let productiveMin = 0;
  let deadTimeMin = 0;
  let sleepMin = 0;
  let transitMin = 0;
  let bufferMin = 0;
  let travelMin = 0;
  let transitCostEUR = 0;

  for (const seg of segments) {
    transitCostEUR += seg.costEUR;

    if (seg.category === "sleep") {
      sleepMin += seg.durationMin;
    } else if (seg.category === "transit") {
      transitMin += seg.durationMin;
      deadTimeMin += seg.durationMin;
    } else if (seg.category === "buffer" || seg.category === "airport") {
      bufferMin += seg.durationMin;
      deadTimeMin += seg.durationMin * (1 - seg.productivityFactor);
      productiveMin += seg.durationMin * seg.productivityFactor;
    } else if (seg.category === "travel") {
      travelMin += seg.durationMin;
      productiveMin += seg.durationMin * seg.productivityFactor;
      deadTimeMin += seg.durationMin * (1 - seg.productivityFactor);
    }
  }

  return { productiveMin, deadTimeMin, sleepMin, transitMin, bufferMin, travelMin, transitCostEUR };
}

// ─── Main calculator ──────────────────────────────────────────────────────────

export function analyzeTravelMode(
  mode: TravelMode,
  hourlyRateCHF: number = DEFAULT_HOURLY_RATE_CHF,
  tripsPerYear: number = 24,
  priceLevel: "min" | "avg" | "max" = "avg",
): TravelAnalysis {
  const route = TRAVEL_ROUTES.find((r) => r.id === mode)!;
  const segments = route.outbound;
  const analysis = analyzeSegments(segments);

  const totalDoorToDoorMin = segments.reduce((s, seg) => s + seg.durationMin, 0);
  const productiveHoursGained = analysis.productiveMin / 60;

  // Waking hours consumed = total - sleep
  const wakingHoursConsumed = (totalDoorToDoorMin - analysis.sleepMin) / 60;

  // Cost calculations (per one-way trip, × 2 for return at end)
  const ticketPriceEUR = route.returnPriceEUR[priceLevel];
  const ticketCostCHF = Math.round(ticketPriceEUR / EUR_TO_CHF);
  const transitCostCHF = Math.round((analysis.transitCostEUR * 2) / EUR_TO_CHF); // × 2 for return
  const timeCostCHF = Math.round((analysis.deadTimeMin / 60) * 2 * hourlyRateCHF); // × 2 sides
  const carbonCostCHF = Math.round(
    ((route.co2Kg * 2) / 1000) * CARBON_COST_EUR_PER_TONNE / EUR_TO_CHF
  );
  const productivityValueCHF = Math.round(productiveHoursGained * 2 * hourlyRateCHF);
  const trueCostCHF = ticketCostCHF + transitCostCHF + timeCostCHF + carbonCostCHF - productivityValueCHF;

  const productivityRate = totalDoorToDoorMin > 0
    ? (analysis.productiveMin / (totalDoorToDoorMin - analysis.sleepMin || 1)) * 100
    : 0;

  return {
    mode,
    route,
    totalDoorToDoorMin,
    productiveMin: Math.round(analysis.productiveMin),
    deadTimeMin: Math.round(analysis.deadTimeMin),
    sleepMin: analysis.sleepMin,
    transitMin: analysis.transitMin,
    bufferMin: analysis.bufferMin,
    travelMin: analysis.travelMin,
    productivityRate,
    productiveHoursGained,
    ticketCostCHF,
    transitCostCHF,
    timeCostCHF,
    carbonCostCHF,
    productivityValueCHF,
    trueCostCHF,
    co2Kg: route.co2Kg * 2, // return trip
    wakingHoursConsumed: Math.round(wakingHoursConsumed * 10) / 10,
    annualTicketCHF: ticketCostCHF * tripsPerYear,
    annualTrueCostCHF: trueCostCHF * tripsPerYear,
    annualCo2Kg: route.co2Kg * 2 * tripsPerYear,
    annualDeadHours: Math.round((analysis.deadTimeMin / 60) * 2 * tripsPerYear),
    annualProductiveHours: Math.round(productiveHoursGained * 2 * tripsPerYear),
  };
}

export function compareTravelModes(
  hourlyRateCHF: number = DEFAULT_HOURLY_RATE_CHF,
  tripsPerYear: number = 24,
  priceLevel: "min" | "avg" | "max" = "avg",
): TravelComparison {
  const modes: TravelMode[] = ["flight", "railjet", "nightjet"];
  const analyses = modes.map((m) =>
    analyzeTravelMode(m, hourlyRateCHF, tripsPerYear, priceLevel)
  );

  const flight = analyses.find((a) => a.mode === "flight")!;
  const railjet = analyses.find((a) => a.mode === "railjet")!;
  const nightjet = analyses.find((a) => a.mode === "nightjet")!;

  const byTicket = [...analyses].sort((a, b) => a.ticketCostCHF - b.ticketCostCHF);
  const byTrueCost = [...analyses].sort((a, b) => a.trueCostCHF - b.trueCostCHF);
  const byProductive = [...analyses].sort((a, b) => b.productiveHoursGained - a.productiveHoursGained);
  const byWaking = [...analyses].sort((a, b) => a.wakingHoursConsumed - b.wakingHoursConsumed);
  const byCo2 = [...analyses].sort((a, b) => a.co2Kg - b.co2Kg);

  return {
    analyses,
    tripsPerYear,
    hourlyRateCHF,
    cheapestTicket: byTicket[0].mode,
    cheapestTrueCost: byTrueCost[0].mode,
    mostProductive: byProductive[0].mode,
    leastWakingHours: byWaking[0].mode,
    greenest: byCo2[0].mode,
    nightjetVsFlightAnnualSavingsCHF: flight.annualTrueCostCHF - nightjet.annualTrueCostCHF,
    railjetVsFlightProductiveHoursGained: railjet.annualProductiveHours - flight.annualProductiveHours,
    trainVsFlightCo2SavedKg: flight.annualCo2Kg - Math.min(railjet.annualCo2Kg, nightjet.annualCo2Kg),
  };
}

// ─── Helper for waterfall chart data ──────────────────────────────────────────

export interface WaterfallBar {
  label: string;
  minutes: number;
  category: RouteSegment["category"];
  productive: boolean;
  productivityFactor: number;
  note?: string;
}

export function getWaterfallData(mode: TravelMode): WaterfallBar[] {
  const route = TRAVEL_ROUTES.find((r) => r.id === mode)!;
  return route.outbound.map((seg) => ({
    label: seg.label,
    minutes: seg.durationMin,
    category: seg.category,
    productive: seg.productive,
    productivityFactor: seg.productivityFactor,
    note: seg.note,
  }));
}

// ─── Chronotype recommendation ────────────────────────────────────────────────

export type Chronotype = "early" | "moderate" | "late";

export interface ChronotypeRecommendation {
  bestMode: TravelMode;
  bestDeparture: string;
  reasoning: string;
  sleepImpact: "none" | "mild" | "severe";
  arrivalEnergy: "high" | "moderate" | "low";
}

export function getChronotypeRecommendation(
  chronotype: Chronotype,
  direction: "vie-zrh" | "zrh-vie" = "vie-zrh",
): ChronotypeRecommendation {
  if (direction === "vie-zrh") {
    switch (chronotype) {
      case "early":
        return {
          bestMode: "railjet",
          bestDeparture: "06:40 Railjet from Wien Hbf",
          reasoning: "You're naturally awake early. The 06:40 Railjet gets you to Zurich by 14:30 with 5+ productive hours. Full afternoon available.",
          sleepImpact: "none",
          arrivalEnergy: "high",
        };
      case "moderate":
        return {
          bestMode: "nightjet",
          bestDeparture: "21:00 NightJet from Wien Hbf",
          reasoning: "Board after dinner, sleep at your normal time, wake up in Zurich at 06:00. Full day ahead, zero time lost.",
          sleepImpact: "none",
          arrivalEnergy: "high",
        };
      case "late":
        return {
          bestMode: "nightjet",
          bestDeparture: "21:00 NightJet from Wien Hbf",
          reasoning: "Perfect for night owls. Board at 21:00, read or relax until your natural sleep time, wake up in Zurich. A 17:00 flight would mean arriving at 21:00 — right when you're getting energized.",
          sleepImpact: "none",
          arrivalEnergy: "moderate",
        };
    }
  }
  // ZRH → VIE (return to Vienna)
  switch (chronotype) {
    case "early":
      return {
        bestMode: "railjet",
        bestDeparture: "08:40 Railjet from Zürich HB",
        reasoning: "Morning departure, work the entire ride, arrive Vienna by 16:30. Natural wind-down for your early sleep schedule.",
        sleepImpact: "none",
        arrivalEnergy: "moderate",
      };
    case "moderate":
      return {
        bestMode: "flight",
        bestDeparture: "17:00-17:30 flight from ZRH",
        reasoning: "Finish work, quick hop to VIE, home by 21:00. Minimal day disruption, reasonable arrival time.",
        sleepImpact: "mild",
        arrivalEnergy: "moderate",
      };
    case "late":
      return {
        bestMode: "nightjet",
        bestDeparture: "20:30 NightJet from Zürich HB",
        reasoning: "Full day in Zurich, board after dinner, sleep through the journey. Wake up in Vienna for a fresh day with Katie.",
        sleepImpact: "none",
        arrivalEnergy: "high",
      };
  }
}
