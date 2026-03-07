"use client";

import { useState, useCallback } from "react";
import type { SleepEntry } from "@/lib/stores/sleep-store";
import { QUALITY_LABELS } from "@/lib/data/sleep-defaults";
import type { SleepQuality } from "@/lib/data/sleep-defaults";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function formatDateLabel(dateStr: string): string {
  return dateStr.slice(8); // just day number
}

export function GradientTrendChart({ entries }: { entries: SleepEntry[] }) {
  const [hover, setHover] = useState<{ x: number; idx: number } | null>(null);

  if (entries.length === 0) return null;

  const svgW = 700;
  const mainH = 240;
  const sparkH = 48;
  const totalH = mainH + sparkH;
  const pl = 32;
  const pr = 12;
  const pt = 12;
  const pb = 36;

  const plotW = svgW - pl - pr;
  const plotH = mainH - pt - pb;
  const n = entries.length;

  const maxHours = 10;
  const xStep = n > 1 ? plotW / (n - 1) : plotW;
  const xOf = (i: number) => pl + i * xStep;
  const yOf = (h: number) => pt + plotH - (h / maxHours) * plotH;

  // 3-point smoothing
  const smoothed = entries.map((e, i) => {
    if (n <= 2) return e.hours;
    if (i === 0) return (e.hours + entries[1].hours) / 2;
    if (i === n - 1) return (entries[n - 2].hours + e.hours) / 2;
    return (entries[i - 1].hours + e.hours + entries[i + 1].hours) / 3;
  });

  const topPoints = smoothed.map((h, i) => `${xOf(i)},${yOf(h)}`);
  const areaPath = `M${topPoints.join(" L")} L${xOf(n - 1)},${yOf(0)} L${xOf(0)},${yOf(0)} Z`;
  const linePath = `M${topPoints.join(" L")}`;

  const yTicks = [0, 2, 4, 6, 8, 10];

  const sparkTop = mainH + 4;
  const sparkPlotH = sparkH - 12;
  const sparkY = (q: number) => sparkTop + sparkPlotH - ((q - 1) / 4) * sparkPlotH;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = e.currentTarget;
      const rect = svg.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * svgW;
      const idx = clamp(Math.round((mouseX - pl) / xStep), 0, n - 1);
      setHover({ x: xOf(idx), idx });
    },
    [n, xStep],
  );

  const hoveredEntry = hover ? entries[hover.idx] : null;

  return (
    <svg
      viewBox={`0 0 ${svgW} ${totalH}`}
      className="w-full h-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHover(null)}
    >
      <defs>
        <linearGradient id="trendAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
        </linearGradient>
        <filter id="trendDotGlow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>
      </defs>

      {/* Reference band 7-9h */}
      <rect x={pl} y={yOf(9)} width={plotW} height={yOf(7) - yOf(9)}
        fill="rgba(99, 102, 241, 0.06)" />

      {/* Y grid */}
      {yTicks.map((t) => (
        <g key={`y-${t}`}>
          <line x1={pl} y1={yOf(t)} x2={svgW - pr} y2={yOf(t)}
            stroke="#1e293b" strokeWidth="1" strokeDasharray="4,4" />
          <text x={pl - 4} y={yOf(t)} textAnchor="end" dominantBaseline="central"
            className="font-data" fontSize="8" fill="#64748b">{t}h</text>
        </g>
      ))}

      {/* Area + line */}
      <path d={areaPath} fill="url(#trendAreaGrad)" />
      <path d={linePath} fill="none" stroke="#818cf8" strokeWidth="2" />

      {/* X labels (every 3rd when dense) */}
      {entries.map((e, i) => {
        const show = n <= 10 || i % 3 === 0;
        if (!show) return null;
        return (
          <text key={e.id} x={xOf(i)} y={mainH - pb + 16} textAnchor="end"
            className="font-data" fontSize="8" fill="#64748b"
            transform={`rotate(-35 ${xOf(i)} ${mainH - pb + 16})`}>
            {formatDateLabel(e.date)}
          </text>
        );
      })}

      {/* Quality sparkline */}
      {entries.map((e, i) => {
        const cx = xOf(i);
        const cy = sparkY(e.quality);
        const color = QUALITY_LABELS[e.quality].color;
        return (
          <g key={`spark-${e.id}`}>
            {i < n - 1 && (
              <line x1={cx} y1={cy} x2={xOf(i + 1)} y2={sparkY(entries[i + 1].quality)}
                stroke="#334155" strokeWidth="1" />
            )}
            <circle cx={cx} cy={cy} r="2.5" fill={color} />
          </g>
        );
      })}

      {/* Hover crosshair + tooltip */}
      {hover && hoveredEntry && (
        <g>
          <line x1={hover.x} y1={pt} x2={hover.x} y2={mainH - pb}
            stroke="#475569" strokeWidth="1" />
          <circle cx={hover.x} cy={yOf(smoothed[hover.idx])} r="4"
            fill="#818cf8" filter="url(#trendDotGlow)" />

          {(() => {
            const tooltipW = 140;
            const lineH = 12;
            const lines = [
              hoveredEntry.date,
              `${hoveredEntry.hours}h  Q${hoveredEntry.quality} ${QUALITY_LABELS[hoveredEntry.quality].label}`,
              hoveredEntry.sleepLatency != null ? `Latency: ${hoveredEntry.sleepLatency}min` : null,
              hoveredEntry.awakenings != null ? `Awakenings: ${hoveredEntry.awakenings}` : null,
            ].filter(Boolean) as string[];

            const actualH = lines.length * lineH + 12;
            let tx = hover.x + 10;
            let ty = yOf(smoothed[hover.idx]) - actualH - 8;
            if (tx + tooltipW > svgW - pr) tx = hover.x - tooltipW - 10;
            if (ty < pt) ty = pt + 4;

            return (
              <g style={{ pointerEvents: "none" }}>
                <rect x={tx} y={ty} width={tooltipW} height={actualH}
                  fill="#0f172a" stroke="#334155" strokeWidth="1" rx="5" />
                {lines.map((line, li) => (
                  <text key={li} x={tx + 6} y={ty + 12 + li * lineH}
                    className="font-data" fontSize="9"
                    fill={li === 0 ? "#e2e8f0" : "#94a3b8"}>
                    {line}
                  </text>
                ))}
              </g>
            );
          })()}
        </g>
      )}
    </svg>
  );
}
