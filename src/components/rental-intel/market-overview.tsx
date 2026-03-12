"use client";

import { Building2, TrendingUp, Wallet, Percent, Thermometer } from "lucide-react";
import type { MarketOverview as MarketOverviewData } from "@/lib/engines/rental-intelligence";
import { formatCHF } from "@/lib/utils";

const TEMP_CONFIG = {
  cold: { label: "Cold", color: "text-blue-400", bg: "bg-blue-400/10" },
  cool: { label: "Cool", color: "text-cyan-400", bg: "bg-cyan-400/10" },
  warm: { label: "Warm", color: "text-amber-400", bg: "bg-amber-400/10" },
  hot: { label: "Hot", color: "text-red-400", bg: "bg-red-400/10" },
} as const;

interface Props {
  data: MarketOverviewData;
}

export function MarketOverview({ data }: Props) {
  const temp = TEMP_CONFIG[data.marketTemperature];

  const cards = [
    {
      label: "Total Listings",
      value: data.totalListings.toLocaleString("de-CH"),
      icon: Building2,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Median Rent",
      value: formatCHF(data.medianRent),
      icon: Wallet,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      label: "CHF/m²",
      value: `${data.medianPricePerSqm}`,
      icon: TrendingUp,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      label: "Budget-Fit",
      value: `${data.budgetFitPercent}%`,
      icon: Percent,
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
    },
    {
      label: "Temperature",
      value: temp.label,
      icon: Thermometer,
      color: temp.color,
      bg: temp.bg,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className={`rounded-lg p-2 ${card.bg}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)] tracking-tight">
            {card.value}
          </div>
          <div className="text-xs text-[var(--text-tertiary)] mt-1">{card.label}</div>
        </div>
      ))}
    </div>
  );
}
