import {
  CHECKLIST_ITEMS,
  type ChecklistItemData,
} from "@/lib/data/checklist-items";
import { getDaysUntilDeadline } from "@/lib/engines/checklist-engine";

export type Urgency = "overdue" | "critical" | "warning" | "upcoming";

export interface DeadlineAlert {
  item: ChecklistItemData;
  daysUntil: number;
  urgency: Urgency;
}

const PHASE_LABELS: Record<string, string> = {
  "mar-apr": "Mar-Apr",
  may: "May",
  jun: "June",
  jul: "July",
};

export function getPhaseLabel(phase: string): string {
  return PHASE_LABELS[phase] ?? phase;
}

/**
 * Returns incomplete items with hard deadlines, sorted by urgency (most urgent first).
 * Only includes items within a 30-day lookahead window or already overdue.
 */
export function getUpcomingDeadlines(
  completedIds: string[]
): DeadlineAlert[] {
  const completedSet = new Set(completedIds);

  return CHECKLIST_ITEMS.filter(
    (item) => item.hardDeadline && !completedSet.has(item.id)
  )
    .map((item) => {
      const daysUntil = getDaysUntilDeadline(item.hardDeadline!);
      const urgency = resolveUrgency(daysUntil);
      return { item, daysUntil, urgency };
    })
    .filter(
      (alert): alert is DeadlineAlert =>
        alert.urgency !== null
    )
    .sort((a, b) => a.daysUntil - b.daysUntil);
}

function resolveUrgency(daysUntil: number): Urgency | null {
  if (daysUntil < 0) return "overdue";
  if (daysUntil <= 3) return "critical";
  if (daysUntil <= 14) return "warning";
  if (daysUntil <= 30) return "upcoming";
  return null;
}
