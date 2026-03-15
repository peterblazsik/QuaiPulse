"use client";

import { motion } from "framer-motion";
import { formatScore, scoreTextClass } from "@/lib/engines/scoring";
import { SCORE_DIMENSIONS } from "@/lib/constants";
import type { ScoreDimension } from "@/lib/types";
import { Tip } from "@/components/ui/tooltip";

const DIMENSION_TIPS: Record<string, string> = {
  commute: "Minutes to Quai Zurich Campus (Mythenquai) by public transit",
  gym: "Number and proximity of quality gyms within walking distance",
  social: "Bars, restaurants, and nightlife density",
  lake: "Walking distance to Lake Zurich shore access",
  airport: "Travel time to Zurich Airport (ZRH)",
  food: "Grocery stores, restaurants, and food variety",
  quiet: "Noise levels — traffic, nightlife, flight paths",
  transit: "Public transit connections (tram, bus, S-Bahn frequency)",
  cost: "Average rent and cost of living relative to city average",
  safety: "Crime statistics and perceived safety",
  flightNoise: "Aircraft noise exposure from Zurich Airport approaches",
  parking: "On-street and garage parking availability",
};

interface ScoreBreakdownProps {
  scores: Record<ScoreDimension, number>;
  notes: Record<string, string>;
  animationDelay?: number;
}

export function ScoreBreakdown({ scores, notes, animationDelay = 0.15 }: ScoreBreakdownProps) {
  return (
    <div className="space-y-3">
      {SCORE_DIMENSIONS.map((dim) => {
        const key = dim.key as ScoreDimension;
        const score = scores[key];
        const note = notes[key];
        return (
          <div key={key}>
            <div className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: dim.color }}
              />
              <Tip content={DIMENSION_TIPS[key] ?? dim.label}>
              <span className="text-xs text-text-secondary w-24 font-medium" tabIndex={0}>
                {dim.label}
              </span>
              </Tip>
              <div className="flex-1 h-2 rounded-full bg-bg-tertiary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(score / 10) * 100}%` }}
                  transition={{ duration: 0.6, delay: animationDelay }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: dim.color }}
                />
              </div>
              <span
                className={`font-data text-sm font-semibold w-8 text-right ${scoreTextClass(score)}`}
              >
                {formatScore(score)}
              </span>
            </div>
            {note && (
              <p className="text-[11px] text-text-muted ml-[136px] mt-1 leading-snug">
                {note}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
