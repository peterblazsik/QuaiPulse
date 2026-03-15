import { z } from "zod";

// ─── Enums ──────────────────────────────────────────────────────────────────

const ScoreDimensionEnum = z.enum([
  "commute", "gym", "social", "lake", "airport",
  "food", "quiet", "transit", "cost", "safety",
  "flightNoise", "parking",
]);

const DossierStatusEnum = z.enum(["missing", "in_progress", "obtained", "uploaded"]);

const SubActionEnum = z.enum(["keep", "cut", "replace", "undecided"]);

const SubCategoryEnum = z.enum([
  "streaming", "software", "telecom", "fitness",
  "finance", "cloud", "news", "other",
]);

const BillingCycleEnum = z.enum(["monthly", "yearly"]);

const ChecklistPhaseEnum = z.enum(["mar-apr", "may", "jun", "jul", "aug-sep"]);

const ChecklistOwnerEnum = z.enum(["self", "hr", "relocation_agent", "employer", "partner"]);

const EquipmentTypeEnum = z.enum([
  "leg_press", "smith_machine", "cable_cross", "lat_pulldown",
  "chest_press", "rowing_machine", "elliptical", "free_weights",
  "squat_rack", "hack_squat", "leg_curl", "leg_extension",
]);

// ─── Checklist ──────────────────────────────────────────────────────────────

const ChecklistCustomItemSchema = z.object({
  id: z.string(),
  phase: ChecklistPhaseEnum,
  category: z.string().max(100),
  title: z.string().max(500),
  description: z.string().max(2000).optional(),
  dueDate: z.string().optional(),
  url: z.string().url().optional(),
  moduleLink: z.string().optional(),
  moduleLinkLabel: z.string().optional(),
  sortOrder: z.number(),
  dependsOn: z.array(z.string()).optional(),
  hardDeadline: z.string().optional(),
  estimatedDays: z.number().optional(),
  owner: ChecklistOwnerEnum.optional(),
});

export const CompletedIdsSchema = z.array(z.string().max(100)).max(500);
export const CustomItemsSchema = z.array(ChecklistCustomItemSchema).max(200);

// ─── Priority ───────────────────────────────────────────────────────────────

export const WeightsSchema = z.record(ScoreDimensionEnum, z.number().min(0).max(10));
export const ProfilesSchema = z.record(
  z.string().max(100),
  z.record(ScoreDimensionEnum, z.number().min(0).max(10)),
);

// ─── Budget ─────────────────────────────────────────────────────────────────

export const BudgetValuesSchema = z.record(
  z.enum([
    "rent", "healthInsurance", "foodDining", "transport",
    "gym", "electricity", "internet", "flights",
    "subscriptions", "serafe", "misc",
  ]),
  z.number().min(0).max(100_000),
);

// ─── Subscription ───────────────────────────────────────────────────────────

export const DecisionsSchema = z.record(z.string().max(100), SubActionEnum);

const CustomSubSchema = z.object({
  id: z.string().max(100),
  name: z.string().max(200),
  category: SubCategoryEnum,
  monthlyCostEUR: z.number().min(0).max(100_000),
  monthlyCostCHF: z.number().min(0).max(100_000),
  billingCycle: BillingCycleEnum,
  essential: z.boolean(),
  swissAlternative: z.string().max(200).optional(),
  swissAlternativeCostCHF: z.number().min(0).max(100_000).optional(),
  notes: z.string().max(1000).optional(),
});

export const CustomSubsSchema = z.array(CustomSubSchema).max(200);

// ─── Dossier ────────────────────────────────────────────────────────────────

export const DossierStatusesSchema = z.record(z.string().max(100), DossierStatusEnum);
export const DossierNotesSchema = z.record(z.string().max(100), z.string().max(5000));
export const DossierUrlsSchema = z.record(z.string().max(100), z.string().max(2000));

// ─── Gym Filter ─────────────────────────────────────────────────────────────

export const GymFilterSchema = z.object({
  selectedEquipment: z.array(EquipmentTypeEnum).optional(),
  priceRange: z.tuple([z.number().min(0), z.number().max(500)]).optional(),
  kneeSafeOnly: z.boolean().optional(),
  compareIds: z.array(z.string().max(100)).optional(),
}).passthrough();

// ─── Apartment Feed ─────────────────────────────────────────────────────────

export const DismissedIdsSchema = z.array(z.string().max(200)).max(5000);

export const FeedFiltersSchema = z.object({
  minPrice: z.number().min(0).max(100_000),
  maxPrice: z.number().min(0).max(100_000),
  minSqm: z.number().min(0).max(1000),
  maxSqm: z.number().min(0).max(1000),
  minRooms: z.number().min(0).max(20),
  maxRooms: z.number().min(0).max(20),
  kreise: z.array(z.number().int().min(1).max(12)),
  onlyWithImages: z.boolean(),
});
