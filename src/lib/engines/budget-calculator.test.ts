import { describe, it, expect } from "vitest";
import {
  calculateBudget,
  EXPENSE_CONFIG,
  AHV_RATE,
  ALV_RATE,
  ALV_CAP,
  NBUVG_RATE,
  NBUVG_CAP,
  type BudgetInputs,
} from "./budget-calculator";

const defaultZurichValues: Record<string, number> = {};
for (const item of EXPENSE_CONFIG) {
  defaultZurichValues[item.key] = item.value;
}

function makeInputs(overrides?: Partial<BudgetInputs>): BudgetInputs {
  return {
    grossMonthlySalary: 15000,
    has13thSalary: true,
    annualBonusPct: 0,
    expenseAllowance: 700,
    employerInsuranceContrib: 0,
    mobilityAllowance: 0,
    relocationBonus: 0,
    bvgMonthly: 390,
    pillar3aMonthly: 0,
    taxEffectiveRate: 0,
    viennaRent: 1450,
    childSupport: 915,
    viennaUtils: 220,
    carInsurance: 175,
    zurichValues: defaultZurichValues,
    ...overrides,
  };
}

describe("calculateBudget — gross to net pipeline", () => {
  it("calculates gross annual with 13th salary", () => {
    const result = calculateBudget(makeInputs());
    expect(result.grossAnnualSalary).toBe(15000 * 13);
  });

  it("calculates gross annual without 13th salary", () => {
    const result = calculateBudget(makeInputs({ has13thSalary: false }));
    expect(result.grossAnnualSalary).toBe(15000 * 12);
  });

  it("computes AHV/IV/EO deduction at correct rate", () => {
    const result = calculateBudget(makeInputs());
    const expectedAnnualAHV = result.grossAnnualSalary * (AHV_RATE / 100);
    expect(result.ahvMonthly).toBe(Math.round(expectedAnnualAHV / 12));
  });

  it("computes ALV with cap", () => {
    const result = calculateBudget(makeInputs());
    const alvBase = Math.min(result.grossAnnualSalary, ALV_CAP);
    const expectedAnnualALV = alvBase * (ALV_RATE / 100);
    expect(result.alvMonthly).toBe(Math.round(expectedAnnualALV / 12));
  });

  it("BVG monthly passed through", () => {
    const result = calculateBudget(makeInputs({ bvgMonthly: 500 }));
    expect(result.bvgMonthly).toBe(500);
  });

  it("total social deductions = AHV + ALV + NBUVG + BVG", () => {
    const result = calculateBudget(makeInputs());
    expect(result.totalSocialMonthly).toBe(
      result.ahvMonthly + result.alvMonthly + result.nbuvgMonthly + result.bvgMonthly
    );
  });

  it("net = gross - social - tax, all monthly", () => {
    const inputs = makeInputs({ taxEffectiveRate: 12.3 });
    const result = calculateBudget(inputs);
    // Calculator uses exact annual social deductions (not rounded monthly × 12)
    const grossAnnual = result.grossAnnualSalary;
    const annualAHV = grossAnnual * (AHV_RATE / 100);
    const annualALV = Math.min(grossAnnual, ALV_CAP) * (ALV_RATE / 100);
    const annualNBUVG = Math.min(grossAnnual, NBUVG_CAP) * (NBUVG_RATE / 100);
    const annualBVG = inputs.bvgMonthly * 12;
    const totalAnnualSocial = annualAHV + annualALV + annualNBUVG + annualBVG;
    const netAnnual = grossAnnual - totalAnnualSocial - result.annualTax;
    expect(result.netMonthlySalary).toBe(Math.round(netAnnual / 12));
  });

  it("take-home = net + expense allowance + benefits + relocation", () => {
    const result = calculateBudget(makeInputs({
      employerInsuranceContrib: 100,
      mobilityAllowance: 50,
      relocationBonus: 6000,
    }));
    expect(result.totalMonthlyIncome).toBe(
      result.netMonthlySalary + result.expenseAllowance + 100 + 50 + 500
    );
  });

  it("annual bonus increases gross annual salary", () => {
    const noBonus = calculateBudget(makeInputs({ annualBonusPct: 0 }));
    const withBonus = calculateBudget(makeInputs({ annualBonusPct: 10 }));
    expect(withBonus.grossAnnualSalary).toBe(Math.round(15000 * 13 * 1.1));
    expect(withBonus.grossAnnualSalary).toBeGreaterThan(noBonus.grossAnnualSalary);
  });

  it("relocation bonus amortized over 12 months", () => {
    const result = calculateBudget(makeInputs({ relocationBonus: 12000 }));
    expect(result.relocationMonthly).toBe(1000);
  });

  it("employer benefits are tax-free (don't affect taxable income)", () => {
    const base = calculateBudget(makeInputs({ taxEffectiveRate: 12.0 }));
    const withBenefits = calculateBudget(makeInputs({
      taxEffectiveRate: 12.0,
      employerInsuranceContrib: 200,
      mobilityAllowance: 100,
    }));
    expect(withBenefits.taxableAnnualIncome).toBe(base.taxableAnnualIncome);
    expect(withBenefits.totalMonthlyIncome).toBe(base.totalMonthlyIncome + 300);
  });
});

describe("calculateBudget — tax", () => {
  it("no tax when rate is 0", () => {
    const result = calculateBudget(makeInputs({ taxEffectiveRate: 0 }));
    expect(result.monthlyTax).toBe(0);
    expect(result.annualTax).toBe(0);
  });

  it("tax computed on taxable income (gross - social - 3a)", () => {
    const result = calculateBudget(
      makeInputs({ taxEffectiveRate: 12.0, pillar3aMonthly: 588 })
    );
    // Taxable = gross - social deductions (computed from annual, not rounded monthly × 12) - 3a
    expect(result.taxableAnnualIncome).toBeGreaterThan(0);
    // Annual tax = taxable × rate, rounded
    const expectedTax = Math.round(result.taxableAnnualIncome * 0.12);
    expect(result.annualTax).toBe(expectedTax);
  });

  it("Pillar 3a reduces taxable income", () => {
    const without3a = calculateBudget(makeInputs({ taxEffectiveRate: 12.0, pillar3aMonthly: 0 }));
    const with3a = calculateBudget(makeInputs({ taxEffectiveRate: 12.0, pillar3aMonthly: 588 }));
    expect(with3a.taxableAnnualIncome).toBeLessThan(without3a.taxableAnnualIncome);
    expect(with3a.annualTax).toBeLessThan(without3a.annualTax);
  });

  it("higher tax rate reduces surplus", () => {
    const low = calculateBudget(makeInputs({ taxEffectiveRate: 8.5 }));
    const high = calculateBudget(makeInputs({ taxEffectiveRate: 12.3 }));
    expect(low.surplus).toBeGreaterThan(high.surplus);
  });
});

describe("calculateBudget — expenses & surplus", () => {
  it("Zurich costs match sum of expense values", () => {
    const result = calculateBudget(makeInputs());
    const expectedZurich = EXPENSE_CONFIG.reduce((sum, item) => sum + item.value, 0);
    expect(result.zurichCosts).toBe(expectedZurich);
  });

  it("Vienna costs = sum of 4 individual costs", () => {
    const result = calculateBudget(makeInputs());
    expect(result.fixedOutside).toBe(1450 + 915 + 220 + 175);
  });

  it("surplus = take-home - vienna - zurich - pillar3a", () => {
    const result = calculateBudget(makeInputs({ pillar3aMonthly: 200 }));
    expect(result.surplus).toBe(
      result.totalMonthlyIncome - result.fixedOutside - result.zurichCosts - 200
    );
  });

  it("annual surplus = surplus × 12", () => {
    const result = calculateBudget(makeInputs());
    expect(result.annualSurplus).toBe(result.surplus * 12);
  });

  it("12-month savings projection is cumulative", () => {
    const result = calculateBudget(makeInputs());
    expect(result.annualSavingsProjection).toHaveLength(12);
    expect(result.annualSavingsProjection[0]).toBe(result.surplus);
    expect(result.annualSavingsProjection[11]).toBe(result.surplus * 12);
  });

  it("higher rent reduces surplus", () => {
    const low = calculateBudget(makeInputs({ zurichValues: { ...defaultZurichValues, rent: 1500 } }));
    const high = calculateBudget(makeInputs({ zurichValues: { ...defaultZurichValues, rent: 3500 } }));
    expect(low.surplus).toBeGreaterThan(high.surplus);
    expect(high.surplus).toBe(low.surplus - 2000);
  });

  it("changing Vienna rent affects fixedOutside and surplus", () => {
    const base = calculateBudget(makeInputs());
    const moreRent = calculateBudget(makeInputs({ viennaRent: 2000 }));
    expect(moreRent.fixedOutside).toBe(base.fixedOutside + 550);
    expect(moreRent.surplus).toBe(base.surplus - 550);
  });

  it("handles zero Zurich costs", () => {
    const result = calculateBudget(makeInputs({ zurichValues: {} }));
    expect(result.zurichCosts).toBe(0);
    expect(result.surplus).toBe(result.totalMonthlyIncome - result.fixedOutside);
  });
});

describe("EXPENSE_CONFIG", () => {
  it("has 11 expense categories", () => {
    expect(EXPENSE_CONFIG.length).toBe(11);
  });

  it("all items have valid min <= value <= max", () => {
    for (const item of EXPENSE_CONFIG) {
      expect(item.value).toBeGreaterThanOrEqual(item.min);
      expect(item.value).toBeLessThanOrEqual(item.max);
    }
  });

  it("transport is fixed", () => {
    const transport = EXPENSE_CONFIG.find((i) => i.key === "transport");
    expect(transport?.fixed).toBe(true);
    expect(transport?.min).toBe(transport?.max);
  });

  it("serafe is fixed at CHF 28/mo", () => {
    const serafe = EXPENSE_CONFIG.find((i) => i.key === "serafe");
    expect(serafe?.fixed).toBe(true);
    expect(serafe?.value).toBe(28);
    expect(serafe?.min).toBe(serafe?.max);
  });
});

describe("calculateBudget — Vienna breakdown", () => {
  it("returns 4 Vienna line items", () => {
    const result = calculateBudget(makeInputs());
    expect(result.viennaBreakdown).toHaveLength(4);
  });

  it("Vienna breakdown sums to fixedOutside", () => {
    const result = calculateBudget(makeInputs());
    const sum = result.viennaBreakdown.reduce((s, item) => s + item.value, 0);
    expect(sum).toBe(result.fixedOutside);
  });
});
