"use client";

import { useBudgetStore } from "@/lib/stores/budget-store";
import { AHV_RATE, ALV_RATE, ALV_CAP, NBUVG_RATE, PILLAR_3A_MAX_MONTHLY, PILLAR_3A_MAX_ANNUAL } from "@/lib/engines/budget-calculator";
import { TAX_RATES, getTaxDataByLocationId, taxSavingsVsCity } from "@/lib/data/tax-rates";
import { ALL_LOCATIONS } from "@/lib/data/neighborhoods";
import { formatCHF } from "@/lib/utils";
import { SLIDER_CLASSES } from "@/lib/constants";
import { useBudgetWithTax } from "@/lib/hooks/use-budget-with-tax";
import { Tip } from "@/components/ui/tooltip";
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

interface SliderRowProps {
  label: React.ReactNode;
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

function StatRow({ label, value, negative, muted }: { label: React.ReactNode; value: string; negative?: boolean; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className={`text-[11px] ${muted ? "text-text-muted" : "text-text-secondary"}`}>{label}</span>
      <span className={`font-data text-xs tabular-nums ${negative ? "text-danger" : "text-text-primary"}`}>
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
  const annualBonusPct = useBudgetStore((s) => s.annualBonusPct);
  const setAnnualBonusPct = useBudgetStore((s) => s.setAnnualBonusPct);
  const expenseAllowance = useBudgetStore((s) => s.expenseAllowance);
  const setExpenseAllowance = useBudgetStore((s) => s.setExpenseAllowance);
  const employerInsuranceContrib = useBudgetStore((s) => s.employerInsuranceContrib);
  const setEmployerInsuranceContrib = useBudgetStore((s) => s.setEmployerInsuranceContrib);
  const mobilityAllowance = useBudgetStore((s) => s.mobilityAllowance);
  const setMobilityAllowance = useBudgetStore((s) => s.setMobilityAllowance);
  const relocationBonus = useBudgetStore((s) => s.relocationBonus);
  const setRelocationBonus = useBudgetStore((s) => s.setRelocationBonus);
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
            <Tip content="Standard in Switzerland — your annual salary is split into 13 monthly payments instead of 12"><span tabIndex={0} className="text-[11px] text-text-secondary">13th salary</span></Tip>
          </label>
          <span className="font-data text-[10px] text-text-muted tabular-nums">
            ×{has13thSalary ? "13" : "12"} = {formatCHF(grossMonthlySalary * (has13thSalary ? 13 : 12))}/yr
          </span>
        </div>
        <SliderRow
          label="Annual bonus"
          value={annualBonusPct}
          min={0}
          max={30}
          step={1}
          onChange={setAnnualBonusPct}
          format={(v) => `${v}%`}
          suffix={annualBonusPct > 0 ? ` (+${formatCHF(Math.round(grossMonthlySalary * (has13thSalary ? 13 : 12) * annualBonusPct / 100))}/yr)` : ""}
        />
        <SectionDivider
          label="Annual Gross (incl. bonus)"
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
          label={<Tip content="AHV = Old-age insurance, IV = Disability, EO = Loss of earnings. Mandatory Swiss social security (employee pays half)"><span tabIndex={0}>{`AHV/IV/EO (${AHV_RATE}%)`}</span></Tip>}
          value={`-${formatCHF(breakdown.ahvMonthly)}`}
          negative
        />
        <StatRow
          label={<Tip content="Unemployment insurance (Arbeitslosenversicherung). Capped at CHF 148,200/yr income"><span tabIndex={0}>{`ALV (${ALV_RATE}%${breakdown.grossAnnualSalary > ALV_CAP ? ", capped" : ""})`}</span></Tip>}
          value={`-${formatCHF(breakdown.alvMonthly)}`}
          negative
        />
        <StatRow
          label={<Tip content="Non-occupational accident insurance (Nichtberufsunfallversicherung). Covers accidents outside work"><span tabIndex={0}>{`NBUVG accident (${NBUVG_RATE}%)`}</span></Tip>}
          value={`-${formatCHF(breakdown.nbuvgMonthly)}`}
          negative
        />
        <SliderRow
          label={<Tip content="Occupational pension (Berufliche Vorsorge). Employer matches your contribution. Amount varies by plan"><span tabIndex={0}>BVG / 2nd Pillar</span></Tip>}
          value={bvgMonthly}
          min={200}
          max={1200}
          step={10}
          onChange={setBvgMonthly}
        />
        <SectionDivider
          label="Total Deductions"
          value={`-${formatCHF(breakdown.totalSocialMonthly)}`}
          color="text-danger"
        />
        <p className="text-[10px] text-text-muted mt-1">
          AHV & ALV are fixed by law. BVG varies by employer pension plan — adjust to match your payslip.
        </p>
      </div>

      {/* ── TAX ESTIMATION ── */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2 flex items-center gap-1.5">
          <Landmark className="h-3 w-3 text-info" />
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
                <Tip content="Municipal tax multiplier. Applied on top of cantonal base rate. Lower = less tax"><p tabIndex={0} className="text-[10px] text-text-muted">Steuerfuss</p></Tip>
                <p className="font-data text-xs font-semibold text-text-primary">{taxData.steuerfuss}%</p>
              </div>
              <div className="rounded-md bg-bg-tertiary/50 p-1.5">
                <Tip content="Your effective income tax rate after all deductions. This is what you actually pay as % of gross"><p tabIndex={0} className="text-[10px] text-text-muted">Eff. Rate</p></Tip>
                <p className="font-data text-xs font-semibold text-text-primary">{taxData.effectiveRate}%</p>
              </div>
              <div className="rounded-md bg-bg-tertiary/50 p-1.5">
                <p className="text-[10px] text-text-muted">Monthly</p>
                <p className="font-data text-xs font-semibold text-danger">-{formatCHF(breakdown.monthlyTax)}</p>
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
            label={<Tip content="Private retirement savings (säule 3a). Fully tax-deductible. Locked until age 60 (or 5 years before retirement)"><span tabIndex={0}>Pillar 3a (tax deduction)</span></Tip>}
            value={pillar3aMonthly}
            min={0}
            max={PILLAR_3A_MAX_MONTHLY}
            step={50}
            onChange={setPillar3a}
          />
          <p className="text-[10px] text-text-muted">
            Max CHF {PILLAR_3A_MAX_ANNUAL.toLocaleString()}/yr. Reduces taxable income & saved from surplus.
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

      {/* ── NET INCOME + EMPLOYER BENEFITS ── */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          Net Income + Benefits
        </h4>
        <StatRow label="Net salary" value={formatCHF(breakdown.netMonthlySalary)} />
        <SliderRow
          label={<Tip content="Tax-free lump sum from employer for work-related expenses (Spesen). Common in Swiss contracts"><span tabIndex={0}>Expense allowance</span></Tip>}
          value={expenseAllowance}
          min={0}
          max={1500}
          step={50}
          onChange={setExpenseAllowance}
        />
        <SliderRow
          label="Insurance contribution"
          value={employerInsuranceContrib}
          min={0}
          max={500}
          step={25}
          onChange={setEmployerInsuranceContrib}
        />
        <SliderRow
          label="Mobility / travel allowance"
          value={mobilityAllowance}
          min={0}
          max={500}
          step={25}
          onChange={setMobilityAllowance}
        />
        <SliderRow
          label={<Tip content="One-time employer payment to cover moving costs. Amortized over 12 months in budget calculations"><span tabIndex={0}>Relocation bonus (one-off)</span></Tip>}
          value={relocationBonus}
          min={0}
          max={20000}
          step={500}
          onChange={setRelocationBonus}
          suffix=""
        />
        {relocationBonus > 0 && (
          <StatRow
            label="Relocation amortized"
            value={`+${formatCHF(breakdown.relocationMonthly)}/mo over 12mo`}
            muted
          />
        )}
        <SectionDivider
          label="Take-home"
          value={formatCHF(breakdown.totalMonthlyIncome)}
          color="text-success"
        />
        <p className="text-[10px] text-text-muted mt-1">
          Benefits (expense, insurance, mobility) are tax-free additions. Relocation bonus amortized over 12 months.
        </p>
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
            <span className="font-data text-xs font-semibold text-danger tabular-nums">
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
        <Tip content="Your monthly budget for all Zurich living costs: rent, food, transport, health insurance, and discretionary spending"><p tabIndex={0} className="text-[10px] uppercase tracking-wider text-text-muted">
          Available for Zurich
        </p></Tip>
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
