"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Award,
  Lightbulb,
  Milk,
  Coffee,
  Apple,
  Wheat,
  Wine,
  Cookie,
  ChefHat,
  UtensilsCrossed,
  SprayCan,
  Drumstick,
  Croissant,
  Store,
} from "lucide-react";
import {
  PRICE_CATEGORIES,
  STORE_KEYS,
  STORE_LABELS,
  getCheapestStore,
  getMostExpensiveStore,
  getCategoryTotals,
  getMonthlyBasketEstimate,
  getCheapestWinCounts,
  getOverallMarkup,
  type StoreKey,
  type PriceItem,
  type PriceCategory,
} from "@/lib/data/price-comparison";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Milk,
  Coffee,
  Apple,
  Wheat,
  Wine,
  Cookie,
  ChefHat,
  UtensilsCrossed,
  SprayCan,
  Drumstick,
  Croissant,
};

function formatEUR(value: number): string {
  return `\u20AC${value.toFixed(2)}`;
}

export default function PricesPage() {
  const baskets = useMemo(() => getMonthlyBasketEstimate(), []);
  const winCounts = useMemo(() => getCheapestWinCounts(), []);
  const markups = useMemo(() => getOverallMarkup(), []);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedCategories(new Set(PRICE_CATEGORIES.map((c) => c.id)));
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  // Find cheapest and most expensive baskets
  const sortedBaskets = [...baskets].sort(
    (a, b) => a.monthlyTotal - b.monthlyTotal
  );
  const cheapestBasket = sortedBaskets[0];
  const mostExpensiveBasket = sortedBaskets[sortedBaskets.length - 1];

  // Best value store (most wins)
  const bestValueStore = (Object.entries(winCounts) as [StoreKey, number][])
    .sort((a, b) => b[1] - a[1])[0][0];

  // Total item count
  const totalItems = PRICE_CATEGORIES.reduce(
    (sum, c) => sum + c.items.length,
    0
  );

  const STORE_IMAGES: Record<string, string> = {
    viennaBillaCurso: "/images/prices/vienna-deli.png",
    zurichGlobus: "/images/prices/zurich-globus.png",
    zurichMigros: "/images/prices/zurich-globus.png",
    amsterdamAH: "/images/prices/amsterdam-ah.png",
  };

  return (
    <div className="space-y-6 relative">
      {/* Ambient glow */}
      <div className="ambient-glow glow-green" />

      {/* Hero Banner */}
      <div className="relative h-48 md:h-56 rounded-2xl overflow-hidden">
        <img
          src="/images/prices/hero-market.png"
          alt="European gourmet market"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
            Cost of Living Comparison
          </h1>
          <p className="text-sm text-white/80 mt-1">
            Vienna (Billa Corso) vs Zurich (Globus / Migros) vs Amsterdam
            (Albert Heijn) &mdash; {totalItems} items across{" "}
            {PRICE_CATEGORIES.length} categories
          </p>
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[10px] text-white/70 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
          <ShoppingCart className="h-3 w-3" />
          All prices in EUR
        </div>
      </div>

      {/* ── Section 1: Monthly Basket Summary ── */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4 flex items-center gap-2">
          <ShoppingCart className="h-3.5 w-3.5 text-accent-primary" />
          Monthly Grocery Basket
          <span className="text-[10px] font-normal normal-case ml-auto text-text-muted">
            Single professional, cooking 4-5x/week
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortedBaskets.map((basket, i) => {
            const isCheapest = basket.store === cheapestBasket.store;
            const isMostExpensive =
              basket.store === mostExpensiveBasket.store;
            const pctDiff =
              ((basket.monthlyTotal - cheapestBasket.monthlyTotal) /
                cheapestBasket.monthlyTotal) *
              100;

            return (
              <motion.div
                key={basket.store}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`card card-interactive elevation-1 relative overflow-hidden ${
                  isCheapest ? "border-success/30" : ""
                } ${isMostExpensive ? "border-danger/30" : ""}`}
              >
                {/* Store image */}
                <div className="relative h-24 overflow-hidden">
                  <img
                    src={STORE_IMAGES[basket.store]}
                    alt={STORE_LABELS[basket.store].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)] via-transparent to-transparent" />
                </div>

                <div className="p-4 pt-2">
                <div className="card-hover-line" />

                {/* Store badge */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Store className="h-3.5 w-3.5 text-text-muted" />
                    <span className="text-xs font-semibold text-text-primary">
                      {STORE_LABELS[basket.store].name}
                    </span>
                  </div>
                  {isCheapest && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-success/10 text-success font-semibold border border-success/20">
                      CHEAPEST
                    </span>
                  )}
                  {isMostExpensive && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-danger/10 text-danger font-semibold border border-danger/20">
                      PRICIEST
                    </span>
                  )}
                </div>

                <p className="text-[10px] text-text-muted mb-1">
                  {STORE_LABELS[basket.store].city}
                </p>

                {/* Monthly total */}
                <div className="flex items-end gap-2 mt-2">
                  <span className="font-data text-2xl font-bold text-text-primary">
                    {formatEUR(basket.monthlyTotal)}
                  </span>
                  <span className="text-[10px] text-text-muted mb-1">
                    /month
                  </span>
                </div>

                {/* Difference badge */}
                {pctDiff > 0 && (
                  <div className="mt-2">
                    <span className="inline-flex items-center font-data text-[10px] px-1.5 py-0.5 rounded bg-danger/10 text-danger">
                      +{pctDiff.toFixed(1)}% vs cheapest
                    </span>
                  </div>
                )}
                {pctDiff === 0 && (
                  <div className="mt-2">
                    <span className="inline-flex items-center font-data text-[10px] px-1.5 py-0.5 rounded bg-success/10 text-success">
                      Baseline
                    </span>
                  </div>
                )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Section 2: Category-by-Category Comparison ── */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4 flex items-center gap-2">
          <Award className="h-3.5 w-3.5 text-accent-primary" />
          Category Breakdown
          <span className="text-[10px] font-normal normal-case ml-auto text-text-muted flex gap-2">
            <button
              onClick={expandAll}
              className="hover:text-text-secondary transition-colors underline"
            >
              Expand all
            </button>
            <button
              onClick={collapseAll}
              className="hover:text-text-secondary transition-colors underline"
            >
              Collapse all
            </button>
          </span>
        </h2>

        <div className="space-y-2">
          {PRICE_CATEGORIES.map((category, ci) => (
            <CategorySection
              key={category.id}
              category={category}
              index={ci}
              expanded={expandedCategories.has(category.id)}
              onToggle={() => toggleCategory(category.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Section 3: Key Insights ── */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4 flex items-center gap-2">
          <Lightbulb className="h-3.5 w-3.5 text-accent-primary" />
          Key Insights
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Zurich Premium */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card elevation-1 p-5 border-l-4 border-danger"
          >
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp className="h-3.5 w-3.5 text-danger" />
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Zurich Premium
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-text-secondary">
                  Globus vs Vienna
                </span>
                <span className="font-data text-sm font-bold text-danger">
                  +{(markups.zurichGlobus - markups.viennaBillaCurso).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-text-secondary">
                  Migros vs Vienna
                </span>
                <span className="font-data text-sm font-bold text-warning">
                  +{(markups.zurichMigros - markups.viennaBillaCurso).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-text-secondary">
                  Globus vs Amsterdam
                </span>
                <span className="font-data text-sm font-bold text-danger">
                  +{markups.zurichGlobus.toFixed(0)}%
                </span>
              </div>
              <p className="text-[10px] text-text-muted mt-2 pt-2 border-t border-border-subtle">
                Swiss groceries are significantly more expensive. Migros offers
                meaningful savings over Globus for everyday items.
              </p>
            </div>
          </motion.div>

          {/* Best Value */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="card elevation-1 p-5 border-l-4 border-success"
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Award className="h-3.5 w-3.5 text-success" />
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Best Value
              </span>
            </div>
            <div className="space-y-2">
              {(
                Object.entries(winCounts) as [StoreKey, number][]
              )
                .sort((a, b) => b[1] - a[1])
                .map(([store, count]) => (
                  <div
                    key={store}
                    className="flex items-center justify-between"
                  >
                    <span className="text-[11px] text-text-secondary">
                      {STORE_LABELS[store].name}
                    </span>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-1.5 rounded-full bg-accent-primary/30"
                        style={{
                          width: `${(count / totalItems) * 100}px`,
                        }}
                      />
                      <span className="font-data text-xs text-text-primary w-8 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
              <p className="text-[10px] text-text-muted mt-2 pt-2 border-t border-border-subtle">
                {STORE_LABELS[bestValueStore].name} wins the most categories.
                Out of {totalItems} items compared.
              </p>
            </div>
          </motion.div>

          {/* Where to Shop */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card elevation-1 p-5 border-l-4 border-accent-primary"
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Lightbulb className="h-3.5 w-3.5 text-accent-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Where to Shop in Zurich
              </span>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[11px] font-semibold text-text-primary">
                  Migros for everyday groceries
                </p>
                <p className="text-[10px] text-text-muted mt-0.5">
                  15-25% cheaper than Globus on most items. Best Swiss option
                  for weekly shopping.
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-text-primary">
                  Globus for premium & specialty
                </p>
                <p className="text-[10px] text-text-muted mt-0.5">
                  Quality comparable to Billa Corso. Worth it for cheese,
                  deli, and international items.
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-text-primary">
                  Monthly savings potential
                </p>
                <p className="text-[10px] text-text-muted mt-0.5">
                  Switching from Globus to Migros saves ~
                  {formatEUR(
                    (baskets.find((b) => b.store === "zurichGlobus")
                      ?.monthlyTotal ?? 0) -
                      (baskets.find((b) => b.store === "zurichMigros")
                        ?.monthlyTotal ?? 0)
                  )}
                  /month.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Monthly Basket Breakdown ── */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4 flex items-center gap-2">
          <TrendingDown className="h-3.5 w-3.5 text-accent-primary" />
          Basket Composition
          <span className="text-[10px] font-normal normal-case ml-auto text-text-muted">
            Approximate monthly spend by category
          </span>
        </h2>

        <div className="card elevation-1 p-5">
          <BasketBreakdownBars baskets={baskets} />
        </div>
      </div>
    </div>
  );
}

// ─── Category Section Component ────────────────────────────────────────────

function CategorySection({
  category,
  index,
  expanded,
  onToggle,
}: {
  category: PriceCategory;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const totals = useMemo(() => getCategoryTotals(category), [category]);
  const Icon = ICON_MAP[category.icon];

  // Find cheapest store for this category
  const cheapestCat = (
    Object.entries(totals) as [StoreKey, number][]
  ).sort((a, b) => a[1] - b[1])[0][0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="card elevation-1 overflow-hidden"
    >
      {/* Category header - clickable */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-tertiary/30 transition-colors"
      >
        {Icon ? (
          <Icon className="h-4 w-4 shrink-0 text-accent-primary" />
        ) : (
          <ShoppingCart className="h-4 w-4 shrink-0 text-accent-primary" />
        )}
        <span className="text-sm font-medium text-text-primary">
          {category.name}
        </span>
        <span className="text-[10px] text-text-muted">
          {category.items.length} items
        </span>

        <div className="ml-auto flex items-center gap-3">
          {/* Mini summary of totals */}
          <div className="hidden md:flex items-center gap-4 text-[10px]">
            {STORE_KEYS.map((key) => (
              <span
                key={key}
                className={`font-data tabular-nums ${
                  key === cheapestCat
                    ? "text-success font-semibold"
                    : "text-text-muted"
                }`}
              >
                {formatEUR(totals[key])}
              </span>
            ))}
          </div>
          {expanded ? (
            <ChevronUp className="h-3.5 w-3.5 text-text-muted" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {/* Table wrapper with horizontal scroll for mobile */}
              <div className="overflow-x-auto -mx-1">
                <table className="w-full min-w-[560px]">
                  <thead>
                    <tr className="border-b border-border-subtle">
                      <th className="text-left text-[10px] uppercase tracking-wider text-text-muted py-2 px-1 w-[200px]">
                        Item
                      </th>
                      <th className="text-left text-[10px] uppercase tracking-wider text-text-muted py-2 px-1 w-[60px]">
                        Unit
                      </th>
                      <th className="text-right text-[10px] uppercase tracking-wider text-text-muted py-2 px-1">
                        Vienna
                      </th>
                      <th className="text-right text-[10px] uppercase tracking-wider text-text-muted py-2 px-1">
                        Globus
                      </th>
                      <th className="text-right text-[10px] uppercase tracking-wider text-text-muted py-2 px-1">
                        Migros
                      </th>
                      <th className="text-right text-[10px] uppercase tracking-wider text-text-muted py-2 px-1">
                        AH
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.items.map((item) => (
                      <PriceRow key={item.id} item={item} />
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-border-default">
                      <td
                        colSpan={2}
                        className="text-xs font-semibold text-text-primary py-2 px-1"
                      >
                        Category Total
                      </td>
                      {STORE_KEYS.map((key) => {
                        const isMin =
                          totals[key] ===
                          Math.min(...STORE_KEYS.map((k) => totals[k]));
                        const isMax =
                          totals[key] ===
                          Math.max(...STORE_KEYS.map((k) => totals[k]));
                        return (
                          <td
                            key={key}
                            className={`text-right font-data text-xs font-bold py-2 px-1 tabular-nums ${
                              isMin
                                ? "text-success"
                                : isMax
                                  ? "text-danger"
                                  : "text-text-primary"
                            }`}
                          >
                            {formatEUR(totals[key])}
                          </td>
                        );
                      })}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Price Row Component ───────────────────────────────────────────────────

function PriceRow({ item }: { item: PriceItem }) {
  const cheapest = getCheapestStore(item);
  const expensive = getMostExpensiveStore(item);

  return (
    <tr className="border-b border-border-subtle/50 hover:bg-bg-tertiary/20 transition-colors">
      <td className="text-[11px] text-text-secondary py-1.5 px-1">
        {item.name}
      </td>
      <td className="text-[10px] text-text-muted py-1.5 px-1">{item.unit}</td>
      {STORE_KEYS.map((key) => {
        const isCheapest = key === cheapest;
        const isExpensive = key === expensive;
        return (
          <td
            key={key}
            className={`text-right font-data text-[11px] py-1.5 px-1 tabular-nums ${
              isCheapest
                ? "text-success font-semibold"
                : isExpensive
                  ? "text-danger"
                  : "text-text-secondary"
            }`}
          >
            {isCheapest && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-success mr-1 mb-[1px]" />
            )}
            {formatEUR(item[key])}
          </td>
        );
      })}
    </tr>
  );
}

// ─── Basket Breakdown Bars ─────────────────────────────────────────────────

function BasketBreakdownBars({
  baskets,
}: {
  baskets: ReturnType<typeof getMonthlyBasketEstimate>;
}) {
  // Group basket items by rough category for visualization
  const maxTotal = Math.max(...baskets.map((b) => b.monthlyTotal));

  return (
    <div className="space-y-3">
      {baskets.map((basket) => {
        const pct = (basket.monthlyTotal / maxTotal) * 100;
        return (
          <div key={basket.store} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-text-primary">
                  {STORE_LABELS[basket.store].name}
                </span>
                <span className="text-[10px] text-text-muted">
                  {STORE_LABELS[basket.store].city}
                </span>
              </div>
              <span className="font-data text-xs font-bold text-text-primary tabular-nums">
                {formatEUR(basket.monthlyTotal)}
              </span>
            </div>
            <div className="h-6 rounded-lg overflow-hidden bg-bg-tertiary">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`h-full rounded-lg relative ${
                  basket.store === "amsterdamAH"
                    ? "bg-success/60"
                    : basket.store === "zurichGlobus"
                      ? "bg-danger/60"
                      : basket.store === "zurichMigros"
                        ? "bg-warning/60"
                        : "bg-accent-primary/60"
                }`}
              >
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-data text-white/90 font-medium">
                  {formatEUR(basket.monthlyTotal)}
                </span>
              </motion.div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
