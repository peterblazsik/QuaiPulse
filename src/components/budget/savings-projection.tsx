"use client";

import { formatCHF } from "@/lib/utils";
import type { BudgetBreakdown } from "@/lib/engines/budget-calculator";

interface SavingsProjectionProps {
  breakdown: BudgetBreakdown;
}

const MONTHS = [
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
];

export function SavingsProjection({ breakdown }: SavingsProjectionProps) {
  const { annualSavingsProjection, surplus } = breakdown;
  const maxVal = Math.max(...annualSavingsProjection.map(Math.abs), 1);
  const isPositive = surplus >= 0;

  // SVG chart dimensions
  const w = 500;
  const h = 180;
  const padLeft = 60;
  const padRight = 10;
  const padTop = 10;
  const padBottom = 30;
  const chartW = w - padLeft - padRight;
  const chartH = h - padTop - padBottom;

  const points = annualSavingsProjection.map((val, i) => {
    const x = padLeft + (i / 11) * chartW;
    const y = isPositive
      ? padTop + chartH - (val / maxVal) * chartH
      : padTop + (Math.abs(val) / maxVal) * chartH;
    return { x, y, val };
  });

  const pathD =
    points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  // Area fill
  const baseline = isPositive ? padTop + chartH : padTop;
  const areaD = `${pathD} L ${points[points.length - 1].x} ${baseline} L ${points[0].x} ${baseline} Z`;

  const lineColor = isPositive ? "#22c55e" : "#ef4444";
  const fillColor = isPositive ? "#22c55e" : "#ef4444";

  // Y-axis ticks (4 values)
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((pct) => ({
    value: Math.round(maxVal * pct),
    y: padTop + chartH - pct * chartH,
  }));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          12-Month Savings Projection
        </h4>
        <span className="font-data text-sm font-bold" style={{ color: lineColor }}>
          {formatCHF(annualSavingsProjection[11])} total
        </span>
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
        {/* Grid lines */}
        {yTicks.map((tick) => (
          <g key={tick.value}>
            <line
              x1={padLeft}
              y1={tick.y}
              x2={w - padRight}
              y2={tick.y}
              stroke="var(--border-default)"
              strokeWidth={0.5}
              strokeDasharray={tick.value === 0 ? "0" : "4,4"}
              opacity={0.4}
            />
            <text
              x={padLeft - 8}
              y={tick.y}
              textAnchor="end"
              dominantBaseline="central"
              fill="var(--text-muted)"
              fontSize={9}
              fontFamily="var(--font-jetbrains), monospace"
            >
              {tick.value >= 1000
                ? `${(tick.value / 1000).toFixed(0)}k`
                : tick.value}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <path d={areaD} fill={fillColor} opacity={0.1} />

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke={lineColor}
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={3} fill={lineColor} />
            {/* Month labels */}
            <text
              x={p.x}
              y={h - 8}
              textAnchor="middle"
              fill="var(--text-muted)"
              fontSize={8}
              fontFamily="var(--font-jetbrains), monospace"
            >
              {MONTHS[i]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
