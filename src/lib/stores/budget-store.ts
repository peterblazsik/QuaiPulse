"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BudgetValues {
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
  has13thSalary: boolean;
  pillar3aMonthly: number;
  setupCosts: Record<string, number>;
  setValue: (key: keyof BudgetValues, value: number) => void;
  setHas13thSalary: (v: boolean) => void;
  setPillar3a: (v: number) => void;
  setSetupCost: (key: string, value: number) => void;
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

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set) => ({
      values: { ...DEFAULT_VALUES },
      has13thSalary: true,
      pillar3aMonthly: 0,
      setupCosts: {},
      setValue: (key, value) =>
        set((s) => ({ values: { ...s.values, [key]: value } })),
      setHas13thSalary: (v) => set({ has13thSalary: v }),
      setPillar3a: (v) => set({ pillar3aMonthly: Math.min(v, 588) }),
      setSetupCost: (key, value) =>
        set((s) => ({ setupCosts: { ...s.setupCosts, [key]: value } })),
      resetValues: () =>
        set({ values: { ...DEFAULT_VALUES }, has13thSalary: true, pillar3aMonthly: 0, setupCosts: {} }),
    }),
    { name: "quaipulse-budget" }
  )
);
