"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import { MapPin, BarChart3, TrendingUp } from "lucide-react";
import { usePriorityStore } from "@/lib/stores/priority-store";
import { NEIGHBORHOODS } from "@/lib/data/neighborhoods";
import { rankNeighborhoods, formatScore } from "@/lib/engines/scoring";
import { PrioritySliders } from "@/components/neighborhoods/priority-sliders";
import { NeighborhoodCard } from "@/components/neighborhoods/neighborhood-card";
import { formatCHF } from "@/lib/utils";

export default function NeighborhoodsPage() {
  const weights = usePriorityStore((s) => s.weights);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const ranked = useMemo(
    () => rankNeighborhoods(NEIGHBORHOODS, weights),
    [weights]
  );

  const top = ranked[0];
  const avgScore =
    ranked.reduce((sum, n) => sum + n.weightedScore, 0) / ranked.length;
  const cheapest = [...ranked].sort(
    (a, b) => a.rentOneBrMin - b.rentOneBrMin
  )[0];

  return (
    <div className="flex gap-6 h-full">
      {/* Left sidebar — Priority Controls */}
      <div className="w-64 shrink-0 hidden lg:block">
        <div className="sticky top-0 space-y-5">
          <div className="rounded-xl border border-border-default bg-bg-secondary p-4">
            <PrioritySliders />
          </div>

          {/* Quick stats */}
          <div className="rounded-xl border border-border-default bg-bg-secondary p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Quick Stats
            </h3>
            <StatRow
              icon={<TrendingUp className="h-3.5 w-3.5 text-success" />}
              label="Top Pick"
              value={`${top.name} (${formatScore(top.weightedScore)})`}
            />
            <StatRow
              icon={<BarChart3 className="h-3.5 w-3.5 text-accent-primary" />}
              label="Avg Score"
              value={formatScore(avgScore)}
            />
            <StatRow
              icon={<MapPin className="h-3.5 w-3.5 text-info" />}
              label="Best Value"
              value={`${cheapest.name} (${formatCHF(cheapest.rentOneBrMin)})`}
            />
          </div>
        </div>
      </div>

      {/* Main content — Rankings */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-text-primary">
              Neighborhood Intelligence
            </h1>
            <p className="text-sm text-text-tertiary mt-1">
              {ranked.length} neighborhoods ranked by your priorities.
              Adjust weights to re-rank in real time.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-text-muted">
            <kbd>J</kbd><kbd>K</kbd> navigate
          </div>
        </div>

        {/* Mobile sliders toggle */}
        <div className="lg:hidden rounded-xl border border-border-default bg-bg-secondary p-4">
          <PrioritySliders />
        </div>

        {/* Ranking list */}
        <LayoutGroup>
          <AnimatePresence mode="popLayout">
            <div className="space-y-3">
              {ranked.map((n) => (
                <NeighborhoodCard
                  key={n.id}
                  neighborhood={n}
                  isExpanded={expandedId === n.id}
                  onToggle={() =>
                    setExpandedId((prev) => (prev === n.id ? null : n.id))
                  }
                />
              ))}
            </div>
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </div>
  );
}

function StatRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-[10px] uppercase tracking-wider text-text-muted w-16">
        {label}
      </span>
      <span className="font-data text-xs text-text-primary truncate">
        {value}
      </span>
    </div>
  );
}
