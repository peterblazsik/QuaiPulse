"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc/client";
import { useKatieStore } from "@/lib/stores/katie-store";
import type { KatieVisitData } from "@/lib/data/katie-visits";

const LS_KEY = "quaipulse-katie";

export function useSyncedKatie() {
  const { data: session } = useSession();
  const migrated = useRef(false);
  const utils = trpc.useUtils();
  const query = trpc.katie.list.useQuery(undefined, {
    enabled: !!session?.user?.id,
  });
  const createMut = trpc.katie.create.useMutation({
    onSuccess: () => utils.katie.list.invalidate(),
  });
  const updateMut = trpc.katie.update.useMutation({
    onSuccess: () => utils.katie.list.invalidate(),
  });
  const removeMut = trpc.katie.remove.useMutation({
    onSuccess: () => utils.katie.list.invalidate(),
  });

  useEffect(() => {
    if (!session?.user?.id || migrated.current) return;
    if (query.isLoading) return;

    const serverData = query.data;

    if (!serverData || serverData.length === 0) {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          const state = parsed.state ?? parsed;
          const visits: KatieVisitData[] = state.visits ?? [];
          for (const v of visits) {
            createMut.mutate({
              startDate: v.startDate,
              endDate: v.endDate,
              transportMode: v.transportMode ?? "flight",
              notes: v.notes ?? null,
              isConfirmed: v.isConfirmed ?? false,
              isSpecial: v.isSpecial ?? false,
              specialLabel: v.specialLabel ?? null,
            });
          }
          localStorage.removeItem(LS_KEY);
        } catch { /* */ }
      }
    } else {
      const visits: KatieVisitData[] = serverData.map((v) => ({
        id: v.id,
        startDate: v.startDate,
        endDate: v.endDate,
        transportMode: v.transportMode as KatieVisitData["transportMode"],
        notes: v.notes ?? undefined,
        isConfirmed: v.isConfirmed,
        isSpecial: v.isSpecial ?? undefined,
        specialLabel: v.specialLabel ?? undefined,
      }));
      useKatieStore.setState({ visits });
      localStorage.removeItem(LS_KEY);
    }

    migrated.current = true;
  }, [session?.user?.id, query.isLoading, query.data, createMut, utils]);

  return {
    isLoading: query.isLoading,
    createVisit: createMut.mutate,
    updateVisit: updateMut.mutate,
    removeVisit: removeMut.mutate,
  };
}
