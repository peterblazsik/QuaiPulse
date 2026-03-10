/**
 * Door-to-door route segments for Vienna ↔ Zurich travel.
 *
 * Each travel mode (flight, day train, NightJet) is broken into
 * granular segments with timing, cost, and metadata so we can
 * build true cost waterfalls and time comparisons.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type TravelMode = "flight" | "railjet" | "nightjet";

export interface RouteSegment {
  id: string;
  label: string;
  /** Duration in minutes */
  durationMin: number;
  /** Duration variance (+/- minutes) */
  varianceMin: number;
  /** Is this segment productive (laptop, reading, etc.)? */
  productive: boolean;
  /** Partial productivity factor (0-1). E.g. 0.3 for cramped plane seat */
  productivityFactor: number;
  /** Cost in EUR for this segment (0 if included in pass) */
  costEUR: number;
  /** Is this a waiting/buffer segment? */
  isBuffer: boolean;
  /** Category for waterfall coloring */
  category: "transit" | "buffer" | "travel" | "airport" | "sleep";
  /** Optional note */
  note?: string;
}

export interface TravelRoute {
  id: TravelMode;
  label: string;
  shortLabel: string;
  icon: string;
  /** Total door-to-door in minutes */
  totalMin: number;
  /** Return ticket price range in EUR */
  returnPriceEUR: { min: number; avg: number; max: number };
  /** CO2 per person per one-way trip in kg */
  co2Kg: number;
  /** Segments from Vienna apartment to Zurich apartment */
  outbound: RouteSegment[];
  /** Key advantages */
  pros: string[];
  /** Key disadvantages */
  cons: string[];
  /** Departure window description */
  departureWindow: string;
  /** Arrival description */
  arrival: string;
}

// ─── Vienna-side common segments ──────────────────────────────────────────────

const VIENNA_TO_HEILIGENSTADT: RouteSegment = {
  id: "vie-drive-pr",
  label: "Drive to Heiligenstadt P+R",
  durationMin: 7,
  varianceMin: 3,
  productive: false,
  productivityFactor: 0,
  costEUR: 3.9, // P+R daily rate
  isBuffer: false,
  category: "transit",
  note: "Park at P+R Heiligenstadt (~EUR 3.90/day)",
};

const U4_TO_MITTE: RouteSegment = {
  id: "vie-u4-mitte",
  label: "U4 Heiligenstadt → Wien Mitte",
  durationMin: 14,
  varianceMin: 2,
  productive: false,
  productivityFactor: 0,
  costEUR: 0, // Wiener Linien pass
  isBuffer: false,
  category: "transit",
  note: "U4 every 3-5 min peak, 5-8 min off-peak",
};

const U4_U1_TO_HBF: RouteSegment = {
  id: "vie-u4u1-hbf",
  label: "U4 → U1 → Wien Hauptbahnhof",
  durationMin: 20,
  varianceMin: 4,
  productive: false,
  productivityFactor: 0,
  costEUR: 0,
  isBuffer: false,
  category: "transit",
  note: "U4 to Karlsplatz, change U1 to Wien Hbf",
};

// ─── Flight route ─────────────────────────────────────────────────────────────

const FLIGHT_SEGMENTS: RouteSegment[] = [
  VIENNA_TO_HEILIGENSTADT,
  U4_TO_MITTE,
  {
    id: "vie-s7-airport",
    label: "S7 Wien Mitte → VIE Airport",
    durationMin: 25,
    varianceMin: 3,
    productive: false,
    productivityFactor: 0,
    costEUR: 4.4,
    isBuffer: false,
    category: "transit",
    note: "S7 every 30 min. CAT is 16 min but EUR 14.90",
  },
  {
    id: "vie-airport-buffer",
    label: "Airport check-in, security, gate",
    durationMin: 75,
    varianceMin: 15,
    productive: false,
    productivityFactor: 0.1,
    costEUR: 0,
    isBuffer: true,
    category: "airport",
    note: "Intra-Schengen. Faster with Miles & More FTL status",
  },
  {
    id: "vie-zrh-flight",
    label: "Flight VIE → ZRH",
    durationMin: 85,
    varianceMin: 10,
    productive: true,
    productivityFactor: 0.3,
    costEUR: 0, // included in ticket
    isBuffer: false,
    category: "travel",
    note: "~30 min usable at cruise. No wifi on most short-haul",
  },
  {
    id: "zrh-deplane-exit",
    label: "Deplane, walk to exit",
    durationMin: 15,
    varianceMin: 5,
    productive: false,
    productivityFactor: 0,
    costEUR: 0,
    isBuffer: true,
    category: "airport",
  },
  {
    id: "zrh-train-city",
    label: "S-Bahn ZRH Flughafen → Zürich HB",
    durationMin: 12,
    varianceMin: 2,
    productive: false,
    productivityFactor: 0,
    costEUR: 0, // ZVV pass
    isBuffer: false,
    category: "transit",
    note: "S2/S16/IR every few minutes",
  },
  {
    id: "zrh-tram-home",
    label: "Tram/walk HB → apartment (Enge)",
    durationMin: 10,
    varianceMin: 3,
    productive: false,
    productivityFactor: 0,
    costEUR: 0,
    isBuffer: false,
    category: "transit",
    note: "S-Bahn 1 stop or Tram 5/13 ~8 min",
  },
];

// ─── Railjet route ────────────────────────────────────────────────────────────

const RAILJET_SEGMENTS: RouteSegment[] = [
  VIENNA_TO_HEILIGENSTADT,
  U4_U1_TO_HBF,
  {
    id: "hbf-board-buffer",
    label: "Platform, board train",
    durationMin: 10,
    varianceMin: 5,
    productive: false,
    productivityFactor: 0,
    costEUR: 0,
    isBuffer: true,
    category: "buffer",
    note: "Arrive 10 min before departure",
  },
  {
    id: "railjet-wien-zurich",
    label: "Railjet Wien Hbf → Zürich HB",
    durationMin: 470,
    varianceMin: 15,
    productive: true,
    productivityFactor: 0.75,
    costEUR: 0,
    isBuffer: false,
    category: "travel",
    note: "~7h50. Full table, power, wifi. Scenic via Salzburg, Innsbruck, Arlberg",
  },
  {
    id: "zrh-walk-home-train",
    label: "Walk HB → apartment (Enge)",
    durationMin: 10,
    varianceMin: 3,
    productive: false,
    productivityFactor: 0,
    costEUR: 0,
    isBuffer: false,
    category: "transit",
    note: "Tram or 12 min walk from Zürich HB",
  },
];

// ─── NightJet route ───────────────────────────────────────────────────────────

const NIGHTJET_SEGMENTS: RouteSegment[] = [
  VIENNA_TO_HEILIGENSTADT,
  U4_U1_TO_HBF,
  {
    id: "hbf-board-nightjet",
    label: "Board NightJet, settle in",
    durationMin: 20,
    varianceMin: 5,
    productive: false,
    productivityFactor: 0,
    costEUR: 0,
    isBuffer: true,
    category: "buffer",
  },
  {
    id: "nightjet-sleep",
    label: "Sleep (Wien Hbf → Zürich HB)",
    durationMin: 540,
    varianceMin: 30,
    productive: false,
    productivityFactor: 0,
    costEUR: 0,
    isBuffer: false,
    category: "sleep",
    note: "Depart ~21:00, arrive ~06:00. You sleep the entire journey.",
  },
  {
    id: "zrh-morning-walk",
    label: "Walk HB → apartment (Enge)",
    durationMin: 10,
    varianceMin: 3,
    productive: false,
    productivityFactor: 0,
    costEUR: 0,
    isBuffer: false,
    category: "transit",
    note: "Fresh morning arrival, city center",
  },
];

// ─── Route definitions ────────────────────────────────────────────────────────

export const TRAVEL_ROUTES: TravelRoute[] = [
  {
    id: "flight",
    label: "Flight (VIE → ZRH)",
    shortLabel: "Flight",
    icon: "Plane",
    totalMin: FLIGHT_SEGMENTS.reduce((s, seg) => s + seg.durationMin, 0),
    returnPriceEUR: { min: 100, avg: 180, max: 350 },
    co2Kg: 140,
    outbound: FLIGHT_SEGMENTS,
    pros: [
      "Fastest advertised travel time",
      "Miles & More status from ~20 trips/yr",
      "Multiple daily departures 16:00-19:00",
    ],
    cons: [
      "75 min airport dead time each way",
      "Only 30 min productive on board",
      "10x higher CO2 than train",
      "Delay/cancel risk in winter fog",
      "Luggage weight limits",
    ],
    departureWindow: "16:00-19:00 from VIE (Austrian/SWISS)",
    arrival: "~20:00-22:00 at Zurich apartment",
  },
  {
    id: "railjet",
    label: "Railjet (Wien Hbf → Zürich HB)",
    shortLabel: "Railjet",
    icon: "Train",
    totalMin: RAILJET_SEGMENTS.reduce((s, seg) => s + seg.durationMin, 0),
    returnPriceEUR: { min: 58, avg: 100, max: 240 },
    co2Kg: 18,
    outbound: RAILJET_SEGMENTS,
    pros: [
      "5-6 hours productive work time",
      "City center to city center",
      "No security, no luggage limits",
      "Scenic Alpine route",
      "Flexible rebooking (Sparschiene Komfort)",
      "8x less CO2 than flight",
    ],
    cons: [
      "8+ hours total travel time",
      "Eats a significant portion of the day",
      "Can be crowded on Friday/Sunday",
    ],
    departureWindow: "Multiple daily (06:40, 08:40, 10:40, 14:40, 16:40)",
    arrival: "Depends on departure — afternoon to late evening",
  },
  {
    id: "nightjet",
    label: "NightJet Sleeper (overnight)",
    shortLabel: "NightJet",
    icon: "Moon",
    totalMin: NIGHTJET_SEGMENTS.reduce((s, seg) => s + seg.durationMin, 0),
    returnPriceEUR: { min: 60, avg: 90, max: 200 },
    co2Kg: 18,
    outbound: NIGHTJET_SEGMENTS,
    pros: [
      "Zero waking hours consumed",
      "Arrive fresh in the morning — gain a full day",
      "Cheapest true cost (time + money)",
      "No sleep disruption (you sleep on schedule)",
      "Save a hotel night",
      "Same low CO2 as day train",
    ],
    cons: [
      "Only 1 departure per day (~21:00)",
      "Must book sleeper cabin for decent sleep",
      "Not for claustrophobic travelers",
      "Less scheduling flexibility",
    ],
    departureWindow: "~21:00-21:30 from Wien Hbf",
    arrival: "~06:00-06:30 at Zürich HB next morning",
  },
];

// ─── Stopover points (intermediate cities on the train route) ─────────────────

export interface StopoverCity {
  name: string;
  travelTimeFromViennaMin: number;
  highlight: string;
  kidFriendly: boolean;
}

export const STOPOVER_CITIES: StopoverCity[] = [
  { name: "Salzburg", travelTimeFromViennaMin: 140, highlight: "Mozart's birthplace, Old Town (UNESCO)", kidFriendly: true },
  { name: "Innsbruck", travelTimeFromViennaMin: 255, highlight: "Alpine capital, Nordkette cable car, Swarovski Crystal Worlds", kidFriendly: true },
  { name: "Feldkirch", travelTimeFromViennaMin: 375, highlight: "Medieval old town, gateway to Liechtenstein", kidFriendly: false },
  { name: "Bregenz", travelTimeFromViennaMin: 390, highlight: "Lake Constance, Bregenz Festival", kidFriendly: true },
  { name: "St. Gallen", travelTimeFromViennaMin: 420, highlight: "Abbey (UNESCO), textile history", kidFriendly: false },
];

// ─── Subscription / pass options ──────────────────────────────────────────────

export interface TravelPass {
  id: string;
  name: string;
  annualCostEUR: number;
  benefit: string;
  relevantFor: TravelMode[];
  worthIt: boolean;
  note: string;
}

export const TRAVEL_PASSES: TravelPass[] = [
  {
    id: "vorteilscard",
    name: "ÖBB Vorteilscard Classic",
    annualCostEUR: 66,
    benefit: "50% off Austrian portion of flex tickets, cheaper Sparschiene",
    relevantFor: ["railjet", "nightjet"],
    worthIt: true,
    note: "Pays for itself after 2 trips. Unlocks ÖBB Lounge at Wien Hbf.",
  },
  {
    id: "halbtax",
    name: "SBB Halbtax",
    annualCostEUR: 175,
    benefit: "50% off all Swiss rail. Also reduces Swiss portion of international tickets.",
    relevantFor: ["railjet", "nightjet"],
    worthIt: true,
    note: "Essential for Swiss living. Also 50% off ZVV single tickets.",
  },
  {
    id: "miles-and-more",
    name: "Miles & More (Frequent Traveller)",
    annualCostEUR: 0,
    benefit: "Lounge access, priority boarding, extra baggage, Star Alliance Silver",
    relevantFor: ["flight"],
    worthIt: true,
    note: "Earned automatically at 30 qualifying flights/yr. You'll hit this by December.",
  },
  {
    id: "klimaticket",
    name: "Klimaticket Österreich",
    annualCostEUR: 1095,
    benefit: "Unlimited Austrian domestic rail/bus/tram",
    relevantFor: ["railjet", "nightjet"],
    worthIt: false,
    note: "Only worth it if you travel extensively within Austria beyond this route.",
  },
];
