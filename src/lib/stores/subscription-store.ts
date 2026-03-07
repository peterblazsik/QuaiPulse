"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SubAction, SubscriptionData } from "@/lib/data/subscriptions";

interface SubscriptionStore {
  decisions: Record<string, SubAction>;
  customSubs: SubscriptionData[];
  setDecision: (id: string, action: SubAction) => void;
  addCustomSub: (sub: SubscriptionData) => void;
  removeCustomSub: (id: string) => void;
  resetDecisions: () => void;
}

export const useSubscriptionStore = create<SubscriptionStore>()(
  persist(
    (set) => ({
      decisions: {},
      customSubs: [],
      setDecision: (id, action) =>
        set((s) => ({
          decisions: { ...s.decisions, [id]: action },
        })),
      addCustomSub: (sub) =>
        set((s) => ({
          customSubs: [...s.customSubs, sub],
        })),
      removeCustomSub: (id) =>
        set((s) => ({
          customSubs: s.customSubs.filter((s) => s.id !== id),
          decisions: Object.fromEntries(
            Object.entries(s.decisions).filter(([k]) => k !== id)
          ),
        })),
      resetDecisions: () => set({ decisions: {} }),
    }),
    { name: "quaipulse-subscriptions" }
  )
);
