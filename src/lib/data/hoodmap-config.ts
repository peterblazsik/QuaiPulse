import type { HoodmapVibe } from "@/lib/types";

export const HOODMAP_VIBE_CONFIG: Record<
  HoodmapVibe,
  { label: string; color: string; bgClass: string; textClass: string; description: string }
> = {
  suits: {
    label: "Suits",
    color: "#1e40af",
    bgClass: "bg-blue-900/30",
    textClass: "text-blue-400",
    description: "Business professionals, corporate offices, finance district vibes",
  },
  rich: {
    label: "Rich",
    color: "#d97706",
    bgClass: "bg-amber-900/30",
    textClass: "text-amber-400",
    description: "Affluent area, expensive properties, luxury shops",
  },
  cool: {
    label: "Cool",
    color: "#16a34a",
    bgClass: "bg-green-900/30",
    textClass: "text-green-400",
    description: "Trendy, creative, cafes, independent shops, nightlife",
  },
  tourists: {
    label: "Tourists",
    color: "#eab308",
    bgClass: "bg-yellow-900/30",
    textClass: "text-yellow-400",
    description: "Tourist-heavy area, landmarks, hotels, souvenir shops",
  },
  uni: {
    label: "Uni",
    color: "#7c3aed",
    bgClass: "bg-violet-900/30",
    textClass: "text-violet-400",
    description: "Student area, universities, affordable, young energy",
  },
  normies: {
    label: "Normies",
    color: "#65a30d",
    bgClass: "bg-lime-900/30",
    textClass: "text-lime-400",
    description: "Regular residential, families, everyday life, suburban feel",
  },
  crime: {
    label: "Crime",
    color: "#dc2626",
    bgClass: "bg-red-900/30",
    textClass: "text-red-400",
    description: "Higher crime rates, caution advised at night",
  },
};
