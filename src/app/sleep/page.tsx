"use client";

import Link from "next/link";
import { TrendingUp, MapPin, Pill, Clock, Star, Zap, BookOpen } from "lucide-react";
import { useSleepStore } from "@/lib/stores/sleep-store";
import { useSleepAnalytics } from "@/lib/hooks/use-sleep-analytics";
import { useSleepForm } from "@/lib/hooks/use-sleep-form";

import { KpiStrip } from "@/components/sleep/kpi-strip";
import { ScorePanel } from "@/components/sleep/score-panel";
import { SleepWindowChart } from "@/components/sleep/sleep-window-chart";
import { CalendarHeatmap } from "@/components/sleep/calendar-heatmap";
import { GradientTrendChart } from "@/components/sleep/trend-chart";
import { EntryForm } from "@/components/sleep/entry-form";
import { RecentEntries } from "@/components/sleep/recent-entries";
import { LocationBars } from "@/components/sleep/location-bars";
import { DumbbellChart } from "@/components/sleep/dumbbell-chart";
import { DivergingBarChart } from "@/components/sleep/diverging-bar-chart";

export default function SleepPage() {
  const { entries, addEntry, removeEntry, updateEntry } = useSleepStore();
  const analytics = useSleepAnalytics();
  const form = useSleepForm();

  function handleSubmit() {
    const entry = form.buildEntry();
    if (form.editingId) {
      updateEntry(form.editingId, entry);
    } else {
      addEntry(entry);
    }
    form.resetForm();
  }

  return (
    <div className="space-y-4 relative">
      <div className="ambient-glow glow-purple" />

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Sleep Tracker</h1>
          <p className="text-sm text-text-tertiary mt-0.5">
            {entries.length} nights logged. Track patterns, supplements, and interventions.
          </p>
        </div>
        <Link href="/sleep/protocol"
          className="flex items-center gap-2 text-xs px-4 py-2 rounded-lg border border-accent-primary/30 bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20 transition-colors">
          <BookOpen className="h-3.5 w-3.5" />
          Protocol Library
        </Link>
      </div>

      {/* Row 0: KPI strip */}
      <KpiStrip analytics={analytics} />

      {/* Row 1: Score Panel + Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5">
          <ScorePanel breakdown={analytics.scoreBreakdown} scoreDelta={analytics.scoreDelta} />
        </div>

        <div className="lg:col-span-7 card elevation-1 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-3.5 w-3.5 text-text-muted" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Sleep Trend (30d)
            </h2>
            <span className="text-[9px] text-text-muted ml-auto">hours + quality sparkline</span>
          </div>
          <GradientTrendChart entries={analytics.last30} />
        </div>
      </div>

      {/* Row 2: Heatmap + Sleep Window + Entry Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5 card elevation-1 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Star className="h-3 w-3 text-text-muted" />
            <h2 className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Quality Heatmap
            </h2>
          </div>
          <CalendarHeatmap entries={entries} />
        </div>

        <div className="lg:col-span-3 card elevation-1 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-3 w-3 text-text-muted" />
            <h2 className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Sleep Window
            </h2>
          </div>
          <SleepWindowChart entries={analytics.last14} />
        </div>

        <div className="lg:col-span-4">
          <EntryForm form={form} onSubmit={handleSubmit} />
        </div>
      </div>

      {/* Row 3: Correlation panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card elevation-1 p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-3.5 w-3.5 text-text-muted" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Quality by Location
            </h2>
          </div>
          <LocationBars data={analytics.locationStats} />
        </div>

        <div className="card elevation-1 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Pill className="h-3.5 w-3.5 text-text-muted" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Supplement Impact
            </h2>
            <span className="text-[9px] text-text-muted ml-auto">with vs. without</span>
          </div>
          <DumbbellChart data={analytics.supplementStats} />
        </div>

        <div className="card elevation-1 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-3.5 w-3.5 text-text-muted" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Intervention Impact
            </h2>
            <span className="text-[9px] text-text-muted ml-auto">delta from baseline</span>
          </div>
          <DivergingBarChart data={analytics.interventionStats} />
        </div>
      </div>

      {/* Row 4: Recent entries */}
      <RecentEntries
        entries={analytics.last14}
        onEdit={(entry) => form.loadEntry(entry)}
        onRemove={(id) => { if (window.confirm("Delete this entry?")) removeEntry(id); }}
      />
    </div>
  );
}
