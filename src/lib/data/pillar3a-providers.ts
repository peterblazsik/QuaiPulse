// Pillar 3a provider data for Swiss retirement savings comparison.
// Data sourced from provider websites and moneyland.ch as of 2025.
// TER and return figures are approximate and subject to change.

export interface Pillar3aProvider {
  id: string;
  name: string;
  type: "digital" | "bank";
  maxEquityPct: number;
  ter: number;
  minInvestment: number;
  features: string[];
  globalStrategy: string;
  avgReturn5yr: number | null;
  recommended: boolean;
  note: string;
}

/** 2026 annual maximum for employees enrolled in a BVG pension fund */
export const PILLAR_3A_MAX_ANNUAL = 7258;

const providers: Pillar3aProvider[] = [
  {
    id: "finpension",
    name: "finpension",
    type: "digital",
    maxEquityPct: 99,
    ter: 0.39,
    minInvestment: 0,
    features: [
      "Lowest TER in market",
      "99% equity option",
      "Multiple accounts",
      "Tax optimization",
      "UBS custody",
    ],
    globalStrategy: "Passive index",
    avgReturn5yr: 7.5,
    recommended: true,
    note: "Marginally cheaper than VIAC. 99% equity is the highest available. Excellent for maximizers.",
  },
  {
    id: "viac",
    name: "VIAC",
    type: "digital",
    maxEquityPct: 97,
    ter: 0.4,
    minInvestment: 0,
    features: [
      "Lowest fees",
      "Credit Suisse custody",
      "App-first",
      "ESG options",
      "Free switching",
    ],
    globalStrategy: "Passive index",
    avgReturn5yr: 7.2,
    recommended: true,
    note: "Best overall for cost-conscious investors. 97% equity = maximum growth.",
  },
  {
    id: "frankly",
    name: "Frankly (ZKB)",
    type: "bank",
    maxEquityPct: 95,
    ter: 0.44,
    minInvestment: 0,
    features: [
      "ZKB backing",
      "Responsible investing",
      "Good app UX",
      "Established bank",
    ],
    globalStrategy: "Passive index",
    avgReturn5yr: 6.8,
    recommended: false,
    note: "Solid ZKB-backed option. Slightly higher TER but trusted brand.",
  },
  {
    id: "swisscanto",
    name: "Swisscanto (ZKB)",
    type: "bank",
    maxEquityPct: 75,
    ter: 0.96,
    minInvestment: 0,
    features: [
      "Traditional option",
      "Available at ZKB/Raiffeisen",
      "Balanced strategies",
    ],
    globalStrategy: "Mixed",
    avgReturn5yr: 5.0,
    recommended: false,
    note: "Legacy option. High fees eat into returns. Consider Frankly (same bank, lower cost) instead.",
  },
  {
    id: "ubs-vitainvest",
    name: "UBS Vitainvest",
    type: "bank",
    maxEquityPct: 75,
    ter: 1.22,
    minInvestment: 0,
    features: ["UBS brand", "Branch support", "Active management"],
    globalStrategy: "Active",
    avgReturn5yr: 4.5,
    recommended: false,
    note: "Expensive. Active management has underperformed passive. Only if you need UBS relationship.",
  },
];

/** All providers sorted by TER ascending (cheapest first) */
export const PILLAR_3A_PROVIDERS: readonly Pillar3aProvider[] = providers;

/** Returns only QuaiPulse-recommended providers */
export function getRecommendedProviders(): Pillar3aProvider[] {
  return PILLAR_3A_PROVIDERS.filter((p) => p.recommended);
}

/**
 * Calculates the tax benefit of a Pillar 3a contribution.
 * Contributions are deducted from taxable income, so the benefit
 * equals contribution * marginal tax rate.
 *
 * @param contribution - CHF amount contributed (clamped to annual max)
 * @param effectiveTaxRate - decimal between 0 and 1 (e.g. 0.22 for 22%)
 * @returns CHF saved on taxes
 */
export function calculateTaxBenefit(
  contribution: number,
  effectiveTaxRate: number,
): number {
  const clampedContribution = Math.min(
    Math.max(contribution, 0),
    PILLAR_3A_MAX_ANNUAL,
  );
  const clampedRate = Math.min(Math.max(effectiveTaxRate, 0), 1);
  return Math.round(clampedContribution * clampedRate * 100) / 100;
}
