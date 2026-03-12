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
import type { KreisDistribution } from "@/lib/engines/rental-intelligence";
import { formatCHF } from "@/lib/utils";

interface Props {
  data: KreisDistribution[];
}

const KREIS_COLORS: Record<number, string> = {
  1: "#3b82f6", 2: "#06b6d4", 3: "#8b5cf6", 4: "#f59e0b",
  5: "#ef4444", 6: "#22c55e", 7: "#ec4899", 8: "#14b8a6",
  9: "#f97316", 10: "#6366f1", 11: "#a855f7", 12: "#78716c",
};

export function PriceDistributionChart({ data }: Props) {
  const chartData = data.map((d) => ({
    name: `K${d.kreis}`,
    median: d.median,
    q1: d.q1,
    q3: d.q3,
    count: d.count,
    kreis: d.kreis,
  }));

  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-5">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
        Median Rent by Kreis
      </h3>
      <div className="h-64">
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
              tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--bg-elevated)",
                border: "1px solid var(--border-default)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "var(--text-primary)",
              }}
              formatter={(value) => [formatCHF(Number(value)), "Median"]}
              labelFormatter={(label) => `Kreis ${label.replace("K", "")}`}
            />
            <Bar dataKey="median" radius={[4, 4, 0, 0]}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={KREIS_COLORS[entry.kreis] ?? "#64748b"}
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {data.map((d) => (
          <span
            key={d.kreis}
            className="text-[11px] text-[var(--text-tertiary)] font-mono"
          >
            K{d.kreis}: {d.count} listings
          </span>
        ))}
      </div>
    </div>
  );
}
