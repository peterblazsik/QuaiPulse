"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc/client";
import { useSubscriptionStore } from "@/lib/stores/subscription-store";
import { useAutoSave } from "./use-auto-save";
import type { SubAction } from "@/lib/types";
import type { SubscriptionData } from "@/lib/data/subscriptions";

const LS_KEY = "quaipulse-subscriptions";

export function useSyncedSubscription() {
  const { data: session } = useSession();
  const migrated = useRef(false);
  const query = trpc.subscription.get.useQuery(undefined, {
    enabled: !!session?.user?.id,
  });
  const upsert = trpc.subscription.upsert.useMutation();

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
            decisionsJson: state.decisions ?? {},
            customSubsJson: state.customSubs ?? [],
          });
          localStorage.removeItem(LS_KEY);
        } catch { /* */ }
      }
    } else {
      useSubscriptionStore.setState({
        decisions: (serverData.decisionsJson ?? {}) as Record<string, SubAction>,
        customSubs: (serverData.customSubsJson ?? []) as SubscriptionData[],
      });
      localStorage.removeItem(LS_KEY);
    }

    migrated.current = true;
  }, [session?.user?.id, query.isLoading, query.data, upsert]);

  const saveSubscription = useCallback(() => {
    if (!session?.user?.id) return;
    const s = useSubscriptionStore.getState();
    upsert.mutate({
      decisionsJson: s.decisions,
      customSubsJson: s.customSubs,
    });
  }, [session?.user?.id, upsert]);

  useAutoSave(useSubscriptionStore, saveSubscription, migrated.current && !query.isLoading);

  return { saveSubscription, isLoading: query.isLoading };
}
