"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChecklistStore {
  completedIds: string[];
  viewMode: "list" | "timeline";
  toggle: (id: string) => void;
  clear: () => void;
  setViewMode: (mode: "list" | "timeline") => void;
}

export const useChecklistStore = create<ChecklistStore>()(
  persist(
    (set) => ({
      completedIds: [],
      viewMode: "list",
      toggle: (id) =>
        set((s) => ({
          completedIds: s.completedIds.includes(id)
            ? s.completedIds.filter((x) => x !== id)
            : [...s.completedIds, id],
        })),
      clear: () => set({ completedIds: [] }),
      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    {
      name: "quaipulse-checklist",
    }
  )
);
