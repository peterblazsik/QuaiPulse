"use client";

import { usePriorityStore } from "@/lib/stores/priority-store";
import { SCORE_DIMENSIONS } from "@/lib/constants";
import type { ScoreDimension } from "@/lib/types";
import { RotateCcw } from "lucide-react";

export function PrioritySliders() {
  const weights = usePriorityStore((s) => s.weights);
  const setWeight = usePriorityStore((s) => s.setWeight);
  const resetWeights = usePriorityStore((s) => s.resetWeights);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
          Priority Weights
        </h3>
        <button
          onClick={resetWeights}
          className="flex items-center gap-1 rounded px-2 py-1 text-[10px] text-text-tertiary hover:bg-bg-tertiary hover:text-text-secondary transition-colors"
          title="Reset to defaults"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {SCORE_DIMENSIONS.map((dim) => {
        const key = dim.key as ScoreDimension;
        const value = weights[key];
        return (
          <div key={key} className="group flex items-center gap-2 py-1">
            {/* Color dot */}
            <div
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: dim.color }}
            />
            {/* Label */}
            <span className="w-20 text-xs text-text-secondary truncate">
              {dim.label}
            </span>
            {/* Slider */}
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={value}
              onChange={(e) => setWeight(key, Number(e.target.value))}
              className="flex-1 h-1.5 appearance-none rounded-full bg-bg-tertiary cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-bg-primary
                [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform
                [&::-webkit-slider-thumb]:hover:scale-125"
              style={{
                // @ts-expect-error -- CSS custom property for thumb color
                "--thumb-color": dim.color,
              }}
            />
            {/* Value */}
            <span className="w-5 text-right font-data text-xs text-text-secondary tabular-nums">
              {value}
            </span>
          </div>
        );
      })}

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          background: var(--thumb-color, var(--accent-primary));
        }
      `}</style>
    </div>
  );
}
