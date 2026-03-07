"use client";

import { useMemo } from "react";
import { useBudgetStore } from "@/lib/stores/budget-store";
import { calculateBudget, EXPENSE_CONFIG } from "@/lib/engines/budget-calculator";
import { exportBudgetCSV } from "@/lib/exports";
import { Download } from "lucide-react";
import { IncomeSection } from "@/components/budget/income-section";
import { ExpenseSliders } from "@/components/budget/expense-sliders";
import { SurplusDisplay } from "@/components/budget/surplus-display";
import { StackedBar } from "@/components/budget/stacked-bar";
import { SavingsProjection } from "@/components/budget/savings-projection";
import { WhatIfCards } from "@/components/budget/what-if-cards";

export default function BudgetPage() {
  const values = useBudgetStore((s) => s.values);

  const breakdown = useMemo(
    () => calculateBudget(values),
    [values]
  );

  return (
    <div className="space-y-6 relative">
      {/* Ambient glow */}
      <div className="ambient-glow glow-green" />
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Budget Simulator
          </h1>
          <p className="text-sm text-text-tertiary mt-1">
            Drag the sliders. Watch your surplus move in real time. Every CHF
            accounted for.
          </p>
        </div>
        <button
          onClick={() => exportBudgetCSV(breakdown, EXPENSE_CONFIG, values)}
          className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-lg border border-border-default bg-bg-secondary text-text-muted hover:text-text-secondary hover:border-accent-primary/30 transition-colors shrink-0"
        >
          <Download className="h-3 w-3" />
          Export CSV
        </button>
      </div>

      {/* Main layout: 3-column on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Income + Fixed costs */}
        <div className="lg:col-span-3">
          <div className="sticky top-0 rounded-xl border border-border-default bg-bg-secondary p-4">
            <IncomeSection />
          </div>
        </div>

        {/* Center column: Surplus + Charts */}
        <div className="lg:col-span-5 space-y-5">
          {/* Surplus hero */}
          <div className="rounded-xl border border-border-default bg-bg-secondary p-5">
            <SurplusDisplay breakdown={breakdown} />
          </div>

          {/* Stacked bar */}
          <div className="rounded-xl border border-border-default bg-bg-secondary p-5">
            <StackedBar />
          </div>

          {/* 12-month projection */}
          <div className="rounded-xl border border-border-default bg-bg-secondary p-5">
            <SavingsProjection breakdown={breakdown} />
          </div>

          {/* What-if scenarios */}
          <div className="rounded-xl border border-border-default bg-bg-secondary p-5">
            <WhatIfCards />
          </div>
        </div>

        {/* Right column: Expense sliders */}
        <div className="lg:col-span-4">
          <div className="sticky top-0 rounded-xl border border-border-default bg-bg-secondary p-4">
            <ExpenseSliders />
          </div>
        </div>
      </div>
    </div>
  );
}
