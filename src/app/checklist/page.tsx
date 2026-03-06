"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Check, Circle, Clock, AlertTriangle } from "lucide-react";
import { CHECKLIST_ITEMS, type ChecklistItemData } from "@/lib/data/checklist-items";

const PHASES = [
  { key: "mar-apr" as const, label: "Mar-Apr", months: "March - April", color: "#3b82f6" },
  { key: "may" as const, label: "May", months: "May", color: "#f59e0b" },
  { key: "jun" as const, label: "Jun", months: "June", color: "#f97316" },
  { key: "jul" as const, label: "Jul", months: "July", color: "#22c55e" },
];

export default function ChecklistPage() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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

  return (
    <div className="space-y-6">
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

        {/* Progress ring */}
        <div className="shrink-0 flex items-center gap-3">
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

      {/* Tasks by phase */}
      <div className="space-y-8">
        {PHASES.map((phase) => {
          const items = CHECKLIST_ITEMS.filter((i) => i.phase === phase.key);
          const categories = [...new Set(items.map((i) => i.category))];

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
                            onToggle={() => toggle(item.id)}
                            phaseColor={phase.color}
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
    </div>
  );
}

function ChecklistRow({
  item,
  isDone,
  onToggle,
  phaseColor,
}: {
  item: ChecklistItemData;
  isDone: boolean;
  onToggle: () => void;
  phaseColor: string;
}) {
  return (
    <motion.button
      layout
      onClick={onToggle}
      className={`w-full text-left flex items-start gap-3 rounded-lg p-2.5 transition-colors ${
        isDone
          ? "bg-bg-primary/30 opacity-60"
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
        ) : (
          <Circle className="h-4.5 w-4.5 text-text-muted" />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p
          className={`text-xs font-medium ${
            isDone ? "line-through text-text-muted" : "text-text-primary"
          }`}
        >
          {item.title}
        </p>
        {item.description && !isDone && (
          <p className="text-[10px] text-text-tertiary mt-0.5 leading-snug">
            {item.description}
          </p>
        )}
      </div>

      {/* Due date */}
      {item.dueDate && (
        <span className="shrink-0 flex items-center gap-1 text-[10px] text-amber-400">
          <Clock className="h-2.5 w-2.5" />
          {item.dueDate}
        </span>
      )}
    </motion.button>
  );
}

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
