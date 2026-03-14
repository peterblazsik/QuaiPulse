"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc/client";
import { usePriorityStore } from "@/lib/stores/priority-store";
import type { PriorityWeights } from "@/lib/types";

const LS_KEY = "quaipulse-priorities";

export function useSyncedPriority() {
  const { data: session } = useSession();
  const migrated = useRef(false);
  const query = trpc.priority.get.useQuery(undefined, {
    enabled: !!session?.user?.id,
  });
  const upsert = trpc.priority.upsert.useMutation();

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
            weightsJson: state.weights ?? {},
            profilesJson: state.profiles ?? {},
          });
          localStorage.removeItem(LS_KEY);
        } catch { /* */ }
      }
    } else {
      usePriorityStore.setState({
        weights: (serverData.weightsJson ?? {}) as PriorityWeights,
        profiles: (serverData.profilesJson ?? {}) as Record<string, PriorityWeights>,
      });
      localStorage.removeItem(LS_KEY);
    }

    migrated.current = true;
  }, [session?.user?.id, query.isLoading, query.data, upsert]);

  const savePriority = () => {
    if (!session?.user?.id) return;
    const s = usePriorityStore.getState();
    upsert.mutate({
      weightsJson: s.weights,
      profilesJson: s.profiles,
    });
  };

  return { savePriority, isLoading: query.isLoading };
}
