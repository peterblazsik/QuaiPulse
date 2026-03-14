import { pgTable, text, integer, real, boolean, timestamp, uniqueIndex, jsonb } from "drizzle-orm/pg-core";

// ─── Users ─────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Tier A: Single-row config stores (one row per user, upsert pattern) ───

export const userBudgetConfig = pgTable("user_budget_config", {
  userId: text("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  grossMonthlySalary: real("gross_monthly_salary").notNull().default(15000),
  has13thSalary: boolean("has_13th_salary").notNull().default(true),
  annualBonusPct: real("annual_bonus_pct").notNull().default(0),
  expenseAllowance: real("expense_allowance").notNull().default(700),
  employerInsuranceContrib: real("employer_insurance_contrib").notNull().default(0),
  mobilityAllowance: real("mobility_allowance").notNull().default(0),
  relocationBonus: real("relocation_bonus").notNull().default(0),
  bvgMonthly: real("bvg_monthly").notNull().default(390),
  pillar3aMonthly: real("pillar3a_monthly").notNull().default(0),
  taxLocationId: text("tax_location_id").notNull().default(""),
  viennaRent: real("vienna_rent").notNull().default(1450),
  childSupport: real("child_support").notNull().default(915),
  viennaUtils: real("vienna_utils").notNull().default(220),
  carInsurance: real("car_insurance").notNull().default(175),
  valuesJson: jsonb("values_json").notNull().default({}),
  setupCostsJson: jsonb("setup_costs_json").notNull().default({}),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userPriorityConfig = pgTable("user_priority_config", {
  userId: text("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  weightsJson: jsonb("weights_json").notNull().default({}),
  profilesJson: jsonb("profiles_json").notNull().default({}),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userChecklistState = pgTable("user_checklist_state", {
  userId: text("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  completedIdsJson: jsonb("completed_ids_json").notNull().default([]),
  customItemsJson: jsonb("custom_items_json").notNull().default([]),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userDossierState = pgTable("user_dossier_state", {
  userId: text("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  statusesJson: jsonb("statuses_json").notNull().default({}),
  notesJson: jsonb("notes_json").notNull().default({}),
  urlsJson: jsonb("urls_json").notNull().default({}),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userSubscriptionState = pgTable("user_subscription_state", {
  userId: text("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  decisionsJson: jsonb("decisions_json").notNull().default({}),
  customSubsJson: jsonb("custom_subs_json").notNull().default([]),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userGymFilterState = pgTable("user_gym_filter_state", {
  userId: text("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  stateJson: jsonb("state_json").notNull().default({}),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userApartmentFeedPrefs = pgTable("user_apartment_feed_prefs", {
  userId: text("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  dismissedIdsJson: jsonb("dismissed_ids_json").notNull().default([]),
  filtersJson: jsonb("filters_json").notNull().default({}),
  sortKey: text("sort_key").notNull().default("newest"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Tier B: Entity tables (multiple rows per user, normalized) ────────────

export const savedApartments = pgTable("saved_apartments", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  address: text("address").notNull().default(""),
  kreis: integer("kreis").notNull().default(0),
  rent: real("rent").notNull().default(0),
  rooms: real("rooms").notNull().default(0),
  sqm: real("sqm").notNull().default(0),
  sourceUrl: text("source_url").notNull().default(""),
  status: text("status").notNull().default("new"),
  notes: text("notes").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const apartmentInteractions = pgTable("apartment_interactions", {
  id: text("id").primaryKey(),
  apartmentId: text("apartment_id").notNull().references(() => savedApartments.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  date: text("date").notNull(),
  summary: text("summary").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const katieVisits = pgTable("katie_visits", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  transportMode: text("transport_mode").notNull().default("flight"),
  notes: text("notes"),
  isConfirmed: boolean("is_confirmed").notNull().default(false),
  isSpecial: boolean("is_special").notNull().default(false),
  specialLabel: text("special_label"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const sleepEntries = pgTable("sleep_entries", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  hours: real("hours").notNull(),
  quality: integer("quality").notNull(),
  location: text("location").notNull().default("zurich"),
  supplementsJson: jsonb("supplements_json").notNull().default([]),
  interventionsJson: jsonb("interventions_json").notNull().default([]),
  bedtime: text("bedtime"),
  waketime: text("waketime"),
  sleepLatency: integer("sleep_latency"),
  awakenings: integer("awakenings"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const languageCardStates = pgTable("language_card_states", (t) => ({
  id: t.text("id").primaryKey(),
  userId: t.text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  phraseId: t.text("phrase_id").notNull(),
  easeFactor: t.real("ease_factor").notNull().default(2.5),
  interval: t.integer("interval").notNull().default(0),
  repetitions: t.integer("repetitions").notNull().default(0),
  nextReview: t.text("next_review").notNull(),
  lastReview: t.text("last_review"),
  lastQuality: t.integer("last_quality"),
  createdAt: t.timestamp("created_at").notNull().defaultNow(),
}), (table) => [
  uniqueIndex("language_card_user_phrase_idx").on(table.userId, table.phraseId),
]);

// ─── User Profile (multi-user support) ──────────────────────────────────────

export const userProfile = pgTable("user_profile", {
  userId: text("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  // Identity
  displayName: text("display_name").notNull().default(""),
  // Relocation
  originCity: text("origin_city").notNull().default(""),
  originCountry: text("origin_country").notNull().default(""),
  destinationCity: text("destination_city").notNull().default("Zurich"),
  moveDate: text("move_date"), // ISO date string, e.g. "2026-07-01"
  // Employment
  employerName: text("employer_name").notNull().default(""),
  officeName: text("office_name").notNull().default(""),
  officeAddress: text("office_address").notNull().default(""),
  officeLat: real("office_lat"),
  officeLng: real("office_lng"),
  jobTitle: text("job_title").notNull().default(""),
  // Family
  hasChildren: boolean("has_children").notNull().default(false),
  childName: text("child_name"),
  childAge: integer("child_age"),
  childCity: text("child_city"),
  childCountry: text("child_country"),
  // Financial
  grossMonthlySalary: real("gross_monthly_salary"),
  has13thSalary: boolean("has_13th_salary").notNull().default(false),
  targetRentMin: real("target_rent_min"),
  targetRentMax: real("target_rent_max"),
  // Health
  healthNotes: text("health_notes"), // e.g. "bilateral meniscus damage, torn ACL"
  // Languages
  primaryLanguages: text("primary_languages").notNull().default(""), // e.g. "EN, HU"
  germanLevel: text("german_level").notNull().default("none"), // none, basic, intermediate, fluent
  // Meta
  onboardingComplete: boolean("onboarding_complete").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userLanguageMeta = pgTable("user_language_meta", {
  userId: text("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  reviewStreak: integer("review_streak").notNull().default(0),
  lastReviewDate: text("last_review_date"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
