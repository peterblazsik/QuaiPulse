"use client";

import { useState, useEffect, useCallback } from "react";
import { TrendingUp, Star, Clock, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { useSleepStore } from "@/lib/stores/sleep-store";
import { useSleepAnalytics } from "@/lib/hooks/use-sleep-analytics";
import { useSleepForm } from "@/lib/hooks/use-sleep-form";

import { ProtocolHero } from "@/components/sleep/protocol-hero";
import { TopPerformersPanel } from "@/components/sleep/top-performers";
import { ScoreOverview } from "@/components/sleep/score-overview";
import { ProtocolScreener } from "@/components/sleep/protocol-screener";
import { ComboMatrixChart } from "@/components/sleep/combo-matrix";
import { AdvisoryFeed } from "@/components/sleep/advisory-feed";
import { EntrySlideOver } from "@/components/sleep/entry-slide-over";
import { GradientTrendChart } from "@/components/sleep/trend-chart";
import { CalendarHeatmap } from "@/components/sleep/calendar-heatmap";
import { SleepWindowChart } from "@/components/sleep/sleep-window-chart";
import { RecentEntries } from "@/components/sleep/recent-entries";
import { DeltaBadge } from "@/components/sleep/delta-badge";

export default function SleepPage() {
  const { entries, addEntry, removeEntry, updateEntry } = useSleepStore();
  const analytics = useSleepAnalytics();
  const form = useSleepForm();
  const [entryOpen, setEntryOpen] = useState(false);
  const [trackingOpen, setTrackingOpen] = useState(false);

  function handleSubmit() {
    const entry = form.buildEntry();
    if (form.editingId) {
      updateEntry(form.editingId, entry);
    } else {
      addEntry(entry);
    }
    form.resetForm();
  }

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger when typing in inputs
    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT") return;

    switch (e.key.toLowerCase()) {
      case "n": setEntryOpen(true); break;
      case "t": setTrackingOpen((v) => !v); break;
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Last 7 for sparkline
  const last7 = analytics.last14.slice(-7);

  return (
    <div className="space-y-4 relative">
      <div className="ambient-glow glow-purple" />

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Sleep Intelligence</h1>
          <p className="text-sm text-text-tertiary mt-0.5">
            {entries.length} nights · Protocol optimization · Correlation analysis
          </p>
        </div>
        <button onClick={() => setEntryOpen(true)}
          className="flex items-center gap-2 text-xs px-4 py-2 rounded-lg bg-accent-primary text-white hover:bg-accent-hover transition-colors font-semibold">
          <Plus className="h-3.5 w-3.5" />
          Log Night
          <kbd className="text-[10px] opacity-60 ml-1 px-1 py-0.5 rounded bg-white/10">N</kbd>
        </button>
      </div>

      {/* ── Row 0: Command Center Hero ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-5 flex">
          <div className="w-full">
            <ProtocolHero protocol={analytics.tonightProtocol} />
          </div>
        </div>
        <div className="lg:col-span-4 flex">
          <div className="w-full">
            <TopPerformersPanel performers={analytics.topPerformers} />
          </div>
        </div>
        <div className="lg:col-span-3 flex">
          <div className="w-full">
            <ScoreOverview
              breakdown={analytics.scoreBreakdown}
              scoreDelta={analytics.scoreDelta}
              avgHours={analytics.avgHours}
              avgQuality={analytics.avgQuality}
              avgLatency={analytics.avgLatency}
              avgAwakenings={analytics.avgAwakenings}
              last7={last7}
            />
          </div>
        </div>
      </div>

      {/* ── Row 1: Micro KPIs ──────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MicroKpiCard
          label="Avg Hours"
          value={analytics.avgHours.toFixed(1)}
          delta={analytics.prevAvgHours != null ? analytics.avgHours - analytics.prevAvgHours : null}
          deltaSuffix="h"
          color={analytics.avgHours >= 7 ? "#22c55e" : "#f59e0b"}
        />
        <MicroKpiCard
          label="Avg Quality"
          value={analytics.avgQuality.toFixed(1)}
          delta={analytics.prevAvgQuality != null ? analytics.avgQuality - analytics.prevAvgQuality : null}
          color={analytics.avgQualityLabel.color}
          subtitle={analytics.avgQualityLabel.label}
        />
        <MicroKpiCard
          label="Avg Latency"
          value={analytics.avgLatency != null ? `${Math.round(analytics.avgLatency)}m` : "—"}
          delta={analytics.avgLatency != null && analytics.prevAvgLatency != null ? analytics.avgLatency - analytics.prevAvgLatency : null}
          deltaSuffix="m"
          invertDelta
          color={analytics.avgLatency != null && analytics.avgLatency <= 15 ? "#22c55e" : "#f59e0b"}
        />
        <MicroKpiCard
          label="Avg Wakeups"
          value={analytics.avgAwakenings != null ? analytics.avgAwakenings.toFixed(1) : "—"}
          delta={analytics.avgAwakenings != null && analytics.prevAvgAwakenings != null ? analytics.avgAwakenings - analytics.prevAvgAwakenings : null}
          invertDelta
          color={analytics.avgAwakenings != null && analytics.avgAwakenings <= 1 ? "#22c55e" : "#f59e0b"}
        />
      </div>

      {/* ── Row 2: Protocol Screener (full width) ─────────────── */}
      <ProtocolScreener stats={analytics.supplementStats} />

      {/* ── Row 3: Advisory + Combo Matrix ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AdvisoryFeed advisories={analytics.advisories} />
        <ComboMatrixChart matrix={analytics.comboMatrix} />
      </div>

      {/* ── Tracking Zone Separator ────────────────────────────── */}
      <button onClick={() => setTrackingOpen(!trackingOpen)}
        className="w-full flex items-center gap-3 py-2 group">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border-default/50 to-transparent" />
        <div className="flex items-center gap-2 text-xs text-text-muted uppercase tracking-widest font-semibold hover:text-text-secondary transition-colors">
          {trackingOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          Tracking &amp; History
          <kbd className="text-[10px] opacity-50 px-1.5 py-0.5 rounded bg-surface-2">T</kbd>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border-default/50 to-transparent" />
      </button>

      {/* ── Tracking Zone (collapsible) ────────────────────────── */}
      {trackingOpen && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Trend + Heatmap + Window */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            <div className="lg:col-span-7 card elevation-1 p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-3.5 w-3.5 text-text-muted" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Sleep Trend (30d)
                </h2>
                <span className="text-xs text-text-muted ml-auto">hours + quality sparkline</span>
              </div>
              <GradientTrendChart entries={analytics.last30} />
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="card elevation-1 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="h-3 w-3 text-text-muted" />
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Quality Heatmap
                  </h2>
                </div>
                <CalendarHeatmap entries={entries} />
              </div>

              <div className="card elevation-1 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-3 w-3 text-text-muted" />
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Sleep Window
                  </h2>
                </div>
                <SleepWindowChart entries={analytics.last14} />
              </div>
            </div>
          </div>

          {/* Recent entries */}
          <RecentEntries
            entries={analytics.last14}
            onEdit={(entry) => { form.loadEntry(entry); setEntryOpen(true); }}
            onRemove={(id) => { if (window.confirm("Delete this entry?")) removeEntry(id); }}
          />
        </div>
      )}

      {/* ── Entry Slide-Over ───────────────────────────────────── */}
      <EntrySlideOver
        open={entryOpen}
        onClose={() => setEntryOpen(false)}
        form={form}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

// ── Micro KPI card (compact, 4-across) ────────────────────────────────────────
function MicroKpiCard({
  label, value, delta, deltaSuffix, invertDelta, color, subtitle,
}: {
  label: string;
  value: string;
  delta?: number | null;
  deltaSuffix?: string;
  invertDelta?: boolean;
  color: string;
  subtitle?: string;
}) {
  return (
    <div className="card elevation-1 p-3 relative overflow-hidden">
      <div className="card-hover-line" />
      <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">{label}</p>
      <div className="flex items-end gap-1.5 mt-1">
        <span className="font-data text-xl font-bold" style={{ color }}>{value}</span>
        {delta != null && <DeltaBadge value={delta} suffix={deltaSuffix ?? ""} invertColor={invertDelta ?? false} />}
      </div>
      {subtitle && <p className="text-[11px] text-text-tertiary mt-0.5">{subtitle}</p>}
    </div>
  );
}
