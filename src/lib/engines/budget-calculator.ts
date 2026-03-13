import { type BudgetValues } from "@/lib/stores/budget-store";

// ─── Swiss Payroll Deduction Rates (2026) ────────────────────────────────────
/** AHV/IV/EO employee contribution rate */
export const AHV_RATE = 5.3;
/** ALV (unemployment insurance) employee rate */
export const ALV_RATE = 1.1;
/** ALV annual salary cap — contributions only on first CHF 148,200 */
export const ALV_CAP = 148200;
/** NBUVG (non-occupational accident insurance) employee rate */
export const NBUVG_RATE = 1.5;
/** NBUVG insured salary cap (same as UVG) */
export const NBUVG_CAP = 148200;
/** Serafe (Swiss radio/TV fee) — CHF 335/year, mandatory per household */
export const SERAFE_ANNUAL = 335;
/** Pillar 3a maximum annual contribution (with BVG, 2026) */
export const PILLAR_3A_MAX_ANNUAL = 7258;
/** Pillar 3a maximum monthly */
export const PILLAR_3A_MAX_MONTHLY = 605;

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface BudgetBreakdown {
  // Gross income
  grossMonthlySalary: number;
  grossAnnualSalary: number;

  // Social deductions (monthly)
  ahvMonthly: number;
  alvMonthly: number;
  nbuvgMonthly: number;
  bvgMonthly: number;
  totalSocialMonthly: number;

  // Tax
  taxableAnnualIncome: number;
  effectiveTaxRate: number;
  monthlyTax: number;
  annualTax: number;

  // Net income
  netMonthlySalary: number;
  expenseAllowance: number;
  employerInsuranceContrib: number;
  mobilityAllowance: number;
  relocationMonthly: number;
  totalMonthlyIncome: number;

  // Fixed costs outside Switzerland
  fixedOutside: number;
  viennaBreakdown: { label: string; value: number }[];

  // Zurich expenses
  zurichCosts: number;
  serafeMonthly: number;
  pillar3aMonthly: number;

  // Totals
  totalExpenses: number;
  surplus: number;
  savingsRate: number;
  annualSurplus: number;
  annualSavingsProjection: number[];
}

export interface BudgetInputs {
  grossMonthlySalary: number;
  has13thSalary: boolean;
  annualBonusPct: number;
  expenseAllowance: number;
  employerInsuranceContrib: number;
  mobilityAllowance: number;
  relocationBonus: number;
  bvgMonthly: number;
  pillar3aMonthly: number;
  /** Effective all-in tax rate (%), 0 = no tax modeled */
  taxEffectiveRate: number;
  // Vienna costs
  viennaRent: number;
  childSupport: number;
  viennaUtils: number;
  carInsurance: number;
  // Zurich living costs
  zurichValues: BudgetValues | Record<string, number>;
}

export interface ExpenseItem {
  key: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  color: string;
  fixed?: boolean;
  note?: string;
}

export const EXPENSE_CONFIG: ExpenseItem[] = [
  { key: "rent", label: "Rent", value: 2400, min: 1500, max: 3500, step: 50, color: "#ef4444" },
  { key: "healthInsurance", label: "Health Insurance", value: 350, min: 280, max: 500, step: 10, color: "#f97316" },
  { key: "foodDining", label: "Food & Dining", value: 1075, min: 600, max: 1500, step: 25, color: "#f59e0b" },
  { key: "transport", label: "ZVV Transport", value: 85, min: 85, max: 85, step: 1, color: "#84cc16", fixed: true, note: "BonusPass monthly" },
  { key: "gym", label: "Gym", value: 100, min: 35, max: 200, step: 5, color: "#22c55e" },
  { key: "electricity", label: "Electricity / Utils", value: 120, min: 80, max: 200, step: 10, color: "#06b6d4" },
  { key: "internet", label: "Internet + Mobile", value: 110, min: 80, max: 180, step: 10, color: "#3b82f6" },
  { key: "flights", label: "ZRH-VIE Flights", value: 450, min: 200, max: 700, step: 25, color: "#8b5cf6" },
  { key: "subscriptions", label: "Subscriptions", value: 200, min: 100, max: 400, step: 10, color: "#ec4899" },
  { key: "serafe", label: "Serafe (Radio/TV)", value: 28, min: 28, max: 28, step: 1, color: "#94a3b8", fixed: true, note: "CHF 335/yr mandatory" },
  { key: "misc", label: "Misc / Unexpected", value: 200, min: 100, max: 500, step: 25, color: "#64748b" },
];

export interface WhatIfScenario {
  id: string;
  label: string;
  description: string;
  changes: Record<string, number>;
}

export const WHAT_IF_SCENARIOS: WhatIfScenario[] = [
  {
    id: "katie-3x",
    label: "Katie visits 3x/month",
    description: "Flight costs increase to CHF 650/mo",
    changes: { flights: 650 },
  },
  {
    id: "2br-apartment",
    label: "2BR for Katie visits",
    description: "Rent up to CHF 2,800 but Katie has her own room",
    changes: { rent: 2800 },
  },
  {
    id: "eat-out-less",
    label: "Cook more, eat out less",
    description: "Food drops to CHF 800/mo",
    changes: { foodDining: 800 },
  },
  {
    id: "premium-gym",
    label: "Holmes Place Premium",
    description: "Gym up to CHF 180/mo — pool, spa, premium equipment",
    changes: { gym: 180 },
  },
  {
    id: "frugal-mode",
    label: "Frugal mode",
    description: "Minimize everything for maximum savings",
    changes: { rent: 1800, foodDining: 700, gym: 35, subscriptions: 100, misc: 100 },
  },
];

// ─── Calculator ──────────────────────────────────────────────────────────────

export function calculateBudget(inputs: BudgetInputs): BudgetBreakdown {
  const {
    grossMonthlySalary,
    has13thSalary,
    annualBonusPct,
    expenseAllowance,
    employerInsuranceContrib,
    mobilityAllowance,
    relocationBonus,
    bvgMonthly,
    pillar3aMonthly,
    taxEffectiveRate,
    viennaRent,
    childSupport,
    viennaUtils,
    carInsurance,
    zurichValues,
  } = inputs;

  // ── Gross (base + bonus) ──
  const baseSalary = grossMonthlySalary * (has13thSalary ? 13 : 12);
  const grossAnnualSalary = Math.round(baseSalary * (1 + annualBonusPct / 100));

  // ── Social deductions (annual → monthly) ──
  const annualAHV = grossAnnualSalary * (AHV_RATE / 100);
  const alvBase = Math.min(grossAnnualSalary, ALV_CAP);
  const annualALV = alvBase * (ALV_RATE / 100);
  const nbuvgBase = Math.min(grossAnnualSalary, NBUVG_CAP);
  const annualNBUVG = nbuvgBase * (NBUVG_RATE / 100);
  const annualBVG = bvgMonthly * 12;
  const totalAnnualSocial = annualAHV + annualALV + annualNBUVG + annualBVG;

  const ahvMonthly = Math.round(annualAHV / 12);
  const alvMonthly = Math.round(annualALV / 12);
  const nbuvgMonthly = Math.round(annualNBUVG / 12);
  const totalSocialMonthly = ahvMonthly + alvMonthly + nbuvgMonthly + bvgMonthly;

  // ── Tax ──
  const annualPillar3a = pillar3aMonthly * 12;
  const taxableAnnualIncome = Math.max(0, grossAnnualSalary - totalAnnualSocial - annualPillar3a);
  const annualTax = taxEffectiveRate > 0
    ? Math.round(taxableAnnualIncome * (taxEffectiveRate / 100))
    : 0;
  const monthlyTax = Math.round(annualTax / 12);

  // ── Net monthly income ──
  const netAnnual = grossAnnualSalary - totalAnnualSocial - annualTax;
  const netMonthlySalary = Math.round(netAnnual / 12);
  const relocationMonthly = Math.round(relocationBonus / 12);
  const totalMonthlyIncome = netMonthlySalary + expenseAllowance + employerInsuranceContrib + mobilityAllowance + relocationMonthly;

  // ── Fixed outside costs (Vienna) ──
  const viennaBreakdown = [
    { label: "Vienna rent share", value: viennaRent },
    { label: "Child support", value: childSupport },
    { label: "Vienna utilities", value: viennaUtils },
    { label: "Car insurance + OAMTC", value: carInsurance },
  ];
  const fixedOutside = viennaRent + childSupport + viennaUtils + carInsurance;

  // ── Zurich costs ──
  const zurichCosts = Object.values(zurichValues).reduce((a, b) => a + b, 0);
  const serafeMonthly = Math.round(SERAFE_ANNUAL / 12);

  // ── Surplus ──
  // Note: serafe is included in zurichValues via the store, so not added separately
  const totalExpenses = fixedOutside + zurichCosts + pillar3aMonthly;
  const surplus = totalMonthlyIncome - totalExpenses;
  const savingsRate = totalMonthlyIncome > 0 ? (surplus / totalMonthlyIncome) * 100 : 0;

  const annualSavingsProjection = Array.from({ length: 12 }, (_, i) =>
    surplus * (i + 1)
  );

  return {
    grossMonthlySalary,
    grossAnnualSalary,
    ahvMonthly,
    alvMonthly,
    nbuvgMonthly,
    bvgMonthly,
    totalSocialMonthly,
    taxableAnnualIncome,
    effectiveTaxRate: taxEffectiveRate,
    monthlyTax,
    annualTax,
    netMonthlySalary,
    expenseAllowance,
    employerInsuranceContrib,
    mobilityAllowance,
    relocationMonthly,
    totalMonthlyIncome,
    fixedOutside,
    viennaBreakdown,
    zurichCosts,
    serafeMonthly,
    pillar3aMonthly,
    totalExpenses,
    surplus,
    savingsRate,
    annualSurplus: surplus * 12,
    annualSavingsProjection,
  };
}
