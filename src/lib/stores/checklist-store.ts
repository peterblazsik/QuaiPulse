"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChecklistStore {
  completedIds: string[];
  toggle: (id: string) => void;
  isCompleted: (id: string) => boolean;
  clear: () => void;
}

export const useChecklistStore = create<ChecklistStore>()(
  persist(
    (set, get) => ({
      completedIds: [],
      toggle: (id) =>
        set((s) => ({
          completedIds: s.completedIds.includes(id)
            ? s.completedIds.filter((x) => x !== id)
            : [...s.completedIds, id],
        })),
      isCompleted: (id) => get().completedIds.includes(id),
      clear: () => set({ completedIds: [] }),
    }),
    {
      name: "quaipulse-checklist",
    }
  )
);
