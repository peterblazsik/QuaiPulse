"use client";

import {
  INCOME_ITEMS,
  FIXED_OUTSIDE_ITEMS,
} from "@/lib/engines/budget-calculator";
import { FIXED_INCOME, FIXED_COSTS_OUTSIDE } from "@/lib/stores/budget-store";
import { formatCHF } from "@/lib/utils";

export function IncomeSection() {
  return (
    <div className="space-y-4">
      {/* Income */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          Monthly Income
        </h4>
        <div className="space-y-1">
          {INCOME_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between py-1"
            >
              <span className="text-xs text-text-secondary">{item.label}</span>
              <span className="font-data text-xs text-text-primary tabular-nums">
                {formatCHF(item.value)}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-1.5 border-t border-border-subtle">
            <span className="text-xs font-semibold text-text-primary">
              Total Income
            </span>
            <span className="font-data text-sm font-bold text-emerald-400 tabular-nums">
              {formatCHF(FIXED_INCOME)}
            </span>
          </div>
        </div>
      </div>

      {/* Fixed outside costs */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          Fixed Costs (Vienna)
        </h4>
        <div className="space-y-1">
          {FIXED_OUTSIDE_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between py-1"
            >
              <span className="text-xs text-text-secondary">{item.label}</span>
              <span className="font-data text-xs text-text-tertiary tabular-nums">
                -{formatCHF(item.value)}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-1.5 border-t border-border-subtle">
            <span className="text-xs font-semibold text-text-primary">
              Subtotal
            </span>
            <span className="font-data text-sm font-bold text-red-400 tabular-nums">
              -{formatCHF(FIXED_COSTS_OUTSIDE)}
            </span>
          </div>
        </div>
      </div>

      {/* Available for Zurich */}
      <div className="rounded-lg bg-accent-primary/10 border border-accent-primary/20 p-3 text-center">
        <p className="text-[10px] uppercase tracking-wider text-text-muted">
          Available for Zurich
        </p>
        <p className="font-data text-xl font-bold text-accent-primary mt-1">
          {formatCHF(FIXED_INCOME - FIXED_COSTS_OUTSIDE)}
        </p>
      </div>
    </div>
  );
}
