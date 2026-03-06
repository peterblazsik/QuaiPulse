"use client";

import { daysUntil, formatCHF } from "@/lib/utils";
import { MOVE_DATE } from "@/lib/constants";
import { useBudgetStore, FIXED_INCOME, FIXED_COSTS_OUTSIDE } from "@/lib/stores/budget-store";

export function StatusBar() {
  const values = useBudgetStore((s) => s.values);
  const days = daysUntil(MOVE_DATE);

  const zurichCosts = Object.values(values).reduce((a, b) => a + b, 0);
  const surplus = FIXED_INCOME - FIXED_COSTS_OUTSIDE - zurichCosts;

  return (
    <footer className="flex h-8 shrink-0 items-center justify-between border-t border-border-default bg-bg-secondary px-6 text-[11px]">
      <div className="flex items-center gap-4">
        {days > 0 && (
          <span className="text-text-tertiary">
            <span className="font-data text-accent-primary">{days}</span> days
            to Zurich
          </span>
        )}
        <span className="text-border-default">|</span>
        <span className="text-text-tertiary">
          <span
            className={`font-data ${surplus >= 0 ? "text-success" : "text-danger"}`}
          >
            {formatCHF(surplus)}
          </span>
          /mo surplus
        </span>
      </div>
      <div className="text-text-muted">
        QuaiPulse v0.1.0
      </div>
    </footer>
  );
}
