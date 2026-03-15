"use client";

import type { ValueScoreBreakdown } from "@/lib/types";
import { Tip } from "@/components/ui/tooltip";

const DIMENSION_TIPS: Record<string, string> = {
  priceScore: "How the price per m\u00B2 compares to market median. Higher = better deal",
  kreisScore: "Desirability of the Kreis (district). Based on neighborhood rankings",
  commuteScore: "Commute time to Quai Zurich Campus at Mythenquai. Shorter = higher score",
  roomScore: "Room count fit for your target (2-3 rooms). Exact match = 100",
  budgetScore: "How well the rent fits within your monthly budget. Under budget = higher score",
};

interface Props {
  breakdown: ValueScoreBreakdown;
  finalScore: number;
}

const DIMENSIONS = [
  { key: "priceScore" as const, weightKey: "priceWeight" as const, label: "Price/m²", desc: "vs market median" },
  { key: "kreisScore" as const, weightKey: "kreisWeight" as const, label: "Kreis", desc: "desirability" },
  { key: "commuteScore" as const, weightKey: "commuteWeight" as const, label: "Commute", desc: "to Mythenquai" },
  { key: "roomScore" as const, weightKey: "roomWeight" as const, label: "Rooms", desc: "fit for 2-3 target" },
  { key: "budgetScore" as const, weightKey: "budgetWeight" as const, label: "Budget", desc: "affordability" },
] as const;

function barColor(score: number): string {
  if (score >= 70) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-red-500";
}

function textColor(score: number): string {
  if (score >= 70) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  return "text-red-400";
}

export function ValueScoreBreakdownPanel({ breakdown, finalScore }: Props) {
  return (
    <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-[var(--text-tertiary)]">Score Breakdown</div>
        <Tip content="Composite value score (0-100). Weighted sum of all dimensions below">
          <div className={`text-lg font-bold font-mono ${textColor(finalScore)}`} tabIndex={0}>
            {finalScore}
          </div>
        </Tip>
      </div>

      <div className="space-y-2.5">
        {DIMENSIONS.map(({ key, weightKey, label, desc }) => {
          const score = breakdown[key];
          const weight = breakdown[weightKey];
          const weighted = Math.round(score * weight);

          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <Tip content={DIMENSION_TIPS[key]}>
                    <span className="text-[11px] font-medium text-[var(--text-secondary)]" tabIndex={0}>
                      {label}
                    </span>
                  </Tip>
                  <span className="text-[10px] text-[var(--text-tertiary)]">
                    {desc} ({Math.round(weight * 100)}%)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono ${textColor(score)}`}>
                    {score}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-tertiary)]">
                    +{weighted}
                  </span>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--bg-primary)] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${barColor(score)}`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-[var(--border-default)] text-[10px] text-[var(--text-tertiary)]">
        <Tip content="Median price per square meter across all tracked Zurich listings">
          <span tabIndex={0}>Market median: {breakdown.medianPricePerSqm} CHF/m²</span>
        </Tip>
      </div>
    </div>
  );
}
