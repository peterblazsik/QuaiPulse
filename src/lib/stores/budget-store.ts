"use client";

import { create } from "zustand";

interface BudgetValues {
  rent: number;
  healthInsurance: number;
  foodDining: number;
  transport: number;
  gym: number;
  electricity: number;
  internet: number;
  flights: number;
  subscriptions: number;
  misc: number;
}

interface BudgetStore {
  values: BudgetValues;
  setValue: (key: keyof BudgetValues, value: number) => void;
  resetValues: () => void;
}

const DEFAULT_VALUES: BudgetValues = {
  rent: 2400,
  healthInsurance: 350,
  foodDining: 1075,
  transport: 85,
  gym: 100,
  electricity: 120,
  internet: 110,
  flights: 450,
  subscriptions: 200,
  misc: 200,
};

export const FIXED_INCOME = 12150; // Net salary 11,450 + expense allowance 700
export const FIXED_COSTS_OUTSIDE = 2760; // Vienna rent + child support + Vienna utils + car

export const useBudgetStore = create<BudgetStore>((set) => ({
  values: { ...DEFAULT_VALUES },
  setValue: (key, value) =>
    set((s) => ({ values: { ...s.values, [key]: value } })),
  resetValues: () => set({ values: { ...DEFAULT_VALUES } }),
}));
