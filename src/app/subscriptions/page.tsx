"use client";

import { useMemo, useState } from "react";
import {
  CreditCard,
  Scissors,
  RefreshCw,
  Check,
  TrendingDown,
  ArrowRight,
  Plus,
} from "lucide-react";
import {
  DEFAULT_SUBSCRIPTIONS,
  CATEGORY_CONFIG,
  type SubscriptionData,
  type SubAction,
  type SubCategory,
} from "@/lib/data/subscriptions";
import { useSubscriptionStore } from "@/lib/stores/subscription-store";
import { formatCHF, formatEUR } from "@/lib/utils";
import { EUR_TO_CHF } from "@/lib/constants";
import { KPICard } from "@/components/subscriptions/kpi-card";
import { DonutChart } from "@/components/subscriptions/donut-chart";
import { SubCard } from "@/components/subscriptions/sub-card";
import { AddSubscriptionForm } from "@/components/subscriptions/add-form";

export default function SubscriptionsPage() {
  const { decisions, setDecision, resetDecisions, customSubs, addCustomSub, removeCustomSub } =
    useSubscriptionStore();
  const [showAddForm, setShowAddForm] = useState(false);

  const allSubs = useMemo(
    () => [...DEFAULT_SUBSCRIPTIONS, ...customSubs],
    [customSubs]
  );

  const getAction = (id: string): SubAction => decisions[id] ?? "undecided";

  const stats = useMemo(() => {
    let currentBurnEUR = 0;
    let postMoveBurnCHF = 0;
    let potentialSavingsCHF = 0;
    let undecidedCount = 0;

    for (const sub of allSubs) {
      const action = getAction(sub.id);
      currentBurnEUR += sub.monthlyCostEUR;

      if (action === "undecided") {
        undecidedCount++;
        postMoveBurnCHF += sub.monthlyCostCHF;
      } else if (action === "keep") {
        postMoveBurnCHF += sub.monthlyCostCHF;
      } else if (action === "replace" && sub.swissAlternativeCostCHF) {
        postMoveBurnCHF += sub.swissAlternativeCostCHF;
      } else if (action === "cut") {
        potentialSavingsCHF += sub.monthlyCostCHF ?? sub.monthlyCostEUR * EUR_TO_CHF;
      }
    }

    return { currentBurnEUR, postMoveBurnCHF, potentialSavingsCHF, undecidedCount };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decisions, allSubs]);

  const undecided = allSubs.filter((s) => getAction(s.id) === "undecided");
  const kept = allSubs.filter((s) => getAction(s.id) === "keep");
  const cut = allSubs.filter((s) => getAction(s.id) === "cut");
  const replaced = allSubs.filter((s) => getAction(s.id) === "replace");

  const categoryBreakdown = useMemo(() => {
    const map: Record<SubCategory, number> = {
      streaming: 0, software: 0, telecom: 0, fitness: 0,
      finance: 0, cloud: 0, news: 0, other: 0,
    };
    for (const sub of allSubs) {
      map[sub.category] += sub.monthlyCostEUR || sub.monthlyCostCHF;
    }
    return Object.entries(map)
      .filter(([, v]) => v > 0)
      .map(([cat, amount]) => ({
        category: cat as SubCategory,
        amount,
        ...CATEGORY_CONFIG[cat as SubCategory],
      }));
  }, [allSubs]);

  const withAlternatives = allSubs.filter((s) => s.swissAlternative);
  const customSubIds = useMemo(() => new Set(customSubs.map((s) => s.id)), [customSubs]);

  return (
    <div className="space-y-6 relative">
      <div className="ambient-glow glow-pink" />

      {showAddForm && (
        <AddSubscriptionForm
          onAdd={(sub) => { addCustomSub(sub); setShowAddForm(false); }}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Subscription Manager
          </h1>
          <p className="text-sm text-text-tertiary mt-1">
            {allSubs.length} subscriptions tracked. Triage each one for the move: keep, cut, or replace.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-accent-primary/30 bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
          <button
            onClick={resetDecisions}
            className="text-xs px-3 py-1.5 rounded-lg border border-border-default bg-bg-secondary text-text-muted hover:text-text-secondary transition-colors"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard
          label="Current Burn" value={formatEUR(stats.currentBurnEUR)}
          sublabel="/month (EUR)" icon={<CreditCard className="h-4 w-4" />} color="#e879f9"
        />
        <KPICard
          label="Post-Move Burn" value={formatCHF(stats.postMoveBurnCHF)}
          sublabel="/month (CHF)" icon={<ArrowRight className="h-4 w-4" />} color="#3b82f6"
        />
        <KPICard
          label="Potential Savings" value={formatCHF(stats.potentialSavingsCHF)}
          sublabel="/month if cut" icon={<TrendingDown className="h-4 w-4" />} color="#22c55e"
        />
        <KPICard
          label="Undecided" value={String(stats.undecidedCount)}
          sublabel={`of ${allSubs.length} subs`} icon={<Check className="h-4 w-4" />}
          color={stats.undecidedCount === 0 ? "#22c55e" : "#f59e0b"}
        />
      </div>

      {/* Donut + Triage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <div className="rounded-xl border border-border-default bg-bg-secondary p-4">
            <h2 className="text-xs font-semibold text-text-primary mb-4">Spending by Category</h2>
            <DonutChart data={categoryBreakdown} />
            <div className="mt-4 space-y-1.5">
              {categoryBreakdown.map((d) => (
                <div key={d.category} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-text-secondary">{d.label}</span>
                  </div>
                  <span className="font-data text-text-primary">{formatEUR(d.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-5">
          {undecided.length > 0 && (
            <TriageSection
              title="Undecided" count={undecided.length} color="#f59e0b"
              subs={undecided} getAction={getAction} setDecision={setDecision}
              customSubIds={customSubIds} onDeleteCustom={removeCustomSub}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TriageColumn
              title="Keep" icon={<Check className="h-3.5 w-3.5" />} color="#22c55e"
              subs={kept} getAction={getAction} setDecision={setDecision}
              customSubIds={customSubIds} onDeleteCustom={removeCustomSub}
            />
            <TriageColumn
              title="Cut" icon={<Scissors className="h-3.5 w-3.5" />} color="#ef4444"
              subs={cut} getAction={getAction} setDecision={setDecision}
              customSubIds={customSubIds} onDeleteCustom={removeCustomSub}
            />
            <TriageColumn
              title="Replace" icon={<RefreshCw className="h-3.5 w-3.5" />} color="#3b82f6"
              subs={replaced} getAction={getAction} setDecision={setDecision}
              customSubIds={customSubIds} onDeleteCustom={removeCustomSub}
            />
          </div>
        </div>
      </div>

      {/* Move Comparison Table */}
      {withAlternatives.length > 0 && (
        <div className="rounded-xl border border-border-default bg-bg-secondary p-4">
          <h2 className="text-xs font-semibold text-text-primary mb-4">
            Move Comparison: Austria vs Switzerland
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border-default">
                  <th className="text-left py-2 pr-4 text-text-muted font-medium">Service</th>
                  <th className="text-left py-2 pr-4 text-text-muted font-medium">Current (AT)</th>
                  <th className="text-left py-2 pr-4 text-text-muted font-medium">Swiss Alternative</th>
                  <th className="text-right py-2 pr-4 text-text-muted font-medium">AT Cost</th>
                  <th className="text-right py-2 pr-4 text-text-muted font-medium">CH Cost</th>
                  <th className="text-right py-2 text-text-muted font-medium">Delta</th>
                </tr>
              </thead>
              <tbody>
                {withAlternatives.map((sub) => {
                  const delta = (sub.swissAlternativeCostCHF ?? 0) - sub.monthlyCostEUR * EUR_TO_CHF;
                  return (
                    <tr key={sub.id} className="border-b border-border-subtle last:border-0">
                      <td className="py-2 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: CATEGORY_CONFIG[sub.category].color }} />
                          <span className="text-text-primary font-medium">{sub.name}</span>
                        </div>
                      </td>
                      <td className="py-2 pr-4 text-text-secondary">{sub.name}</td>
                      <td className="py-2 pr-4 text-text-secondary">{sub.swissAlternative}</td>
                      <td className="py-2 pr-4 text-right font-data text-text-primary">{formatEUR(sub.monthlyCostEUR)}</td>
                      <td className="py-2 pr-4 text-right font-data text-text-primary">{formatCHF(sub.swissAlternativeCostCHF ?? 0)}</td>
                      <td className={`py-2 text-right font-data ${delta > 0 ? "text-danger" : "text-success"}`}>
                        {delta > 0 ? "+" : ""}{formatCHF(delta)}
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

/* ---------- Triage Section ---------- */
function TriageSection({
  title, count, color, subs, getAction, setDecision, customSubIds, onDeleteCustom,
}: {
  title: string; count: number; color: string;
  subs: SubscriptionData[]; getAction: (id: string) => SubAction;
  setDecision: (id: string, action: SubAction) => void;
  customSubIds: Set<string>; onDeleteCustom: (id: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        <span className="text-[10px] text-text-muted">{count} item{count !== 1 ? "s" : ""}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {subs.map((sub) => (
          <SubCard
            key={sub.id} sub={sub} action={getAction(sub.id)} setDecision={setDecision}
            onDelete={customSubIds.has(sub.id) ? () => onDeleteCustom(sub.id) : undefined}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- Triage Column ---------- */
function TriageColumn({
  title, icon, color, subs, getAction, setDecision, customSubIds, onDeleteCustom,
}: {
  title: string; icon: React.ReactNode; color: string;
  subs: SubscriptionData[]; getAction: (id: string) => SubAction;
  setDecision: (id: string, action: SubAction) => void;
  customSubIds: Set<string>; onDeleteCustom: (id: string) => void;
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
              key={sub.id} sub={sub} action={getAction(sub.id)} setDecision={setDecision} compact
              onDelete={customSubIds.has(sub.id) ? () => onDeleteCustom(sub.id) : undefined}
            />
          ))
        )}
      </div>
    </div>
  );
}
