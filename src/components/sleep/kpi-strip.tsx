"use client";

import { Clock, Star, Timer, AlertCircle, MapPin, Pill } from "lucide-react";
import { KpiCard } from "./kpi-card";
import type { SleepAnalytics } from "@/lib/hooks/use-sleep-analytics";

interface KpiStripProps {
  analytics: SleepAnalytics;
}

export function KpiStrip({ analytics }: KpiStripProps) {
  const {
    avgHours, prevAvgHours,
    avgQuality, prevAvgQuality, avgQualityLabel,
    avgLatency, prevAvgLatency,
    avgAwakenings, prevAvgAwakenings,
    bestLocation, bestSupplement,
  } = analytics;

  const latencyColor = avgLatency != null && avgLatency <= 15
    ? "text-emerald-400" : avgLatency != null && avgLatency <= 25 ? "text-amber-400" : "text-red-400";

  const awakeningsColor = avgAwakenings != null && avgAwakenings <= 0.5
    ? "text-emerald-400" : avgAwakenings != null && avgAwakenings <= 1.5 ? "text-amber-400" : "text-red-400";

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      <KpiCard icon={Clock} label="Hours (14d)" value={avgHours.toFixed(1)}
        delta={prevAvgHours != null ? avgHours - prevAvgHours : null} deltaSuffix="h"
        subtitle="per night" />
      <KpiCard icon={Star} label="Quality (14d)" value={avgQuality.toFixed(1)}
        valueColor={`text-[${avgQualityLabel.color}]`}
        delta={prevAvgQuality != null ? avgQuality - prevAvgQuality : null}
        subtitle={avgQualityLabel.label} />
      <KpiCard icon={Timer} label="Latency (14d)"
        value={avgLatency != null ? `${Math.round(avgLatency)}` : "\u2014"}
        valueColor={latencyColor}
        delta={avgLatency != null && prevAvgLatency != null ? avgLatency - prevAvgLatency : null}
        deltaSuffix="m" invertDelta
        subtitle="min to fall asleep" />
      <KpiCard icon={AlertCircle} label="Wake-ups (14d)"
        value={avgAwakenings != null ? avgAwakenings.toFixed(1) : "\u2014"}
        valueColor={awakeningsColor}
        delta={avgAwakenings != null && prevAvgAwakenings != null ? avgAwakenings - prevAvgAwakenings : null}
        invertDelta subtitle="per night" />
      <KpiCard icon={MapPin} label="Best Location" value={bestLocation.label}
        valueColor="text-text-primary" subtitle={`quality ${bestLocation.avg.toFixed(1)} / 5`} />
      <KpiCard icon={Pill} label="Best Supplement"
        value={bestSupplement.label.length > 14 ? bestSupplement.label.slice(0, 12) + "..." : bestSupplement.label}
        valueColor="text-text-primary" subtitle={`quality ${bestSupplement.avg.toFixed(1)} / 5`} />
    </div>
  );
}
