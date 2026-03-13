"use client";

import { useMemo } from "react";
import {
  PILLAR_3A_PROVIDERS,
  PILLAR_3A_MAX_ANNUAL,
  calculateTaxBenefit,
} from "@/lib/data/pillar3a-providers";
import { formatCHF } from "@/lib/utils";
import { Award, Star, TrendingUp, Percent } from "lucide-react";

export function Pillar3aComparison() {
  const taxBenefit = useMemo(
    () => Math.round(calculateTaxBenefit(PILLAR_3A_MAX_ANNUAL, 0.28)),
    []
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Award className="h-4 w-4 text-purple-400" />
            Pillar 3a Providers
          </h3>
          <p className="text-[10px] text-text-muted mt-0.5">
            Investment-based retirement savings comparison
          </p>
        </div>
        <div className="text-right">
          <p className="font-data text-sm font-bold text-success">
            -{formatCHF(taxBenefit)}/yr tax
          </p>
          <p className="text-[10px] text-text-muted">at {formatCHF(PILLAR_3A_MAX_ANNUAL)} contribution</p>
        </div>
      </div>

      {/* Tax benefit callout */}
      <div className="rounded-lg bg-success/5 border border-success/20 p-3 mb-4 text-center">
        <p className="text-xs text-text-secondary">
          Contributing <span className="font-bold">{formatCHF(PILLAR_3A_MAX_ANNUAL)}</span> annually
          saves <span className="font-bold text-success">{formatCHF(taxBenefit)}</span> in taxes
          (at 28% marginal rate)
        </p>
      </div>

      {/* Provider cards */}
      <div className="space-y-2">
        {PILLAR_3A_PROVIDERS.map((provider) => (
          <div
            key={provider.id}
            className={`rounded-lg p-3 border transition-colors ${
              provider.recommended
                ? "border-accent-primary/30 bg-accent-primary/5"
                : "border-border-subtle bg-bg-primary/30"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-text-primary">{provider.name}</p>
                  <span className="text-[10px] rounded px-1 py-0.5 bg-bg-tertiary text-text-muted">
                    {provider.type}
                  </span>
                  {provider.recommended && (
                    <span className="flex items-center gap-0.5 text-[10px] font-bold text-accent-primary bg-accent-primary/10 rounded px-1 py-0.5">
                      <Star className="h-2.5 w-2.5" />
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-text-muted mt-0.5">{provider.note}</p>

                {/* Features */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {provider.features.slice(0, 3).map((f) => (
                    <span
                      key={f}
                      className="text-[10px] rounded bg-bg-tertiary px-1.5 py-0.5 text-text-muted"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="shrink-0 text-right space-y-1">
                <div className="flex items-center gap-1 justify-end">
                  <Percent className="h-2.5 w-2.5 text-text-muted" />
                  <p className="font-data text-sm font-bold text-text-primary">
                    {provider.ter}%
                  </p>
                </div>
                <p className="text-[10px] text-text-muted">TER</p>

                <div className="flex items-center gap-1 justify-end mt-2">
                  <TrendingUp className="h-2.5 w-2.5 text-success" />
                  <p className="font-data text-xs font-bold text-success">
                    {provider.avgReturn5yr !== null ? `${provider.avgReturn5yr}%` : "N/A"}
                  </p>
                </div>
                <p className="text-[10px] text-text-muted">5yr avg</p>

                <p className="text-[10px] text-text-muted mt-1">
                  Max equity: {provider.maxEquityPct}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Strategy note */}
      <div className="mt-3 rounded-lg bg-bg-primary/30 border border-border-subtle p-2.5">
        <p className="text-[10px] text-text-muted leading-snug">
          At age 49, high equity allocation (95-99%) is appropriate for growth. You have 16 years
          until retirement. Consider multiple 3a accounts (up to 5) for tax-optimized staggered
          withdrawals.
        </p>
      </div>
    </div>
  );
}
