"use client";

import { useBudgetStore } from "@/lib/stores/budget-store";
import { EXPENSE_CONFIG } from "@/lib/engines/budget-calculator";
import { useSubscriptionTotal } from "@/lib/hooks/use-subscription-total";
import { formatCHF } from "@/lib/utils";
import { RotateCcw, Lock, RefreshCw } from "lucide-react";

export function ExpenseSliders() {
  const values = useBudgetStore((s) => s.values);
  const setValue = useBudgetStore((s) => s.setValue);
  const resetValues = useBudgetStore((s) => s.resetValues);
  const subTotal = useSubscriptionTotal();

  const total = Object.values(values).reduce((a, b) => a + b, 0);
  const subDiff = subTotal.hasDecisions ? subTotal.total - values.subscriptions : 0;
  const showSubSync = subTotal.hasDecisions && Math.abs(subDiff) >= 5;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Zurich Living Costs
          </h3>
          <p className="font-data text-lg font-bold text-text-primary mt-0.5">
            {formatCHF(total)}
            <span className="text-xs font-normal text-text-muted">/mo</span>
          </p>
        </div>
        <button
          onClick={resetValues}
          className="flex items-center gap-1 rounded px-2 py-1 text-[10px] text-text-tertiary hover:bg-bg-tertiary hover:text-text-secondary transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {/* Subscription sync banner */}
      {showSubSync && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-2.5 mb-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] text-amber-400">
              Subscriptions module:{" "}
              <span className="font-data font-semibold">{formatCHF(subTotal.total)}</span>/mo
              {subTotal.savings > 0 && (
                <span className="text-success"> (saving {formatCHF(subTotal.savings)})</span>
              )}
            </p>
            <button
              type="button"
              onClick={() => setValue("subscriptions", subTotal.total)}
              className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 border border-amber-500/30 px-2 py-1 text-[10px] font-medium text-amber-400 hover:bg-amber-500/20 transition-colors shrink-0"
            >
              <RefreshCw className="h-3 w-3" />
              Sync
            </button>
          </div>
        </div>
      )}

      {EXPENSE_CONFIG.map((item) => {
        const key = item.key as keyof typeof values;
        const val = values[key];
        const pct = total > 0 ? (val / total) * 100 : 0;

        return (
          <div key={item.key} className="py-1.5">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[11px] text-text-secondary">
                  {item.label}
                </span>
                {item.fixed && (
                  <Lock className="h-2.5 w-2.5 text-text-muted" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-data text-xs text-text-primary tabular-nums">
                  {formatCHF(val)}
                </span>
                <span className="font-data text-[10px] text-text-muted w-10 text-right tabular-nums">
                  {pct.toFixed(1)}%
                </span>
              </div>
            </div>

            {!item.fixed ? (
              <input
                type="range"
                min={item.min}
                max={item.max}
                step={item.step}
                value={val}
                onChange={(e) => setValue(key, Number(e.target.value))}
                aria-label={item.label}
                className="w-full h-1.5 appearance-none rounded-full bg-bg-tertiary cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-bg-primary
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:-mt-[9px]"
                style={{
                  // @ts-expect-error CSS custom property
                  "--thumb-color": item.color,
                }}
              />
            ) : (
              <div className="h-1.5 w-full rounded-full bg-bg-tertiary overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: "100%", backgroundColor: item.color, opacity: 0.4 }}
                />
              </div>
            )}

            {item.note && (
              <p className="text-[10px] text-text-muted mt-0.5">{item.note}</p>
            )}
          </div>
        );
      })}

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          background: var(--thumb-color, var(--accent-primary));
        }
      `}</style>
    </div>
  );
}
