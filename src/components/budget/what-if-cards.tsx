"use client";

import { useBudgetStore } from "@/lib/stores/budget-store";
import {
  WHAT_IF_SCENARIOS,
  calculateBudget,
} from "@/lib/engines/budget-calculator";
import { formatCHF } from "@/lib/utils";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";

export function WhatIfCards() {
  const values = useBudgetStore((s) => s.values);
  const setValue = useBudgetStore((s) => s.setValue);
  const currentBudget = calculateBudget(values);

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
        What-If Scenarios
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {WHAT_IF_SCENARIOS.map((scenario) => {
          // Calculate scenario impact
          const scenarioValues = { ...values, ...scenario.changes };
          const scenarioBudget = calculateBudget(scenarioValues);
          const impact = scenarioBudget.surplus - currentBudget.surplus;
          const isPositive = impact >= 0;

          return (
            <button
              key={scenario.id}
              onClick={() => {
                for (const [key, val] of Object.entries(scenario.changes)) {
                  setValue(key as keyof typeof values, val);
                }
              }}
              className="text-left rounded-lg border border-border-default bg-bg-secondary/50 p-3 hover:border-accent-primary/40 transition-colors group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-text-primary truncate">
                    {scenario.label}
                  </p>
                  <p className="text-[10px] text-text-muted mt-0.5">
                    {scenario.description}
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-1">
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-400" />
                  )}
                  <span
                    className={`font-data text-xs font-bold ${isPositive ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {isPositive ? "+" : ""}
                    {formatCHF(impact)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2 text-[10px] text-text-tertiary">
                <span>Surplus: {formatCHF(scenarioBudget.surplus)}</span>
                <ArrowRight className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-accent-primary" />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-accent-primary">
                  Apply
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
