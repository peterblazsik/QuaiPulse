"use client";

import { useState, useMemo } from "react";
import type { SleepEntry } from "@/lib/stores/sleep-store";
import { QUALITY_LABELS } from "@/lib/data/sleep-defaults";
import type { SleepQuality } from "@/lib/data/sleep-defaults";

const CELL_SIZE = 10;
const CELL_GAP = 2;
const CELL_RADIUS = 2;
const LEFT_LABEL_WIDTH = 14;
const TOP_LABEL_HEIGHT = 10;
const LEGEND_HEIGHT = 18;
const BOTTOM_MARGIN = 2;

const QUALITY_COLORS: Record<SleepQuality, string> = {
  1: "#ef4444",
  2: "#f97316",
  3: "#f59e0b",
  4: "#22c55e",
  5: "#10b981", // emerald for best — monotonic warm-to-cool
};

const NO_DATA_COLOR = "#1e293b";

const DAY_LABELS = [
  { index: 0, label: "M" },
  { index: 2, label: "W" },
  { index: 4, label: "F" },
];

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function getISODay(date: Date): number {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

interface TooltipData {
  x: number;
  y: number;
  date: string;
  entry: SleepEntry | undefined;
}

export function CalendarHeatmap({ entries }: { entries: SleepEntry[] }) {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const entryMap = useMemo(() => {
    const map = new Map<string, SleepEntry>();
    for (const e of entries) map.set(e.date, e);
    return map;
  }, [entries]);

  const { grid, weeks, monthLabels, streak } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let earliestEntry: Date | null = null;
    for (const e of entries) {
      const d = new Date(e.date + "T00:00:00");
      if (!earliestEntry || d < earliestEntry) earliestEntry = d;
    }

    let numWeeks = 16;
    if (earliestEntry) {
      const diffMs = today.getTime() - earliestEntry.getTime();
      const diffWeeks = Math.ceil(diffMs / (7 * 86400000)) + 1;
      numWeeks = clamp(diffWeeks, 16, 24);
    }

    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (numWeeks * 7 - 1));
    const startDay = getISODay(startDate);
    if (startDay !== 0) startDate.setDate(startDate.getDate() - startDay);

    const cells: { date: string; row: number; col: number; entry: SleepEntry | undefined }[] = [];
    const monthLabelPositions: { col: number; label: string }[] = [];
    let lastMonth = -1;
    const current = new Date(startDate);
    let col = 0;
    let totalWeeks = 0;

    while (current <= today) {
      const weekStart = new Date(current);
      for (let row = 0; row < 7; row++) {
        const cellDate = new Date(weekStart);
        cellDate.setDate(cellDate.getDate() + row);
        if (cellDate > today) break;
        const dateStr = cellDate.toISOString().split("T")[0];
        const month = cellDate.getMonth();
        if (month !== lastMonth) {
          monthLabelPositions.push({ col, label: MONTH_NAMES[month] });
          lastMonth = month;
        }
        cells.push({ date: dateStr, row, col, entry: entryMap.get(dateStr) });
      }
      current.setDate(current.getDate() + 7);
      col++;
      totalWeeks++;
    }

    // Current streak
    let currentStreak = 0;
    const checkDate = new Date(today);
    for (let i = 0; i < 365; i++) {
      const dStr = checkDate.toISOString().split("T")[0];
      const e = entryMap.get(dStr);
      if (e && e.quality >= 4) {
        currentStreak++;
      } else break;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return { grid: cells, weeks: totalWeeks, monthLabels: monthLabelPositions, streak: currentStreak };
  }, [entries, entryMap]);

  const tooltipData = useMemo<TooltipData | null>(() => {
    if (!hoveredDate) return null;
    const cell = grid.find((c) => c.date === hoveredDate);
    if (!cell) return null;
    return {
      x: LEFT_LABEL_WIDTH + cell.col * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2,
      y: TOP_LABEL_HEIGHT + cell.row * (CELL_SIZE + CELL_GAP),
      date: cell.date,
      entry: cell.entry,
    };
  }, [hoveredDate, grid]);

  const svgWidth = LEFT_LABEL_WIDTH + weeks * (CELL_SIZE + CELL_GAP) - CELL_GAP;
  const svgHeight = TOP_LABEL_HEIGHT + 7 * (CELL_SIZE + CELL_GAP) - CELL_GAP + LEGEND_HEIGHT + BOTTOM_MARGIN;

  const tooltipWidth = 150;
  const tooltipLineHeight = 12;
  const tooltipPadding = 6;

  function getTooltipLines(data: TooltipData): string[] {
    const lines: string[] = [formatDate(data.date)];
    if (data.entry) {
      const q = data.entry.quality as SleepQuality;
      lines.push(`Q${q} ${QUALITY_LABELS[q].label} \u2022 ${data.entry.hours}h`);
      if (data.entry.bedtime && data.entry.waketime) {
        lines.push(`${data.entry.bedtime} \u2192 ${data.entry.waketime}`);
      }
    } else {
      lines.push("No data");
    }
    return lines;
  }

  return (
    <div className="w-full">
      {streak > 0 && (
        <div className="flex items-center gap-1.5 font-data text-[10px] mb-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-slate-300">{streak}-day streak</span>
        </div>
      )}

      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto"
        role="img" aria-label="Sleep quality calendar heatmap">

        {/* Month labels */}
        {monthLabels.map((ml, i) => (
          <text key={`month-${i}`}
            x={LEFT_LABEL_WIDTH + ml.col * (CELL_SIZE + CELL_GAP)}
            y={TOP_LABEL_HEIGHT - 2} className="font-data" fontSize="6" fill="#64748b">
            {ml.label}
          </text>
        ))}

        {/* Day labels */}
        {DAY_LABELS.map((dl) => (
          <text key={`day-${dl.index}`} x={0}
            y={TOP_LABEL_HEIGHT + dl.index * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2 + 2}
            className="font-data" fontSize="6" fill="#64748b">
            {dl.label}
          </text>
        ))}

        {/* Grid cells */}
        {grid.map((cell) => {
          const cx = LEFT_LABEL_WIDTH + cell.col * (CELL_SIZE + CELL_GAP);
          const cy = TOP_LABEL_HEIGHT + cell.row * (CELL_SIZE + CELL_GAP);
          const quality = cell.entry?.quality as SleepQuality | undefined;
          const fillColor = quality ? QUALITY_COLORS[quality] : NO_DATA_COLOR;
          const isHovered = hoveredDate === cell.date;

          return (
            <rect key={cell.date} x={cx} y={cy}
              width={CELL_SIZE} height={CELL_SIZE} rx={CELL_RADIUS} ry={CELL_RADIUS}
              fill={fillColor}
              stroke={isHovered && quality ? QUALITY_COLORS[quality] : "none"}
              strokeWidth={isHovered ? 1.5 : 0}
              opacity={quality ? 1 : 0.35}
              style={{ cursor: "pointer", transition: "opacity 0.1s ease" }}
              onMouseEnter={() => setHoveredDate(cell.date)}
              onMouseLeave={() => setHoveredDate(null)}
            />
          );
        })}

        {/* Tooltip */}
        {tooltipData && (() => {
          const lines = getTooltipLines(tooltipData);
          const tooltipH = tooltipPadding * 2 + lines.length * tooltipLineHeight;
          let tx = tooltipData.x - tooltipWidth / 2;
          let ty = tooltipData.y - tooltipH - 6;
          if (tx < 0) tx = 0;
          if (tx + tooltipWidth > svgWidth) tx = svgWidth - tooltipWidth;
          if (ty < 0) ty = tooltipData.y + CELL_SIZE + 6;

          return (
            <g style={{ pointerEvents: "none" }}>
              <rect x={tx} y={ty} width={tooltipWidth} height={tooltipH}
                rx={5} fill="#0f172a" stroke="#334155" strokeWidth={1} />
              {lines.map((line, i) => (
                <text key={i} x={tx + tooltipPadding} y={ty + tooltipPadding + (i + 1) * tooltipLineHeight - 2}
                  className="font-data" fontSize="9"
                  fill={i === 0 ? "#e2e8f0" : "#94a3b8"}>
                  {line}
                </text>
              ))}
            </g>
          );
        })()}

        {/* Compact legend */}
        {(() => {
          const legendY = TOP_LABEL_HEIGHT + 7 * (CELL_SIZE + CELL_GAP) - CELL_GAP + BOTTOM_MARGIN + 2;
          const squareW = 8;
          const squareH = 6;
          const legendGap = 2;
          const startX = LEFT_LABEL_WIDTH;

          return (
            <g>
              <text x={startX} y={legendY + squareH} fontSize="6" fill="#64748b">Worse</text>
              {([1, 2, 3, 4, 5] as SleepQuality[]).map((q, i) => (
                <rect key={q} x={startX + 20 + i * (squareW + legendGap)} y={legendY}
                  width={squareW} height={squareH} rx={1.5} fill={QUALITY_COLORS[q]} />
              ))}
              <text x={startX + 20 + 5 * (squareW + legendGap) + 3} y={legendY + squareH}
                fontSize="6" fill="#64748b">Better</text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
