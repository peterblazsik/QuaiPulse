"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ScrapedApartment } from "@/lib/engines/flatfox-scraper";

type SortKey = "price_asc" | "price_desc" | "newest" | "sqm_desc" | "rooms_desc";

interface FeedFilters {
  minPrice: number;
  maxPrice: number;
  minSqm: number;
  maxSqm: number;
  minRooms: number;
  maxRooms: number;
  kreise: number[];
  onlyWithImages: boolean;
}

interface ApartmentFeedStore {
  apartments: ScrapedApartment[];
  lastScrapedAt: string | null;
  isLoading: boolean;
  error: string | null;
  sort: SortKey;
  filters: FeedFilters;
  dismissedIds: string[];

  fetch: () => Promise<void>;
  setSort: (sort: SortKey) => void;
  setFilter: <K extends keyof FeedFilters>(key: K, value: FeedFilters[K]) => void;
  dismiss: (id: string) => void;
  undismiss: (id: string) => void;
  getFiltered: () => ScrapedApartment[];
}

const DEFAULT_FILTERS: FeedFilters = {
  minPrice: 1500,
  maxPrice: 3500,
  minSqm: 45,
  maxSqm: 72,
  minRooms: 1,
  maxRooms: 3.5,
  kreise: [2, 3, 4, 5, 8],
  onlyWithImages: false,
};

function sortApartments(apts: ScrapedApartment[], key: SortKey): ScrapedApartment[] {
  const sorted = [...apts];
  switch (key) {
    case "price_asc":
      return sorted.sort((a, b) => a.rentDisplay - b.rentDisplay);
    case "price_desc":
      return sorted.sort((a, b) => b.rentDisplay - a.rentDisplay);
    case "newest":
      return sorted.sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    case "sqm_desc":
      return sorted.sort((a, b) => (b.sqm ?? 0) - (a.sqm ?? 0));
    case "rooms_desc":
      return sorted.sort((a, b) => (b.rooms ?? 0) - (a.rooms ?? 0));
    default:
      return sorted;
  }
}

export const useApartmentFeedStore = create<ApartmentFeedStore>()(
  persist(
    (set, get) => ({
      apartments: [],
      lastScrapedAt: null,
      isLoading: false,
      error: null,
      sort: "newest",
      filters: DEFAULT_FILTERS,
      dismissedIds: [],

      fetch: async () => {
        set({ isLoading: true, error: null });
        try {
          const { filters } = get();
          const params = new URLSearchParams({
            minSqm: String(filters.minSqm),
            maxSqm: String(filters.maxSqm),
            minPrice: String(filters.minPrice),
            maxPrice: String(filters.maxPrice),
          });
          const res = await window.fetch(`/api/apartments?${params}`);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          set({
            apartments: data.apartments,
            lastScrapedAt: data.scrapedAt,
            isLoading: false,
          });
        } catch (e) {
          set({
            error: e instanceof Error ? e.message : "Failed to fetch",
            isLoading: false,
          });
        }
      },

      setSort: (sort) => set({ sort }),

      setFilter: (key, value) =>
        set((s) => ({ filters: { ...s.filters, [key]: value } })),

      dismiss: (id) =>
        set((s) => ({ dismissedIds: [...s.dismissedIds, id] })),

      undismiss: (id) =>
        set((s) => ({
          dismissedIds: s.dismissedIds.filter((d) => d !== id),
        })),

      getFiltered: () => {
        const { apartments, sort, filters, dismissedIds } = get();
        const filtered = apartments.filter((apt) => {
          if (dismissedIds.includes(apt.id)) return false;
          if (apt.rentDisplay < filters.minPrice || apt.rentDisplay > filters.maxPrice) return false;
          if (apt.sqm && (apt.sqm < filters.minSqm || apt.sqm > filters.maxSqm)) return false;
          if (apt.rooms && (apt.rooms < filters.minRooms || apt.rooms > filters.maxRooms)) return false;
          if (filters.kreise.length > 0 && apt.kreis > 0 && !filters.kreise.includes(apt.kreis))
            return false;
          if (filters.onlyWithImages && !apt.imageUrl) return false;
          return true;
        });
        return sortApartments(filtered, sort);
      },
    }),
    {
      name: "quaipulse-apartment-feed",
      partialize: (state) => ({
        apartments: state.apartments,
        lastScrapedAt: state.lastScrapedAt,
        sort: state.sort,
        filters: state.filters,
        dismissedIds: state.dismissedIds,
      }),
    }
  )
);
