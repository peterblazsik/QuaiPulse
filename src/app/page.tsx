"use client";

import { useMemo } from "react";
import { daysUntil, formatCHF } from "@/lib/utils";
import { MOVE_DATE } from "@/lib/constants";
import { useBudgetStore, FIXED_INCOME, FIXED_COSTS_OUTSIDE } from "@/lib/stores/budget-store";
import { usePriorityStore } from "@/lib/stores/priority-store";
import { NEIGHBORHOODS } from "@/lib/data/neighborhoods";
import { rankNeighborhoods, formatScore, scoreTextClass } from "@/lib/engines/scoring";
import { RadarChart } from "@/components/neighborhoods/radar-chart";
import Link from "next/link";

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

  return (
    <div className="space-y-6">
      {/* Hero row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Countdown */}
        <div className="rounded-xl border border-border-default bg-bg-secondary p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Days to Zurich
          </p>
          <p className="mt-2 font-data text-4xl font-bold text-accent-primary">
            {days}
          </p>
          <p className="mt-1 text-xs text-text-tertiary">July 1, 2026</p>
        </div>

        {/* Monthly Surplus */}
        <div className="rounded-xl border border-border-default bg-bg-secondary p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Monthly Surplus
          </p>
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
        <div className="rounded-xl border border-border-default bg-bg-secondary p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Savings Rate
          </p>
          <p className="mt-2 font-data text-4xl font-bold text-success">
            {savingsRate}%
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-bg-tertiary">
            <div
              className="h-full rounded-full bg-success transition-all"
              style={{ width: `${Math.max(0, Math.min(100, savingsRate))}%` }}
            />
          </div>
        </div>

        {/* Quick Profile */}
        <div className="rounded-xl border border-border-default bg-bg-secondary p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Mission
          </p>
          <p className="mt-2 font-display text-lg font-semibold text-text-primary">
            Peter Blazsik
          </p>
          <p className="mt-1 text-xs text-text-tertiary">
            Finance AI & Innovation Lead
          </p>
          <p className="text-xs text-text-muted">Zurich Insurance Group</p>
        </div>
      </div>

      {/* Top Neighborhoods + placeholders */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {top3.map((n, i) => (
          <Link
            key={n.id}
            href="/neighborhoods"
            className="rounded-xl border border-border-default bg-bg-secondary p-4 hover:border-accent-primary/40 transition-colors"
          >
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
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <PlaceholderCard
          title="Next Actions"
          description="Checklist integration coming in Phase 6"
        />
        <PlaceholderCard
          title="Katie Visit"
          description="Visit planner coming in Phase 4"
        />
        <PlaceholderCard
          title="Weather"
          description="OpenWeatherMap integration coming in Phase 3"
        />
        <PlaceholderCard
          title="CHF/EUR"
          description="Currency dashboard coming in Phase 9"
        />
      </div>
    </div>
  );
}

function PlaceholderCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-default bg-bg-secondary/50 p-8 text-center">
      <p className="text-sm font-medium text-text-secondary">{title}</p>
      <p className="mt-1 text-xs text-text-muted">{description}</p>
    </div>
  );
}
