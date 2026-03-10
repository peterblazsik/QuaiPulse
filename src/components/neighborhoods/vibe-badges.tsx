"use client";

import { HOODMAP_VIBE_CONFIG } from "@/lib/data/hoodmap-config";
import type { HoodmapVibe } from "@/lib/types";

interface VibeBadgesProps {
  vibes: { vibe: HoodmapVibe; intensity: number }[];
  size?: "sm" | "md";
}

export function VibeBadges({ vibes, size = "sm" }: VibeBadgesProps) {
  if (!vibes || vibes.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {vibes.map(({ vibe, intensity }) => {
        const config = HOODMAP_VIBE_CONFIG[vibe];
        const opacity = Math.max(0.4, intensity);
        return (
          <span
            key={vibe}
            className={`inline-flex items-center rounded-full border border-white/5 ${config.bgClass} ${config.textClass} ${
              size === "sm"
                ? "px-1.5 py-0.5 text-[10px]"
                : "px-2 py-0.5 text-xs"
            } font-medium`}
            style={{ opacity }}
            title={`${config.label} (${Math.round(intensity * 100)}%) — ${config.description}`}
          >
            {config.label}
          </span>
        );
      })}
    </div>
  );
}

interface CrowdTagsProps {
  tags?: string[];
  size?: "sm" | "md";
}

export function CrowdTags({ tags, size = "sm" }: CrowdTagsProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag) => (
        <span
          key={tag}
          className={`inline-flex items-center rounded-full border border-white/5 bg-white/5 text-text-tertiary italic ${
            size === "sm"
              ? "px-1.5 py-0.5 text-[10px]"
              : "px-2 py-0.5 text-xs"
          }`}
          title={`Crowd-sourced tag from Hoodmaps`}
        >
          &ldquo;{tag}&rdquo;
        </span>
      ))}
    </div>
  );
}

interface LocationTypeBadgeProps {
  locationType: "zurich_kreis" | "lake_town";
  kreis?: number;
  region?: string;
}

export function LocationTypeBadge({ locationType, kreis, region }: LocationTypeBadgeProps) {
  if (locationType === "zurich_kreis" && kreis) {
    return (
      <span className="text-xs text-text-muted shrink-0">
        Kreis {kreis}
      </span>
    );
  }

  return (
    <span className="text-xs text-info/80 shrink-0">
      {region || "Lake Zurich"}
    </span>
  );
}
