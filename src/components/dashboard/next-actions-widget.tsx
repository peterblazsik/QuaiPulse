"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Clock,
  ArrowRight,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useChecklistStore } from "@/lib/stores/checklist-store";
import { CHECKLIST_ITEMS } from "@/lib/data/checklist-items";
import {
  getCriticalPath,
  getBlockedItems,
  getDaysUntilDeadline,
} from "@/lib/engines/checklist-engine";

interface ActionItem {
  id: string;
  title: string;
  category: string;
  phase: string;
  daysLeft: number | null; // null = no deadline
  isOverdue: boolean;
  isCritical: boolean;
  isBlocked: boolean;
  moduleLink?: string;
  moduleLinkLabel?: string;
  estimatedDays?: number;
}

const PHASE_LABELS: Record<string, string> = {
  "mar-apr": "Mar–Apr",
  may: "May",
  jun: "Jun",
  jul: "Jul",
};

export function NextActionsWidget() {
  const completedIds = useChecklistStore((s) => s.completedIds);

  const { actions, stats } = useMemo(() => {
    const completedSet = new Set(completedIds);
    const criticalItems = getCriticalPath(CHECKLIST_ITEMS);
    const criticalIds = new Set(criticalItems.map((i) => i.id));
    const blockedIds = getBlockedItems(completedSet, CHECKLIST_ITEMS);

    // Get all incomplete items
    const incomplete = CHECKLIST_ITEMS.filter(
      (i) => !completedSet.has(i.id)
    );

    const items: ActionItem[] = incomplete.map((item) => {
      const daysLeft = item.hardDeadline
        ? getDaysUntilDeadline(item.hardDeadline)
        : null;

      return {
        id: item.id,
        title: item.title,
        category: item.category,
        phase: item.phase,
        daysLeft,
        isOverdue: daysLeft !== null && daysLeft < 0,
        isCritical: criticalIds.has(item.id),
        isBlocked: blockedIds.has(item.id),
        moduleLink: item.moduleLink,
        moduleLinkLabel: item.moduleLinkLabel,
        estimatedDays: item.estimatedDays,
      };
    });

    // Sort: overdue first, then by deadline proximity, then critical, then unblocked
    items.sort((a, b) => {
      // Overdue items first
      if (a.isOverdue && !b.isOverdue) return -1;
      if (!a.isOverdue && b.isOverdue) return 1;

      // Blocked items last
      if (a.isBlocked && !b.isBlocked) return 1;
      if (!a.isBlocked && b.isBlocked) return -1;

      // Items with deadlines before those without
      if (a.daysLeft !== null && b.daysLeft === null) return -1;
      if (a.daysLeft === null && b.daysLeft !== null) return 1;

      // Closer deadline first
      if (a.daysLeft !== null && b.daysLeft !== null) {
        return a.daysLeft - b.daysLeft;
      }

      // Critical before non-critical
      if (a.isCritical && !b.isCritical) return -1;
      if (!a.isCritical && b.isCritical) return 1;

      return 0;
    });

    const overdueCount = items.filter((i) => i.isOverdue).length;
    const criticalPending = items.filter(
      (i) => i.isCritical && !i.isBlocked
    ).length;

    return {
      actions: items.slice(0, 6), // Show top 6
      stats: {
        total: CHECKLIST_ITEMS.length,
        completed: completedIds.length,
        overdue: overdueCount,
        criticalPending,
        blockedCount: items.filter((i) => i.isBlocked).length,
      },
    };
  }, [completedIds]);

  return (
    <div className="card elevation-1 p-6 relative overflow-hidden">
      <div className="card-hover-line" />
      <div className="flex items-center justify-between mb-4">
        <p className="section-label">Next Actions</p>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-text-muted">
            <span className="font-data font-bold text-accent-primary">
              {stats.completed}
            </span>
            /{stats.total} done
          </span>
          {stats.overdue > 0 && (
            <span className="flex items-center gap-1 text-danger font-medium">
              <AlertTriangle className="h-3 w-3" />
              {stats.overdue} overdue
            </span>
          )}
          {stats.criticalPending > 0 && (
            <span className="flex items-center gap-1 text-amber-400 font-medium">
              <Clock className="h-3 w-3" />
              {stats.criticalPending} critical
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {actions.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-text-muted">
            <CheckCircle2 className="h-8 w-8 mb-2 text-success" />
            <p className="text-sm font-medium text-text-secondary">
              All caught up
            </p>
            <p className="text-[10px]">Every checklist item is complete</p>
          </div>
        ) : (
          actions.map((action) => (
            <div
              key={action.id}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                action.isOverdue
                  ? "bg-danger/10 border border-danger/20"
                  : action.isBlocked
                    ? "bg-bg-tertiary/30 opacity-60"
                    : "bg-bg-secondary hover:bg-bg-tertiary/50"
              }`}
            >
              {/* Status indicator */}
              <div className="shrink-0">
                {action.isOverdue ? (
                  <AlertTriangle className="h-4 w-4 text-danger" />
                ) : action.isBlocked ? (
                  <Lock className="h-3.5 w-3.5 text-text-muted" />
                ) : action.isCritical ? (
                  <Clock className="h-4 w-4 text-amber-400" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-accent-primary" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-medium truncate ${
                      action.isOverdue
                        ? "text-danger"
                        : action.isBlocked
                          ? "text-text-muted"
                          : "text-text-primary"
                    }`}
                  >
                    {action.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-text-muted">
                    {action.category}
                  </span>
                  <span className="text-[10px] text-text-muted">
                    {PHASE_LABELS[action.phase] || action.phase}
                  </span>
                  {action.estimatedDays && (
                    <span className="text-[10px] text-text-muted">
                      ~{action.estimatedDays}d
                    </span>
                  )}
                </div>
              </div>

              {/* Deadline badge */}
              {action.daysLeft !== null && (
                <span
                  className={`shrink-0 font-data text-[10px] font-bold px-2 py-0.5 rounded ${
                    action.isOverdue
                      ? "bg-danger/20 text-danger"
                      : action.daysLeft <= 7
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-bg-tertiary text-text-secondary"
                  }`}
                >
                  {action.isOverdue
                    ? `${Math.abs(action.daysLeft)}d overdue`
                    : `${action.daysLeft}d left`}
                </span>
              )}

              {/* Module link */}
              {action.moduleLink && !action.isBlocked && (
                <Link
                  href={action.moduleLink}
                  className="shrink-0 flex items-center gap-0.5 text-[10px] text-accent-primary hover:text-accent-primary/80 transition-colors"
                >
                  {action.moduleLinkLabel || "Go"}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer link */}
      <Link
        href="/checklist"
        className="mt-4 flex items-center justify-center gap-1.5 text-xs text-accent-primary hover:text-accent-primary/80 transition-colors py-2"
      >
        View Full Checklist
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
