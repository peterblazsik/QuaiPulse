"use client";

import { useState, useMemo } from "react";
import { ArrowLeftRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatCHF } from "@/lib/utils";
import { FIXED_COSTS_OUTSIDE } from "@/lib/stores/budget-store";

// Mock rates (would be fetched from API in production)
const RATES = {
  "CHF/EUR": { rate: 0.9412, change: -0.0023, trend: "down" as const },
  "CHF/HUF": { rate: 421.35, change: 2.15, trend: "up" as const },
  "EUR/HUF": { rate: 447.62, change: 1.84, trend: "up" as const },
  "EUR/CHF": { rate: 1.0625, change: 0.0026, trend: "up" as const },
};

// Mock 30-day sparkline data
function generateSparkline(base: number, volatility: number): number[] {
  const points: number[] = [];
  let val = base;
  for (let i = 0; i < 30; i++) {
    val += (Math.sin(i * 0.5) * volatility + (Math.random() - 0.5) * volatility * 0.3);
    points.push(Math.round(val * 10000) / 10000);
  }
  return points;
}

const SPARKLINES: Record<string, number[]> = {
  "CHF/EUR": generateSparkline(0.9412, 0.002),
  "CHF/HUF": generateSparkline(421.35, 1.5),
  "EUR/CHF": generateSparkline(1.0625, 0.002),
};

export default function CurrencyPage() {
  const [amount, setAmount] = useState(1000);
  const [fromCurrency, setFromCurrency] = useState("CHF");

  const conversions = useMemo(() => {
    if (fromCurrency === "CHF") {
      return {
        EUR: amount * RATES["CHF/EUR"].rate,
        HUF: amount * RATES["CHF/HUF"].rate,
      };
    } else if (fromCurrency === "EUR") {
      return {
        CHF: amount * RATES["EUR/CHF"].rate,
        HUF: amount * RATES["EUR/HUF"].rate,
      };
    }
    return {
      CHF: amount / RATES["CHF/HUF"].rate,
      EUR: amount / RATES["EUR/HUF"].rate,
    };
  }, [amount, fromCurrency]);

  const viennaCostsEur = FIXED_COSTS_OUTSIDE * RATES["CHF/EUR"].rate;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Currency Dashboard
        </h1>
        <p className="text-sm text-text-tertiary mt-1">
          Live rates, trends, and budget impact. Last updated: just now (mock data).
        </p>
      </div>

      {/* Rate cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(RATES).map(([pair, data]) => (
          <RateCard
            key={pair}
            pair={pair}
            rate={data.rate}
            change={data.change}
            trend={data.trend}
            sparkline={SPARKLINES[pair]}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Converter */}
        <div className="rounded-xl border border-border-default bg-bg-secondary p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
            Quick Converter
          </h3>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1">
              <label className="text-[10px] uppercase tracking-wider text-text-muted block mb-1">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full rounded-lg border border-border-default bg-bg-primary px-3 py-2.5 font-data text-lg text-text-primary focus:border-accent-primary focus:outline-none"
              />
            </div>
            <div className="w-24">
              <label className="text-[10px] uppercase tracking-wider text-text-muted block mb-1">
                From
              </label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full rounded-lg border border-border-default bg-bg-primary px-2 py-2.5 text-sm text-text-primary focus:border-accent-primary focus:outline-none"
              >
                <option value="CHF">CHF</option>
                <option value="EUR">EUR</option>
                <option value="HUF">HUF</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            {Object.entries(conversions).map(([currency, value]) => (
              <div
                key={currency}
                className="flex items-center justify-between rounded-lg bg-bg-primary/50 border border-border-subtle p-3"
              >
                <span className="text-xs text-text-muted">{currency}</span>
                <span className="font-data text-lg font-bold text-text-primary">
                  {currency === "HUF"
                    ? Math.round(value).toLocaleString("de-CH")
                    : value.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Budget impact */}
        <div className="rounded-xl border border-border-default bg-bg-secondary p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
            Vienna Costs in Real Terms
          </h3>
          <p className="text-xs text-text-tertiary mb-4">
            Your CHF {formatCHF(FIXED_COSTS_OUTSIDE)}/mo Vienna costs in EUR at
            current rate:
          </p>

          <div className="text-center py-4">
            <p className="font-data text-4xl font-black text-text-primary">
              {"\u20AC"}{Math.round(viennaCostsEur).toLocaleString("de-CH")}
            </p>
            <p className="text-xs text-text-muted mt-1">
              at CHF/EUR {RATES["CHF/EUR"].rate.toFixed(4)}
            </p>
          </div>

          <div className="space-y-2 mt-4">
            <ImpactRow
              label="Vienna rent"
              chf={1450}
              rate={RATES["CHF/EUR"].rate}
            />
            <ImpactRow
              label="Child support"
              chf={915}
              rate={RATES["CHF/EUR"].rate}
            />
            <ImpactRow
              label="Utilities"
              chf={220}
              rate={RATES["CHF/EUR"].rate}
            />
            <ImpactRow
              label="Car + OAMTC"
              chf={175}
              rate={RATES["CHF/EUR"].rate}
            />
          </div>

          <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <p className="text-[10px] text-amber-400">
              If CHF weakens to 0.90 EUR, your Vienna costs effectively drop by{" "}
              {formatCHF(Math.round(FIXED_COSTS_OUTSIDE * (RATES["CHF/EUR"].rate - 0.90)))} /mo in CHF terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RateCard({
  pair,
  rate,
  change,
  trend,
  sparkline,
}: {
  pair: string;
  rate: number;
  change: number;
  trend: "up" | "down" | "flat";
  sparkline?: number[];
}) {
  const trendIcon =
    trend === "up" ? (
      <TrendingUp className="h-3 w-3 text-emerald-400" />
    ) : trend === "down" ? (
      <TrendingDown className="h-3 w-3 text-red-400" />
    ) : (
      <Minus className="h-3 w-3 text-text-muted" />
    );

  const changeColor =
    trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-text-muted";

  return (
    <div className="rounded-xl border border-border-default bg-bg-secondary p-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-text-secondary">{pair}</span>
        <div className="flex items-center gap-1">
          {trendIcon}
          <span className={`font-data text-[10px] ${changeColor}`}>
            {change >= 0 ? "+" : ""}
            {rate > 10 ? change.toFixed(2) : change.toFixed(4)}
          </span>
        </div>
      </div>
      <p className="font-data text-2xl font-bold text-text-primary">
        {rate > 10 ? rate.toFixed(2) : rate.toFixed(4)}
      </p>

      {/* Sparkline */}
      {sparkline && (
        <MiniSparkline data={sparkline} color={trend === "down" ? "#ef4444" : "#22c55e"} />
      )}
    </div>
  );
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 120;
  const h = 30;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} className="mt-2 w-full" viewBox={`0 0 ${w} ${h}`}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ImpactRow({
  label,
  chf,
  rate,
}: {
  label: string;
  chf: number;
  rate: number;
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-text-muted">{label}</span>
      <div className="flex items-center gap-3">
        <span className="font-data text-text-tertiary">{formatCHF(chf)}</span>
        <ArrowLeftRight className="h-2.5 w-2.5 text-text-muted" />
        <span className="font-data text-text-primary">
          {"\u20AC"}{Math.round(chf * rate)}
        </span>
      </div>
    </div>
  );
}
