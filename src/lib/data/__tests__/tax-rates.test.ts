import { describe, it, expect } from "vitest";
import {
  TAX_RATES,
  getTaxDataByLocationId,
  rankByTaxBurden,
  taxSavingsVsCity,
  getTaxExtremes,
  type LocationTaxData,
} from "../tax-rates";

describe("TAX_RATES data", () => {
  it("should have exactly 20 locations", () => {
    expect(TAX_RATES).toHaveLength(20);
  });

  it("should have no duplicate location IDs", () => {
    const ids = TAX_RATES.map((t) => t.locationId);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("every entry should have all required fields", () => {
    for (const entry of TAX_RATES) {
      expect(entry.locationId).toBeTruthy();
      expect(entry.municipality).toBeTruthy();
      expect(entry.steuerfuss).toBeGreaterThan(0);
      expect(entry.effectiveRate).toBeGreaterThan(0);
      expect(entry.estimatedAnnualTax).toBeGreaterThan(0);
      expect(entry.estimatedMonthlyTax).toBeGreaterThan(0);
      expect(typeof entry.note).toBe("string");
    }
  });

  it("monthly tax should be annual tax divided by 12 (rounded)", () => {
    for (const entry of TAX_RATES) {
      expect(entry.estimatedMonthlyTax).toBe(Math.round(entry.estimatedAnnualTax / 12));
    }
  });

  it("annual tax should be consistent with effective rate and reference gross", () => {
    const grossAnnual = 195000; // 15000 × 13 (reference gross for pre-computed estimates)
    for (const entry of TAX_RATES) {
      const expected = Math.round(grossAnnual * (entry.effectiveRate / 100));
      expect(entry.estimatedAnnualTax).toBe(expected);
    }
  });
});

describe("getTaxDataByLocationId", () => {
  it("should return tax data for a valid city location", () => {
    const result = getTaxDataByLocationId("city");
    expect(result).toBeDefined();
    expect(result!.municipality).toBe("Zürich (Stadt)");
    expect(result!.steuerfuss).toBe(119);
  });

  it("should return tax data for a lake town", () => {
    const result = getTaxDataByLocationId("ruschlikon");
    expect(result).toBeDefined();
    expect(result!.municipality).toBe("Rüschlikon");
    expect(result!.steuerfuss).toBe(56);
  });

  it("should return undefined for an invalid location ID", () => {
    expect(getTaxDataByLocationId("nonexistent")).toBeUndefined();
  });

  it("should return undefined for an empty string", () => {
    expect(getTaxDataByLocationId("")).toBeUndefined();
  });

  it("should return data for all 20 known location IDs", () => {
    const expectedIds = [
      "city", "enge", "wollishofen", "wiedikon", "aussersihl",
      "seefeld", "hottingen", "wipkingen", "oerlikon", "hard",
      "zollikon", "kusnacht", "erlenbach", "meilen",
      "kilchberg", "ruschlikon", "thalwil", "horgen",
      "adliswil", "mannedorf",
    ];
    for (const id of expectedIds) {
      expect(getTaxDataByLocationId(id)).toBeDefined();
    }
  });
});

describe("rankByTaxBurden", () => {
  it("should return all 20 locations", () => {
    expect(rankByTaxBurden()).toHaveLength(20);
  });

  it("should return locations sorted by annual tax ascending", () => {
    const ranked = rankByTaxBurden();
    for (let i = 1; i < ranked.length; i++) {
      expect(ranked[i].estimatedAnnualTax).toBeGreaterThanOrEqual(
        ranked[i - 1].estimatedAnnualTax
      );
    }
  });

  it("should have Ruschlikon as the cheapest", () => {
    const ranked = rankByTaxBurden();
    expect(ranked[0].locationId).toBe("ruschlikon");
  });

  it("should not mutate the original TAX_RATES array", () => {
    const originalFirst = TAX_RATES[0].locationId;
    rankByTaxBurden();
    expect(TAX_RATES[0].locationId).toBe(originalFirst);
  });
});

describe("taxSavingsVsCity", () => {
  it("should return 0 for the city itself (no savings)", () => {
    expect(taxSavingsVsCity("city")).toBe(0);
  });

  it("should return a positive number for cheaper municipalities", () => {
    const savings = taxSavingsVsCity("ruschlikon");
    expect(savings).toBeGreaterThan(0);
  });

  it("should return a positive number for all Gold Coast towns", () => {
    for (const id of ["zollikon", "kusnacht", "erlenbach", "meilen"]) {
      expect(taxSavingsVsCity(id)).toBeGreaterThan(0);
    }
  });

  it("should return 0 for an invalid location ID", () => {
    expect(taxSavingsVsCity("nonexistent")).toBe(0);
  });

  it("should equal the difference between city and location annual tax", () => {
    const cityData = getTaxDataByLocationId("city")!;
    const zollikonData = getTaxDataByLocationId("zollikon")!;
    expect(taxSavingsVsCity("zollikon")).toBe(
      cityData.estimatedAnnualTax - zollikonData.estimatedAnnualTax
    );
  });

  it("Ruschlikon should have the highest savings vs city", () => {
    const ruschlikonSavings = taxSavingsVsCity("ruschlikon");
    for (const entry of TAX_RATES) {
      expect(ruschlikonSavings).toBeGreaterThanOrEqual(taxSavingsVsCity(entry.locationId));
    }
  });
});

describe("getTaxExtremes", () => {
  it("should return an object with cheapest and mostExpensive", () => {
    const extremes = getTaxExtremes();
    expect(extremes).toHaveProperty("cheapest");
    expect(extremes).toHaveProperty("mostExpensive");
  });

  it("should return Ruschlikon as cheapest", () => {
    const { cheapest } = getTaxExtremes();
    expect(cheapest.locationId).toBe("ruschlikon");
    expect(cheapest.municipality).toBe("Rüschlikon");
  });

  it("cheapest should have lower annual tax than mostExpensive", () => {
    const { cheapest, mostExpensive } = getTaxExtremes();
    expect(cheapest.estimatedAnnualTax).toBeLessThan(mostExpensive.estimatedAnnualTax);
  });

  it("mostExpensive should be a Zurich city district (steuerfuss 119)", () => {
    const { mostExpensive } = getTaxExtremes();
    expect(mostExpensive.steuerfuss).toBe(119);
    expect(mostExpensive.effectiveRate).toBe(12.3);
  });

  it("no location should have higher tax than mostExpensive", () => {
    const { mostExpensive } = getTaxExtremes();
    for (const entry of TAX_RATES) {
      expect(entry.estimatedAnnualTax).toBeLessThanOrEqual(mostExpensive.estimatedAnnualTax);
    }
  });

  it("no location should have lower tax than cheapest", () => {
    const { cheapest } = getTaxExtremes();
    for (const entry of TAX_RATES) {
      expect(entry.estimatedAnnualTax).toBeGreaterThanOrEqual(cheapest.estimatedAnnualTax);
    }
  });
});
