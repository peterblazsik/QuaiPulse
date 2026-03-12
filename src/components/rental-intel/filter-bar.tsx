"use client";

import { SlidersHorizontal } from "lucide-react";
import type { ListingSource } from "@/lib/types";

interface Props {
  kreise: number[];
  sources: ListingSource[];
  minPrice: number;
  maxPrice: number;
  onKreisToggle: (kreis: number) => void;
  onSourceToggle: (source: ListingSource) => void;
  onPriceChange: (min: number, max: number) => void;
}

const ALL_KREISE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export function FilterBar({
  kreise,
  sources,
  minPrice,
  maxPrice,
  onKreisToggle,
  onSourceToggle,
  onPriceChange,
}: Props) {
  return (
    <div className="sticky top-0 z-30 bg-[var(--bg-primary)]/95 backdrop-blur-sm border-b border-[var(--border-default)] py-3 px-1">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 text-[var(--text-tertiary)]">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span className="text-[11px] font-medium">Filters</span>
        </div>

        {/* Kreis chips */}
        <div className="flex items-center gap-1 flex-wrap">
          {ALL_KREISE.map((k) => {
            const active = kreise.length === 0 || kreise.includes(k);
            return (
              <button
                key={k}
                onClick={() => onKreisToggle(k)}
                className={`text-[10px] px-2 py-1 rounded-full border transition-colors ${
                  active
                    ? "bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border-[var(--accent-primary)]/30"
                    : "bg-transparent text-[var(--text-tertiary)] border-[var(--border-default)] opacity-50"
                }`}
              >
                K{k}
              </button>
            );
          })}
        </div>

        {/* Source toggle */}
        <div className="flex items-center gap-1">
          {(["flatfox", "homegate"] as const).map((src) => {
            const active = sources.includes(src);
            const colors = src === "flatfox"
              ? "text-orange-400 border-orange-500/30 bg-orange-500/15"
              : "text-blue-400 border-blue-500/30 bg-blue-500/15";
            return (
              <button
                key={src}
                onClick={() => onSourceToggle(src)}
                className={`text-[10px] px-2.5 py-1 rounded-full border transition-colors ${
                  active
                    ? colors
                    : "bg-transparent text-[var(--text-tertiary)] border-[var(--border-default)] opacity-50"
                }`}
              >
                {src === "flatfox" ? "Flatfox" : "Homegate"}
              </button>
            );
          })}
        </div>

        {/* Price range */}
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-[var(--text-tertiary)]">CHF</span>
          <input
            type="number"
            value={minPrice || ""}
            onChange={(e) => onPriceChange(Number(e.target.value) || 0, maxPrice)}
            placeholder="min"
            className="w-16 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded px-2 py-1 text-[var(--text-primary)] font-mono text-[11px] focus:outline-none focus:border-[var(--accent-primary)]"
          />
          <span className="text-[var(--text-tertiary)]">–</span>
          <input
            type="number"
            value={maxPrice < 10000 ? maxPrice : ""}
            onChange={(e) => onPriceChange(minPrice, Number(e.target.value) || 10000)}
            placeholder="max"
            className="w-16 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded px-2 py-1 text-[var(--text-primary)] font-mono text-[11px] focus:outline-none focus:border-[var(--accent-primary)]"
          />
        </div>
      </div>
    </div>
  );
}
