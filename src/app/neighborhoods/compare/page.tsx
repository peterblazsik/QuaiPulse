"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy } from "lucide-react";
import { ALL_LOCATIONS } from "@/lib/data/neighborhoods";
import { VENUES } from "@/lib/data/venues";
import { usePriorityStore } from "@/lib/stores/priority-store";
import { rankNeighborhoods, formatScore, scoreTextClass } from "@/lib/engines/scoring";
import { RadarChart } from "@/components/neighborhoods/radar-chart";
import { SCORE_DIMENSIONS } from "@/lib/constants";
import { CompareHeroCards } from "@/components/neighborhoods/compare-hero-cards";
import { RentComparisonTable } from "@/components/neighborhoods/rent-comparison-table";
import { ProsConsMatrix } from "@/components/neighborhoods/pros-cons-matrix";
import type { ScoreDimension } from "@/lib/types";

const COMPARE_COLORS = [
  "var(--accent-primary)",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
];

export default function ComparePage() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids") ?? "";
  const ids = idsParam.split(",").filter(Boolean);
  const weights = usePriorityStore((s) => s.weights);

  const ranked = useMemo(
    () => rankNeighborhoods(ALL_LOCATIONS, weights),
    [weights]
  );

  const compared = useMemo(
    () =>
      ids
        .map((id) => ranked.find((n) => n.id === id))
        .filter((n): n is (typeof ranked)[number] => n !== undefined),
    [ids, ranked]
  );

  if (compared.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-text-secondary text-lg">
          Select at least 2 neighborhoods to compare
        </p>
        <Link
          href="/neighborhoods"
          className="text-accent-primary hover:underline flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to rankings
        </Link>
      </div>
    );
  }

  const winner = compared.reduce((best, n) =>
    n.weightedScore > best.weightedScore ? n : best
  );

  return (
    <div className="space-y-6 relative">
      {/* Ambient glow */}
      <div className="ambient-glow glow-purple" />

      {/* Back nav */}
      <Link
        href="/neighborhoods"
        className="inline-flex items-center gap-2 text-sm text-text-tertiary hover:text-accent-primary transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to rankings
      </Link>

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Neighborhood Comparison
        </h1>
        <p className="text-sm text-text-tertiary mt-1">
          Side-by-side analysis of {compared.length} neighborhoods
        </p>
      </div>

      {/* Hero cards */}
      <CompareHeroCards compared={compared} winnerId={winner.id} colors={COMPARE_COLORS} />

      {/* Overlaid Radar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card p-5"
      >
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
          Overlaid Radar
        </h2>
        <div className="flex justify-center">
          <RadarChart
            datasets={compared.map((n, i) => ({
              scores: n.scores,
              color: COMPARE_COLORS[i],
              id: n.id,
            }))}
            size={320}
            showLabels={true}
          />
        </div>
        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4">
          {compared.map((n, i) => (
            <div key={n.id} className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: COMPARE_COLORS[i] }}
              />
              <span className="text-xs text-text-secondary">{n.name}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Dimension-by-dimension comparison */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-5"
      >
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
          Score Breakdown
        </h2>
        <div className="space-y-4">
          {SCORE_DIMENSIONS.map((dim) => {
            const key = dim.key as ScoreDimension;
            const scores = compared.map((n) => n.scores[key]);
            const maxScore = Math.max(...scores);
            return (
              <div key={key}>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: dim.color }}
                  />
                  <span className="text-xs font-medium text-text-secondary w-24">
                    {dim.label}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {compared.map((n, i) => {
                    const score = n.scores[key];
                    const isBest = score === maxScore;
                    return (
                      <div key={n.id} className="flex items-center gap-2">
                        <span className="text-[11px] text-text-muted w-24 text-right truncate">
                          {n.name}
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-bg-tertiary overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(score / 10) * 100}%` }}
                            transition={{ duration: 0.6, delay: 0.1 + i * 0.05 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: COMPARE_COLORS[i] }}
                          />
                        </div>
                        <span
                          className={`font-data text-xs font-semibold w-7 text-right ${scoreTextClass(score)}`}
                        >
                          {formatScore(score)}
                        </span>
                        {isBest && scores.filter((s) => s === maxScore).length === 1 && (
                          <Trophy className="h-3 w-3 text-warning shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Rent Comparison */}
      <RentComparisonTable compared={compared} colors={COMPARE_COLORS} />

      {/* Pros & Cons Matrix */}
      <ProsConsMatrix compared={compared} colors={COMPARE_COLORS} />

      {/* Venue count comparison */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="card p-5"
      >
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
          Nearby Venues
        </h2>
        <div style={{ gridTemplateColumns: `repeat(${compared.length}, 1fr)` }} className="grid gap-4">
          {compared.map((n, i) => {
            const venues = VENUES.filter((v) => v.neighborhoodId === n.id);
            return (
              <div key={n.id}>
                <h3
                  className="text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: COMPARE_COLORS[i] }}
                >
                  {n.name} ({venues.length})
                </h3>
                {venues.length === 0 ? (
                  <p className="text-xs text-text-muted italic">No venues listed</p>
                ) : (
                  <ul className="space-y-1">
                    {venues.map((v) => (
                      <li key={v.id} className="text-xs text-text-secondary flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-text-muted shrink-0" />
                        {v.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Deep-dive links */}
      <div className="flex flex-wrap gap-3 pb-8">
        {compared.map((n, i) => (
          <Link
            key={n.id}
            href={`/neighborhoods/${n.slug}`}
            className="text-sm font-medium hover:underline transition-colors"
            style={{ color: COMPARE_COLORS[i] }}
          >
            {n.name} deep-dive →
          </Link>
        ))}
      </div>
    </div>
  );
}
