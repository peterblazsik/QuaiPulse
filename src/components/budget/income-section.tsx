"use client";

import { useBudgetStore } from "@/lib/stores/budget-store";
import { AHV_RATE, ALV_RATE, ALV_CAP } from "@/lib/engines/budget-calculator";
import { TAX_RATES, getTaxDataByLocationId, taxSavingsVsCity } from "@/lib/data/tax-rates";
import { ALL_LOCATIONS } from "@/lib/data/neighborhoods";
import { formatCHF } from "@/lib/utils";
import { useBudgetWithTax } from "@/lib/hooks/use-budget-with-tax";
import {
  TrendingDown,
  Landmark,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import { useState } from "react";

const locationOptions = TAX_RATES.map((t) => {
  const loc = ALL_LOCATIONS.find((l) => l.id === t.locationId);
  return {
    id: t.locationId,
    name: loc?.name ?? t.municipality,
    municipality: t.municipality,
    steuerfuss: t.steuerfuss,
  };
}).sort((a, b) => a.name.localeCompare(b.name));

const SLIDER_CLASSES =
  "w-full h-1.5 appearance-none rounded-full bg-bg-tertiary cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-primary [&::-webkit-slider-thumb]:cursor-pointer";

interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  suffix?: string;
}

function SliderRow({ label, value, min, max, step, onChange, format, suffix = "/mo" }: SliderRowProps) {
  return (
    <div className="py-1">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-text-secondary">{label}</span>
        <span className="font-data text-xs text-text-primary tabular-nums">
          {format ? format(value) : formatCHF(value)}{suffix && <span className="text-text-muted text-[10px]">{suffix}</span>}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={SLIDER_CLASSES}
      />
    </div>
  );
}

function StatRow({ label, value, negative, muted }: { label: string; value: string; negative?: boolean; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className={`text-[11px] ${muted ? "text-text-muted" : "text-text-secondary"}`}>{label}</span>
      <span className={`font-data text-xs tabular-nums ${negative ? "text-red-400" : "text-text-primary"}`}>
        {value}
      </span>
    </div>
  );
}

function SectionDivider({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={`flex items-center justify-between pt-1.5 pb-0.5 border-t border-border-subtle`}>
      <span className="text-xs font-semibold text-text-primary">{label}</span>
      <span className={`font-data text-sm font-bold tabular-nums ${color}`}>{value}</span>
    </div>
  );
}

export function IncomeSection() {
  const grossMonthlySalary = useBudgetStore((s) => s.grossMonthlySalary);
  const setGrossMonthlySalary = useBudgetStore((s) => s.setGrossMonthlySalary);
  const has13thSalary = useBudgetStore((s) => s.has13thSalary);
  const setHas13thSalary = useBudgetStore((s) => s.setHas13thSalary);
  const expenseAllowance = useBudgetStore((s) => s.expenseAllowance);
  const setExpenseAllowance = useBudgetStore((s) => s.setExpenseAllowance);
  const bvgMonthly = useBudgetStore((s) => s.bvgMonthly);
  const setBvgMonthly = useBudgetStore((s) => s.setBvgMonthly);
  const pillar3aMonthly = useBudgetStore((s) => s.pillar3aMonthly);
  const setPillar3a = useBudgetStore((s) => s.setPillar3a);
  const taxLocationId = useBudgetStore((s) => s.taxLocationId);
  const setTaxLocation = useBudgetStore((s) => s.setTaxLocation);
  const viennaRent = useBudgetStore((s) => s.viennaRent);
  const childSupport = useBudgetStore((s) => s.childSupport);
  const viennaUtils = useBudgetStore((s) => s.viennaUtils);
  const carInsurance = useBudgetStore((s) => s.carInsurance);
  const setViennaCost = useBudgetStore((s) => s.setViennaCost);

  const breakdown = useBudgetWithTax();
  const taxData = taxLocationId ? getTaxDataByLocationId(taxLocationId) : undefined;
  const savings = taxLocationId ? taxSavingsVsCity(taxLocationId) : 0;

  const [showViennaSliders, setShowViennaSliders] = useState(false);

  return (
    <div className="space-y-4">
      {/* ── GROSS SALARY ── */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          Gross Salary
        </h4>
        <SliderRow
          label="Monthly gross"
          value={grossMonthlySalary}
          min={8000}
          max={25000}
          step={100}
          onChange={setGrossMonthlySalary}
        />
        <div className="flex items-center justify-between py-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={has13thSalary}
              onChange={(e) => setHas13thSalary(e.target.checked)}
              className="h-3 w-3 rounded border-border-default bg-bg-tertiary accent-accent-primary"
            />
            <span className="text-[11px] text-text-secondary">13th salary</span>
          </label>
          <span className="font-data text-[10px] text-text-muted tabular-nums">
            ×{has13thSalary ? "13" : "12"} = {formatCHF(breakdown.grossAnnualSalary)}/yr
          </span>
        </div>
        <SectionDivider
          label="Annual Gross"
          value={formatCHF(breakdown.grossAnnualSalary)}
          color="text-text-primary"
        />
      </div>

      {/* ── PAYROLL DEDUCTIONS ── */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          Payroll Deductions
        </h4>
        <StatRow
          label={`AHV/IV/EO (${AHV_RATE}%)`}
          value={`-${formatCHF(breakdown.ahvMonthly)}`}
          negative
        />
        <StatRow
          label={`ALV (${ALV_RATE}%${breakdown.grossAnnualSalary > ALV_CAP ? ", capped" : ""})`}
          value={`-${formatCHF(breakdown.alvMonthly)}`}
          negative
        />
        <SliderRow
          label="BVG / 2nd Pillar"
          value={bvgMonthly}
          min={200}
          max={1200}
          step={10}
          onChange={setBvgMonthly}
        />
        <SectionDivider
          label="Total Deductions"
          value={`-${formatCHF(breakdown.totalSocialMonthly)}`}
          color="text-red-400"
        />
        <p className="text-[10px] text-text-muted mt-1">
          AHV & ALV are fixed by law. BVG varies by employer pension plan — adjust to match your payslip.
        </p>
      </div>

      {/* ── TAX ESTIMATION ── */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2 flex items-center gap-1.5">
          <Landmark className="h-3 w-3 text-blue-400" />
          Tax Municipality
        </h4>

        <select
          value={taxLocationId}
          onChange={(e) => setTaxLocation(e.target.value)}
          className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent-primary mb-2"
        >
          <option value="">No tax modeled</option>
          {locationOptions.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name} ({loc.municipality}) — {loc.steuerfuss}%
            </option>
          ))}
        </select>

        {taxData && (
          <div className="space-y-1.5">
            <div className="grid grid-cols-3 gap-1.5 text-center">
              <div className="rounded-md bg-bg-tertiary/50 p-1.5">
                <p className="text-[10px] text-text-muted">Steuerfuss</p>
                <p className="font-data text-xs font-semibold text-text-primary">{taxData.steuerfuss}%</p>
              </div>
              <div className="rounded-md bg-bg-tertiary/50 p-1.5">
                <p className="text-[10px] text-text-muted">Eff. Rate</p>
                <p className="font-data text-xs font-semibold text-text-primary">{taxData.effectiveRate}%</p>
              </div>
              <div className="rounded-md bg-bg-tertiary/50 p-1.5">
                <p className="text-[10px] text-text-muted">Monthly</p>
                <p className="font-data text-xs font-semibold text-red-400">-{formatCHF(breakdown.monthlyTax)}</p>
              </div>
            </div>

            {savings > 0 && (
              <div className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] bg-success/10 text-success border border-success/20">
                <TrendingDown className="h-3 w-3 shrink-0" />
                Save {formatCHF(savings)}/yr vs Zurich city
              </div>
            )}
          </div>
        )}

        {!taxData && (
          <p className="text-[10px] text-text-muted">
            Tax varies ~8.5% (Rüschlikon) to ~12.3% (Zurich city). Up to CHF 5,500/yr difference.
          </p>
        )}

        {/* Pillar 3a */}
        <div className="mt-2 pt-2 border-t border-border-subtle">
          <SliderRow
            label="Pillar 3a (tax deduction)"
            value={pillar3aMonthly}
            min={0}
            max={588}
            step={50}
            onChange={setPillar3a}
          />
          <p className="text-[10px] text-text-muted">
            Max CHF 7,056/yr. Reduces taxable income & saved from surplus.
          </p>
        </div>

        {taxData && (
          <div className="mt-1.5">
            <StatRow
              label="Taxable income"
              value={`${formatCHF(breakdown.taxableAnnualIncome)}/yr`}
              muted
            />
          </div>
        )}
      </div>

      {/* ── NET INCOME ── */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          Net Monthly Income
        </h4>
        <StatRow label="Net salary" value={formatCHF(breakdown.netMonthlySalary)} />
        <SliderRow
          label="Expense allowance"
          value={expenseAllowance}
          min={0}
          max={1500}
          step={50}
          onChange={setExpenseAllowance}
        />
        <SectionDivider
          label="Take-home"
          value={formatCHF(breakdown.totalMonthlyIncome)}
          color="text-emerald-400"
        />
      </div>

      {/* ── VIENNA FIXED COSTS ── */}
      <div>
        <button
          onClick={() => setShowViennaSliders(!showViennaSliders)}
          className="w-full flex items-center justify-between mb-2 group"
        >
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Fixed Costs (Vienna)
          </h4>
          <div className="flex items-center gap-2">
            <span className="font-data text-xs font-semibold text-red-400 tabular-nums">
              -{formatCHF(breakdown.fixedOutside)}
            </span>
            {showViennaSliders ? (
              <ChevronUp className="h-3.5 w-3.5 text-text-muted" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
            )}
          </div>
        </button>

        {showViennaSliders ? (
          <div className="space-y-0.5">
            <SliderRow label="Vienna rent share" value={viennaRent} min={0} max={2500} step={50} onChange={(v) => setViennaCost("viennaRent", v)} />
            <SliderRow label="Child support" value={childSupport} min={0} max={1500} step={25} onChange={(v) => setViennaCost("childSupport", v)} />
            <SliderRow label="Vienna utilities" value={viennaUtils} min={0} max={500} step={10} onChange={(v) => setViennaCost("viennaUtils", v)} />
            <SliderRow label="Car insurance + OAMTC" value={carInsurance} min={0} max={400} step={5} onChange={(v) => setViennaCost("carInsurance", v)} />
          </div>
        ) : (
          <div className="space-y-0.5">
            {breakdown.viennaBreakdown.map((item) => (
              <StatRow key={item.label} label={item.label} value={`-${formatCHF(item.value)}`} negative />
            ))}
          </div>
        )}
      </div>

      {/* ── AVAILABLE FOR ZURICH ── */}
      <div className="rounded-lg bg-accent-primary/10 border border-accent-primary/20 p-3 text-center">
        <p className="text-[10px] uppercase tracking-wider text-text-muted">
          Available for Zurich
        </p>
        <p className="font-data text-xl font-bold text-accent-primary mt-1">
          {formatCHF(breakdown.totalMonthlyIncome - breakdown.fixedOutside)}
        </p>
        <p className="text-[10px] text-text-muted mt-0.5">
          Take-home minus Vienna costs
        </p>
      </div>

      {/* Subtle info */}
      <p className="text-[10px] text-text-muted flex items-start gap-1">
        <Info className="h-3 w-3 mt-0.5 shrink-0" />
        Tax uses the effective rate × taxable income (gross minus social deductions and Pillar 3a). Actual tax may vary — use ssstv.ch for exact figures.
      </p>
    </div>
  );
}
