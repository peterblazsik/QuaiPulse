"use client";

import { scoreColor, formatScore } from "@/lib/engines/scoring";
import { Tip } from "@/components/ui/tooltip";

interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  label?: string;
  showBar?: boolean;
}

export function ScoreBadge({
  score,
  size = "md",
  label,
  showBar = false,
}: ScoreBadgeProps) {
  const color = scoreColor(score);
  const sizes = {
    sm: "text-sm min-w-[36px] h-7",
    md: "text-lg min-w-[48px] h-9",
    lg: "text-2xl min-w-[60px] h-11",
  };

  return (
    <Tip content="Score out of 10. Red (0-3) = poor, Amber (4-6) = moderate, Green (7-10) = excellent">
    <div className="flex flex-col items-center gap-1" tabIndex={0}>
      <div
        className={`font-data font-bold flex items-center justify-center rounded-md px-2 ${sizes[size]}`}
        style={{ color, backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)` }}
      >
        {formatScore(score)}
      </div>
      {label && (
        <span className="text-[10px] uppercase tracking-wider text-text-muted">
          {label}
        </span>
      )}
      {showBar && (
        <div className="h-1 w-full rounded-full bg-bg-tertiary overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(score / 10) * 100}%`, backgroundColor: color }}
          />
        </div>
      )}
    </div>
    </Tip>
  );
}
