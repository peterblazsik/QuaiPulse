import { describe, it, expect, vi, beforeEach } from "vitest";
import { exportBudgetCSV, exportRankingsCSV, exportKatieICS } from "./exports";
import type { BudgetBreakdown, ExpenseItem } from "@/lib/engines/budget-calculator";
import type { ScoredNeighborhood } from "@/lib/engines/scoring";
import type { KatieVisitData } from "@/lib/data/katie-visits";

// ---- Mock DOM APIs used by downloadFile ----

let lastDownloadedContent: string;

// Intercept Blob constructor to capture content synchronously
const OriginalBlob = globalThis.Blob;

beforeEach(() => {
  lastDownloadedContent = "";

  const mockAnchor = {
    href: "",
    download: "",
    click: vi.fn(),
  };

  vi.spyOn(document, "createElement").mockReturnValue(
    mockAnchor as unknown as HTMLElement
  );
  vi.spyOn(document.body, "appendChild").mockImplementation(
    (node) => node as HTMLElement
  );
  vi.spyOn(document.body, "removeChild").mockImplementation(
    (node) => node as HTMLElement
  );

  // Capture content from Blob constructor
  vi.stubGlobal(
    "Blob",
    class MockBlob extends OriginalBlob {
      constructor(parts?: BlobPart[], options?: BlobPropertyBag) {
        super(parts, options);
        // The export functions always pass [string] as parts
        if (parts && parts.length > 0 && typeof parts[0] === "string") {
          lastDownloadedContent = parts[0] as string;
        }
      }
    }
  );

  vi.stubGlobal(
    "URL",
    Object.assign({}, URL, {
      createObjectURL: vi.fn(() => "blob:mock-url"),
      revokeObjectURL: vi.fn(),
    })
  );
});

// Helper to capture output
function captureDownload(fn: () => void): string {
  fn();
  return lastDownloadedContent;
}

// ---- csvEscape (tested indirectly) ----

describe("csvEscape (via exportRankingsCSV)", () => {
  function makeScoredNeighborhood(
    overrides: Partial<ScoredNeighborhood> = {}
  ): ScoredNeighborhood {
    return {
      id: "test",
      name: "Test",
      kreis: 1,
      slug: "test",
      description: "desc",
      vibe: "test vibe",
      lat: 0,
      lng: 0,
      locationType: "zurich_kreis",
      hoodmapVibes: [],
      scores: {
        commute: 5,
        gym: 5,
        social: 5,
        lake: 5,
        airport: 5,
        food: 5,
        quiet: 5,
        transit: 5,
        cost: 5,
        safety: 5,
        flightNoise: 5,
        parking: 5,
      },
      notes: {
        commute: "",
        gym: "",
        social: "",
        lake: "",
        airport: "",
        food: "",
        quiet: "",
        transit: "",
        cost: "",
        safety: "",
        flightNoise: "",
        parking: "",
      },
      rentStudioMin: 1000,
      rentStudioMax: 1500,
      rentOneBrMin: 1500,
      rentOneBrMax: 2000,
      rentTwoBrMin: 2000,
      rentTwoBrMax: 2500,
      pros: ["pro"],
      cons: ["con"],
      weightedScore: 5.0,
      rank: 1,
      dimensionContributions: {
        commute: 1,
        gym: 1,
        social: 1,
        lake: 1,
        airport: 1,
        food: 1,
        quiet: 1,
        transit: 1,
        cost: 1,
        safety: 1,
        flightNoise: 1,
        parking: 1,
      },
      ...overrides,
    };
  }

  it("should prefix formula-injection characters with a single quote", () => {
    const n = makeScoredNeighborhood({ vibe: "=SUM(A1)" });
    const csv = captureDownload(() => exportRankingsCSV([n]));
    // The vibe field should be escaped: ="'=SUM(A1)"
    expect(csv).toContain("\"'=SUM(A1)\"");
  });

  it("should prefix + character for formula injection prevention", () => {
    const n = makeScoredNeighborhood({ vibe: "+cmd" });
    const csv = captureDownload(() => exportRankingsCSV([n]));
    expect(csv).toContain("\"'+cmd\"");
  });

  it("should prefix - character for formula injection prevention", () => {
    const n = makeScoredNeighborhood({ vibe: "-malicious" });
    const csv = captureDownload(() => exportRankingsCSV([n]));
    expect(csv).toContain("\"'-malicious\"");
  });

  it("should prefix @ character for formula injection prevention", () => {
    const n = makeScoredNeighborhood({ vibe: "@import" });
    const csv = captureDownload(() => exportRankingsCSV([n]));
    expect(csv).toContain("\"'@import\"");
  });

  it("should wrap values containing commas in double quotes", () => {
    const n = makeScoredNeighborhood({ vibe: "fun, lively" });
    const csv = captureDownload(() => exportRankingsCSV([n]));
    expect(csv).toContain('"fun, lively"');
  });

  it("should escape double quotes by doubling them", () => {
    const n = makeScoredNeighborhood({ vibe: 'the "best" area' });
    const csv = captureDownload(() => exportRankingsCSV([n]));
    expect(csv).toContain('"the ""best"" area"');
  });

  it("should wrap values containing newlines in double quotes", () => {
    const n = makeScoredNeighborhood({ vibe: "line1\nline2" });
    const csv = captureDownload(() => exportRankingsCSV([n]));
    expect(csv).toContain('"line1\nline2"');
  });
});

// ---- exportBudgetCSV ----

describe("exportBudgetCSV", () => {
  const breakdown: BudgetBreakdown = {
    grossMonthlySalary: 15000,
    grossAnnualSalary: 195000,
    ahvMonthly: 863,
    alvMonthly: 136,
    bvgMonthly: 390,
    totalSocialMonthly: 1389,
    taxableAnnualIncome: 178332,
    effectiveTaxRate: 0,
    monthlyTax: 0,
    annualTax: 0,
    netMonthlySalary: 11450,
    expenseAllowance: 700,
    employerInsuranceContrib: 0,
    mobilityAllowance: 0,
    relocationMonthly: 0,
    totalMonthlyIncome: 12150,
    fixedOutside: 2760,
    viennaBreakdown: [
      { label: "Vienna rent share", value: 1450 },
      { label: "Child support", value: 915 },
      { label: "Vienna utilities", value: 220 },
      { label: "Car insurance + OAMTC", value: 175 },
    ],
    zurichCosts: 5000,
    pillar3aMonthly: 0,
    totalExpenses: 7760,
    surplus: 4390,
    savingsRate: 36.1,
    annualSurplus: 52680,
    annualSavingsProjection: [],
  };

  const expenses: ExpenseItem[] = [
    { key: "rent", label: "Rent", value: 2500, min: 1500, max: 4000, step: 50, color: "#3b82f6" },
    { key: "food", label: "Groceries", value: 600, min: 300, max: 1200, step: 50, color: "#22c55e" },
  ];

  const values: Record<string, number> = {
    rent: 2500,
    food: 600,
  };

  it("should produce CSV with correct header row", () => {
    const csv = captureDownload(() =>
      exportBudgetCSV(breakdown, expenses, values)
    );
    const lines = csv.split("\n");
    expect(lines[0]).toBe("Category,Amount (CHF)");
  });

  it("should include income section", () => {
    const csv = captureDownload(() =>
      exportBudgetCSV(breakdown, expenses, values)
    );
    expect(csv).toContain("Net Salary,11450");
    expect(csv).toContain("Expense Allowance,700");
    expect(csv).toContain("Total Income,12150");
  });

  it("should include expense rows from provided expenses", () => {
    const csv = captureDownload(() =>
      exportBudgetCSV(breakdown, expenses, values)
    );
    expect(csv).toContain("Rent,2500");
    expect(csv).toContain("Groceries,600");
  });

  it("should include summary section with surplus and savings rate", () => {
    const csv = captureDownload(() =>
      exportBudgetCSV(breakdown, expenses, values)
    );
    expect(csv).toContain("Monthly Surplus,4390");
    expect(csv).toContain("Savings Rate,36.1%");
    expect(csv).toContain("Annual Surplus,52680");
  });

  it("should include fixed outside costs", () => {
    const csv = captureDownload(() =>
      exportBudgetCSV(breakdown, expenses, values)
    );
    expect(csv).toContain("Vienna Costs,2760");
  });
});

// ---- exportRankingsCSV ----

describe("exportRankingsCSV", () => {
  function makeNeighborhood(
    rank: number,
    name: string,
    vibe: string
  ): ScoredNeighborhood {
    return {
      id: name.toLowerCase(),
      name,
      kreis: 2,
      slug: name.toLowerCase(),
      description: "",
      vibe,
      lat: 0,
      lng: 0,
      locationType: "zurich_kreis",
      hoodmapVibes: [],
      scores: {
        commute: 8,
        gym: 7,
        social: 6,
        lake: 9,
        airport: 5,
        food: 8,
        quiet: 7,
        transit: 8,
        cost: 7,
        safety: 8,
        flightNoise: 6,
        parking: 5,
      },
      notes: {
        commute: "",
        gym: "",
        social: "",
        lake: "",
        airport: "",
        food: "",
        quiet: "",
        transit: "",
        cost: "",
        safety: "",
        flightNoise: "",
        parking: "",
      },
      rentStudioMin: 1000,
      rentStudioMax: 1500,
      rentOneBrMin: 1800,
      rentOneBrMax: 2400,
      rentTwoBrMin: 2400,
      rentTwoBrMax: 3000,
      pros: ["a"],
      cons: ["b"],
      weightedScore: 7.25,
      rank,
      dimensionContributions: {
        commute: 1,
        gym: 1,
        social: 1,
        lake: 1,
        airport: 1,
        food: 1,
        quiet: 1,
        transit: 1,
        cost: 1,
        safety: 1,
        flightNoise: 1,
        parking: 1,
      },
    };
  }

  it("should have correct CSV headers", () => {
    const csv = captureDownload(() => exportRankingsCSV([]));
    const headerLine = csv.split("\n")[0];
    expect(headerLine).toBe(
      "Rank,Name,Kreis,Score,Commute,Gym,Social,Lake,Airport,Food,Quiet,Transit,1BR Min,1BR Max,Vibe"
    );
  });

  it("should output one data row per neighborhood", () => {
    const neighborhoods = [
      makeNeighborhood(1, "Enge", "Lakeside living"),
      makeNeighborhood(2, "Wiedikon", "Urban village"),
    ];
    const csv = captureDownload(() => exportRankingsCSV(neighborhoods));
    const lines = csv.split("\n");
    // 1 header + 2 data rows
    expect(lines).toHaveLength(3);
  });

  it("should quote vibe field containing commas", () => {
    const neighborhoods = [
      makeNeighborhood(1, "Enge", "Refined, lakeside living"),
    ];
    const csv = captureDownload(() => exportRankingsCSV(neighborhoods));
    expect(csv).toContain('"Refined, lakeside living"');
  });

  it("should include score dimensions in correct order", () => {
    const neighborhoods = [makeNeighborhood(1, "Enge", "test")];
    const csv = captureDownload(() => exportRankingsCSV(neighborhoods));
    const dataLine = csv.split("\n")[1];
    // rank, name, kreis, score, commute, gym, social, lake, airport, food, quiet, transit, 1brmin, 1brmax, vibe
    expect(dataLine).toBe("1,Enge,2,7.25,8,7,6,9,5,8,7,8,1800,2400,test");
  });
});

// ---- icsEscape (tested indirectly via exportKatieICS) ----

describe("icsEscape (via exportKatieICS)", () => {
  function makeVisit(overrides: Partial<KatieVisitData> = {}): KatieVisitData {
    return {
      id: "kv-test",
      startDate: "2026-07-17",
      endDate: "2026-07-19",
      transportMode: "flight",
      isConfirmed: true,
      ...overrides,
    };
  }

  it("should escape semicolons in description", () => {
    const visit = makeVisit({ notes: "Pack bags; get snacks" });
    const ics = captureDownload(() => exportKatieICS([visit]));
    expect(ics).toContain("Pack bags\\; get snacks");
  });

  it("should escape commas in description", () => {
    const visit = makeVisit({ notes: "Toys, books, clothes" });
    const ics = captureDownload(() => exportKatieICS([visit]));
    expect(ics).toContain("Toys\\, books\\, clothes");
  });

  it("should escape backslashes in description", () => {
    const visit = makeVisit({ notes: "path\\to\\file" });
    const ics = captureDownload(() => exportKatieICS([visit]));
    expect(ics).toContain("path\\\\to\\\\file");
  });
});

// ---- exportKatieICS ----

describe("exportKatieICS", () => {
  function makeVisit(overrides: Partial<KatieVisitData> = {}): KatieVisitData {
    return {
      id: "kv-test-01",
      startDate: "2026-07-17",
      endDate: "2026-07-19",
      transportMode: "flight",
      isConfirmed: true,
      ...overrides,
    };
  }

  it("should produce valid ICS with BEGIN:VCALENDAR and END:VCALENDAR", () => {
    const ics = captureDownload(() => exportKatieICS([makeVisit()]));
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("END:VCALENDAR");
  });

  it("should include VERSION and PRODID", () => {
    const ics = captureDownload(() => exportKatieICS([makeVisit()]));
    expect(ics).toContain("VERSION:2.0");
    expect(ics).toContain("PRODID:-//QuaiPulse//Katie Visits//EN");
  });

  it("should produce VEVENT blocks for each visit", () => {
    const visits = [
      makeVisit({ id: "kv-1" }),
      makeVisit({ id: "kv-2", startDate: "2026-08-01", endDate: "2026-08-03" }),
    ];
    const ics = captureDownload(() => exportKatieICS(visits));
    const veventCount = (ics.match(/BEGIN:VEVENT/g) || []).length;
    expect(veventCount).toBe(2);
  });

  it("should format dates as YYYYMMDD without dashes", () => {
    const ics = captureDownload(() => exportKatieICS([makeVisit()]));
    expect(ics).toContain("DTSTART;VALUE=DATE:20260717");
  });

  it("should increment end date by one day (ICS exclusive end)", () => {
    const ics = captureDownload(() => exportKatieICS([makeVisit()]));
    // endDate is 2026-07-19, so DTEND should be 2026-07-20
    expect(ics).toContain("DTEND;VALUE=DATE:20260720");
  });

  it("should use special label in summary when isSpecial is true", () => {
    const visit = makeVisit({
      isSpecial: true,
      specialLabel: "Birthday Weekend",
    });
    const ics = captureDownload(() => exportKatieICS([visit]));
    expect(ics).toContain("SUMMARY:Katie Visit - Birthday Weekend");
  });

  it("should use plain summary when not special", () => {
    const visit = makeVisit({ isSpecial: false });
    const ics = captureDownload(() => exportKatieICS([visit]));
    expect(ics).toContain("SUMMARY:Katie Visit");
    expect(ics).not.toContain("SUMMARY:Katie Visit -");
  });

  it("should include transport mode in description for flights", () => {
    const visit = makeVisit({ transportMode: "flight" });
    const ics = captureDownload(() => exportKatieICS([visit]));
    expect(ics).toContain("Flight ZRH-VIE");
  });

  it("should include transport mode in description for trains", () => {
    const visit = makeVisit({ transportMode: "train" });
    const ics = captureDownload(() => exportKatieICS([visit]));
    expect(ics).toContain("Train (Railjet/NightJet)");
  });

  it("should include UID with @quaipulse suffix", () => {
    const visit = makeVisit({ id: "kv-test-uid" });
    const ics = captureDownload(() => exportKatieICS([visit]));
    expect(ics).toContain("UID:kv-test-uid@quaipulse");
  });
});
