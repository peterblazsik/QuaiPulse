"use client";

import { useBudgetStore, FIXED_INCOME } from "@/lib/stores/budget-store";
import {
  EXPENSE_CONFIG,
  FIXED_OUTSIDE_ITEMS,
} from "@/lib/engines/budget-calculator";
import { formatCHF } from "@/lib/utils";

export function StackedBar() {
  const values = useBudgetStore((s) => s.values);

  // Build segments: fixed outside + zurich costs
  const fixedTotal = FIXED_OUTSIDE_ITEMS.reduce((s, i) => s + i.value, 0);
  const segments: { label: string; value: number; color: string }[] = [
    { label: "Vienna / Fixed", value: fixedTotal, color: "#475569" },
    ...EXPENSE_CONFIG.map((e) => ({
      label: e.label,
      value: values[e.key as keyof typeof values],
      color: e.color,
    })),
  ];

  const totalExpenses = segments.reduce((s, seg) => s + seg.value, 0);
  const surplus = FIXED_INCOME - totalExpenses;

  if (surplus > 0) {
    segments.push({ label: "Surplus", value: surplus, color: "#22c55e" });
  }

  const barTotal = Math.max(FIXED_INCOME, totalExpenses);

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
            <div
              key={seg.label}
              className="h-full relative group/seg transition-all duration-300"
              style={{ width: `${pct}%`, backgroundColor: seg.color }}
              title={`${seg.label}: ${formatCHF(seg.value)}`}
            >
              {pct > 6 && (
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-data text-white/90 font-medium">
                  {formatCHF(seg.value)}
                </span>
              )}
            </div>
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
