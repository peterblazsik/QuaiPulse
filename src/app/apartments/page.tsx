"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Building2,
  ExternalLink,
  Plus,
  X,
  Search,
  RefreshCw,
  Rss,
  ListFilter,
  ArrowUpDown,
  Clock,
} from "lucide-react";
import { PORTALS, SEARCH_CRITERIA } from "@/lib/data/portal-urls";
import { formatCHF } from "@/lib/utils";
import type { ApartmentStatus } from "@/lib/types";
import { HERO_IMAGES } from "@/lib/data/images";
import { useApartmentStore } from "@/lib/stores/apartment-store";
import { useApartmentFeedStore } from "@/lib/stores/apartment-feed-store";
import { ApartmentCard } from "@/components/apartments/apartment-card";
import { AddListingForm } from "@/components/apartments/add-listing-form";
import { FeedCard } from "@/components/apartments/feed-card";

type Tab = "feed" | "pipeline" | "portals";
type SortKey = "price_asc" | "price_desc" | "newest" | "sqm_desc" | "rooms_desc";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "price_asc", label: "Price ↑" },
  { key: "price_desc", label: "Price ↓" },
  { key: "sqm_desc", label: "Size ↓" },
  { key: "rooms_desc", label: "Rooms ↓" },
];

const STATUS_CONFIG: { key: ApartmentStatus; label: string; color: string }[] = [
  { key: "new", label: "New", color: "#64748b" },
  { key: "interested", label: "Interested", color: "#3b82f6" },
  { key: "contacted", label: "Contacted", color: "#f59e0b" },
  { key: "viewing_scheduled", label: "Viewing", color: "#8b5cf6" },
  { key: "applied", label: "Applied", color: "#06b6d4" },
  { key: "rejected", label: "Rejected", color: "#ef4444" },
  { key: "accepted", label: "Accepted", color: "#22c55e" },
];

const KREIS_OPTIONS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function ApartmentsPage() {
  const { apartments, add, remove, updateStatus } = useApartmentStore();
  const feed = useApartmentFeedStore();
  const feedApartments = useApartmentFeedStore((s) => s.apartments);
  const feedSort = useApartmentFeedStore((s) => s.sort);
  const feedFilters = useApartmentFeedStore((s) => s.filters);
  const feedDismissedIds = useApartmentFeedStore((s) => s.dismissedIds);
  const filteredFeed = useMemo(() => feed.getFiltered(), [feedApartments, feedSort, feedFilters, feedDismissedIds]);

  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>((searchParams.get("tab") as Tab) || "feed");
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ApartmentStatus | "all">("all");
  const [showFilters, setShowFilters] = useState(false);

  // Apply Kreis filter from URL query param (e.g., from neighborhood detail page)
  useEffect(() => {
    const kreisParam = searchParams.get("kreis");
    if (kreisParam) {
      const kreis = Number(kreisParam);
      if (kreis > 0 && kreis <= 12) {
        feed.setFilter("kreise", [kreis]);
        setShowFilters(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const topKreise = SEARCH_CRITERIA.targetKreise;

  // Auto-fetch on mount if no data or stale (> 1h)
  useEffect(() => {
    const staleMs = 60 * 60 * 1000;
    const isStale =
      !feed.lastScrapedAt ||
      Date.now() - new Date(feed.lastScrapedAt).getTime() > staleMs;
    if (isStale && !feed.isLoading && feed.apartments.length === 0) {
      feed.fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveFromFeed = useCallback(
    (apt: (typeof filteredFeed)[number]) => {
      add({
        title: apt.title,
        address: apt.address,
        kreis: apt.kreis,
        rent: apt.rentDisplay,
        rooms: apt.rooms ?? 0,
        sqm: apt.sqm ?? 0,
        sourceUrl: apt.sourceUrl,
        status: "new",
        notes: "",
      });
    },
    [add]
  );

  const savedUrls = new Set(apartments.map((a) => a.sourceUrl));

  const filteredPipeline =
    statusFilter === "all"
      ? apartments
      : apartments.filter((a) => a.status === statusFilter);

  return (
    <div className="space-y-6 relative">
      {/* Ambient glow */}
      <div className="ambient-glow glow-purple" />

      {/* Hero banner */}
      <div className="card-hero relative h-36 overflow-hidden rounded-xl">
        <Image
          src={HERO_IMAGES.apartments}
          alt="Modern apartment interior"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="img-overlay-full" />
        <div className="relative z-10 flex h-full items-end justify-between p-5">
          <div>
            <h1 className="font-display text-2xl font-bold text-text-primary">
              Apartment Listings
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Target: {SEARCH_CRITERIA.rooms} rooms, {formatCHF(SEARCH_CRITERIA.priceMin)}-
              {formatCHF(SEARCH_CRITERIA.priceMax)}, Kreis {topKreise.join(", ")}.
            </p>
          </div>
          {tab === "pipeline" && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-1.5 rounded-lg bg-accent-primary px-3 py-2 text-xs font-medium text-white hover:bg-accent-hover transition-colors shrink-0"
            >
              {showForm ? (
                <X className="h-3.5 w-3.5" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              {showForm ? "Cancel" : "Add Listing"}
            </button>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-border-default">
        {([
          { key: "feed" as Tab, label: "Live Feed", icon: Rss, count: filteredFeed.length },
          {
            key: "pipeline" as Tab,
            label: "Pipeline",
            icon: Building2,
            count: apartments.length,
          },
          { key: "portals" as Tab, label: "Portals", icon: Search, count: PORTALS.length },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
              tab === t.key
                ? "border-accent-primary text-accent-primary"
                : "border-transparent text-text-muted hover:text-text-secondary"
            }`}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
            <span
              className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                tab === t.key
                  ? "bg-accent-primary/15 text-accent-primary"
                  : "bg-bg-tertiary text-text-muted"
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* LIVE FEED TAB */}
      {tab === "feed" && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                onClick={() => feed.fetch()}
                disabled={feed.isLoading}
                className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-lg border border-border-default bg-bg-secondary text-text-secondary hover:border-accent-primary/40 hover:text-accent-primary transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-3 w-3 ${feed.isLoading ? "animate-spin" : ""}`}
                />
                {feed.isLoading ? "Scraping..." : "Refresh"}
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-lg border transition-colors ${
                  showFilters
                    ? "border-accent-primary/50 bg-accent-primary/10 text-accent-primary"
                    : "border-border-default bg-bg-secondary text-text-muted hover:text-text-secondary"
                }`}
              >
                <ListFilter className="h-3 w-3" />
                Filters
              </button>
              {feed.lastScrapedAt && (
                <span className="flex items-center gap-1 text-[9px] text-text-muted">
                  <Clock className="h-2.5 w-2.5" />
                  Updated{" "}
                  {new Date(feed.lastScrapedAt).toLocaleTimeString("en-CH", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="h-3 w-3 text-text-muted" />
              {SORT_OPTIONS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => feed.setSort(s.key)}
                  className={`text-[10px] px-2 py-1 rounded transition-colors ${
                    feed.sort === s.key
                      ? "bg-accent-primary/10 text-accent-primary font-medium"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="rounded-xl border border-border-default bg-bg-secondary p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <FilterRange
                  label="Price (CHF)"
                  min={feed.filters.minPrice}
                  max={feed.filters.maxPrice}
                  onMinChange={(v) => feed.setFilter("minPrice", v)}
                  onMaxChange={(v) => feed.setFilter("maxPrice", v)}
                  step={100}
                />
                <FilterRange
                  label="Size (m²)"
                  min={feed.filters.minSqm}
                  max={feed.filters.maxSqm}
                  onMinChange={(v) => feed.setFilter("minSqm", v)}
                  onMaxChange={(v) => feed.setFilter("maxSqm", v)}
                  step={5}
                />
                <div className="col-span-2">
                  <label className="text-[9px] uppercase tracking-wider text-text-muted block mb-1.5">
                    Kreis
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {KREIS_OPTIONS.map((k) => {
                      const active = feed.filters.kreise.includes(k);
                      return (
                        <button
                          key={k}
                          onClick={() =>
                            feed.setFilter(
                              "kreise",
                              active
                                ? feed.filters.kreise.filter((x) => x !== k)
                                : [...feed.filters.kreise, k]
                            )
                          }
                          className={`text-[10px] w-7 h-7 rounded border transition-colors ${
                            active
                              ? "border-accent-primary/50 bg-accent-primary/15 text-accent-primary font-medium"
                              : "border-border-default bg-bg-primary/50 text-text-muted hover:border-accent-primary/30"
                          }`}
                        >
                          {k}
                        </button>
                      );
                    })}
                    <button
                      onClick={() =>
                        feed.setFilter(
                          "kreise",
                          feed.filters.kreise.length === KREIS_OPTIONS.length
                            ? [2, 3, 4, 5, 8]
                            : [...KREIS_OPTIONS]
                        )
                      }
                      className="text-[9px] px-2 py-1 text-text-muted hover:text-accent-primary transition-colors"
                    >
                      {feed.filters.kreise.length === KREIS_OPTIONS.length
                        ? "Reset"
                        : "All"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {feed.error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
              {feed.error}
            </div>
          )}

          {/* Feed listing cards */}
          {feed.isLoading && feed.apartments.length === 0 ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border-default bg-bg-secondary p-4 animate-pulse"
                >
                  <div className="flex gap-4">
                    <div className="w-40 h-24 bg-bg-tertiary rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-bg-tertiary rounded w-3/4" />
                      <div className="h-3 bg-bg-tertiary rounded w-1/2" />
                      <div className="h-3 bg-bg-tertiary rounded w-1/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredFeed.length === 0 ? (
            <div className="rounded-xl border border-border-default bg-bg-secondary p-8 text-center">
              <Rss className="h-8 w-8 text-text-muted mx-auto mb-2" />
              <p className="text-sm text-text-muted">
                {feed.apartments.length > 0
                  ? "No apartments match your filters. Try adjusting."
                  : 'Click "Refresh" to scrape Flatfox for apartments.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFeed.map((apt) => (
                <FeedCard
                  key={apt.id}
                  apt={apt}
                  onSave={() => handleSaveFromFeed(apt)}
                  onDismiss={() => feed.dismiss(apt.id)}
                  isSaved={savedUrls.has(apt.sourceUrl)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* PIPELINE TAB */}
      {tab === "pipeline" && (
        <div className="space-y-4">
          {/* Manual entry form */}
          {showForm && <AddListingForm onClose={() => setShowForm(false)} />}

          {/* Status filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`text-[10px] px-2.5 py-1 rounded-lg border transition-colors ${
                statusFilter === "all"
                  ? "border-accent-primary/50 bg-accent-primary/10 text-accent-primary"
                  : "border-border-default bg-bg-secondary text-text-muted hover:text-text-secondary"
              }`}
            >
              All ({apartments.length})
            </button>
            {STATUS_CONFIG.map((s) => {
              const count = apartments.filter((a) => a.status === s.key).length;
              if (count === 0) return null;
              return (
                <button
                  key={s.key}
                  onClick={() =>
                    setStatusFilter(statusFilter === s.key ? "all" : s.key)
                  }
                  className={`flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-lg border transition-colors ${
                    statusFilter === s.key
                      ? "text-text-primary"
                      : "border-border-default bg-bg-secondary text-text-muted hover:text-text-secondary"
                  }`}
                  style={
                    statusFilter === s.key
                      ? {
                          borderColor: `color-mix(in srgb, ${s.color} 50%, transparent)`,
                          backgroundColor: `color-mix(in srgb, ${s.color} 10%, transparent)`,
                        }
                      : undefined
                  }
                >
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  {s.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Apartment cards */}
          <div className="space-y-3">
            {filteredPipeline.length === 0 && (
              <div className="rounded-xl border border-border-default bg-bg-secondary p-8 text-center">
                <Building2 className="h-8 w-8 text-text-muted mx-auto mb-2" />
                <p className="text-sm text-text-muted">
                  {statusFilter === "all"
                    ? 'No apartments saved yet. Use the Live Feed to discover or click "Add Listing".'
                    : "No apartments with this status."}
                </p>
              </div>
            )}
            {filteredPipeline.map((apt) => (
              <ApartmentCard
                key={apt.id}
                apt={apt}
                onStatusChange={(status) => updateStatus(apt.id, status)}
                onRemove={() => remove(apt.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* PORTALS TAB */}
      {tab === "portals" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PORTALS.map((portal) => (
            <div
              key={portal.id}
              className="rounded-xl border border-border-default bg-bg-secondary p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h3
                  className="text-sm font-semibold"
                  style={{ color: portal.color }}
                >
                  {portal.name}
                </h3>
                <Search className="h-3.5 w-3.5 text-text-muted" />
              </div>
              <p className="text-[10px] text-text-muted mb-3">
                {portal.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {topKreise.map((k) => (
                  <a
                    key={k}
                    href={`${portal.baseUrl}${portal.kreisFilters[k] ?? ""}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] px-2 py-1 rounded border border-border-default bg-bg-primary/50 text-text-secondary hover:border-accent-primary/40 hover:text-accent-primary transition-colors"
                  >
                    K{k}
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                ))}
                <a
                  href={portal.baseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] px-2 py-1 rounded border border-border-default bg-bg-primary/50 text-text-secondary hover:border-accent-primary/40 hover:text-accent-primary transition-colors"
                >
                  All <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterRange({
  label,
  min,
  max,
  onMinChange,
  onMaxChange,
  step,
}: {
  label: string;
  min: number;
  max: number;
  onMinChange: (v: number) => void;
  onMaxChange: (v: number) => void;
  step: number;
}) {
  return (
    <div>
      <label className="text-[9px] uppercase tracking-wider text-text-muted block mb-1.5">
        {label}
      </label>
      <div className="flex items-center gap-1.5">
        <input
          type="number"
          value={min}
          onChange={(e) => onMinChange(Number(e.target.value))}
          step={step}
          className="w-full rounded border border-border-default bg-bg-primary px-2 py-1 text-[10px] text-text-primary focus:border-accent-primary focus:outline-none"
        />
        <span className="text-[10px] text-text-muted">–</span>
        <input
          type="number"
          value={max}
          onChange={(e) => onMaxChange(Number(e.target.value))}
          step={step}
          className="w-full rounded border border-border-default bg-bg-primary px-2 py-1 text-[10px] text-text-primary focus:border-accent-primary focus:outline-none"
        />
      </div>
    </div>
  );
}
