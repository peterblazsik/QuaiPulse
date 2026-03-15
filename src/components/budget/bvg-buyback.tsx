"use client";

import { useMemo, useState } from "react";
import { useBudgetStore } from "@/lib/stores/budget-store";
import {
  calculateBuybackPotential,
  getBvgCreditRate,
  BVG_COORDINATION_DEDUCTION,
} from "@/lib/engines/bvg-buyback";
import { formatCHF } from "@/lib/utils";
import { PiggyBank, TrendingUp, AlertTriangle } from "lucide-react";
import { Tip } from "@/components/ui/tooltip";

export function BvgBuyback() {
  const grossMonthlySalary = useBudgetStore((s) => s.grossMonthlySalary);
  const has13thSalary = useBudgetStore((s) => s.has13thSalary);

  const grossAnnual = grossMonthlySalary * (has13thSalary ? 13 : 12);

  const [age, setAge] = useState(49);
  const [yearsEmployedCH, setYearsEmployedCH] = useState(0);
  const [currentBvgBalance, setCurrentBvgBalance] = useState(0);

  const coordinatedSalary = Math.max(0, grossAnnual - BVG_COORDINATION_DEDUCTION);

  const result = useMemo(
    () =>
      calculateBuybackPotential({
        age,
        yearsEmployedCH,
        currentBvgBalance,
        coordinatedSalary,
        retirementAge: 65,
      }),
    [age, yearsEmployedCH, currentBvgBalance, coordinatedSalary]
  );

  const creditRate = getBvgCreditRate(age);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <PiggyBank className="h-4 w-4 text-warning" />
            <Tip content="BVG (Berufliche Vorsorge) = Swiss occupational pension (Pillar 2). Voluntary buybacks reduce taxable income and boost retirement capital">
              <span tabIndex={0}>BVG Buyback Potential</span>
            </Tip>
          </h3>
          <p className="text-[10px] text-text-muted mt-0.5">
            Pillar 2 voluntary purchase-in — 100% tax deductible
          </p>
        </div>
        <div className="text-right">
          <p className="font-data text-lg font-bold text-warning">
            {formatCHF(result.maxBuybackPotential)}
          </p>
          <p className="text-[10px] text-text-muted">max buyback</p>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div>
          <label className="block text-[10px] text-text-muted mb-0.5">Age</label>
          <input
            type="number"
            min={25}
            max={65}
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full rounded border border-border-default bg-bg-primary px-2 py-1 text-xs font-data text-text-primary focus:border-accent-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] text-text-muted mb-0.5">Years in CH BVG</label>
          <input
            type="number"
            min={0}
            max={40}
            value={yearsEmployedCH}
            onChange={(e) => setYearsEmployedCH(Number(e.target.value))}
            className="w-full rounded border border-border-default bg-bg-primary px-2 py-1 text-xs font-data text-text-primary focus:border-accent-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] text-text-muted mb-0.5">Current BVG CHF</label>
          <input
            type="number"
            min={0}
            step={1000}
            value={currentBvgBalance}
            onChange={(e) => setCurrentBvgBalance(Number(e.target.value))}
            className="w-full rounded border border-border-default bg-bg-primary px-2 py-1 text-xs font-data text-text-primary focus:border-accent-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Tip content="What your BVG balance would be if you'd been in Swiss pension system since age 25. The gap = your buyback opportunity">
          <div className="rounded-lg bg-bg-primary/30 border border-border-subtle p-2.5" tabIndex={0}>
            <p className="text-[10px] text-text-muted">Target Capital</p>
            <p className="font-data text-sm font-bold text-text-primary">{formatCHF(result.targetCapital)}</p>
            <p className="text-[10px] text-text-muted">full career from age 25</p>
          </div>
        </Tip>
        <Tip content="Estimated tax reduction from the buyback. Buyback amount is deducted from taxable income at your marginal rate">
          <div className="rounded-lg bg-success/5 border border-success/20 p-2.5" tabIndex={0}>
            <p className="text-[10px] text-text-muted">Tax Savings</p>
            <p className="font-data text-sm font-bold text-success">{formatCHF(result.taxSavings)}</p>
            <p className="text-[10px] text-text-muted">at ~28% marginal rate</p>
          </div>
        </Tip>
      </div>

      {/* Current rate info */}
      <div className="flex items-center justify-between text-xs mb-3 py-2 border-y border-border-subtle">
        <Tip content="BVG contribution rate increases with age: 25-34 = 7%, 35-44 = 10%, 45-54 = 15%, 55-65 = 18%">
          <span className="text-text-muted" tabIndex={0}>Current age credit rate</span>
        </Tip>
        <span className="font-data font-bold text-text-primary">{(creditRate * 100).toFixed(0)}%</span>
      </div>
      <div className="flex items-center justify-between text-xs mb-4">
        <span className="text-text-muted">Annual BVG contribution</span>
        <span className="font-data font-bold text-text-primary">{formatCHF(result.annualContribution)}</span>
      </div>

      {/* Multi-year strategy table */}
      {result.suggestedStrategy.length > 0 && (
        <div>
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2">
            Suggested {result.suggestedStrategy.length}-Year Strategy
          </h4>
          <div className="rounded-lg border border-border-subtle overflow-hidden">
            <table className="w-full text-[10px]">
              <thead>
                <tr className="bg-bg-primary/50">
                  <th className="px-2 py-1.5 text-left text-text-muted font-semibold">Year</th>
                  <th className="px-2 py-1.5 text-right text-text-muted font-semibold">Buyback</th>
                  <th className="px-2 py-1.5 text-right text-text-muted font-semibold">Cumulative</th>
                  <th className="px-2 py-1.5 text-right text-text-muted font-semibold">Tax Saved</th>
                </tr>
              </thead>
              <tbody>
                {result.suggestedStrategy.map((plan) => (
                  <tr key={plan.year} className="border-t border-border-subtle">
                    <td className="px-2 py-1.5 font-data text-text-secondary">{plan.year}</td>
                    <td className="px-2 py-1.5 text-right font-data text-text-primary">
                      {formatCHF(plan.amount)}
                    </td>
                    <td className="px-2 py-1.5 text-right font-data text-text-muted">
                      {formatCHF(plan.cumulativeBought)}
                    </td>
                    <td className="px-2 py-1.5 text-right font-data text-success">
                      {formatCHF(plan.taxSaved)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-3 rounded-lg bg-warning/5 border border-warning/15 p-2 flex items-start gap-2">
        <AlertTriangle className="h-3 w-3 text-warning/60 shrink-0 mt-0.5" />
        <p className="text-[10px] text-text-muted leading-snug">
          Simplified model using statutory BVG rates. Actual buyback potential depends on your
          employer's pension plan (Vorsorgereglement). Request Einkaufspotenzial from pension fund.
          3-year lockout rule applies to capital withdrawals after buyback.
        </p>
      </div>
    </div>
  );
}
