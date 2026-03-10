"use client";

import { Trophy, Activity } from "lucide-react";
import type { TopPerformer } from "@/lib/engines/protocol-recommender";

interface TopPerformersProps {
  performers: TopPerformer[];
}

export function TopPerformersPanel({ performers }: TopPerformersProps) {
  if (performers.length === 0) {
    return (
      <div className="card elevation-1 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="h-4 w-4 text-warning" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Top Performers</h2>
        </div>
        <p className="text-xs text-text-muted">Need more data to rank performers</p>
      </div>
    );
  }

  return (
    <div className="card elevation-1 p-5">
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="h-4 w-4 text-warning" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Top Performers</h2>
        <span className="text-[11px] text-text-muted ml-auto">ranked by Δ quality</span>
      </div>

      <div className="space-y-2">
        {performers.slice(0, 6).map((p, i) => (
          <div key={p.id} className="flex items-center gap-2.5 group">
            {/* Rank */}
            <span className="text-xs font-data text-text-muted w-4 text-right flex-shrink-0">
              {i + 1}
            </span>

            {/* Type icon */}
            {p.type === "supplement" ? (
              <div className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              </div>
            ) : (
              <Activity className="h-3.5 w-3.5 text-accent-primary flex-shrink-0" />
            )}

            {/* Name */}
            <span className="text-sm text-text-secondary flex-1 min-w-0 truncate">
              {p.name}
            </span>

            {/* Hit rate bar */}
            <div className="w-12 h-[5px] bg-bg-tertiary rounded-full overflow-hidden flex-shrink-0">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${p.hitRate * 100}%`,
                  backgroundColor: p.hitRate >= 0.7 ? "#22c55e" : p.hitRate >= 0.5 ? "#f59e0b" : "#64748b",
                }}
              />
            </div>

            {/* Delta */}
            <span className="text-xs font-data font-semibold w-9 text-right flex-shrink-0"
              style={{ color: p.delta >= 0.5 ? "#22c55e" : p.delta >= 0.2 ? "#3b82f6" : "#64748b" }}>
              {p.delta > 0 ? "+" : ""}{p.delta.toFixed(1)}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-2 pt-2 border-t border-border-default/30">
        <span className="text-[11px] text-text-muted">bars = hit rate (≥4 quality)</span>
        <span className="text-[11px] text-text-muted">nums = quality delta</span>
      </div>
    </div>
  );
}
