"use client";

import { useMemo, useState } from "react";
import { useBudgetStore } from "@/lib/stores/budget-store";
import {
  compareTaxMethods,
  createDefaultDeductions,
  getSupportedTariffCodes,
  ORDINARY_TAX_MANDATORY_THRESHOLD,
  type OrdinaryDeductions,
} from "@/lib/engines/tax-comparison";
import { formatCHF } from "@/lib/utils";
import { Scale, AlertTriangle, ChevronDown, ChevronUp, Info } from "lucide-react";
import { Tip } from "@/components/ui/tooltip";

export function TaxComparison() {
  const grossMonthlySalary = useBudgetStore((s) => s.grossMonthlySalary);
  const has13thSalary = useBudgetStore((s) => s.has13thSalary);
  const bvgMonthly = useBudgetStore((s) => s.bvgMonthly);
  const pillar3aMonthly = useBudgetStore((s) => s.pillar3aMonthly);

  const grossAnnual = grossMonthlySalary * (has13thSalary ? 13 : 12);

  const [tariffCode, setTariffCode] = useState("A0");
  const [showDeductions, setShowDeductions] = useState(false);

  // Editable deductions starting from defaults (recalculate when tariff changes)
  const defaultDeductions = useMemo(
    () => createDefaultDeductions(grossAnnual, tariffCode),
    [grossAnnual, tariffCode]
  );
  const [deductionOverrides, setDeductionOverrides] = useState<Partial<OrdinaryDeductions>>({});

  const deductions = useMemo(
    (): OrdinaryDeductions => ({
      ...defaultDeductions,
      bvgContribution: bvgMonthly * 12,
      pillar3a: pillar3aMonthly * 12,
      ...deductionOverrides,
    }),
    [defaultDeductions, bvgMonthly, pillar3aMonthly, deductionOverrides]
  );

  const result = useMemo(
    () => compareTaxMethods({ grossAnnual, tariffCode, deductions, steuerfuss: 119 }),
    [grossAnnual, tariffCode, deductions]
  );

  const tariffCodes = getSupportedTariffCodes();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Scale className="h-4 w-4 text-accent-primary" />
            Tax Method Comparison
          </h3>
          <p className="text-[10px] text-text-muted mt-0.5">
            <Tip content="Quellensteuer = withholding tax (deducted at source by employer). Ordinary = annual self-assessment like most Swiss residents. Above CHF 120k gross, ordinary taxation is mandatory">
              <span tabIndex={0}>Quellensteuer vs Ordinary Taxation</span>
            </Tip>
          </p>
        </div>
        <select
          value={tariffCode}
          onChange={(e) => setTariffCode(e.target.value)}
          className="rounded-lg border border-border-default bg-bg-primary px-2 py-1 text-[10px] text-text-primary focus:border-accent-primary focus:outline-none"
        >
          {tariffCodes.map((t) => (
            <option key={t.code} value={t.code}>
              {t.code}: {t.description}
            </option>
          ))}
        </select>
      </div>

      {/* Mandatory notice */}
      {result.ordinaryMandatory && (
        <div className="mb-3 rounded-lg bg-accent-primary/10 border border-accent-primary/20 p-2.5 flex items-start gap-2">
          <Info className="h-3.5 w-3.5 text-accent-primary shrink-0 mt-0.5" />
          <p className="text-[10px] text-accent-primary leading-snug">
            Income &gt; {formatCHF(ORDINARY_TAX_MANDATORY_THRESHOLD)} = mandatory ordinary taxation.
            Quellensteuer shown for comparison only.
          </p>
        </div>
      )}

      {/* Side by side cards */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Quellensteuer */}
        <div className={`rounded-lg p-3 border ${result.betterMethod === "quellensteuer" ? "border-success/30 bg-success/5" : "border-border-subtle bg-bg-primary/30"}`}>
          <Tip content="Withholding tax deducted directly from salary. Simple — no annual tax return needed. Limited deductions available">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1" tabIndex={0}>
              Quellensteuer
            </p>
          </Tip>
          <p className="font-data text-xl font-bold text-text-primary">
            {formatCHF(result.quellensteuer.annual)}
          </p>
          <p className="text-[10px] text-text-muted">
            {formatCHF(result.quellensteuer.monthly)}/mo &middot; {result.quellensteuer.effectiveRate}%
          </p>
        </div>

        {/* Ordinary */}
        <div className={`rounded-lg p-3 border ${result.betterMethod === "ordinary" ? "border-success/30 bg-success/5" : "border-border-subtle bg-bg-primary/30"}`}>
          <Tip content="Annual self-assessment with full deductions (commute, meals, insurance, BVG buyback, Pillar 3a). More paperwork but often lower total tax">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1" tabIndex={0}>
              Ordinary Tax
            </p>
          </Tip>
          <p className="font-data text-xl font-bold text-text-primary">
            {formatCHF(result.ordinary.annual)}
          </p>
          <p className="text-[10px] text-text-muted">
            {formatCHF(result.ordinary.monthly)}/mo &middot; {result.ordinary.effectiveRate}%
          </p>
        </div>
      </div>

      {/* Verdict */}
      <div className={`rounded-lg p-3 text-center ${result.delta > 0 ? "bg-success/10 border border-success/20" : result.delta < 0 ? "bg-danger/10 border border-danger/20" : "bg-bg-primary/30 border border-border-subtle"}`}>
        <p className={`font-data text-lg font-bold ${result.delta > 0 ? "text-success" : result.delta < 0 ? "text-danger" : "text-text-muted"}`}>
          {result.delta > 0
            ? `Ordinary saves ${formatCHF(result.delta)}/yr`
            : result.delta < 0
              ? `Quellensteuer saves ${formatCHF(Math.abs(result.delta))}/yr`
              : "Both methods equal"}
        </p>
        <p className="text-[10px] text-text-muted mt-0.5">
          Deductions used: {formatCHF(result.deductionsUsed)}
        </p>
      </div>

      {/* Deduction editor */}
      <button
        onClick={() => setShowDeductions(!showDeductions)}
        className="flex items-center gap-1 mt-3 text-[10px] text-text-muted hover:text-text-secondary"
      >
        {showDeductions ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        Adjust deductions
      </button>

      {showDeductions && (
        <div className="mt-2 space-y-2 rounded-lg bg-bg-primary/30 p-3 border border-border-subtle">
          {([
            { key: "bvgBuyback" as const, label: "BVG Buyback", max: 200000 },
            { key: "commuteDeduction" as const, label: "Commute", max: 5000 },
            { key: "mealDeduction" as const, label: "Meals", max: 5000 },
            { key: "insuranceDeduction" as const, label: "Insurance", max: 10000 },
            { key: "otherDeductions" as const, label: "Other", max: 5000 },
          ] as const).map((d) => (
            <div key={d.key} className="flex items-center justify-between">
              <label className="text-[10px] text-text-muted w-20">{d.label}</label>
              <input
                type="number"
                min={0}
                max={d.max}
                step={100}
                value={deductions[d.key]}
                onChange={(e) =>
                  setDeductionOverrides((prev) => ({
                    ...prev,
                    [d.key]: Number(e.target.value),
                  }))
                }
                className="w-24 rounded border border-border-default bg-bg-primary px-2 py-1 text-right text-[10px] font-data text-text-primary focus:border-accent-primary focus:outline-none"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
