import { describe, it, expect, vi, afterEach } from "vitest";
import { cn, formatCHF, formatNumber, daysUntil } from "./utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "extra")).toBe("base extra");
  });

  it("handles empty inputs", () => {
    expect(cn()).toBe("");
  });

  it("merges tailwind conflicts correctly", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
  });
});

describe("formatCHF", () => {
  it("formats integer amount", () => {
    const result = formatCHF(2400);
    expect(result).toContain("2");
    expect(result).toContain("400");
    expect(result).toContain("CHF");
  });

  it("rounds to whole number (no decimals)", () => {
    const result = formatCHF(2400.75);
    expect(result).not.toContain(".75");
  });

  it("formats zero", () => {
    const result = formatCHF(0);
    expect(result).toContain("0");
    expect(result).toContain("CHF");
  });

  it("formats negative amounts", () => {
    const result = formatCHF(-500);
    expect(result).toContain("500");
  });

  it("uses Swiss formatting with apostrophe separator", () => {
    const result = formatCHF(12150);
    // de-CH uses apostrophe or narrow no-break space as thousands separator
    expect(result).toMatch(/12.?150/);
  });
});

describe("formatNumber", () => {
  it("formats with Swiss locale separator", () => {
    const result = formatNumber(12150);
    expect(result).toMatch(/12.?150/);
  });

  it("formats small numbers without separator", () => {
    const result = formatNumber(500);
    expect(result).toBe("500");
  });
});

describe("daysUntil", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns positive days for future date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-01"));
    const result = daysUntil(new Date("2026-03-11"));
    expect(result).toBe(10);
  });

  it("returns negative days for past date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-11"));
    const result = daysUntil(new Date("2026-03-01"));
    expect(result).toBeLessThan(0);
  });

  it("returns 1 for tomorrow", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-01T00:00:00"));
    const result = daysUntil(new Date("2026-03-02T00:00:00"));
    expect(result).toBe(1);
  });
});
