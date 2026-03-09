"use client";

import { useMemo } from "react";
import { useBudgetStore } from "@/lib/stores/budget-store";
import { calculateBudget, type BudgetBreakdown } from "@/lib/engines/budget-calculator";
import { getTaxDataByLocationId } from "@/lib/data/tax-rates";

/**
 * Unified hook for budget calculation with gross→net→surplus pipeline.
 * Reads all income, deduction, tax, and expense fields from the store.
 */
export function useBudgetWithTax(): BudgetBreakdown {
  const values = useBudgetStore((s) => s.values);
  const grossMonthlySalary = useBudgetStore((s) => s.grossMonthlySalary);
  const has13thSalary = useBudgetStore((s) => s.has13thSalary);
  const expenseAllowance = useBudgetStore((s) => s.expenseAllowance);
  const bvgMonthly = useBudgetStore((s) => s.bvgMonthly);
  const pillar3aMonthly = useBudgetStore((s) => s.pillar3aMonthly);
  const taxLocationId = useBudgetStore((s) => s.taxLocationId);
  const viennaRent = useBudgetStore((s) => s.viennaRent);
  const childSupport = useBudgetStore((s) => s.childSupport);
  const viennaUtils = useBudgetStore((s) => s.viennaUtils);
  const carInsurance = useBudgetStore((s) => s.carInsurance);

  return useMemo(() => {
    const taxData = taxLocationId ? getTaxDataByLocationId(taxLocationId) : undefined;
    return calculateBudget({
      grossMonthlySalary,
      has13thSalary,
      expenseAllowance,
      bvgMonthly,
      pillar3aMonthly,
      taxEffectiveRate: taxData?.effectiveRate ?? 0,
      viennaRent,
      childSupport,
      viennaUtils,
      carInsurance,
      zurichValues: values,
    });
  }, [
    values, grossMonthlySalary, has13thSalary, expenseAllowance,
    bvgMonthly, pillar3aMonthly, taxLocationId,
    viennaRent, childSupport, viennaUtils, carInsurance,
  ]);
}
