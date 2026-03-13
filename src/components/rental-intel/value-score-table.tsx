"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, ChevronUp, ChevronDown, Bookmark } from "lucide-react";
import type { UnifiedListing } from "@/lib/types";
import { formatCHF } from "@/lib/utils";
import { RENTAL_INTEL_IMAGES } from "@/lib/data/images";
import { useApartmentStore } from "@/lib/stores/apartment-store";

interface Props {
  listings: UnifiedListing[];
  onSelect: (id: string) => void;
}

type Column = "valueScore" | "rent" | "pricePerSqm" | "rooms" | "sqm" | "kreis";

export function ValueScoreTable({ listings, onSelect }: Props) {
  const { apartments: savedApartments, add: addToStore } = useApartmentStore();
  const savedUrls = new Set(savedApartments.map((a) => a.sourceUrl));

  const handleSave = (listing: UnifiedListing, e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedUrls.has(listing.sourceUrl)) return;
    addToStore({
      title: listing.title,
      address: listing.address,
      kreis: listing.kreis,
      rent: listing.rent,
      rooms: listing.rooms ?? 0,
      sqm: listing.sqm ?? 0,
      sourceUrl: listing.sourceUrl,
      status: "new",
      notes: `Value score: ${listing.valueScore}. Imported from Rental Intel.`,
    });
  };

  const [sortCol, setSortCol] = useState<Column>("valueScore");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const toggleSort = (col: Column) => {
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir(col === "rent" || col === "pricePerSqm" ? "asc" : "desc");
    }
  };

  const sorted = [...listings].sort((a, b) => {
    const mul = sortDir === "asc" ? 1 : -1;
    const av = a[sortCol] ?? 0;
    const bv = b[sortCol] ?? 0;
    return (Number(av) - Number(bv)) * mul;
  });

  const SortIcon = ({ col }: { col: Column }) => {
    if (sortCol !== col) return null;
    return sortDir === "asc" ? (
      <ChevronUp className="h-3 w-3 inline" />
    ) : (
      <ChevronDown className="h-3 w-3 inline" />
    );
  };

  const scoreColor = (score: number) => {
    if (score >= 70) return "text-emerald-400";
    if (score >= 50) return "text-amber-400";
    return "text-red-400";
  };

  const budgetBadge = (fit: UnifiedListing["budgetFit"]) => {
    const styles = {
      comfortable: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      stretch: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      over: "bg-red-500/15 text-red-400 border-red-500/30",
    };
    return (
      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${styles[fit]}`}>
        {fit}
      </span>
    );
  };

  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] overflow-hidden">
      {/* Section image header */}
      <div className="relative h-24">
        <Image
          src={RENTAL_INTEL_IMAGES.facade}
          alt="Modern Zurich apartment building"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-secondary)]" />
      </div>

      <div className="p-4 border-b border-[var(--border-default)] -mt-3 relative">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          Top Picks — Value Score Ranking
        </h3>
        <p className="text-[11px] text-[var(--text-tertiary)] mt-1">
          {listings.length} listings · click row for details
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[var(--border-default)] bg-[var(--bg-primary)]">
              {(
                [
                  ["valueScore", "Score"],
                  ["rent", "Rent"],
                  ["pricePerSqm", "CHF/m²"],
                  ["rooms", "Rooms"],
                  ["sqm", "m²"],
                  ["kreis", "Kreis"],
                ] as [Column, string][]
              ).map(([col, label]) => (
                <th
                  key={col}
                  onClick={() => toggleSort(col)}
                  className="px-3 py-2.5 text-left font-medium text-[var(--text-tertiary)] cursor-pointer hover:text-[var(--text-primary)] select-none whitespace-nowrap"
                >
                  {label} <SortIcon col={col} />
                </th>
              ))}
              <th className="px-3 py-2.5 text-left font-medium text-[var(--text-tertiary)]">
                Title
              </th>
              <th className="px-3 py-2.5 text-left font-medium text-[var(--text-tertiary)]">
                Budget
              </th>
              <th className="px-3 py-2.5 text-center font-medium text-[var(--text-tertiary)]">
                Save
              </th>
              <th className="px-3 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {sorted.slice(0, 50).map((listing) => (
              <tr
                key={listing.id}
                onClick={() => onSelect(listing.id)}
                className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-tertiary)]/30 cursor-pointer transition-colors"
              >
                <td className="px-3 py-2.5">
                  <span className={`font-mono font-bold ${scoreColor(listing.valueScore)}`}>
                    {listing.valueScore}
                  </span>
                </td>
                <td className="px-3 py-2.5 font-mono text-[var(--text-primary)]">
                  {formatCHF(listing.rent)}
                </td>
                <td className="px-3 py-2.5 font-mono text-[var(--text-secondary)]">
                  {listing.pricePerSqm ?? "—"}
                </td>
                <td className="px-3 py-2.5 font-mono text-[var(--text-secondary)]">
                  {listing.rooms ?? "—"}
                </td>
                <td className="px-3 py-2.5 font-mono text-[var(--text-secondary)]">
                  {listing.sqm ?? "—"}
                </td>
                <td className="px-3 py-2.5 font-mono text-[var(--text-secondary)]">
                  {listing.kreis || "—"}
                </td>
                <td className="px-3 py-2.5 text-[var(--text-secondary)] max-w-48 truncate">
                  <span className="text-[10px] text-[var(--text-tertiary)] mr-1.5">
                    {listing.source === "flatfox" ? "FF" : "HG"}
                  </span>
                  {listing.title}
                </td>
                <td className="px-3 py-2.5">
                  {budgetBadge(listing.budgetFit)}
                </td>
                <td className="px-3 py-2.5">
                  {(() => {
                    const isSaved = savedUrls.has(listing.sourceUrl);
                    return (
                      <button
                        onClick={(e) => handleSave(listing, e)}
                        disabled={isSaved}
                        className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded transition-colors ${
                          isSaved
                            ? "text-emerald-400 cursor-default"
                            : "text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10"
                        }`}
                        title={isSaved ? "Saved to pipeline" : "Save to pipeline"}
                      >
                        <Bookmark className={`h-3.5 w-3.5 ${isSaved ? "fill-current" : ""}`} />
                      </button>
                    );
                  })()}
                </td>
                <td className="px-3 py-2.5">
                  <a
                    href={listing.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[var(--text-tertiary)] hover:text-[var(--accent-primary)]"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
