"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc/client";
import { useLanguageStore } from "@/lib/stores/language-store";
import type { CardState } from "@/lib/engines/spaced-repetition";

const LS_KEY = "quaipulse-language";

export function useSyncedLanguage() {
  const { data: session } = useSession();
  const migrated = useRef(false);
  const utils = trpc.useUtils();
  const cardQuery = trpc.language.getCardStates.useQuery(undefined, {
    enabled: !!session?.user?.id,
  });
  const metaQuery = trpc.language.getMeta.useQuery(undefined, {
    enabled: !!session?.user?.id,
  });
  const upsertCard = trpc.language.upsertCard.useMutation({
    onSuccess: () => utils.language.getCardStates.invalidate(),
  });
  const upsertMeta = trpc.language.upsertMeta.useMutation({
    onSuccess: () => utils.language.getMeta.invalidate(),
  });

  useEffect(() => {
    if (!session?.user?.id || migrated.current) return;
    if (cardQuery.isLoading || metaQuery.isLoading) return;

    const serverCards = cardQuery.data;
    const serverMeta = metaQuery.data;

    if ((!serverCards || serverCards.length === 0) && !serverMeta) {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          const state = parsed.state ?? parsed;
          const cardStates: Record<string, CardState> = state.cardStates ?? {};
          for (const [phraseId, card] of Object.entries(cardStates)) {
            upsertCard.mutate({
              phraseId,
              easeFactor: card.easeFactor,
              interval: card.interval,
              repetitions: card.repetitions,
              nextReview: card.nextReview,
              lastReview: null,
              lastQuality: card.lastQuality ?? null,
            });
          }
          upsertMeta.mutate({
            reviewStreak: state.reviewStreak ?? 0,
            lastReviewDate: state.lastReviewDate ?? null,
          });
          localStorage.removeItem(LS_KEY);
        } catch { /* */ }
      }
    } else {
      // Hydrate from server
      const cardStates: Record<string, CardState> = {};
      if (serverCards) {
        for (const c of serverCards) {
          cardStates[c.phraseId] = {
            phraseId: c.phraseId,
            easeFactor: c.easeFactor,
            interval: c.interval,
            repetitions: c.repetitions,
            nextReview: c.nextReview,
            lastQuality: c.lastQuality ?? undefined,
          };
        }
      }
      useLanguageStore.setState({
        cardStates,
        reviewStreak: serverMeta?.reviewStreak ?? 0,
        lastReviewDate: serverMeta?.lastReviewDate ?? null,
      });
      localStorage.removeItem(LS_KEY);
    }

    migrated.current = true;
  }, [session?.user?.id, cardQuery.isLoading, metaQuery.isLoading, cardQuery.data, metaQuery.data, upsertCard, upsertMeta, utils]);

  const saveCard = (phraseId: string, card: CardState) => {
    if (!session?.user?.id) return;
    upsertCard.mutate({
      phraseId,
      easeFactor: card.easeFactor,
      interval: card.interval,
      repetitions: card.repetitions,
      nextReview: card.nextReview,
      lastReview: null,
      lastQuality: card.lastQuality ?? null,
    });
  };

  const saveMeta = () => {
    if (!session?.user?.id) return;
    const s = useLanguageStore.getState();
    upsertMeta.mutate({
      reviewStreak: s.reviewStreak,
      lastReviewDate: s.lastReviewDate,
    });
  };

  return { saveCard, saveMeta, isLoading: cardQuery.isLoading || metaQuery.isLoading };
}
