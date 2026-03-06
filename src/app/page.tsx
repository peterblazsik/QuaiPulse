"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { daysUntil, formatCHF } from "@/lib/utils";
import { MOVE_DATE } from "@/lib/constants";
import { useBudgetStore, FIXED_INCOME, FIXED_COSTS_OUTSIDE } from "@/lib/stores/budget-store";
import { usePriorityStore } from "@/lib/stores/priority-store";
import { NEIGHBORHOODS } from "@/lib/data/neighborhoods";
import { rankNeighborhoods, formatScore, scoreTextClass } from "@/lib/engines/scoring";
import { calculateBudget, EXPENSE_CONFIG } from "@/lib/engines/budget-calculator";
import { RadarChart } from "@/components/neighborhoods/radar-chart";
import { HERO_IMAGES, NEIGHBORHOOD_IMAGES } from "@/lib/data/images";

export default function DashboardPage() {
  const values = useBudgetStore((s) => s.values);
  const weights = usePriorityStore((s) => s.weights);
  const days = daysUntil(MOVE_DATE);
  const zurichCosts = Object.values(values).reduce((a, b) => a + b, 0);
  const surplus = FIXED_INCOME - FIXED_COSTS_OUTSIDE - zurichCosts;
  const savingsRate = Math.round((surplus / FIXED_INCOME) * 100);

  const top3 = useMemo(
    () => rankNeighborhoods(NEIGHBORHOODS, weights).slice(0, 3),
    [weights]
  );

  const budget = useMemo(
    () => calculateBudget(values as unknown as Record<string, number>),
    [values]
  );

  return (
    <div className="space-y-6 relative">
      {/* Ambient glow */}
      <div className="ambient-glow glow-blue" />

      {/* Hero banner */}
      <div className="card-hero relative h-48 overflow-hidden rounded-xl">
        <Image
          src={HERO_IMAGES.dashboard}
          alt="Zurich twilight"
          fill
          className="object-cover"
          priority
        />
        <div className="img-overlay-full" />
        <div className="relative z-10 flex h-full flex-col justify-end p-6">
          <p className="text-[10px] uppercase tracking-widest text-text-muted">
            Zurich Life Navigator
          </p>
          <h2 className="font-display text-3xl font-bold text-text-primary mt-1">
            Welcome back, Peter
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Your move to Zurich in{" "}
            <span className="font-data font-bold text-accent-primary">
              {days} days
            </span>
          </p>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Countdown */}
        <div className="card elevation-1 p-5 relative overflow-hidden">
          <div className="card-hover-line" />
          <p className="section-label">Days to Zurich</p>
          <p className="mt-2 font-data text-4xl font-bold text-accent-primary">
            {days}
          </p>
          <p className="mt-1 text-xs text-text-tertiary">July 1, 2026</p>
        </div>

        {/* Monthly Surplus */}
        <div className="card elevation-1 p-5 relative overflow-hidden">
          <div className="card-hover-line" />
          <p className="section-label">Monthly Surplus</p>
          <p
            className={`mt-2 font-data text-4xl font-bold ${surplus >= 0 ? "text-success" : "text-danger"}`}
          >
            {formatCHF(surplus)}
          </p>
          <p className="mt-1 text-xs text-text-tertiary">
            of {formatCHF(FIXED_INCOME)} income
          </p>
        </div>

        {/* Savings Rate */}
        <div className="card elevation-1 p-5 relative overflow-hidden">
          <div className="card-hover-line" />
          <p className="section-label">Savings Rate</p>
          <p className="mt-2 font-data text-4xl font-bold text-success">
            {savingsRate}%
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-bg-tertiary relative">
            <div
              className="h-full rounded-full bg-success transition-all progress-shimmer relative"
              style={{ width: `${Math.max(0, Math.min(100, savingsRate))}%` }}
            />
          </div>
        </div>

        {/* Quick Profile */}
        <div className="card elevation-1 p-5 relative overflow-hidden">
          <div className="card-hover-line" />
          <p className="section-label">Mission</p>
          <p className="mt-2 font-display text-lg font-semibold text-text-primary">
            Peter Blazsik
          </p>
          <p className="mt-1 text-xs text-text-tertiary">
            Finance AI & Innovation Lead
          </p>
          <p className="text-xs text-text-muted">Zurich Insurance Group</p>
        </div>
      </div>

      {/* Top Neighborhoods */}
      <div>
        <p className="section-label mb-3">Top Neighborhoods</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {top3.map((n, i) => (
            <Link
              key={n.id}
              href="/neighborhoods"
              className="card card-interactive relative overflow-hidden"
            >
              <div className="card-hover-line" />
              {/* Background image */}
              {NEIGHBORHOOD_IMAGES[n.id] && (
                <div className="absolute inset-0">
                  <Image
                    src={NEIGHBORHOOD_IMAGES[n.id]}
                    alt={n.name}
                    fill
                    className="object-cover opacity-30"
                  />
                  <div className="img-overlay-fade" />
                </div>
              )}
              <div className="relative z-10 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-data text-sm font-bold text-text-muted">
                      #{i + 1}
                    </span>
                    <span className="font-display text-sm font-semibold text-text-primary">
                      {n.name}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      K{n.kreis}
                    </span>
                  </div>
                  <span
                    className={`font-data text-lg font-bold ${scoreTextClass(n.weightedScore)}`}
                  >
                    {formatScore(n.weightedScore)}
                  </span>
                </div>
                <div className="flex justify-center">
                  <RadarChart scores={n.scores} size={120} showLabels={false} />
                </div>
                <p className="text-[10px] text-text-muted text-center mt-2 italic">
                  {n.vibe}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Budget snapshot */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/budget"
          className="card card-interactive p-4 relative overflow-hidden col-span-1 md:col-span-2"
        >
          <div className="card-hover-line" />
          <p className="section-label mb-3">Budget Snapshot</p>
          <div className="h-5 rounded-full overflow-hidden flex bg-bg-tertiary mb-2">
            {EXPENSE_CONFIG.slice(0, 5).map((e) => {
              const val = values[e.key as keyof typeof values];
              const pct = (val / FIXED_INCOME) * 100;
              return (
                <div
                  key={e.key}
                  className="h-full"
                  style={{ width: `${pct}%`, backgroundColor: e.color }}
                  title={`${e.label}: ${formatCHF(val)}`}
                />
              );
            })}
            {budget.surplus > 0 && (
              <div
                className="h-full bg-emerald-500/40"
                style={{ width: `${(budget.surplus / FIXED_INCOME) * 100}%` }}
              />
            )}
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">
              Expenses {formatCHF(budget.totalExpenses)}
            </span>
            <span className={`font-data font-bold ${budget.surplus >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              Surplus {formatCHF(budget.surplus)}
            </span>
          </div>
        </Link>

        <Link href="/katie" className="card card-interactive relative overflow-hidden">
          <div className="card-hover-line" />
          {HERO_IMAGES.katie && (
            <div className="absolute inset-0">
              <Image
                src={HERO_IMAGES.katie}
                alt="Katie visits"
                fill
                className="object-cover opacity-20"
              />
              <div className="img-overlay-fade" />
            </div>
          )}
          <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center">
            <p className="text-sm font-medium text-text-secondary">Katie Planner</p>
            <p className="mt-1 text-xs text-text-muted">8 visits planned</p>
          </div>
        </Link>

        <Link href="/checklist" className="card card-interactive p-8 text-center relative overflow-hidden">
          <div className="card-hover-line" />
          <p className="text-sm font-medium text-text-secondary">Move Checklist</p>
          <p className="mt-1 text-xs text-text-muted">30 tasks, 4 phases</p>
        </Link>
      </div>
    </div>
  );
}
