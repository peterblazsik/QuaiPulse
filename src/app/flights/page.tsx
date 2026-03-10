"use client";

import { useState, useMemo } from "react";
import {
  Plane,
  TrendingDown,
  Calendar,
  Clock,
  ExternalLink,
  Sparkles,
  Heart,
} from "lucide-react";
import {
  AIRLINES,
  DAY_PRICING,
  BOOKING_WINDOWS,
  MONTH_PRICING,
  type AirlineRoute,
} from "@/lib/data/flights";
import { getRecommendation } from "@/lib/engines/flight-recommender";
import { PLANNED_VISITS } from "@/lib/data/katie-visits";

const DEMAND_COLORS: Record<string, string> = {
  low: "#22c55e",
  medium: "#f59e0b",
  high: "#ef4444",
};

const RATING_COLORS: Record<string, string> = {
  cheap: "#22c55e",
  moderate: "#f59e0b",
  expensive: "#ef4444",
};

export default function FlightsPage() {
  const [routeFilter, setRouteFilter] = useState<"ZRH-VIE" | "ZRH-BUD">(
    "ZRH-VIE",
  );
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const rec = useMemo(() => getRecommendation(), []);

  const katieVisitMonths = useMemo(() => {
    const months = new Set<string>();
    const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    PLANNED_VISITS.forEach(v => {
      const d = new Date(v.startDate);
      months.add(MONTH_NAMES[d.getMonth()]);
    });
    return months;
  }, []);

  const filteredAirlines = useMemo(
    () => AIRLINES.filter((a) => a.route === routeFilter),
    [routeFilter],
  );

  // Day-of-week chart dimensions
  const chartW = 500;
  const chartH = 140;
  const padLeft = 45;
  const padRight = 10;
  const padTop = 10;
  const padBottom = 28;
  const barAreaW = chartW - padLeft - padRight;
  const barAreaH = chartH - padTop - padBottom;
  const maxDayPrice = Math.max(...DAY_PRICING.map((d) => d.avgPrice));
  const barWidth = barAreaW / DAY_PRICING.length - 6;

  return (
    <div className="space-y-6 relative">
      {/* Ambient glow */}
      <div className="ambient-glow glow-cyan" />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Flight Scanner
          </h1>
          <p className="text-sm text-text-tertiary mt-1">
            ZRH&ndash;VIE intelligence for Katie visits. {AIRLINES.length}{" "}
            routes tracked, optimized for your biweekly schedule.
          </p>
        </div>
        <div className="flex items-center rounded-lg border border-border-default bg-bg-secondary overflow-hidden shrink-0">
          <button
            onClick={() => setRouteFilter("ZRH-VIE")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors ${
              routeFilter === "ZRH-VIE"
                ? "bg-accent-primary/15 text-accent-primary"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            <Plane className="h-3.5 w-3.5" />
            ZRH-VIE
          </button>
          <button
            onClick={() => setRouteFilter("ZRH-BUD")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors ${
              routeFilter === "ZRH-BUD"
                ? "bg-accent-primary/15 text-accent-primary"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            <Plane className="h-3.5 w-3.5" />
            ZRH-BUD
          </button>
        </div>
      </div>

      {/* Hero Recommendation Card */}
      <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-bg-secondary to-bg-secondary p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
            Optimal Strategy
          </h2>
        </div>
        <p className="font-display text-lg font-bold text-text-primary leading-snug">
          {rec.summary}
        </p>
        <div className="mt-3 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-data text-sm font-bold text-emerald-400">
              {rec.estimatedSaving}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-border-subtle">
          <MiniStat
            label="Best Day"
            value={rec.bestDay.day}
            sub={`EUR ${rec.bestDay.avgPrice} avg`}
          />
          <MiniStat
            label="Book Ahead"
            value={rec.bestWindow.label}
            sub={`${rec.bestWindow.savingsPct}% savings`}
          />
          <MiniStat
            label="Cheapest Airline"
            value={rec.cheapest.airline}
            sub={`EUR ${rec.cheapest.avgPrice} avg`}
          />
          <MiniStat
            label="Cheapest Month"
            value={rec.bestMonth.month}
            sub={`EUR ${rec.bestMonth.avgPrice} avg`}
          />
        </div>
      </div>

      {/* 12-col grid: Month heatmap (8-col) + Booking tips (4-col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Month Pricing Heatmap */}
        <div className="lg:col-span-8 rounded-xl border border-border-default bg-bg-secondary p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-3.5 w-3.5 text-text-muted" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              12-Month Price Heatmap (EUR)
            </h3>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2">
            {MONTH_PRICING.map((m) => (
              <div
                key={m.month}
                className={`relative rounded-lg border p-2 text-center transition-colors hover:border-accent-primary/30 cursor-pointer ${
                  selectedMonth === m.month ? "ring-2 ring-accent-primary border-accent-primary/50" : "border-border-subtle"
                }`}
                style={{
                  backgroundColor: `color-mix(in srgb, ${DEMAND_COLORS[m.demand]} 10%, transparent)`,
                }}
                onClick={() => setSelectedMonth(selectedMonth === m.month ? null : m.month)}
              >
                {katieVisitMonths.has(m.month) && (
                  <span className="absolute top-1 right-1 text-pink-400" title="Katie visit this month">
                    <Heart className="h-2.5 w-2.5 fill-pink-400" />
                  </span>
                )}
                <span className="text-[10px] font-semibold text-text-muted uppercase block">
                  {m.month}
                </span>
                <span
                  className="font-data text-lg font-bold block mt-0.5"
                  style={{ color: DEMAND_COLORS[m.demand] }}
                >
                  {m.avgPrice}
                </span>
                <span
                  className="text-[10px] uppercase tracking-wider block mt-0.5"
                  style={{ color: DEMAND_COLORS[m.demand] }}
                >
                  {m.demand}
                </span>
              </div>
            ))}
          </div>
          {selectedMonth && (
            <div className="mt-3 rounded-lg border border-accent-primary/20 bg-accent-primary/5 p-3">
              <p className="text-xs text-text-secondary">
                <span className="font-semibold text-accent-primary">{selectedMonth}</span> —
                Book {BOOKING_WINDOWS[1]?.label ?? "3-4 weeks"} ahead for best prices.
                {MONTH_PRICING.find(m => m.month === selectedMonth)?.demand === "high"
                  ? " High demand — book earlier for this month."
                  : MONTH_PRICING.find(m => m.month === selectedMonth)?.demand === "low"
                    ? " Low demand — more flexibility on timing."
                    : " Moderate demand — standard booking window works."}
              </p>
            </div>
          )}
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border-subtle">
            <div className="flex items-center gap-1.5">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: "#22c55e" }}
              />
              <span className="text-[10px] text-text-muted">Low demand</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: "#f59e0b" }}
              />
              <span className="text-[10px] text-text-muted">
                Medium demand
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: "#ef4444" }}
              />
              <span className="text-[10px] text-text-muted">High demand</span>
            </div>
          </div>
        </div>

        {/* Booking Window Tips */}
        <div className="lg:col-span-4 rounded-xl border border-border-default bg-bg-secondary p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-3.5 w-3.5 text-text-muted" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              When to Book
            </h3>
          </div>
          <div className="space-y-2">
            {BOOKING_WINDOWS.map((bw) => {
              const isPositive = bw.savingsPct > 0;
              const isNegative = bw.savingsPct < 0;
              return (
                <div
                  key={bw.weeksAhead}
                  className="rounded-lg border border-border-subtle p-2.5 hover:border-accent-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-text-primary">
                      {bw.label}
                    </span>
                    <span
                      className="font-data text-xs font-bold"
                      style={{
                        color: isPositive
                          ? "#22c55e"
                          : isNegative
                            ? "#ef4444"
                            : "var(--text-muted)",
                      }}
                    >
                      {isPositive ? "+" : ""}
                      {bw.savingsPct}%
                    </span>
                  </div>
                  <p className="text-[10px] text-text-muted leading-snug">
                    {bw.tip}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Airline Comparison Table */}
      <div className="rounded-xl border border-border-default bg-bg-secondary p-5">
        <div className="flex items-center gap-2 mb-4">
          <Plane className="h-3.5 w-3.5 text-text-muted" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Airline Comparison &mdash; {routeFilter}
          </h3>
          <span className="text-[10px] text-text-muted ml-auto">
            {filteredAirlines.length} carrier
            {filteredAirlines.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-[10px] font-semibold uppercase tracking-wider text-text-muted pb-2 pr-4">
                  Airline
                </th>
                <th className="text-[10px] font-semibold uppercase tracking-wider text-text-muted pb-2 pr-4">
                  Avg Price
                </th>
                <th className="text-[10px] font-semibold uppercase tracking-wider text-text-muted pb-2 pr-4">
                  Range
                </th>
                <th className="text-[10px] font-semibold uppercase tracking-wider text-text-muted pb-2 pr-4">
                  Duration
                </th>
                <th className="text-[10px] font-semibold uppercase tracking-wider text-text-muted pb-2 pr-4">
                  Frequency
                </th>
                <th className="text-[10px] font-semibold uppercase tracking-wider text-text-muted pb-2 pr-4">
                  Baggage
                </th>
                <th className="text-[10px] font-semibold uppercase tracking-wider text-text-muted pb-2" />
              </tr>
            </thead>
            <tbody>
              {filteredAirlines
                .sort((a, b) => a.avgPrice - b.avgPrice)
                .map((airline) => (
                  <AirlineRow key={airline.id} airline={airline} />
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Day-of-Week Price Chart */}
      <div className="rounded-xl border border-border-default bg-bg-secondary p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="h-3.5 w-3.5 text-text-muted" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Day-of-Week Pricing (EUR avg)
          </h3>
        </div>
        <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const y = padTop + barAreaH - pct * barAreaH;
            const val = Math.round(maxDayPrice * pct);
            return (
              <g key={pct}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={chartW - padRight}
                  y2={y}
                  stroke="var(--border-default)"
                  strokeWidth={0.5}
                  strokeDasharray={pct === 0 ? "0" : "4,4"}
                  opacity={0.4}
                />
                <text
                  x={padLeft - 6}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="central"
                  fill="var(--text-muted)"
                  fontSize={10}
                  fontFamily="var(--font-jetbrains), monospace"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {DAY_PRICING.map((d, i) => {
            const barSpacing = barAreaW / DAY_PRICING.length;
            const x = padLeft + i * barSpacing + (barSpacing - barWidth) / 2;
            const barH = (d.avgPrice / maxDayPrice) * barAreaH;
            const y = padTop + barAreaH - barH;
            const color = RATING_COLORS[d.rating];
            const isHovered = hoveredDay === i;

            return (
              <g
                key={d.day}
                onMouseEnter={() => setHoveredDay(i)}
                onMouseLeave={() => setHoveredDay(null)}
                className="cursor-pointer"
              >
                {/* Invisible hit area */}
                <rect
                  x={padLeft + i * barSpacing}
                  y={padTop}
                  width={barSpacing}
                  height={barAreaH + padBottom}
                  fill="transparent"
                />
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barH}
                  rx={3}
                  fill={color}
                  opacity={isHovered ? 0.9 : 0.6}
                  className="transition-opacity duration-150"
                />
                {/* Value on hover */}
                {isHovered && (
                  <>
                    <rect
                      x={x + barWidth / 2 - 22}
                      y={y - 20}
                      width={44}
                      height={16}
                      rx={3}
                      fill="var(--bg-secondary)"
                      stroke="var(--border-default)"
                      strokeWidth={1}
                    />
                    <text
                      x={x + barWidth / 2}
                      y={y - 9}
                      textAnchor="middle"
                      fill="var(--text-primary)"
                      fontSize={10}
                      fontFamily="var(--font-jetbrains), monospace"
                      fontWeight="bold"
                    >
                      EUR {d.avgPrice}
                    </text>
                  </>
                )}
                {/* Day label */}
                <text
                  x={x + barWidth / 2}
                  y={chartH - 6}
                  textAnchor="middle"
                  fill="var(--text-muted)"
                  fontSize={10}
                  fontFamily="var(--font-jetbrains), monospace"
                >
                  {d.day.slice(0, 3)}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="flex items-center gap-4 mt-2 pt-2 border-t border-border-subtle">
          <div className="flex items-center gap-1.5">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: "#22c55e" }}
            />
            <span className="text-[10px] text-text-muted">Cheap</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: "#f59e0b" }}
            />
            <span className="text-[10px] text-text-muted">Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: "#ef4444" }}
            />
            <span className="text-[10px] text-text-muted">Expensive</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function MiniStat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div>
      <span className="text-[10px] uppercase tracking-wider text-text-muted block">
        {label}
      </span>
      <span className="font-data text-sm font-bold text-text-primary block mt-0.5">
        {value}
      </span>
      <span className="text-[10px] text-text-tertiary block">{sub}</span>
    </div>
  );
}

function AirlineRow({ airline }: { airline: AirlineRoute }) {
  const cheapest = Math.min(
    ...AIRLINES.filter((a) => a.route === airline.route).map((a) => a.avgPrice),
  );
  const isCheapest = airline.avgPrice === cheapest;

  return (
    <tr className="border-b border-border-subtle last:border-0 hover:bg-bg-tertiary/30 transition-colors">
      <td className="py-2.5 pr-4">
        <div className="flex items-center gap-2">
          <span className="text-base" role="img" aria-label={airline.airline}>
            {airline.logo}
          </span>
          <div>
            <span className="text-xs font-semibold text-text-primary block">
              {airline.airline}
            </span>
            {isCheapest && (
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">
                Best Value
              </span>
            )}
          </div>
        </div>
      </td>
      <td className="py-2.5 pr-4">
        <span
          className="font-data text-sm font-bold"
          style={{ color: isCheapest ? "#22c55e" : "var(--text-primary)" }}
        >
          EUR {airline.avgPrice}
        </span>
      </td>
      <td className="py-2.5 pr-4">
        <span className="font-data text-xs text-text-tertiary">
          {airline.minPrice}&ndash;{airline.maxPrice}
        </span>
      </td>
      <td className="py-2.5 pr-4">
        <span className="font-data text-xs text-text-secondary">
          {Math.floor(airline.durationMin / 60)}h{" "}
          {airline.durationMin % 60 > 0
            ? `${airline.durationMin % 60}m`
            : ""}
        </span>
      </td>
      <td className="py-2.5 pr-4">
        <span className="text-xs text-text-tertiary">{airline.frequency}</span>
      </td>
      <td className="py-2.5 pr-4">
        <span className="text-[10px] text-text-muted leading-snug block max-w-[180px]">
          {airline.baggage}
        </span>
      </td>
      <td className="py-2.5">
        <a
          href={airline.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-primary hover:text-accent-hover"
          aria-label={`Book on ${airline.airline}`}
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </td>
    </tr>
  );
}
