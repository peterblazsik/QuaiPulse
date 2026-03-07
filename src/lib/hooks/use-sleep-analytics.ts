"use client";

import { useMemo } from "react";
import { useSleepStore } from "@/lib/stores/sleep-store";
import type { SleepEntry } from "@/lib/stores/sleep-store";
import {
  LOCATIONS,
  QUALITY_LABELS,
  SUPPLEMENTS,
  INTERVENTIONS,
  type SleepQuality,
} from "@/lib/data/sleep-defaults";
import { computeSleepScoreBreakdown, type SleepScoreBreakdown } from "@/lib/engines/sleep-score";

export interface SupplementStat {
  id: string;
  name: string;
  color: string;
  avgWith: number;
  avgWithout: number;
  countWith: number;
  countWithout: number;
}

export interface InterventionStat {
  id: string;
  name: string;
  category: string;
  avgWith: number;
  avgWithout: number;
  countWith: number;
  delta: number;
}

export interface LocationStat {
  location: string;
  avg: number;
  count: number;
}

export interface SleepAnalytics {
  last14: SleepEntry[];
  last30: SleepEntry[];
  prev14: SleepEntry[];

  scoreBreakdown: SleepScoreBreakdown;
  prevScore: number;
  scoreDelta: number | null;

  avgHours: number;
  prevAvgHours: number | null;
  avgQuality: number;
  prevAvgQuality: number | null;
  avgQualityLabel: { label: string; color: string };
  avgLatency: number | null;
  prevAvgLatency: number | null;
  avgAwakenings: number | null;
  prevAvgAwakenings: number | null;
  bestLocation: { label: string; avg: number };
  bestSupplement: { label: string; avg: number };

  supplementStats: SupplementStat[];
  interventionStats: InterventionStat[];
  locationStats: LocationStat[];
}

export function useSleepAnalytics(): SleepAnalytics {
  const entries = useSleepStore((s) => s.entries);

  const last14 = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 14);
    const cutoffStr = cutoff.toISOString().split("T")[0];
    return entries.filter((e) => e.date >= cutoffStr).sort((a, b) => a.date.localeCompare(b.date));
  }, [entries]);

  const last30 = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const cutoffStr = cutoff.toISOString().split("T")[0];
    return entries.filter((e) => e.date >= cutoffStr).sort((a, b) => a.date.localeCompare(b.date));
  }, [entries]);

  const prev14 = useMemo(() => {
    const start = new Date();
    start.setDate(start.getDate() - 28);
    const end = new Date();
    end.setDate(end.getDate() - 14);
    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];
    return entries.filter((e) => e.date >= startStr && e.date < endStr);
  }, [entries]);

  const scoreBreakdown = useMemo(() => computeSleepScoreBreakdown(last14), [last14]);
  const prevScore = useMemo(() => computeSleepScoreBreakdown(prev14).total, [prev14]);
  const scoreDelta = prev14.length > 0 ? scoreBreakdown.total - prevScore : null;

  const avgHours = useMemo(() => {
    if (last14.length === 0) return 0;
    return last14.reduce((sum, e) => sum + e.hours, 0) / last14.length;
  }, [last14]);

  const prevAvgHours = useMemo(() => {
    if (prev14.length === 0) return null;
    return prev14.reduce((sum, e) => sum + e.hours, 0) / prev14.length;
  }, [prev14]);

  const avgQuality = useMemo(() => {
    if (last14.length === 0) return 0;
    return last14.reduce((sum, e) => sum + e.quality, 0) / last14.length;
  }, [last14]);

  const prevAvgQuality = useMemo(() => {
    if (prev14.length === 0) return null;
    return prev14.reduce((sum, e) => sum + e.quality, 0) / prev14.length;
  }, [prev14]);

  const avgQualityLabel = useMemo(() => {
    const rounded = Math.round(avgQuality) as SleepQuality;
    if (rounded < 1 || rounded > 5) return { label: "N/A", color: "#64748b" };
    return QUALITY_LABELS[rounded];
  }, [avgQuality]);

  const avgLatency = useMemo(() => {
    const withLatency = last14.filter((e) => e.sleepLatency != null);
    if (withLatency.length === 0) return null;
    return withLatency.reduce((sum, e) => sum + (e.sleepLatency ?? 0), 0) / withLatency.length;
  }, [last14]);

  const prevAvgLatency = useMemo(() => {
    const withLatency = prev14.filter((e) => e.sleepLatency != null);
    if (withLatency.length === 0) return null;
    return withLatency.reduce((sum, e) => sum + (e.sleepLatency ?? 0), 0) / withLatency.length;
  }, [prev14]);

  const avgAwakenings = useMemo(() => {
    const withData = last14.filter((e) => e.awakenings != null);
    if (withData.length === 0) return null;
    return withData.reduce((sum, e) => sum + (e.awakenings ?? 0), 0) / withData.length;
  }, [last14]);

  const prevAvgAwakenings = useMemo(() => {
    const w = prev14.filter((e) => e.awakenings != null);
    if (w.length === 0) return null;
    return w.reduce((sum, e) => sum + (e.awakenings ?? 0), 0) / w.length;
  }, [prev14]);

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
      id: sup.id,
      name: sup.name,
      color: sup.color,
      avgWith: withSup[sup.id].count > 0 ? withSup[sup.id].sum / withSup[sup.id].count : 0,
      avgWithout: withoutSup[sup.id].count > 0 ? withoutSup[sup.id].sum / withoutSup[sup.id].count : 0,
      countWith: withSup[sup.id].count,
      countWithout: withoutSup[sup.id].count,
    })).filter((s) => s.countWith > 0);
  }, [entries]);

  const interventionStats = useMemo(() => {
    const withInt: Record<string, { sum: number; count: number }> = {};
    const withoutInt: Record<string, { sum: number; count: number }> = {};
    for (const intv of INTERVENTIONS) {
      withInt[intv.id] = { sum: 0, count: 0 };
      withoutInt[intv.id] = { sum: 0, count: 0 };
    }
    for (const e of entries) {
      const usedInterventions = e.interventions ?? [];
      for (const intv of INTERVENTIONS) {
        if (usedInterventions.includes(intv.id)) {
          withInt[intv.id].sum += e.quality;
          withInt[intv.id].count++;
        } else {
          withoutInt[intv.id].sum += e.quality;
          withoutInt[intv.id].count++;
        }
      }
    }
    return INTERVENTIONS.map((intv) => ({
      id: intv.id,
      name: intv.name,
      category: intv.category,
      avgWith: withInt[intv.id].count > 0 ? withInt[intv.id].sum / withInt[intv.id].count : 0,
      avgWithout: withoutInt[intv.id].count > 0 ? withoutInt[intv.id].sum / withoutInt[intv.id].count : 0,
      countWith: withInt[intv.id].count,
      delta: withInt[intv.id].count > 0 && withoutInt[intv.id].count > 0
        ? (withInt[intv.id].sum / withInt[intv.id].count) - (withoutInt[intv.id].sum / withoutInt[intv.id].count)
        : 0,
    })).filter((i) => i.countWith > 0).sort((a, b) => b.delta - a.delta);
  }, [entries]);

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

  return {
    last14, last30, prev14,
    scoreBreakdown, prevScore, scoreDelta,
    avgHours, prevAvgHours,
    avgQuality, prevAvgQuality, avgQualityLabel,
    avgLatency, prevAvgLatency,
    avgAwakenings, prevAvgAwakenings,
    bestLocation, bestSupplement,
    supplementStats, interventionStats, locationStats,
  };
}
