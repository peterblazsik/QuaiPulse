"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PLANNED_VISITS, type KatieVisitData } from "@/lib/data/katie-visits";

interface KatieStore {
  visits: KatieVisitData[];
  addVisit: (visit: Omit<KatieVisitData, "id">) => void;
  removeVisit: (id: string) => void;
  updateVisit: (id: string, updates: Partial<KatieVisitData>) => void;
}

export const useKatieStore = create<KatieStore>()(
  persist(
    (set) => ({
      visits: PLANNED_VISITS,
      addVisit: (visit) =>
        set((s) => ({
          visits: [...s.visits, { ...visit, id: `kv-${Date.now()}` }],
        })),
      removeVisit: (id) =>
        set((s) => ({ visits: s.visits.filter((v) => v.id !== id) })),
      updateVisit: (id, updates) =>
        set((s) => ({
          visits: s.visits.map((v) => (v.id === id ? { ...v, ...updates } : v)),
        })),
    }),
    { name: "quaipulse-katie" }
  )
);
