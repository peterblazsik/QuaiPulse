"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { KreisSupply } from "@/lib/engines/rental-intelligence";

interface Props {
  data: KreisSupply[];
}

const COMPETITION_COLORS = {
  low: "#22c55e",
  medium: "#f59e0b",
  high: "#ef4444",
};

export function SupplyDemandChart({ data }: Props) {
  const chartData = data.map((d) => ({
    name: `K${d.kreis}`,
    count: d.count,
    commute: d.commuteMinutes,
    competition: d.competitionLevel,
  }));

  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          Supply by Kreis
        </h3>
        <div className="flex gap-3 text-[11px]">
          {(["low", "medium", "high"] as const).map((level) => (
            <span key={level} className="flex items-center gap-1 text-[var(--text-tertiary)]">
              <span
                className="inline-block w-2.5 h-2.5 rounded"
                style={{ backgroundColor: COMPETITION_COLORS[level] }}
              />
              {level}
            </span>
          ))}
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
            <XAxis
              dataKey="name"
              tick={{ fill: "var(--text-tertiary)", fontSize: 11 }}
              axisLine={{ stroke: "var(--border-default)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--text-tertiary)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--bg-elevated)",
                border: "1px solid var(--border-default)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "var(--text-primary)",
              }}
              formatter={(value, name) => [
                Number(value),
                name === "count" ? "Listings" : String(name),
              ]}
              labelFormatter={(label) => `Kreis ${label.replace("K", "")}`}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={COMPETITION_COLORS[entry.competition as keyof typeof COMPETITION_COLORS]}
                  fillOpacity={0.75}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
