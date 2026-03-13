"use client";

import Image from "next/image";
import type { BudgetAnalysis } from "@/lib/engines/rental-intelligence";
import { formatCHF } from "@/lib/utils";
import { RENTAL_INTEL_IMAGES } from "@/lib/data/images";

interface Props {
  data: BudgetAnalysis;
}

export function BudgetFitPanel({ data }: Props) {
  const segments = [
    { label: "Comfortable", percent: data.comfortablePercent, count: data.comfortableCount, color: "#22c55e" },
    { label: "Stretch", percent: data.stretchPercent, count: data.stretchCount, color: "#f59e0b" },
    { label: "Over Budget", percent: data.overPercent, count: data.overCount, color: "#ef4444" },
  ];

  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] overflow-hidden">
      {/* Section image header */}
      <div className="relative h-24">
        <Image
          src={RENTAL_INTEL_IMAGES.finance}
          alt="Swiss franc financial analysis"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-secondary)]" />
      </div>

      <div className="px-5 pb-5 -mt-3 relative">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
        Budget Fit Analysis
      </h3>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Donut-style bar */}
        <div>
          <div className="flex h-4 rounded-full overflow-hidden mb-4">
            {segments.map((s) => (
              <div
                key={s.label}
                style={{ width: `${s.percent}%`, backgroundColor: s.color }}
                className="transition-all"
                title={`${s.label}: ${s.percent}%`}
              />
            ))}
          </div>

          <div className="space-y-2">
            {segments.map((s) => (
              <div key={s.label} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-[var(--text-secondary)]">{s.label}</span>
                </div>
                <span className="font-mono text-[var(--text-primary)]">
                  {s.count} ({s.percent}%)
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-[var(--border-default)] text-xs font-mono text-[var(--text-tertiary)]">
            Rent-to-income: {data.rentToIncomeRatio}% of {formatCHF(data.totalIncome)}/mo
          </div>
        </div>

        {/* Vienna comparison */}
        <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] p-4">
          <div className="text-xs font-semibold text-[var(--text-secondary)] mb-3">
            Zurich vs Vienna
          </div>
          <div className="space-y-3 text-xs font-mono">
            <CompRow
              label="Zurich median rent"
              value={formatCHF(data.zurichMedianRent)}
              highlight
            />
            <CompRow
              label="Vienna fixed costs"
              value={formatCHF(data.viennaCosts)}
            />
            <CompRow
              label="Combined housing"
              value={formatCHF(data.zurichMedianRent + data.viennaCosts)}
              highlight
            />
            <CompRow
              label="% of net income"
              value={`${Math.round(((data.zurichMedianRent + data.viennaCosts) / data.totalIncome) * 100)}%`}
            />
            <CompRow
              label="Remaining after housing"
              value={formatCHF(data.totalIncome - data.zurichMedianRent - data.viennaCosts)}
              highlight
            />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

function CompRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-[var(--text-tertiary)]">{label}</span>
      <span className={highlight ? "text-[var(--accent-primary)]" : "text-[var(--text-primary)]"}>
        {value}
      </span>
    </div>
  );
}
