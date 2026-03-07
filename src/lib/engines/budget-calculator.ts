import { type BudgetValues, FIXED_INCOME, FIXED_COSTS_OUTSIDE } from "@/lib/stores/budget-store";

export interface BudgetBreakdown {
  totalIncome: number;
  fixedOutside: number;
  zurichCosts: number;
  totalExpenses: number;
  surplus: number;
  savingsRate: number;
  annualSurplus: number;
  annualSavingsProjection: number[];
}

export interface ExpenseItem {
  key: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  color: string;
  fixed?: boolean;
  note?: string;
}

export const EXPENSE_CONFIG: ExpenseItem[] = [
  { key: "rent", label: "Rent", value: 2400, min: 1500, max: 3500, step: 50, color: "#ef4444" },
  { key: "healthInsurance", label: "Health Insurance", value: 350, min: 280, max: 500, step: 10, color: "#f97316" },
  { key: "foodDining", label: "Food & Dining", value: 1075, min: 600, max: 1500, step: 25, color: "#f59e0b" },
  { key: "transport", label: "ZVV Transport", value: 85, min: 85, max: 85, step: 1, color: "#84cc16", fixed: true, note: "BonusPass monthly" },
  { key: "gym", label: "Gym", value: 100, min: 35, max: 200, step: 5, color: "#22c55e" },
  { key: "electricity", label: "Electricity / Utils", value: 120, min: 80, max: 200, step: 10, color: "#06b6d4" },
  { key: "internet", label: "Internet + Mobile", value: 110, min: 80, max: 180, step: 10, color: "#3b82f6" },
  { key: "flights", label: "ZRH-VIE Flights", value: 450, min: 200, max: 700, step: 25, color: "#8b5cf6" },
  { key: "subscriptions", label: "Subscriptions", value: 200, min: 100, max: 400, step: 10, color: "#ec4899" },
  { key: "misc", label: "Misc / Unexpected", value: 200, min: 100, max: 500, step: 25, color: "#64748b" },
];

export const FIXED_OUTSIDE_ITEMS = [
  { label: "Vienna rent share", value: 1450 },
  { label: "Child support", value: 915 },
  { label: "Vienna utilities", value: 220 },
  { label: "Car insurance + OAMTC", value: 175 },
];

export const INCOME_ITEMS = [
  { label: "Net salary", value: 11450 },
  { label: "Expense allowance", value: 700 },
];

export function calculateBudget(
  zurichValues: BudgetValues | Record<string, number>
): BudgetBreakdown {
  const zurichCosts = Object.values(zurichValues).reduce((a, b) => a + b, 0);
  const totalExpenses = FIXED_COSTS_OUTSIDE + zurichCosts;
  const surplus = FIXED_INCOME - totalExpenses;
  const savingsRate = FIXED_INCOME > 0 ? (surplus / FIXED_INCOME) * 100 : 0;

  // 12-month projection (cumulative savings)
  const annualSavingsProjection = Array.from({ length: 12 }, (_, i) =>
    surplus * (i + 1)
  );

  return {
    totalIncome: FIXED_INCOME,
    fixedOutside: FIXED_COSTS_OUTSIDE,
    zurichCosts,
    totalExpenses,
    surplus,
    savingsRate,
    annualSurplus: surplus * 12,
    annualSavingsProjection,
  };
}

export interface WhatIfScenario {
  id: string;
  label: string;
  description: string;
  changes: Record<string, number>;
}

export const WHAT_IF_SCENARIOS: WhatIfScenario[] = [
  {
    id: "katie-3x",
    label: "Katie visits 3x/month",
    description: "Flight costs increase to CHF 650/mo",
    changes: { flights: 650 },
  },
  {
    id: "2br-apartment",
    label: "2BR for Katie visits",
    description: "Rent up to CHF 2,800 but Katie has her own room",
    changes: { rent: 2800 },
  },
  {
    id: "eat-out-less",
    label: "Cook more, eat out less",
    description: "Food drops to CHF 800/mo",
    changes: { foodDining: 800 },
  },
  {
    id: "premium-gym",
    label: "Holmes Place Premium",
    description: "Gym up to CHF 180/mo — pool, spa, premium equipment",
    changes: { gym: 180 },
  },
  {
    id: "frugal-mode",
    label: "Frugal mode",
    description: "Minimize everything for maximum savings",
    changes: { rent: 1800, foodDining: 700, gym: 35, subscriptions: 100, misc: 100 },
  },
];
