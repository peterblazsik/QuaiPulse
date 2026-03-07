"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Building2,
  ExternalLink,
  Plus,
  X,
  Search,
} from "lucide-react";
import { PORTALS, SEARCH_CRITERIA } from "@/lib/data/portal-urls";
import { formatCHF } from "@/lib/utils";
import type { ApartmentStatus } from "@/lib/types";
import { HERO_IMAGES } from "@/lib/data/images";
import { useApartmentStore } from "@/lib/stores/apartment-store";
import { ApartmentCard } from "@/components/apartments/apartment-card";
import { AddListingForm } from "@/components/apartments/add-listing-form";

const STATUS_CONFIG: { key: ApartmentStatus; label: string; color: string }[] = [
  { key: "new", label: "New", color: "#64748b" },
  { key: "interested", label: "Interested", color: "#3b82f6" },
  { key: "contacted", label: "Contacted", color: "#f59e0b" },
  { key: "viewing_scheduled", label: "Viewing", color: "#8b5cf6" },
  { key: "applied", label: "Applied", color: "#06b6d4" },
  { key: "rejected", label: "Rejected", color: "#ef4444" },
  { key: "accepted", label: "Accepted", color: "#22c55e" },
];

export default function ApartmentsPage() {
  const { apartments, remove, updateStatus } = useApartmentStore();
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ApartmentStatus | "all">("all");

  const topKreise = SEARCH_CRITERIA.targetKreise;

  const filtered = statusFilter === "all"
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
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 rounded-lg bg-accent-primary px-3 py-2 text-xs font-medium text-white hover:bg-accent-hover transition-colors shrink-0"
          >
            {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {showForm ? "Cancel" : "Add Listing"}
          </button>
        </div>
      </div>

      {/* Manual entry form */}
      {showForm && <AddListingForm onClose={() => setShowForm(false)} />}

      {/* Portal links */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
          Search Portals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
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
      </div>

      {/* Pipeline view */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Pipeline ({apartments.length} listings)
          </h2>
        </div>

        {/* Status filter */}
        <div className="flex flex-wrap gap-2 mb-4">
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
                onClick={() => setStatusFilter(statusFilter === s.key ? "all" : s.key)}
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
          {filtered.length === 0 && (
            <div className="rounded-xl border border-border-default bg-bg-secondary p-8 text-center">
              <Building2 className="h-8 w-8 text-text-muted mx-auto mb-2" />
              <p className="text-sm text-text-muted">
                {statusFilter === "all"
                  ? "No apartments saved yet. Click \"Add Listing\" to start."
                  : "No apartments with this status."}
              </p>
            </div>
          )}
          {filtered.map((apt) => (
            <ApartmentCard
              key={apt.id}
              apt={apt}
              onStatusChange={(status) => updateStatus(apt.id, status)}
              onRemove={() => remove(apt.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
