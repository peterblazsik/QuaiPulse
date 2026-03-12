"use client";

import { useEffect } from "react";
import { TrendingUp, Loader2 } from "lucide-react";
import { useRentalIntelStore } from "@/lib/stores/rental-intel-store";
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

export default function RentalIntelPage() {
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
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-6">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-xl bg-cyan-500/10 p-2.5">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[var(--text-primary)]">
                Rental Intelligence
              </h1>
              <p className="text-xs text-[var(--text-tertiary)]">
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

      {/* Budget Fit */}
      <BudgetFitPanel data={budgetAnalysis} />

      {/* Top Picks Table */}
      <ValueScoreTable
        listings={topPicks}
        onSelect={(id) => selectListing(id)}
      />

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
