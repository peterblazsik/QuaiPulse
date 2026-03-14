"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc/client";
import { useChecklistStore } from "@/lib/stores/checklist-store";
import type { ChecklistItemData } from "@/lib/data/checklist-items";

const LS_KEY = "quaipulse-checklist";

export function useSyncedChecklist() {
  const { data: session } = useSession();
  const migrated = useRef(false);
  const query = trpc.checklist.get.useQuery(undefined, {
    enabled: !!session?.user?.id,
  });
  const upsert = trpc.checklist.upsert.useMutation();

  useEffect(() => {
    if (!session?.user?.id || migrated.current) return;
    if (query.isLoading) return;

    const serverData = query.data;

    if (!serverData) {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          const state = parsed.state ?? parsed;
          upsert.mutate({
            completedIdsJson: state.completedIds ?? [],
            customItemsJson: state.customItems ?? [],
          });
          localStorage.removeItem(LS_KEY);
        } catch { /* */ }
      }
    } else {
      useChecklistStore.setState({
        completedIds: (serverData.completedIdsJson ?? []) as string[],
        customItems: (serverData.customItemsJson ?? []) as ChecklistItemData[],
      });
      localStorage.removeItem(LS_KEY);
    }

    migrated.current = true;
  }, [session?.user?.id, query.isLoading, query.data, upsert]);

  const saveChecklist = () => {
    if (!session?.user?.id) return;
    const s = useChecklistStore.getState();
    upsert.mutate({
      completedIdsJson: s.completedIds,
      customItemsJson: s.customItems,
    });
  };

  return { saveChecklist, isLoading: query.isLoading };
}
