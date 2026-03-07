"use client";

import { useState, useMemo } from "react";
import { Moon, TrendingUp, MapPin, Pill, Plus, Clock, Star } from "lucide-react";
import { useSleepStore } from "@/lib/stores/sleep-store";
import type { SleepEntry } from "@/lib/stores/sleep-store";
import {
  LOCATIONS,
  QUALITY_LABELS,
  SUPPLEMENTS,
  type SleepLocation,
  type SleepQuality,
} from "@/lib/data/sleep-defaults";

export default function SleepPage() {
  const { entries, addEntry } = useSleepStore();

  // Form state
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formHours, setFormHours] = useState(7.5);
  const [formQuality, setFormQuality] = useState<SleepQuality>(4);
  const [formLocation, setFormLocation] = useState<SleepLocation>("zurich");
  const [formSupplements, setFormSupplements] = useState<string[]>([]);
  const [formNotes, setFormNotes] = useState("");

  // Last 14 days entries for KPI calculations
  const last14 = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 14);
    const cutoffStr = cutoff.toISOString().split("T")[0];
    return entries.filter((e) => e.date >= cutoffStr).sort((a, b) => a.date.localeCompare(b.date));
  }, [entries]);

  // Last 30 days for trend chart
  const last30 = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const cutoffStr = cutoff.toISOString().split("T")[0];
    return entries.filter((e) => e.date >= cutoffStr).sort((a, b) => a.date.localeCompare(b.date));
  }, [entries]);

  // KPI: Avg hours
  const avgHours = useMemo(() => {
    if (last14.length === 0) return 0;
    return last14.reduce((sum, e) => sum + e.hours, 0) / last14.length;
  }, [last14]);

  // KPI: Avg quality
  const avgQuality = useMemo(() => {
    if (last14.length === 0) return 0;
    return last14.reduce((sum, e) => sum + e.quality, 0) / last14.length;
  }, [last14]);

  const avgQualityLabel = useMemo(() => {
    const rounded = Math.round(avgQuality) as SleepQuality;
    if (rounded < 1 || rounded > 5) return { label: "N/A", color: "#64748b" };
    return QUALITY_LABELS[rounded];
  }, [avgQuality]);

  // KPI: Best location
  const bestLocation = useMemo(() => {
    if (last14.length === 0) return { label: "N/A", avg: 0 };
    const byLoc: Record<string, { sum: number; count: number }> = {};
    for (const e of last14) {
      if (!byLoc[e.location]) byLoc[e.location] = { sum: 0, count: 0 };
      byLoc[e.location].sum += e.quality;
      byLoc[e.location].count++;
    }
    let best = { loc: "", avg: 0 };
    for (const [loc, data] of Object.entries(byLoc)) {
      const avg = data.sum / data.count;
      if (avg > best.avg) best = { loc, avg };
    }
    const label = LOCATIONS.find((l) => l.value === best.loc)?.label ?? best.loc;
    return { label, avg: best.avg };
  }, [last14]);

  // KPI: Best supplement
  const bestSupplement = useMemo(() => {
    if (last14.length === 0) return { label: "None", avg: 0 };
    const bySup: Record<string, { sum: number; count: number }> = {};
    for (const e of last14) {
      for (const s of e.supplements) {
        if (!bySup[s]) bySup[s] = { sum: 0, count: 0 };
        bySup[s].sum += e.quality;
        bySup[s].count++;
      }
    }
    if (Object.keys(bySup).length === 0) return { label: "None taken", avg: 0 };
    let best = { id: "", avg: 0 };
    for (const [id, data] of Object.entries(bySup)) {
      const avg = data.sum / data.count;
      if (avg > best.avg) best = { id, avg };
    }
    const label = SUPPLEMENTS.find((s) => s.id === best.id)?.name ?? best.id;
    return { label, avg: best.avg };
  }, [last14]);

  // Location quality averages for bar chart
  const locationStats = useMemo(() => {
    const byLoc: Record<string, { sum: number; count: number }> = {};
    for (const e of entries) {
      if (!byLoc[e.location]) byLoc[e.location] = { sum: 0, count: 0 };
      byLoc[e.location].sum += e.quality;
      byLoc[e.location].count++;
    }
    return LOCATIONS.map((l) => {
      const data = byLoc[l.value];
      return {
        location: l.label,
        avg: data ? data.sum / data.count : 0,
        count: data?.count ?? 0,
      };
    }).filter((d) => d.count > 0);
  }, [entries]);

  // Supplement correlation
  const supplementStats = useMemo(() => {
    const withSup: Record<string, { sum: number; count: number }> = {};
    const withoutSup: Record<string, { sum: number; count: number }> = {};

    for (const sup of SUPPLEMENTS) {
      withSup[sup.id] = { sum: 0, count: 0 };
      withoutSup[sup.id] = { sum: 0, count: 0 };
    }

    for (const e of entries) {
      for (const sup of SUPPLEMENTS) {
        if (e.supplements.includes(sup.id)) {
          withSup[sup.id].sum += e.quality;
          withSup[sup.id].count++;
        } else {
          withoutSup[sup.id].sum += e.quality;
          withoutSup[sup.id].count++;
        }
      }
    }

    return SUPPLEMENTS.map((sup) => ({
      ...sup,
      avgWith: withSup[sup.id].count > 0 ? withSup[sup.id].sum / withSup[sup.id].count : 0,
      avgWithout: withoutSup[sup.id].count > 0 ? withoutSup[sup.id].sum / withoutSup[sup.id].count : 0,
      countWith: withSup[sup.id].count,
      countWithout: withoutSup[sup.id].count,
    })).filter((s) => s.countWith > 0);
  }, [entries]);

  function handleSubmit() {
    addEntry({
      date: formDate,
      hours: formHours,
      quality: formQuality,
      location: formLocation,
      supplements: formSupplements,
      notes: formNotes || undefined,
    });
    // Reset form
    setFormDate(new Date().toISOString().split("T")[0]);
    setFormHours(7.5);
    setFormQuality(4);
    setFormLocation("zurich");
    setFormSupplements([]);
    setFormNotes("");
  }

  function toggleSupplement(id: string) {
    setFormSupplements((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Ambient glow */}
      <div className="ambient-glow glow-purple" />

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Sleep Tracker
        </h1>
        <p className="text-sm text-text-tertiary mt-1">
          {entries.length} nights logged. Track patterns, supplements, and location impact.
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Avg Hours */}
        <div className="card elevation-1 p-5 relative overflow-hidden">
          <div className="card-hover-line" />
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-text-muted" />
            <p className="section-label">Avg Hours (14d)</p>
          </div>
          <p className="mt-2 font-data text-4xl font-bold text-accent-primary">
            {avgHours.toFixed(1)}
          </p>
          <p className="mt-1 text-xs text-text-tertiary">hours per night</p>
        </div>

        {/* Avg Quality */}
        <div className="card elevation-1 p-5 relative overflow-hidden">
          <div className="card-hover-line" />
          <div className="flex items-center gap-2">
            <Star className="h-3.5 w-3.5 text-text-muted" />
            <p className="section-label">Avg Quality (14d)</p>
          </div>
          <p className="mt-2 font-data text-4xl font-bold" style={{ color: avgQualityLabel.color }}>
            {avgQuality.toFixed(1)}
          </p>
          <p className="mt-1 text-xs text-text-tertiary">{avgQualityLabel.label}</p>
        </div>

        {/* Best Location */}
        <div className="card elevation-1 p-5 relative overflow-hidden">
          <div className="card-hover-line" />
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-text-muted" />
            <p className="section-label">Best Location</p>
          </div>
          <p className="mt-2 font-data text-xl font-bold text-text-primary">
            {bestLocation.label}
          </p>
          <p className="mt-1 text-xs text-text-tertiary">
            avg quality {bestLocation.avg.toFixed(1)} / 5
          </p>
        </div>

        {/* Best Supplement */}
        <div className="card elevation-1 p-5 relative overflow-hidden">
          <div className="card-hover-line" />
          <div className="flex items-center gap-2">
            <Pill className="h-3.5 w-3.5 text-text-muted" />
            <p className="section-label">Best Supplement</p>
          </div>
          <p className="mt-2 font-data text-xl font-bold text-text-primary">
            {bestSupplement.label}
          </p>
          <p className="mt-1 text-xs text-text-tertiary">
            avg quality {bestSupplement.avg.toFixed(1)} / 5
          </p>
        </div>
      </div>

      {/* Trend chart + Entry form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Trend chart */}
        <div className="lg:col-span-8 card elevation-1 p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-3.5 w-3.5 text-text-muted" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Sleep Trend (Last 30 Days)
            </h2>
          </div>
          <TrendChart entries={last30} />
        </div>

        {/* Entry form */}
        <div className="lg:col-span-4 card elevation-1 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="h-3.5 w-3.5 text-text-muted" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Log Sleep
            </h2>
          </div>
          <div className="space-y-4">
            {/* Date */}
            <div>
              <label className="text-[10px] uppercase tracking-wider text-text-muted block mb-1">
                Date
              </label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full rounded-lg border border-border-default bg-bg-tertiary px-3 py-2 text-xs text-text-primary focus:border-accent-primary focus:outline-none"
              />
            </div>

            {/* Hours */}
            <div>
              <label className="text-[10px] uppercase tracking-wider text-text-muted block mb-1">
                Hours Slept
              </label>
              <input
                type="number"
                value={formHours}
                onChange={(e) => setFormHours(Number(e.target.value))}
                min={0}
                max={16}
                step={0.5}
                className="w-full rounded-lg border border-border-default bg-bg-tertiary px-3 py-2 text-xs text-text-primary font-data focus:border-accent-primary focus:outline-none"
              />
            </div>

            {/* Quality */}
            <div>
              <label className="text-[10px] uppercase tracking-wider text-text-muted block mb-1">
                Quality
              </label>
              <div className="flex gap-2">
                {([1, 2, 3, 4, 5] as SleepQuality[]).map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setFormQuality(q)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all"
                    style={{
                      backgroundColor:
                        formQuality === q
                          ? QUALITY_LABELS[q].color
                          : "var(--bg-tertiary)",
                      color:
                        formQuality === q ? "#fff" : "var(--text-muted)",
                      border:
                        formQuality === q
                          ? `2px solid ${QUALITY_LABELS[q].color}`
                          : "2px solid var(--border-default)",
                    }}
                    title={QUALITY_LABELS[q].label}
                  >
                    {q}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-text-muted mt-1">
                {QUALITY_LABELS[formQuality].label}
              </p>
            </div>

            {/* Location */}
            <div>
              <label className="text-[10px] uppercase tracking-wider text-text-muted block mb-1">
                Location
              </label>
              <select
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value as SleepLocation)}
                className="w-full rounded-lg border border-border-default bg-bg-tertiary px-3 py-2 text-xs text-text-primary focus:border-accent-primary focus:outline-none"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc.value} value={loc.value}>
                    {loc.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Supplements */}
            <div>
              <label className="text-[10px] uppercase tracking-wider text-text-muted block mb-1">
                Supplements
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SUPPLEMENTS.map((sup) => {
                  const active = formSupplements.includes(sup.id);
                  return (
                    <button
                      key={sup.id}
                      type="button"
                      onClick={() => toggleSupplement(sup.id)}
                      className="text-[10px] px-2.5 py-1 rounded-full transition-all font-medium"
                      style={{
                        backgroundColor: active
                          ? `color-mix(in srgb, ${sup.color} 20%, transparent)`
                          : "var(--bg-tertiary)",
                        color: active ? sup.color : "var(--text-muted)",
                        border: active
                          ? `1px solid color-mix(in srgb, ${sup.color} 40%, transparent)`
                          : "1px solid var(--border-default)",
                      }}
                    >
                      {sup.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-[10px] uppercase tracking-wider text-text-muted block mb-1">
                Notes
              </label>
              <textarea
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                rows={2}
                placeholder="Optional notes..."
                className="w-full rounded-lg border border-border-default bg-bg-tertiary px-3 py-2 text-xs text-text-primary placeholder:text-text-muted/50 focus:border-accent-primary focus:outline-none resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full rounded-lg bg-accent-primary px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-accent-hover flex items-center justify-center gap-2"
            >
              <Moon className="h-3.5 w-3.5" />
              Log Night
            </button>
          </div>
        </div>
      </div>

      {/* Location + Supplement correlation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Location quality bars */}
        <div className="card elevation-1 p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-3.5 w-3.5 text-text-muted" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Quality by Location
            </h2>
          </div>
          <LocationBars data={locationStats} />
        </div>

        {/* Supplement correlation */}
        <div className="card elevation-1 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Pill className="h-3.5 w-3.5 text-text-muted" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Supplement Correlation
            </h2>
          </div>
          <SupplementBars data={supplementStats} />
        </div>
      </div>
    </div>
  );
}

/* ──────────────────── Trend Chart ──────────────────── */

function TrendChart({ entries }: { entries: SleepEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-text-muted text-xs">
        No data yet. Log your first night above.
      </div>
    );
  }

  const W = 700;
  const H = 220;
  const PAD_L = 36;
  const PAD_R = 12;
  const PAD_T = 12;
  const PAD_B = 40;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;
  const maxHours = 10;
  const barGap = 2;
  const barW = Math.max(4, (chartW - barGap * entries.length) / entries.length);

  function yH(hours: number) {
    return PAD_T + chartH - (hours / maxHours) * chartH;
  }

  function yQ(quality: number) {
    return PAD_T + chartH - ((quality - 1) / 4) * chartH;
  }

  const qualityPoints = entries.map((e, i) => {
    const x = PAD_L + i * (barW + barGap) + barW / 2;
    const y = yQ(e.quality);
    return `${x},${y}`;
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Sleep trend chart">
      {/* Y-axis grid lines */}
      {[0, 2, 4, 6, 8, 10].map((h) => (
        <g key={h}>
          <line
            x1={PAD_L}
            y1={yH(h)}
            x2={W - PAD_R}
            y2={yH(h)}
            stroke="var(--border-subtle)"
            strokeWidth={0.5}
            strokeDasharray={h === 0 ? undefined : "3,3"}
          />
          <text
            x={PAD_L - 6}
            y={yH(h) + 3}
            textAnchor="end"
            fill="var(--text-muted)"
            fontSize={9}
            fontFamily="var(--font-data)"
          >
            {h}h
          </text>
        </g>
      ))}

      {/* Bars */}
      {entries.map((e, i) => {
        const x = PAD_L + i * (barW + barGap);
        const barH = (e.hours / maxHours) * chartH;
        const color = QUALITY_LABELS[e.quality].color;
        return (
          <g key={e.id}>
            <rect
              x={x}
              y={PAD_T + chartH - barH}
              width={barW}
              height={barH}
              rx={2}
              fill={color}
              opacity={0.7}
            >
              <title>
                {e.date}: {e.hours}h, quality {e.quality}/5
              </title>
            </rect>
            {/* Date labels - show every 3rd or if few entries */}
            {(entries.length <= 10 || i % 3 === 0) && (
              <text
                x={x + barW / 2}
                y={H - 6}
                textAnchor="middle"
                fill="var(--text-muted)"
                fontSize={8}
                fontFamily="var(--font-data)"
                transform={`rotate(-35, ${x + barW / 2}, ${H - 6})`}
              >
                {e.date.slice(5)}
              </text>
            )}
          </g>
        );
      })}

      {/* Quality line */}
      <polyline
        points={qualityPoints.join(" ")}
        fill="none"
        stroke="var(--accent-primary)"
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Quality dots */}
      {entries.map((e, i) => {
        const x = PAD_L + i * (barW + barGap) + barW / 2;
        const y = yQ(e.quality);
        return (
          <circle
            key={`dot-${e.id}`}
            cx={x}
            cy={y}
            r={3}
            fill="var(--accent-primary)"
            stroke="var(--bg-primary)"
            strokeWidth={1.5}
          >
            <title>Quality: {e.quality}/5 ({QUALITY_LABELS[e.quality].label})</title>
          </circle>
        );
      })}

      {/* Legend */}
      <rect x={PAD_L} y={2} width={8} height={8} rx={1} fill="#22c55e" opacity={0.7} />
      <text x={PAD_L + 12} y={9} fill="var(--text-muted)" fontSize={8}>
        Hours
      </text>
      <circle cx={PAD_L + 58} cy={6} r={3} fill="var(--accent-primary)" />
      <text x={PAD_L + 64} y={9} fill="var(--text-muted)" fontSize={8}>
        Quality
      </text>
    </svg>
  );
}

/* ──────────────────── Location Bars ──────────────────── */

function LocationBars({
  data,
}: {
  data: { location: string; avg: number; count: number }[];
}) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-text-muted text-xs">
        No location data yet.
      </div>
    );
  }

  const maxAvg = 5;
  const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6"];

  return (
    <div className="space-y-3">
      {data.map((d, i) => {
        const pct = (d.avg / maxAvg) * 100;
        return (
          <div key={d.location}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-text-secondary">{d.location}</span>
              <span className="font-data text-xs text-text-muted">
                {d.avg.toFixed(2)} / 5{" "}
                <span className="text-[10px] text-text-muted/60">({d.count}n)</span>
              </span>
            </div>
            <div className="h-3 rounded-full bg-bg-tertiary overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  backgroundColor: COLORS[i % COLORS.length],
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ──────────────────── Supplement Bars ──────────────────── */

function SupplementBars({
  data,
}: {
  data: {
    id: string;
    name: string;
    color: string;
    avgWith: number;
    avgWithout: number;
    countWith: number;
    countWithout: number;
  }[];
}) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-text-muted text-xs">
        No supplement data yet.
      </div>
    );
  }

  const W = 340;
  const H = data.length * 44 + 30;
  const PAD_L = 100;
  const PAD_R = 12;
  const BAR_H = 10;
  const ROW_H = 44;
  const chartW = W - PAD_L - PAD_R;
  const maxVal = 5;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Supplement correlation chart">
      {/* Legend */}
      <rect x={PAD_L} y={4} width={8} height={8} rx={1} fill="var(--accent-primary)" opacity={0.8} />
      <text x={PAD_L + 12} y={11} fill="var(--text-muted)" fontSize={8}>
        With
      </text>
      <rect x={PAD_L + 50} y={4} width={8} height={8} rx={1} fill="var(--text-muted)" opacity={0.3} />
      <text x={PAD_L + 62} y={11} fill="var(--text-muted)" fontSize={8}>
        Without
      </text>

      {data.map((sup, i) => {
        const y = 28 + i * ROW_H;
        const wWith = (sup.avgWith / maxVal) * chartW;
        const wWithout = (sup.avgWithout / maxVal) * chartW;

        return (
          <g key={sup.id}>
            {/* Label */}
            <text
              x={PAD_L - 8}
              y={y + BAR_H + 3}
              textAnchor="end"
              fill="var(--text-secondary)"
              fontSize={10}
            >
              {sup.name}
            </text>

            {/* With bar */}
            <rect
              x={PAD_L}
              y={y}
              width={Math.max(2, wWith)}
              height={BAR_H}
              rx={2}
              fill={sup.color}
              opacity={0.8}
            />
            <text
              x={PAD_L + wWith + 4}
              y={y + BAR_H - 1}
              fill="var(--text-muted)"
              fontSize={8}
              fontFamily="var(--font-data)"
            >
              {sup.avgWith.toFixed(1)}
            </text>

            {/* Without bar */}
            <rect
              x={PAD_L}
              y={y + BAR_H + 4}
              width={Math.max(2, wWithout)}
              height={BAR_H}
              rx={2}
              fill="var(--text-muted)"
              opacity={0.25}
            />
            <text
              x={PAD_L + wWithout + 4}
              y={y + BAR_H * 2 + 3}
              fill="var(--text-muted)"
              fontSize={8}
              fontFamily="var(--font-data)"
            >
              {sup.avgWithout.toFixed(1)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
