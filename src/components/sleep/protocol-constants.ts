import type { SupplementTier, InterventionCategory } from "@/lib/data/sleep-defaults";

export const TIER_CONFIG: Record<SupplementTier, { label: string; color: string; bg: string; border: string }> = {
  1: { label: "Tier 1", color: "#22c55e", bg: "rgba(34,197,94,0.10)", border: "rgba(34,197,94,0.25)" },
  2: { label: "Tier 2", color: "#f59e0b", bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.25)" },
  3: { label: "Tier 3", color: "#64748b", bg: "rgba(100,116,139,0.10)", border: "rgba(100,116,139,0.25)" },
};

export const EVIDENCE_CONFIG: Record<string, { color: string; bg: string }> = {
  high: { color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  moderate: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  low: { color: "#64748b", bg: "rgba(100,116,139,0.12)" },
};

export const CATEGORY_LABELS: Record<string, string> = {
  mineral: "Mineral",
  amino: "Amino Acid",
  herb: "Herbal",
  hormone: "Hormone",
  lipid: "Lipid",
  other: "Other",
};

export const INTERVENTION_CATEGORY_LABELS: Record<InterventionCategory, { label: string; icon: string }> = {
  exercise: { label: "Exercise", icon: "dumbbell" },
  breathing: { label: "Breathing", icon: "wind" },
  meditation: { label: "Meditation", icon: "brain" },
  environment: { label: "Environment", icon: "thermometer" },
  nutrition: { label: "Nutrition", icon: "utensils" },
  technology: { label: "Technology", icon: "monitor" },
  "cbt-i": { label: "CBT-I", icon: "book" },
};

export const STACK_LEVEL_CONFIG: Record<string, { color: string; bg: string; border: string; label: string }> = {
  beginner: { color: "#22c55e", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.20)", label: "Beginner" },
  intermediate: { color: "#3b82f6", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.20)", label: "Intermediate" },
  advanced: { color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.20)", label: "Advanced" },
  recovery: { color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.20)", label: "Recovery" },
};
