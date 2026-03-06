import type { VenueType } from "@/lib/types";

export const VENUE_TYPE_LABELS: Record<VenueType, string> = {
  gym: "Gyms & Fitness",
  chess: "Chess",
  ai_meetup: "AI & Tech Meetups",
  swimming: "Swimming",
  cycling: "Cycling",
  restaurant: "Restaurants & Food",
  social: "Social Spots",
  coworking: "Coworking",
};

export const VENUE_TYPE_COLORS: Record<VenueType, string> = {
  gym: "#ef4444",
  chess: "#8b5cf6",
  ai_meetup: "#3b82f6",
  swimming: "#06b6d4",
  cycling: "#84cc16",
  restaurant: "#f97316",
  social: "#f59e0b",
  coworking: "#22c55e",
};

export const VENUE_TYPE_SHORT_LABELS: Record<VenueType, string> = {
  gym: "Gym",
  chess: "Chess",
  ai_meetup: "AI/Tech",
  swimming: "Swimming",
  cycling: "Cycling",
  restaurant: "Food",
  social: "Social",
  coworking: "Coworking",
};

export const VENUE_TYPE_TEXT_COLORS: Record<VenueType, string> = {
  gym: "text-emerald-400",
  chess: "text-amber-400",
  ai_meetup: "text-violet-400",
  swimming: "text-cyan-400",
  cycling: "text-lime-400",
  restaurant: "text-orange-400",
  social: "text-pink-400",
  coworking: "text-blue-400",
};
