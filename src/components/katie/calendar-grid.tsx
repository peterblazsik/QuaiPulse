"use client";

import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import type { KatieVisitData } from "@/lib/data/katie-visits";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday = 0
}

interface CalendarGridProps {
  viewMonth: number;
  viewYear: number;
  onMonthChange: (month: number) => void;
  visits: KatieVisitData[];
  keyDates: { date: string; label: string; type: string }[];
}

export function CalendarGrid({
  viewMonth,
  viewYear,
  onMonthChange,
  visits,
  keyDates,
}: CalendarGridProps) {
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);

  const getVisitForDate = (day: number) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return visits.find((v) => dateStr >= v.startDate && dateStr <= v.endDate);
  };

  const getKeyDate = (day: number) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return keyDates.find((k) => k.date === dateStr);
  };

  return (
    <div className="rounded-xl border border-border-default bg-bg-secondary p-5">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => onMonthChange(Math.max(0, viewMonth - 1))}
          className="p-1 rounded hover:bg-bg-tertiary text-text-muted"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h3 className="font-display text-lg font-semibold text-text-primary">
          {MONTHS[viewMonth]} {viewYear}
        </h3>
        <button
          onClick={() => onMonthChange(Math.min(11, viewMonth + 1))}
          className="p-1 rounded hover:bg-bg-tertiary text-text-muted"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-semibold uppercase tracking-wider text-text-muted py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for offset */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="h-14" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const visit = getVisitForDate(day);
          const keyDate = getKeyDate(day);
          const isVisitStart = visit?.startDate.endsWith(`-${String(day).padStart(2, "0")}`) &&
            visit.startDate.startsWith(`${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`);

          return (
            <div
              key={day}
              className={`h-14 rounded-lg text-center relative flex flex-col items-center justify-center transition-colors ${
                visit
                  ? visit.isSpecial
                    ? "bg-pink-500/20 border border-pink-500/30"
                    : "bg-purple-500/15 border border-purple-500/25"
                  : keyDate
                    ? "bg-amber-500/10 border border-amber-500/20"
                    : "bg-bg-primary/30 border border-transparent hover:border-border-default"
              }`}
            >
              <span
                className={`font-data text-sm ${
                  visit ? "text-text-primary font-semibold" : "text-text-secondary"
                }`}
              >
                {day}
              </span>
              {isVisitStart && visit && (
                <span className="text-[10px] text-purple-300 mt-0.5">
                  {visit.transportMode === "flight" ? "fly" : "train"}
                </span>
              )}
              {visit?.isSpecial && isVisitStart && (
                <Star className="absolute top-0.5 right-0.5 h-2.5 w-2.5 text-pink-400" />
              )}
              {keyDate && !visit && (
                <span className="text-[10px] text-amber-400 mt-0.5 leading-tight">
                  {keyDate.label.split(" ")[0]}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 text-[10px] text-text-muted">
        <span className="flex items-center gap-1">
          <div className="h-2.5 w-2.5 rounded bg-purple-500/30" /> Visit
        </span>
        <span className="flex items-center gap-1">
          <div className="h-2.5 w-2.5 rounded bg-pink-500/30" /> Special
        </span>
        <span className="flex items-center gap-1">
          <div className="h-2.5 w-2.5 rounded bg-amber-500/20" /> Key date
        </span>
      </div>
    </div>
  );
}
