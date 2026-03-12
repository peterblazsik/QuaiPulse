"use client";

import type { KreisPricePerSqm } from "@/lib/engines/rental-intelligence";

interface Props {
  data: KreisPricePerSqm[];
}

const TIER_STYLES = {
  budget: { bg: "bg-emerald-500/20", border: "border-emerald-500/40", text: "text-emerald-400" },
  mid: { bg: "bg-blue-500/20", border: "border-blue-500/40", text: "text-blue-400" },
  premium: { bg: "bg-amber-500/20", border: "border-amber-500/40", text: "text-amber-400" },
  luxury: { bg: "bg-red-500/20", border: "border-red-500/40", text: "text-red-400" },
} as const;

export function PriceHeatmap({ data }: Props) {
  // Fill all 12 Kreise (even if no data)
  const allKreise = Array.from({ length: 12 }, (_, i) => i + 1);
  const dataMap = new Map(data.map((d) => [d.kreis, d]));

  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          Price/m² Heatmap
        </h3>
        <div className="flex gap-3 text-[11px]">
          {(["budget", "mid", "premium", "luxury"] as const).map((tier) => (
            <span key={tier} className={`flex items-center gap-1 ${TIER_STYLES[tier].text}`}>
              <span className={`inline-block w-2.5 h-2.5 rounded ${TIER_STYLES[tier].bg} border ${TIER_STYLES[tier].border}`} />
              {tier === "budget" ? "≤30" : tier === "mid" ? "31-40" : tier === "premium" ? "41-55" : "55+"}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-12">
        {allKreise.map((kreis) => {
          const d = dataMap.get(kreis);
          const tier = d?.tier ?? "mid";
          const styles = TIER_STYLES[tier];

          return (
            <div
              key={kreis}
              className={`relative rounded-lg border p-3 text-center transition-all hover:scale-105 ${styles.bg} ${styles.border}`}
            >
              <div className="text-[10px] text-[var(--text-tertiary)] mb-1">
                Kreis {kreis}
              </div>
              <div className={`text-lg font-bold font-mono ${styles.text}`}>
                {d ? d.medianPricePerSqm : "—"}
              </div>
              <div className="text-[10px] text-[var(--text-tertiary)]">
                {d ? `${d.count} apt${d.count !== 1 ? "s" : ""}` : "no data"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
