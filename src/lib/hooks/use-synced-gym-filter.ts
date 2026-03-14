"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc/client";
import { useGymFilterStore } from "@/lib/stores/gym-filter-store";
import type { EquipmentType } from "@/lib/data/gyms";

const LS_KEY = "quaipulse-gym-filter";

export function useSyncedGymFilter() {
  const { data: session } = useSession();
  const migrated = useRef(false);
  const query = trpc.gymFilter.get.useQuery(undefined, {
    enabled: !!session?.user?.id,
  });
  const upsert = trpc.gymFilter.upsert.useMutation();

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
            stateJson: {
              selectedEquipment: state.selectedEquipment ?? [],
              priceRange: state.priceRange ?? [0, 200],
              kneeSafeOnly: state.kneeSafeOnly ?? false,
              compareIds: state.compareIds ?? [],
            },
          });
          localStorage.removeItem(LS_KEY);
        } catch { /* */ }
      }
    } else {
      const state = (serverData.stateJson ?? {}) as Record<string, unknown>;
      useGymFilterStore.setState({
        selectedEquipment: (state.selectedEquipment ?? []) as EquipmentType[],
        priceRange: (state.priceRange ?? [0, 200]) as [number, number],
        kneeSafeOnly: (state.kneeSafeOnly ?? false) as boolean,
        compareIds: (state.compareIds ?? []) as string[],
      });
      localStorage.removeItem(LS_KEY);
    }

    migrated.current = true;
  }, [session?.user?.id, query.isLoading, query.data, upsert]);

  const saveGymFilter = () => {
    if (!session?.user?.id) return;
    const s = useGymFilterStore.getState();
    upsert.mutate({
      stateJson: {
        selectedEquipment: s.selectedEquipment,
        priceRange: s.priceRange,
        kneeSafeOnly: s.kneeSafeOnly,
        compareIds: s.compareIds,
      },
    });
  };

  return { saveGymFilter, isLoading: query.isLoading };
}
