"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { TrendingUp, Loader2, Map, Table2, Building2, ArrowRight } from "lucide-react";
import { useRentalIntelStore } from "@/lib/stores/rental-intel-store";
import { RENTAL_INTEL_IMAGES } from "@/lib/data/images";
import type { ListingSource } from "@/lib/types";
import { MarketOverview } from "@/components/rental-intel/market-overview";
import { PriceDistributionChart } from "@/components/rental-intel/price-distribution-chart";
import { PriceHeatmap } from "@/components/rental-intel/price-heatmap";
import { SourceComparison } from "@/components/rental-intel/source-comparison";
import { SupplyDemandChart } from "@/components/rental-intel/supply-demand-chart";
import { BudgetFitPanel } from "@/components/rental-intel/budget-fit-panel";
import { ValueScoreTable } from "@/components/rental-intel/value-score-table";
import { ListingDetailDrawer } from "@/components/rental-intel/listing-detail-drawer";
import { FilterBar } from "@/components/rental-intel/filter-bar";
import { ListingMap } from "@/components/rental-intel/listing-map";
import { ReferenzzinsCalculator } from "@/components/rental-intel/referenzzins-calculator";

type ViewMode = "table" | "map";

export default function RentalIntelPage() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const {
    isLoading,
    error,
    filters,
    allListings,
    selectedListingId,
    enrichmentResults,
    initialize,
    setFilter,
    selectListing,
    addEnrichment,
    getFiltered,
    getOverview,
    getPriceDistribution,
    getPriceHeatmap,
    getBudgetAnalysis,
    getSupply,
    getSourceComparison,
    getTopPicks,
  } = useRentalIntelStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Apply Kreis filter from URL query param (e.g., from neighborhood detail)
  useEffect(() => {
    const kreisParam = searchParams.get("kreis");
    if (kreisParam) {
      const kreis = Number(kreisParam);
      if (kreis > 0 && kreis <= 12) {
        setFilter("kreise", [kreis]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = getFiltered();
  const overview = getOverview();
  const priceDistribution = getPriceDistribution();
  const priceHeatmap = getPriceHeatmap();
  const budgetAnalysis = getBudgetAnalysis();
  const supply = getSupply();
  const sourceComparison = getSourceComparison();
  const topPicks = getTopPicks();

  const selectedListing = selectedListingId
    ? allListings.find((l) => l.id === selectedListingId) ?? null
    : null;

  const handleKreisToggle = (kreis: number) => {
    const current = filters.kreise;
    if (current.includes(kreis)) {
      setFilter("kreise", current.filter((k) => k !== kreis));
    } else {
      setFilter("kreise", [...current, kreis]);
    }
  };

  const handleSourceToggle = (source: ListingSource) => {
    const current = filters.sources;
    if (current.includes(source) && current.length > 1) {
      setFilter("sources", current.filter((s) => s !== source));
    } else if (!current.includes(source)) {
      setFilter("sources", [...current, source]);
    }
  };

  const handleEnrich = async (id: string) => {
    const listing = allListings.find((l) => l.id === id);
    if (!listing) return;

    try {
      const res = await window.fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: listing.sourceUrl }),
      });
      if (res.ok) {
        const result = await res.json();
        addEnrichment(id, result.data);
      }
    } catch {
      // Enrichment is best-effort
    }
  };

  if (isLoading && allListings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--accent-primary)]" />
        <p className="text-sm text-[var(--text-tertiary)]">
          Loading rental intelligence...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border-default)] h-48">
        <Image
          src={RENTAL_INTEL_IMAGES.hero}
          alt="Zurich rooftops at twilight"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--overlay-rgb))/0.85] via-[rgb(var(--overlay-rgb))/0.6] to-transparent" />
        <div className="relative h-full flex items-end p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/20 backdrop-blur-sm p-2.5 border border-cyan-500/20">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white drop-shadow-lg">
                Rental Intelligence
              </h1>
              <p className="text-xs text-white/70">
                {allListings.length} listings from Flatfox + Homegate · {filtered.length} after filters
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        kreise={filters.kreise}
        sources={filters.sources}
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        onKreisToggle={handleKreisToggle}
        onSourceToggle={handleSourceToggle}
        onPriceChange={(min, max) => {
          setFilter("minPrice", min);
          setFilter("maxPrice", max);
        }}
      />

      {/* KPI Cards */}
      <MarketOverview data={overview} />

      {/* Two-column: Price Distribution + Source Comparison */}
      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <PriceDistributionChart data={priceDistribution} />
        <SourceComparison data={sourceComparison} />
      </div>

      {/* Price/m² Heatmap */}
      <PriceHeatmap data={priceHeatmap} />

      {/* Supply & Demand */}
      <SupplyDemandChart data={supply} />

      {/* Budget Fit + Referenzzins */}
      <div className="grid gap-4 lg:grid-cols-2">
        <BudgetFitPanel data={budgetAnalysis} />
        <ReferenzzinsCalculator />
      </div>

      {/* View Toggle + Top Picks */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">
          {viewMode === "table" ? "Top Picks — Value Score Ranking" : "Listing Map"}
        </h2>
        <div className="flex rounded-lg border border-[var(--border-default)] overflow-hidden">
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors ${
              viewMode === "table"
                ? "bg-[var(--accent-primary)] text-white"
                : "bg-[var(--bg-secondary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Table2 className="h-3.5 w-3.5" />
            Table
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors ${
              viewMode === "map"
                ? "bg-[var(--accent-primary)] text-white"
                : "bg-[var(--bg-secondary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Map className="h-3.5 w-3.5" />
            Map
          </button>
        </div>
      </div>

      {viewMode === "table" ? (
        <ValueScoreTable
          listings={topPicks}
          onSelect={(id) => selectListing(id)}
        />
      ) : (
        <ListingMap
          listings={filtered}
          onSelect={(id) => selectListing(id)}
        />
      )}

      {/* Cross-link to Apartments */}
      <Link
        href="/apartments"
        className="group flex items-center gap-3 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 hover:border-purple-500/40 transition-colors"
      >
        <Building2 className="h-5 w-5 text-purple-400 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-text-primary">
            Looking for specific listings?
          </p>
          <p className="text-[10px] text-text-muted mt-0.5">
            The Apartments page has a live Flatfox feed with save-to-pipeline, plus links to all major portals.
          </p>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-semibold text-purple-400 shrink-0 group-hover:gap-1.5 transition-all">
          Live Feed
          <ArrowRight className="h-3 w-3" />
        </span>
      </Link>

      {/* Detail Drawer */}
      <ListingDetailDrawer
        listing={selectedListing}
        enrichment={selectedListingId ? enrichmentResults[selectedListingId] : undefined}
        onClose={() => selectListing(null)}
        onEnrich={handleEnrich}
      />
    </div>
  );
}
