"use client";

import { useSyncedBudget } from "./use-synced-budget";
import { useSyncedPriority } from "./use-synced-priority";
import { useSyncedChecklist } from "./use-synced-checklist";
import { useSyncedDossier } from "./use-synced-dossier";
import { useSyncedSubscription } from "./use-synced-subscription";
import { useSyncedGymFilter } from "./use-synced-gym-filter";
import { useSyncedFeedPrefs } from "./use-synced-feed-prefs";
import { useSyncedApartments } from "./use-synced-apartments";
import { useSyncedKatie } from "./use-synced-katie";
import { useSyncedSleep } from "./use-synced-sleep";
import { useSyncedChat } from "./use-synced-chat";
import { useSyncedLanguage } from "./use-synced-language";

/**
 * Master sync hook — call once in a layout-level component.
 * Handles initial hydration from server and localStorage migration for all stores.
 */
export function useSyncAll() {
  const budget = useSyncedBudget();
  const priority = useSyncedPriority();
  const checklist = useSyncedChecklist();
  const dossier = useSyncedDossier();
  const subscription = useSyncedSubscription();
  const gymFilter = useSyncedGymFilter();
  const feedPrefs = useSyncedFeedPrefs();
  const apartments = useSyncedApartments();
  const katie = useSyncedKatie();
  const sleep = useSyncedSleep();
  const chat = useSyncedChat();
  const language = useSyncedLanguage();

  return {
    budget,
    priority,
    checklist,
    dossier,
    subscription,
    gymFilter,
    feedPrefs,
    apartments,
    katie,
    sleep,
    chat,
    language,
    isLoading:
      budget.isLoading ||
      priority.isLoading ||
      checklist.isLoading ||
      dossier.isLoading ||
      subscription.isLoading ||
      gymFilter.isLoading ||
      feedPrefs.isLoading ||
      apartments.isLoading ||
      katie.isLoading ||
      sleep.isLoading ||
      chat.isLoading ||
      language.isLoading,
  };
}
