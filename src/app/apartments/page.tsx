"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Building2,
  ExternalLink,
  Plus,
  X,
  Search,
  ArrowRight,
  GripVertical,
} from "lucide-react";
import { PORTALS, SEARCH_CRITERIA } from "@/lib/data/portal-urls";
import { NEIGHBORHOODS } from "@/lib/data/neighborhoods";
import { formatCHF } from "@/lib/utils";
import type { ApartmentStatus } from "@/lib/types";
import { HERO_IMAGES } from "@/lib/data/images";

interface SavedApartment {
  id: string;
  title: string;
  address: string;
  kreis: number;
  rent: number;
  rooms: number;
  sqm: number;
  sourceUrl: string;
  status: ApartmentStatus;
  notes: string;
}

const STATUS_CONFIG: { key: ApartmentStatus; label: string; color: string }[] = [
  { key: "new", label: "New", color: "#64748b" },
  { key: "interested", label: "Interested", color: "#3b82f6" },
  { key: "contacted", label: "Contacted", color: "#f59e0b" },
  { key: "viewing_scheduled", label: "Viewing", color: "#8b5cf6" },
  { key: "applied", label: "Applied", color: "#06b6d4" },
  { key: "rejected", label: "Rejected", color: "#ef4444" },
  { key: "accepted", label: "Accepted", color: "#22c55e" },
];

const DEMO_APARTMENTS: SavedApartment[] = [
  {
    id: "apt-1",
    title: "Bright 2.5 room near Bederstrasse",
    address: "Bederstrasse 78, 8002 Zurich",
    kreis: 2,
    rent: 2450,
    rooms: 2.5,
    sqm: 58,
    sourceUrl: "#",
    status: "interested",
    notes: "Great location, 10 min walk to office. 3rd floor, no elevator but manageable.",
  },
  {
    id: "apt-2",
    title: "Modern 2 room on Birmensdorferstrasse",
    address: "Birmensdorferstrasse 210, 8003 Zurich",
    kreis: 3,
    rent: 1950,
    rooms: 2,
    sqm: 45,
    sourceUrl: "#",
    status: "new",
    notes: "Affordable, near PureGym. Small but well-designed. Tram 13 right outside.",
  },
  {
    id: "apt-3",
    title: "Renovated 2.5 room Seefeld",
    address: "Seefeldstrasse 152, 8008 Zurich",
    kreis: 8,
    rent: 2680,
    rooms: 2.5,
    sqm: 62,
    sourceUrl: "#",
    status: "contacted",
    notes: "Stunning lakeside area. Viewing request sent. Dishwasher + balcony.",
  },
];

export default function ApartmentsPage() {
  const [apartments] = useState<SavedApartment[]>(DEMO_APARTMENTS);
  const [showForm, setShowForm] = useState(false);

  const topKreise = SEARCH_CRITERIA.targetKreise;

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
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
          Pipeline ({apartments.length} listings)
        </h2>

        {/* Status summary bar */}
        <div className="flex gap-2 mb-4">
          {STATUS_CONFIG.map((s) => {
            const count = apartments.filter((a) => a.status === s.key).length;
            return (
              <div
                key={s.key}
                className="flex items-center gap-1.5 text-[10px]"
              >
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-text-muted">{s.label}</span>
                <span className="font-data text-text-secondary">{count}</span>
              </div>
            );
          })}
        </div>

        {/* Apartment cards */}
        <div className="space-y-3">
          {apartments.map((apt) => {
            const statusConf = STATUS_CONFIG.find(
              (s) => s.key === apt.status
            )!;
            const neighborhood = NEIGHBORHOODS.find(
              (n) => n.kreis === apt.kreis
            );

            return (
              <div
                key={apt.id}
                className="rounded-xl border border-border-default bg-bg-secondary p-4 hover:border-accent-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-3.5 w-3.5 text-text-muted shrink-0 cursor-grab" />
                      <h3 className="text-sm font-semibold text-text-primary truncate">
                        {apt.title}
                      </h3>
                      <span
                        className="shrink-0 text-[9px] px-1.5 py-0.5 rounded font-medium"
                        style={{
                          color: statusConf.color,
                          backgroundColor: `color-mix(in srgb, ${statusConf.color} 15%, transparent)`,
                        }}
                      >
                        {statusConf.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-text-muted mt-0.5">
                      {apt.address}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="font-data text-lg font-bold text-text-primary">
                      {formatCHF(apt.rent)}
                    </p>
                    <p className="text-[10px] text-text-muted">/month</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-3 text-[10px] text-text-muted">
                  <span>
                    {apt.rooms} rooms | {apt.sqm}m²
                  </span>
                  <span>Kreis {apt.kreis}</span>
                  {neighborhood && (
                    <span className="text-text-tertiary">
                      ({neighborhood.name})
                    </span>
                  )}
                  {apt.sourceUrl !== "#" && (
                    <a
                      href={apt.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-0.5 text-accent-primary hover:underline"
                    >
                      Source <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  )}
                </div>

                {apt.notes && (
                  <p className="text-[10px] text-text-tertiary mt-2 italic leading-snug">
                    {apt.notes}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AddListingForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="rounded-xl border border-accent-primary/30 bg-bg-secondary p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        Add Apartment Listing
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <FormField label="Title" placeholder="e.g., Bright 2.5 room near lake" />
        <FormField label="Address" placeholder="Strasse, PLZ Zurich" />
        <FormField label="Kreis" placeholder="2" type="number" />
        <FormField label="Rent (CHF)" placeholder="2400" type="number" />
        <FormField label="Rooms" placeholder="2.5" type="number" />
        <FormField label="Size (m²)" placeholder="55" type="number" />
        <div className="md:col-span-2 lg:col-span-3">
          <FormField label="Source URL" placeholder="https://..." />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <FormField label="Notes" placeholder="Personal observations..." />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onClose}
          className="px-3 py-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors"
        >
          Cancel
        </button>
        <button className="flex items-center gap-1 rounded-lg bg-accent-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-hover transition-colors">
          Save <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

function FormField({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wider text-text-muted block mb-1">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border-default bg-bg-primary px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none transition-colors"
      />
    </div>
  );
}
