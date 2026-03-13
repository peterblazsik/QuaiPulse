export type LocationType = "zurich_kreis" | "lake_town";

export type HoodmapVibe =
  | "suits"
  | "rich"
  | "cool"
  | "tourists"
  | "uni"
  | "normies"
  | "crime";

export type ScoreDimension =
  | "commute"
  | "gym"
  | "social"
  | "lake"
  | "airport"
  | "food"
  | "quiet"
  | "transit"
  | "cost"
  | "safety"
  | "flightNoise"
  | "parking";

export type PriorityWeights = Record<ScoreDimension, number>;

export type ApartmentStatus =
  | "new"
  | "interested"
  | "contacted"
  | "viewing_scheduled"
  | "applied"
  | "rejected"
  | "accepted";

export type ChecklistPhase = "mar-apr" | "may" | "jun" | "jul";

export type VenueType =
  | "gym"
  | "chess"
  | "ai_meetup"
  | "swimming"
  | "cycling"
  | "restaurant"
  | "social"
  | "coworking";

export type DossierStatus = "missing" | "in_progress" | "obtained" | "uploaded";

export type TransportMode = "flight" | "train";

// Gym Finder types
export type EquipmentType =
  | "leg_press"
  | "smith_machine"
  | "cable_cross"
  | "lat_pulldown"
  | "chest_press"
  | "rowing_machine"
  | "elliptical"
  | "free_weights"
  | "squat_rack"
  | "hack_squat"
  | "leg_curl"
  | "leg_extension";

export type KneeSafety = "safe" | "caution" | "avoid";

// Sleep Intelligence types
export type SleepLocation = "zurich" | "vienna" | "travel" | "other";
export type SleepQuality = 1 | 2 | 3 | 4 | 5;

// Language Prep types
export type PhraseCategory =
  | "greetings"
  | "office"
  | "shopping"
  | "dining"
  | "transit"
  | "social"
  | "emergency"
  | "culture"
  | "smalltalk";

// Subscription Manager types
export type SubCategory =
  | "streaming"
  | "software"
  | "telecom"
  | "fitness"
  | "finance"
  | "cloud"
  | "news"
  | "other";

export type SubAction = "keep" | "cut" | "replace" | "undecided";
export type BillingCycle = "monthly" | "yearly";

// Rental Intelligence types
export type ListingSource = "flatfox" | "homegate";

export interface UnifiedListing {
  id: string;
  source: ListingSource;
  sourceUrl: string;
  title: string;
  address: string;
  zipcode: number;
  kreis: number;
  rent: number;
  rooms: number | null;
  sqm: number | null;
  pricePerSqm: number | null;
  floor: number | null;
  description: string | null;
  imageUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  availableDate: string | null;
  attributes: string[];
  isFurnished: boolean;
  isPremium: boolean;
  publishedAt: string | null;
  // Computed
  valueScore: number;
  valueScoreBreakdown: ValueScoreBreakdown | null;
  budgetFit: "comfortable" | "stretch" | "over";
  commuteEstimate: number | null;
}

export interface ValueScoreBreakdown {
  priceScore: number;       // 0-100 raw score for price/m² dimension
  kreisScore: number;       // 0-100 raw score for Kreis desirability
  commuteScore: number;     // 0-100 raw score for commute
  roomScore: number;        // 0-100 raw score for room fit
  budgetScore: number;      // 0-100 raw score for budget fit
  priceWeight: number;      // 0.30
  kreisWeight: number;      // 0.20
  commuteWeight: number;    // 0.20
  roomWeight: number;       // 0.15
  budgetWeight: number;     // 0.15
  medianPricePerSqm: number;
}
