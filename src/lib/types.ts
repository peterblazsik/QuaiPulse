export type ScoreDimension =
  | "commute"
  | "gym"
  | "social"
  | "lake"
  | "airport"
  | "food"
  | "quiet"
  | "transit";

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
