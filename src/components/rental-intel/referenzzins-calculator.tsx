"use client";

import { useState } from "react";
import { Calculator, TrendingDown, Info } from "lucide-react";
import { formatCHF } from "@/lib/utils";

// BWO official Referenzzinssatz as of March 2026
const CURRENT_REFERENZZINSSATZ = 1.25;

// Historical rates for context
const RATE_HISTORY = [
  { date: "Mar 2024", rate: 1.75 },
  { date: "Jun 2024", rate: 1.75 },
  { date: "Dec 2024", rate: 1.50 },
  { date: "Mar 2025", rate: 1.50 },
  { date: "Sep 2025", rate: 1.25 },
  { date: "Mar 2026", rate: 1.25 },
];

// Each 0.25% drop in reference rate = ~3% rent reduction right
function computeReduction(leaseRate: number, currentRate: number): number {
  if (leaseRate <= currentRate) return 0;
  const drops = (leaseRate - currentRate) / 0.25;
  return drops * 3; // ~3% reduction per 0.25% step
}

export function ReferenzzinsCalculator() {
  const [currentRent, setCurrentRent] = useState<number>(2400);
  const [leaseRate, setLeaseRate] = useState<number>(1.75);
  const [showInfo, setShowInfo] = useState(false);

  const reductionPercent = computeReduction(leaseRate, CURRENT_REFERENZZINSSATZ);
  const monthlyReduction = Math.round(currentRent * (reductionPercent / 100));
  const newRent = currentRent - monthlyReduction;
  const yearlysavings = monthlyReduction * 12;

  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-500/15 p-2 border border-emerald-500/30">
              <Calculator className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Referenzzinssatz Calculator
              </h3>
              <p className="text-[10px] text-[var(--text-tertiary)]">
                Swiss reference rate: {CURRENT_REFERENZZINSSATZ}% (Mar 2026)
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>

        {showInfo && (
          <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-[var(--text-secondary)] leading-relaxed">
            The <strong className="text-[var(--text-primary)]">Referenzzinssatz</strong> is the Swiss mortgage reference rate set by the BWO. When it drops, tenants can request a proportional rent reduction. Each 0.25% decrease entitles you to ~3% less rent. You can contest within 30 days of the next rent payment after the rate change. This applies to existing leases — for new leases, check the Anfangsmiete rules.
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Input side */}
          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mb-1 block">
                Current monthly rent (CHF)
              </label>
              <input
                type="number"
                value={currentRent}
                onChange={(e) => setCurrentRent(Number(e.target.value) || 0)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-lg px-3 py-2 text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
            <div>
              <label className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mb-1 block">
                Rate when lease was signed
              </label>
              <select
                value={leaseRate}
                onChange={(e) => setLeaseRate(Number(e.target.value))}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-lg px-3 py-2 text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              >
                {[3.5, 3.25, 3.0, 2.75, 2.5, 2.25, 2.0, 1.75, 1.5, 1.25].map((rate) => (
                  <option key={rate} value={rate}>
                    {rate.toFixed(2)}%
                    {rate === CURRENT_REFERENZZINSSATZ ? " (current)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Rate history */}
            <div className="pt-2">
              <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                Recent rate history
              </div>
              <div className="flex gap-1">
                {RATE_HISTORY.map((h) => (
                  <div
                    key={h.date}
                    className={`flex-1 rounded-md p-1.5 text-center text-[10px] border ${
                      h.rate === CURRENT_REFERENZZINSSATZ
                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                        : "bg-[var(--bg-primary)] border-[var(--border-default)] text-[var(--text-tertiary)]"
                    }`}
                  >
                    <div className="font-mono font-bold">{h.rate}%</div>
                    <div className="mt-0.5">{h.date.split(" ")[0]}</div>
                    <div>{h.date.split(" ")[1]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results side */}
          <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] p-4">
            {reductionPercent > 0 ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <TrendingDown className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs text-emerald-400 font-semibold">
                      Eligible for rent reduction
                    </span>
                  </div>
                  <div className="text-3xl font-bold font-mono text-emerald-400">
                    -{reductionPercent}%
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-tertiary)]">Current rent</span>
                    <span className="text-[var(--text-primary)]">{formatCHF(currentRent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-tertiary)]">Reduction</span>
                    <span className="text-emerald-400">-{formatCHF(monthlyReduction)}/mo</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[var(--border-default)]">
                    <span className="text-[var(--text-tertiary)]">New rent</span>
                    <span className="text-[var(--accent-primary)] font-bold">{formatCHF(newRent)}/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-tertiary)]">Yearly savings</span>
                    <span className="text-emerald-400 font-bold">{formatCHF(yearlysavings)}/yr</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--border-default)] text-[10px] text-[var(--text-tertiary)]">
                  Rate dropped from {leaseRate}% to {CURRENT_REFERENZZINSSATZ}% = {((leaseRate - CURRENT_REFERENZZINSSATZ) / 0.25)} steps of 0.25%
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-4">
                <div className="text-sm text-[var(--text-tertiary)] mb-2">
                  No reduction available
                </div>
                <p className="text-[10px] text-[var(--text-tertiary)]">
                  The lease rate matches or is below the current reference rate. No reduction claim possible.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
