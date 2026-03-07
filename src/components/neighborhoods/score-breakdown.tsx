"use client";

import { motion } from "framer-motion";
import { formatScore, scoreTextClass } from "@/lib/engines/scoring";
import { SCORE_DIMENSIONS } from "@/lib/constants";
import type { ScoreDimension } from "@/lib/types";

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
              <span className="text-xs text-text-secondary w-24 font-medium">
                {dim.label}
              </span>
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
