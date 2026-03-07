"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, TrendingDown } from "lucide-react";
import { NEIGHBORHOODS } from "@/lib/data/neighborhoods";
import { NEIGHBORHOOD_IMAGES } from "@/lib/data/images";
import { VENUES } from "@/lib/data/venues";
import { usePriorityStore } from "@/lib/stores/priority-store";
import { rankNeighborhoods, formatScore, scoreTextClass, scoreColor } from "@/lib/engines/scoring";
import { RadarChart } from "@/components/neighborhoods/radar-chart";
import { ScoreBadge } from "@/components/neighborhoods/score-badge";
import { SCORE_DIMENSIONS } from "@/lib/constants";
import { formatCHF } from "@/lib/utils";
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
    () => rankNeighborhoods(NEIGHBORHOODS, weights),
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
    n.weightedScore > best!.weightedScore ? n : best
  )!;

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

      {/* Hero cards row */}
      <div className={`grid gap-4 grid-cols-${compared.length}`} style={{ gridTemplateColumns: `repeat(${compared.length}, 1fr)` }}>
        {compared.map((n, i) => {
          const img = NEIGHBORHOOD_IMAGES[n.id];
          const isWinner = n.id === winner.id;
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`card overflow-hidden relative ${isWinner ? "ring-2 ring-accent-primary/50" : ""}`}
            >
              {img && (
                <div className="relative h-32">
                  <Image src={img} alt={n.name} fill className="object-cover" />
                  <div className="img-overlay-fade" />
                  {isWinner && (
                    <div className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-full bg-accent-primary/90 px-2 py-0.5 text-[10px] font-bold text-white">
                      <Trophy className="h-3 w-3" />
                      Best
                    </div>
                  )}
                </div>
              )}
              <div className="p-4 text-center">
                <div
                  className="h-1 w-8 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: COMPARE_COLORS[i] }}
                />
                <h3 className="font-display text-lg font-semibold text-text-primary">
                  {n.name}
                </h3>
                <p className="text-[10px] text-text-muted uppercase tracking-wider">
                  Kreis {n.kreis} — Rank #{n.rank}
                </p>
                <div className="mt-2 flex justify-center">
                  <ScoreBadge score={n.weightedScore} size="lg" />
                </div>
                <p className="text-xs text-text-tertiary italic mt-2">{n.vibe}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

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
                          <Trophy className="h-3 w-3 text-amber-400 shrink-0" />
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
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="card p-5"
      >
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
          Rent Comparison (monthly)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left text-[10px] uppercase tracking-wider text-text-muted pb-2 pr-4">
                  Type
                </th>
                {compared.map((n, i) => (
                  <th
                    key={n.id}
                    className="text-center pb-2 px-2"
                  >
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: COMPARE_COLORS[i] }}>
                      {n.name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="font-data">
              <tr className="border-b border-border-subtle/50">
                <td className="text-text-secondary py-2 pr-4">Studio</td>
                {compared.map((n) => (
                  <td key={n.id} className="text-center text-text-primary py-2 px-2">
                    {formatCHF(n.rentStudioMin)}-{formatCHF(n.rentStudioMax)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border-subtle/50 bg-accent-primary/5">
                <td className="text-text-secondary py-2 pr-4 font-medium">1 Bedroom</td>
                {compared.map((n) => {
                  const cheapest = Math.min(...compared.map((x) => x.rentOneBrMin));
                  const isCheapest = n.rentOneBrMin === cheapest;
                  return (
                    <td key={n.id} className={`text-center py-2 px-2 ${isCheapest ? "text-success font-semibold" : "text-text-primary"}`}>
                      {formatCHF(n.rentOneBrMin)}-{formatCHF(n.rentOneBrMax)}
                      {isCheapest && compared.length > 1 && (
                        <span className="block text-[10px] text-success">Cheapest</span>
                      )}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="text-text-secondary py-2 pr-4">2 Bedroom</td>
                {compared.map((n) => (
                  <td key={n.id} className="text-center text-text-primary py-2 px-2">
                    {formatCHF(n.rentTwoBrMin)}-{formatCHF(n.rentTwoBrMax)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pros & Cons Matrix */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-5"
      >
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
          Pros & Cons Matrix
        </h2>
        <div style={{ gridTemplateColumns: `repeat(${compared.length}, 1fr)` }} className="grid gap-4">
          {compared.map((n, i) => (
            <div key={n.id}>
              <h3
                className="text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: COMPARE_COLORS[i] }}
              >
                {n.name}
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-success mb-1.5">Pros</p>
                  <ul className="space-y-1">
                    {n.pros.map((pro, j) => (
                      <li key={j} className="text-xs text-text-secondary flex items-start gap-1.5">
                        <span className="text-success shrink-0 mt-0.5 font-bold">+</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-danger mb-1.5">Cons</p>
                  <ul className="space-y-1">
                    {n.cons.map((con, j) => (
                      <li key={j} className="text-xs text-text-secondary flex items-start gap-1.5">
                        <span className="text-danger shrink-0 mt-0.5 font-bold">-</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

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

