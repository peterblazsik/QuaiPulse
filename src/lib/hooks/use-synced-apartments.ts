"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc/client";
import { useApartmentStore, type SavedApartment } from "@/lib/stores/apartment-store";

const LS_KEY = "quaipulse-apartments";

export function useSyncedApartments() {
  const { data: session } = useSession();
  const migrated = useRef(false);
  const utils = trpc.useUtils();
  const query = trpc.apartments.list.useQuery(undefined, {
    enabled: !!session?.user?.id,
  });
  const createMut = trpc.apartments.create.useMutation({
    onSuccess: () => utils.apartments.list.invalidate(),
  });
  const updateMut = trpc.apartments.update.useMutation({
    onSuccess: () => utils.apartments.list.invalidate(),
  });
  const removeMut = trpc.apartments.remove.useMutation({
    onSuccess: () => utils.apartments.list.invalidate(),
  });
  const addInteractionMut = trpc.apartments.addInteraction.useMutation({
    onSuccess: () => utils.apartments.list.invalidate(),
  });
  const removeInteractionMut = trpc.apartments.removeInteraction.useMutation({
    onSuccess: () => utils.apartments.list.invalidate(),
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
          const apartments: SavedApartment[] = state.apartments ?? [];
          // Migrate each apartment to server
          for (const apt of apartments) {
            createMut.mutate({
              title: apt.title,
              address: apt.address ?? "",
              kreis: apt.kreis ?? 0,
              rent: apt.rent ?? 0,
              rooms: apt.rooms ?? 0,
              sqm: apt.sqm ?? 0,
              sourceUrl: apt.sourceUrl ?? "",
              status: apt.status ?? "new",
              notes: apt.notes ?? "",
            });
          }
          localStorage.removeItem(LS_KEY);
        } catch { /* */ }
      }
    } else {
      // Hydrate Zustand from server
      const apartments: SavedApartment[] = serverData.map((apt) => ({
        id: apt.id,
        title: apt.title,
        address: apt.address,
        kreis: apt.kreis,
        rent: apt.rent,
        rooms: apt.rooms,
        sqm: apt.sqm,
        sourceUrl: apt.sourceUrl,
        status: apt.status as SavedApartment["status"],
        notes: apt.notes,
        createdAt: apt.createdAt instanceof Date ? apt.createdAt.toISOString() : apt.createdAt,
        interactions: apt.interactions?.map((i) => ({
          id: i.id,
          type: i.type as SavedApartment["interactions"][0]["type"],
          date: i.date,
          summary: i.summary,
        })) ?? [],
      }));
      useApartmentStore.setState({ apartments });
      localStorage.removeItem(LS_KEY);
    }

    migrated.current = true;
  }, [session?.user?.id, query.isLoading, query.data, createMut, utils]);

  return {
    isLoading: query.isLoading,
    createApartment: createMut.mutate,
    updateApartment: updateMut.mutate,
    removeApartment: removeMut.mutate,
    addInteraction: addInteractionMut.mutate,
    removeInteraction: removeInteractionMut.mutate,
  };
}
