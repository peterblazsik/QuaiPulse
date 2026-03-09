"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PriorityWeights } from "@/lib/types";

const DEFAULT_WEIGHTS: PriorityWeights = {
  commute: 9,
  gym: 10,
  social: 10,
  lake: 6,
  airport: 7,
  food: 8,
  quiet: 7,
  transit: 6,
  cost: 7,
  safety: 6,
  flightNoise: 4,
  parking: 3,
};

export const BUILT_IN_PROFILES: Record<string, PriorityWeights> = {
  "Commute & Gym Focus": {
    commute: 10, gym: 10, social: 7, lake: 4, airport: 5,
    food: 6, quiet: 5, transit: 8, cost: 5, safety: 6, flightNoise: 3, parking: 2,
  },
  "Budget Conscious": {
    commute: 7, gym: 8, social: 6, lake: 3, airport: 5,
    food: 6, quiet: 6, transit: 7, cost: 10, safety: 7, flightNoise: 4, parking: 3,
  },
};

interface PriorityStore {
  weights: PriorityWeights;
  profiles: Record<string, PriorityWeights>;
  setWeight: (dimension: keyof PriorityWeights, value: number) => void;
  resetWeights: () => void;
  saveProfile: (name: string) => void;
  loadProfile: (name: string) => void;
  deleteProfile: (name: string) => void;
}

export const usePriorityStore = create<PriorityStore>()(
  persist(
    (set, get) => ({
      weights: { ...DEFAULT_WEIGHTS },
      profiles: {},
      setWeight: (dimension, value) =>
        set((s) => ({ weights: { ...s.weights, [dimension]: value } })),
      resetWeights: () => set({ weights: { ...DEFAULT_WEIGHTS } }),
      saveProfile: (name) =>
        set((s) => ({ profiles: { ...s.profiles, [name]: { ...s.weights } } })),
      loadProfile: (name) => {
        const builtin = BUILT_IN_PROFILES[name];
        const user = get().profiles[name];
        const weights = builtin ?? user;
        if (weights) set({ weights: { ...weights } });
      },
      deleteProfile: (name) =>
        set((s) => {
          const { [name]: _, ...rest } = s.profiles;
          return { profiles: rest };
        }),
    }),
    { name: "quaipulse-priorities" }
  )
);
