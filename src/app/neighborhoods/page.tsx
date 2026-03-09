"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { MapPin, BarChart3, TrendingUp, GitCompareArrows, X, Building2, Waves } from "lucide-react";
import { usePriorityStore } from "@/lib/stores/priority-store";
import { useCompareStore } from "@/lib/stores/compare-store";
import { NEIGHBORHOODS, LAKE_TOWNS, ALL_LOCATIONS } from "@/lib/data/neighborhoods";
import { rankNeighborhoods, formatScore } from "@/lib/engines/scoring";
import { PrioritySliders } from "@/components/neighborhoods/priority-sliders";
import { NeighborhoodCard } from "@/components/neighborhoods/neighborhood-card";
import { DataFreshness } from "@/components/ui/data-freshness";
import { formatCHF } from "@/lib/utils";

type LocationFilter = "all" | "zurich" | "lake";

export default function NeighborhoodsPage() {
  const weights = usePriorityStore((s) => s.weights);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [locationFilter, setLocationFilter] = useState<LocationFilter>("all");
  const { selectedIds, clear: clearCompare } = useCompareStore();

  const sourceData = useMemo(() => {
    if (locationFilter === "zurich") return NEIGHBORHOODS;
    if (locationFilter === "lake") return LAKE_TOWNS;
    return ALL_LOCATIONS;
  }, [locationFilter]);

  const ranked = useMemo(
    () => rankNeighborhoods(sourceData, weights),
    [sourceData, weights]
  );

  // J/K keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const el = document.activeElement;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT")) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "j") {
        e.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, ranked.length - 1));
      } else if (e.key === "k") {
        e.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && focusedIndex >= 0) {
        e.preventDefault();
        const n = ranked[focusedIndex];
        if (n) setExpandedId((prev) => (prev === n.id ? null : n.id));
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [ranked, focusedIndex]);

  // Scroll focused card into view
  useEffect(() => {
    if (focusedIndex >= 0) {
      const el = document.getElementById(`nb-card-${ranked[focusedIndex]?.id}`);
      el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [focusedIndex, ranked]);

  const top = ranked[0];
  const avgScore =
    ranked.reduce((sum, n) => sum + n.weightedScore, 0) / ranked.length;
  const cheapest = [...ranked].sort(
    (a, b) => a.rentOneBrMin - b.rentOneBrMin
  )[0];

  const filterTabs: { key: LocationFilter; label: string; icon: React.ReactNode; count: number }[] = [
    { key: "all", label: "All", icon: <MapPin className="h-3.5 w-3.5" />, count: ALL_LOCATIONS.length },
    { key: "zurich", label: "Zurich", icon: <Building2 className="h-3.5 w-3.5" />, count: NEIGHBORHOODS.length },
    { key: "lake", label: "Lake Towns", icon: <Waves className="h-3.5 w-3.5" />, count: LAKE_TOWNS.length },
  ];

  return (
    <div className="flex gap-6 h-full relative">
      {/* Ambient glow */}
      <div className="ambient-glow glow-blue" />
      {/* Left sidebar — Priority Controls */}
      <div className="w-64 shrink-0 hidden lg:block">
        <div className="sticky top-0 space-y-5">
          <div className="card elevation-1 p-4">
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
              {ranked.length} locations ranked by your priorities.
              Adjust weights to re-rank in real time.
            </p>
            <div className="mt-1">
              <DataFreshness />
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-text-muted">
            <kbd>J</kbd><kbd>K</kbd> navigate · <kbd>Enter</kbd> expand
          </div>
        </div>

        {/* Location filter tabs */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-bg-secondary/50 border border-border-subtle w-fit">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setLocationFilter(tab.key);
                setExpandedId(null);
                setFocusedIndex(-1);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                locationFilter === tab.key
                  ? "bg-accent-primary/15 text-accent-primary"
                  : "text-text-muted hover:text-text-secondary hover:bg-bg-tertiary"
              }`}
            >
              {tab.icon}
              {tab.label}
              <span className="text-[10px] opacity-60">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Mobile sliders toggle */}
        <div className="lg:hidden rounded-xl border border-border-default bg-bg-secondary p-4">
          <PrioritySliders />
        </div>

        {/* Ranking list */}
        <LayoutGroup>
          <AnimatePresence mode="popLayout">
            <div className="space-y-3">
              {ranked.map((n, i) => (
                <NeighborhoodCard
                  key={n.id}
                  neighborhood={n}
                  isExpanded={expandedId === n.id}
                  isFocused={i === focusedIndex}
                  onToggle={() =>
                    setExpandedId((prev) => (prev === n.id ? null : n.id))
                  }
                />
              ))}
            </div>
          </AnimatePresence>
        </LayoutGroup>

        {/* Floating compare bar */}
        <AnimatePresence>
          {selectedIds.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-xl border border-accent-primary/30 bg-bg-primary/95 backdrop-blur-xl px-5 py-3 shadow-2xl"
            >
              <GitCompareArrows className="h-4 w-4 text-accent-primary shrink-0" />
              <span className="text-sm text-text-secondary">
                {selectedIds.length} selected
              </span>
              <div className="flex items-center gap-1.5">
                {selectedIds.map((id) => {
                  const nb = ALL_LOCATIONS.find((x) => x.id === id);
                  return nb ? (
                    <span
                      key={id}
                      className="text-xs px-2 py-0.5 rounded bg-accent-primary/10 text-accent-primary font-medium"
                    >
                      {nb.name}
                    </span>
                  ) : null;
                })}
              </div>
              <Link
                href={`/neighborhoods/compare?ids=${selectedIds.join(",")}`}
                className="ml-2 rounded-lg bg-accent-primary px-4 py-1.5 text-sm font-semibold text-white hover:bg-accent-primary/90 transition-colors"
              >
                Compare
              </Link>
              <button
                onClick={clearCompare}
                className="ml-1 text-text-muted hover:text-text-primary transition-colors"
                title="Clear selection"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
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
