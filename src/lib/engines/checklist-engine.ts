import { CHECKLIST_ITEMS, type ChecklistItemData } from "@/lib/data/checklist-items";

export interface DependencyInfo {
  item: ChecklistItemData;
  blockedBy: ChecklistItemData[];
  blocks: ChecklistItemData[];
}

export function buildDependencyGraph(): Map<string, DependencyInfo> {
  const graph = new Map<string, DependencyInfo>();

  for (const item of CHECKLIST_ITEMS) {
    const blockedBy = (item.dependsOn || [])
      .map((id) => CHECKLIST_ITEMS.find((i) => i.id === id))
      .filter((i): i is ChecklistItemData => !!i);

    graph.set(item.id, { item, blockedBy, blocks: [] });
  }

  // Build reverse links
  for (const item of CHECKLIST_ITEMS) {
    if (item.dependsOn) {
      for (const depId of item.dependsOn) {
        const dep = graph.get(depId);
        if (dep) {
          dep.blocks.push(item);
        }
      }
    }
  }

  return graph;
}

export function getBlockedItems(completedIds: Set<string>): Set<string> {
  const blocked = new Set<string>();

  for (const item of CHECKLIST_ITEMS) {
    if (item.dependsOn && item.dependsOn.length > 0) {
      const hasUnmetDeps = item.dependsOn.some((depId) => !completedIds.has(depId));
      if (hasUnmetDeps) {
        blocked.add(item.id);
      }
    }
  }

  return blocked;
}

export function getCriticalPath(): ChecklistItemData[] {
  // Items on the critical path: those with hard deadlines or that block items with hard deadlines
  const deadlineItems = CHECKLIST_ITEMS.filter((i) => i.hardDeadline);
  const criticalIds = new Set<string>();

  function addDepsRecursive(id: string) {
    criticalIds.add(id);
    const item = CHECKLIST_ITEMS.find((i) => i.id === id);
    if (item?.dependsOn) {
      for (const depId of item.dependsOn) {
        if (!criticalIds.has(depId)) {
          addDepsRecursive(depId);
        }
      }
    }
  }

  for (const item of deadlineItems) {
    addDepsRecursive(item.id);
  }

  return CHECKLIST_ITEMS.filter((i) => criticalIds.has(i.id)).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getPhaseGateStatus(
  phase: string,
  completedIds: Set<string>
): { canProceed: boolean; blockers: ChecklistItemData[] } {
  const phaseOrder = ["mar-apr", "may", "jun", "jul"];
  const phaseIndex = phaseOrder.indexOf(phase);

  if (phaseIndex <= 0) return { canProceed: true, blockers: [] };

  // Get items from previous phases that block items in this phase
  const currentPhaseItems = CHECKLIST_ITEMS.filter((i) => i.phase === phase);
  const blockers: ChecklistItemData[] = [];

  for (const item of currentPhaseItems) {
    if (item.dependsOn) {
      for (const depId of item.dependsOn) {
        const dep = CHECKLIST_ITEMS.find((i) => i.id === depId);
        if (dep && !completedIds.has(depId) && dep.phase !== phase) {
          if (!blockers.find((b) => b.id === dep.id)) {
            blockers.push(dep);
          }
        }
      }
    }
  }

  return { canProceed: blockers.length === 0, blockers };
}

export function getDaysUntilDeadline(deadline: string): number {
  const now = new Date();
  const dl = new Date(deadline);
  return Math.ceil((dl.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}
