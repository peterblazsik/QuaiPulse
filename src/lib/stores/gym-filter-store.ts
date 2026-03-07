"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { EquipmentType } from "@/lib/data/gyms";

interface GymFilterStore {
  selectedEquipment: EquipmentType[];
  toggleEquipment: (eq: EquipmentType) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  kneeSafeOnly: boolean;
  setKneeSafeOnly: (v: boolean) => void;
  compareIds: string[];
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
}

export const useGymFilterStore = create<GymFilterStore>()(
  persist(
    (set) => ({
      selectedEquipment: [],
      toggleEquipment: (eq) =>
        set((s) => ({
          selectedEquipment: s.selectedEquipment.includes(eq)
            ? s.selectedEquipment.filter((e) => e !== eq)
            : [...s.selectedEquipment, eq],
        })),
      priceRange: [0, 200],
      setPriceRange: (range) => set({ priceRange: range }),
      kneeSafeOnly: false,
      setKneeSafeOnly: (v) => set({ kneeSafeOnly: v }),
      compareIds: [],
      toggleCompare: (id) =>
        set((s) => ({
          compareIds: s.compareIds.includes(id)
            ? s.compareIds.filter((x) => x !== id)
            : s.compareIds.length < 3
              ? [...s.compareIds, id]
              : s.compareIds,
        })),
      clearCompare: () => set({ compareIds: [] }),
    }),
    { name: "quaipulse-gym-filter" },
  ),
);
