"use client";

import { create } from "zustand";
import type { PriorityWeights } from "@/lib/types";

interface PriorityStore {
  weights: PriorityWeights;
  setWeight: (dimension: keyof PriorityWeights, value: number) => void;
  resetWeights: () => void;
}

const DEFAULT_WEIGHTS: PriorityWeights = {
  commute: 9,
  gym: 10,
  social: 10,
  lake: 6,
  airport: 7,
  food: 8,
  quiet: 7,
  transit: 6,
};

export const usePriorityStore = create<PriorityStore>((set) => ({
  weights: { ...DEFAULT_WEIGHTS },
  setWeight: (dimension, value) =>
    set((s) => ({ weights: { ...s.weights, [dimension]: value } })),
  resetWeights: () => set({ weights: { ...DEFAULT_WEIGHTS } }),
}));
