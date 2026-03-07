"use client";

import { ScoreRing } from "./score-ring";
import { DeltaBadge } from "./delta-badge";
import { getScoreLabel, getScoreColor } from "@/lib/engines/sleep-score";
import type { SleepScoreBreakdown } from "@/lib/engines/sleep-score";
import type { SleepEntry } from "@/lib/stores/sleep-store";

interface ScoreOverviewProps {
  breakdown: SleepScoreBreakdown;
  scoreDelta: number | null;
  avgHours: number;
  avgQuality: number;
  avgLatency: number | null;
  avgAwakenings: number | null;
  last7: SleepEntry[];
}

export function ScoreOverview({ breakdown, scoreDelta, avgHours, avgQuality, avgLatency, avgAwakenings, last7 }: ScoreOverviewProps) {
  // Mini sparkline from last 7 days quality
  const sparklineMax = 5;
  const sparklineH = 24;
  const sparklineW = 80;
  const barW = sparklineW / Math.max(last7.length, 1) - 1;

  return (
    <div className="card elevation-1 p-5 flex flex-col">
      {/* Score ring + label */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-20 h-20 flex-shrink-0">
          <ScoreRing breakdown={breakdown} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold" style={{ color: getScoreColor(breakdown.total) }}>
            {getScoreLabel(breakdown.total)}
          </p>
          {scoreDelta !== null && (
            <DeltaBadge value={scoreDelta} suffix="pts" invertColor={false} />
          )}
          <p className="text-[11px] text-text-muted mt-0.5">14-day composite</p>
        </div>
      </div>

      {/* Micro KPIs */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-2 mb-3">
        <MicroKpi label="Hours" value={avgHours.toFixed(1)} color={avgHours >= 7 ? "#22c55e" : "#f59e0b"} />
        <MicroKpi label="Quality" value={avgQuality.toFixed(1)} color={avgQuality >= 4 ? "#22c55e" : avgQuality >= 3 ? "#f59e0b" : "#ef4444"} />
        <MicroKpi label="Latency" value={avgLatency != null ? `${Math.round(avgLatency)}m` : "—"} color={avgLatency != null && avgLatency <= 15 ? "#22c55e" : "#f59e0b"} />
        <MicroKpi label="Wakeups" value={avgAwakenings != null ? avgAwakenings.toFixed(1) : "—"} color={avgAwakenings != null && avgAwakenings <= 1 ? "#22c55e" : "#f59e0b"} />
      </div>

      {/* 7-day sparkline */}
      {last7.length > 0 && (
        <div className="pt-2 border-t border-border-default/30">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-text-muted uppercase tracking-wider">Last 7 nights</span>
          </div>
          <svg viewBox={`0 0 ${sparklineW} ${sparklineH}`} className="w-full h-6">
            {last7.slice(-7).map((e, i) => {
              const h = (e.quality / sparklineMax) * sparklineH;
              const x = i * (barW + 1);
              const color = e.quality >= 4 ? "#22c55e" : e.quality >= 3 ? "#f59e0b" : "#ef4444";
              return (
                <rect key={e.id} x={x} y={sparklineH - h} width={barW} height={h} rx={1} fill={color} opacity={0.75} />
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
}

function MicroKpi({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-xs text-text-muted">{label}</span>
      <span className="font-data text-sm font-semibold" style={{ color }}>{value}</span>
    </div>
  );
}
