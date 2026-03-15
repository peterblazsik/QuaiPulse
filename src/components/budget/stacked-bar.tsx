"use client";

import { useBudgetStore } from "@/lib/stores/budget-store";
import { EXPENSE_CONFIG } from "@/lib/engines/budget-calculator";
import { useBudgetWithTax } from "@/lib/hooks/use-budget-with-tax";
import { formatCHF } from "@/lib/utils";
import { Tip } from "@/components/ui/tooltip";

export function StackedBar() {
  const values = useBudgetStore((s) => s.values);
  const breakdown = useBudgetWithTax();

  // Build segments: fixed outside + zurich costs
  const segments: { label: string; value: number; color: string }[] = [
    { label: "Vienna / Fixed", value: breakdown.fixedOutside, color: "#475569" },
    ...EXPENSE_CONFIG.map((e) => ({
      label: e.label,
      value: values[e.key as keyof typeof values],
      color: e.color,
    })),
  ];

  if (breakdown.monthlyTax > 0) {
    segments.push({ label: "Tax", value: breakdown.monthlyTax, color: "#6366f1" });
  }

  if (breakdown.pillar3aMonthly > 0) {
    segments.push({ label: "Pillar 3a", value: breakdown.pillar3aMonthly, color: "#14b8a6" });
  }

  const totalExpenses = segments.reduce((s, seg) => s + seg.value, 0);
  const totalIncome = breakdown.totalMonthlyIncome;

  if (breakdown.surplus > 0) {
    segments.push({ label: "Surplus", value: breakdown.surplus, color: "#22c55e" });
  }

  const barTotal = Math.max(totalIncome, totalExpenses);

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
        Expense Breakdown
      </h4>

      {/* Stacked horizontal bar */}
      <div className="h-8 rounded-lg overflow-hidden flex bg-bg-tertiary">
        {segments.map((seg) => {
          const pct = (seg.value / barTotal) * 100;
          if (pct < 0.5) return null;
          return (
            <Tip key={seg.label} content={`${seg.label}: ${formatCHF(seg.value)} (${pct.toFixed(1)}% of income)`}>
              <div
                className="h-full relative group/seg transition-all duration-300"
                style={{ width: `${pct}%`, backgroundColor: seg.color }}
                tabIndex={0}
              >
                {pct > 6 && (
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-data text-white/90 font-medium">
                    {formatCHF(seg.value)}
                  </span>
                )}
              </div>
            </Tip>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <div
              className="h-2 w-2 rounded-sm shrink-0"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-[10px] text-text-muted">{seg.label}</span>
            <span className="font-data text-[10px] text-text-tertiary">
              {formatCHF(seg.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
