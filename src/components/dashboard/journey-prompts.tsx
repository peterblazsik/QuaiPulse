"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Wallet,
  Building2,
  CheckSquare,
  Lightbulb,
  TrendingUp,
} from "lucide-react";
import { usePriorityStore } from "@/lib/stores/priority-store";
import { useChecklistStore } from "@/lib/stores/checklist-store";
import { useApartmentStore } from "@/lib/stores/apartment-store";
import { useBudgetStore } from "@/lib/stores/budget-store";
import { useBudgetWithTax } from "@/lib/hooks/use-budget-with-tax";
import { NEIGHBORHOODS } from "@/lib/data/neighborhoods";
import { CHECKLIST_ITEMS } from "@/lib/data/checklist-items";
import { rankNeighborhoods, formatScore } from "@/lib/engines/scoring";
import { formatCHF } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface Prompt {
  icon: LucideIcon;
  color: string;
  message: string;
  cta: string;
  href: string;
  priority: number; // lower = show first
}

export function JourneyPrompts() {
  const weights = usePriorityStore((s) => s.weights);
  const completedIds = useChecklistStore((s) => s.completedIds);
  const apartments = useApartmentStore((s) => s.apartments);
  const grossMonthlySalary = useBudgetStore((s) => s.grossMonthlySalary);
  const rent = useBudgetStore((s) => s.values.rent);
  const budget = useBudgetWithTax();

  const prompts = useMemo(() => {
    const result: Prompt[] = [];
    const ranked = rankNeighborhoods(NEIGHBORHOODS, weights);
    const top = ranked[0];

    // Check if priorities are all defaults (untouched)
    const allDefault = Object.values(weights).every(
      (w) => w === 5 || w === 0
    );

    // 1. Neighborhood priorities not set
    if (allDefault) {
      result.push({
        icon: MapPin,
        color: "text-blue-400",
        message: "Start here: Set your neighborhood priorities to discover which Zurich Kreis fits your lifestyle.",
        cta: "Set Priorities",
        href: "/neighborhoods",
        priority: 1,
      });
    }

    // 2. Budget still at defaults
    if (grossMonthlySalary === 15000 && rent === 2400) {
      result.push({
        icon: Wallet,
        color: "text-emerald-400",
        message: "Enter your actual salary and target rent to see your real Swiss take-home pay.",
        cta: "Configure Budget",
        href: "/budget",
        priority: 2,
      });
    }

    // 3. No apartments saved yet
    if (apartments.length === 0) {
      const topName = top?.name ?? "your top neighborhood";
      result.push({
        icon: Building2,
        color: "text-purple-400",
        message: `No apartments saved yet. Start browsing the live feed — ${topName} (Kreis ${top?.kreis ?? "?"}) is your #1 match.`,
        cta: top?.kreis ? `Browse Kreis ${top.kreis}` : "Browse Apartments",
        href: top?.kreis ? `/apartments?kreis=${top.kreis}` : "/apartments",
        priority: 3,
      });
    }

    // 4. Checklist progress < 10%
    const checklistPct = CHECKLIST_ITEMS.length > 0
      ? (completedIds.length / CHECKLIST_ITEMS.length) * 100
      : 0;
    if (checklistPct < 10) {
      result.push({
        icon: CheckSquare,
        color: "text-amber-400",
        message: `Only ${completedIds.length}/${CHECKLIST_ITEMS.length} checklist items done. Review your current phase tasks.`,
        cta: "Open Checklist",
        href: "/checklist",
        priority: 4,
      });
    }

    // 5. Contextual: top neighborhood changed (if priorities ARE set)
    if (!allDefault && top) {
      result.push({
        icon: TrendingUp,
        color: "text-cyan-400",
        message: `Based on your priorities, ${top.name} (${formatScore(top.weightedScore)}) is your best match. Median rent: ${formatCHF(top.rentOneBrMin)}-${formatCHF(top.rentOneBrMax)}.`,
        cta: `Explore ${top.name}`,
        href: `/neighborhoods/${top.slug}`,
        priority: 5,
      });
    }

    // 6. Budget surplus insight (if budget is configured)
    if (grossMonthlySalary !== 15000 && budget.surplus !== 0) {
      const msg = budget.surplus > 0
        ? `You're saving ${formatCHF(budget.surplus)}/mo (${Math.round(budget.savingsRate)}%). Consider maximizing Pillar 3a for tax savings.`
        : `Your expenses exceed income by ${formatCHF(Math.abs(budget.surplus))}/mo. Adjust rent or expenses.`;
      result.push({
        icon: Lightbulb,
        color: budget.surplus > 0 ? "text-success" : "text-danger",
        message: msg,
        cta: "Adjust Budget",
        href: "/budget",
        priority: 6,
      });
    }

    return result.sort((a, b) => a.priority - b.priority).slice(0, 3);
  }, [weights, completedIds, apartments, grossMonthlySalary, rent, budget]);

  if (prompts.length === 0) return null;

  return (
    <div className="space-y-2">
      {prompts.map((prompt, i) => (
        <Link
          key={i}
          href={prompt.href}
          className="group flex items-center gap-3 rounded-lg border border-border-default bg-bg-secondary/50 p-3 hover:border-accent-primary/30 hover:bg-bg-secondary transition-colors"
        >
          <prompt.icon className={`h-4 w-4 ${prompt.color} shrink-0`} />
          <p className="text-xs text-text-secondary flex-1">
            {prompt.message}
          </p>
          <span className="flex items-center gap-1 text-[10px] font-semibold text-accent-primary whitespace-nowrap shrink-0 group-hover:gap-1.5 transition-all">
            {prompt.cta}
            <ArrowRight className="h-3 w-3" />
          </span>
        </Link>
      ))}
    </div>
  );
}
