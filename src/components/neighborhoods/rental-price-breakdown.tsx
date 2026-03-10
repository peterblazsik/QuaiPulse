"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  TrendingUp,
  ArrowRight,
  Landmark,
} from "lucide-react";
import {
  getRentalDataByLocationId,
  getMedianRent,
  APARTMENT_SIZES,
  SIZE_TO_PRICING_KEY,
  type BuildingAge,
  type ApartmentSize,
  type LocationRentalData,
  type RentRange,
} from "@/lib/data/rental-prices";
import { getTaxDataByLocationId, taxSavingsVsCity } from "@/lib/data/tax-rates";
import { useBudgetStore } from "@/lib/stores/budget-store";
import { formatCHF } from "@/lib/utils";

interface RentalPriceBreakdownProps {
  locationId: string;
  locationName: string;
}

const BUILDING_AGE_LABELS: Record<BuildingAge, { label: string; desc: string }> = {
  old: { label: "Altbau", desc: "Pre-1970" },
  modern: { label: "Modern", desc: "1970–2010" },
  new: { label: "Neubau", desc: "2010+" },
};

const SIZE_LABELS: Record<ApartmentSize, string> = {
  studio: "Studio (1.5 Zi)",
  "1br": "1 BR (2.5 Zi)",
  "2br": "2 BR (3.5 Zi)",
  "3br": "3 BR (4.5 Zi)",
};

const TIER_COLORS: Record<string, string> = {
  premium: "text-warning bg-warning/10 border-warning/30",
  upper: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  mid: "text-success bg-success/10 border-success/30",
  affordable: "text-success bg-success/10 border-success/30",
};

function MarketTierBadge({ tier }: { tier: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${TIER_COLORS[tier] ?? "text-text-muted bg-bg-secondary border-border-subtle"}`}
    >
      {tier}
    </span>
  );
}

function RentCell({
  range,
  budgetRent,
  highlight,
}: {
  range: RentRange;
  budgetRent: number;
  highlight?: boolean;
}) {
  const withinBudget = range.median <= budgetRent;
  const tight = !withinBudget && range.min <= budgetRent;

  return (
    <td
      className={`text-center py-2.5 px-3 font-data text-sm ${
        highlight ? "bg-accent-primary/5" : ""
      }`}
    >
      <span
        className={
          withinBudget
            ? "text-success"
            : tight
              ? "text-warning"
              : "text-text-primary"
        }
      >
        {formatCHF(range.min)}–{formatCHF(range.max)}
      </span>
      <span className="block text-[10px] text-text-muted">
        med {formatCHF(range.median)}
      </span>
    </td>
  );
}

export function RentalPriceBreakdown({
  locationId,
  locationName,
}: RentalPriceBreakdownProps) {
  const data = useMemo(() => getRentalDataByLocationId(locationId), [locationId]);
  const taxData = useMemo(() => getTaxDataByLocationId(locationId), [locationId]);
  const annualTaxSavings = useMemo(() => taxSavingsVsCity(locationId), [locationId]);
  const budgetRent = useBudgetStore((s) => s.values.rent);
  const setBudgetRent = useBudgetStore((s) => s.setValue);
  const setTaxLocation = useBudgetStore((s) => s.setTaxLocation);
  const [selectedSize, setSelectedSize] = useState<ApartmentSize>("1br");

  if (!data) return null;

  const ages: BuildingAge[] = ["old", "modern", "new"];
  const sizes: ApartmentSize[] = ["studio", "1br", "2br", "3br"];

  const selectedMedian = getMedianRent(locationId, selectedSize, "modern") ?? 0;
  const budgetDiff = budgetRent - selectedMedian;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="card p-5 space-y-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
            Rental Market — {locationName}
          </h2>
          <div className="flex items-center gap-3 mt-1">
            <MarketTierBadge tier={data.marketTier} />
            <span className="text-[10px] text-text-muted flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {data.vacancyRate}% vacancy · {data.avgDaysOnMarket}d avg listing
            </span>
          </div>
        </div>
      </div>

      {/* Price per sqm comparison */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-text-muted mb-2">
          Price per m² (net rent)
        </p>
        <div className="grid grid-cols-3 gap-3">
          {ages.map((age) => (
            <div
              key={age}
              className="rounded-lg border border-border-subtle bg-bg-secondary/50 p-3 text-center"
            >
              <p className="text-[10px] uppercase tracking-wider text-text-muted">
                {BUILDING_AGE_LABELS[age].label}
              </p>
              <p className="text-[10px] text-text-muted">
                {BUILDING_AGE_LABELS[age].desc}
              </p>
              <p className="font-data text-xl font-bold text-text-primary mt-1">
                CHF {data[age].pricePerSqm}
              </p>
              <p className="text-[10px] text-text-muted">/m²/month</p>
            </div>
          ))}
        </div>
      </div>

      {/* Full price matrix */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-text-muted mb-2">
          Monthly rent by apartment type & building age
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left text-[10px] uppercase tracking-wider text-text-muted pb-2 pr-3 w-32">
                  Type
                </th>
                {ages.map((age) => (
                  <th
                    key={age}
                    className="text-center text-[10px] uppercase tracking-wider text-text-muted pb-2 px-3"
                  >
                    {BUILDING_AGE_LABELS[age].label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="font-data">
              {sizes.map((size) => {
                const sizeKey = SIZE_TO_PRICING_KEY[size];
                const specs = APARTMENT_SIZES[size];
                const isHighlight = size === "1br";
                return (
                  <tr
                    key={size}
                    className={`border-b border-border-subtle/50 ${isHighlight ? "bg-accent-primary/5" : ""}`}
                  >
                    <td className="py-2.5 pr-3">
                      <span
                        className={`text-sm ${isHighlight ? "font-medium text-accent-primary" : "text-text-secondary"}`}
                      >
                        {SIZE_LABELS[size]}
                      </span>
                      <span className="block text-[10px] text-text-muted">
                        {specs.sqmMin}–{specs.sqmMax} m²
                      </span>
                    </td>
                    {ages.map((age) => (
                      <RentCell
                        key={age}
                        range={data[age][sizeKey] as RentRange}
                        budgetRent={budgetRent}
                        highlight={isHighlight}
                      />
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-text-muted mt-2">
          <span className="text-success">■</span> Within budget ({formatCHF(budgetRent)})
          {" · "}
          <span className="text-warning">■</span> Tight (min within budget)
        </p>
      </div>

      {/* Budget link — cross-module flow #1 */}
      <div className="rounded-lg border border-border-subtle bg-bg-secondary/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-text-secondary">
              Your budget rent:{" "}
              <span className="font-data font-semibold text-text-primary">
                {formatCHF(budgetRent)}/mo
              </span>
            </p>
            <p className="text-[10px] text-text-muted mt-0.5">
              Modern {SIZE_LABELS[selectedSize]} median here:{" "}
              <span className="font-data">
                {formatCHF(selectedMedian)}
              </span>
              {" · "}
              <span
                className={budgetDiff >= 0 ? "text-success" : "text-danger"}
              >
                {budgetDiff >= 0 ? "+" : ""}
                {formatCHF(budgetDiff)} {budgetDiff >= 0 ? "headroom" : "over budget"}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value as ApartmentSize)}
              className="bg-bg-tertiary border border-border-subtle rounded px-2 py-1 text-xs text-text-secondary focus:outline-none focus:border-accent-primary"
            >
              {sizes.map((s) => (
                <option key={s} value={s}>
                  {SIZE_LABELS[s]}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setBudgetRent("rent", selectedMedian)}
              className="inline-flex items-center gap-1.5 rounded-md bg-accent-primary/10 border border-accent-primary/30 px-3 py-1.5 text-xs font-medium text-accent-primary hover:bg-accent-primary/20 transition-colors"
              title="Set budget rent to this neighborhood's median"
            >
              Apply to Budget
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Tax Estimation */}
      {taxData && (
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-text-muted flex items-center gap-1 mb-1">
                <Landmark className="h-3 w-3 text-blue-400" />
                Cantonal Tax — {taxData.municipality}
              </p>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-text-secondary">
                  Steuerfuss{" "}
                  <span className="font-data font-semibold text-text-primary">{taxData.steuerfuss}%</span>
                </span>
                <span className="text-text-secondary">
                  Effective{" "}
                  <span className="font-data font-semibold text-text-primary">{taxData.effectiveRate}%</span>
                </span>
                <span className="text-text-secondary">
                  ~<span className="font-data font-semibold text-text-primary">{formatCHF(taxData.estimatedMonthlyTax)}</span>/mo
                </span>
                {annualTaxSavings > 0 && (
                  <span className="text-success font-data font-semibold">
                    Save {formatCHF(annualTaxSavings)}/yr vs city
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setTaxLocation(locationId)}
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-500/10 border border-blue-500/30 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition-colors shrink-0"
            >
              Apply to Budget
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* Market Notes */}
      {data.marketNotes.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted mb-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Market Intelligence
          </p>
          <ul className="space-y-1">
            {data.marketNotes.map((note, i) => (
              <li
                key={i}
                className="text-xs text-text-tertiary flex items-start gap-2"
              >
                <span className="text-text-muted mt-0.5 shrink-0">·</span>
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
