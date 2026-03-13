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

/**
 * B0 tariff: single with child(ren), no church.
 * Rates are slightly lower than A0 due to child deductions built into the tariff.
 */
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

const QUELLENSTEUER_TARIFFS: Record<string, QuellensteuerBracket[]> = {
  A0: QUELLENSTEUER_BRACKETS_A0,
  B0: QUELLENSTEUER_BRACKETS_B0,
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

const FEDERAL_TAX_BRACKETS: FederalBracket[] = [
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

// ─── Quellensteuer Calculator ──────────────────────────────────────────────────

/**
 * Calculate Quellensteuer (withholding tax) for Zurich canton.
 *
 * Uses flat-rate brackets — the rate for the bracket your gross falls into
 * applies to your entire gross income, not just the marginal amount.
 *
 * @param grossAnnual - Annual gross salary in CHF
 * @param tariffCode - Quellensteuer tariff code: "A0" (single, no church), "B0" (single + child, no church)
 * @returns Withholding tax amounts and effective rate
 * @throws Error if tariff code is not recognized
 *
 * @example
 * ```ts
 * const result = calculateQuellensteuer(195_000, "A0");
 * // => { annualTax: 34573, monthlyTax: 2881, effectiveRate: 17.73 }
 * ```
 */
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

  // Find the applicable flat rate bracket
  const bracket = brackets.find((b) => grossAnnual <= b.upperBound);
  // Safety: last bracket has Infinity upper bound, so this always resolves
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

/**
 * Calculate federal income tax using progressive marginal brackets.
 * Each bracket's rate applies only to the income portion within that bracket.
 */
function calculateFederalTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;

  let totalTax = 0;

  for (const bracket of FEDERAL_TAX_BRACKETS) {
    if (taxableIncome <= bracket.from) break;

    const taxableInBracket = Math.min(taxableIncome, bracket.to) - bracket.from;
    totalTax += taxableInBracket * (bracket.rate / 100);
  }

  return Math.round(totalTax);
}

// ─── Ordinary Tax Calculator ───────────────────────────────────────────────────

/**
 * Calculate ordinary taxation (nachträgliche ordentliche Veranlagung) for Zurich canton.
 *
 * Computes three components:
 * 1. Federal income tax (direkte Bundessteuer) — progressive marginal brackets
 * 2. Cantonal simple tax (einfache Staatssteuer) — ~8% of taxable income
 * 3. Municipal tax (Gemeindesteuer) — cantonal simple × (Steuerfuss / 100)
 *
 * Deductions are subtracted from gross to arrive at taxable income.
 * Standard deductions (professional expenses flat rate, social insurance) are
 * applied automatically in addition to the explicit deductions passed in.
 *
 * @param grossAnnual - Annual gross salary in CHF
 * @param deductions - Itemized deductions (BVG, 3a, commute, etc.)
 * @param steuerfuss - Municipal tax multiplier (default: 119 for Zurich city)
 * @returns Tax amounts, effective rate, and component breakdown
 *
 * @example
 * ```ts
 * const result = calculateOrdinaryTax(195_000, {
 *   bvgContribution: 9_750,
 *   pillar3a: 7_258,
 *   bvgBuyback: 0,
 *   commuteDeduction: 2_400,
 *   mealDeduction: 3_200,
 *   insuranceDeduction: 5_200,
 *   otherDeductions: 700,
 * });
 * ```
 */
export function calculateOrdinaryTax(
  grossAnnual: number,
  deductions: OrdinaryDeductions,
  steuerfuss: number = ZURICH_CITY_STEUERFUSS,
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

  // Cap Pillar 3a at the legal maximum
  const cappedPillar3a = Math.min(deductions.pillar3a, MAX_PILLAR_3A);

  const totalDeductions =
    deductions.bvgContribution +
    cappedPillar3a +
    deductions.bvgBuyback +
    deductions.commuteDeduction +
    deductions.mealDeduction +
    deductions.insuranceDeduction +
    deductions.otherDeductions;

  // AHV/IV/EO/ALV employee contributions (~6.4% of gross, approximate)
  const socialInsuranceDeduction = Math.round(grossAnnual * 0.064);

  // Taxable income floors at zero
  const taxableIncome = Math.max(0, grossAnnual - totalDeductions - socialInsuranceDeduction);

  // 1. Federal tax — progressive marginal brackets
  const federalTax = calculateFederalTax(taxableIncome);

  // 2. Cantonal simple tax — ~8% of taxable income
  const cantonalSimpleTax = Math.round(taxableIncome * CANTONAL_SIMPLE_RATE);

  // 3. Municipal tax — cantonal simple × (Steuerfuss / 100)
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

/**
 * Compare Quellensteuer vs Ordinary Taxation side by side.
 *
 * NOTE: For gross income exceeding CHF 120,000/year, ordinary taxation
 * (nachträgliche ordentliche Veranlagung) is MANDATORY per § 90 StG ZH,
 * regardless of which method is cheaper. This comparison is still useful
 * to understand the effective delta and plan deductions optimally.
 *
 * @param inputs - Gross income, tariff code, deductions, and Steuerfuss
 * @returns Side-by-side comparison with delta and recommendation
 *
 * @example
 * ```ts
 * const result = compareTaxMethods({
 *   grossAnnual: 195_000,
 *   tariffCode: "A0",
 *   deductions: {
 *     bvgContribution: 9_750,
 *     pillar3a: 7_258,
 *     bvgBuyback: 0,
 *     commuteDeduction: 2_400,
 *     mealDeduction: 3_200,
 *     insuranceDeduction: 5_200,
 *     otherDeductions: 700,
 *   },
 *   steuerfuss: 119,
 * });
 *
 * console.log(result.betterMethod); // "ordinary" (with sufficient deductions)
 * console.log(result.delta);        // positive = ordinary saves this much
 * ```
 */
export function compareTaxMethods(inputs: TaxComparisonInputs): TaxComparisonResult {
  const { grossAnnual, tariffCode, deductions, steuerfuss } = inputs;

  const qs = calculateQuellensteuer(grossAnnual, tariffCode);
  const ord = calculateOrdinaryTax(grossAnnual, deductions, steuerfuss);

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
 * Create a default set of deductions for Peter's profile.
 * BVG contribution estimated at ~5% of gross, standard deductions for Zurich.
 */
export function createDefaultDeductions(grossAnnual: number): OrdinaryDeductions {
  return {
    bvgContribution: Math.round(grossAnnual * 0.05),
    pillar3a: MAX_PILLAR_3A,
    bvgBuyback: 0,
    commuteDeduction: 2_400, // ZVV annual pass, capped at CHF 3,000 per tax law
    mealDeduction: 3_200, // CHF 15/day × ~213 working days, standard deduction
    insuranceDeduction: 5_200, // KVG premiums (~CHF 430/mo)
    otherDeductions: 700, // Professional expenses remainder after flat rate
  };
}

/**
 * Get all supported Quellensteuer tariff codes with descriptions.
 */
export function getSupportedTariffCodes(): Array<{ code: string; description: string }> {
  return [
    { code: "A0", description: "Single, no church affiliation" },
    { code: "B0", description: "Single with child(ren), no church affiliation" },
  ];
}
