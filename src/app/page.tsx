"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { daysUntil, formatCHF } from "@/lib/utils";
import { MOVE_DATE } from "@/lib/constants";
import { useBudgetStore } from "@/lib/stores/budget-store";
import { usePriorityStore } from "@/lib/stores/priority-store";
import { NEIGHBORHOODS } from "@/lib/data/neighborhoods";
import { PLANNED_VISITS } from "@/lib/data/katie-visits";
import { CHECKLIST_ITEMS } from "@/lib/data/checklist-items";
import { rankNeighborhoods, formatScore, scoreTextClass } from "@/lib/engines/scoring";
import { EXPENSE_CONFIG } from "@/lib/engines/budget-calculator";
import { useBudgetWithTax } from "@/lib/hooks/use-budget-with-tax";
import { RadarChart } from "@/components/neighborhoods/radar-chart";
import { MoveReadinessRing } from "@/components/dashboard/move-readiness-ring";
import { NextActionsWidget } from "@/components/dashboard/next-actions-widget";
import { ApartmentPipelineCard } from "@/components/dashboard/apartment-pipeline-card";
import { HERO_IMAGES, NEIGHBORHOOD_IMAGES } from "@/lib/data/images";
import { OnboardingWizard } from "@/components/layout/onboarding-wizard";
import { Tip } from "@/components/ui/tooltip";
import { JourneyPrompts } from "@/components/dashboard/journey-prompts";
import { Compass } from "lucide-react";

export default function DashboardPage() {
  const values = useBudgetStore((s) => s.values);
  const weights = usePriorityStore((s) => s.weights);
  const days = daysUntil(MOVE_DATE);

  const top3 = useMemo(
    () => rankNeighborhoods(NEIGHBORHOODS, weights).slice(0, 3),
    [weights]
  );

  const budget = useBudgetWithTax();
  const { surplus, totalMonthlyIncome, savingsRate, totalExpenses } = budget;
  const savingsRateInt = Math.round(savingsRate);

  return (
    <div className="space-y-6 relative">
      {/* Onboarding wizard */}
      <OnboardingWizard />

      {/* Ambient glow */}
      <div className="ambient-glow glow-blue" />

      {/* Hero banner */}
      <div className="card-hero relative h-48 overflow-hidden rounded-xl">
        <Image
          src={HERO_IMAGES.dashboard}
          alt="Zurich twilight"
          fill
          sizes="100vw"
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
          <Tip content="Working days until your start date at Zurich Insurance, July 1 2026">
            <p className="mt-2 font-data text-4xl font-bold text-accent-primary" tabIndex={0}>
              {days}
            </p>
          </Tip>
          <p className="mt-1 text-xs text-text-tertiary">July 1, 2026</p>
        </div>

        {/* Monthly Surplus */}
        <div className="card elevation-1 p-5 relative overflow-hidden">
          <div className="card-hover-line" />
          <p className="section-label">Monthly Surplus</p>
          <Tip content="Take-home income minus all expenses (Zurich + Vienna). Green = positive, Red = deficit">
            <p
              className={`mt-2 font-data text-4xl font-bold ${surplus >= 0 ? "text-success" : "text-danger"}`}
              tabIndex={0}
            >
              {formatCHF(surplus)}
            </p>
          </Tip>
          <Tip content="Net salary after social deductions, tax, plus employer benefits (expense allowance, insurance, mobility)">
            <p className="mt-1 text-xs text-text-tertiary" tabIndex={0}>
              of {formatCHF(totalMonthlyIncome)} take-home
            </p>
          </Tip>
        </div>

        {/* Savings Rate */}
        <div className="card elevation-1 p-5 relative overflow-hidden">
          <div className="card-hover-line" />
          <p className="section-label">Savings Rate</p>
          <Tip content="Percentage of take-home income saved each month. Target: 20%+ for healthy finances">
            <p className="mt-2 font-data text-4xl font-bold text-success" tabIndex={0}>
              {savingsRateInt}%
            </p>
          </Tip>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-bg-tertiary relative">
            <div
              className="h-full rounded-full bg-success transition-all progress-shimmer relative"
              style={{ width: `${Math.max(0, Math.min(100, savingsRateInt))}%` }}
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

      {/* Smart Journey Prompts */}
      <JourneyPrompts />

      {/* Journey Guide CTA */}
      <Link
        href="/guide"
        className="group flex items-center gap-4 rounded-xl border border-accent-primary/20 bg-gradient-to-r from-accent-primary/5 to-transparent p-4 hover:border-accent-primary/40 transition-colors"
      >
        <div className="rounded-lg bg-accent-primary/10 p-2.5 shrink-0">
          <Compass className="h-5 w-5 text-accent-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary">
            Your Relocation Journey
          </p>
          <p className="text-[10px] text-text-muted mt-0.5">
            6 chapters from "Where should I live?" to "Life in Zurich" — follow the story or jump to any section.
          </p>
        </div>
        <span className="rounded-lg bg-accent-primary/10 px-3 py-1.5 text-xs font-medium text-accent-primary group-hover:bg-accent-primary/20 transition-colors shrink-0">
          Open Guide
        </span>
      </Link>

      {/* Top Neighborhoods */}
      <div>
        <p className="section-label mb-3">Top Neighborhoods</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {top3.map((n, i) => (
            <Link
              key={n.id}
              href={`/neighborhoods/${n.id}`}
              className="card card-interactive relative overflow-hidden"
            >
              <div className="card-hover-line" />
              {NEIGHBORHOOD_IMAGES[n.id] && (
                <div className="absolute inset-0">
                  <Image
                    src={NEIGHBORHOOD_IMAGES[n.id]}
                    alt={n.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
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
                    <Tip content="Zurich Kreis (district) number. Lower = more central">
                      <span className="text-[10px] text-text-muted" tabIndex={0}>
                        K{n.kreis}
                      </span>
                    </Tip>
                  </div>
                  <Tip content="Weighted score (0–10) based on your priority sliders. Higher = better match for your lifestyle">
                    <span
                      className={`font-data text-lg font-bold ${scoreTextClass(n.weightedScore)}`}
                      tabIndex={0}
                    >
                      {formatScore(n.weightedScore)}
                    </span>
                  </Tip>
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

      {/* Move Readiness + Next Actions + Pipeline */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <MoveReadinessRing />
        <ApartmentPipelineCard />
      </div>
      <NextActionsWidget />

      {/* Budget snapshot */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Link
          href="/budget"
          className="group card card-interactive p-4 relative overflow-hidden col-span-1 md:col-span-2"
        >
          <div className="card-hover-line" />
          <p className="section-label mb-3">Budget Snapshot</p>
          <div className="h-5 rounded-full overflow-hidden flex bg-bg-tertiary mb-2">
            {EXPENSE_CONFIG.slice(0, 5).map((e) => {
              const val = values[e.key as keyof typeof values];
              const pct = totalMonthlyIncome > 0 ? (val / totalMonthlyIncome) * 100 : 0;
              return (
                <Tip key={e.key} content={`${e.label}: ${formatCHF(val)}`}>
                  <div
                    className="h-full"
                    style={{ width: `${pct}%`, backgroundColor: e.color }}
                    tabIndex={0}
                  />
                </Tip>
              );
            })}
            {surplus > 0 && (
              <Tip content="Unallocated income — available for savings or discretionary spending">
                <div
                  className="h-full bg-success/40"
                  style={{ width: `${(surplus / totalMonthlyIncome) * 100}%` }}
                  tabIndex={0}
                />
              </Tip>
            )}
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">
              Expenses {formatCHF(totalExpenses)}
            </span>
            <span className={`font-data font-bold ${surplus >= 0 ? "text-success" : "text-danger"}`}>
              Surplus {formatCHF(surplus)}
            </span>
          </div>
          <span className="mt-3 inline-block rounded-md bg-accent-primary/10 px-3 py-1.5 text-xs font-medium text-accent-primary transition-colors group-hover:bg-accent-primary/20">
            Adjust Budget
          </span>
        </Link>

        <Link href="/katie" className="card card-interactive relative overflow-hidden">
          <div className="card-hover-line" />
          {HERO_IMAGES.katie && (
            <div className="absolute inset-0">
              <Image
                src={HERO_IMAGES.katie}
                alt="Katie visits"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover opacity-20"
              />
              <div className="img-overlay-fade" />
            </div>
          )}
          <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center">
            <p className="text-sm font-medium text-text-secondary">Katie Planner</p>
            <p className="mt-1 text-xs text-text-muted">{PLANNED_VISITS.length} visits planned</p>
          </div>
        </Link>

        <Link href="/checklist" className="card card-interactive p-8 text-center relative overflow-hidden">
          <div className="card-hover-line" />
          <p className="text-sm font-medium text-text-secondary">Move Checklist</p>
          <p className="mt-1 text-xs text-text-muted">{CHECKLIST_ITEMS.length} tasks, {new Set(CHECKLIST_ITEMS.map((c) => c.phase)).size} phases</p>
        </Link>

        <Link href="/language" className="group card card-interactive p-8 text-center relative overflow-hidden">
          <div className="card-hover-line" />
          <p className="text-sm font-medium text-text-secondary">Language Prep</p>
          <p className="mt-1 text-xs text-text-muted">German for daily life</p>
          <span className="mt-3 inline-block rounded-md bg-accent-primary/10 px-3 py-1.5 text-xs font-medium text-accent-primary transition-colors group-hover:bg-accent-primary/20">
            Study Now
          </span>
        </Link>
      </div>
    </div>
  );
}
