"use client";

import { useMemo, useState } from "react";
import { Heart, Plane, Train, Calendar, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { formatCHF } from "@/lib/utils";
import { PLANNED_VISITS, COST_DEFAULTS, KEY_DATES } from "@/lib/data/katie-visits";

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

export default function KatiePage() {
  const [viewMonth, setViewMonth] = useState(6); // July 2026
  const [viewYear] = useState(2026);
  const [hasHalfFare, setHasHalfFare] = useState(false);

  const visitStats = useMemo(() => {
    const totalVisits = PLANNED_VISITS.length;
    const flightVisits = PLANNED_VISITS.filter((v) => v.transportMode === "flight").length;
    const trainVisits = PLANNED_VISITS.filter((v) => v.transportMode === "train").length;

    const flightCost = flightVisits * COST_DEFAULTS.flightAvg;
    const trainCostPerTrip = hasHalfFare
      ? COST_DEFAULTS.trainHalfFare * 2
      : COST_DEFAULTS.trainFull * 2;
    const trainCost = trainVisits * trainCostPerTrip;
    const halfFareCost = hasHalfFare ? COST_DEFAULTS.halfFareCardAnnual : 0;
    const totalCost = flightCost + trainCost + halfFareCost;

    const totalDays = PLANNED_VISITS.reduce((sum, v) => {
      const start = new Date(v.startDate);
      const end = new Date(v.endDate);
      return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    }, 0);

    const avgInterval = totalVisits > 1 ? Math.round(180 / (totalVisits - 1)) : 0;

    return {
      totalVisits,
      flightVisits,
      trainVisits,
      flightCost,
      trainCost,
      halfFareCost,
      totalCost,
      totalDays,
      avgCostPerVisit: totalVisits > 0 ? Math.round(totalCost / totalVisits) : 0,
      avgInterval,
      monthlyCost: Math.round(totalCost / 6),
    };
  }, [hasHalfFare]);

  // Calendar rendering
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);

  // Check if a date falls within a visit
  const getVisitForDate = (day: number) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return PLANNED_VISITS.find((v) => dateStr >= v.startDate && dateStr <= v.endDate);
  };

  const getKeyDate = (day: number) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return KEY_DATES.find((k) => k.date === dateStr);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Katie Visit Planner
        </h1>
        <p className="text-sm text-text-tertiary mt-1">
          Every trip planned. Every CHF accounted for. Maximum Katie time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Stats */}
        <div className="lg:col-span-3 space-y-4">
          {/* Visit stats */}
          <div className="rounded-xl border border-border-default bg-bg-secondary p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Jul-Dec 2026
            </h3>
            <div className="text-center py-2">
              <p className="font-data text-4xl font-black text-pink-400">
                {visitStats.totalVisits}
              </p>
              <p className="text-[10px] text-text-muted uppercase">visits planned</p>
            </div>
            <div className="space-y-2 text-xs">
              <StatRow label="Total days together" value={`${visitStats.totalDays} days`} />
              <StatRow label="Avg interval" value={`${visitStats.avgInterval} days`} />
              <StatRow
                label="By flight"
                value={`${visitStats.flightVisits}x`}
                icon={<Plane className="h-3 w-3 text-purple-400" />}
              />
              <StatRow
                label="By train"
                value={`${visitStats.trainVisits}x`}
                icon={<Train className="h-3 w-3 text-cyan-400" />}
              />
            </div>
          </div>

          {/* Cost breakdown */}
          <div className="rounded-xl border border-border-default bg-bg-secondary p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Cost Projection
            </h3>
            <div className="text-center py-2">
              <p className="font-data text-3xl font-bold text-text-primary">
                {formatCHF(visitStats.totalCost)}
              </p>
              <p className="text-[10px] text-text-muted uppercase">6-month total</p>
            </div>
            <div className="space-y-2 text-xs">
              <StatRow label="Flights" value={formatCHF(visitStats.flightCost)} />
              <StatRow label="Trains" value={formatCHF(visitStats.trainCost)} />
              {hasHalfFare && (
                <StatRow label="Halbtax card" value={formatCHF(visitStats.halfFareCost)} />
              )}
              <div className="border-t border-border-subtle pt-2">
                <StatRow label="Per visit avg" value={formatCHF(visitStats.avgCostPerVisit)} />
                <StatRow label="Monthly avg" value={formatCHF(visitStats.monthlyCost)} />
              </div>
            </div>

            {/* Half-fare toggle */}
            <button
              onClick={() => setHasHalfFare(!hasHalfFare)}
              className={`w-full text-left text-[11px] rounded-lg border p-2 transition-colors ${
                hasHalfFare
                  ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400"
                  : "border-border-default bg-bg-primary/50 text-text-muted"
              }`}
            >
              <span className="font-medium">SBB Halbtax</span>
              <span className="text-[10px] ml-1">
                {hasHalfFare ? "Active (CHF 185/yr)" : "Not active — click to toggle"}
              </span>
            </button>
          </div>
        </div>

        {/* Center: Calendar */}
        <div className="lg:col-span-6">
          <div className="rounded-xl border border-border-default bg-bg-secondary p-5">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setViewMonth((m) => Math.max(0, m - 1))}
                className="p-1 rounded hover:bg-bg-tertiary text-text-muted"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <h3 className="font-display text-lg font-semibold text-text-primary">
                {MONTHS[viewMonth]} {viewYear}
              </h3>
              <button
                onClick={() => setViewMonth((m) => Math.min(11, m + 1))}
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
                      <span className="text-[8px] text-purple-300 mt-0.5">
                        {visit.transportMode === "flight" ? "fly" : "train"}
                      </span>
                    )}
                    {visit?.isSpecial && isVisitStart && (
                      <Star className="absolute top-0.5 right-0.5 h-2.5 w-2.5 text-pink-400" />
                    )}
                    {keyDate && !visit && (
                      <span className="text-[7px] text-amber-400 mt-0.5 leading-tight">
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
        </div>

        {/* Right: Visit list */}
        <div className="lg:col-span-3 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Planned Visits
          </h3>
          {PLANNED_VISITS.map((visit) => {
            const start = new Date(visit.startDate);
            const end = new Date(visit.endDate);
            const days = Math.ceil(
              (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
            );
            const cost =
              visit.transportMode === "flight"
                ? COST_DEFAULTS.flightAvg
                : hasHalfFare
                  ? COST_DEFAULTS.trainHalfFare * 2
                  : COST_DEFAULTS.trainFull * 2;

            return (
              <div
                key={visit.id}
                className={`rounded-lg border p-3 ${
                  visit.isSpecial
                    ? "border-pink-500/30 bg-pink-500/5"
                    : "border-border-default bg-bg-secondary"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {visit.transportMode === "flight" ? (
                      <Plane className="h-3 w-3 text-purple-400" />
                    ) : (
                      <Train className="h-3 w-3 text-cyan-400" />
                    )}
                    <span className="text-xs font-medium text-text-primary">
                      {start.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                      {" - "}
                      {end.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                  <span className="font-data text-[10px] text-text-muted">
                    {days}d | {formatCHF(cost)}
                  </span>
                </div>
                {visit.isSpecial && (
                  <span className="inline-block text-[9px] mt-1 px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300">
                    {visit.specialLabel}
                  </span>
                )}
                {visit.notes && (
                  <p className="text-[10px] text-text-muted mt-1 leading-snug">
                    {visit.notes}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-1.5 text-text-muted">
        {icon}
        {label}
      </span>
      <span className="font-data text-text-primary tabular-nums">{value}</span>
    </div>
  );
}
