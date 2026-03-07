"use client";

import { useState } from "react";
import type { SleepEntry } from "@/lib/stores/sleep-store";
import { QUALITY_LABELS } from "@/lib/data/sleep-defaults";
import type { SleepQuality } from "@/lib/data/sleep-defaults";

function timeToMinutesFrom20(time: string): number {
  const [h, m] = time.split(":").map(Number);
  const totalMin = h * 60 + m;
  const base = 20 * 60;
  if (totalMin >= base) return totalMin - base;
  return totalMin + 24 * 60 - base;
}

function formatDateLabel(dateStr: string): string {
  return dateStr.slice(8); // just day number
}

interface SleepWindowChartProps {
  entries: SleepEntry[];
}

export function SleepWindowChart({ entries }: SleepWindowChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const validEntries = entries.filter((e) => e.bedtime && e.waketime);
  if (validEntries.length === 0) return null;

  const padLeft = 28;
  const padRight = 8;
  const padTop = 4;
  const padBottom = 36; // extra for legend
  const rowHeight = 14;
  const rowGap = 2;

  const chartHeight = padTop + validEntries.length * (rowHeight + rowGap) + padBottom;
  const chartWidth = 400;
  const plotWidth = chartWidth - padLeft - padRight;

  const totalMinutes = 14 * 60; // 20:00 to 10:00
  const xScale = (minutes: number) => padLeft + (minutes / totalMinutes) * plotWidth;

  const timeLabels = ["20:00", "22:00", "00:00", "02:00", "04:00", "06:00", "08:00", "10:00"];
  const timeLabelMinutes = [0, 120, 240, 360, 480, 600, 720, 840];

  const ref2230 = timeToMinutesFrom20("22:30");
  const ref0600 = timeToMinutesFrom20("06:00");

  const hoveredEntry = hoveredIdx !== null ? validEntries[hoveredIdx] : null;

  return (
    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
      {/* Reference lines with labels */}
      <line x1={xScale(ref2230)} y1={padTop} x2={xScale(ref2230)} y2={chartHeight - padBottom}
        stroke="#475569" strokeWidth="1" strokeDasharray="3,3" />
      <text x={xScale(ref2230)} y={padTop - 1} textAnchor="middle"
        className="font-data" fontSize="9" fill="#475569">target</text>

      <line x1={xScale(ref0600)} y1={padTop} x2={xScale(ref0600)} y2={chartHeight - padBottom}
        stroke="#475569" strokeWidth="1" strokeDasharray="3,3" />
      <text x={xScale(ref0600)} y={padTop - 1} textAnchor="middle"
        className="font-data" fontSize="9" fill="#475569">target</text>

      {/* Rows */}
      {validEntries.map((entry, i) => {
        const y = padTop + i * (rowHeight + rowGap);
        const bedMin = timeToMinutesFrom20(entry.bedtime!);
        const wakeMin = timeToMinutesFrom20(entry.waketime!);
        const x1 = xScale(bedMin);
        const x2 = xScale(wakeMin);
        const barWidth = Math.max(x2 - x1, 2);
        const color = QUALITY_LABELS[entry.quality].color;
        const isHovered = hoveredIdx === i;

        // Weekend detection
        const dayOfWeek = new Date(entry.date + "T00:00:00").getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        return (
          <g key={entry.id}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}>

            {/* Weekend row tint */}
            {isWeekend && (
              <rect x={padLeft} y={y} width={plotWidth} height={rowHeight}
                fill="rgba(139, 92, 246, 0.04)" rx="2" />
            )}

            {/* Hover background */}
            {isHovered && (
              <rect x={padLeft} y={y} width={plotWidth} height={rowHeight}
                fill="white" opacity="0.04" rx="2" />
            )}

            {/* Date label */}
            <text x={padLeft - 3} y={y + rowHeight / 2} textAnchor="end"
              dominantBaseline="central" className="font-data" fontSize="10"
              fill={isWeekend ? "#8b5cf6" : "#64748b"}>
              {formatDateLabel(entry.date)}
            </text>

            {/* Sleep bar */}
            <rect x={x1} y={y + 1.5} width={barWidth} height={rowHeight - 3}
              rx="3" fill={color} opacity={isHovered ? 1.0 : 0.85} />
          </g>
        );
      })}

      {/* Styled tooltip */}
      {hoveredIdx !== null && hoveredEntry && (() => {
        const y = padTop + hoveredIdx * (rowHeight + rowGap);
        const bedMin = timeToMinutesFrom20(hoveredEntry.bedtime!);
        const tooltipW = 140;
        const lines = [
          hoveredEntry.date,
          `${hoveredEntry.bedtime} \u2013 ${hoveredEntry.waketime} (${hoveredEntry.hours}h)`,
          `Quality: ${hoveredEntry.quality}/5 ${QUALITY_LABELS[hoveredEntry.quality].label}`,
          hoveredEntry.sleepLatency != null ? `Latency: ${hoveredEntry.sleepLatency}m` : null,
          hoveredEntry.awakenings != null ? `Wakeups: ${hoveredEntry.awakenings}` : null,
        ].filter(Boolean) as string[];
        const lineH = 12;
        const tooltipH = lines.length * lineH + 12;
        let tx = xScale(bedMin) + 8;
        let ty = y - tooltipH - 4;
        if (tx + tooltipW > chartWidth - padRight) tx = xScale(bedMin) - tooltipW - 8;
        if (ty < 0) ty = y + rowHeight + 4;

        return (
          <g style={{ pointerEvents: "none" }}>
            <rect x={tx} y={ty} width={tooltipW} height={tooltipH}
              fill="#0f172a" stroke="#334155" strokeWidth="1" rx="5" />
            {lines.map((line, li) => (
              <text key={li} x={tx + 6} y={ty + 10 + li * lineH}
                className="font-data" fontSize="11"
                fill={li === 0 ? "#e2e8f0" : "#94a3b8"}>
                {line}
              </text>
            ))}
          </g>
        );
      })()}

      {/* X-axis labels */}
      {timeLabels.map((label, i) => (
        <text key={label} x={xScale(timeLabelMinutes[i])}
          y={chartHeight - padBottom + 12} textAnchor="middle"
          className="font-data" fontSize="10" fill="#64748b">
          {label}
        </text>
      ))}

      {/* Color legend */}
      {(() => {
        const legendY = chartHeight - 12;
        const squareW = 10;
        const gap = 3;
        const startX = padLeft;
        return (
          <g>
            <text x={startX} y={legendY + 4} fontSize="9" fill="#64748b">Worse</text>
            {([1, 2, 3, 4, 5] as SleepQuality[]).map((q, i) => (
              <rect key={q} x={startX + 28 + i * (squareW + gap)} y={legendY - 3}
                width={squareW} height={8} rx="1.5"
                fill={QUALITY_LABELS[q].color} />
            ))}
            <text x={startX + 28 + 5 * (squareW + gap) + 4} y={legendY + 4}
              fontSize="9" fill="#64748b">Better</text>
          </g>
        );
      })()}
    </svg>
  );
}
