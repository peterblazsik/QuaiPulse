import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DossierStatus } from "@/lib/types";
import { getDefaultDossierStatuses } from "@/lib/data/dossier-items";

interface DossierStore {
  statuses: Record<string, DossierStatus>;
  notes: Record<string, string>;
  urls: Record<string, string>;
  setStatus: (docId: string, status: DossierStatus) => void;
  setNote: (docId: string, note: string) => void;
  setUrl: (docId: string, url: string) => void;
  reset: () => void;
}

export const useDossierStore = create<DossierStore>()(
  persist(
    (set) => ({
      statuses: getDefaultDossierStatuses(),
      notes: {},
      urls: {},
      setStatus: (docId, status) =>
        set((state) => ({
          statuses: { ...state.statuses, [docId]: status },
        })),
      setNote: (docId, note) =>
        set((state) => ({
          notes: { ...state.notes, [docId]: note },
        })),
      setUrl: (docId, url) =>
        set((state) => ({
          urls: { ...state.urls, [docId]: url },
        })),
      reset: () =>
        set({
          statuses: getDefaultDossierStatuses(),
          notes: {},
          urls: {},
        }),
    }),
    { name: "quaipulse-dossier" }
  )
);
