"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Circle,
  Clock,
  AlertTriangle,
  List,
  BarChart3,
  Lock,
  ArrowRight,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { DeadlineAlerts } from "@/components/checklist/deadline-alerts";
import { CHECKLIST_ITEMS, type ChecklistItemData } from "@/lib/data/checklist-items";
import { useChecklistStore } from "@/lib/stores/checklist-store";
import {
  getBlockedItems,
  getCriticalPath,
  getPhaseGateStatus,
  getDaysUntilDeadline,
  buildDependencyGraph,
} from "@/lib/engines/checklist-engine";

const PHASES = [
  { key: "mar-apr" as const, label: "Mar-Apr", months: "March - April", color: "#3b82f6" },
  { key: "may" as const, label: "May", months: "May", color: "#f59e0b" },
  { key: "jun" as const, label: "Jun", months: "June", color: "#f97316" },
  { key: "jul" as const, label: "Jul", months: "July", color: "#22c55e" },
];

export default function ChecklistPage() {
  const { completedIds, toggle, viewMode, setViewMode } = useChecklistStore();
  const completed = useMemo(() => new Set(completedIds), [completedIds]);

  const stats = useMemo(() => {
    const total = CHECKLIST_ITEMS.length;
    const done = completed.size;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, pct };
  }, [completed]);

  const phaseStats = useMemo(() => {
    return PHASES.map((phase) => {
      const items = CHECKLIST_ITEMS.filter((i) => i.phase === phase.key);
      const done = items.filter((i) => completed.has(i.id)).length;
      return { ...phase, total: items.length, done };
    });
  }, [completed]);

  const blockedItems = useMemo(() => getBlockedItems(completed), [completed]);
  const criticalPath = useMemo(() => getCriticalPath(), []);
  const criticalIds = useMemo(() => new Set(criticalPath.map((i) => i.id)), [criticalPath]);
  const depGraph = useMemo(() => buildDependencyGraph(), []);

  return (
    <div className="space-y-6 relative">
      {/* Ambient glow */}
      <div className="ambient-glow glow-cyan" />

      {/* Deadline notifications banner */}
      <DeadlineAlerts />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Move Checklist
          </h1>
          <p className="text-sm text-text-tertiary mt-1">
            {stats.total} tasks across 4 phases. March to July. No detail left behind.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          {/* View mode toggle */}
          <div className="flex rounded-lg bg-bg-tertiary p-0.5">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-bg-secondary text-text-primary shadow-sm"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              List
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "timeline"
                  ? "bg-bg-secondary text-text-primary shadow-sm"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              Timeline
            </button>
          </div>

          {/* Progress ring */}
          <ProgressRing pct={stats.pct} />
          <div className="text-right">
            <p className="font-data text-lg font-bold text-text-primary">
              {stats.done}/{stats.total}
            </p>
            <p className="text-[10px] text-text-muted uppercase">completed</p>
          </div>
        </div>
      </div>

      {/* Phase timeline bar */}
      <div className="flex gap-2">
        {phaseStats.map((phase) => {
          const pct = phase.total > 0 ? (phase.done / phase.total) * 100 : 0;
          return (
            <div key={phase.key} className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: phase.color }}>
                  {phase.label}
                </span>
                <span className="font-data text-[10px] text-text-muted">
                  {phase.done}/{phase.total}
                </span>
              </div>
              <div className="h-2 rounded-full bg-bg-tertiary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: phase.color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* View content */}
      {viewMode === "list" ? (
        <ListView
          completed={completed}
          toggle={toggle}
          blockedItems={blockedItems}
          criticalIds={criticalIds}
          depGraph={depGraph}
        />
      ) : (
        <TimelineView
          completed={completed}
          blockedItems={blockedItems}
          criticalIds={criticalIds}
        />
      )}
    </div>
  );
}

/* ─────────────── List View ─────────────── */

function ListView({
  completed,
  toggle,
  blockedItems,
  criticalIds,
  depGraph,
}: {
  completed: Set<string>;
  toggle: (id: string) => void;
  blockedItems: Set<string>;
  criticalIds: Set<string>;
  depGraph: Map<string, { item: ChecklistItemData; blockedBy: ChecklistItemData[]; blocks: ChecklistItemData[] }>;
}) {
  return (
    <div className="space-y-8">
      {PHASES.map((phase) => {
        const items = CHECKLIST_ITEMS.filter((i) => i.phase === phase.key);
        const categories = [...new Set(items.map((i) => i.category))];
        const gateStatus = getPhaseGateStatus(phase.key, completed);

        return (
          <div key={phase.key}>
            {/* Phase gate warning */}
            {!gateStatus.canProceed && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 rounded-lg border border-warning/30 bg-warning/10 p-3"
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-warning">
                      Phase blocked -- prerequisites incomplete
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {gateStatus.blockers.map((b) => (
                        <span
                          key={b.id}
                          className="inline-flex items-center gap-1 rounded-md bg-warning/15 px-2 py-0.5 text-[10px] text-warning"
                        >
                          <ArrowRight className="h-2.5 w-2.5" />
                          {b.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex items-center gap-2 mb-4">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: phase.color }}
              />
              <h2 className="font-display text-lg font-semibold text-text-primary">
                {phase.months}
              </h2>
              <span className="text-xs text-text-muted">
                {items.filter((i) => completed.has(i.id)).length}/{items.length}
              </span>
            </div>

            <div className="space-y-5 ml-1.5 border-l-2 border-border-subtle pl-5">
              {categories.map((cat) => {
                const catItems = items.filter((i) => i.category === cat);
                return (
                  <div key={cat}>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                      {cat}
                    </h3>
                    <div className="space-y-1">
                      {catItems.map((item) => (
                        <ChecklistRow
                          key={item.id}
                          item={item}
                          isDone={completed.has(item.id)}
                          isBlocked={blockedItems.has(item.id)}
                          isCritical={criticalIds.has(item.id)}
                          onToggle={() => toggle(item.id)}
                          phaseColor={phase.color}
                          depGraph={depGraph}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────── Checklist Row ─────────────── */

function ChecklistRow({
  item,
  isDone,
  isBlocked,
  isCritical,
  onToggle,
  phaseColor,
  depGraph,
}: {
  item: ChecklistItemData;
  isDone: boolean;
  isBlocked: boolean;
  isCritical: boolean;
  onToggle: () => void;
  phaseColor: string;
  depGraph: Map<string, { item: ChecklistItemData; blockedBy: ChecklistItemData[]; blocks: ChecklistItemData[] }>;
}) {
  const deadlineDays = item.hardDeadline ? getDaysUntilDeadline(item.hardDeadline) : null;
  const depInfo = depGraph.get(item.id);
  return (
    <motion.button
      layout
      onClick={onToggle}
      className={`w-full text-left flex items-start gap-3 rounded-lg p-2.5 transition-colors ${
        isCritical && !isDone ? "border-l-2 border-l-warning/70" : ""
      } ${
        isDone
          ? "bg-bg-primary/30 opacity-60"
          : isBlocked
            ? "bg-bg-secondary/50 opacity-80"
            : "bg-bg-secondary hover:bg-bg-tertiary/50"
      }`}
    >
      {/* Checkbox */}
      <div className="shrink-0 mt-0.5">
        {isDone ? (
          <div
            className="h-4.5 w-4.5 rounded-full flex items-center justify-center"
            style={{ backgroundColor: phaseColor }}
          >
            <Check className="h-3 w-3 text-white" />
          </div>
        ) : isBlocked ? (
          <Lock className="h-4.5 w-4.5 text-warning/70" />
        ) : (
          <Circle className="h-4.5 w-4.5 text-text-muted" />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p
            className={`text-xs font-medium ${
              isDone ? "line-through text-text-muted" : "text-text-primary"
            }`}
          >
            {item.title}
          </p>
          {item.url && (
            <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-0.5 text-[10px] text-accent-primary hover:underline">
              <ExternalLink className="h-2.5 w-2.5" />
              Link
            </a>
          )}
          {isCritical && !isDone && (
            <span className="inline-flex items-center rounded px-1 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-warning/15 text-warning">
              Critical
            </span>
          )}
        </div>
        {item.description && !isDone && (
          <p className="text-[10px] text-text-tertiary mt-0.5 leading-snug">
            {item.description}
          </p>
        )}
        {/* Blocked-by badge */}
        {isBlocked && !isDone && depInfo && (
          <div className="mt-1 flex flex-wrap gap-1">
            {depInfo.blockedBy.map((dep) => (
              <span
                key={dep.id}
                className="inline-flex items-center gap-0.5 rounded bg-warning/10 px-1.5 py-0.5 text-[10px] text-warning"
              >
                <Lock className="h-2 w-2" />
                Blocked by: {dep.title}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Right side indicators */}
      <div className="shrink-0 flex flex-col items-end gap-1">
        {/* Hard deadline countdown */}
        {item.hardDeadline && !isDone && deadlineDays !== null && (
          <span
            className={`flex items-center gap-1 text-[10px] font-medium ${
              deadlineDays < 14
                ? "text-danger"
                : deadlineDays < 30
                  ? "text-warning"
                  : "text-text-muted"
            }`}
          >
            <Calendar className="h-2.5 w-2.5" />
            {deadlineDays > 0 ? `${deadlineDays}d left` : deadlineDays === 0 ? "Today!" : `${Math.abs(deadlineDays)}d overdue`}
          </span>
        )}
        {/* Due date fallback */}
        {item.dueDate && !item.hardDeadline && (
          <span className="flex items-center gap-1 text-[10px] text-warning">
            <Clock className="h-2.5 w-2.5" />
            {item.dueDate}
          </span>
        )}
        {/* Estimated days */}
        {item.estimatedDays && !isDone && (
          <span className="text-[10px] text-text-muted">
            ~{item.estimatedDays}d
          </span>
        )}
      </div>
    </motion.button>
  );
}

/* ─────────────── Timeline View ─────────────── */

function TimelineView({
  completed,
  blockedItems,
  criticalIds,
}: {
  completed: Set<string>;
  blockedItems: Set<string>;
  criticalIds: Set<string>;
}) {
  // Max estimated days for scaling
  const maxDays = Math.max(
    ...CHECKLIST_ITEMS.map((i) => i.estimatedDays || 1),
    1
  );

  return (
    <div className="space-y-8">
      {PHASES.map((phase) => {
        const items = CHECKLIST_ITEMS.filter((i) => i.phase === phase.key);

        return (
          <div key={phase.key}>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: phase.color }}
              />
              <h2 className="font-display text-lg font-semibold text-text-primary">
                {phase.months}
              </h2>
            </div>

            <div className="space-y-1.5">
              {items.map((item) => {
                const isDone = completed.has(item.id);
                const isBlocked = blockedItems.has(item.id);
                const isCritical = criticalIds.has(item.id);
                const days = item.estimatedDays || 1;
                const barWidth = Math.max((days / maxDays) * 100, 8);
                const deadlineDays = item.hardDeadline
                  ? getDaysUntilDeadline(item.hardDeadline)
                  : null;

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 group"
                  >
                    {/* Label */}
                    <div className="w-48 shrink-0 text-right pr-2">
                      <p
                        className={`text-[11px] font-medium truncate ${
                          isDone
                            ? "text-text-muted line-through"
                            : isBlocked
                              ? "text-warning/70"
                              : "text-text-secondary"
                        }`}
                        title={item.title}
                      >
                        {item.title}
                      </p>
                    </div>

                    {/* Bar area */}
                    <div className="flex-1 flex items-center gap-2 min-w-0">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{ duration: 0.4, delay: item.sortOrder * 0.02 }}
                        className={`h-6 rounded flex items-center px-2 relative overflow-hidden ${
                          isDone
                            ? "bg-slate-700/50"
                            : isCritical
                              ? "bg-warning/25 border border-warning/40"
                              : isBlocked
                                ? "bg-warning/10 border border-warning/20"
                                : "bg-blue-500/20 border border-blue-500/30"
                        }`}
                        style={
                          isBlocked && !isDone
                            ? {
                                backgroundImage:
                                  "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(245,158,11,0.08) 4px, rgba(245,158,11,0.08) 8px)",
                              }
                            : undefined
                        }
                      >
                        <span
                          className={`text-[10px] font-data whitespace-nowrap ${
                            isDone
                              ? "text-text-muted"
                              : isCritical
                                ? "text-warning"
                                : isBlocked
                                  ? "text-warning"
                                  : "text-blue-300"
                          }`}
                        >
                          {days}d
                        </span>

                        {/* Done overlay */}
                        {isDone && (
                          <Check className="h-3 w-3 text-success ml-1" />
                        )}
                        {/* Blocked icon */}
                        {isBlocked && !isDone && (
                          <Lock className="h-2.5 w-2.5 text-warning/60 ml-1" />
                        )}
                      </motion.div>

                      {/* Hard deadline diamond */}
                      {item.hardDeadline && (
                        <div className="flex items-center gap-1 shrink-0">
                          <div
                            className={`h-3 w-3 rotate-45 ${
                              isDone
                                ? "bg-slate-600"
                                : deadlineDays !== null && deadlineDays < 14
                                  ? "bg-danger"
                                  : deadlineDays !== null && deadlineDays < 30
                                    ? "bg-warning"
                                    : "bg-danger/60"
                            }`}
                          />
                          {!isDone && deadlineDays !== null && (
                            <span
                              className={`text-[10px] font-data ${
                                deadlineDays < 14
                                  ? "text-danger"
                                  : deadlineDays < 30
                                    ? "text-warning"
                                    : "text-text-muted"
                              }`}
                            >
                              {item.hardDeadline}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border-subtle">
        <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Legend:</span>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-6 rounded bg-blue-500/20 border border-blue-500/30" />
          <span className="text-[10px] text-text-muted">Normal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-6 rounded bg-warning/25 border border-warning/40" />
          <span className="text-[10px] text-text-muted">Critical path</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="h-3 w-6 rounded bg-warning/10 border border-warning/20"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(245,158,11,0.08) 4px, rgba(245,158,11,0.08) 8px)",
            }}
          />
          <span className="text-[10px] text-text-muted">Blocked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rotate-45 bg-danger/60" />
          <span className="text-[10px] text-text-muted">Hard deadline</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-6 rounded bg-slate-700/50" />
          <span className="text-[10px] text-text-muted">Completed</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Progress Ring ─────────────── */

function ProgressRing({ pct }: { pct: number }) {
  const r = 28;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;

  const color =
    pct >= 80
      ? "#22c55e"
      : pct >= 50
        ? "#f59e0b"
        : pct >= 20
          ? "#f97316"
          : "#64748b";

  return (
    <svg width={68} height={68} className="-rotate-90">
      <circle
        cx={34}
        cy={34}
        r={r}
        fill="none"
        stroke="var(--bg-tertiary)"
        strokeWidth={5}
      />
      <motion.circle
        cx={34}
        cy={34}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <text
        x={34}
        y={34}
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--text-primary)"
        fontSize={14}
        fontWeight="bold"
        fontFamily="var(--font-jetbrains), monospace"
        transform="rotate(90, 34, 34)"
      >
        {pct}%
      </text>
    </svg>
  );
}
