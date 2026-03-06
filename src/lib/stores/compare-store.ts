"use client";

import { create } from "zustand";

interface CompareStore {
  selectedIds: string[];
  toggle: (id: string) => void;
  clear: () => void;
  isSelected: (id: string) => boolean;
}

const MAX_COMPARE = 4;

export const useCompareStore = create<CompareStore>()((set, get) => ({
  selectedIds: [],
  toggle: (id) =>
    set((s) => {
      if (s.selectedIds.includes(id)) {
        return { selectedIds: s.selectedIds.filter((x) => x !== id) };
      }
      if (s.selectedIds.length >= MAX_COMPARE) return s;
      return { selectedIds: [...s.selectedIds, id] };
    }),
  clear: () => set({ selectedIds: [] }),
  isSelected: (id) => get().selectedIds.includes(id),
}));
