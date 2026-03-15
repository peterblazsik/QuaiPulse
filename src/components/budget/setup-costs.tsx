"use client";

import { useBudgetStore } from "@/lib/stores/budget-store";
import { formatCHF } from "@/lib/utils";
import { Tip } from "@/components/ui/tooltip";

export const SETUP_COST_ITEMS = [
  { key: "deposit", label: "Apartment deposit (3x rent)", defaultValue: 7200, min: 4500, max: 10500, step: 300, note: "Typically 3 months' rent", tip: "Swiss landlords require a Mietkaution of up to 3 months' rent, held in a blocked bank account (Sperrkonto)" },
  { key: "furniture", label: "Furniture & appliances", defaultValue: 3000, min: 500, max: 8000, step: 250, note: "IKEA to mid-range", tip: "Most Swiss rentals come without kitchen appliances (no fridge, dishwasher, or washing machine)" },
  { key: "moving", label: "Moving costs (VIE→ZRH)", defaultValue: 2500, min: 800, max: 6000, step: 250, note: "Depends on volume", tip: "International move Amsterdam→Zurich. Get 3 quotes. Customs inventory list required for non-EU belongings" },
  { key: "anmeldung", label: "Anmeldung & permits", defaultValue: 200, min: 100, max: 500, step: 50, note: "Registration fees", tip: "Einwohnerkontrolle registration within 14 days of arrival. B permit for EU nationals" },
  { key: "healthSetup", label: "Health insurance setup", defaultValue: 350, min: 0, max: 700, step: 50, note: "First month premium", tip: "Swiss health insurance (KVG) is mandatory. Must enroll within 3 months of arrival. Premiums start ~CHF 300-450/mo" },
  { key: "misc", label: "Misc setup (kitchen, linens, etc.)", defaultValue: 1500, min: 500, max: 4000, step: 250, note: "First-month essentials", tip: "Bedding, kitchenware, cleaning supplies, SBB travelcard, initial groceries" },
] as const;

const DEFAULT_SETUP: Record<string, number> = Object.fromEntries(
  SETUP_COST_ITEMS.map((i) => [i.key, i.defaultValue])
);

export function SetupCosts() {
  const setupCosts = useBudgetStore((s) => s.setupCosts);
  const setSetupCost = useBudgetStore((s) => s.setSetupCost);

  const costs = { ...DEFAULT_SETUP, ...setupCosts };
  const total = Object.values(costs).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          One-Time Setup Costs (Months 1-3)
        </h4>
        <span className="font-data text-xs text-warning tabular-nums">
          {formatCHF(total)}
        </span>
      </div>

      <div className="space-y-2">
        {SETUP_COST_ITEMS.map((item) => {
          const value = costs[item.key] ?? item.defaultValue;
          return (
            <div key={item.key} className="space-y-0.5">
              <div className="flex items-center justify-between">
                <Tip content={item.tip}>
                  <span className="text-[10px] text-text-secondary" tabIndex={0}>{item.label}</span>
                </Tip>
                <span className="font-data text-[10px] text-text-primary tabular-nums">
                  {formatCHF(value)}
                </span>
              </div>
              <input
                type="range"
                min={item.min}
                max={item.max}
                step={item.step}
                value={value}
                onChange={(e) => setSetupCost(item.key, Number(e.target.value))}
                className="w-full h-1 appearance-none rounded-full bg-bg-tertiary cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-warning
                  [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <p className="text-[10px] text-text-muted">{item.note}</p>
            </div>
          );
        })}
      </div>

      {/* Monthly impact for months 1-3 */}
      <div className="rounded-lg bg-warning/10 border border-warning/20 p-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider text-text-muted">
            Monthly impact (spread over 3 months)
          </span>
          <span className="font-data text-sm font-bold text-warning tabular-nums">
            +{formatCHF(Math.round(total / 3))}/mo
          </span>
        </div>
        <p className="text-[10px] text-text-muted mt-1">
          Your surplus drops by {formatCHF(Math.round(total / 3))}/mo for the first 3 months.
          After that, steady-state budget resumes.
        </p>
      </div>
    </div>
  );
}
