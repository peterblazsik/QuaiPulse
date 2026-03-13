"use client";

import { useMemo } from "react";
import { useBudgetStore } from "@/lib/stores/budget-store";
import { AlertTriangle, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { formatCHF } from "@/lib/utils";

interface CashflowWeek {
  label: string;
  expenses: { item: string; amount: number }[];
  income: { item: string; amount: number }[];
  netCash: number;
  cumulativeCash: number;
}

export function FirstMonthCashflow() {
  const rent = useBudgetStore((s) => s.values.rent);
  const healthInsurance = useBudgetStore((s) => s.values.healthInsurance);
  const grossMonthlySalary = useBudgetStore((s) => s.grossMonthlySalary);
  const relocationBonus = useBudgetStore((s) => s.relocationBonus);
  const expenseAllowance = useBudgetStore((s) => s.expenseAllowance);

  const weeks = useMemo((): CashflowWeek[] => {
    const deposit = rent * 3;
    const furnitureEssentials = 3500;
    const adminFees = 500;
    const movingCosts = 4000;
    const firstRent = rent;
    const firstHealthPremium = healthInsurance;
    const groceriesWeek = 250;
    const transportSetup = 200;
    const firstPaycheck = grossMonthlySalary * 0.78; // ~22% deductions estimate
    const reloBonus = relocationBonus;
    const expAllow = expenseAllowance;

    let cumulative = 0;

    // Week 1: Move-in week — deposit, first rent, moving costs
    const w1Expenses = [
      { item: "Rental deposit (3x rent)", amount: deposit },
      { item: "First month rent", amount: firstRent },
      { item: "Moving company", amount: movingCosts },
      { item: "Admin fees", amount: adminFees },
      { item: "Groceries", amount: groceriesWeek },
    ];
    const w1Income = reloBonus > 0 ? [{ item: "Relocation bonus", amount: reloBonus }] : [];
    const w1Net =
      w1Income.reduce((s, i) => s + i.amount, 0) -
      w1Expenses.reduce((s, e) => s + e.amount, 0);
    cumulative += w1Net;

    // Week 2: Furniture & setup
    const w2Expenses = [
      { item: "Furniture essentials", amount: furnitureEssentials },
      { item: "Health insurance (1st)", amount: firstHealthPremium },
      { item: "Transport setup (ZVV)", amount: transportSetup },
      { item: "Groceries", amount: groceriesWeek },
    ];
    const w2Income: { item: string; amount: number }[] = [];
    const w2Net = -w2Expenses.reduce((s, e) => s + e.amount, 0);
    cumulative += w2Net;

    // Week 3: Settling in
    const w3Expenses = [
      { item: "Groceries & dining", amount: groceriesWeek },
      { item: "Misc household", amount: 300 },
    ];
    const w3Income: { item: string; amount: number }[] = [];
    const w3Net = -w3Expenses.reduce((s, e) => s + e.amount, 0);
    cumulative += w3Net;

    // Week 4: First paycheck arrives (end of month)
    const w4Expenses = [
      { item: "Groceries & dining", amount: groceriesWeek },
    ];
    const w4Income = [
      { item: "First paycheck (net)", amount: Math.round(firstPaycheck) },
      ...(expAllow > 0 ? [{ item: "Expense allowance", amount: expAllow }] : []),
    ];
    const w4Net =
      w4Income.reduce((s, i) => s + i.amount, 0) -
      w4Expenses.reduce((s, e) => s + e.amount, 0);
    cumulative += w4Net;

    return [
      { label: "Week 1", expenses: w1Expenses, income: w1Income, netCash: w1Net, cumulativeCash: cumulative - w4Net - w3Net - w2Net },
      { label: "Week 2", expenses: w2Expenses, income: w2Income, netCash: w2Net, cumulativeCash: cumulative - w4Net - w3Net },
      { label: "Week 3", expenses: w3Expenses, income: w3Income, netCash: w3Net, cumulativeCash: cumulative - w4Net },
      { label: "Week 4", expenses: w4Expenses, income: w4Income, netCash: w4Net, cumulativeCash: cumulative },
    ];
  }, [rent, healthInsurance, grossMonthlySalary, relocationBonus, expenseAllowance]);

  const totalExpenses = weeks.reduce(
    (s, w) => s + w.expenses.reduce((a, e) => a + e.amount, 0),
    0
  );
  const totalIncome = weeks.reduce(
    (s, w) => s + w.income.reduce((a, i) => a + i.amount, 0),
    0
  );
  const cashReserveNeeded = Math.abs(
    Math.min(...weeks.map((w) => w.cumulativeCash), 0)
  );

  // Find the lowest point (most negative cumulative cash)
  const lowestPoint = Math.min(...weeks.map((w) => w.cumulativeCash));
  const highestPoint = Math.max(...weeks.map((w) => w.cumulativeCash));
  const range = Math.max(Math.abs(lowestPoint), Math.abs(highestPoint), 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Wallet className="h-4 w-4 text-accent-primary" />
            First Month Cashflow
          </h3>
          <p className="text-[10px] text-text-muted mt-0.5">
            July 2026 week-by-week cash position
          </p>
        </div>
        <div className="text-right">
          <p className="font-data text-lg font-bold text-warning">
            {formatCHF(cashReserveNeeded)}
          </p>
          <p className="text-[10px] text-text-muted">cash needed day 1</p>
        </div>
      </div>

      {/* Cash position bar chart */}
      <div className="flex items-end gap-2 h-24 mb-4">
        {weeks.map((week) => {
          const heightPct = Math.abs(week.cumulativeCash) / range;
          const isNegative = week.cumulativeCash < 0;
          return (
            <div key={week.label} className="flex-1 flex flex-col items-center gap-1">
              <span className={`text-[10px] font-data font-bold ${isNegative ? "text-danger" : "text-success"}`}>
                {formatCHF(week.cumulativeCash)}
              </span>
              <div className="w-full flex flex-col justify-end h-16">
                {isNegative ? (
                  <div className="flex flex-col justify-start">
                    <div
                      className="w-full rounded-t bg-danger/30 border border-danger/40"
                      style={{ height: `${Math.max(heightPct * 64, 4)}px` }}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col justify-end h-full">
                    <div
                      className="w-full rounded-t bg-success/30 border border-success/40"
                      style={{ height: `${Math.max(heightPct * 64, 4)}px` }}
                    />
                  </div>
                )}
              </div>
              <span className="text-[10px] text-text-muted">{week.label}</span>
            </div>
          );
        })}
      </div>

      {/* Week details */}
      <div className="space-y-3">
        {weeks.map((week) => (
          <details key={week.label} className="group">
            <summary className="flex items-center justify-between cursor-pointer text-xs">
              <span className="font-medium text-text-secondary">{week.label}</span>
              <div className="flex items-center gap-3">
                {week.expenses.length > 0 && (
                  <span className="flex items-center gap-1 text-danger">
                    <TrendingDown className="h-3 w-3" />
                    {formatCHF(week.expenses.reduce((s, e) => s + e.amount, 0))}
                  </span>
                )}
                {week.income.length > 0 && (
                  <span className="flex items-center gap-1 text-success">
                    <TrendingUp className="h-3 w-3" />
                    {formatCHF(week.income.reduce((s, i) => s + i.amount, 0))}
                  </span>
                )}
              </div>
            </summary>
            <div className="mt-2 ml-2 space-y-1">
              {week.expenses.map((e) => (
                <div key={e.item} className="flex justify-between text-[10px]">
                  <span className="text-text-muted">{e.item}</span>
                  <span className="text-danger font-data">-{formatCHF(e.amount)}</span>
                </div>
              ))}
              {week.income.map((i) => (
                <div key={i.item} className="flex justify-between text-[10px]">
                  <span className="text-text-muted">{i.item}</span>
                  <span className="text-success font-data">+{formatCHF(i.amount)}</span>
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-3 border-t border-border-subtle">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-text-muted">Total July expenses</span>
          <span className="font-data text-danger">{formatCHF(totalExpenses)}</span>
        </div>
        <div className="flex justify-between text-xs mb-2">
          <span className="text-text-muted">Total July income</span>
          <span className="font-data text-success">{formatCHF(totalIncome)}</span>
        </div>

        {cashReserveNeeded > 0 && (
          <div className="rounded-lg bg-warning/10 border border-warning/20 p-2.5 flex items-start gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0 mt-0.5" />
            <p className="text-[10px] text-warning leading-snug">
              You need at least <span className="font-bold">{formatCHF(cashReserveNeeded)}</span> in
              cash reserves before moving. Your bank balance will be negative until the first
              paycheck arrives at end of July.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
