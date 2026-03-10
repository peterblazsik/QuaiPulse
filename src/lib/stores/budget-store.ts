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

type ViennaCostKey = "viennaRent" | "childSupport" | "viennaUtils" | "carInsurance";

interface BudgetStore {
  values: BudgetValues;

  // Gross income
  grossMonthlySalary: number;
  has13thSalary: boolean;
  annualBonusPct: number;

  // Employer benefits (tax-free additions to take-home)
  expenseAllowance: number;
  employerInsuranceContrib: number;
  mobilityAllowance: number;
  relocationBonus: number;

  // Deductions
  bvgMonthly: number;
  pillar3aMonthly: number;

  // Tax
  taxLocationId: string;

  // Vienna fixed costs (individually adjustable)
  viennaRent: number;
  childSupport: number;
  viennaUtils: number;
  carInsurance: number;

  // One-time setup costs
  setupCosts: Record<string, number>;

  // Actions
  setValue: (key: keyof BudgetValues, value: number) => void;
  setGrossMonthlySalary: (v: number) => void;
  setHas13thSalary: (v: boolean) => void;
  setAnnualBonusPct: (v: number) => void;
  setExpenseAllowance: (v: number) => void;
  setEmployerInsuranceContrib: (v: number) => void;
  setMobilityAllowance: (v: number) => void;
  setRelocationBonus: (v: number) => void;
  setBvgMonthly: (v: number) => void;
  setPillar3a: (v: number) => void;
  setTaxLocation: (locationId: string) => void;
  setViennaCost: (key: ViennaCostKey, v: number) => void;
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

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set) => ({
      values: { ...DEFAULT_VALUES },

      // Gross income defaults
      grossMonthlySalary: 15000,
      has13thSalary: true,
      annualBonusPct: 0,

      // Employer benefits
      expenseAllowance: 700,
      employerInsuranceContrib: 0,
      mobilityAllowance: 0,
      relocationBonus: 0,

      // Deduction defaults
      bvgMonthly: 390,
      pillar3aMonthly: 0,

      // Tax
      taxLocationId: "",

      // Vienna defaults
      viennaRent: 1450,
      childSupport: 915,
      viennaUtils: 220,
      carInsurance: 175,

      // Setup
      setupCosts: {},

      // Actions
      setValue: (key, value) =>
        set((s) => ({ values: { ...s.values, [key]: value } })),
      setGrossMonthlySalary: (v) => set({ grossMonthlySalary: v }),
      setHas13thSalary: (v) => set({ has13thSalary: v }),
      setAnnualBonusPct: (v) => set({ annualBonusPct: v }),
      setExpenseAllowance: (v) => set({ expenseAllowance: v }),
      setEmployerInsuranceContrib: (v) => set({ employerInsuranceContrib: v }),
      setMobilityAllowance: (v) => set({ mobilityAllowance: v }),
      setRelocationBonus: (v) => set({ relocationBonus: v }),
      setBvgMonthly: (v) => set({ bvgMonthly: v }),
      setPillar3a: (v) => set({ pillar3aMonthly: Math.min(v, 588) }),
      setTaxLocation: (locationId) => set({ taxLocationId: locationId }),
      setViennaCost: (key, v) => set({ [key]: v }),
      setSetupCost: (key, value) =>
        set((s) => ({ setupCosts: { ...s.setupCosts, [key]: value } })),
      resetValues: () =>
        set({
          values: { ...DEFAULT_VALUES },
          grossMonthlySalary: 15000,
          has13thSalary: true,
          annualBonusPct: 0,
          expenseAllowance: 700,
          employerInsuranceContrib: 0,
          mobilityAllowance: 0,
          relocationBonus: 0,
          bvgMonthly: 390,
          pillar3aMonthly: 0,
          setupCosts: {},
          taxLocationId: "",
          viennaRent: 1450,
          childSupport: 915,
          viennaUtils: 220,
          carInsurance: 175,
        }),
    }),
    {
      name: "quaipulse-budget",
      version: 3,
      migrate: (persisted, version) => {
        const state = persisted as Record<string, unknown>;
        if (version < 2) {
          Object.assign(state, {
            grossMonthlySalary: state.grossMonthlySalary ?? 15000,
            expenseAllowance: state.expenseAllowance ?? 700,
            bvgMonthly: state.bvgMonthly ?? 390,
            viennaRent: state.viennaRent ?? 1450,
            childSupport: state.childSupport ?? 915,
            viennaUtils: state.viennaUtils ?? 220,
            carInsurance: state.carInsurance ?? 175,
          });
        }
        if (version < 3) {
          Object.assign(state, {
            annualBonusPct: state.annualBonusPct ?? 0,
            employerInsuranceContrib: state.employerInsuranceContrib ?? 0,
            mobilityAllowance: state.mobilityAllowance ?? 0,
            relocationBonus: state.relocationBonus ?? 0,
          });
        }
        return state;
      },
    }
  )
);
