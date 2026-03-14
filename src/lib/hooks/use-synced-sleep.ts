"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc/client";
import { useSleepStore, type SleepEntry } from "@/lib/stores/sleep-store";

const LS_KEY = "quaipulse-sleep";

export function useSyncedSleep() {
  const { data: session } = useSession();
  const migrated = useRef(false);
  const utils = trpc.useUtils();
  const query = trpc.sleep.list.useQuery(undefined, {
    enabled: !!session?.user?.id,
  });
  const createMut = trpc.sleep.create.useMutation({
    onSuccess: () => utils.sleep.list.invalidate(),
  });
  const updateMut = trpc.sleep.update.useMutation({
    onSuccess: () => utils.sleep.list.invalidate(),
  });
  const removeMut = trpc.sleep.remove.useMutation({
    onSuccess: () => utils.sleep.list.invalidate(),
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
          const entries: SleepEntry[] = state.entries ?? [];
          for (const e of entries) {
            createMut.mutate({
              date: e.date,
              hours: e.hours,
              quality: e.quality as number,
              location: e.location,
              supplementsJson: e.supplements ?? [],
              interventionsJson: e.interventions ?? [],
              bedtime: e.bedtime ?? null,
              waketime: e.waketime ?? null,
              sleepLatency: e.sleepLatency ?? null,
              awakenings: e.awakenings ?? null,
              notes: e.notes ?? null,
            });
          }
          localStorage.removeItem(LS_KEY);
        } catch { /* */ }
      }
    } else {
      const entries: SleepEntry[] = serverData.map((e) => ({
        id: e.id,
        date: e.date,
        hours: e.hours,
        quality: e.quality as SleepEntry["quality"],
        location: e.location as SleepEntry["location"],
        supplements: (e.supplementsJson ?? []) as string[],
        interventions: (e.interventionsJson ?? []) as string[],
        bedtime: e.bedtime ?? undefined,
        waketime: e.waketime ?? undefined,
        sleepLatency: e.sleepLatency ?? undefined,
        awakenings: e.awakenings ?? undefined,
        notes: e.notes ?? undefined,
      }));
      useSleepStore.setState({ entries });
      localStorage.removeItem(LS_KEY);
    }

    migrated.current = true;
  }, [session?.user?.id, query.isLoading, query.data, createMut, utils]);

  return {
    isLoading: query.isLoading,
    createEntry: createMut.mutate,
    updateEntry: updateMut.mutate,
    removeEntry: removeMut.mutate,
  };
}
