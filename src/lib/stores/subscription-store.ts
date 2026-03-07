"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SubAction } from "@/lib/data/subscriptions";

interface SubscriptionStore {
  decisions: Record<string, SubAction>;
  setDecision: (id: string, action: SubAction) => void;
  resetDecisions: () => void;
}

export const useSubscriptionStore = create<SubscriptionStore>()(
  persist(
    (set) => ({
      decisions: {},
      setDecision: (id, action) =>
        set((s) => ({
          decisions: { ...s.decisions, [id]: action },
        })),
      resetDecisions: () => set({ decisions: {} }),
    }),
    { name: "quaipulse-subscriptions" }
  )
);
