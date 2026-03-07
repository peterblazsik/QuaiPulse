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

export interface GymEquipment {
  type: EquipmentType;
  brand?: string;
  kneeSafety: KneeSafety;
  notes?: string;
}

export interface GymData {
  id: string;
  name: string;
  neighborhoodId: string;
  address: string;
  lat: number;
  lng: number;
  monthlyPrice: number;
  rating: number;
  personalNote: string;
  website?: string;
  openingHours: string;
  amenities: string[];
  equipment: GymEquipment[];
  kneeFriendlyScore: number;
  trialAvailable: boolean;
  tags: string[];
}

export const EQUIPMENT_LABELS: Record<EquipmentType, string> = {
  leg_press: "Leg Press",
  smith_machine: "Smith Machine",
  cable_cross: "Cable Cross",
  lat_pulldown: "Lat Pulldown",
  chest_press: "Chest Press",
  rowing_machine: "Rowing Machine",
  elliptical: "Elliptical",
  free_weights: "Free Weights",
  squat_rack: "Squat Rack",
  hack_squat: "Hack Squat",
  leg_curl: "Leg Curl",
  leg_extension: "Leg Extension",
};

export const ALL_EQUIPMENT_TYPES: EquipmentType[] = [
  "leg_press",
  "smith_machine",
  "cable_cross",
  "lat_pulldown",
  "chest_press",
  "rowing_machine",
  "elliptical",
  "free_weights",
  "squat_rack",
  "hack_squat",
  "leg_curl",
  "leg_extension",
];

export const GYMS: GymData[] = [
  {
    id: "gym-activ-enge",
    name: "Activ Fitness Enge",
    neighborhoodId: "enge",
    address: "Bederstrasse 109, 8002",
    lat: 47.3595,
    lng: 8.5285,
    monthlyPrice: 59,
    rating: 7.5,
    personalNote:
      "Standard chain gym, well-maintained. Good machines, small free weights area.",
    openingHours: "6:00-22:00",
    amenities: ["showers", "lockers", "water fountain"],
    equipment: [
      { type: "leg_press", kneeSafety: "safe" },
      { type: "cable_cross", kneeSafety: "safe" },
      { type: "lat_pulldown", kneeSafety: "safe" },
      { type: "chest_press", kneeSafety: "safe" },
      { type: "rowing_machine", kneeSafety: "safe" },
      { type: "elliptical", kneeSafety: "safe" },
      { type: "free_weights", kneeSafety: "caution" },
      { type: "leg_extension", kneeSafety: "caution" },
    ],
    kneeFriendlyScore: 6,
    trialAvailable: true,
    tags: ["machines", "cardio", "group_classes"],
  },
  {
    id: "gym-holmes-place",
    name: "Holmes Place Premium",
    neighborhoodId: "city",
    address: "Bleicherweg 19, 8002",
    lat: 47.3665,
    lng: 8.5345,
    monthlyPrice: 180,
    rating: 9.0,
    personalNote:
      "Premium. Pool, spa, excellent equipment. Expensive but Ferrari-grade gym experience.",
    openingHours: "6:00-23:00",
    amenities: [
      "pool",
      "spa",
      "sauna",
      "towel service",
      "personal training",
      "showers",
      "lockers",
    ],
    equipment: [
      { type: "leg_press", kneeSafety: "safe" },
      { type: "smith_machine", kneeSafety: "safe" },
      { type: "cable_cross", kneeSafety: "safe" },
      { type: "lat_pulldown", kneeSafety: "safe" },
      { type: "chest_press", kneeSafety: "safe" },
      { type: "rowing_machine", kneeSafety: "safe" },
      { type: "elliptical", kneeSafety: "safe" },
      { type: "free_weights", kneeSafety: "caution" },
      { type: "squat_rack", kneeSafety: "caution" },
      { type: "hack_squat", kneeSafety: "caution" },
      { type: "leg_curl", kneeSafety: "safe" },
      { type: "leg_extension", kneeSafety: "caution" },
    ],
    kneeFriendlyScore: 9,
    trialAvailable: true,
    tags: ["premium", "pool", "spa", "machines", "free_weights"],
  },
  {
    id: "gym-kieser-wiedikon",
    name: "Kieser Training Wiedikon",
    neighborhoodId: "wiedikon",
    address: "Birmensdorferstrasse 94, 8003",
    lat: 47.3715,
    lng: 8.5175,
    monthlyPrice: 95,
    rating: 8.0,
    personalNote:
      "Strength-focused, medical approach. Great for knee rehab. Supervised training.",
    openingHours: "7:00-21:00",
    amenities: ["supervised training", "physio consultation", "showers"],
    equipment: [
      { type: "leg_press", kneeSafety: "safe" },
      {
        type: "leg_extension",
        kneeSafety: "safe",
        notes: "Supervised, controlled ROM",
      },
      { type: "leg_curl", kneeSafety: "safe" },
      { type: "chest_press", kneeSafety: "safe" },
      { type: "lat_pulldown", kneeSafety: "safe" },
      { type: "rowing_machine", kneeSafety: "safe" },
    ],
    kneeFriendlyScore: 10,
    trialAvailable: true,
    tags: ["strength", "rehab", "supervised", "machines"],
  },
  {
    id: "gym-puregym-wiedikon",
    name: "PureGym Wiedikon",
    neighborhoodId: "wiedikon",
    address: "Badenerstrasse 120, 8003",
    lat: 47.3735,
    lng: 8.5125,
    monthlyPrice: 35,
    rating: 7.0,
    personalNote:
      "24h access, budget-friendly. Basic but functional. Good for late-night sessions.",
    openingHours: "24/7",
    amenities: ["24h access", "showers"],
    equipment: [
      { type: "leg_press", kneeSafety: "safe" },
      { type: "cable_cross", kneeSafety: "safe" },
      { type: "free_weights", kneeSafety: "caution" },
      { type: "squat_rack", kneeSafety: "avoid", notes: "No spotter available" },
      { type: "elliptical", kneeSafety: "safe" },
      { type: "rowing_machine", kneeSafety: "safe" },
    ],
    kneeFriendlyScore: 5,
    trialAvailable: false,
    tags: ["24h", "budget", "machines", "free_weights"],
  },
  {
    id: "gym-crossfit-wiedikon",
    name: "CrossFit Wiedikon",
    neighborhoodId: "wiedikon",
    address: "Seebahnstrasse 155, 8003",
    lat: 47.3695,
    lng: 8.5145,
    monthlyPrice: 150,
    rating: 8.5,
    personalNote:
      "If knee allows — excellent community, varied workouts. Check with physio first.",
    openingHours: "6:00-21:00",
    amenities: ["community", "coaching", "showers"],
    equipment: [
      { type: "free_weights", kneeSafety: "avoid" },
      { type: "squat_rack", kneeSafety: "avoid" },
      { type: "rowing_machine", kneeSafety: "safe" },
      { type: "elliptical", kneeSafety: "safe" },
    ],
    kneeFriendlyScore: 3,
    trialAvailable: true,
    tags: ["crossfit", "community", "group_classes", "strength"],
  },
  {
    id: "gym-activ-oerlikon",
    name: "Activ Fitness Oerlikon",
    neighborhoodId: "oerlikon",
    address: "Max-Bill-Platz 19, 8050",
    lat: 47.4105,
    lng: 8.5435,
    monthlyPrice: 59,
    rating: 8.0,
    personalNote:
      "Largest Activ Fitness in Zurich. Huge floor, all equipment. Worth the journey if you live nearby.",
    openingHours: "6:00-22:00",
    amenities: ["showers", "lockers", "parking"],
    equipment: [
      { type: "leg_press", kneeSafety: "safe" },
      { type: "smith_machine", kneeSafety: "safe" },
      { type: "cable_cross", kneeSafety: "safe" },
      { type: "lat_pulldown", kneeSafety: "safe" },
      { type: "chest_press", kneeSafety: "safe" },
      { type: "rowing_machine", kneeSafety: "safe" },
      { type: "elliptical", kneeSafety: "safe" },
      { type: "free_weights", kneeSafety: "caution" },
      { type: "squat_rack", kneeSafety: "caution" },
      { type: "leg_extension", kneeSafety: "caution" },
      { type: "leg_curl", kneeSafety: "safe" },
    ],
    kneeFriendlyScore: 7,
    trialAvailable: true,
    tags: ["machines", "free_weights", "cardio", "large"],
  },
  {
    id: "gym-migros-hard",
    name: "Migros Fitnesscenter",
    neighborhoodId: "hard",
    address: "Pfingstweidstrasse 60, 8005",
    lat: 47.3895,
    lng: 8.5175,
    monthlyPrice: 65,
    rating: 7.5,
    personalNote:
      "Good value Migros gym. Pool access included. Solid all-rounder.",
    openingHours: "6:30-22:00",
    amenities: ["pool", "showers", "group classes"],
    equipment: [
      { type: "leg_press", kneeSafety: "safe" },
      { type: "cable_cross", kneeSafety: "safe" },
      { type: "lat_pulldown", kneeSafety: "safe" },
      { type: "chest_press", kneeSafety: "safe" },
      { type: "rowing_machine", kneeSafety: "safe" },
      { type: "elliptical", kneeSafety: "safe" },
      { type: "free_weights", kneeSafety: "caution" },
    ],
    kneeFriendlyScore: 7,
    trialAvailable: true,
    tags: ["pool", "machines", "group_classes", "affordable"],
  },
];
