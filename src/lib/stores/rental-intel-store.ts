"use client";

import { create } from "zustand";
import type { UnifiedListing, ListingSource } from "@/lib/types";
import { mergeListings, type HomegateRaw } from "@/lib/engines/listing-normalizer";
import {
  computeMarketOverview,
  computePriceDistribution,
  computePricePerSqmByKreis,
  computeBudgetFit,
  computeSupplyByKreis,
  computeSourceComparison,
  computeTopPicks,
  type MarketOverview,
  type KreisDistribution,
  type KreisPricePerSqm,
  type BudgetAnalysis,
  type KreisSupply,
  type SourceStats,
} from "@/lib/engines/rental-intelligence";
import type { ScrapedApartment } from "@/lib/engines/flatfox-scraper";

// Import static data
import homegateData from "@/lib/data/homegate-export.json";

interface RentalIntelFilters {
  kreise: number[];
  sources: ListingSource[];
  minPrice: number;
  maxPrice: number;
  minRooms: number;
  maxRooms: number;
}

type SortKey = "valueScore" | "rent_asc" | "rent_desc" | "pricePerSqm" | "rooms" | "sqm";

interface RentalIntelStore {
  // Data
  allListings: UnifiedListing[];
  flatfoxListings: ScrapedApartment[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;

  // Filters & sort
  filters: RentalIntelFilters;
  sort: SortKey;

  // Enrichment
  enrichmentResults: Record<string, Record<string, unknown>>;

  // Selected listing for drawer
  selectedListingId: string | null;

  // Actions
  initialize: () => Promise<void>;
  setFilter: <K extends keyof RentalIntelFilters>(key: K, value: RentalIntelFilters[K]) => void;
  setSort: (sort: SortKey) => void;
  selectListing: (id: string | null) => void;
  addEnrichment: (id: string, data: Record<string, unknown>) => void;

  // Computed (getters)
  getFiltered: () => UnifiedListing[];
  getOverview: () => MarketOverview;
  getPriceDistribution: () => KreisDistribution[];
  getPriceHeatmap: () => KreisPricePerSqm[];
  getBudgetAnalysis: () => BudgetAnalysis;
  getSupply: () => KreisSupply[];
  getSourceComparison: () => SourceStats[];
  getTopPicks: () => UnifiedListing[];
}

const DEFAULT_FILTERS: RentalIntelFilters = {
  kreise: [],
  sources: ["flatfox", "homegate"],
  minPrice: 0,
  maxPrice: 10000,
  minRooms: 0,
  maxRooms: 10,
};

function sortListings(listings: UnifiedListing[], key: SortKey): UnifiedListing[] {
  const sorted = [...listings];
  switch (key) {
    case "valueScore":
      return sorted.sort((a, b) => b.valueScore - a.valueScore);
    case "rent_asc":
      return sorted.sort((a, b) => a.rent - b.rent);
    case "rent_desc":
      return sorted.sort((a, b) => b.rent - a.rent);
    case "pricePerSqm":
      return sorted.sort((a, b) => (a.pricePerSqm ?? 999) - (b.pricePerSqm ?? 999));
    case "rooms":
      return sorted.sort((a, b) => (b.rooms ?? 0) - (a.rooms ?? 0));
    case "sqm":
      return sorted.sort((a, b) => (b.sqm ?? 0) - (a.sqm ?? 0));
    default:
      return sorted;
  }
}

function applyFilters(listings: UnifiedListing[], filters: RentalIntelFilters): UnifiedListing[] {
  return listings.filter((l) => {
    if (filters.kreise.length > 0 && !filters.kreise.includes(l.kreis)) return false;
    if (!filters.sources.includes(l.source)) return false;
    if (l.rent < filters.minPrice || l.rent > filters.maxPrice) return false;
    if (l.rooms != null && (l.rooms < filters.minRooms || l.rooms > filters.maxRooms)) return false;
    return true;
  });
}

export const useRentalIntelStore = create<RentalIntelStore>()((set, get) => ({
  allListings: [],
  flatfoxListings: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
  filters: DEFAULT_FILTERS,
  sort: "valueScore",
  enrichmentResults: {},
  selectedListingId: null,

  initialize: async () => {
    const { allListings } = get();
    if (allListings.length > 0) return; // already loaded

    set({ isLoading: true, error: null });

    try {
      // Homegate: load from static JSON
      const hg = homegateData as HomegateRaw[];

      // Flatfox: try to fetch live, fall back to empty
      let ff: ScrapedApartment[] = [];
      try {
        const res = await window.fetch("/api/apartments?minSqm=20&maxSqm=200&count=500");
        if (res.ok) {
          const data = await res.json();
          ff = data.apartments ?? [];
        }
      } catch {
        // Flatfox API unavailable — proceed with Homegate only
      }

      const merged = mergeListings(ff, hg);

      set({
        allListings: merged,
        flatfoxListings: ff,
        isLoading: false,
        lastUpdated: new Date().toISOString(),
      });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Failed to load listings",
        isLoading: false,
      });
    }
  },

  setFilter: (key, value) =>
    set((s) => ({ filters: { ...s.filters, [key]: value } })),

  setSort: (sort) => set({ sort }),

  selectListing: (id) => set({ selectedListingId: id }),

  addEnrichment: (id, data) =>
    set((s) => ({
      enrichmentResults: { ...s.enrichmentResults, [id]: data },
    })),

  getFiltered: () => {
    const { allListings, filters, sort } = get();
    return sortListings(applyFilters(allListings, filters), sort);
  },

  getOverview: () => {
    const filtered = get().getFiltered();
    return computeMarketOverview(filtered);
  },

  getPriceDistribution: () => {
    const filtered = get().getFiltered();
    return computePriceDistribution(filtered);
  },

  getPriceHeatmap: () => {
    const filtered = get().getFiltered();
    return computePricePerSqmByKreis(filtered);
  },

  getBudgetAnalysis: () => {
    const filtered = get().getFiltered();
    return computeBudgetFit(filtered);
  },

  getSupply: () => {
    const filtered = get().getFiltered();
    return computeSupplyByKreis(filtered);
  },

  getSourceComparison: () => {
    const { allListings } = get();
    return computeSourceComparison(allListings);
  },

  getTopPicks: () => {
    const filtered = get().getFiltered();
    return computeTopPicks(filtered);
  },
}));
