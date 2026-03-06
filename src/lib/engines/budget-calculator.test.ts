import { describe, it, expect } from "vitest";
import { calculateBudget, EXPENSE_CONFIG, FIXED_OUTSIDE_ITEMS, INCOME_ITEMS } from "./budget-calculator";

describe("calculateBudget", () => {
  const defaultValues: Record<string, number> = {};
  for (const item of EXPENSE_CONFIG) {
    defaultValues[item.key] = item.value;
  }

  it("calculates correct total Zurich costs from default values", () => {
    const result = calculateBudget(defaultValues);
    const expectedZurich = EXPENSE_CONFIG.reduce((sum, item) => sum + item.value, 0);
    expect(result.zurichCosts).toBe(expectedZurich);
  });

  it("calculates surplus as income minus all expenses", () => {
    const result = calculateBudget(defaultValues);
    expect(result.surplus).toBe(result.totalIncome - result.totalExpenses);
  });

  it("calculates savings rate as percentage of income", () => {
    const result = calculateBudget(defaultValues);
    const expectedRate = (result.surplus / result.totalIncome) * 100;
    expect(result.savingsRate).toBeCloseTo(expectedRate);
  });

  it("annual surplus is 12x monthly surplus", () => {
    const result = calculateBudget(defaultValues);
    expect(result.annualSurplus).toBe(result.surplus * 12);
  });

  it("generates 12-month savings projection", () => {
    const result = calculateBudget(defaultValues);
    expect(result.annualSavingsProjection).toHaveLength(12);
    expect(result.annualSavingsProjection[0]).toBe(result.surplus);
    expect(result.annualSavingsProjection[11]).toBe(result.surplus * 12);
  });

  it("higher rent reduces surplus", () => {
    const lowRent = calculateBudget({ ...defaultValues, rent: 1500 });
    const highRent = calculateBudget({ ...defaultValues, rent: 3500 });
    expect(lowRent.surplus).toBeGreaterThan(highRent.surplus);
    expect(highRent.surplus).toBe(lowRent.surplus - 2000);
  });

  it("handles zero Zurich costs", () => {
    const result = calculateBudget({});
    expect(result.zurichCosts).toBe(0);
    expect(result.surplus).toBe(result.totalIncome - result.fixedOutside);
  });
});

describe("EXPENSE_CONFIG", () => {
  it("has expected number of expense categories", () => {
    expect(EXPENSE_CONFIG.length).toBe(10);
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
});

describe("FIXED_OUTSIDE_ITEMS", () => {
  it("total matches FIXED_COSTS_OUTSIDE constant", () => {
    const total = FIXED_OUTSIDE_ITEMS.reduce((sum, item) => sum + item.value, 0);
    expect(total).toBe(2760);
  });
});

describe("INCOME_ITEMS", () => {
  it("total matches FIXED_INCOME constant", () => {
    const total = INCOME_ITEMS.reduce((sum, item) => sum + item.value, 0);
    expect(total).toBe(12150);
  });
});
