"use client";

interface LocationStat {
  location: string;
  avg: number;
  count: number;
}

const COLORS = [
  { from: "#3b82f6", to: "#60a5fa" },
  { from: "#22c55e", to: "#4ade80" },
  { from: "#f59e0b", to: "#fbbf24" },
  { from: "#8b5cf6", to: "#a78bfa" },
];

export function LocationBars({ data }: { data: LocationStat[] }) {
  if (data.length === 0) {
    return <div className="flex items-center justify-center h-32 text-text-muted text-xs">No location data yet.</div>;
  }

  return (
    <div className="space-y-3">
      {data.map((d, i) => {
        const pct = (d.avg / 5) * 100;
        const c = COLORS[i % COLORS.length];
        return (
          <div key={d.location}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-text-secondary">{d.location}</span>
              <span className="font-data text-xs text-text-muted">
                {d.avg.toFixed(2)} / 5{" "}
                <span className="text-[10px] text-text-muted/60">({d.count}n)</span>
              </span>
            </div>
            <div className="h-3 rounded-full bg-bg-tertiary overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${c.from}, ${c.to})`,
                  boxShadow: `0 0 8px ${c.from}40`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
