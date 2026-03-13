import { describe, it, expect } from "vitest";
import {
  calculateBuybackPotential,
  calculateTaxSavings,
  suggestBuybackStrategy,
  getBvgCreditRate,
  BVG_COORDINATION_DEDUCTION,
} from "./bvg-buyback";

describe("getBvgCreditRate", () => {
  it("returns 0 for age < 25", () => {
    expect(getBvgCreditRate(24)).toBe(0);
  });

  it("returns 7% for ages 25-34", () => {
    expect(getBvgCreditRate(25)).toBe(0.07);
    expect(getBvgCreditRate(34)).toBe(0.07);
  });

  it("returns 10% for ages 35-44", () => {
    expect(getBvgCreditRate(35)).toBe(0.10);
    expect(getBvgCreditRate(44)).toBe(0.10);
  });

  it("returns 15% for ages 45-54", () => {
    expect(getBvgCreditRate(45)).toBe(0.15);
    expect(getBvgCreditRate(49)).toBe(0.15);
    expect(getBvgCreditRate(54)).toBe(0.15);
  });

  it("returns 18% for ages 55-65", () => {
    expect(getBvgCreditRate(55)).toBe(0.18);
    expect(getBvgCreditRate(65)).toBe(0.18);
  });
});

describe("calculateTaxSavings", () => {
  it("returns buyback * marginal rate", () => {
    expect(calculateTaxSavings(50_000, 0.28)).toBe(14_000);
  });

  it("returns 0 for zero buyback", () => {
    expect(calculateTaxSavings(0, 0.28)).toBe(0);
  });

  it("returns 0 for zero rate", () => {
    expect(calculateTaxSavings(50_000, 0)).toBe(0);
  });
});

describe("suggestBuybackStrategy", () => {
  it("spreads evenly over specified years", () => {
    const plan = suggestBuybackStrategy(100_000, 5);
    expect(plan).toHaveLength(5);
    expect(plan[0].amount).toBe(20_000);
    // Last year absorbs rounding
    const total = plan.reduce((s, p) => s + p.amount, 0);
    expect(total).toBe(100_000);
  });

  it("calculates cumulative totals", () => {
    const plan = suggestBuybackStrategy(100_000, 5);
    expect(plan[4].cumulativeBought).toBe(100_000);
  });

  it("returns empty for zero potential", () => {
    expect(suggestBuybackStrategy(0, 5)).toHaveLength(0);
  });
});

describe("calculateBuybackPotential", () => {
  it("calculates large gap for age 49 with no prior CH employment", () => {
    const coordinatedSalary = 195_000 - BVG_COORDINATION_DEDUCTION;
    const result = calculateBuybackPotential({
      age: 49,
      yearsEmployedCH: 0,
      currentBvgBalance: 0,
      coordinatedSalary,
      retirementAge: 65,
    });

    // 24 years of missed contributions = huge buyback potential
    expect(result.maxBuybackPotential).toBeGreaterThan(100_000);
    expect(result.targetCapital).toBeGreaterThan(result.maxBuybackPotential * 0.9);
    expect(result.taxSavings).toBeGreaterThan(0);
    expect(result.yearsToRetirement).toBe(16);
    expect(result.suggestedStrategy.length).toBeGreaterThan(0);
    expect(result.suggestedStrategy.length).toBeLessThanOrEqual(5);
  });

  it("gap is zero when balance equals target", () => {
    const coordinatedSalary = 60_000;
    // Calculate what the target would be
    // 25-34 (10 years × 7%) + 35-44 (10 years × 10%) + 45-54 (10 years × 15%) + 55-64 (10 years × 18%)
    const target = coordinatedSalary * (10 * 0.07 + 10 * 0.10 + 10 * 0.15 + 10 * 0.18);

    const result = calculateBuybackPotential({
      age: 50,
      yearsEmployedCH: 25,
      currentBvgBalance: Math.round(target),
      coordinatedSalary,
      retirementAge: 65,
    });

    expect(result.maxBuybackPotential).toBe(0);
  });
});
