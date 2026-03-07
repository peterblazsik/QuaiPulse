"use client";

import { useMemo } from "react";
import {
  CreditCard,
  Scissors,
  RefreshCw,
  Check,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import {
  DEFAULT_SUBSCRIPTIONS,
  CATEGORY_CONFIG,
  type SubscriptionData,
  type SubAction,
  type SubCategory,
} from "@/lib/data/subscriptions";
import { useSubscriptionStore } from "@/lib/stores/subscription-store";
import { formatCHF } from "@/lib/utils";

const EUR_TO_CHF = 0.94; // approximate rate

function formatEUR(amount: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function SubscriptionsPage() {
  const { decisions, setDecision, resetDecisions } = useSubscriptionStore();

  const getAction = (id: string): SubAction => decisions[id] ?? "undecided";

  const stats = useMemo(() => {
    let currentBurnEUR = 0;
    let postMoveBurnCHF = 0;
    let potentialSavingsCHF = 0;
    let undecidedCount = 0;

    for (const sub of DEFAULT_SUBSCRIPTIONS) {
      const action = getAction(sub.id);
      currentBurnEUR += sub.monthlyCostEUR;

      if (action === "undecided") {
        undecidedCount++;
        // Count undecided toward post-move burn as-is
        postMoveBurnCHF += sub.monthlyCostCHF;
      } else if (action === "keep") {
        postMoveBurnCHF += sub.monthlyCostCHF;
      } else if (action === "replace" && sub.swissAlternativeCostCHF) {
        postMoveBurnCHF += sub.swissAlternativeCostCHF;
      } else if (action === "cut") {
        potentialSavingsCHF += sub.monthlyCostCHF || sub.monthlyCostEUR * EUR_TO_CHF;
      }
    }

    return { currentBurnEUR, postMoveBurnCHF, potentialSavingsCHF, undecidedCount };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decisions]);

  // Group by action
  const undecided = DEFAULT_SUBSCRIPTIONS.filter((s) => getAction(s.id) === "undecided");
  const kept = DEFAULT_SUBSCRIPTIONS.filter((s) => getAction(s.id) === "keep");
  const cut = DEFAULT_SUBSCRIPTIONS.filter((s) => getAction(s.id) === "cut");
  const replaced = DEFAULT_SUBSCRIPTIONS.filter((s) => getAction(s.id) === "replace");

  // Category breakdown for donut
  const categoryBreakdown = useMemo(() => {
    const map: Record<SubCategory, number> = {
      streaming: 0,
      software: 0,
      telecom: 0,
      fitness: 0,
      finance: 0,
      cloud: 0,
      news: 0,
      other: 0,
    };
    for (const sub of DEFAULT_SUBSCRIPTIONS) {
      map[sub.category] += sub.monthlyCostEUR || sub.monthlyCostCHF;
    }
    return Object.entries(map)
      .filter(([, v]) => v > 0)
      .map(([cat, amount]) => ({
        category: cat as SubCategory,
        amount,
        ...CATEGORY_CONFIG[cat as SubCategory],
      }));
  }, []);

  // Subs with swiss alternatives for comparison table
  const withAlternatives = DEFAULT_SUBSCRIPTIONS.filter((s) => s.swissAlternative);

  return (
    <div className="space-y-6 relative">
      {/* Ambient glow */}
      <div className="ambient-glow glow-pink" />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Subscription Manager
          </h1>
          <p className="text-sm text-text-tertiary mt-1">
            {DEFAULT_SUBSCRIPTIONS.length} subscriptions tracked. Triage each one for the move: keep, cut, or replace.
          </p>
        </div>
        <button
          onClick={resetDecisions}
          className="text-xs px-3 py-1.5 rounded-lg border border-border-default bg-bg-secondary text-text-muted hover:text-text-secondary transition-colors"
        >
          Reset All
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard
          label="Current Burn"
          value={formatEUR(stats.currentBurnEUR)}
          sublabel="/month (EUR)"
          icon={<CreditCard className="h-4 w-4" />}
          color="#e879f9"
        />
        <KPICard
          label="Post-Move Burn"
          value={formatCHF(stats.postMoveBurnCHF)}
          sublabel="/month (CHF)"
          icon={<ArrowRight className="h-4 w-4" />}
          color="#3b82f6"
        />
        <KPICard
          label="Potential Savings"
          value={formatCHF(stats.potentialSavingsCHF)}
          sublabel="/month if cut"
          icon={<TrendingDown className="h-4 w-4" />}
          color="#22c55e"
        />
        <KPICard
          label="Undecided"
          value={String(stats.undecidedCount)}
          sublabel={`of ${DEFAULT_SUBSCRIPTIONS.length} subs`}
          icon={<Check className="h-4 w-4" />}
          color={stats.undecidedCount === 0 ? "#22c55e" : "#f59e0b"}
        />
      </div>

      {/* Donut Chart + Triage layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Donut chart */}
        <div className="lg:col-span-4">
          <div className="rounded-xl border border-border-default bg-bg-secondary p-4">
            <h2 className="text-xs font-semibold text-text-primary mb-4">
              Spending by Category
            </h2>
            <DonutChart data={categoryBreakdown} />
            <div className="mt-4 space-y-1.5">
              {categoryBreakdown.map((d) => (
                <div key={d.category} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: d.color }}
                    />
                    <span className="text-text-secondary">{d.label}</span>
                  </div>
                  <span className="font-data text-text-primary">
                    {formatEUR(d.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Triage columns */}
        <div className="lg:col-span-8 space-y-5">
          {/* Undecided */}
          {undecided.length > 0 && (
            <TriageSection
              title="Undecided"
              count={undecided.length}
              color="#f59e0b"
              subs={undecided}
              getAction={getAction}
              setDecision={setDecision}
            />
          )}

          {/* 3-column triage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TriageColumn
              title="Keep"
              icon={<Check className="h-3.5 w-3.5" />}
              color="#22c55e"
              subs={kept}
              getAction={getAction}
              setDecision={setDecision}
            />
            <TriageColumn
              title="Cut"
              icon={<Scissors className="h-3.5 w-3.5" />}
              color="#ef4444"
              subs={cut}
              getAction={getAction}
              setDecision={setDecision}
            />
            <TriageColumn
              title="Replace"
              icon={<RefreshCw className="h-3.5 w-3.5" />}
              color="#3b82f6"
              subs={replaced}
              getAction={getAction}
              setDecision={setDecision}
            />
          </div>
        </div>
      </div>

      {/* Move Comparison Table */}
      {withAlternatives.length > 0 && (
        <div className="rounded-xl border border-border-default bg-bg-secondary p-4">
          <h2 className="text-xs font-semibold text-text-primary mb-4">
            Move Comparison: NL vs Switzerland
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border-default">
                  <th className="text-left py-2 pr-4 text-text-muted font-medium">Service</th>
                  <th className="text-left py-2 pr-4 text-text-muted font-medium">Current (NL)</th>
                  <th className="text-left py-2 pr-4 text-text-muted font-medium">Swiss Alternative</th>
                  <th className="text-right py-2 pr-4 text-text-muted font-medium">NL Cost</th>
                  <th className="text-right py-2 pr-4 text-text-muted font-medium">CH Cost</th>
                  <th className="text-right py-2 text-text-muted font-medium">Delta</th>
                </tr>
              </thead>
              <tbody>
                {withAlternatives.map((sub) => {
                  const delta = (sub.swissAlternativeCostCHF ?? 0) - sub.monthlyCostEUR * EUR_TO_CHF;
                  return (
                    <tr
                      key={sub.id}
                      className="border-b border-border-subtle last:border-0"
                    >
                      <td className="py-2 pr-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: CATEGORY_CONFIG[sub.category].color }}
                          />
                          <span className="text-text-primary font-medium">{sub.name}</span>
                        </div>
                      </td>
                      <td className="py-2 pr-4 text-text-secondary">{sub.name}</td>
                      <td className="py-2 pr-4 text-text-secondary">{sub.swissAlternative}</td>
                      <td className="py-2 pr-4 text-right font-data text-text-primary">
                        {formatEUR(sub.monthlyCostEUR)}
                      </td>
                      <td className="py-2 pr-4 text-right font-data text-text-primary">
                        {formatCHF(sub.swissAlternativeCostCHF ?? 0)}
                      </td>
                      <td
                        className={`py-2 text-right font-data ${
                          delta > 0 ? "text-red-400" : "text-green-400"
                        }`}
                      >
                        {delta > 0 ? "+" : ""}
                        {formatCHF(delta)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- KPI Card ---------- */
function KPICard({
  label,
  value,
  sublabel,
  icon,
  color,
}: {
  label: string;
  value: string;
  sublabel: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-border-default bg-bg-secondary p-4">
      <div className="flex items-center gap-2 mb-2">
        <div
          className="flex h-6 w-6 items-center justify-center rounded-md"
          style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`, color }}
        >
          {icon}
        </div>
        <span className="text-[10px] text-text-muted uppercase tracking-wider">{label}</span>
      </div>
      <p className="font-data text-xl font-bold text-text-primary">{value}</p>
      <p className="text-[10px] text-text-tertiary mt-0.5">{sublabel}</p>
    </div>
  );
}

/* ---------- Donut Chart ---------- */
function DonutChart({
  data,
}: {
  data: { category: string; amount: number; color: string; label: string }[];
}) {
  const total = data.reduce((sum, d) => sum + d.amount, 0);
  const size = 160;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  let accumulated = 0;
  const segments = data.map((d) => {
    const pct = d.amount / total;
    const offset = accumulated;
    accumulated += pct;
    return { ...d, pct, offset };
  });

  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {segments.map((seg) => (
          <circle
            key={seg.category}
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${seg.pct * circumference} ${circumference}`}
            strokeDashoffset={-seg.offset * circumference}
            transform={`rotate(-90 ${cx} ${cy})`}
            className="transition-all duration-300"
          />
        ))}
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          className="fill-text-primary font-data text-lg font-bold"
          style={{ fontSize: "18px" }}
        >
          {formatEUR(total)}
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          className="fill-text-muted"
          style={{ fontSize: "10px" }}
        >
          /month
        </text>
      </svg>
    </div>
  );
}

/* ---------- Triage Section (undecided) ---------- */
function TriageSection({
  title,
  count,
  color,
  subs,
  getAction,
  setDecision,
}: {
  title: string;
  count: number;
  color: string;
  subs: SubscriptionData[];
  getAction: (id: string) => SubAction;
  setDecision: (id: string, action: SubAction) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        <span className="text-[10px] text-text-muted">
          {count} item{count !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {subs.map((sub) => (
          <SubCard
            key={sub.id}
            sub={sub}
            action={getAction(sub.id)}
            setDecision={setDecision}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- Triage Column ---------- */
function TriageColumn({
  title,
  icon,
  color,
  subs,
  getAction,
  setDecision,
}: {
  title: string;
  icon: React.ReactNode;
  color: string;
  subs: SubscriptionData[];
  getAction: (id: string) => SubAction;
  setDecision: (id: string, action: SubAction) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div
          className="flex h-5 w-5 items-center justify-center rounded"
          style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`, color }}
        >
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        <span className="text-[10px] text-text-muted">{subs.length}</span>
      </div>
      <div className="space-y-2">
        {subs.length === 0 ? (
          <p className="text-[10px] text-text-muted italic py-4 text-center rounded-lg border border-dashed border-border-default">
            No subscriptions here yet
          </p>
        ) : (
          subs.map((sub) => (
            <SubCard
              key={sub.id}
              sub={sub}
              action={getAction(sub.id)}
              setDecision={setDecision}
              compact
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ---------- Subscription Card ---------- */
function SubCard({
  sub,
  action,
  setDecision,
  compact = false,
}: {
  sub: SubscriptionData;
  action: SubAction;
  setDecision: (id: string, action: SubAction) => void;
  compact?: boolean;
}) {
  const cat = CATEGORY_CONFIG[sub.category];
  const borderColor =
    action === "keep"
      ? "border-green-500/30"
      : action === "cut"
        ? "border-red-500/30"
        : action === "replace"
          ? "border-blue-500/30"
          : "border-border-default";

  const bgColor =
    action === "keep"
      ? "bg-green-500/5"
      : action === "cut"
        ? "bg-red-500/5"
        : action === "replace"
          ? "bg-blue-500/5"
          : "bg-bg-secondary";

  return (
    <div
      className={`rounded-lg border ${borderColor} ${bgColor} p-3 transition-all duration-200`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-semibold text-text-primary truncate">
              {sub.name}
            </h4>
            {sub.essential && (
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 font-medium shrink-0">
                Essential
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="text-[8px] px-1.5 py-0.5 rounded font-medium"
              style={{
                backgroundColor: `color-mix(in srgb, ${cat.color} 12%, transparent)`,
                color: cat.color,
              }}
            >
              {cat.label}
            </span>
            <span className="font-data text-[10px] text-text-muted">
              {sub.monthlyCostEUR > 0 ? formatEUR(sub.monthlyCostEUR) : formatCHF(sub.monthlyCostCHF)}
              /mo
            </span>
          </div>
        </div>
        {!compact && sub.monthlyCostCHF > 0 && (
          <div className="text-right shrink-0">
            <p className="font-data text-xs text-text-primary">{formatCHF(sub.monthlyCostCHF)}</p>
            <p className="text-[8px] text-text-muted">in CH</p>
          </div>
        )}
      </div>

      {/* Notes */}
      {!compact && sub.notes && (
        <p className="text-[10px] text-text-tertiary mt-2 leading-snug italic">
          {sub.notes}
        </p>
      )}

      {/* Swiss alternative */}
      {!compact && sub.swissAlternative && (
        <div className="mt-2 flex items-center gap-1.5 text-[10px]">
          <ArrowRight className="h-2.5 w-2.5 text-accent-primary" />
          <span className="text-text-secondary">
            {sub.swissAlternative}
            {sub.swissAlternativeCostCHF != null && (
              <span className="font-data text-text-primary ml-1">
                {formatCHF(sub.swissAlternativeCostCHF)}/mo
              </span>
            )}
          </span>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-border-subtle">
        <ActionButton
          label="Keep"
          active={action === "keep"}
          color="#22c55e"
          onClick={() => setDecision(sub.id, action === "keep" ? "undecided" : "keep")}
          icon={<Check className="h-3 w-3" />}
        />
        <ActionButton
          label="Cut"
          active={action === "cut"}
          color="#ef4444"
          onClick={() => setDecision(sub.id, action === "cut" ? "undecided" : "cut")}
          icon={<Scissors className="h-3 w-3" />}
        />
        {sub.swissAlternative && (
          <ActionButton
            label="Replace"
            active={action === "replace"}
            color="#3b82f6"
            onClick={() => setDecision(sub.id, action === "replace" ? "undecided" : "replace")}
            icon={<RefreshCw className="h-3 w-3" />}
          />
        )}
      </div>
    </div>
  );
}

/* ---------- Action Button ---------- */
function ActionButton({
  label,
  active,
  color,
  onClick,
  icon,
}: {
  label: string;
  active: boolean;
  color: string;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-md border transition-all duration-150 ${
        active
          ? "font-medium"
          : "border-border-default bg-bg-tertiary text-text-muted hover:text-text-secondary"
      }`}
      style={
        active
          ? {
              borderColor: `color-mix(in srgb, ${color} 50%, transparent)`,
              backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
              color,
            }
          : undefined
      }
    >
      {icon}
      {label}
    </button>
  );
}
