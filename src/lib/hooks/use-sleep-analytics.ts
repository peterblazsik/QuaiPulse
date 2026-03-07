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
import { generateAdvisories, type Advisory } from "@/lib/engines/sleep-advisories";
import { computeComboMatrix, type ComboMatrix } from "@/lib/engines/sleep-combos";
import { generateTonightProtocol, getTopPerformers, type TonightProtocol, type TopPerformer } from "@/lib/engines/protocol-recommender";

export interface SupplementStat {
  id: string;
  name: string;
  color: string;
  tier: number;
  avgWith: number;
  avgWithout: number;
  countWith: number;
  countWithout: number;
  delta: number;
  hitRate: number;        // % of nights with quality >= 4 when using
  latencyDelta: number | null; // latency with - without (negative = better)
}

export interface InterventionStat {
  id: string;
  name: string;
  category: string;
  avgWith: number;
  avgWithout: number;
  countWith: number;
  delta: number;
  hitRate: number;
  latencyDelta: number | null;
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

  // ── New intelligence fields ──
  advisories: Advisory[];
  comboMatrix: ComboMatrix;
  tonightProtocol: TonightProtocol;
  topPerformers: TopPerformer[];
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

  // Enhanced supplement stats with delta, hitRate, latencyDelta
  const supplementStats = useMemo(() => {
    const withSup: Record<string, { qualSum: number; qualCount: number; latSum: number; latCount: number }> = {};
    const withoutSup: Record<string, { qualSum: number; qualCount: number; latSum: number; latCount: number }> = {};
    const hitCounts: Record<string, { good: number; total: number }> = {};

    for (const sup of SUPPLEMENTS) {
      withSup[sup.id] = { qualSum: 0, qualCount: 0, latSum: 0, latCount: 0 };
      withoutSup[sup.id] = { qualSum: 0, qualCount: 0, latSum: 0, latCount: 0 };
      hitCounts[sup.id] = { good: 0, total: 0 };
    }

    for (const e of entries) {
      for (const sup of SUPPLEMENTS) {
        if (e.supplements.includes(sup.id)) {
          withSup[sup.id].qualSum += e.quality;
          withSup[sup.id].qualCount++;
          if (e.sleepLatency != null) {
            withSup[sup.id].latSum += e.sleepLatency;
            withSup[sup.id].latCount++;
          }
          hitCounts[sup.id].total++;
          if (e.quality >= 4) hitCounts[sup.id].good++;
        } else {
          withoutSup[sup.id].qualSum += e.quality;
          withoutSup[sup.id].qualCount++;
          if (e.sleepLatency != null) {
            withoutSup[sup.id].latSum += e.sleepLatency;
            withoutSup[sup.id].latCount++;
          }
        }
      }
    }

    return SUPPLEMENTS.map((sup) => {
      const wc = withSup[sup.id].qualCount;
      const woc = withoutSup[sup.id].qualCount;
      const avgWith = wc > 0 ? withSup[sup.id].qualSum / wc : 0;
      const avgWithout = woc > 0 ? withoutSup[sup.id].qualSum / woc : 0;

      let latencyDelta: number | null = null;
      if (withSup[sup.id].latCount >= 2 && withoutSup[sup.id].latCount >= 2) {
        latencyDelta = (withSup[sup.id].latSum / withSup[sup.id].latCount) -
          (withoutSup[sup.id].latSum / withoutSup[sup.id].latCount);
      }

      return {
        id: sup.id,
        name: sup.name,
        color: sup.color,
        tier: sup.tier,
        avgWith,
        avgWithout,
        countWith: wc,
        countWithout: woc,
        delta: wc > 0 && woc > 0 ? avgWith - avgWithout : 0,
        hitRate: hitCounts[sup.id].total > 0 ? hitCounts[sup.id].good / hitCounts[sup.id].total : 0,
        latencyDelta,
      };
    }).filter((s) => s.countWith > 0);
  }, [entries]);

  // Enhanced intervention stats
  const interventionStats = useMemo(() => {
    const withInt: Record<string, { qualSum: number; qualCount: number; latSum: number; latCount: number }> = {};
    const withoutInt: Record<string, { qualSum: number; qualCount: number; latSum: number; latCount: number }> = {};
    const hitCounts: Record<string, { good: number; total: number }> = {};

    for (const intv of INTERVENTIONS) {
      withInt[intv.id] = { qualSum: 0, qualCount: 0, latSum: 0, latCount: 0 };
      withoutInt[intv.id] = { qualSum: 0, qualCount: 0, latSum: 0, latCount: 0 };
      hitCounts[intv.id] = { good: 0, total: 0 };
    }

    for (const e of entries) {
      const usedInterventions = e.interventions ?? [];
      for (const intv of INTERVENTIONS) {
        if (usedInterventions.includes(intv.id)) {
          withInt[intv.id].qualSum += e.quality;
          withInt[intv.id].qualCount++;
          if (e.sleepLatency != null) {
            withInt[intv.id].latSum += e.sleepLatency;
            withInt[intv.id].latCount++;
          }
          hitCounts[intv.id].total++;
          if (e.quality >= 4) hitCounts[intv.id].good++;
        } else {
          withoutInt[intv.id].qualSum += e.quality;
          withoutInt[intv.id].qualCount++;
          if (e.sleepLatency != null) {
            withoutInt[intv.id].latSum += e.sleepLatency;
            withoutInt[intv.id].latCount++;
          }
        }
      }
    }

    return INTERVENTIONS.map((intv) => {
      const wc = withInt[intv.id].qualCount;
      const woc = withoutInt[intv.id].qualCount;
      const avgWith = wc > 0 ? withInt[intv.id].qualSum / wc : 0;
      const avgWithout = woc > 0 ? withoutInt[intv.id].qualSum / woc : 0;

      let latencyDelta: number | null = null;
      if (withInt[intv.id].latCount >= 2 && withoutInt[intv.id].latCount >= 2) {
        latencyDelta = (withInt[intv.id].latSum / withInt[intv.id].latCount) -
          (withoutInt[intv.id].latSum / withoutInt[intv.id].latCount);
      }

      return {
        id: intv.id,
        name: intv.name,
        category: intv.category,
        avgWith,
        avgWithout,
        countWith: wc,
        delta: wc > 0 && woc > 0 ? avgWith - avgWithout : 0,
        hitRate: hitCounts[intv.id].total > 0 ? hitCounts[intv.id].good / hitCounts[intv.id].total : 0,
        latencyDelta,
      };
    }).filter((i) => i.countWith > 0).sort((a, b) => b.delta - a.delta);
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

  // ── New intelligence computations ──────────────────────────────────────────
  const advisories = useMemo(() => generateAdvisories(entries), [entries]);
  const comboMatrix = useMemo(() => computeComboMatrix(entries), [entries]);
  const tonightProtocol = useMemo(() => generateTonightProtocol(entries), [entries]);
  const topPerformers = useMemo(() => getTopPerformers(entries), [entries]);

  return {
    last14, last30, prev14,
    scoreBreakdown, prevScore, scoreDelta,
    avgHours, prevAvgHours,
    avgQuality, prevAvgQuality, avgQualityLabel,
    avgLatency, prevAvgLatency,
    avgAwakenings, prevAvgAwakenings,
    bestLocation, bestSupplement,
    supplementStats, interventionStats, locationStats,
    advisories, comboMatrix, tonightProtocol, topPerformers,
  };
}
