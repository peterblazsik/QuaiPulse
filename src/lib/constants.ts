export const MOVE_DATE = new Date("2026-07-01T00:00:00");
export const OFFICE_COORDS = { lat: 47.3629, lng: 8.5318 } as const; // Quai Zurich Campus, Mythenquai

export const NAVIGATION = [
  { label: "Dashboard", href: "/", icon: "LayoutDashboard", shortcut: "G D" },
  { label: "Neighborhoods", href: "/neighborhoods", icon: "MapPin", shortcut: "G N" },
  { label: "Budget", href: "/budget", icon: "Wallet", shortcut: "G B" },
  { label: "Apartments", href: "/apartments", icon: "Building2", shortcut: "G A" },
  { label: "Katie Planner", href: "/katie", icon: "Heart", shortcut: "G K" },
  { label: "Social Map", href: "/social", icon: "Users", shortcut: "G S" },
  { label: "Checklist", href: "/checklist", icon: "CheckSquare", shortcut: "G C" },
  { label: "AI Chat", href: "/ai", icon: "Bot", shortcut: "G I" },
  { label: "Currency", href: "/currency", icon: "ArrowLeftRight", shortcut: "" },
  { label: "Weather", href: "/weather", icon: "CloudSun", shortcut: "" },
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
] as const;
