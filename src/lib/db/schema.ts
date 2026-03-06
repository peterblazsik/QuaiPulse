import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const neighborhoods = sqliteTable("neighborhoods", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  kreis: integer("kreis").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  vibe: text("vibe").notNull(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  scoreCommute: real("score_commute").notNull(),
  scoreGym: real("score_gym").notNull(),
  scoreSocial: real("score_social").notNull(),
  scoreLake: real("score_lake").notNull(),
  scoreAirport: real("score_airport").notNull(),
  scoreFood: real("score_food").notNull(),
  scoreQuiet: real("score_quiet").notNull(),
  scoreTransit: real("score_transit").notNull(),
  noteCommute: text("note_commute"),
  noteGym: text("note_gym"),
  noteSocial: text("note_social"),
  noteLake: text("note_lake"),
  noteAirport: text("note_airport"),
  noteFood: text("note_food"),
  noteQuiet: text("note_quiet"),
  noteTransit: text("note_transit"),
  rentStudioMin: integer("rent_studio_min"),
  rentStudioMax: integer("rent_studio_max"),
  rentOneBrMin: integer("rent_one_br_min"),
  rentOneBrMax: integer("rent_one_br_max"),
  rentTwoBrMin: integer("rent_two_br_min"),
  rentTwoBrMax: integer("rent_two_br_max"),
  prosJson: text("pros_json"),
  consJson: text("cons_json"),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export const venues = sqliteTable("venues", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  neighborhoodId: text("neighborhood_id").references(() => neighborhoods.id),
  address: text("address"),
  lat: real("lat"),
  lng: real("lng"),
  website: text("website"),
  openingHours: text("opening_hours"),
  personalNote: text("personal_note"),
  monthlyPrice: real("monthly_price"),
  rating: real("rating"),
  tags: text("tags"),
});

export const apartments = sqliteTable("apartments", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  address: text("address"),
  neighborhoodId: text("neighborhood_id").references(() => neighborhoods.id),
  kreis: integer("kreis"),
  rooms: real("rooms"),
  sqm: real("sqm"),
  rent: integer("rent"),
  utilities: integer("utilities"),
  totalRent: integer("total_rent"),
  floor: integer("floor"),
  hasBalcony: integer("has_balcony", { mode: "boolean" }),
  hasElevator: integer("has_elevator", { mode: "boolean" }),
  hasDishwasher: integer("has_dishwasher", { mode: "boolean" }),
  availableFrom: text("available_from"),
  sourcePortal: text("source_portal"),
  sourceUrl: text("source_url"),
  lat: real("lat"),
  lng: real("lng"),
  overallScore: real("overall_score"),
  commuteMinutes: integer("commute_minutes"),
  nearestGym: text("nearest_gym"),
  nearestGymMinutes: integer("nearest_gym_minutes"),
  status: text("status").default("new"),
  notes: text("notes"),
  viewingDate: text("viewing_date"),
  savedAt: integer("saved_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export const budgetScenarios = sqliteTable("budget_scenarios", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  isDefault: integer("is_default", { mode: "boolean" }).default(false),
  rent: integer("rent").default(2400),
  healthInsurance: integer("health_insurance").default(350),
  foodDining: integer("food_dining").default(1075),
  transport: integer("transport").default(85),
  gym: integer("gym").default(100),
  electricity: integer("electricity").default(120),
  internet: integer("internet").default(110),
  flights: integer("flights").default(450),
  subscriptions: integer("subscriptions").default(200),
  misc: integer("misc").default(200),
  createdAt: integer("created_at", { mode: "timestamp" }),
});

export const katieVisits = sqliteTable("katie_visits", {
  id: text("id").primaryKey(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  transportMode: text("transport_mode").default("flight"),
  estimatedCost: integer("estimated_cost"),
  actualCost: integer("actual_cost"),
  notes: text("notes"),
  isConfirmed: integer("is_confirmed", { mode: "boolean" }).default(false),
  calendarEventId: text("calendar_event_id"),
});

export const checklistItems = sqliteTable("checklist_items", {
  id: text("id").primaryKey(),
  phase: text("phase").notNull(),
  category: text("category"),
  title: text("title").notNull(),
  description: text("description"),
  isCompleted: integer("is_completed", { mode: "boolean" }).default(false),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  dueDate: text("due_date"),
  sortOrder: integer("sort_order").default(0),
  url: text("url"),
});

export const dossierDocuments = sqliteTable("dossier_documents", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  status: text("status").default("missing"),
  filePath: text("file_path"),
  notes: text("notes"),
  obtainedAt: integer("obtained_at", { mode: "timestamp" }),
});

export const currencyRates = sqliteTable("currency_rates", {
  id: text("id").primaryKey(),
  pair: text("pair").notNull(),
  rate: real("rate").notNull(),
  fetchedAt: integer("fetched_at", { mode: "timestamp" }),
});

export const chatMessages = sqliteTable("chat_messages", {
  id: text("id").primaryKey(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  contextType: text("context_type"),
  contextId: text("context_id"),
  createdAt: integer("created_at", { mode: "timestamp" }),
});

export const preferences = sqliteTable("preferences", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});
