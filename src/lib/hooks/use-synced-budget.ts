"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc/client";
import { useBudgetStore, type BudgetValues } from "@/lib/stores/budget-store";

const LS_KEY = "quaipulse-budget";

export function useSyncedBudget() {
  const { data: session } = useSession();
  const migrated = useRef(false);
  const query = trpc.budget.get.useQuery(undefined, {
    enabled: !!session?.user?.id,
  });
  const upsert = trpc.budget.upsert.useMutation();

  useEffect(() => {
    if (!session?.user?.id || migrated.current) return;
    if (query.isLoading) return;

    const serverData = query.data;
    const store = useBudgetStore.getState();

    if (!serverData) {
      // Server empty — check localStorage for migration
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          const state = parsed.state ?? parsed;
          upsert.mutate({
            grossMonthlySalary: state.grossMonthlySalary ?? 15000,
            has13thSalary: state.has13thSalary ?? true,
            annualBonusPct: state.annualBonusPct ?? 0,
            expenseAllowance: state.expenseAllowance ?? 700,
            employerInsuranceContrib: state.employerInsuranceContrib ?? 0,
            mobilityAllowance: state.mobilityAllowance ?? 0,
            relocationBonus: state.relocationBonus ?? 0,
            bvgMonthly: state.bvgMonthly ?? 390,
            pillar3aMonthly: state.pillar3aMonthly ?? 0,
            taxLocationId: state.taxLocationId ?? "",
            viennaRent: state.viennaRent ?? 1450,
            childSupport: state.childSupport ?? 915,
            viennaUtils: state.viennaUtils ?? 220,
            carInsurance: state.carInsurance ?? 175,
            valuesJson: { ...(state.values ?? {}) },
            setupCostsJson: { ...(state.setupCosts ?? {}) },
          });
          localStorage.removeItem(LS_KEY);
        } catch { /* ignore corrupt data */ }
      }
    } else {
      // Server has data — hydrate Zustand from server
      const values = (serverData.valuesJson ?? {}) as BudgetValues;
      const setupCosts = (serverData.setupCostsJson ?? {}) as Record<string, number>;
      useBudgetStore.setState({
        grossMonthlySalary: serverData.grossMonthlySalary,
        has13thSalary: serverData.has13thSalary,
        annualBonusPct: serverData.annualBonusPct,
        expenseAllowance: serverData.expenseAllowance,
        employerInsuranceContrib: serverData.employerInsuranceContrib,
        mobilityAllowance: serverData.mobilityAllowance,
        relocationBonus: serverData.relocationBonus,
        bvgMonthly: serverData.bvgMonthly,
        pillar3aMonthly: serverData.pillar3aMonthly,
        taxLocationId: serverData.taxLocationId,
        viennaRent: serverData.viennaRent,
        childSupport: serverData.childSupport,
        viennaUtils: serverData.viennaUtils,
        carInsurance: serverData.carInsurance,
        values,
        setupCosts,
      });
      localStorage.removeItem(LS_KEY);
    }

    migrated.current = true;
  }, [session?.user?.id, query.isLoading, query.data, upsert]);

  // Save to server whenever store changes
  const saveBudget = () => {
    if (!session?.user?.id) return;
    const s = useBudgetStore.getState();
    upsert.mutate({
      grossMonthlySalary: s.grossMonthlySalary,
      has13thSalary: s.has13thSalary,
      annualBonusPct: s.annualBonusPct,
      expenseAllowance: s.expenseAllowance,
      employerInsuranceContrib: s.employerInsuranceContrib,
      mobilityAllowance: s.mobilityAllowance,
      relocationBonus: s.relocationBonus,
      bvgMonthly: s.bvgMonthly,
      pillar3aMonthly: s.pillar3aMonthly,
      taxLocationId: s.taxLocationId,
      viennaRent: s.viennaRent,
      childSupport: s.childSupport,
      viennaUtils: s.viennaUtils,
      carInsurance: s.carInsurance,
      valuesJson: { ...s.values },
      setupCostsJson: { ...s.setupCosts },
    });
  };

  return { saveBudget, isLoading: query.isLoading };
}
