"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChecklistItemData } from "@/lib/data/checklist-items";

interface ChecklistStore {
  completedIds: string[];
  viewMode: "list" | "timeline";
  customItems: ChecklistItemData[];
  toggle: (id: string) => void;
  clear: () => void;
  setViewMode: (mode: "list" | "timeline") => void;
  addCustomItem: (
    item: Omit<ChecklistItemData, "id" | "sortOrder">
  ) => void;
  deleteCustomItem: (id: string) => void;
}

export const useChecklistStore = create<ChecklistStore>()(
  persist(
    (set, get) => ({
      completedIds: [],
      viewMode: "list",
      customItems: [],
      toggle: (id) =>
        set((s) => ({
          completedIds: s.completedIds.includes(id)
            ? s.completedIds.filter((x) => x !== id)
            : [...s.completedIds, id],
        })),
      clear: () => set({ completedIds: [] }),
      setViewMode: (mode) => set({ viewMode: mode }),
      addCustomItem: (item) => {
        const state = get();
        const maxSort = Math.max(
          0,
          ...state.customItems.map((i) => i.sortOrder)
        );
        const newItem: ChecklistItemData = {
          ...item,
          id: `custom-${crypto.randomUUID()}`,
          sortOrder: Math.max(maxSort, 100) + 1,
        };
        set({ customItems: [...state.customItems, newItem] });
      },
      deleteCustomItem: (id) =>
        set((s) => ({
          customItems: s.customItems.filter((i) => i.id !== id),
          completedIds: s.completedIds.filter((x) => x !== id),
        })),
    }),
    {
      name: "quaipulse-checklist",
    }
  )
);
