"use client";

import {
  INCOME_ITEMS,
  FIXED_OUTSIDE_ITEMS,
} from "@/lib/engines/budget-calculator";
import { FIXED_INCOME, FIXED_COSTS_OUTSIDE, useBudgetStore } from "@/lib/stores/budget-store";
import { formatCHF } from "@/lib/utils";

export function IncomeSection() {
  const has13thSalary = useBudgetStore((s) => s.has13thSalary);
  const setHas13thSalary = useBudgetStore((s) => s.setHas13thSalary);
  const pillar3aMonthly = useBudgetStore((s) => s.pillar3aMonthly);
  const setPillar3a = useBudgetStore((s) => s.setPillar3a);

  const thirteenthBonus = has13thSalary ? Math.round(11450 / 12) : 0;
  const effectiveIncome = FIXED_INCOME + thirteenthBonus;

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

          {/* 13th salary toggle */}
          <div className="flex items-center justify-between py-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={has13thSalary}
                onChange={(e) => setHas13thSalary(e.target.checked)}
                className="h-3 w-3 rounded border-border-default bg-bg-tertiary accent-accent-primary"
              />
              <span className="text-xs text-text-secondary">13th salary</span>
            </label>
            <span className="font-data text-xs text-text-primary tabular-nums">
              {has13thSalary ? `+${formatCHF(thirteenthBonus)}` : "—"}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1.5 border-t border-border-subtle">
            <span className="text-xs font-semibold text-text-primary">
              Total Income
            </span>
            <span className="font-data text-sm font-bold text-emerald-400 tabular-nums">
              {formatCHF(effectiveIncome)}
            </span>
          </div>
        </div>
      </div>

      {/* Pillar 3a */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          Pillar 3a (Tax-Advantaged Savings)
        </h4>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={588}
            step={50}
            value={pillar3aMonthly}
            onChange={(e) => setPillar3a(Number(e.target.value))}
            className="flex-1 h-1.5 appearance-none rounded-full bg-bg-tertiary cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-primary
              [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <span className="font-data text-xs text-text-primary tabular-nums w-20 text-right">
            {formatCHF(pillar3aMonthly)}/mo
          </span>
        </div>
        <p className="text-[10px] text-text-muted mt-1">
          Max CHF 7,056/yr (CHF 588/mo). Deducted from surplus as tax-advantaged savings.
        </p>
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
          {formatCHF(effectiveIncome - FIXED_COSTS_OUTSIDE)}
        </p>
      </div>
    </div>
  );
}
