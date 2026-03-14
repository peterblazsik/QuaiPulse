"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc/client";
import { useApartmentFeedStore } from "@/lib/stores/apartment-feed-store";

const LS_KEY = "quaipulse-apartment-feed";

export function useSyncedFeedPrefs() {
  const { data: session } = useSession();
  const migrated = useRef(false);
  const query = trpc.apartmentFeedPrefs.get.useQuery(undefined, {
    enabled: !!session?.user?.id,
  });
  const upsert = trpc.apartmentFeedPrefs.upsert.useMutation();

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
            dismissedIdsJson: state.dismissedIds ?? [],
            filtersJson: state.filters ?? {},
            sortKey: state.sort ?? "newest",
          });
          localStorage.removeItem(LS_KEY);
        } catch { /* */ }
      }
    } else {
      useApartmentFeedStore.setState({
        dismissedIds: (serverData.dismissedIdsJson ?? []) as string[],
        filters: (serverData.filtersJson ?? {}) as ReturnType<typeof useApartmentFeedStore.getState>["filters"],
        sort: (serverData.sortKey ?? "newest") as ReturnType<typeof useApartmentFeedStore.getState>["sort"],
      });
      localStorage.removeItem(LS_KEY);
    }

    migrated.current = true;
  }, [session?.user?.id, query.isLoading, query.data, upsert]);

  const saveFeedPrefs = () => {
    if (!session?.user?.id) return;
    const s = useApartmentFeedStore.getState();
    upsert.mutate({
      dismissedIdsJson: s.dismissedIds,
      filtersJson: s.filters,
      sortKey: s.sort,
    });
  };

  return { saveFeedPrefs, isLoading: query.isLoading };
}
