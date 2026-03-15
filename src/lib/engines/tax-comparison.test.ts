import { describe, it, expect } from "vitest";
import {
  calculateQuellensteuer,
  calculateOrdinaryTax,
  compareTaxMethods,
  createDefaultDeductions,
  getSupportedTariffCodes,
  ORDINARY_TAX_MANDATORY_THRESHOLD,
  ZURICH_CITY_STEUERFUSS,
} from "./tax-comparison";

describe("calculateQuellensteuer", () => {
  it("returns zero for zero income", () => {
    const result = calculateQuellensteuer(0, "A0");
    expect(result.annualTax).toBe(0);
    expect(result.effectiveRate).toBe(0);
  });

  it("applies correct flat rate for CHF 195K (A0 tariff)", () => {
    const result = calculateQuellensteuer(195_000, "A0");
    expect(result.effectiveRate).toBe(17.73);
    expect(result.annualTax).toBe(Math.round(195_000 * 0.1773));
    expect(result.monthlyTax).toBe(Math.round(result.annualTax / 12));
  });

  it("uses B0 tariff with lower rates for single + child", () => {
    const a0 = calculateQuellensteuer(195_000, "A0");
    const b0 = calculateQuellensteuer(195_000, "B0");
    expect(b0.annualTax).toBeLessThan(a0.annualTax);
  });

  it("uses C0 tariff with lower rates for married", () => {
    const a0 = calculateQuellensteuer(195_000, "A0");
    const c0 = calculateQuellensteuer(195_000, "C0");
    expect(c0.annualTax).toBeLessThan(a0.annualTax);
  });

  it("D0 married dual income is between C0 and A0", () => {
    const a0 = calculateQuellensteuer(195_000, "A0");
    const c0 = calculateQuellensteuer(195_000, "C0");
    const d0 = calculateQuellensteuer(195_000, "D0");
    expect(d0.annualTax).toBeLessThan(a0.annualTax);
    expect(d0.annualTax).toBeGreaterThan(c0.annualTax);
  });

  it("throws for unknown tariff code", () => {
    expect(() => calculateQuellensteuer(100_000, "Z9")).toThrow();
  });

  it("handles case-insensitive tariff codes", () => {
    const upper = calculateQuellensteuer(195_000, "A0");
    const lower = calculateQuellensteuer(195_000, "a0");
    expect(upper.annualTax).toBe(lower.annualTax);
  });
});

describe("calculateOrdinaryTax", () => {
  it("returns zero for zero income", () => {
    const result = calculateOrdinaryTax(0, createDefaultDeductions(0));
    expect(result.annualTax).toBe(0);
  });

  it("calculates tax with standard deductions for CHF 195K", () => {
    const deductions = createDefaultDeductions(195_000);
    const result = calculateOrdinaryTax(195_000, deductions, ZURICH_CITY_STEUERFUSS);
    expect(result.annualTax).toBeGreaterThan(15_000);
    expect(result.annualTax).toBeLessThan(40_000);
    expect(result.effectiveRate).toBeGreaterThan(8);
    expect(result.effectiveRate).toBeLessThan(25);
  });

  it("married ordinary tax is lower than single", () => {
    const singleDed = createDefaultDeductions(195_000, "A0");
    const marriedDed = createDefaultDeductions(195_000, "C0");
    const single = calculateOrdinaryTax(195_000, singleDed, 119, "A0");
    const married = calculateOrdinaryTax(195_000, marriedDed, 119, "C0");
    expect(married.annualTax).toBeLessThan(single.annualTax);
  });

  it("BVG buyback reduces ordinary tax", () => {
    const baseDeductions = createDefaultDeductions(195_000);
    const baseTax = calculateOrdinaryTax(195_000, baseDeductions);

    const withBuyback = {
      ...baseDeductions,
      bvgBuyback: 50_000,
    };
    const buybackTax = calculateOrdinaryTax(195_000, withBuyback);

    expect(buybackTax.annualTax).toBeLessThan(baseTax.annualTax);
  });

  it("lower Steuerfuss reduces tax", () => {
    const deductions = createDefaultDeductions(195_000);
    const cityTax = calculateOrdinaryTax(195_000, deductions, 119);
    const ruschlikon = calculateOrdinaryTax(195_000, deductions, 56);
    expect(ruschlikon.annualTax).toBeLessThan(cityTax.annualTax);
  });
});

describe("compareTaxMethods", () => {
  it("ordinary becomes better with BVG buyback deduction", () => {
    const deductions = {
      ...createDefaultDeductions(195_000),
      bvgBuyback: 50_000,
    };
    const result = compareTaxMethods({
      grossAnnual: 195_000,
      tariffCode: "A0",
      deductions,
      steuerfuss: 119,
    });

    expect(result.betterMethod).toBe("ordinary");
    expect(result.delta).toBeGreaterThan(0);
    expect(result.ordinaryMandatory).toBe(true);
  });

  it("returns comparison for CHF 195K with default deductions", () => {
    const result = compareTaxMethods({
      grossAnnual: 195_000,
      tariffCode: "A0",
      deductions: createDefaultDeductions(195_000),
      steuerfuss: 119,
    });

    expect(result.quellensteuer.annual).toBeGreaterThan(20_000);
    expect(result.ordinary.annual).toBeGreaterThan(20_000);
    expect(result.ordinaryMandatory).toBe(true);
  });

  it("married C0 comparison shows lower tax than A0", () => {
    const a0Result = compareTaxMethods({
      grossAnnual: 195_000,
      tariffCode: "A0",
      deductions: createDefaultDeductions(195_000, "A0"),
      steuerfuss: 119,
    });
    const c0Result = compareTaxMethods({
      grossAnnual: 195_000,
      tariffCode: "C0",
      deductions: createDefaultDeductions(195_000, "C0"),
      steuerfuss: 119,
    });

    expect(c0Result.quellensteuer.annual).toBeLessThan(a0Result.quellensteuer.annual);
    expect(c0Result.ordinary.annual).toBeLessThan(a0Result.ordinary.annual);
  });

  it("flags mandatory ordinary for income > 120K", () => {
    const result = compareTaxMethods({
      grossAnnual: 130_000,
      tariffCode: "A0",
      deductions: createDefaultDeductions(130_000),
      steuerfuss: 119,
    });
    expect(result.ordinaryMandatory).toBe(true);
  });

  it("does not flag mandatory ordinary for income <= 120K", () => {
    const result = compareTaxMethods({
      grossAnnual: 100_000,
      tariffCode: "A0",
      deductions: createDefaultDeductions(100_000),
      steuerfuss: 119,
    });
    expect(result.ordinaryMandatory).toBe(false);
  });
});

describe("getSupportedTariffCodes", () => {
  it("returns all four tariff codes", () => {
    const codes = getSupportedTariffCodes();
    expect(codes.map((c) => c.code)).toEqual(["A0", "B0", "C0", "D0"]);
  });
});
