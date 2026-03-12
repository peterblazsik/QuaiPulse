"use client";

import { useEffect, useState } from "react";
import { X, ExternalLink, MapPin, Ruler, DoorOpen, Layers, Zap, Loader2 } from "lucide-react";
import type { UnifiedListing } from "@/lib/types";
import { formatCHF } from "@/lib/utils";

interface Props {
  listing: UnifiedListing | null;
  enrichment?: Record<string, unknown>;
  onClose: () => void;
  onEnrich?: (id: string) => void;
}

export function ListingDetailDrawer({ listing, enrichment, onClose, onEnrich }: Props) {
  const [isEnriching, setIsEnriching] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!listing) return null;

  const handleEnrich = async () => {
    if (!onEnrich || listing.source !== "homegate") return;
    setIsEnriching(true);
    try {
      onEnrich(listing.id);
    } finally {
      setIsEnriching(false);
    }
  };

  const scoreColor =
    listing.valueScore >= 70 ? "text-emerald-400" :
    listing.valueScore >= 50 ? "text-amber-400" : "text-red-400";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-[var(--bg-primary)] border-l border-[var(--border-default)] z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[var(--bg-primary)] border-b border-[var(--border-default)] p-4 flex items-start justify-between gap-3 z-10">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-2xl font-bold font-mono ${scoreColor}`}>
                {listing.valueScore}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded border border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">
                {listing.source === "flatfox" ? "Flatfox" : "Homegate"}
              </span>
            </div>
            <h2 className="text-sm font-semibold text-[var(--text-primary)] truncate">
              {listing.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-5">
          {/* Key metrics */}
          <div className="grid grid-cols-2 gap-3">
            <MetricCard icon={Ruler} label="Size" value={listing.sqm ? `${listing.sqm} m²` : "—"} />
            <MetricCard icon={DoorOpen} label="Rooms" value={listing.rooms?.toString() ?? "—"} />
            <MetricCard icon={Layers} label="Floor" value={listing.floor?.toString() ?? "—"} />
            <MetricCard icon={MapPin} label="Kreis" value={listing.kreis ? `K${listing.kreis}` : "—"} />
          </div>

          {/* Pricing */}
          <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] p-4">
            <div className="text-xs text-[var(--text-tertiary)] mb-2">Pricing</div>
            <div className="text-xl font-bold font-mono text-[var(--text-primary)]">
              {formatCHF(listing.rent)}<span className="text-xs text-[var(--text-tertiary)] font-normal">/mo</span>
            </div>
            {listing.pricePerSqm && (
              <div className="text-xs font-mono text-[var(--text-secondary)] mt-1">
                {listing.pricePerSqm} CHF/m²
              </div>
            )}
            <div className="mt-2">
              <BudgetBadge fit={listing.budgetFit} />
            </div>
          </div>

          {/* Address */}
          <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] p-4">
            <div className="text-xs text-[var(--text-tertiary)] mb-1">Address</div>
            <div className="text-sm text-[var(--text-primary)]">{listing.address}</div>
            {listing.commuteEstimate != null && (
              <div className="text-xs text-[var(--text-tertiary)] mt-1">
                ~{listing.commuteEstimate} min commute to Mythenquai
              </div>
            )}
          </div>

          {/* Description */}
          {listing.description && (
            <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] p-4">
              <div className="text-xs text-[var(--text-tertiary)] mb-1">Description</div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {listing.description}
              </p>
            </div>
          )}

          {/* Attributes */}
          {listing.attributes.length > 0 && (
            <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] p-4">
              <div className="text-xs text-[var(--text-tertiary)] mb-2">Features</div>
              <div className="flex flex-wrap gap-1.5">
                {listing.attributes.map((attr) => (
                  <span
                    key={attr}
                    className="text-[10px] px-2 py-1 rounded bg-[var(--bg-primary)] border border-[var(--border-default)] text-[var(--text-secondary)]"
                  >
                    {attr}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Enrichment data */}
          {enrichment && (
            <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-4">
              <div className="text-xs font-semibold text-cyan-400 mb-2 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" /> Enriched Data
              </div>
              <pre className="text-[10px] font-mono text-[var(--text-secondary)] overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(enrichment, null, 2)}
              </pre>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <a
              href={listing.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[var(--accent-primary)] px-4 py-2.5 text-xs font-medium text-white hover:bg-[var(--accent-hover)] transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View on {listing.source === "flatfox" ? "Flatfox" : "Homegate"}
            </a>

            {listing.source === "homegate" && onEnrich && !enrichment && (
              <button
                onClick={handleEnrich}
                disabled={isEnriching}
                className="flex items-center justify-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-xs font-medium text-cyan-400 hover:bg-cyan-500/20 transition-colors disabled:opacity-50"
              >
                {isEnriching ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Zap className="h-3.5 w-3.5" />
                )}
                Enrich
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Ruler;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] p-3">
      <div className="flex items-center gap-1.5 text-[var(--text-tertiary)] mb-1">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[10px]">{label}</span>
      </div>
      <div className="text-sm font-mono font-semibold text-[var(--text-primary)]">
        {value}
      </div>
    </div>
  );
}

function BudgetBadge({ fit }: { fit: UnifiedListing["budgetFit"] }) {
  const styles = {
    comfortable: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    stretch: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    over: "bg-red-500/15 text-red-400 border-red-500/30",
  };
  return (
    <span className={`text-[10px] px-2 py-1 rounded border ${styles[fit]}`}>
      {fit === "comfortable" ? "Within budget" : fit === "stretch" ? "Stretch budget" : "Over budget"}
    </span>
  );
}
