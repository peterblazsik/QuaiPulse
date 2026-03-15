"use client";

import { useMemo, useState } from "react";
import { useBudgetStore } from "@/lib/stores/budget-store";
import {
  BVG_COORDINATION_DEDUCTION,
  BVG_MANDATORY_SALARY_CAP,
  getBvgCreditRate,
} from "@/lib/engines/bvg-buyback";
import {
  PILLAR_3A_MAX_ANNUAL,
  calculateTaxBenefit,
} from "@/lib/data/pillar3a-providers";
import { formatCHF } from "@/lib/utils";
import {
  Shield,
  Building2,
  Wallet,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertTriangle,
  Info,
  CheckCircle2,
} from "lucide-react";
import { Tip } from "@/components/ui/tooltip";

// ─── AHV Constants ─────────────────────────────────────────────────────────

const AHV_EMPLOYEE_RATE = 0.053; // 5.3%
const AHV_IV_RATE = 0.007; // 0.7% IV
const AHV_EO_RATE = 0.0025; // 0.25% EO
const AHV_ALV_RATE = 0.011; // 1.1% ALV (up to CHF 148,200)
const AHV_ALV_SOLIDARITY = 0.005; // 0.5% on income above CHF 148,200
const AHV_ALV_CAP = 148_200;
const AHV_FULL_CONTRIBUTION_YEARS = 44; // age 21 to 65
const AHV_MAX_MONTHLY_PENSION = 2_450; // 2026 max single person
const AHV_MIN_MONTHLY_PENSION = 1_225; // 2026 min (50% of max)

// ─── Component ─────────────────────────────────────────────────────────────

export function PensionOverview() {
  const grossMonthlySalary = useBudgetStore((s) => s.grossMonthlySalary);
  const has13thSalary = useBudgetStore((s) => s.has13thSalary);
  const bvgMonthly = useBudgetStore((s) => s.bvgMonthly);
  const pillar3aMonthly = useBudgetStore((s) => s.pillar3aMonthly);

  const grossAnnual = grossMonthlySalary * (has13thSalary ? 13 : 12);

  const [expanded, setExpanded] = useState<1 | 2 | 3 | null>(null);

  const toggle = (pillar: 1 | 2 | 3) =>
    setExpanded((prev) => (prev === pillar ? null : pillar));

  // ─── Pillar 1 calculations ────────────────────────────────────────────

  const ahv = useMemo(() => {
    const employeeAhv = grossAnnual * AHV_EMPLOYEE_RATE;
    const employeeIv = grossAnnual * AHV_IV_RATE;
    const employeeEo = grossAnnual * AHV_EO_RATE;
    const alvBase = Math.min(grossAnnual, AHV_ALV_CAP);
    const alvSolidarity = Math.max(0, grossAnnual - AHV_ALV_CAP) * AHV_ALV_SOLIDARITY;
    const employeeAlv = alvBase * AHV_ALV_RATE + alvSolidarity;
    const totalEmployee = employeeAhv + employeeIv + employeeEo + employeeAlv;

    // Estimate Swiss pension for ~16 years of contribution (age 49 to 65)
    const swissContributionYears = 16;
    const missingYears = AHV_FULL_CONTRIBUTION_YEARS - swissContributionYears;
    // Pro-rata: pension scaled by actual/required years, but bilateral treaty
    // means Austrian years may fill gaps for eligibility (not amount from CH)
    const proRataFactor = swissContributionYears / AHV_FULL_CONTRIBUTION_YEARS;
    const estimatedMonthlyPension = Math.round(AHV_MAX_MONTHLY_PENSION * proRataFactor * 0.55);

    return {
      employeeAhv,
      employeeIv,
      employeeEo,
      employeeAlv,
      totalEmployee,
      totalAnnual: totalEmployee,
      totalMonthly: totalEmployee / 12,
      swissContributionYears,
      missingYears,
      proRataFactor,
      estimatedMonthlyPension,
      estimatedMonthlyPensionLow: Math.round(estimatedMonthlyPension * 0.85),
      estimatedMonthlyPensionHigh: Math.round(estimatedMonthlyPension * 1.15),
    };
  }, [grossAnnual]);

  // ─── Pillar 2 calculations ────────────────────────────────────────────

  const bvg = useMemo(() => {
    const coordinatedSalary = Math.max(0, grossAnnual - BVG_COORDINATION_DEDUCTION);
    const creditRate = getBvgCreditRate(49);
    const annualContribution = coordinatedSalary * creditRate;
    const employeeShare = annualContribution / 2; // typically 50/50
    // Newcomer restriction: first 5 years, buyback limited to 20% of regulatory contributions
    const newcomerBuybackLimit = annualContribution * 0.2;

    return {
      coordinatedSalary,
      creditRate,
      annualContribution,
      employeeShare,
      employerShare: annualContribution - employeeShare,
      monthlyEmployee: employeeShare / 12,
      newcomerBuybackLimit,
    };
  }, [grossAnnual]);

  // ─── Pillar 3a calculations ───────────────────────────────────────────

  const pillar3a = useMemo(() => {
    const annualContribution = pillar3aMonthly * 12;
    const maxContribution = PILLAR_3A_MAX_ANNUAL;
    const taxSaving = calculateTaxBenefit(maxContribution, 0.28);
    const yearsToRetirement = 16;
    const projectedAt7Pct =
      maxContribution *
      ((Math.pow(1.07, yearsToRetirement) - 1) / 0.07);

    return {
      annualContribution,
      maxContribution,
      taxSaving,
      yearsToRetirement,
      projectedAt7Pct: Math.round(projectedAt7Pct),
      currentMonthly: pillar3aMonthly,
      maxMonthly: Math.round(maxContribution / 12),
    };
  }, [pillar3aMonthly]);

  const totalMonthlyDeductions = ahv.totalMonthly + bvg.monthlyEmployee + pillar3aMonthly;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Shield className="h-4 w-4 text-cyan-400" />
            Swiss Pension System Overview
          </h3>
          <p className="text-[10px] text-text-muted mt-0.5">
            Three pillars — click each to expand details
          </p>
        </div>
        <div className="text-right">
          <p className="font-data text-sm font-bold text-text-primary">
            {formatCHF(totalMonthlyDeductions)}/mo
          </p>
          <p className="text-[10px] text-text-muted">total pension deductions</p>
        </div>
      </div>

      {/* Three pillars summary strip */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="rounded-lg bg-cyan-500/5 border border-cyan-500/20 p-2.5 text-center">
          <p className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider">Pillar 1</p>
          <p className="font-data text-sm font-bold text-text-primary mt-0.5">
            {formatCHF(ahv.totalMonthly)}/mo
          </p>
          <p className="text-[10px] text-text-muted">AHV/IV/EO/ALV</p>
        </div>
        <div className="rounded-lg bg-warning/5 border border-warning/20 p-2.5 text-center">
          <p className="text-[10px] font-semibold text-warning uppercase tracking-wider">Pillar 2</p>
          <p className="font-data text-sm font-bold text-text-primary mt-0.5">
            {formatCHF(bvg.monthlyEmployee)}/mo
          </p>
          <p className="text-[10px] text-text-muted">BVG (employee)</p>
        </div>
        <div className="rounded-lg bg-purple-500/5 border border-purple-500/20 p-2.5 text-center">
          <p className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider">Pillar 3a</p>
          <p className="font-data text-sm font-bold text-text-primary mt-0.5">
            {formatCHF(pillar3aMonthly)}/mo
          </p>
          <p className="text-[10px] text-text-muted">private pension</p>
        </div>
      </div>

      {/* ═══ PILLAR 1: AHV/IV ═══ */}
      <div className="rounded-lg border border-cyan-500/20 mb-2 overflow-hidden">
        <button
          onClick={() => toggle(1)}
          className="w-full flex items-center justify-between p-3 hover:bg-cyan-500/5 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-cyan-400" />
            <div>
              <p className="text-xs font-semibold text-text-primary">
                Pillar 1: AHV/IV (State Pension)
              </p>
              <p className="text-[10px] text-text-muted">
                Mandatory social insurance — {formatCHF(ahv.totalAnnual)}/yr employee contribution
              </p>
            </div>
          </div>
          {expanded === 1 ? (
            <ChevronUp className="h-4 w-4 text-text-muted" />
          ) : (
            <ChevronDown className="h-4 w-4 text-text-muted" />
          )}
        </button>

        {expanded === 1 && (
          <div className="p-3 pt-0 space-y-3">
            {/* Contribution breakdown */}
            <div className="rounded-lg bg-bg-primary/30 border border-border-subtle p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2">
                Employee Contribution Breakdown
              </p>
              <div className="space-y-1.5">
                {[
                  { label: "AHV (old-age & survivors)", rate: "5.30%", amount: ahv.employeeAhv },
                  { label: "IV (disability)", rate: "0.70%", amount: ahv.employeeIv },
                  { label: "EO (income replacement)", rate: "0.25%", amount: ahv.employeeEo },
                  { label: `ALV (unemployment)`, rate: `1.1% + solidarity`, amount: ahv.employeeAlv },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-xs">
                    <span className="text-text-muted">{item.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-text-muted font-data">{item.rate}</span>
                      <span className="font-data font-bold text-text-primary w-20 text-right">
                        {formatCHF(item.amount)}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="border-t border-border-subtle pt-1.5 flex items-center justify-between text-xs font-bold">
                  <span className="text-text-secondary">Total employee</span>
                  <span className="font-data text-cyan-400">
                    {formatCHF(ahv.totalAnnual)}/yr ({formatCHF(ahv.totalMonthly)}/mo)
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-text-muted mt-2">
                Employer pays matching amounts. No salary cap on AHV contributions (unlike many countries).
              </p>
            </div>

            {/* Pension estimate */}
            <div className="rounded-lg bg-bg-primary/30 border border-border-subtle p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2">
                Estimated Swiss AHV Pension
              </p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <p className="text-[10px] text-text-muted">Full pension requires</p>
                  <p className="font-data text-sm font-bold text-text-primary">
                    {AHV_FULL_CONTRIBUTION_YEARS} years
                  </p>
                  <p className="text-[10px] text-text-muted">age 21 to 65</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted">Your Swiss years</p>
                  <p className="font-data text-sm font-bold text-warning">
                    ~{ahv.swissContributionYears} years
                  </p>
                  <p className="text-[10px] text-text-muted">
                    ~{ahv.missingYears} missing years
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-cyan-500/5 border border-cyan-500/20 p-2.5 mb-2">
                <p className="text-[10px] text-text-muted">Estimated Swiss AHV pension (pro-rata)</p>
                <p className="font-data text-lg font-bold text-text-primary">
                  {formatCHF(ahv.estimatedMonthlyPensionLow)} – {formatCHF(ahv.estimatedMonthlyPensionHigh)}/mo
                </p>
                <p className="text-[10px] text-text-muted">
                  vs max single pension of {formatCHF(AHV_MAX_MONTHLY_PENSION)}/mo
                </p>
              </div>
            </div>

            {/* EU bilateral agreement */}
            <div className="rounded-lg bg-success/5 border border-success/20 p-3 flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-success">EU/EFTA Bilateral Agreement</p>
                <p className="text-[10px] text-text-muted mt-0.5 leading-snug">
                  Austrian contribution years count toward <strong>eligibility</strong> (minimum qualifying period),
                  not the Swiss pension amount. You'll receive separate pensions from each country
                  proportional to years contributed in each system.
                </p>
              </div>
            </div>

            {/* Action items */}
            <div className="rounded-lg bg-accent-primary/5 border border-accent-primary/20 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-accent-primary mb-1.5">
                Action Items
              </p>
              <ul className="space-y-1">
                <li className="text-[10px] text-text-muted flex items-start gap-1.5">
                  <span className="text-accent-primary mt-0.5">1.</span>
                  Contact Austrian PVA (Pensionsversicherungsanstalt) for combined projection
                </li>
                <li className="text-[10px] text-text-muted flex items-start gap-1.5">
                  <span className="text-accent-primary mt-0.5">2.</span>
                  Request Swiss AHV statement from Ausgleichskasse after starting employment
                </li>
                <li className="text-[10px] text-text-muted flex items-start gap-1.5">
                  <span className="text-accent-primary mt-0.5">3.</span>
                  Explore voluntary AHV contributions for any gap years (unlikely to be cost-effective)
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* ═══ PILLAR 2: BVG ═══ */}
      <div className="rounded-lg border border-warning/20 mb-2 overflow-hidden">
        <button
          onClick={() => toggle(2)}
          className="w-full flex items-center justify-between p-3 hover:bg-warning/5 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-warning" />
            <div>
              <p className="text-xs font-semibold text-text-primary">
                Pillar 2: BVG (Occupational Pension)
              </p>
              <p className="text-[10px] text-text-muted">
                Employer pension fund — {formatCHF(bvg.annualContribution)}/yr combined
              </p>
            </div>
          </div>
          {expanded === 2 ? (
            <ChevronUp className="h-4 w-4 text-text-muted" />
          ) : (
            <ChevronDown className="h-4 w-4 text-text-muted" />
          )}
        </button>

        {expanded === 2 && (
          <div className="p-3 pt-0 space-y-3">
            {/* Key parameters */}
            <div className="rounded-lg bg-bg-primary/30 border border-border-subtle p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2">
                BVG Key Parameters (2026)
              </p>
              <div className="space-y-1.5">
                {[
                  {
                    label: "Coordination deduction",
                    value: formatCHF(BVG_COORDINATION_DEDUCTION),
                    note: "Subtracted from gross to get coordinated salary",
                  },
                  {
                    label: "Coordinated salary",
                    value: formatCHF(bvg.coordinatedSalary),
                    note: `Your gross ${formatCHF(grossAnnual)} − ${formatCHF(BVG_COORDINATION_DEDUCTION)}`,
                  },
                  {
                    label: "Max insured salary (mandatory)",
                    value: formatCHF(BVG_MANDATORY_SALARY_CAP),
                    note: "Employer plan likely covers above this",
                  },
                  {
                    label: "Age credit rate (45-54)",
                    value: `${(bvg.creditRate * 100).toFixed(0)}%`,
                    note: "Combined employer + employee rate",
                  },
                  {
                    label: "Annual BVG contribution",
                    value: formatCHF(bvg.annualContribution),
                    note: `Split ~50/50: ${formatCHF(bvg.employeeShare)} each`,
                  },
                ].map((item) => (
                  <Tip key={item.label} content={item.note}>
                    <div className="flex items-center justify-between text-xs cursor-help" tabIndex={0}>
                      <span className="text-text-muted">{item.label}</span>
                      <span className="font-data font-bold text-text-primary">{item.value}</span>
                    </div>
                  </Tip>
                ))}
              </div>
            </div>

            {/* Age credit rate table */}
            <div className="rounded-lg bg-bg-primary/30 border border-border-subtle p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2">
                BVG Credit Rate by Age Bracket
              </p>
              <div className="rounded-lg border border-border-subtle overflow-hidden">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="bg-bg-primary/50">
                      <th className="px-2 py-1.5 text-left text-text-muted font-semibold">Age</th>
                      <th className="px-2 py-1.5 text-right text-text-muted font-semibold">Rate</th>
                      <th className="px-2 py-1.5 text-right text-text-muted font-semibold">Annual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { age: "25–34", rate: 7, highlight: false },
                      { age: "35–44", rate: 10, highlight: false },
                      { age: "45–54", rate: 15, highlight: true },
                      { age: "55–65", rate: 18, highlight: false },
                    ].map((row) => (
                      <tr
                        key={row.age}
                        className={`border-t border-border-subtle ${row.highlight ? "bg-warning/5" : ""}`}
                      >
                        <td className={`px-2 py-1.5 font-data ${row.highlight ? "text-warning font-bold" : "text-text-secondary"}`}>
                          {row.age} {row.highlight && "← you"}
                        </td>
                        <td className="px-2 py-1.5 text-right font-data text-text-primary">{row.rate}%</td>
                        <td className="px-2 py-1.5 text-right font-data text-text-primary">
                          {formatCHF(bvg.coordinatedSalary * (row.rate / 100))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Enveloping plan + buyback */}
            <div className="rounded-lg bg-warning/5 border border-warning/20 p-3">
              <p className="text-xs font-semibold text-warning mb-1">Enveloping Plan (Ueberobligatorium)</p>
              <p className="text-[10px] text-text-muted leading-snug">
                Zurich Insurance likely runs an <strong>enveloping pension plan</strong> that covers your full
                salary up to CHF 180K+ (not just the mandatory cap of {formatCHF(BVG_MANDATORY_SALARY_CAP)}).
                This means higher contributions, higher retirement capital, and bigger buyback potential.
              </p>
            </div>

            {/* Newcomer restriction */}
            <div className="rounded-lg bg-bg-primary/30 border border-border-subtle p-3 flex items-start gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-text-primary">Newcomer Buy-in Restriction</p>
                <p className="text-[10px] text-text-muted mt-0.5 leading-snug">
                  First <strong>5 years</strong> in Switzerland: voluntary buybacks limited to <strong>20% of regulatory
                  contributions per year</strong>. Your estimated limit: ~{formatCHF(bvg.newcomerBuybackLimit)}/yr.
                  After 5 years, full buyback potential opens up — this is when the big tax optimization happens.
                </p>
              </div>
            </div>

            {/* Action items */}
            <div className="rounded-lg bg-accent-primary/5 border border-accent-primary/20 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-accent-primary mb-1.5">
                Action Items
              </p>
              <ul className="space-y-1">
                <li className="text-[10px] text-text-muted flex items-start gap-1.5">
                  <span className="text-accent-primary mt-0.5">1.</span>
                  Request Vorsorgereglement (pension regulations) from Zurich Insurance HR
                </li>
                <li className="text-[10px] text-text-muted flex items-start gap-1.5">
                  <span className="text-accent-primary mt-0.5">2.</span>
                  Request Einkaufspotenzial (buyback potential) calculation from pension fund
                </li>
                <li className="text-[10px] text-text-muted flex items-start gap-1.5">
                  <span className="text-accent-primary mt-0.5">3.</span>
                  Plan 5-year buyback strategy starting year 6 (2031+) for maximum tax savings
                </li>
                <li className="text-[10px] text-text-muted flex items-start gap-1.5">
                  <span className="text-accent-primary mt-0.5">4.</span>
                  Understand 3-year lockout: no capital withdrawal within 3 years of buyback
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* ═══ PILLAR 3a ═══ */}
      <div className="rounded-lg border border-purple-500/20 mb-2 overflow-hidden">
        <button
          onClick={() => toggle(3)}
          className="w-full flex items-center justify-between p-3 hover:bg-purple-500/5 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-purple-400" />
            <div>
              <p className="text-xs font-semibold text-text-primary">
                Pillar 3a (Private Pension)
              </p>
              <p className="text-[10px] text-text-muted">
                Voluntary tax-advantaged savings — max {formatCHF(PILLAR_3A_MAX_ANNUAL)}/yr
              </p>
            </div>
          </div>
          {expanded === 3 ? (
            <ChevronUp className="h-4 w-4 text-text-muted" />
          ) : (
            <ChevronDown className="h-4 w-4 text-text-muted" />
          )}
        </button>

        {expanded === 3 && (
          <div className="p-3 pt-0 space-y-3">
            {/* Key numbers */}
            <div className="rounded-lg bg-bg-primary/30 border border-border-subtle p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2">
                Key Numbers (2026)
              </p>
              <div className="space-y-1.5">
                {[
                  {
                    label: "Max annual contribution",
                    value: formatCHF(PILLAR_3A_MAX_ANNUAL),
                    note: "For employed persons with BVG",
                  },
                  {
                    label: "Monthly equivalent",
                    value: `${formatCHF(pillar3a.maxMonthly)}/mo`,
                    note: "Spread evenly across 12 months",
                  },
                  {
                    label: "Your current contribution",
                    value: `${formatCHF(pillar3a.annualContribution)}/yr`,
                    note: pillar3a.annualContribution >= pillar3a.maxContribution
                      ? "Maxing out!"
                      : `Gap: ${formatCHF(pillar3a.maxContribution - pillar3a.annualContribution)}/yr remaining`,
                  },
                  {
                    label: "Tax deduction (100%)",
                    value: `-${formatCHF(pillar3a.taxSaving)}/yr`,
                    note: "At ~28% marginal rate (Zurich city)",
                  },
                ].map((item) => (
                  <Tip key={item.label} content={item.note}>
                    <div className="flex items-center justify-between text-xs cursor-help" tabIndex={0}>
                      <span className="text-text-muted">{item.label}</span>
                      <span className={`font-data font-bold ${item.label.includes("Tax") ? "text-success" : "text-text-primary"}`}>
                        {item.value}
                      </span>
                    </div>
                  </Tip>
                ))}
              </div>
            </div>

            {/* Growth projection */}
            <div className="rounded-lg bg-purple-500/5 border border-purple-500/20 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-400 mb-2">
                Projection: Max Contributions for 16 Years
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] text-text-muted">Total contributed</p>
                  <p className="font-data text-sm font-bold text-text-primary">
                    {formatCHF(pillar3a.maxContribution * pillar3a.yearsToRetirement)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted">Projected value @7%</p>
                  <p className="font-data text-sm font-bold text-purple-400">
                    {formatCHF(pillar3a.projectedAt7Pct)}
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-text-muted mt-2">
                Assumes 7% avg annual return (equity-heavy strategy). Past performance not guaranteed.
              </p>
            </div>

            {/* Strategy recommendations */}
            <div className="rounded-lg bg-bg-primary/30 border border-border-subtle p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2">
                Strategy Recommendations
              </p>
              <ul className="space-y-1.5">
                {[
                  {
                    icon: <CheckCircle2 className="h-3 w-3 text-success" />,
                    text: "Equity-heavy funds (95-99%) — 16 years to retirement gives plenty of recovery time",
                  },
                  {
                    icon: <CheckCircle2 className="h-3 w-3 text-success" />,
                    text: "Open 5 separate 3a accounts for staggered retirement withdrawal (tax optimization)",
                  },
                  {
                    icon: <CheckCircle2 className="h-3 w-3 text-success" />,
                    text: "Top providers: finpension (0.39% TER, 99% equity) or VIAC (0.40% TER, 97% equity)",
                  },
                  {
                    icon: <Info className="h-3 w-3 text-accent-primary" />,
                    text: "New 2025/2026: catch-up contributions for missed years — rules for newcomers TBD by parliament",
                  },
                  {
                    icon: <AlertTriangle className="h-3 w-3 text-warning" />,
                    text: "Locked until age 60 (exceptions: home purchase, self-employment, leaving Switzerland)",
                  },
                ].map((item, i) => (
                  <li key={i} className="text-[10px] text-text-muted flex items-start gap-1.5">
                    <span className="shrink-0 mt-0.5">{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Withdrawal strategy */}
            <div className="rounded-lg bg-bg-primary/30 border border-border-subtle p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2">
                5-Account Staggered Withdrawal Strategy
              </p>
              <div className="rounded-lg border border-border-subtle overflow-hidden">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="bg-bg-primary/50">
                      <th className="px-2 py-1.5 text-left text-text-muted font-semibold">Account</th>
                      <th className="px-2 py-1.5 text-right text-text-muted font-semibold">Withdraw</th>
                      <th className="px-2 py-1.5 text-left text-text-muted font-semibold">Why</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { account: "3a #1", year: "Age 60", why: "First eligible year" },
                      { account: "3a #2", year: "Age 61", why: "Separate tax year" },
                      { account: "3a #3", year: "Age 62", why: "Separate tax year" },
                      { account: "3a #4", year: "Age 63", why: "Separate tax year" },
                      { account: "3a #5", year: "Age 64-65", why: "Last withdrawal at retirement" },
                    ].map((row) => (
                      <tr key={row.account} className="border-t border-border-subtle">
                        <td className="px-2 py-1.5 font-data text-purple-400 font-bold">{row.account}</td>
                        <td className="px-2 py-1.5 text-right font-data text-text-primary">{row.year}</td>
                        <td className="px-2 py-1.5 text-text-muted">{row.why}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-text-muted mt-1.5">
                Each withdrawal taxed separately at a reduced capital benefits rate. Spreading across years
                keeps each year's withdrawal in a lower tax bracket.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Total pension income estimate */}
      <div className="rounded-lg bg-bg-primary/30 border border-border-subtle p-3 mt-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1">
          Estimated Retirement Income (Monthly, at 65)
        </p>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-muted">Swiss AHV (pro-rata)</span>
            <span className="font-data text-text-primary">
              ~{formatCHF(ahv.estimatedMonthlyPension)}/mo
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-muted">Austrian pension (TBD)</span>
            <span className="font-data text-text-muted italic">contact PVA</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-muted">BVG annuity or lump sum</span>
            <span className="font-data text-text-muted italic">see BVG Buyback calc</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-muted">Pillar 3a capital</span>
            <span className="font-data text-purple-400">
              ~{formatCHF(pillar3a.projectedAt7Pct)} total
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
