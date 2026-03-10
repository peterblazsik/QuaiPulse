"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Pill,
  Clock,
  Beaker,
  Zap,
  Brain,
  Wind,
  Thermometer,
  Sun,
  Moon,
  Eye,
  Activity,
  Heart,
  ChevronDown,
  ChevronUp,
  Filter,
  Info,
  ArrowLeft,
  Shield,
  Layers,
  Timer,
  Dumbbell,
  Monitor,
  BookOpen,
  Utensils,
} from "lucide-react";
import {
  SUPPLEMENTS,
  SUPPLEMENT_STACKS,
  INTERVENTIONS,
  EVENING_ROUTINE,
  type SupplementTier,
  type InterventionCategory,
} from "@/lib/data/sleep-defaults";
import {
  TIER_CONFIG,
  EVIDENCE_CONFIG,
  CATEGORY_LABELS,
  INTERVENTION_CATEGORY_LABELS,
  STACK_LEVEL_CONFIG,
} from "@/components/sleep/protocol-constants";

/* ──────────────────── Helpers ──────────────────── */

function getInterventionIcon(cat: InterventionCategory) {
  switch (cat) {
    case "exercise": return Dumbbell;
    case "breathing": return Wind;
    case "meditation": return Brain;
    case "environment": return Thermometer;
    case "nutrition": return Utensils;
    case "technology": return Monitor;
    case "cbt-i": return BookOpen;
    default: return Info;
  }
}

/* ──────────────────── Page ──────────────────── */

export default function SleepProtocolPage() {
  // Supplement filters
  const [tierFilter, setTierFilter] = useState<SupplementTier | "all">("all");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [expandedSupps, setExpandedSupps] = useState<Set<string>>(new Set());

  // Intervention filters
  const [intCatFilter, setIntCatFilter] = useState<InterventionCategory | "all">("all");
  const [expandedInts, setExpandedInts] = useState<Set<string>>(new Set());

  // Filtered supplements
  const filteredSupplements = useMemo(() => {
    return SUPPLEMENTS.filter((s) => {
      if (tierFilter !== "all" && s.tier !== tierFilter) return false;
      if (catFilter !== "all" && s.category !== catFilter) return false;
      return true;
    });
  }, [tierFilter, catFilter]);

  // Filtered interventions
  const filteredInterventions = useMemo(() => {
    if (intCatFilter === "all") return INTERVENTIONS;
    return INTERVENTIONS.filter((i) => i.category === intCatFilter);
  }, [intCatFilter]);

  // Unique categories from supplements
  const supplementCategories = useMemo(() => {
    const cats = new Set(SUPPLEMENTS.map((s) => s.category));
    return Array.from(cats);
  }, []);

  // Unique intervention categories
  const interventionCategories = useMemo(() => {
    const cats = new Set(INTERVENTIONS.map((i) => i.category));
    return Array.from(cats) as InterventionCategory[];
  }, []);

  function toggleSuppExpand(id: string) {
    setExpandedSupps((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleIntExpand(id: string) {
    setExpandedInts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-8 relative max-w-6xl">
      {/* Ambient glow */}
      <div className="ambient-glow glow-purple" />

      {/* Back nav */}
      <Link
        href="/sleep"
        className="inline-flex items-center gap-2 text-sm text-text-tertiary hover:text-accent-primary transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Sleep Intelligence
      </Link>

      {/* ────────────────── HERO ────────────────── */}
      <div className="card elevation-1 p-8 relative overflow-hidden">
        <div className="card-hover-line" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-text-primary">
              Sleep Optimization Protocol
            </h1>
            <p className="text-sm text-text-tertiary mt-2 max-w-2xl leading-relaxed">
              Evidence-based protocol combining supplements, behavioral interventions, and environmental
              optimization. Built from peer-reviewed research, Huberman Lab protocols, and CBT-I clinical
              guidelines. Every recommendation includes mechanism of action and citation.
            </p>
          </div>
          <div className="shrink-0 hidden md:flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <span className="font-data text-3xl font-bold text-accent-primary">
                {SUPPLEMENTS.length}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-text-muted">Supplements</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-data text-3xl font-bold text-accent-primary">
                {INTERVENTIONS.length}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-text-muted">Interventions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-data text-3xl font-bold text-accent-primary">
                {SUPPLEMENT_STACKS.length}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-text-muted">Stacks</span>
            </div>
          </div>
        </div>

        {/* Quick stats row for mobile */}
        <div className="flex md:hidden gap-4 mt-4">
          {[
            { n: SUPPLEMENTS.length, l: "Supplements" },
            { n: INTERVENTIONS.length, l: "Interventions" },
            { n: SUPPLEMENT_STACKS.length, l: "Stacks" },
          ].map((s) => (
            <div key={s.l} className="flex items-center gap-1.5">
              <span className="font-data text-lg font-bold text-accent-primary">{s.n}</span>
              <span className="text-[10px] uppercase tracking-wider text-text-muted">{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ────────────────── SUPPLEMENT DATABASE ────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Pill className="h-4 w-4 text-text-muted" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Supplement Database
          </h2>
          <span className="text-[10px] text-text-muted ml-auto font-data">
            {filteredSupplements.length} / {SUPPLEMENTS.length}
          </span>
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-1 mr-2">
            <Filter className="h-3 w-3 text-text-muted" />
            <span className="text-[10px] uppercase tracking-wider text-text-muted">Tier:</span>
          </div>
          {(["all", 1, 2, 3] as const).map((t) => {
            const active = tierFilter === t;
            const cfg = t === "all" ? null : TIER_CONFIG[t];
            return (
              <button
                key={String(t)}
                onClick={() => setTierFilter(t)}
                className="text-[10px] px-3 py-1.5 rounded-full font-semibold transition-all uppercase tracking-wider"
                style={{
                  backgroundColor: active
                    ? cfg?.bg ?? "rgba(59,130,246,0.15)"
                    : "var(--bg-tertiary)",
                  color: active
                    ? cfg?.color ?? "#3b82f6"
                    : "var(--text-muted)",
                  border: `1px solid ${
                    active
                      ? cfg?.border ?? "rgba(59,130,246,0.30)"
                      : "var(--border-default)"
                  }`,
                }}
              >
                {t === "all" ? "All Tiers" : `Tier ${t}`}
              </button>
            );
          })}

          <div className="w-px h-6 bg-border-default mx-1 self-center" />

          <div className="flex items-center gap-1 mr-2">
            <Beaker className="h-3 w-3 text-text-muted" />
            <span className="text-[10px] uppercase tracking-wider text-text-muted">Category:</span>
          </div>
          <button
            onClick={() => setCatFilter("all")}
            className="text-[10px] px-3 py-1.5 rounded-full font-semibold transition-all uppercase tracking-wider"
            style={{
              backgroundColor: catFilter === "all" ? "rgba(59,130,246,0.15)" : "var(--bg-tertiary)",
              color: catFilter === "all" ? "#3b82f6" : "var(--text-muted)",
              border: `1px solid ${catFilter === "all" ? "rgba(59,130,246,0.30)" : "var(--border-default)"}`,
            }}
          >
            All
          </button>
          {supplementCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className="text-[10px] px-3 py-1.5 rounded-full font-semibold transition-all uppercase tracking-wider"
              style={{
                backgroundColor: catFilter === cat ? "rgba(59,130,246,0.15)" : "var(--bg-tertiary)",
                color: catFilter === cat ? "#3b82f6" : "var(--text-muted)",
                border: `1px solid ${catFilter === cat ? "rgba(59,130,246,0.30)" : "var(--border-default)"}`,
              }}
            >
              {CATEGORY_LABELS[cat] ?? cat}
            </button>
          ))}
        </div>

        {/* Supplement cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filteredSupplements.map((sup) => {
            const expanded = expandedSupps.has(sup.id);
            const tierCfg = TIER_CONFIG[sup.tier];

            return (
              <div
                key={sup.id}
                className="card elevation-1 p-4 relative overflow-hidden transition-all hover:border-border-default/80 cursor-pointer"
                onClick={() => toggleSuppExpand(sup.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleSuppExpand(sup.id); } }}
                aria-expanded={expanded}
              >
                {/* Top color line */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ backgroundColor: sup.color }}
                />

                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: tierCfg.bg,
                          color: tierCfg.color,
                          border: `1px solid ${tierCfg.border}`,
                        }}
                      >
                        {tierCfg.label}
                      </span>
                      <span className="text-xs uppercase tracking-wider text-text-muted">
                        {CATEGORY_LABELS[sup.category] ?? sup.category}
                      </span>
                      {sup.cycleRequired && (
                        <span className="text-xs uppercase tracking-wider text-warning/80 flex items-center gap-0.5">
                          <Timer className="h-2.5 w-2.5" />
                          Cycle
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-text-primary truncate">{sup.name}</h3>
                  </div>
                  <div className="shrink-0 text-text-muted">
                    {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>

                {/* Key info row */}
                <div className="flex items-center gap-3 mt-2.5">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-text-muted">Dose</p>
                    <p className="font-data text-xs text-text-primary">
                      {sup.doseLow}{sup.doseLow !== sup.doseHigh ? ` - ${sup.doseHigh}` : ""}
                    </p>
                  </div>
                  <div className="w-px h-6 bg-border-default" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-text-muted">Form</p>
                    <p className="text-xs text-text-secondary truncate max-w-[120px]">{sup.form}</p>
                  </div>
                  <div className="w-px h-6 bg-border-default" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wider text-text-muted">Timing</p>
                    <p className="text-xs text-text-secondary truncate">{sup.timing}</p>
                  </div>
                </div>

                {/* Expanded details */}
                {expanded && (
                  <div className="mt-4 pt-3 border-t border-border-default space-y-3">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-text-muted mb-1 flex items-center gap-1">
                        <Brain className="h-2.5 w-2.5" /> Mechanism
                      </p>
                      <p className="text-xs text-text-secondary leading-relaxed">{sup.mechanism}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-text-muted mb-1 flex items-center gap-1">
                        <BookOpen className="h-2.5 w-2.5" /> Evidence
                      </p>
                      <p className="text-xs text-text-secondary leading-relaxed italic">{sup.evidence}</p>
                    </div>
                    {sup.interactions.length > 0 && (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-text-muted mb-1 flex items-center gap-1">
                          <Shield className="h-2.5 w-2.5" /> Interactions
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {sup.interactions.map((inter) => (
                            <span
                              key={inter}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20"
                            >
                              {inter}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {sup.cycleRequired && sup.cyclePattern && (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-text-muted mb-1 flex items-center gap-1">
                          <Timer className="h-2.5 w-2.5" /> Cycle Pattern
                        </p>
                        <p className="text-xs text-warning">{sup.cyclePattern}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredSupplements.length === 0 && (
          <div className="card elevation-1 p-8 text-center">
            <p className="text-sm text-text-muted">No supplements match the selected filters.</p>
          </div>
        )}
      </section>

      {/* ────────────────── STACKING PROTOCOLS ────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Layers className="h-4 w-4 text-text-muted" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Stacking Protocols
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SUPPLEMENT_STACKS.map((stack) => {
            const cfg = STACK_LEVEL_CONFIG[stack.level];
            return (
              <div
                key={stack.id}
                className="card elevation-1 p-5 relative overflow-hidden"
                style={{ borderTop: `2px solid ${cfg.color}` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: cfg.bg,
                          color: cfg.color,
                          border: `1px solid ${cfg.border}`,
                        }}
                      >
                        {cfg.label}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-text-primary">{stack.name}</h3>
                  </div>
                  {stack.monthlyCostCHF > 0 && (
                    <div className="text-right shrink-0">
                      <p className="text-xs uppercase tracking-wider text-text-muted">Monthly</p>
                      <p className="font-data text-lg font-bold text-text-primary">
                        CHF {stack.monthlyCostCHF}
                      </p>
                    </div>
                  )}
                  {stack.monthlyCostCHF === 0 && (
                    <div className="text-right shrink-0">
                      <p className="text-xs uppercase tracking-wider text-text-muted">Cost</p>
                      <p className="font-data text-xs text-text-tertiary">As needed</p>
                    </div>
                  )}
                </div>

                <p className="text-xs text-text-tertiary leading-relaxed mb-4">
                  {stack.description}
                </p>

                {/* Timeline visualization */}
                <div className="space-y-0">
                  {stack.supplements.map((item, idx) => {
                    const sup = SUPPLEMENTS.find((s) => s.id === item.supplementId);
                    if (!sup) return null;

                    return (
                      <div key={`${item.supplementId}-${idx}`} className="flex items-center gap-3 group">
                        {/* Timeline dot + line */}
                        <div className="flex flex-col items-center w-3 shrink-0">
                          <div
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: sup.color }}
                          />
                          {idx < stack.supplements.length - 1 && (
                            <div className="w-px h-6 bg-border-default" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex items-center justify-between flex-1 min-w-0 py-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs text-text-primary font-medium truncate">
                              {sup.name}
                            </span>
                            <span className="font-data text-[10px] text-text-muted shrink-0">
                              {item.dose}
                            </span>
                          </div>
                          <span className="text-[10px] text-text-muted shrink-0 ml-2 font-data">
                            {item.timing}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ────────────────── INTERVENTION LIBRARY ────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-4 w-4 text-text-muted" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Intervention Library
          </h2>
          <span className="text-[10px] text-text-muted ml-auto font-data">
            {filteredInterventions.length} / {INTERVENTIONS.length}
          </span>
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-1 mr-2">
            <Filter className="h-3 w-3 text-text-muted" />
            <span className="text-[10px] uppercase tracking-wider text-text-muted">Category:</span>
          </div>
          <button
            onClick={() => setIntCatFilter("all")}
            className="text-[10px] px-3 py-1.5 rounded-full font-semibold transition-all uppercase tracking-wider"
            style={{
              backgroundColor: intCatFilter === "all" ? "rgba(59,130,246,0.15)" : "var(--bg-tertiary)",
              color: intCatFilter === "all" ? "#3b82f6" : "var(--text-muted)",
              border: `1px solid ${intCatFilter === "all" ? "rgba(59,130,246,0.30)" : "var(--border-default)"}`,
            }}
          >
            All
          </button>
          {interventionCategories.map((cat) => {
            const cfg = INTERVENTION_CATEGORY_LABELS[cat];
            return (
              <button
                key={cat}
                onClick={() => setIntCatFilter(cat)}
                className="text-[10px] px-3 py-1.5 rounded-full font-semibold transition-all uppercase tracking-wider"
                style={{
                  backgroundColor: intCatFilter === cat ? "rgba(59,130,246,0.15)" : "var(--bg-tertiary)",
                  color: intCatFilter === cat ? "#3b82f6" : "var(--text-muted)",
                  border: `1px solid ${intCatFilter === cat ? "rgba(59,130,246,0.30)" : "var(--border-default)"}`,
                }}
              >
                {cfg.label}
              </button>
            );
          })}
        </div>

        {/* Intervention cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredInterventions.map((int) => {
            const expanded = expandedInts.has(int.id);
            const evCfg = EVIDENCE_CONFIG[int.evidenceLevel];
            const IconComponent = getInterventionIcon(int.category);
            const catLabel = INTERVENTION_CATEGORY_LABELS[int.category]?.label ?? int.category;

            return (
              <div
                key={int.id}
                className="card elevation-1 p-4 relative overflow-hidden transition-all hover:border-border-default/80 cursor-pointer"
                onClick={() => toggleIntExpand(int.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleIntExpand(int.id); } }}
                aria-expanded={expanded}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <IconComponent className="h-3.5 w-3.5 text-text-muted shrink-0" />
                      <span className="text-xs uppercase tracking-wider text-text-muted">{catLabel}</span>
                      <span
                        className="text-xs font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: evCfg.bg,
                          color: evCfg.color,
                        }}
                      >
                        {int.evidenceLevel}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-text-primary">{int.name}</h3>
                  </div>
                  <div className="shrink-0 text-text-muted">
                    {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>

                {/* Brief info */}
                <div className="flex items-center gap-3 mt-2">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-text-muted">Timing</p>
                    <p className="text-xs text-text-secondary">{int.timing}</p>
                  </div>
                  <div className="w-px h-5 bg-border-default" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-text-muted">Duration</p>
                    <p className="text-xs text-text-secondary">{int.duration}</p>
                  </div>
                </div>

                <p className="text-xs text-text-tertiary leading-relaxed mt-2.5">
                  {int.description}
                </p>

                {/* Expanded details */}
                {expanded && (
                  <div className="mt-3 pt-3 border-t border-border-default space-y-3">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-text-muted mb-1 flex items-center gap-1">
                        <Activity className="h-2.5 w-2.5" /> Protocol
                      </p>
                      <p className="text-xs text-text-secondary leading-relaxed">{int.protocol}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-text-muted mb-1 flex items-center gap-1">
                        <BookOpen className="h-2.5 w-2.5" /> Key Study
                      </p>
                      <p className="text-xs text-text-secondary leading-relaxed italic">{int.keyStudy}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredInterventions.length === 0 && (
          <div className="card elevation-1 p-8 text-center">
            <p className="text-sm text-text-muted">No interventions match the selected filter.</p>
          </div>
        )}
      </section>

      {/* ────────────────── EVENING ROUTINE TIMELINE ────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Moon className="h-4 w-4 text-text-muted" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Evening Routine Timeline
          </h2>
        </div>

        <div className="card elevation-1 p-6 relative overflow-hidden">
          <p className="text-xs text-text-tertiary mb-6 leading-relaxed">
            Optimal pre-sleep routine mapped from 3 hours before bed to lights out. Times are relative to
            your target bedtime (T-0). Adjust all times based on your schedule.
          </p>

          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[39px] top-0 bottom-0 w-px bg-gradient-to-b from-accent-primary/50 via-purple-500/30 to-transparent" />

            <div className="space-y-0">
              {EVENING_ROUTINE.map((step, idx) => {
                const linkedSupps = step.supplementIds
                  ? step.supplementIds.map((id) => SUPPLEMENTS.find((s) => s.id === id)).filter(Boolean)
                  : [];
                const linkedInt = step.interventionId
                  ? INTERVENTIONS.find((i) => i.id === step.interventionId)
                  : null;

                // Compute the time label
                const timeLabel = step.minutesBefore === 0
                  ? "T-0"
                  : `T-${step.minutesBefore}`;

                // Gradient from blue (T-180) to purple (T-0)
                const progress = 1 - step.minutesBefore / 180;
                const dotColor = `hsl(${240 + progress * 30}, 70%, ${55 + progress * 10}%)`;

                return (
                  <div key={idx} className="flex items-start gap-4 group">
                    {/* Time label */}
                    <div className="w-10 shrink-0 text-right pt-0.5">
                      <span className="font-data text-[11px] font-bold text-text-muted">
                        {timeLabel}
                      </span>
                    </div>

                    {/* Dot */}
                    <div className="relative flex flex-col items-center shrink-0">
                      <div
                        className="w-3 h-3 rounded-full z-10 border-2"
                        style={{
                          backgroundColor: dotColor,
                          borderColor: "var(--bg-primary)",
                        }}
                      />
                    </div>

                    {/* Content card */}
                    <div className="flex-1 pb-6 min-w-0">
                      <div className="rounded-lg bg-bg-secondary/60 border border-border-default/50 p-3 hover:border-border-default transition-colors">
                        <h4 className="text-sm font-semibold text-text-primary mb-1">
                          {step.activity}
                        </h4>

                        {/* Linked supplements */}
                        {linkedSupps.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {linkedSupps.map((sup) =>
                              sup ? (
                                <span
                                  key={sup.id}
                                  className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium"
                                  style={{
                                    backgroundColor: `color-mix(in srgb, ${sup.color} 15%, transparent)`,
                                    color: sup.color,
                                    border: `1px solid color-mix(in srgb, ${sup.color} 30%, transparent)`,
                                  }}
                                >
                                  <Pill className="h-2.5 w-2.5" />
                                  {sup.name}
                                </span>
                              ) : null
                            )}
                          </div>
                        )}

                        {/* Linked intervention */}
                        {linkedInt && (
                          <div className="mt-2">
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
                              <Zap className="h-2.5 w-2.5" />
                              {linkedInt.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom spacer */}
      <div className="pb-8" />
    </div>
  );
}
