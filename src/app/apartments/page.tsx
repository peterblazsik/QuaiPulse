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
  Trash2,
  ChevronDown,
} from "lucide-react";
import { PORTALS, SEARCH_CRITERIA } from "@/lib/data/portal-urls";
import { NEIGHBORHOODS } from "@/lib/data/neighborhoods";
import { formatCHF } from "@/lib/utils";
import type { ApartmentStatus } from "@/lib/types";
import { HERO_IMAGES } from "@/lib/data/images";
import { useApartmentStore, type SavedApartment } from "@/lib/stores/apartment-store";

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

        {/* Status filter + summary bar */}
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

function ApartmentCard({
  apt,
  onStatusChange,
  onRemove,
}: {
  apt: SavedApartment;
  onStatusChange: (status: ApartmentStatus) => void;
  onRemove: () => void;
}) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const statusConf = STATUS_CONFIG.find((s) => s.key === apt.status)!;
  const neighborhood = NEIGHBORHOODS.find((n) => n.kreis === apt.kreis);

  return (
    <div className="rounded-xl border border-border-default bg-bg-secondary p-4 hover:border-accent-primary/30 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-text-primary truncate">
              {apt.title}
            </h3>
            {/* Status dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className="shrink-0 flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded font-medium transition-colors hover:opacity-80"
                style={{
                  color: statusConf.color,
                  backgroundColor: `color-mix(in srgb, ${statusConf.color} 15%, transparent)`,
                }}
              >
                {statusConf.label}
                <ChevronDown className="h-2.5 w-2.5" />
              </button>
              {showStatusMenu && (
                <div className="absolute top-full left-0 mt-1 z-20 rounded-lg border border-border-default bg-bg-secondary shadow-lg py-1 min-w-[120px]">
                  {STATUS_CONFIG.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => {
                        onStatusChange(s.key);
                        setShowStatusMenu(false);
                      }}
                      className={`w-full text-left flex items-center gap-2 px-3 py-1.5 text-[10px] hover:bg-bg-tertiary transition-colors ${
                        apt.status === s.key ? "font-semibold" : ""
                      }`}
                    >
                      <div
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: s.color }}
                      />
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="text-[10px] text-text-muted mt-0.5">
            {apt.address}
          </p>
        </div>

        <div className="shrink-0 flex items-start gap-3">
          <div className="text-right">
            <p className="font-data text-lg font-bold text-text-primary">
              {formatCHF(apt.rent)}
            </p>
            <p className="text-[10px] text-text-muted">/month</p>
          </div>
          <button
            onClick={onRemove}
            className="p-1 rounded text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
            title="Remove listing"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
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
        {apt.sourceUrl && (
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
}

function AddListingForm({ onClose }: { onClose: () => void }) {
  const addApartment = useApartmentStore((s) => s.add);
  const [form, setForm] = useState({
    title: "",
    address: "",
    kreis: "",
    rent: "",
    rooms: "",
    sqm: "",
    sourceUrl: "",
    notes: "",
  });

  const handleSubmit = () => {
    if (!form.title || !form.rent) return;
    addApartment({
      title: form.title,
      address: form.address,
      kreis: Number(form.kreis) || 0,
      rent: Number(form.rent) || 0,
      rooms: Number(form.rooms) || 0,
      sqm: Number(form.sqm) || 0,
      sourceUrl: form.sourceUrl,
      status: "new",
      notes: form.notes,
    });
    onClose();
  };

  const update = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="rounded-xl border border-accent-primary/30 bg-bg-secondary p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        Add Apartment Listing
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <FormField
          label="Title *"
          placeholder="e.g., Bright 2.5 room near lake"
          value={form.title}
          onChange={(v) => update("title", v)}
        />
        <FormField
          label="Address"
          placeholder="Strasse, PLZ Zurich"
          value={form.address}
          onChange={(v) => update("address", v)}
        />
        <FormField
          label="Kreis"
          placeholder="2"
          type="number"
          value={form.kreis}
          onChange={(v) => update("kreis", v)}
        />
        <FormField
          label="Rent (CHF) *"
          placeholder="2400"
          type="number"
          value={form.rent}
          onChange={(v) => update("rent", v)}
        />
        <FormField
          label="Rooms"
          placeholder="2.5"
          type="number"
          value={form.rooms}
          onChange={(v) => update("rooms", v)}
        />
        <FormField
          label="Size (m²)"
          placeholder="55"
          type="number"
          value={form.sqm}
          onChange={(v) => update("sqm", v)}
        />
        <div className="md:col-span-2 lg:col-span-3">
          <FormField
            label="Source URL"
            placeholder="https://..."
            value={form.sourceUrl}
            onChange={(v) => update("sourceUrl", v)}
          />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <FormField
            label="Notes"
            placeholder="Personal observations..."
            value={form.notes}
            onChange={(v) => update("notes", v)}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onClose}
          className="px-3 py-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!form.title || !form.rent}
          className="flex items-center gap-1 rounded-lg bg-accent-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
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
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wider text-text-muted block mb-1">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border-default bg-bg-primary px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none transition-colors"
      />
    </div>
  );
}
