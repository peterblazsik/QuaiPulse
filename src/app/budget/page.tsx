"use client";

import { useMemo } from "react";
import { useBudgetStore } from "@/lib/stores/budget-store";
import { calculateBudget } from "@/lib/engines/budget-calculator";
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
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Budget Simulator
        </h1>
        <p className="text-sm text-text-tertiary mt-1">
          Drag the sliders. Watch your surplus move in real time. Every CHF
          accounted for.
        </p>
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
