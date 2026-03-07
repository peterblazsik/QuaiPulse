"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CardState } from "@/lib/engines/spaced-repetition";
import { createInitialState, reviewCard, isDue } from "@/lib/engines/spaced-repetition";

interface LanguageStore {
  cardStates: Record<string, CardState>;
  reviewStreak: number;
  lastReviewDate: string | null;

  initCard: (phraseId: string) => void;
  review: (phraseId: string, quality: number) => void;
  getDueCards: () => CardState[];
  getCardState: (phraseId: string) => CardState;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      cardStates: {},
      reviewStreak: 0,
      lastReviewDate: null,

      initCard: (phraseId) =>
        set((s) => {
          if (s.cardStates[phraseId]) return s;
          return {
            cardStates: {
              ...s.cardStates,
              [phraseId]: createInitialState(phraseId),
            },
          };
        }),

      review: (phraseId, quality) =>
        set((s) => {
          const current = s.cardStates[phraseId] || createInitialState(phraseId);
          const updated = reviewCard(current, quality);
          const today = new Date().toISOString().split("T")[0];
          const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

          let streak = s.reviewStreak;
          if (s.lastReviewDate === yesterday || s.lastReviewDate === today) {
            if (s.lastReviewDate !== today) streak += 1;
          } else if (s.lastReviewDate !== today) {
            streak = 1;
          }

          return {
            cardStates: { ...s.cardStates, [phraseId]: updated },
            reviewStreak: streak,
            lastReviewDate: today,
          };
        }),

      getDueCards: () => {
        const { cardStates } = get();
        return Object.values(cardStates).filter(isDue);
      },

      getCardState: (phraseId) => {
        const { cardStates } = get();
        return cardStates[phraseId] || createInitialState(phraseId);
      },
    }),
    { name: "quaipulse-language" }
  )
);
