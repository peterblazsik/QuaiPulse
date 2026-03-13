// ─── BVG Pillar 2 Buyback Calculator ─────────────────────────────────────────
// Swiss occupational pension (BVG) allows voluntary buybacks to fill contribution
// gaps. This is one of Switzerland's most powerful tax optimization tools:
// buyback amounts are 100% deductible from taxable income in the year of purchase.
// Spreading buybacks across multiple tax years maximizes the marginal rate benefit.

// ─── Constants ───────────────────────────────────────────────────────────────

/** BVG coordination deduction for 2026 (linked to AHV max pension) */
export const BVG_COORDINATION_DEDUCTION = 25_725;

/** BVG maximum insured salary for mandatory coverage (2026) */
export const BVG_MANDATORY_SALARY_CAP = 88_200;

/** BVG mandatory maximum coordinated salary (cap - deduction) */
export const BVG_MANDATORY_COORDINATED_CAP = 62_475;

/** Default marginal tax rate for Zurich (city + canton + federal combined) */
export const DEFAULT_MARGINAL_TAX_RATE = 0.28;

/** Minimum BVG entry age (contributions start at 25 for savings component) */
export const BVG_SAVINGS_START_AGE = 25;

/** Current calendar year */
const CURRENT_YEAR = 2026;

// ─── Age-based credit rate brackets ─────────────────────────────────────────
// These are the minimum statutory BVG savings credit rates as a percentage
// of the coordinated salary. Many employer plans (super-mandatory/ueberobligatorium)
// use higher rates, but we use statutory as the conservative baseline.

interface CreditBracket {
  minAge: number;
  maxAge: number;
  rate: number;
}

const BVG_CREDIT_BRACKETS: CreditBracket[] = [
  { minAge: 25, maxAge: 34, rate: 0.07 },
  { minAge: 35, maxAge: 44, rate: 0.10 },
  { minAge: 45, maxAge: 54, rate: 0.15 },
  { minAge: 55, maxAge: 65, rate: 0.18 },
];

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface BvgBuybackInputs {
  /** Current age of the insured person */
  age: number;
  /** Number of years already contributing to Swiss BVG system */
  yearsEmployedCH: number;
  /** Current accumulated BVG capital (CHF) */
  currentBvgBalance: number;
  /** Insured coordinated salary (gross - coordination deduction of CHF 25,725) */
  coordinatedSalary: number;
  /** Target retirement age (65 for men, 64 for women in Switzerland) */
  retirementAge: number;
}

export interface BvgBuybackResult {
  /** What the full BVG capital should be if insured since age 25 */
  targetCapital: number;
  /** Gap between target capital and current balance */
  currentGap: number;
  /** Maximum amount eligible for voluntary buyback (= gap, 100% deductible) */
  maxBuybackPotential: number;
  /** Estimated tax savings if the full buyback is executed */
  taxSavings: number;
  /** Current annual BVG savings contribution based on age bracket */
  annualContribution: number;
  /** Years remaining until retirement */
  yearsToRetirement: number;
  /** Recommended year-by-year buyback plan for optimal tax efficiency */
  suggestedStrategy: BuybackYearPlan[];
}

export interface BuybackYearPlan {
  /** Calendar year for this buyback tranche */
  year: number;
  /** Amount to buy back in this year (CHF) */
  amount: number;
  /** Running total of all buybacks up to and including this year */
  cumulativeBought: number;
  /** Tax savings from this year's buyback at estimated marginal rate */
  taxSaved: number;
}

// ─── Core Functions ──────────────────────────────────────────────────────────

/**
 * Returns the BVG savings credit rate for a given age.
 *
 * The rate determines what percentage of the coordinated salary is contributed
 * annually to the BVG savings component. Rates increase with age to compensate
 * for shorter compounding periods.
 *
 * @param age - Age of the insured person (integer)
 * @returns Credit rate as a decimal (e.g., 0.15 for 15%)
 * @throws If age is below minimum BVG savings age (25)
 */
export function getBvgCreditRate(age: number): number {
  if (age < BVG_SAVINGS_START_AGE) {
    return 0;
  }

  const bracket = BVG_CREDIT_BRACKETS.find(
    (b) => age >= b.minAge && age <= b.maxAge
  );

  // Ages beyond 65 get the highest bracket rate (edge case for late retirement)
  if (!bracket) {
    return BVG_CREDIT_BRACKETS[BVG_CREDIT_BRACKETS.length - 1]!.rate;
  }

  return bracket.rate;
}

/**
 * Calculates tax savings from a BVG buyback.
 *
 * BVG buybacks are 100% deductible from taxable income. The actual tax savings
 * depend on the marginal tax rate, which in Zurich (city + canton + federal)
 * lands around 28-33% for high earners.
 *
 * @param buybackAmount - Amount being bought back (CHF)
 * @param marginalTaxRate - Combined marginal tax rate as decimal (default 0.28)
 * @returns Estimated tax savings in CHF
 */
export function calculateTaxSavings(
  buybackAmount: number,
  marginalTaxRate: number = DEFAULT_MARGINAL_TAX_RATE
): number {
  if (buybackAmount <= 0 || marginalTaxRate <= 0) {
    return 0;
  }

  return Math.round(buybackAmount * marginalTaxRate);
}

/**
 * Creates an optimal year-by-year buyback strategy.
 *
 * Splitting buybacks across multiple tax years is the standard optimization:
 * each year's buyback gets deducted at the top marginal rate. A single lump-sum
 * buyback would push the deduction into lower brackets, wasting potential savings.
 * Swiss tax advisors typically recommend 3-5 year spreads.
 *
 * Important: the 3-year lockout rule means you cannot withdraw BVG capital
 * (e.g., as a lump sum at retirement) within 3 years of a buyback. Plan accordingly.
 *
 * @param potential - Total buyback amount to spread (CHF)
 * @param yearsToSpread - Number of years to distribute the buyback over
 * @param marginalTaxRate - Combined marginal tax rate as decimal
 * @returns Array of year-by-year buyback plans
 */
export function suggestBuybackStrategy(
  potential: number,
  yearsToSpread: number = 5,
  marginalTaxRate: number = DEFAULT_MARGINAL_TAX_RATE
): BuybackYearPlan[] {
  if (potential <= 0 || yearsToSpread <= 0) {
    return [];
  }

  const effectiveYears = Math.min(yearsToSpread, Math.ceil(potential / 1000));
  const annualAmount = Math.round(potential / effectiveYears);
  const plan: BuybackYearPlan[] = [];

  let cumulative = 0;

  for (let i = 0; i < effectiveYears; i++) {
    // Last year absorbs rounding remainder
    const isLastYear = i === effectiveYears - 1;
    const amount = isLastYear ? potential - cumulative : annualAmount;

    cumulative += amount;

    plan.push({
      year: CURRENT_YEAR + i,
      amount,
      cumulativeBought: cumulative,
      taxSaved: calculateTaxSavings(amount, marginalTaxRate),
    });
  }

  return plan;
}

/**
 * Calculates the full BVG buyback potential and recommended strategy.
 *
 * The target capital represents what the insured person WOULD have accumulated
 * if they had been in the Swiss BVG system since age 25, contributing at the
 * statutory age-credit rates on their current coordinated salary. The gap between
 * this target and the actual balance is the buyback potential.
 *
 * This is a simplified model that does NOT account for:
 * - Interest accumulation on prior contributions (BVG minimum rate ~1.25%)
 * - Salary progression over career (uses current salary as baseline)
 * - Super-mandatory employer plan specifics (varies by company)
 * - Withdrawal events (divorce, home purchase, emigration)
 *
 * For Peter's situation (age 49, zero prior Swiss BVG, starting fresh):
 * the gap is massive — 24 years of missed contributions — making this one of the
 * most impactful tax planning levers available.
 *
 * @param inputs - BVG buyback calculation inputs
 * @returns Full buyback analysis with strategy recommendation
 */
export function calculateBuybackPotential(
  inputs: BvgBuybackInputs
): BvgBuybackResult {
  const {
    age,
    yearsEmployedCH,
    currentBvgBalance,
    coordinatedSalary,
    retirementAge,
  } = inputs;

  const yearsToRetirement = Math.max(0, retirementAge - age);

  // Calculate target capital: sum of annual credits from age 25 to retirement age
  // This represents the "full career" BVG savings assuming current coordinated salary
  let targetCapital = 0;
  for (let y = BVG_SAVINGS_START_AGE; y < retirementAge; y++) {
    const rate = getBvgCreditRate(y);
    targetCapital += coordinatedSalary * rate;
  }

  targetCapital = Math.round(targetCapital);

  // The gap is the difference between what a full-career Swiss worker would have
  // and what this person actually has
  const currentGap = Math.max(0, targetCapital - currentBvgBalance);

  // Max buyback = the gap (Swiss law allows 100% of the gap to be bought in)
  const maxBuybackPotential = currentGap;

  // Tax savings if the full amount is bought back
  const taxSavings = calculateTaxSavings(maxBuybackPotential);

  // Current annual contribution based on age bracket
  const currentRate = getBvgCreditRate(age);
  const annualContribution = Math.round(coordinatedSalary * currentRate);

  // Strategy: spread over 5 years for maximum marginal rate exploitation
  // But cap at years-to-retirement minus 3 (due to 3-year lockout rule on withdrawals)
  const maxStrategyYears = Math.max(1, yearsToRetirement - 3);
  const strategyYears = Math.min(5, maxStrategyYears);
  const suggestedStrategy = suggestBuybackStrategy(
    maxBuybackPotential,
    strategyYears
  );

  return {
    targetCapital,
    currentGap,
    maxBuybackPotential,
    taxSavings,
    annualContribution,
    yearsToRetirement,
    suggestedStrategy,
  };
}
