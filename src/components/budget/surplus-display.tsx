"use client";

import { formatCHF } from "@/lib/utils";
import type { BudgetBreakdown } from "@/lib/engines/budget-calculator";

interface SurplusDisplayProps {
  breakdown: BudgetBreakdown;
}

export function SurplusDisplay({ breakdown }: SurplusDisplayProps) {
  const { surplus, savingsRate, annualSurplus, totalMonthlyIncome: totalIncome, totalExpenses } =
    breakdown;

  const surplusColor =
    surplus >= 3000
      ? "text-success"
      : surplus >= 1500
        ? "text-success"
        : surplus >= 500
          ? "text-warning"
          : "text-danger";

  const ratioUsed = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Giant surplus */}
      <div className="text-center py-3">
        <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">
          Monthly Surplus
        </p>
        <p className={`font-data text-5xl font-black ${surplusColor}`}>
          {formatCHF(surplus)}
        </p>
        <p className="text-xs text-text-tertiary mt-1">
          {formatCHF(annualSurplus)} per year
        </p>
      </div>

      {/* Income vs Expenses bar */}
      <div>
        <div className="flex justify-between text-[10px] text-text-muted mb-1">
          <span>Expenses {formatCHF(totalExpenses)}</span>
          <span>Income {formatCHF(totalIncome)}</span>
        </div>
        <div className="h-4 rounded-full bg-bg-tertiary overflow-hidden relative">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, ratioUsed)}%`,
              background: `linear-gradient(90deg, #ef4444 0%, #f59e0b 60%, #22c55e 100%)`,
            }}
          />
          {surplus > 0 && (
            <div
              className="absolute right-0 top-0 h-full rounded-r-full bg-success/30 border-l-2 border-success"
              style={{ width: `${Math.max(0, 100 - ratioUsed)}%` }}
            />
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <MiniStat
          label="Savings Rate"
          value={`${savingsRate.toFixed(1)}%`}
          color={savingsRate >= 20 ? "text-success" : savingsRate >= 10 ? "text-warning" : "text-danger"}
        />
        <MiniStat
          label="Burn Rate"
          value={`${ratioUsed.toFixed(1)}%`}
          color={ratioUsed <= 70 ? "text-success" : ratioUsed <= 85 ? "text-warning" : "text-danger"}
        />
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-lg bg-bg-primary/50 border border-border-subtle p-3 text-center">
      <p className="text-[10px] uppercase tracking-wider text-text-muted">
        {label}
      </p>
      <p className={`font-data text-xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}
