"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc/client";
import { useDossierStore } from "@/lib/stores/dossier-store";
import { useAutoSave } from "./use-auto-save";
import type { DossierStatus } from "@/lib/types";

const LS_KEY = "quaipulse-dossier";

export function useSyncedDossier() {
  const { data: session } = useSession();
  const migrated = useRef(false);
  const query = trpc.dossier.get.useQuery(undefined, {
    enabled: !!session?.user?.id,
  });
  const upsert = trpc.dossier.upsert.useMutation();

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
            statusesJson: state.statuses ?? {},
            notesJson: state.notes ?? {},
            urlsJson: state.urls ?? {},
          });
          localStorage.removeItem(LS_KEY);
        } catch { /* */ }
      }
    } else {
      useDossierStore.setState({
        statuses: (serverData.statusesJson ?? {}) as Record<string, DossierStatus>,
        notes: (serverData.notesJson ?? {}) as Record<string, string>,
        urls: (serverData.urlsJson ?? {}) as Record<string, string>,
      });
      localStorage.removeItem(LS_KEY);
    }

    migrated.current = true;
  }, [session?.user?.id, query.isLoading, query.data, upsert]);

  const saveDossier = useCallback(() => {
    if (!session?.user?.id) return;
    const s = useDossierStore.getState();
    upsert.mutate({
      statusesJson: s.statuses,
      notesJson: s.notes,
      urlsJson: s.urls,
    });
  }, [session?.user?.id, upsert]);

  useAutoSave(useDossierStore, saveDossier, migrated.current && !query.isLoading);

  return { saveDossier, isLoading: query.isLoading };
}
