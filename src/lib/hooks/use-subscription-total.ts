"use client";

import { useMemo } from "react";
import { useSubscriptionStore } from "@/lib/stores/subscription-store";
import { DEFAULT_SUBSCRIPTIONS, type SubAction } from "@/lib/data/subscriptions";
import { EUR_TO_CHF } from "@/lib/constants";

/**
 * Compute the actual post-move monthly subscription cost based on user decisions.
 * - "keep" → CHF cost as-is
 * - "replace" → Swiss alternative cost (or 0)
 * - "cut" → 0
 * - "undecided" → CHF cost (assume keeping until decided)
 */
export function useSubscriptionTotal() {
  const decisions = useSubscriptionStore((s) => s.decisions);
  const customSubs = useSubscriptionStore((s) => s.customSubs);

  return useMemo(() => {
    const allSubs = [...DEFAULT_SUBSCRIPTIONS, ...customSubs];
    let total = 0;
    let savings = 0;
    let decidedCount = 0;

    for (const sub of allSubs) {
      const action: SubAction = decisions[sub.id] ?? "undecided";

      if (action === "keep" || action === "undecided") {
        total += sub.monthlyCostCHF ?? sub.monthlyCostEUR * EUR_TO_CHF;
      } else if (action === "replace" && sub.swissAlternativeCostCHF) {
        total += sub.swissAlternativeCostCHF;
        savings += (sub.monthlyCostCHF ?? sub.monthlyCostEUR * EUR_TO_CHF) - sub.swissAlternativeCostCHF;
      } else if (action === "cut") {
        savings += sub.monthlyCostCHF ?? sub.monthlyCostEUR * EUR_TO_CHF;
      }

      if (action !== "undecided") decidedCount++;
    }

    return {
      /** Post-move monthly subscription total in CHF */
      total: Math.round(total),
      /** Monthly savings from cut/replace decisions */
      savings: Math.round(savings),
      /** Number of subscriptions with a decision */
      decidedCount,
      /** Total subscription count */
      totalCount: allSubs.length,
      /** Whether user has made any subscription decisions */
      hasDecisions: decidedCount > 0,
    };
  }, [decisions, customSubs]);
}
