"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Heart, Plane, Train, Calendar, Trash2, Plus, X, Sparkles } from "lucide-react";
import { Tip } from "@/components/ui/tooltip";
import { CalendarGrid } from "@/components/katie/calendar-grid";
import { formatCHF } from "@/lib/utils";
import { COST_DEFAULTS, KEY_DATES } from "@/lib/data/katie-visits";
import { DAY_PRICING } from "@/lib/data/flights";
import { HERO_IMAGES } from "@/lib/data/images";
import { useKatieStore } from "@/lib/stores/katie-store";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const cheapestDay = DAY_PRICING.reduce((a, b) => (a.avgPrice < b.avgPrice ? a : b));

function getFlightTip(startDate: string, transportMode: "flight" | "train"): string | null {
  if (transportMode !== "flight") return null;
  const d = new Date(startDate);
  const dayName = DAY_NAMES[d.getDay()];
  const dayData = DAY_PRICING.find((dp) => dp.day === dayName);
  if (!dayData || dayData.rating !== "expensive") return null;
  const saving = dayData.avgPrice - cheapestDay.avgPrice;
  return `${dayName} departures avg CHF ${dayData.avgPrice}. ${cheapestDay.day}s avg CHF ${cheapestDay.avgPrice} (save ~CHF ${saving}).`;
}

export default function KatiePage() {
  const { visits, addVisit, removeVisit } = useKatieStore();
  const [viewMonth, setViewMonth] = useState(6); // July 2026
  const [viewYear] = useState(2026);
  const [hasHalfFare, setHasHalfFare] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [newTransport, setNewTransport] = useState<"flight" | "train">("flight");
  const [newSpecial, setNewSpecial] = useState(false);
  const [newSpecialLabel, setNewSpecialLabel] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const handleAddVisit = () => {
    if (!newStartDate || !newEndDate) return;
    addVisit({
      startDate: newStartDate,
      endDate: newEndDate,
      transportMode: newTransport,
      isConfirmed: false,
      isSpecial: newSpecial,
      specialLabel: newSpecial ? newSpecialLabel : undefined,
      notes: newNotes || undefined,
    });
    setNewStartDate("");
    setNewEndDate("");
    setNewTransport("flight");
    setNewSpecial(false);
    setNewSpecialLabel("");
    setNewNotes("");
    setShowAddForm(false);
  };

  const visitStats = useMemo(() => {
    const totalVisits = visits.length;
    const flightVisits = visits.filter((v) => v.transportMode === "flight").length;
    const trainVisits = visits.filter((v) => v.transportMode === "train").length;

    const flightCost = flightVisits * COST_DEFAULTS.flightAvg;
    const trainCostPerTrip = hasHalfFare
      ? COST_DEFAULTS.trainHalfFare * 2
      : COST_DEFAULTS.trainFull * 2;
    const trainCost = trainVisits * trainCostPerTrip;
    const halfFareCost = hasHalfFare ? COST_DEFAULTS.halfFareCardAnnual : 0;
    const totalCost = flightCost + trainCost + halfFareCost;

    const totalDays = visits.reduce((sum, v) => {
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
  }, [hasHalfFare, visits]);

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
              <StatRow label="Total days together" value={`${visitStats.totalDays} days`} tooltip="Combined duration of all planned visits" />
              <StatRow label="Avg interval" value={`${visitStats.avgInterval} days`} tooltip="Average gap between visits. Target: every 2-3 weeks" />
              <StatRow
                label="By flight"
                value={`${visitStats.flightVisits}x`}
                icon={<Plane className="h-3 w-3 text-purple-400" />}
                tooltip="ZRH→VIE flights. Avg CHF 180 round-trip (Swiss/Austrian)"
              />
              <StatRow
                label="By train"
                value={`${visitStats.trainVisits}x`}
                icon={<Train className="h-3 w-3 text-info" />}
                tooltip="Zurich HB→Wien Hbf via Railjet. ~8h, CHF 98 with Halbtax"
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
              <StatRow label="Flights" value={formatCHF(visitStats.flightCost)} tooltip="Total flight costs (round-trip ZRH↔VIE)" />
              <StatRow label="Trains" value={formatCHF(visitStats.trainCost)} tooltip={`Total train costs${hasHalfFare ? " with Halbtax discount" : " at full price"}`} />
              {hasHalfFare && (
                <StatRow label="Halbtax card" value={formatCHF(visitStats.halfFareCost)} tooltip="SBB Half-Fare card annual cost. 50% off all Swiss rail travel" />
              )}
              <div className="border-t border-border-subtle pt-2">
                <StatRow label="Per visit avg" value={formatCHF(visitStats.avgCostPerVisit)} tooltip="Total travel cost divided by number of visits" />
                <StatRow label="Monthly avg" value={formatCHF(visitStats.monthlyCost)} tooltip="Total cost spread across 6 months (Jul-Dec 2026)" />
              </div>
            </div>

            {/* Half-fare toggle */}
            <Tip content="SBB Half-Fare card (Halbtax-Abo). CHF 185/yr for 50% off all Swiss public transport. Worth it with 3+ train trips/year" side="bottom">
              <button
                onClick={() => setHasHalfFare(!hasHalfFare)}
                className={`w-full text-left text-[11px] rounded-lg border p-2 transition-colors ${
                  hasHalfFare
                    ? "border-cyan-500/40 bg-cyan-500/10 text-info"
                    : "border-border-default bg-bg-primary/50 text-text-muted"
                }`}
              >
                <span className="font-medium">SBB Halbtax</span>
                <span className="text-[10px] ml-1">
                  {hasHalfFare ? "Active (CHF 185/yr)" : "Not active — click to toggle"}
                </span>
              </button>
            </Tip>
          </div>
        </div>

        {/* Center: Calendar */}
        <div className="lg:col-span-6">
          <CalendarGrid
            viewMonth={viewMonth}
            viewYear={viewYear}
            onMonthChange={setViewMonth}
            visits={visits}
            keyDates={KEY_DATES}
          />
        </div>

        {/* Right: Add form + Visit list */}
        <div className="lg:col-span-3 space-y-3">
          {/* Add Visit */}
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Planned Visits
            </h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
              aria-label={showAddForm ? "Close add visit form" : "Add a new visit"}
            >
              {showAddForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              {showAddForm ? "Cancel" : "Add Visit"}
            </button>
          </div>

          {showAddForm && (
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-3 space-y-3">
              <h4 className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">
                New Visit
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-text-muted block mb-1">Start date</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full rounded-md border border-border-default bg-bg-primary px-2 py-1.5 text-xs text-text-primary focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-text-muted block mb-1">End date</label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full rounded-md border border-border-default bg-bg-primary px-2 py-1.5 text-xs text-text-primary focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Transport mode */}
              <div>
                <label className="text-[10px] text-text-muted block mb-1">Transport</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewTransport("flight")}
                    className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition-colors ${
                      newTransport === "flight"
                        ? "border-purple-500/40 bg-purple-500/10 text-purple-400"
                        : "border-border-default bg-bg-primary/50 text-text-muted"
                    }`}
                  >
                    <Plane className="h-3 w-3" />
                    Flight
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTransport("train")}
                    className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition-colors ${
                      newTransport === "train"
                        ? "border-cyan-500/40 bg-cyan-500/10 text-info"
                        : "border-border-default bg-bg-primary/50 text-text-muted"
                    }`}
                  >
                    <Train className="h-3 w-3" />
                    Train
                  </button>
                </div>
              </div>

              {/* Special occasion */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setNewSpecial(!newSpecial)}
                  className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition-colors ${
                    newSpecial
                      ? "border-pink-500/40 bg-pink-500/10 text-pink-400"
                      : "border-border-default bg-bg-primary/50 text-text-muted"
                  }`}
                >
                  <Heart className="h-3 w-3" />
                  Special occasion
                </button>
              </div>
              {newSpecial && (
                <input
                  type="text"
                  placeholder="e.g. Birthday, Holiday..."
                  value={newSpecialLabel}
                  onChange={(e) => setNewSpecialLabel(e.target.value)}
                  className="w-full rounded-md border border-border-default bg-bg-primary px-2 py-1.5 text-xs text-text-primary placeholder:text-text-muted/50 focus:border-pink-500 focus:outline-none"
                />
              )}

              {/* Notes */}
              <div>
                <label className="text-[10px] text-text-muted block mb-1">Notes</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={2}
                  placeholder="Optional notes..."
                  className="w-full rounded-md border border-border-default bg-bg-primary px-2 py-1.5 text-xs text-text-primary placeholder:text-text-muted/50 focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>

              <button
                onClick={handleAddVisit}
                disabled={!newStartDate || !newEndDate}
                className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/30 disabled:cursor-not-allowed py-2 text-xs font-medium text-white transition-colors"
              >
                Add Visit
              </button>
            </div>
          )}

          {/* Visit cards */}
          {visits.map((visit) => {
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
                className={`relative group rounded-lg border p-3 ${
                  visit.isSpecial
                    ? "border-pink-500/30 bg-pink-500/5"
                    : "border-border-default bg-bg-secondary"
                }`}
              >
                <button
                  onClick={() => removeVisit(visit.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-danger/20"
                  aria-label={`Delete visit ${start.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`}
                >
                  <Trash2 className="h-3 w-3 text-danger" />
                </button>
                <div className="flex items-center justify-between pr-5">
                  <div className="flex items-center gap-2">
                    {visit.transportMode === "flight" ? (
                      <Plane className="h-3 w-3 text-purple-400" />
                    ) : (
                      <Train className="h-3 w-3 text-info" />
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
                {(() => {
                  const tip = getFlightTip(visit.startDate, visit.transportMode);
                  if (!tip) return null;
                  return (
                    <div className="flex items-start gap-1.5 mt-1.5 px-2 py-1.5 rounded bg-warning/10 border border-warning/20">
                      <Sparkles className="h-3 w-3 text-warning shrink-0 mt-0.5" />
                      <p className="text-[10px] text-warning leading-snug">{tip}</p>
                    </div>
                  );
                })()}
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
  tooltip,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  tooltip?: string;
}) {
  const row = (
    <div className="flex items-center justify-between" tabIndex={tooltip ? 0 : undefined}>
      <span className="flex items-center gap-1.5 text-text-muted">
        {icon}
        {label}
      </span>
      <span className="font-data text-text-primary tabular-nums">{value}</span>
    </div>
  );
  if (tooltip) {
    return <Tip content={tooltip}>{row}</Tip>;
  }
  return row;
}
