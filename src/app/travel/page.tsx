"use client";

import { useState, useMemo } from "react";
import {
  Plane,
  Train,
  Moon,
  Clock,
  Zap,
  Leaf,
  TrendingDown,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Briefcase,
  BedDouble,
  Timer,
  Skull,
  Sparkles,
  MapPin,
  Award,
  Info,
} from "lucide-react";
import {
  compareTravelModes,
  getWaterfallData,
  getChronotypeRecommendation,
  DEFAULT_HOURLY_RATE_CHF,
  type TravelAnalysis,
  type Chronotype,
} from "@/lib/engines/travel-calculator";
import { TRAVEL_ROUTES, TRAVEL_PASSES, STOPOVER_CITIES, type TravelMode } from "@/lib/data/travel-routes";
import { formatCHF } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────

const MODE_ICONS: Record<TravelMode, typeof Plane> = {
  flight: Plane,
  railjet: Train,
  nightjet: Moon,
};

const MODE_COLORS: Record<TravelMode, string> = {
  flight: "#f59e0b",
  railjet: "#3b82f6",
  nightjet: "#8b5cf6",
};

const CATEGORY_COLORS: Record<string, string> = {
  transit: "#64748b",
  buffer: "#ef4444",
  airport: "#ef4444",
  travel: "#3b82f6",
  sleep: "#8b5cf6",
};

const SLIDER_CLASSES =
  "w-full h-1.5 py-3 appearance-none rounded-full bg-bg-tertiary cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-primary [&::-webkit-slider-thumb]:cursor-pointer";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function formatHours(h: number): string {
  return h % 1 === 0 ? `${h}h` : `${h.toFixed(1)}h`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TravelPage() {
  const [tripsPerYear, setTripsPerYear] = useState(24);
  const [hourlyRate, setHourlyRate] = useState(DEFAULT_HOURLY_RATE_CHF);
  const [priceLevel, setPriceLevel] = useState<"min" | "avg" | "max">("avg");
  const [expandedWaterfall, setExpandedWaterfall] = useState<TravelMode | null>("flight");
  const [chronotype, setChronotype] = useState<Chronotype>("moderate");

  const comparison = useMemo(
    () => compareTravelModes(hourlyRate, tripsPerYear, priceLevel),
    [hourlyRate, tripsPerYear, priceLevel],
  );

  const outboundRec = useMemo(
    () => getChronotypeRecommendation(chronotype, "vie-zrh"),
    [chronotype],
  );
  const returnRec = useMemo(
    () => getChronotypeRecommendation(chronotype, "zrh-vie"),
    [chronotype],
  );

  return (
    <div className="space-y-6 relative">
      <div className="ambient-glow glow-purple" />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Travel Intelligence
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Vienna ↔ Zurich — door-to-door true cost analysis
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-text-muted">
            Ettingshausengasse, 1190 → Enge, Kreis 2
          </p>
          <p className="text-[10px] text-text-muted">
            {tripsPerYear} return trips/year
          </p>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="card elevation-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[11px] text-text-secondary">Trips per year</span>
              <span className="font-data text-xs text-text-primary">{tripsPerYear}</span>
            </div>
            <input
              type="range"
              min={6}
              max={52}
              step={1}
              value={tripsPerYear}
              onChange={(e) => setTripsPerYear(Number(e.target.value))}
              className={SLIDER_CLASSES}
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[11px] text-text-secondary">Hourly rate (time value)</span>
              <span className="font-data text-xs text-text-primary">{formatCHF(hourlyRate)}/h</span>
            </div>
            <input
              type="range"
              min={0}
              max={200}
              step={5}
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className={SLIDER_CLASSES}
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[11px] text-text-secondary">Ticket pricing</span>
              <span className="font-data text-xs text-text-primary capitalize">{priceLevel}</span>
            </div>
            <div className="flex gap-1.5 mt-1">
              {(["min", "avg", "max"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setPriceLevel(level)}
                  className={`flex-1 px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    priceLevel === level
                      ? "bg-accent-primary text-white"
                      : "bg-bg-tertiary text-text-muted hover:text-text-secondary"
                  }`}
                >
                  {level === "min" ? "Sparschiene" : level === "avg" ? "Average" : "Last minute"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── The Big Reveal: True Cost Ranking ── */}
      <div className="card elevation-2 p-5 border-l-4 border-purple-500">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4 flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-purple-400" />
          True Cost Per Return Trip
          <span className="text-[10px] font-normal normal-case ml-auto text-text-muted">
            ticket + transit + time + carbon − productive value
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {comparison.analyses
            .sort((a, b) => a.trueCostCHF - b.trueCostCHF)
            .map((a, i) => {
              const Icon = MODE_ICONS[a.mode];
              const isWinner = i === 0;
              return (
                <div
                  key={a.mode}
                  className={`rounded-xl border p-4 transition-all ${
                    isWinner
                      ? "border-purple-500/50 bg-purple-500/5 ring-1 ring-purple-500/20"
                      : "border-border-default bg-bg-secondary/50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="h-4 w-4" style={{ color: MODE_COLORS[a.mode] }} />
                    <span className="text-sm font-semibold text-text-primary">
                      {a.route.shortLabel}
                    </span>
                    {isWinner && (
                      <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold">
                        BEST VALUE
                      </span>
                    )}
                  </div>

                  {/* True cost - big number */}
                  <p className="font-data text-3xl font-black text-text-primary">
                    {formatCHF(a.trueCostCHF)}
                  </p>
                  <p className="text-[10px] text-text-muted mt-0.5">true cost per return trip</p>

                  {/* Cost waterfall breakdown */}
                  <div className="mt-3 space-y-1 text-[11px]">
                    <CostLine label="Ticket" value={a.ticketCostCHF} />
                    <CostLine label="Transit" value={a.transitCostCHF} />
                    <CostLine label="Dead time" value={a.timeCostCHF} color="text-red-400" />
                    <CostLine label="Carbon" value={a.carbonCostCHF} color="text-orange-400" />
                    {a.productivityValueCHF > 0 && (
                      <CostLine label="Productivity recovered" value={-a.productivityValueCHF} color="text-emerald-400" />
                    )}
                  </div>

                  {/* Key metrics */}
                  <div className="mt-3 pt-3 border-t border-border-subtle grid grid-cols-2 gap-2">
                    <MiniMetric icon={Timer} label="Waking hours" value={formatHours(a.wakingHoursConsumed)} />
                    <MiniMetric icon={Briefcase} label="Productive" value={formatHours(a.productiveHoursGained * 2)} />
                    <MiniMetric icon={Skull} label="Dead time" value={formatDuration(Math.round(a.deadTimeMin * 2))} />
                    <MiniMetric icon={Leaf} label="CO2" value={`${a.co2Kg} kg`} />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* ── The Killer Insight: Waking Hours Consumed ── */}
      <div className="card elevation-1 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4 flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-amber-400" />
          Waking Hours Consumed Per Trip
          <span className="text-[10px] font-normal normal-case ml-auto text-text-muted">
            total time minus sleep = actual cost to your day
          </span>
        </h2>

        <div className="space-y-3">
          {comparison.analyses
            .sort((a, b) => a.wakingHoursConsumed - b.wakingHoursConsumed)
            .map((a) => {
              const Icon = MODE_ICONS[a.mode];
              const maxWaking = Math.max(...comparison.analyses.map((x) => x.wakingHoursConsumed));
              const pct = maxWaking > 0 ? (a.wakingHoursConsumed / maxWaking) * 100 : 0;
              return (
                <div key={a.mode} className="flex items-center gap-3">
                  <div className="w-20 flex items-center gap-1.5 shrink-0">
                    <Icon className="h-3.5 w-3.5" style={{ color: MODE_COLORS[a.mode] }} />
                    <span className="text-xs text-text-secondary">{a.route.shortLabel}</span>
                  </div>
                  <div className="flex-1 h-6 rounded-full bg-bg-tertiary overflow-hidden relative">
                    <div
                      className="h-full rounded-full transition-all duration-700 flex items-center justify-end pr-2"
                      style={{
                        width: `${Math.max(5, pct)}%`,
                        backgroundColor: MODE_COLORS[a.mode],
                        opacity: 0.7,
                      }}
                    >
                      <span className="font-data text-[10px] font-bold text-white">
                        {formatHours(a.wakingHoursConsumed)}
                      </span>
                    </div>
                  </div>
                  <div className="w-24 text-right shrink-0">
                    <span className="font-data text-[10px] text-text-muted">
                      {Math.round(a.productivityRate)}% productive
                    </span>
                  </div>
                </div>
              );
            })}
        </div>

        <p className="text-[10px] text-text-muted mt-3 flex items-start gap-1">
          <Info className="h-3 w-3 mt-0.5 shrink-0" />
          The NightJet consumes ~{comparison.analyses.find((a) => a.mode === "nightjet")?.wakingHoursConsumed}h of waking
          time because you sleep through the journey. It is objectively the fastest mode in waking-hours cost.
        </p>
      </div>

      {/* ── Door-to-Door Waterfall Charts ── */}
      <div className="card elevation-1 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4 flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-blue-400" />
          Door-to-Door Segment Breakdown
        </h2>

        <div className="space-y-2">
          {(["flight", "railjet", "nightjet"] as TravelMode[]).map((mode) => {
            const route = TRAVEL_ROUTES.find((r) => r.id === mode)!;
            const bars = getWaterfallData(mode);
            const Icon = MODE_ICONS[mode];
            const isExpanded = expandedWaterfall === mode;

            return (
              <div key={mode} className="rounded-lg border border-border-default bg-bg-secondary/30 overflow-hidden">
                <button
                  onClick={() => setExpandedWaterfall(isExpanded ? null : mode)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-tertiary/30 transition-colors"
                >
                  <Icon className="h-4 w-4 shrink-0" style={{ color: MODE_COLORS[mode] }} />
                  <span className="text-sm font-medium text-text-primary">{route.shortLabel}</span>
                  <span className="font-data text-xs text-text-muted ml-auto mr-2">
                    {formatDuration(route.totalMin)} door-to-door
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-3.5 w-3.5 text-text-muted" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-1.5">
                    {/* Stacked horizontal bar */}
                    <div className="flex h-8 rounded-lg overflow-hidden mb-3">
                      {bars.map((bar, i) => {
                        const totalMin = bars.reduce((s, b) => s + b.minutes, 0);
                        const pct = (bar.minutes / totalMin) * 100;
                        if (pct < 1) return null;
                        return (
                          <div
                            key={i}
                            className="relative group flex items-center justify-center overflow-hidden border-r border-bg-primary/30 last:border-r-0"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: CATEGORY_COLORS[bar.category],
                              opacity: bar.productive ? 0.9 : 0.5,
                            }}
                          >
                            {pct > 8 && (
                              <span className="text-[10px] font-data font-bold text-white/90 truncate px-1">
                                {formatDuration(bar.minutes)}
                              </span>
                            )}
                            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-bg-primary border border-border-default rounded-md px-2 py-1 text-[10px] text-text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                              {bar.label}: {formatDuration(bar.minutes)}
                              {bar.note && <span className="block text-text-muted">{bar.note}</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Segment list */}
                    <div className="space-y-0.5">
                      {bars.map((bar, i) => (
                        <div key={i} className="flex items-center gap-2 py-0.5">
                          <div
                            className="w-2 h-2 rounded-sm shrink-0"
                            style={{ backgroundColor: CATEGORY_COLORS[bar.category] }}
                          />
                          <span className="text-[11px] text-text-secondary flex-1">{bar.label}</span>
                          <span className="font-data text-[11px] text-text-primary tabular-nums">
                            {formatDuration(bar.minutes)}
                          </span>
                          {bar.productive && (
                            <Briefcase className="h-2.5 w-2.5 text-emerald-400" />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-3 pt-2 border-t border-border-subtle mt-2">
                      {[
                        { label: "Transit", color: CATEGORY_COLORS.transit },
                        { label: "Wait/Buffer", color: CATEGORY_COLORS.buffer },
                        { label: "Travel", color: CATEGORY_COLORS.travel },
                        { label: "Sleep", color: CATEGORY_COLORS.sleep },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: item.color }} />
                          <span className="text-[10px] text-text-muted">{item.label}</span>
                        </div>
                      ))}
                      <div className="flex items-center gap-1 ml-auto">
                        <Briefcase className="h-2.5 w-2.5 text-emerald-400" />
                        <span className="text-[10px] text-text-muted">Productive</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Annual Projection ── */}
      <div className="card elevation-1 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4 flex items-center gap-2">
          <TrendingDown className="h-3.5 w-3.5 text-emerald-400" />
          Annual Projection ({tripsPerYear} trips)
        </h2>

        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left py-2 text-text-muted font-medium">Metric</th>
                {comparison.analyses.map((a) => {
                  const Icon = MODE_ICONS[a.mode];
                  return (
                    <th key={a.mode} className="text-right py-2 px-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Icon className="h-3 w-3" style={{ color: MODE_COLORS[a.mode] }} />
                        <span className="text-text-primary font-semibold">{a.route.shortLabel}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="font-data">
              <AnnualRow
                label="Ticket cost"
                values={comparison.analyses.map((a) => formatCHF(a.annualTicketCHF))}
                highlight="min"
                rawValues={comparison.analyses.map((a) => a.annualTicketCHF)}
              />
              <AnnualRow
                label="True cost (all-in)"
                values={comparison.analyses.map((a) => formatCHF(a.annualTrueCostCHF))}
                highlight="min"
                rawValues={comparison.analyses.map((a) => a.annualTrueCostCHF)}
                bold
              />
              <AnnualRow
                label="Dead hours"
                values={comparison.analyses.map((a) => `${a.annualDeadHours}h`)}
                highlight="min"
                rawValues={comparison.analyses.map((a) => a.annualDeadHours)}
              />
              <AnnualRow
                label="Productive hours"
                values={comparison.analyses.map((a) => `${a.annualProductiveHours}h`)}
                highlight="max"
                rawValues={comparison.analyses.map((a) => a.annualProductiveHours)}
              />
              <AnnualRow
                label="CO2 emissions"
                values={comparison.analyses.map((a) => `${(a.annualCo2Kg / 1000).toFixed(1)}t`)}
                highlight="min"
                rawValues={comparison.analyses.map((a) => a.annualCo2Kg)}
              />
            </tbody>
          </table>
        </div>

        {/* Insight callout */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <InsightCard
            icon={Zap}
            color="#8b5cf6"
            value={formatCHF(comparison.nightjetVsFlightAnnualSavingsCHF)}
            label="NightJet saves vs Flight/yr"
            sublabel="in true cost (time + money + carbon)"
          />
          <InsightCard
            icon={Briefcase}
            color="#3b82f6"
            value={`${comparison.railjetVsFlightProductiveHoursGained}h`}
            label="Extra productive hours/yr"
            sublabel="Railjet vs Flight (5.5h vs 0.5h per trip)"
          />
          <InsightCard
            icon={Leaf}
            color="#22c55e"
            value={`${(comparison.trainVsFlightCo2SavedKg / 1000).toFixed(1)}t`}
            label="CO2 saved by train/yr"
            sublabel={`${Math.round(comparison.trainVsFlightCo2SavedKg / comparison.analyses.find((a) => a.mode === "flight")!.annualCo2Kg * 100)}% reduction vs flying`}
          />
        </div>
      </div>

      {/* ── Chronotype Advisor ── */}
      <div className="card elevation-1 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4 flex items-center gap-2">
          <BedDouble className="h-3.5 w-3.5 text-indigo-400" />
          Sleep-Aware Travel Advisor
        </h2>

        <div className="flex gap-2 mb-4">
          {(["early", "moderate", "late"] as Chronotype[]).map((type) => (
            <button
              key={type}
              onClick={() => setChronotype(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                chronotype === type
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  : "bg-bg-tertiary text-text-muted hover:text-text-secondary border border-transparent"
              }`}
            >
              {type === "early" ? "Early Bird (22:00-06:00)" : type === "moderate" ? "Moderate (23:00-07:00)" : "Night Owl (00:00-08:00)"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChronoCard direction="Vienna → Zurich" rec={outboundRec} />
          <ChronoCard direction="Zurich → Vienna" rec={returnRec} />
        </div>
      </div>

      {/* ── Stopovers with Katie ── */}
      <div className="card elevation-1 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4 flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-rose-400" />
          Train Stopover Ideas (Katie Adventures)
        </h2>
        <p className="text-[11px] text-text-secondary mb-3">
          The Vienna-Zurich Railjet passes through stunning cities. Break the journey with Katie for a day trip.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {STOPOVER_CITIES.map((city) => (
            <div
              key={city.name}
              className="rounded-lg border border-border-default bg-bg-secondary/30 p-3"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm font-semibold text-text-primary">{city.name}</span>
                {city.kidFriendly && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 font-medium">
                    Katie-friendly
                  </span>
                )}
              </div>
              <p className="text-[11px] text-text-secondary">{city.highlight}</p>
              <p className="text-[10px] text-text-muted mt-1.5">
                {formatDuration(city.travelTimeFromViennaMin)} from Vienna
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Travel Passes & Cards ── */}
      <div className="card elevation-1 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4 flex items-center gap-2">
          <Award className="h-3.5 w-3.5 text-amber-400" />
          Recommended Passes & Cards
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TRAVEL_PASSES.map((pass) => {
            const modeIcons = pass.relevantFor.map((m) => MODE_ICONS[m]);
            return (
              <div
                key={pass.id}
                className={`rounded-lg border p-3 ${
                  pass.worthIt
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-border-default bg-bg-secondary/30"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-text-primary">{pass.name}</span>
                  <div className="flex items-center gap-1 ml-auto">
                    {modeIcons.map((Icon, i) => (
                      <Icon key={i} className="h-3 w-3 text-text-muted" />
                    ))}
                  </div>
                </div>
                <p className="font-data text-sm font-bold text-text-primary">
                  {formatCHF(Math.round(pass.annualCostEUR / 0.94))}/yr
                </p>
                <p className="text-[11px] text-text-secondary mt-1">{pass.benefit}</p>
                <p className="text-[10px] text-text-muted mt-1">{pass.note}</p>
                {pass.worthIt && (
                  <span className="inline-block mt-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
                    RECOMMENDED
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── The Paradigm Shift ── */}
      <div className="card elevation-2 p-5 border-l-4 border-indigo-500 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
        <h2 className="text-sm font-semibold text-text-primary mb-3">
          The Paradigm Shift
        </h2>
        <div className="space-y-2 text-[11px] text-text-secondary leading-relaxed">
          <p>
            <strong className="text-text-primary">Most people compare 1h20 flight vs 8h train and pick the flight.</strong> But
            the flight's 1h20 is a lie. Door-to-door, with the airport gauntlet on both sides, it's 4.5-5.5 hours —
            of which only 30 minutes are productive.
          </p>
          <p>
            The Railjet takes longer but gives you <strong className="text-text-primary">5-6 hours of deep work time</strong> at a
            proper table with power and wifi. The productive hour difference is{" "}
            <strong className="text-blue-400">{comparison.railjetVsFlightProductiveHoursGained}h/year</strong> — that's{" "}
            {Math.round(comparison.railjetVsFlightProductiveHoursGained / 8)} extra work days.
          </p>
          <p>
            The NightJet is the real revelation: you board after dinner, sleep through the journey, and wake up in
            Zurich. <strong className="text-purple-400">Zero waking hours consumed.</strong> It doesn't cost you a day — it
            gives you one.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CostLine({ label, value, color }: { label: string; value: number; color?: string }) {
  const isNegative = value < 0;
  return (
    <div className="flex justify-between items-center">
      <span className="text-text-muted">{label}</span>
      <span className={`font-data tabular-nums ${color ?? (isNegative ? "text-emerald-400" : "text-text-primary")}`}>
        {isNegative ? "−" : "+"}{formatCHF(Math.abs(value))}
      </span>
    </div>
  );
}

function MiniMetric({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="h-3 w-3 text-text-muted shrink-0" />
      <div>
        <p className="text-[10px] text-text-muted leading-none">{label}</p>
        <p className="font-data text-xs font-semibold text-text-primary">{value}</p>
      </div>
    </div>
  );
}

function AnnualRow({
  label,
  values,
  highlight,
  rawValues,
  bold,
}: {
  label: string;
  values: string[];
  highlight: "min" | "max";
  rawValues: number[];
  bold?: boolean;
}) {
  const bestIdx =
    highlight === "min"
      ? rawValues.indexOf(Math.min(...rawValues))
      : rawValues.indexOf(Math.max(...rawValues));

  return (
    <tr className="border-b border-border-subtle/50">
      <td className={`py-2 text-text-secondary ${bold ? "font-semibold" : ""}`}>{label}</td>
      {values.map((v, i) => (
        <td
          key={i}
          className={`text-right py-2 px-3 tabular-nums ${
            i === bestIdx ? "text-emerald-400 font-bold" : "text-text-primary"
          } ${bold ? "font-bold" : ""}`}
        >
          {v}
        </td>
      ))}
    </tr>
  );
}

function InsightCard({
  icon: Icon,
  color,
  value,
  label,
  sublabel,
}: {
  icon: typeof Zap;
  color: string;
  value: string;
  label: string;
  sublabel: string;
}) {
  return (
    <div className="rounded-lg border border-border-default bg-bg-secondary/50 p-3 text-center">
      <Icon className="h-4 w-4 mx-auto mb-1.5" style={{ color }} />
      <p className="font-data text-xl font-black text-text-primary">{value}</p>
      <p className="text-[11px] text-text-secondary mt-0.5">{label}</p>
      <p className="text-[10px] text-text-muted mt-0.5">{sublabel}</p>
    </div>
  );
}

function ChronoCard({
  direction,
  rec,
}: {
  direction: string;
  rec: ReturnType<typeof getChronotypeRecommendation>;
}) {
  const Icon = MODE_ICONS[rec.bestMode];
  return (
    <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
      <div className="flex items-center gap-2 mb-2">
        <ArrowRight className="h-3 w-3 text-indigo-400" />
        <span className="text-xs font-semibold text-text-primary">{direction}</span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4" style={{ color: MODE_COLORS[rec.bestMode] }} />
        <span className="text-sm font-bold text-text-primary">{rec.bestDeparture}</span>
      </div>
      <p className="text-[11px] text-text-secondary leading-relaxed">{rec.reasoning}</p>
      <div className="flex gap-3 mt-2">
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
          rec.sleepImpact === "none" ? "bg-emerald-500/15 text-emerald-400" :
          rec.sleepImpact === "mild" ? "bg-amber-500/15 text-amber-400" :
          "bg-red-500/15 text-red-400"
        }`}>
          Sleep: {rec.sleepImpact}
        </span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
          rec.arrivalEnergy === "high" ? "bg-emerald-500/15 text-emerald-400" :
          rec.arrivalEnergy === "moderate" ? "bg-amber-500/15 text-amber-400" :
          "bg-red-500/15 text-red-400"
        }`}>
          Energy: {rec.arrivalEnergy}
        </span>
      </div>
    </div>
  );
}
