export type SleepLocation = "zurich" | "vienna" | "travel" | "other";
export type SleepQuality = 1 | 2 | 3 | 4 | 5;

export interface Supplement {
  id: string;
  name: string;
  color: string;
}

export const LOCATIONS: { value: SleepLocation; label: string }[] = [
  { value: "zurich", label: "Zurich" },
  { value: "vienna", label: "Vienna (Katie visit)" },
  { value: "travel", label: "Travel / Hotel" },
  { value: "other", label: "Other" },
];

export const QUALITY_LABELS: Record<SleepQuality, { label: string; color: string }> = {
  1: { label: "Terrible", color: "#ef4444" },
  2: { label: "Poor", color: "#f97316" },
  3: { label: "Fair", color: "#f59e0b" },
  4: { label: "Good", color: "#22c55e" },
  5: { label: "Excellent", color: "#06b6d4" },
};

export const SUPPLEMENTS: Supplement[] = [
  { id: "melatonin", name: "Melatonin", color: "#8b5cf6" },
  { id: "magnesium", name: "Magnesium", color: "#3b82f6" },
  { id: "zinc", name: "Zinc", color: "#64748b" },
  { id: "valerian", name: "Valerian Root", color: "#22c55e" },
  { id: "cbd", name: "CBD Oil", color: "#f59e0b" },
  { id: "chamomile", name: "Chamomile Tea", color: "#f97316" },
];
