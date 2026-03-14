"use client";

import {
  ExternalLink,
  MapPin,
  Calendar,
  Bookmark,
  EyeOff,
  Maximize2,
} from "lucide-react";
import { formatCHF } from "@/lib/utils";
import { NEIGHBORHOODS } from "@/lib/data/neighborhoods";
import { useBudgetStore } from "@/lib/stores/budget-store";
import { calculateBudget } from "@/lib/engines/budget-calculator";
import type { ScrapedApartment } from "@/lib/engines/flatfox-scraper";

const ATTR_LABELS: Record<string, string> = {
  balconygarden: "Balcony",
  dishwasher: "Dishwasher",
  lift: "Elevator",
  parkingspace: "Parking",
  garage: "Garage",
  parquetflooring: "Parquet",
  washingmachine: "Washer",
  tumbler: "Dryer",
  view: "View",
  petsallowed: "Pets OK",
  broadbandinternet: "Fiber",
  cable: "Cable TV",
  accessiblewithwheelchair: "Wheelchair",
};

function formatAvailability(apt: ScrapedApartment): string {
  if (apt.availableDate) {
    const d = new Date(apt.availableDate);
    return d.toLocaleDateString("en-CH", { month: "short", day: "numeric", year: "numeric" });
  }
  if (apt.availableType === "imm") return "Immediately";
  if (apt.availableType === "agr") return "By agreement";
  return "Unknown";
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

interface FeedCardProps {
  apt: ScrapedApartment;
  onSave: () => void;
  onDismiss: () => void;
  isSaved: boolean;
}

export function FeedCard({ apt, onSave, onDismiss, isSaved }: FeedCardProps) {
  const neighborhood = NEIGHBORHOODS.find((n) => n.kreis === apt.kreis);
  const visibleAttrs = apt.attributes
    .map((a) => ATTR_LABELS[a])
    .filter(Boolean)
    .slice(0, 6);

  // Budget impact: compute surplus delta if this rent were used
  const budgetState = useBudgetStore();
  const currentRent = budgetState.values.rent;
  const budgetInputs = {
    grossMonthlySalary: budgetState.grossMonthlySalary,
    has13thSalary: budgetState.has13thSalary,
    annualBonusPct: budgetState.annualBonusPct,
    expenseAllowance: budgetState.expenseAllowance,
    employerInsuranceContrib: budgetState.employerInsuranceContrib,
    mobilityAllowance: budgetState.mobilityAllowance,
    relocationBonus: budgetState.relocationBonus,
    bvgMonthly: budgetState.bvgMonthly,
    pillar3aMonthly: budgetState.pillar3aMonthly,
    taxEffectiveRate: 0,
    viennaRent: budgetState.viennaRent,
    childSupport: budgetState.childSupport,
    viennaUtils: budgetState.viennaUtils,
    carInsurance: budgetState.carInsurance,
    zurichValues: { ...budgetState.values, rent: apt.rentDisplay },
  };
  const hypothetical = calculateBudget(budgetInputs);
  const rentDelta = apt.rentDisplay - currentRent;
  const budgetFit: "comfortable" | "stretch" | "over" =
    hypothetical.surplus >= 500 ? "comfortable" : hypothetical.surplus >= 0 ? "stretch" : "over";

  return (
    <div className="group rounded-xl border border-border-default bg-bg-secondary overflow-hidden hover:border-accent-primary/30 transition-colors">
      <div className="flex">
        {/* Image */}
        {apt.imageUrl && (
          <div className="relative w-40 min-h-[120px] shrink-0 bg-bg-tertiary overflow-hidden">
            <img
              src={apt.imageUrl}
              alt={apt.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-1 left-1 text-[10px] font-medium bg-black/60 text-white px-1.5 py-0.5 rounded">
              {apt.source}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-3.5 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-text-primary truncate">
                {apt.title}
              </h3>
              <div className="flex items-center gap-1 mt-0.5 text-[10px] text-text-muted">
                <MapPin className="h-2.5 w-2.5 shrink-0" />
                <span className="truncate">{apt.address}</span>
                {apt.kreis > 0 && (
                  <span className="shrink-0 text-accent-primary font-medium">
                    K{apt.kreis}
                    {neighborhood ? ` ${neighborhood.name}` : ""}
                  </span>
                )}
              </div>
            </div>

            <div className="shrink-0 text-right">
              <p className="font-data text-lg font-bold text-text-primary leading-tight">
                {formatCHF(apt.rentDisplay)}
              </p>
              <p className="text-[10px] text-text-muted">
                {apt.rentNet
                  ? `${formatCHF(apt.rentNet)} + ${formatCHF(apt.rentCharges ?? 0)}`
                  : "gross"}
              </p>
              <span
                className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded border font-medium ${
                  budgetFit === "comfortable"
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    : budgetFit === "stretch"
                      ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                      : "bg-red-500/15 text-red-400 border-red-500/30"
                }`}
                title={`Surplus: ${formatCHF(hypothetical.surplus)}/mo`}
              >
                {budgetFit === "comfortable"
                  ? `+${formatCHF(hypothetical.surplus)} left`
                  : budgetFit === "stretch"
                    ? `Tight: ${formatCHF(hypothetical.surplus)} left`
                    : `Over: ${formatCHF(Math.abs(hypothetical.surplus))} deficit`}
              </span>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-3 mt-2.5 text-[10px] text-text-secondary">
            {apt.rooms && (
              <span className="font-medium">
                {apt.rooms} {apt.rooms === 1 ? "room" : "rooms"}
              </span>
            )}
            {apt.sqm && apt.sqm > 0 && (
              <span className="flex items-center gap-0.5">
                <Maximize2 className="h-2.5 w-2.5" />
                {apt.sqm} m²
              </span>
            )}
            {apt.floor !== null && apt.floor !== undefined && (
              <span>Floor {apt.floor}</span>
            )}
            <span className="flex items-center gap-0.5">
              <Calendar className="h-2.5 w-2.5" />
              {formatAvailability(apt)}
            </span>
          </div>

          {/* Attributes */}
          {visibleAttrs.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {visibleAttrs.map((attr) => (
                <span
                  key={attr}
                  className="text-[10px] px-1.5 py-0.5 rounded border border-border-default bg-bg-primary/50 text-text-muted"
                >
                  {attr}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-2.5">
            <span className="text-[10px] text-text-muted">
              {timeAgo(apt.publishedAt)}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={onDismiss}
                className="flex items-center gap-1 text-[10px] px-2 py-1 rounded text-text-muted hover:text-text-secondary hover:bg-bg-tertiary transition-colors"
                title="Hide listing"
              >
                <EyeOff className="h-3 w-3" />
                Hide
              </button>
              <button
                onClick={onSave}
                disabled={isSaved}
                className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded font-medium transition-colors ${
                  isSaved
                    ? "text-emerald-400 bg-emerald-400/10 cursor-default"
                    : "text-accent-primary hover:bg-accent-primary/10"
                }`}
                title={isSaved ? "Already saved" : "Save to pipeline"}
              >
                <Bookmark className="h-3 w-3" />
                {isSaved ? "Saved" : "Save"}
              </button>
              <a
                href={apt.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] px-2 py-1 rounded text-accent-primary hover:bg-accent-primary/10 transition-colors"
              >
                View <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
