export interface KatieVisitData {
  id: string;
  startDate: string;
  endDate: string;
  transportMode: "flight" | "train";
  notes?: string;
  isConfirmed: boolean;
  isSpecial?: boolean;
  specialLabel?: string;
}

// Pre-planned visits for Jul-Dec 2026
export const PLANNED_VISITS: KatieVisitData[] = [
  {
    id: "kv-01",
    startDate: "2026-07-17",
    endDate: "2026-07-19",
    transportMode: "flight",
    notes: "First visit! Show Katie the new apartment and neighborhood.",
    isConfirmed: false,
  },
  {
    id: "kv-02",
    startDate: "2026-08-07",
    endDate: "2026-08-16",
    transportMode: "flight",
    notes: "Summer holiday week — Katie stays longer. Lake swimming, mountains, explore Zurich.",
    isConfirmed: false,
    isSpecial: true,
    specialLabel: "Summer holiday",
  },
  {
    id: "kv-03",
    startDate: "2026-08-28",
    endDate: "2026-08-30",
    transportMode: "flight",
    notes: "Before school starts back.",
    isConfirmed: false,
  },
  {
    id: "kv-04",
    startDate: "2026-09-18",
    endDate: "2026-09-20",
    transportMode: "flight",
    notes: "September visit — settle into routine.",
    isConfirmed: false,
  },
  {
    id: "kv-05",
    startDate: "2026-10-09",
    endDate: "2026-10-11",
    transportMode: "train",
    notes: "Try train for first time — Zurich-Vienna NightJet or Railjet.",
    isConfirmed: false,
  },
  {
    id: "kv-06",
    startDate: "2026-10-26",
    endDate: "2026-11-01",
    transportMode: "flight",
    notes: "Austrian autumn school break (Herbstferien).",
    isConfirmed: false,
    isSpecial: true,
    specialLabel: "Autumn break",
  },
  {
    id: "kv-07",
    startDate: "2026-11-13",
    endDate: "2026-11-15",
    transportMode: "flight",
    notes: "November visit.",
    isConfirmed: false,
  },
  {
    id: "kv-08",
    startDate: "2026-12-18",
    endDate: "2026-12-27",
    transportMode: "flight",
    notes: "Christmas together! Zurich Christmas markets, then Vienna for family.",
    isConfirmed: false,
    isSpecial: true,
    specialLabel: "Christmas",
  },
];

export const COST_DEFAULTS = {
  flightAvg: 220, // CHF return ZRH-VIE
  trainFull: 120, // CHF one-way Railjet
  trainHalfFare: 60, // CHF with Halbtax
  halfFareCardAnnual: 185, // CHF/year for SBB Halbtax
  airportTransfer: 0, // included in ZVV pass
};

export const KEY_DATES = [
  { date: "2026-07-01", label: "Move to Zurich", type: "milestone" as const },
  { date: "2027-01-17", label: "Katie's birthday (10!)", type: "birthday" as const },
  { date: "2026-10-26", label: "Austrian Herbstferien start", type: "holiday" as const },
  { date: "2026-12-24", label: "Christmas Eve", type: "holiday" as const },
  { date: "2026-08-01", label: "Swiss National Day", type: "holiday" as const },
];
