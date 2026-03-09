"use client";

import { daysUntil, formatCHF } from "@/lib/utils";
import { MOVE_DATE } from "@/lib/constants";
import { useBudgetWithTax } from "@/lib/hooks/use-budget-with-tax";

export function StatusBar() {
  const breakdown = useBudgetWithTax();
  const days = daysUntil(MOVE_DATE);

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
            className={`font-data ${breakdown.surplus >= 0 ? "text-success" : "text-danger"}`}
          >
            {formatCHF(breakdown.surplus)}
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
