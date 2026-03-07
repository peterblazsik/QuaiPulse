import type { SleepEntry } from "@/lib/stores/sleep-store";

export interface SleepScoreBreakdown {
  total: number;
  duration: number;
  quality: number;
  latency: number;
  awakenings: number;
  consistency: number;
}

/**
 * Compute a composite sleep score (0-100) from multiple dimensions.
 * Weights: duration 30%, quality 25%, latency 20%, awakenings 15%, consistency 10%
 */
export function computeSleepScore(entries: SleepEntry[]): number {
  return computeSleepScoreBreakdown(entries).total;
}

/** Returns individual sub-scores (0-100 each) alongside the weighted total */
export function computeSleepScoreBreakdown(entries: SleepEntry[]): SleepScoreBreakdown {
  if (entries.length === 0) return { total: 0, duration: 0, quality: 0, latency: 0, awakenings: 0, consistency: 0 };

  const duration = scoreDuration(entries);
  const quality = scoreQuality(entries);
  const latency = scoreLatency(entries);
  const awakenings = scoreAwakenings(entries);
  const consistency = scoreConsistency(entries);

  const total = Math.round(
    duration * 0.30 +
    quality * 0.25 +
    latency * 0.20 +
    awakenings * 0.15 +
    consistency * 0.10
  );

  return { total, duration: Math.round(duration), quality: Math.round(quality), latency: Math.round(latency), awakenings: Math.round(awakenings), consistency: Math.round(consistency) };
}

/** Duration: 7-9h = 100, <5h or >11h = 0, linear interpolation */
function scoreDuration(entries: SleepEntry[]): number {
  const avg = entries.reduce((s, e) => s + e.hours, 0) / entries.length;
  if (avg >= 7 && avg <= 9) return 100;
  if (avg < 5) return Math.max(0, (avg / 5) * 50);
  if (avg > 9 && avg <= 11) return Math.max(0, 100 - ((avg - 9) / 2) * 50);
  return 0;
}

/** Quality: map 1-5 → 0-100 */
function scoreQuality(entries: SleepEntry[]): number {
  const avg = entries.reduce((s, e) => s + e.quality, 0) / entries.length;
  return ((avg - 1) / 4) * 100;
}

/** Latency: <=10min = 100, >=45min = 0, linear */
function scoreLatency(entries: SleepEntry[]): number {
  const withLatency = entries.filter((e) => e.sleepLatency != null);
  if (withLatency.length === 0) return 70; // neutral if no data
  const avg = withLatency.reduce((s, e) => s + (e.sleepLatency ?? 0), 0) / withLatency.length;
  if (avg <= 10) return 100;
  if (avg >= 45) return 0;
  return Math.round(100 - ((avg - 10) / 35) * 100);
}

/** Awakenings: 0 = 100, >=4 = 0, linear */
function scoreAwakenings(entries: SleepEntry[]): number {
  const withData = entries.filter((e) => e.awakenings != null);
  if (withData.length === 0) return 70;
  const avg = withData.reduce((s, e) => s + (e.awakenings ?? 0), 0) / withData.length;
  if (avg <= 0) return 100;
  if (avg >= 4) return 0;
  return Math.round(100 - (avg / 4) * 100);
}

/** Consistency: low std dev of bedtime = 100. >90min std dev = 0 */
function scoreConsistency(entries: SleepEntry[]): number {
  const withBedtime = entries.filter((e) => e.bedtime);
  if (withBedtime.length < 3) return 70;

  const minutes = withBedtime.map((e) => {
    const [h, m] = e.bedtime!.split(":").map(Number);
    // Normalize: treat times after midnight as 24+ hours
    return h < 12 ? (h + 24) * 60 + m : h * 60 + m;
  });

  const mean = minutes.reduce((s, m) => s + m, 0) / minutes.length;
  const variance = minutes.reduce((s, m) => s + (m - mean) ** 2, 0) / minutes.length;
  const stdDev = Math.sqrt(variance);

  if (stdDev <= 15) return 100;
  if (stdDev >= 90) return 0;
  return Math.round(100 - ((stdDev - 15) / 75) * 100);
}

export function getScoreLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  if (score >= 30) return "Poor";
  return "Critical";
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#3b82f6";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}
