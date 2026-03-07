"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Heart, Plane, Train, Calendar } from "lucide-react";
import { CalendarGrid } from "@/components/katie/calendar-grid";
import { formatCHF } from "@/lib/utils";
import { PLANNED_VISITS, COST_DEFAULTS, KEY_DATES } from "@/lib/data/katie-visits";
import { HERO_IMAGES } from "@/lib/data/images";

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

  return (
    <div className="space-y-6 relative">
      {/* Ambient glow */}
      <div className="ambient-glow glow-pink" />

      {/* Hero banner */}
      <div className="card-hero relative h-40 overflow-hidden rounded-xl">
        <Image
          src={HERO_IMAGES.katie}
          alt="Father and daughter at train station"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="img-overlay-full" />
        <div className="relative z-10 flex h-full flex-col justify-end p-6">
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Katie Visit Planner
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Every trip planned. Every CHF accounted for. Maximum Katie time.
          </p>
        </div>
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
          <CalendarGrid
            viewMonth={viewMonth}
            viewYear={viewYear}
            onMonthChange={setViewMonth}
            visits={PLANNED_VISITS}
            keyDates={KEY_DATES}
          />
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
                  <span className="inline-block text-[10px] mt-1 px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300">
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
