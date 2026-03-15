export const MOVE_DATE = new Date("2026-07-01T00:00:00");
export const DATA_FRESHNESS = "Mar 2026";
export const OFFICE_COORDS = { lat: 47.3629, lng: 8.5318 } as const; // Quai Zurich Campus, Mythenquai
/** 1 EUR ≈ 0.90 CHF (CHF is stronger than EUR) */
export const EUR_TO_CHF = 0.90;

export const NAVIGATION = [
  { label: "Dashboard", href: "/", icon: "LayoutDashboard", shortcut: "G D" },
  { label: "AI Chat", href: "/ai", icon: "Bot", shortcut: "G I" },
  { label: "Neighborhoods", href: "/neighborhoods", icon: "MapPin", shortcut: "G N" },
  { label: "Apartments", href: "/apartments", icon: "Building2", shortcut: "G A" },
  { label: "Rental Intel", href: "/rental-intel", icon: "TrendingUp", shortcut: "G R" },
  { label: "Gym Finder", href: "/gym-finder", icon: "Dumbbell", shortcut: "G F" },
  { label: "Social Map", href: "/social", icon: "Users", shortcut: "G S" },
  { label: "Budget", href: "/budget", icon: "Wallet", shortcut: "G B" },
  { label: "Subscriptions", href: "/subscriptions", icon: "CreditCard", shortcut: "G U" },
  { label: "Currency", href: "/currency", icon: "ArrowLeftRight", shortcut: "" },
  { label: "Price Compare", href: "/prices", icon: "ShoppingCart", shortcut: "" },
  { label: "Travel Intel", href: "/travel", icon: "Route", shortcut: "G T" },
  { label: "Flights", href: "/flights", icon: "Plane", shortcut: "G L" },
  { label: "Katie Planner", href: "/katie", icon: "Heart", shortcut: "G K" },
  { label: "Sleep Intelligence", href: "/sleep", icon: "Moon", shortcut: "G Z" },
  { label: "Weather", href: "/weather", icon: "CloudSun", shortcut: "" },
  { label: "Checklist", href: "/checklist", icon: "CheckSquare", shortcut: "G C" },
  { label: "Dossier", href: "/dossier", icon: "FileText", shortcut: "" },
  { label: "Language Prep", href: "/language", icon: "Languages", shortcut: "G P" },
  { label: "Settings", href: "/settings", icon: "Settings", shortcut: "" },
] as const;

export const SCORE_DIMENSIONS = [
  { key: "commute", label: "Commute", color: "var(--chart-commute)", defaultWeight: 9 },
  { key: "gym", label: "Gym Access", color: "var(--chart-gym)", defaultWeight: 10 },
  { key: "social", label: "Social Life", color: "var(--chart-social)", defaultWeight: 10 },
  { key: "lake", label: "Lake Access", color: "var(--chart-lake)", defaultWeight: 6 },
  { key: "airport", label: "Airport", color: "var(--chart-airport)", defaultWeight: 7 },
  { key: "food", label: "Food & Dining", color: "var(--chart-food)", defaultWeight: 8 },
  { key: "quiet", label: "Quiet Living", color: "var(--chart-quiet)", defaultWeight: 7 },
  { key: "transit", label: "Transit", color: "var(--chart-transit)", defaultWeight: 6 },
  { key: "cost", label: "Affordability", color: "var(--chart-cost)", defaultWeight: 7 },
  { key: "safety", label: "Safety", color: "var(--chart-safety)", defaultWeight: 6 },
  { key: "flightNoise", label: "Flight Noise", color: "var(--chart-flightNoise)", defaultWeight: 4 },
  { key: "parking", label: "Parking", color: "var(--chart-parking)", defaultWeight: 3 },
] as const;

/** Shared slider styling — 16px thumb, py-3 for ~40px touch target */
export const SLIDER_CLASSES =
  "w-full h-1.5 py-3 appearance-none rounded-full bg-bg-tertiary cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-primary [&::-webkit-slider-thumb]:cursor-pointer";
