"use client";

import { ScoreRing } from "./score-ring";
import { DeltaBadge } from "./delta-badge";
import { getScoreLabel, getScoreColor } from "@/lib/engines/sleep-score";
import type { SleepScoreBreakdown } from "@/lib/engines/sleep-score";

const BREAKDOWN_ROWS: { key: keyof SleepScoreBreakdown; label: string; color: string }[] = [
  { key: "duration", label: "Duration", color: "#3b82f6" },
  { key: "quality", label: "Quality", color: "#22c55e" },
  { key: "latency", label: "Latency", color: "#06b6d4" },
  { key: "awakenings", label: "Wakeups", color: "#f59e0b" },
  { key: "consistency", label: "Consistency", color: "#8b5cf6" },
];

interface ScorePanelProps {
  breakdown: SleepScoreBreakdown;
  scoreDelta: number | null;
}

export function ScorePanel({ breakdown, scoreDelta }: ScorePanelProps) {
  return (
    <div className="card elevation-1 p-4 flex items-center gap-4 w-full">
      {/* Score ring */}
      <div className="flex-shrink-0 flex flex-col items-center">
        <div className="w-28 h-28">
          <ScoreRing breakdown={breakdown} />
        </div>
        <p className="text-[10px] font-semibold mt-1" style={{ color: getScoreColor(breakdown.total) }}>
          {getScoreLabel(breakdown.total)}
        </p>
        {scoreDelta !== null && (
          <DeltaBadge value={scoreDelta} suffix="pts" invertColor={false} />
        )}
      </div>

      {/* Breakdown bars */}
      <div className="flex-1 min-w-0 space-y-1.5">
        {BREAKDOWN_ROWS.map((row) => {
          const value = breakdown[row.key];
          return (
            <div key={row.key} className="flex items-center gap-2">
              <span className="text-[10px] text-text-muted w-[68px] shrink-0 text-right font-data">
                {row.label}
              </span>
              <div className="flex-1 h-[6px] bg-surface-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${value}%`,
                    backgroundColor: row.color,
                    opacity: value > 0 ? 0.85 : 0,
                  }}
                />
              </div>
              <span className="text-[10px] font-data w-7 text-right" style={{ color: row.color }}>
                {value}
              </span>
            </div>
          );
        })}
        <p className="text-[8px] text-text-muted mt-1 text-right">14-day composite · hover rings for detail</p>
      </div>
    </div>
  );
}
