export type SubCategory = "streaming" | "software" | "telecom" | "fitness" | "finance" | "cloud" | "news" | "other";
export type SubAction = "keep" | "cut" | "replace" | "undecided";
export type BillingCycle = "monthly" | "yearly";

export interface SubscriptionData {
  id: string;
  name: string;
  category: SubCategory;
  monthlyCostEUR: number;
  monthlyCostCHF: number; // post-move equivalent
  billingCycle: BillingCycle;
  essential: boolean;
  swissAlternative?: string;
  swissAlternativeCostCHF?: number;
  notes?: string;
}

export const CATEGORY_CONFIG: Record<SubCategory, { label: string; color: string }> = {
  streaming: { label: "Streaming", color: "#e879f9" },
  software: { label: "Software", color: "#3b82f6" },
  telecom: { label: "Telecom", color: "#22c55e" },
  fitness: { label: "Fitness", color: "#ef4444" },
  finance: { label: "Finance", color: "#f59e0b" },
  cloud: { label: "Cloud", color: "#06b6d4" },
  news: { label: "News", color: "#8b5cf6" },
  other: { label: "Other", color: "#64748b" },
};

export const DEFAULT_SUBSCRIPTIONS: SubscriptionData[] = [
  // Streaming
  {
    id: "sub-netflix",
    name: "Netflix Premium",
    category: "streaming",
    monthlyCostEUR: 17.99,
    monthlyCostCHF: 26.90,
    billingCycle: "monthly",
    essential: false,
    notes: "Swiss pricing is higher. Consider Standard plan at CHF 15.90.",
  },
  {
    id: "sub-spotify",
    name: "Spotify Premium",
    category: "streaming",
    monthlyCostEUR: 10.99,
    monthlyCostCHF: 14.90,
    billingCycle: "monthly",
    essential: true,
    notes: "Essential for commute. Price similar.",
  },
  {
    id: "sub-youtube",
    name: "YouTube Premium",
    category: "streaming",
    monthlyCostEUR: 13.99,
    monthlyCostCHF: 15.90,
    billingCycle: "monthly",
    essential: false,
    notes: "Consider cutting — ad blocker works for desktop.",
  },
  {
    id: "sub-disney",
    name: "Disney+",
    category: "streaming",
    monthlyCostEUR: 8.99,
    monthlyCostCHF: 12.90,
    billingCycle: "monthly",
    essential: false,
    notes: "Good for Katie visits. Keep if she watches it.",
  },
  // Software
  {
    id: "sub-claude",
    name: "Claude Pro",
    category: "software",
    monthlyCostEUR: 18.00,
    monthlyCostCHF: 18.00,
    billingCycle: "monthly",
    essential: true,
    notes: "Non-negotiable. Core work tool.",
  },
  {
    id: "sub-chatgpt",
    name: "ChatGPT Plus",
    category: "software",
    monthlyCostEUR: 20.00,
    monthlyCostCHF: 20.00,
    billingCycle: "monthly",
    essential: false,
    notes: "Redundant with Claude Pro? Consider cutting.",
  },
  {
    id: "sub-github",
    name: "GitHub Copilot",
    category: "software",
    monthlyCostEUR: 10.00,
    monthlyCostCHF: 10.00,
    billingCycle: "monthly",
    essential: true,
    notes: "May be provided by employer.",
  },
  {
    id: "sub-figma",
    name: "Figma Pro",
    category: "software",
    monthlyCostEUR: 12.00,
    monthlyCostCHF: 12.00,
    billingCycle: "monthly",
    essential: false,
    notes: "Side project use only. Free tier might suffice.",
  },
  {
    id: "sub-notion",
    name: "Notion Plus",
    category: "software",
    monthlyCostEUR: 8.00,
    monthlyCostCHF: 8.00,
    billingCycle: "monthly",
    essential: true,
  },
  // Telecom
  {
    id: "sub-phone-nl",
    name: "KPN Mobile (NL)",
    category: "telecom",
    monthlyCostEUR: 25.00,
    monthlyCostCHF: 0,
    billingCycle: "monthly",
    essential: false,
    swissAlternative: "Yallo (Salt)",
    swissAlternativeCostCHF: 29.00,
    notes: "Must cancel and switch to Swiss provider.",
  },
  {
    id: "sub-internet-nl",
    name: "Ziggo Internet (NL)",
    category: "telecom",
    monthlyCostEUR: 40.00,
    monthlyCostCHF: 0,
    billingCycle: "monthly",
    essential: false,
    swissAlternative: "Swisscom Internet",
    swissAlternativeCostCHF: 55.00,
    notes: "Cancel with apartment. Swiss internet is more expensive.",
  },
  // Fitness
  {
    id: "sub-gym-nl",
    name: "Basic Fit (NL)",
    category: "fitness",
    monthlyCostEUR: 30.00,
    monthlyCostCHF: 0,
    billingCycle: "monthly",
    essential: false,
    swissAlternative: "PureGym/Activ Fitness",
    swissAlternativeCostCHF: 59.00,
    notes: "Cancel. Will join Zurich gym.",
  },
  // Finance
  {
    id: "sub-revolut",
    name: "Revolut Premium",
    category: "finance",
    monthlyCostEUR: 7.99,
    monthlyCostCHF: 9.90,
    billingCycle: "monthly",
    essential: true,
    notes: "Keep for EUR/CHF conversions and travel.",
  },
  // Cloud
  {
    id: "sub-icloud",
    name: "iCloud+ 200GB",
    category: "cloud",
    monthlyCostEUR: 2.99,
    monthlyCostCHF: 3.00,
    billingCycle: "monthly",
    essential: true,
  },
  {
    id: "sub-vercel",
    name: "Vercel Pro",
    category: "cloud",
    monthlyCostEUR: 20.00,
    monthlyCostCHF: 20.00,
    billingCycle: "monthly",
    essential: false,
    notes: "Side project hosting. Free tier if traffic is low.",
  },
  // News
  {
    id: "sub-nzz",
    name: "NZZ Digital",
    category: "news",
    monthlyCostEUR: 0,
    monthlyCostCHF: 29.00,
    billingCycle: "monthly",
    essential: false,
    notes: "New subscription for Swiss news. Consider after settling.",
  },
  {
    id: "sub-economist",
    name: "The Economist",
    category: "news",
    monthlyCostEUR: 15.00,
    monthlyCostCHF: 15.00,
    billingCycle: "monthly",
    essential: false,
    notes: "Keep for global perspective.",
  },
];
