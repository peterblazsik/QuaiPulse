"use client";

import { useBudgetStore } from "@/lib/stores/budget-store";
import { TAX_RATES, getTaxDataByLocationId, taxSavingsVsCity } from "@/lib/data/tax-rates";
import { ALL_LOCATIONS } from "@/lib/data/neighborhoods";
import { formatCHF } from "@/lib/utils";
import { Landmark, TrendingDown, Info } from "lucide-react";

const locationOptions = TAX_RATES.map((t) => {
  const loc = ALL_LOCATIONS.find((l) => l.id === t.locationId);
  return {
    id: t.locationId,
    name: loc?.name ?? t.municipality,
    municipality: t.municipality,
    steuerfuss: t.steuerfuss,
  };
}).sort((a, b) => a.name.localeCompare(b.name));

export function TaxEstimation() {
  const taxLocationId = useBudgetStore((s) => s.taxLocationId);
  const setTaxLocation = useBudgetStore((s) => s.setTaxLocation);

  const taxData = taxLocationId ? getTaxDataByLocationId(taxLocationId) : undefined;
  const savings = taxLocationId ? taxSavingsVsCity(taxLocationId) : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
          <Landmark className="h-3.5 w-3.5 text-blue-400" />
          Swiss Tax Estimation
        </h4>
        {taxData && (
          <span className="font-data text-sm font-semibold text-text-primary">
            {formatCHF(taxData.estimatedMonthlyTax)}/mo
          </span>
        )}
      </div>

      {/* Location selector */}
      <div>
        <label className="text-[10px] uppercase tracking-wider text-text-muted block mb-1">
          Tax municipality
        </label>
        <select
          value={taxLocationId}
          onChange={(e) => setTaxLocation(e.target.value)}
          className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-primary"
        >
          <option value="">None — exclude tax from budget</option>
          {locationOptions.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name} ({loc.municipality}) — Steuerfuss {loc.steuerfuss}%
            </option>
          ))}
        </select>
      </div>

      {/* Tax breakdown */}
      {taxData && (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-bg-tertiary/50 p-2">
              <p className="text-[10px] text-text-muted">Steuerfuss</p>
              <p className="font-data text-sm font-semibold text-text-primary">
                {taxData.steuerfuss}%
              </p>
            </div>
            <div className="rounded-lg bg-bg-tertiary/50 p-2">
              <p className="text-[10px] text-text-muted">Effective Rate</p>
              <p className="font-data text-sm font-semibold text-text-primary">
                {taxData.effectiveRate}%
              </p>
            </div>
            <div className="rounded-lg bg-bg-tertiary/50 p-2">
              <p className="text-[10px] text-text-muted">Annual Tax</p>
              <p className="font-data text-sm font-semibold text-text-primary">
                {formatCHF(taxData.estimatedAnnualTax)}
              </p>
            </div>
          </div>

          {/* Savings vs city */}
          {savings !== 0 && (
            <div
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
                savings > 0
                  ? "bg-success/10 text-success border border-success/20"
                  : "bg-bg-tertiary text-text-muted"
              }`}
            >
              <TrendingDown className="h-3.5 w-3.5 shrink-0" />
              {savings > 0
                ? `Save ${formatCHF(savings)}/year vs Zurich city`
                : `${formatCHF(Math.abs(savings))}/year more than cheapest municipality`}
            </div>
          )}

          {/* Note */}
          <p className="text-[10px] text-text-muted flex items-start gap-1">
            <Info className="h-3 w-3 mt-0.5 shrink-0" />
            {taxData.note}
          </p>
        </div>
      )}

      {!taxData && (
        <p className="text-[10px] text-text-muted">
          Select a municipality to include estimated income tax in your budget.
          Tax varies from ~8.5% (Rüschlikon) to ~12.3% (Zurich city) — up to CHF 5,500/yr difference.
        </p>
      )}
    </div>
  );
}
