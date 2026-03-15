/**
 * Quellensteuer vs Ordinary Taxation Comparison Engine
 *
 * Canton Zurich tax calculator for B/C permit holders.
 *
 * IMPORTANT: For gross income > CHF 120,000/year, ordinary taxation
 * (nachträgliche ordentliche Veranlagung) is MANDATORY per § 90 StG ZH.
 * The Quellensteuer calculation is retained for comparison purposes —
 * it shows what you'd pay under withholding tax if the threshold didn't apply,
 * which is useful for understanding the effective tax delta.
 *
 * Tariff codes:
 *   A0 — Single, no church
 *   B0 — Single with child(ren), no church
 *   C0 — Married (single income), no church
 *   D0 — Married dual income, no church
 *
 * Sources:
 * - Steueramt Kanton Zürich — Quellensteuertarife 2025/2026
 * - EStV / ESTV Steuerrechner (Bundessteuer)
 * - Statistik Kanton Zürich — Gemeindesteuerfüsse 2025
 *
 * Tax year: 2025/2026
 */

// ─── Interfaces ────────────────────────────────────────────────────────────────

export interface QuellensteuerResult {
  /** Total annual withholding tax in CHF */
  annualTax: number;
  /** Monthly withholding tax in CHF */
  monthlyTax: number;
  /** Effective rate as percentage (e.g. 17.73) */
  effectiveRate: number;
}

export interface OrdinaryDeductions {
  /** Annual BVG (Pillar 2) employee contribution */
  bvgContribution: number;
  /** Annual Pillar 3a contribution (max CHF 7,258 for 2025/2026) */
  pillar3a: number;
  /** Pillar 2 voluntary buy-in (Einkauf) */
  bvgBuyback: number;
  /** Public transport annual pass / commute deduction */
  commuteDeduction: number;
  /** Working meals deduction (Verpflegungsmehrkosten) */
  mealDeduction: number;
  /** Health/accident insurance premium deduction */
  insuranceDeduction: number;
  /** Misc professional expenses (Berufskosten) */
  otherDeductions: number;
}

export interface OrdinaryTaxResult {
  /** Total annual ordinary tax (federal + cantonal + municipal) */
  annualTax: number;
  /** Monthly ordinary tax */
  monthlyTax: number;
  /** Effective rate as percentage */
  effectiveRate: number;
  /** Breakdown of tax components */
  breakdown: {
    federalTax: number;
    cantonalSimpleTax: number;
    municipalTax: number;
    taxableIncome: number;
    totalDeductions: number;
  };
}

export interface TaxComparisonInputs {
  grossAnnual: number;
  tariffCode: string;
  deductions: OrdinaryDeductions;
  /** Municipal tax multiplier as percentage (e.g. 119 for Zurich city) */
  steuerfuss: number;
}

export interface TaxComparisonResult {
  quellensteuer: { annual: number; monthly: number; effectiveRate: number };
  ordinary: { annual: number; monthly: number; effectiveRate: number };
  /** Positive = ordinary is cheaper by this amount */
  delta: number;
  betterMethod: "quellensteuer" | "ordinary";
  /** Total deductions applied in ordinary calculation */
  deductionsUsed: number;
  /** Whether ordinary taxation is mandatory (income > 120K) */
  ordinaryMandatory: boolean;
}

// ─── Quellensteuer Brackets ────────────────────────────────────────────────────

/**
 * Zurich canton Quellensteuer flat rate brackets.
 * These are NOT marginal — the rate applies to the ENTIRE gross income.
 * The applicable rate is determined by which bracket the gross falls into.
 */
interface QuellensteuerBracket {
  /** Upper bound of bracket (inclusive). Infinity for the last bracket. */
  upperBound: number;
  /** Flat rate applied to total gross (percentage) */
  rate: number;
}

/** A0: Single, no church */
const QUELLENSTEUER_BRACKETS_A0: QuellensteuerBracket[] = [
  { upperBound: 30_800, rate: 2.79 },
  { upperBound: 40_300, rate: 6.32 },
  { upperBound: 54_200, rate: 8.81 },
  { upperBound: 73_500, rate: 10.95 },
  { upperBound: 98_600, rate: 13.09 },
  { upperBound: 127_900, rate: 14.82 },
  { upperBound: 166_800, rate: 16.29 },
  { upperBound: 224_400, rate: 17.73 },
  { upperBound: 301_900, rate: 19.02 },
  { upperBound: Infinity, rate: 19.73 },
];

/** B0: Single with child(ren), no church */
const QUELLENSTEUER_BRACKETS_B0: QuellensteuerBracket[] = [
  { upperBound: 30_800, rate: 1.42 },
  { upperBound: 40_300, rate: 4.18 },
  { upperBound: 54_200, rate: 6.53 },
  { upperBound: 73_500, rate: 8.71 },
  { upperBound: 98_600, rate: 10.87 },
  { upperBound: 127_900, rate: 12.60 },
  { upperBound: 166_800, rate: 14.09 },
  { upperBound: 224_400, rate: 15.55 },
  { upperBound: 301_900, rate: 16.87 },
  { upperBound: Infinity, rate: 17.58 },
];

/**
 * C0: Married (single earner), no church.
 * Significantly lower rates due to married splitting (Ehepaar-Splitting)
 * and higher deductions built into the tariff.
 */
const QUELLENSTEUER_BRACKETS_C0: QuellensteuerBracket[] = [
  { upperBound: 30_800, rate: 0.00 },
  { upperBound: 40_300, rate: 1.32 },
  { upperBound: 54_200, rate: 3.63 },
  { upperBound: 73_500, rate: 5.74 },
  { upperBound: 98_600, rate: 7.87 },
  { upperBound: 127_900, rate: 9.78 },
  { upperBound: 166_800, rate: 11.42 },
  { upperBound: 224_400, rate: 13.06 },
  { upperBound: 301_900, rate: 14.57 },
  { upperBound: Infinity, rate: 15.64 },
];

/**
 * D0: Married dual income, no church.
 * Rates are between C0 and A0. Applied to each spouse's income separately,
 * but we model the total household income here.
 */
const QUELLENSTEUER_BRACKETS_D0: QuellensteuerBracket[] = [
  { upperBound: 30_800, rate: 0.00 },
  { upperBound: 40_300, rate: 1.82 },
  { upperBound: 54_200, rate: 4.25 },
  { upperBound: 73_500, rate: 6.42 },
  { upperBound: 98_600, rate: 8.57 },
  { upperBound: 127_900, rate: 10.45 },
  { upperBound: 166_800, rate: 12.04 },
  { upperBound: 224_400, rate: 13.62 },
  { upperBound: 301_900, rate: 15.06 },
  { upperBound: Infinity, rate: 16.09 },
];

const QUELLENSTEUER_TARIFFS: Record<string, QuellensteuerBracket[]> = {
  A0: QUELLENSTEUER_BRACKETS_A0,
  B0: QUELLENSTEUER_BRACKETS_B0,
  C0: QUELLENSTEUER_BRACKETS_C0,
  D0: QUELLENSTEUER_BRACKETS_D0,
};

// ─── Federal Tax Brackets ──────────────────────────────────────────────────────

/**
 * Swiss federal income tax brackets (direkte Bundessteuer).
 * These are MARGINAL brackets — each rate applies only to income within that range.
 */
interface FederalBracket {
  /** Lower bound (exclusive, except first bracket which is inclusive at 0) */
  from: number;
  /** Upper bound (inclusive). Infinity for the last bracket. */
  to: number;
  /** Marginal rate as percentage */
  rate: number;
}

/** Federal brackets for single taxpayers */
const FEDERAL_TAX_BRACKETS_SINGLE: FederalBracket[] = [
  { from: 0, to: 14_500, rate: 0.0 },
  { from: 14_500, to: 31_600, rate: 0.77 },
  { from: 31_600, to: 41_400, rate: 0.88 },
  { from: 41_400, to: 55_200, rate: 2.64 },
  { from: 55_200, to: 72_500, rate: 2.97 },
  { from: 72_500, to: 78_100, rate: 5.94 },
  { from: 78_100, to: 103_600, rate: 6.60 },
  { from: 103_600, to: 134_600, rate: 8.80 },
  { from: 134_600, to: 176_000, rate: 11.0 },
  { from: 176_000, to: 755_200, rate: 13.2 },
  { from: 755_200, to: Infinity, rate: 11.5 },
];

/**
 * Federal brackets for married taxpayers (Ehepaar-Tarif).
 * Wider brackets and lower rates compared to single filers.
 * Source: Art. 36 DBG / ESTV Tarif für Verheiratete 2025
 */
const FEDERAL_TAX_BRACKETS_MARRIED: FederalBracket[] = [
  { from: 0, to: 28_300, rate: 0.0 },
  { from: 28_300, to: 50_900, rate: 1.0 },
  { from: 50_900, to: 58_400, rate: 2.0 },
  { from: 58_400, to: 75_300, rate: 3.0 },
  { from: 75_300, to: 90_300, rate: 4.0 },
  { from: 90_300, to: 103_400, rate: 5.0 },
  { from: 103_400, to: 114_700, rate: 6.0 },
  { from: 114_700, to: 124_200, rate: 7.0 },
  { from: 124_200, to: 131_700, rate: 8.0 },
  { from: 131_700, to: 137_300, rate: 9.0 },
  { from: 137_300, to: 141_200, rate: 10.0 },
  { from: 141_200, to: 143_100, rate: 11.0 },
  { from: 143_100, to: 145_000, rate: 12.0 },
  { from: 145_000, to: 895_800, rate: 13.0 },
  { from: 895_800, to: Infinity, rate: 11.5 },
];

// ─── Tariff metadata ──────────────────────────────────────────────────────────

interface TariffMeta {
  code: string;
  description: string;
  isMarried: boolean;
  hasChildren: boolean;
}

const TARIFF_META: TariffMeta[] = [
  { code: "A0", description: "Single, no church", isMarried: false, hasChildren: false },
  { code: "B0", description: "Single with child(ren), no church", isMarried: false, hasChildren: true },
  { code: "C0", description: "Married (single income), no church", isMarried: true, hasChildren: false },
  { code: "D0", description: "Married (dual income), no church", isMarried: true, hasChildren: false },
];

function getTariffMeta(code: string): TariffMeta {
  return TARIFF_META.find((t) => t.code === code) ?? TARIFF_META[0];
}

// ─── Constants ─────────────────────────────────────────────────────────────────

/** Income threshold above which ordinary taxation is mandatory (CHF) */
export const ORDINARY_TAX_MANDATORY_THRESHOLD = 120_000;

/** Maximum Pillar 3a contribution for employed persons with BVG (2025/2026) */
export const MAX_PILLAR_3A = 7_258;

/** Default Zurich city Steuerfuss */
export const ZURICH_CITY_STEUERFUSS = 119;

/**
 * Approximate cantonal simple tax rate for the relevant income range.
 * In practice this varies by taxable income, but for CHF 100K-200K taxable
 * income the effective cantonal simple rate is approximately 8%.
 */
const CANTONAL_SIMPLE_RATE = 0.08;

/** Married couple cantonal rate is slightly lower due to splitting */
const CANTONAL_SIMPLE_RATE_MARRIED = 0.075;

/** Zurich married couple deduction (Verheiratetenabzug) from cantonal tax */
const MARRIED_DEDUCTION_CANTONAL = 2_600;

/** Zurich child deduction per child from cantonal tax */
const CHILD_DEDUCTION_CANTONAL = 9_000;

/** Federal child deduction per child */
const CHILD_DEDUCTION_FEDERAL = 6_600;

/** Federal married deduction (Zweiverdienerabzug) for dual income */
const MARRIED_DEDUCTION_FEDERAL = 2_700;

// ─── Quellensteuer Calculator ──────────────────────────────────────────────────

export function calculateQuellensteuer(
  grossAnnual: number,
  tariffCode: string,
): QuellensteuerResult {
  const brackets = QUELLENSTEUER_TARIFFS[tariffCode.toUpperCase()];
  if (!brackets) {
    throw new Error(
      `Unknown Quellensteuer tariff code: "${tariffCode}". Supported: ${Object.keys(QUELLENSTEUER_TARIFFS).join(", ")}`,
    );
  }

  if (grossAnnual <= 0) {
    return { annualTax: 0, monthlyTax: 0, effectiveRate: 0 };
  }

  const bracket = brackets.find((b) => grossAnnual <= b.upperBound);
  const rate = bracket?.rate ?? brackets[brackets.length - 1].rate;

  const annualTax = Math.round(grossAnnual * (rate / 100));
  const monthlyTax = Math.round(annualTax / 12);

  return {
    annualTax,
    monthlyTax,
    effectiveRate: rate,
  };
}

// ─── Federal Tax Calculator ────────────────────────────────────────────────────

function calculateFederalTax(taxableIncome: number, isMarried: boolean): number {
  if (taxableIncome <= 0) return 0;

  const brackets = isMarried ? FEDERAL_TAX_BRACKETS_MARRIED : FEDERAL_TAX_BRACKETS_SINGLE;
  let totalTax = 0;

  for (const bracket of brackets) {
    if (taxableIncome <= bracket.from) break;

    const taxableInBracket = Math.min(taxableIncome, bracket.to) - bracket.from;
    totalTax += taxableInBracket * (bracket.rate / 100);
  }

  return Math.round(totalTax);
}

// ─── Ordinary Tax Calculator ───────────────────────────────────────────────────

export function calculateOrdinaryTax(
  grossAnnual: number,
  deductions: OrdinaryDeductions,
  steuerfuss: number = ZURICH_CITY_STEUERFUSS,
  tariffCode: string = "A0",
): OrdinaryTaxResult {
  if (grossAnnual <= 0) {
    return {
      annualTax: 0,
      monthlyTax: 0,
      effectiveRate: 0,
      breakdown: {
        federalTax: 0,
        cantonalSimpleTax: 0,
        municipalTax: 0,
        taxableIncome: 0,
        totalDeductions: 0,
      },
    };
  }

  const meta = getTariffMeta(tariffCode);

  // Cap Pillar 3a at the legal maximum
  const cappedPillar3a = Math.min(deductions.pillar3a, MAX_PILLAR_3A);

  let totalDeductions =
    deductions.bvgContribution +
    cappedPillar3a +
    deductions.bvgBuyback +
    deductions.commuteDeduction +
    deductions.mealDeduction +
    deductions.insuranceDeduction +
    deductions.otherDeductions;

  // Married couples get additional deductions
  if (meta.isMarried) {
    totalDeductions += MARRIED_DEDUCTION_CANTONAL;
  }

  // Child deduction (B0 = single with child, C0/D0 married may also have children via UI)
  if (meta.hasChildren) {
    totalDeductions += CHILD_DEDUCTION_CANTONAL;
  }

  // AHV/IV/EO/ALV employee contributions (~6.4% of gross)
  const socialInsuranceDeduction = Math.round(grossAnnual * 0.064);

  const taxableIncome = Math.max(0, grossAnnual - totalDeductions - socialInsuranceDeduction);

  // 1. Federal tax — use married brackets if applicable
  let federalTax = calculateFederalTax(taxableIncome, meta.isMarried);

  // Federal married deduction (dual income)
  if (tariffCode === "D0") {
    federalTax = Math.max(0, federalTax - Math.round(MARRIED_DEDUCTION_FEDERAL * 0.13));
  }

  // Federal child deduction reduces taxable base (already reflected in lower brackets for B0)
  if (meta.hasChildren) {
    federalTax = Math.max(0, federalTax - Math.round(CHILD_DEDUCTION_FEDERAL * 0.10));
  }

  // 2. Cantonal simple tax
  const cantonalRate = meta.isMarried ? CANTONAL_SIMPLE_RATE_MARRIED : CANTONAL_SIMPLE_RATE;
  const cantonalSimpleTax = Math.round(taxableIncome * cantonalRate);

  // 3. Municipal tax
  const municipalTax = Math.round(cantonalSimpleTax * (steuerfuss / 100));

  const annualTax = federalTax + cantonalSimpleTax + municipalTax;
  const monthlyTax = Math.round(annualTax / 12);
  const effectiveRate =
    grossAnnual > 0 ? Math.round((annualTax / grossAnnual) * 10000) / 100 : 0;

  return {
    annualTax,
    monthlyTax,
    effectiveRate,
    breakdown: {
      federalTax,
      cantonalSimpleTax,
      municipalTax,
      taxableIncome,
      totalDeductions,
    },
  };
}

// ─── Tax Comparison ────────────────────────────────────────────────────────────

export function compareTaxMethods(inputs: TaxComparisonInputs): TaxComparisonResult {
  const { grossAnnual, tariffCode, deductions, steuerfuss } = inputs;

  const qs = calculateQuellensteuer(grossAnnual, tariffCode);
  const ord = calculateOrdinaryTax(grossAnnual, deductions, steuerfuss, tariffCode);

  const delta = qs.annualTax - ord.annualTax;
  const betterMethod = delta >= 0 ? "ordinary" : "quellensteuer";

  return {
    quellensteuer: {
      annual: qs.annualTax,
      monthly: qs.monthlyTax,
      effectiveRate: qs.effectiveRate,
    },
    ordinary: {
      annual: ord.annualTax,
      monthly: ord.monthlyTax,
      effectiveRate: ord.effectiveRate,
    },
    delta,
    betterMethod,
    deductionsUsed: ord.breakdown.totalDeductions,
    ordinaryMandatory: grossAnnual > ORDINARY_TAX_MANDATORY_THRESHOLD,
  };
}

// ─── Utilities ─────────────────────────────────────────────────────────────────

/**
 * Create a default set of deductions based on tariff code.
 * Married tariffs get higher insurance deductions (two people).
 */
export function createDefaultDeductions(grossAnnual: number, tariffCode: string = "A0"): OrdinaryDeductions {
  const meta = getTariffMeta(tariffCode);
  return {
    bvgContribution: Math.round(grossAnnual * 0.05),
    pillar3a: MAX_PILLAR_3A,
    bvgBuyback: 0,
    commuteDeduction: 2_400,
    mealDeduction: 3_200,
    insuranceDeduction: meta.isMarried ? 7_800 : 5_200, // Two adults' KVG premiums
    otherDeductions: 700,
  };
}

/**
 * Get all supported Quellensteuer tariff codes with descriptions.
 */
export function getSupportedTariffCodes(): Array<{ code: string; description: string }> {
  return TARIFF_META.map((t) => ({ code: t.code, description: t.description }));
}
