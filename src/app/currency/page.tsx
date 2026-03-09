"use client";

import { useState, useMemo, useEffect } from "react";
import { ArrowLeftRight, TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react";
import { formatCHF } from "@/lib/utils";
import { useBudgetStore } from "@/lib/stores/budget-store";

interface RateData {
  rate: number;
  change: number;
  trend: "up" | "down" | "flat";
}

interface CurrencyData {
  rates: Record<string, RateData>;
  sparklines: Record<string, number[]>;
  updatedAt: string;
}

// Fallback mock data in case API fails
const FALLBACK_RATES: Record<string, RateData> = {
  "CHF/EUR": { rate: 0.9412, change: -0.0023, trend: "down" },
  "CHF/HUF": { rate: 421.35, change: 2.15, trend: "up" },
  "EUR/HUF": { rate: 447.62, change: 1.84, trend: "up" },
  "EUR/CHF": { rate: 1.0625, change: 0.0026, trend: "up" },
};

export default function CurrencyPage() {
  const [amount, setAmount] = useState(1000);
  const [fromCurrency, setFromCurrency] = useState("CHF");
  const [data, setData] = useState<CurrencyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchRates = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/currency");
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setData(json);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const rates = data?.rates ?? FALLBACK_RATES;
  const sparklines = data?.sparklines ?? {};

  const conversions = useMemo(() => {
    const chfEur = rates["CHF/EUR"]?.rate ?? 0.94;
    const chfHuf = rates["CHF/HUF"]?.rate ?? 421;
    const eurHuf = rates["EUR/HUF"]?.rate ?? 447;

    if (fromCurrency === "CHF") {
      return { EUR: amount * chfEur, HUF: amount * chfHuf };
    } else if (fromCurrency === "EUR") {
      return { CHF: amount / chfEur, HUF: amount * eurHuf };
    }
    return { CHF: amount / chfHuf, EUR: amount / eurHuf };
  }, [amount, fromCurrency, rates]);

  const viennaRent = useBudgetStore((s) => s.viennaRent);
  const childSupport = useBudgetStore((s) => s.childSupport);
  const viennaUtils = useBudgetStore((s) => s.viennaUtils);
  const carInsurance = useBudgetStore((s) => s.carInsurance);
  const viennaCostsTotal = viennaRent + childSupport + viennaUtils + carInsurance;

  const chfEurRate = rates["CHF/EUR"]?.rate ?? 0.94;
  const viennaCostsEur = viennaCostsTotal * chfEurRate;

  return (
    <div className="space-y-6 relative">
      {/* Ambient glow */}
      <div className="ambient-glow glow-amber" />
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Currency Dashboard
          </h1>
          <p className="text-sm text-text-tertiary mt-1">
            Live rates from Frankfurter API.{" "}
            {data?.updatedAt && (
              <span className="text-text-muted">Updated: {data.updatedAt}</span>
            )}
            {error && !data && (
              <span className="text-amber-400">Using fallback rates</span>
            )}
          </p>
        </div>
        <button
          onClick={fetchRates}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-accent-primary transition-colors disabled:opacity-40"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Rate cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(rates).map(([pair, rateData]) => (
          <RateCard
            key={pair}
            pair={pair}
            rate={rateData.rate}
            change={rateData.change}
            trend={rateData.trend}
            sparkline={sparklines[pair]}
            loading={loading && !data}
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
            Your CHF {formatCHF(viennaCostsTotal)}/mo Vienna costs in EUR at
            current rate:
          </p>

          <div className="text-center py-4">
            <p className="font-data text-4xl font-black text-text-primary">
              {"\u20AC"}{Math.round(viennaCostsEur).toLocaleString("de-CH")}
            </p>
            <p className="text-xs text-text-muted mt-1">
              at CHF/EUR {chfEurRate.toFixed(4)}
            </p>
          </div>

          <div className="space-y-2 mt-4">
            <ImpactRow label="Vienna rent" chf={viennaRent} rate={chfEurRate} />
            <ImpactRow label="Child support" chf={childSupport} rate={chfEurRate} />
            <ImpactRow label="Utilities" chf={viennaUtils} rate={chfEurRate} />
            <ImpactRow label="Car + OAMTC" chf={carInsurance} rate={chfEurRate} />
          </div>

          <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <p className="text-[10px] text-amber-400">
              If CHF weakens to 0.90 EUR, your Vienna costs effectively drop by{" "}
              {formatCHF(Math.round(viennaCostsTotal * (chfEurRate - 0.90)))} /mo in CHF terms.
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
  loading,
}: {
  pair: string;
  rate: number;
  change: number;
  trend: "up" | "down" | "flat";
  sparkline?: number[];
  loading?: boolean;
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
    <div className={`rounded-xl border border-border-default bg-bg-secondary p-4 ${loading ? "animate-pulse" : ""}`}>
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
      {sparkline && sparkline.length > 0 && (
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
