"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useChecklistStore } from "@/lib/stores/checklist-store";
import { useApartmentStore } from "@/lib/stores/apartment-store";
import { useBudgetWithTax } from "@/lib/hooks/use-budget-with-tax";
import { CHECKLIST_ITEMS } from "@/lib/data/checklist-items";
import { getCriticalPath } from "@/lib/engines/checklist-engine";

interface Dimension {
  label: string;
  score: number; // 0-100
  color: string;
  href: string;
}

function ScoreRing({
  score,
  size = 160,
  strokeWidth = 10,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const center = size / 2;

  // Color based on score
  const color =
    score >= 75
      ? "#22c55e"
      : score >= 50
        ? "#f59e0b"
        : score >= 25
          ? "#f97316"
          : "#ef4444";

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background track */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="var(--bg-tertiary)"
        strokeWidth={strokeWidth}
      />
      {/* Score arc */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-1000 ease-out"
      />
      {/* Glow effect */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        opacity={0.3}
        filter="blur(4px)"
      />
    </svg>
  );
}

function DimensionBar({
  dimension,
}: {
  dimension: Dimension;
}) {
  return (
    <Link
      href={dimension.href}
      className="group flex items-center gap-3 py-1.5 hover:bg-bg-tertiary/50 rounded px-2 -mx-2 transition-colors"
    >
      <span className="text-xs text-text-secondary w-24 shrink-0 group-hover:text-text-primary transition-colors">
        {dimension.label}
      </span>
      <div className="flex-1 h-2 rounded-full bg-bg-tertiary overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${dimension.score}%`,
            backgroundColor: dimension.color,
          }}
        />
      </div>
      <span
        className="font-data text-xs font-bold w-8 text-right"
        style={{ color: dimension.color }}
      >
        {Math.round(dimension.score)}
      </span>
    </Link>
  );
}

export function MoveReadinessRing() {
  const completedIds = useChecklistStore((s) => s.completedIds);
  const apartments = useApartmentStore((s) => s.apartments);
  const budget = useBudgetWithTax();

  const dimensions = useMemo(() => {
    const completedSet = new Set(completedIds);

    // 1. Checklist progress (0-100)
    const checklistScore = CHECKLIST_ITEMS.length > 0
      ? (completedIds.length / CHECKLIST_ITEMS.length) * 100
      : 0;

    // 2. Critical path (harder: only deadline items + their deps)
    const criticalItems = getCriticalPath(CHECKLIST_ITEMS);
    const criticalCompleted = criticalItems.filter((i) =>
      completedSet.has(i.id)
    ).length;
    const criticalScore = criticalItems.length > 0
      ? (criticalCompleted / criticalItems.length) * 100
      : 0;

    // 3. Budget health (surplus > 0 = healthy)
    const budgetScore = budget.surplus >= 0
      ? Math.min(100, 50 + (budget.savingsRate / 2)) // 50 base + up to 50 for savings
      : Math.max(0, 50 + (budget.surplus / 50)); // degrades below 0

    // 4. Apartment search progress
    const activeApts = apartments.filter(
      (a) => a.status !== "rejected"
    );
    const advancedApts = apartments.filter((a) =>
      ["contacted", "viewing_scheduled", "applied", "accepted"].includes(
        a.status
      )
    );
    const aptScore =
      apartments.length === 0
        ? 0
        : advancedApts.length > 0
          ? Math.min(100, 30 + activeApts.length * 10 + advancedApts.length * 15)
          : Math.min(50, activeApts.length * 15);

    // 5. Financial readiness (budget configured properly)
    const finFields = [
      budget.totalMonthlyIncome > 0,
      budget.totalExpenses > 0,
      budget.surplus !== budget.totalMonthlyIncome, // means expenses set
      budget.totalSocialMonthly > 0, // social deductions configured
    ];
    const finScore = (finFields.filter(Boolean).length / finFields.length) * 100;

    const dims: Dimension[] = [
      {
        label: "Checklist",
        score: checklistScore,
        color: checklistScore >= 50 ? "#22c55e" : checklistScore >= 25 ? "#f59e0b" : "#ef4444",
        href: "/checklist",
      },
      {
        label: "Critical Path",
        score: criticalScore,
        color: criticalScore >= 50 ? "#22c55e" : criticalScore >= 25 ? "#f59e0b" : "#ef4444",
        href: "/checklist",
      },
      {
        label: "Budget Health",
        score: budgetScore,
        color: budgetScore >= 60 ? "#22c55e" : budgetScore >= 40 ? "#f59e0b" : "#ef4444",
        href: "/budget",
      },
      {
        label: "Apartment",
        score: aptScore,
        color: aptScore >= 50 ? "#22c55e" : aptScore >= 25 ? "#f59e0b" : "#ef4444",
        href: "/apartments",
      },
      {
        label: "Finance Setup",
        score: finScore,
        color: finScore >= 75 ? "#22c55e" : finScore >= 50 ? "#f59e0b" : "#ef4444",
        href: "/budget",
      },
    ];

    return dims;
  }, [completedIds, apartments, budget]);

  const overallScore = useMemo(() => {
    // Weighted average: checklist 30%, critical 25%, budget 20%, apartment 15%, finance 10%
    const weights = [0.3, 0.25, 0.2, 0.15, 0.1];
    return dimensions.reduce((sum, d, i) => sum + d.score * weights[i], 0);
  }, [dimensions]);

  const scoreLabel =
    overallScore >= 80
      ? "Ready"
      : overallScore >= 60
        ? "On Track"
        : overallScore >= 40
          ? "In Progress"
          : overallScore >= 20
            ? "Getting Started"
            : "Just Beginning";

  return (
    <div className="card elevation-1 p-6 relative overflow-hidden">
      <div className="card-hover-line" />
      <p className="section-label mb-4">Move Readiness</p>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Ring */}
        <div className="relative shrink-0">
          <ScoreRing score={overallScore} size={160} strokeWidth={12} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-data text-3xl font-bold text-text-primary">
              {Math.round(overallScore)}
            </span>
            <span className="text-[10px] text-text-muted uppercase tracking-wider">
              {scoreLabel}
            </span>
          </div>
        </div>

        {/* Dimension bars */}
        <div className="flex-1 w-full space-y-1">
          {dimensions.map((d) => (
            <DimensionBar key={d.label} dimension={d} />
          ))}
        </div>
      </div>
    </div>
  );
}
