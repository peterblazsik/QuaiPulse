"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, ChevronRight } from "lucide-react";
import type { ScoredNeighborhood } from "@/lib/engines/scoring";
import { formatScore, scoreTextClass } from "@/lib/engines/scoring";
import { formatCHF } from "@/lib/utils";
import { RadarChart } from "./radar-chart";
import { ScoreBadge } from "./score-badge";
import { SCORE_DIMENSIONS } from "@/lib/constants";
import type { ScoreDimension } from "@/lib/types";
import { NEIGHBORHOOD_IMAGES } from "@/lib/data/images";

interface NeighborhoodCardProps {
  neighborhood: ScoredNeighborhood;
  isExpanded: boolean;
  onToggle: () => void;
}

export function NeighborhoodCard({
  neighborhood: n,
  isExpanded,
  onToggle,
}: NeighborhoodCardProps) {
  return (
    <motion.div
      layout
      layoutId={n.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 35 }}
      className="card group overflow-hidden relative"
    >
      {/* Background image (subtle) */}
      {NEIGHBORHOOD_IMAGES[n.id] && (
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src={NEIGHBORHOOD_IMAGES[n.id]}
            alt=""
            fill
            className="object-cover opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-500"
          />
        </div>
      )}
      {/* Compact view */}
      <button
        onClick={onToggle}
        className="w-full text-left p-4 flex items-center gap-4"
      >
        {/* Rank */}
        <div className="flex flex-col items-center shrink-0 w-8">
          <span className="font-data text-lg font-bold text-text-muted">
            #{n.rank}
          </span>
        </div>

        {/* Mini radar */}
        <div className="shrink-0 hidden sm:block">
          <RadarChart scores={n.scores} size={80} showLabels={false} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-semibold text-text-primary truncate">
              {n.name}
            </h3>
            <span className="text-xs text-text-muted shrink-0">
              Kreis {n.kreis}
            </span>
          </div>
          <p className="text-xs text-text-tertiary mt-0.5 italic">
            {n.vibe}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px] uppercase tracking-wider text-text-muted flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              1BR {formatCHF(n.rentOneBrMin)}-{formatCHF(n.rentOneBrMax)}
            </span>
          </div>
        </div>

        {/* Score */}
        <div className="shrink-0 flex items-center gap-3">
          <ScoreBadge score={n.weightedScore} size="lg" />
          <ChevronRight
            className={`h-4 w-4 text-text-muted transition-transform ${isExpanded ? "rotate-90" : ""}`}
          />
        </div>
      </button>

      {/* Expanded detail */}
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="border-t border-border-subtle"
        >
          <div className="p-5 space-y-5 relative z-10">
            {/* Neighborhood hero image */}
            {NEIGHBORHOOD_IMAGES[n.id] && (
              <div className="relative h-40 rounded-lg overflow-hidden">
                <Image
                  src={NEIGHBORHOOD_IMAGES[n.id]}
                  alt={n.name}
                  fill
                  className="object-cover"
                />
                <div className="img-overlay-fade" />
                <div className="absolute bottom-3 left-3 z-10">
                  <p className="font-display text-lg font-bold text-white drop-shadow-lg">
                    {n.name}
                  </p>
                  <p className="text-[10px] text-white/70">{n.vibe}</p>
                </div>
              </div>
            )}

            {/* Description */}
            <p className="text-sm text-text-secondary leading-relaxed">
              {n.description}
            </p>

            {/* Score breakdown + radar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Radar */}
              <div className="flex justify-center">
                <RadarChart scores={n.scores} size={220} showLabels={true} />
              </div>

              {/* Dimension scores */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                  Score Breakdown
                </h4>
                {SCORE_DIMENSIONS.map((dim) => {
                  const key = dim.key as ScoreDimension;
                  const score = n.scores[key];
                  const note = n.notes[key];
                  return (
                    <div key={key} className="group/dim">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: dim.color }}
                        />
                        <span className="text-xs text-text-secondary w-20">
                          {dim.label}
                        </span>
                        <div className="flex-1 h-1.5 rounded-full bg-bg-tertiary overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(score / 10) * 100}%` }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: dim.color }}
                          />
                        </div>
                        <span
                          className={`font-data text-xs font-semibold w-7 text-right ${scoreTextClass(score)}`}
                        >
                          {formatScore(score)}
                        </span>
                      </div>
                      {note && (
                        <p className="text-[10px] text-text-muted ml-[88px] mt-0.5 leading-snug">
                          {note}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rent ranges */}
            <div className="grid grid-cols-3 gap-3">
              <RentCard
                label="Studio"
                min={n.rentStudioMin}
                max={n.rentStudioMax}
              />
              <RentCard
                label="1 Bedroom"
                min={n.rentOneBrMin}
                max={n.rentOneBrMax}
              />
              <RentCard
                label="2 Bedroom"
                min={n.rentTwoBrMin}
                max={n.rentTwoBrMax}
              />
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-success mb-2">
                  Pros
                </h4>
                <ul className="space-y-1">
                  {n.pros.map((pro, i) => (
                    <li
                      key={i}
                      className="text-xs text-text-secondary flex items-start gap-2"
                    >
                      <span className="text-success mt-0.5 shrink-0">+</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-danger mb-2">
                  Cons
                </h4>
                <ul className="space-y-1">
                  {n.cons.map((con, i) => (
                    <li
                      key={i}
                      className="text-xs text-text-secondary flex items-start gap-2"
                    >
                      <span className="text-danger mt-0.5 shrink-0">-</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function RentCard({
  label,
  min,
  max,
}: {
  label: string;
  min: number;
  max: number;
}) {
  return (
    <div className="rounded-lg bg-bg-primary/50 border border-border-subtle p-3 text-center">
      <p className="text-[10px] uppercase tracking-wider text-text-muted">
        {label}
      </p>
      <p className="font-data text-sm font-semibold text-text-primary mt-1">
        {formatCHF(min)} - {formatCHF(max)}
      </p>
    </div>
  );
}
