"use client";

import type { SourceStats } from "@/lib/engines/rental-intelligence";
import { formatCHF } from "@/lib/utils";

interface Props {
  data: SourceStats[];
}

const SOURCE_META: Record<string, { label: string; color: string; bg: string }> = {
  flatfox: { label: "Flatfox", color: "text-orange-400", bg: "bg-orange-400/10" },
  homegate: { label: "Homegate", color: "text-blue-400", bg: "bg-blue-400/10" },
};

export function SourceComparison({ data }: Props) {
  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-5">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
        Source Comparison
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {data.map((s) => {
          const meta = SOURCE_META[s.source] ?? { label: s.source, color: "text-gray-400", bg: "bg-gray-400/10" };
          return (
            <div
              key={s.source}
              className={`rounded-lg border border-[var(--border-default)] p-4 ${meta.bg}`}
            >
              <div className={`text-sm font-semibold ${meta.color} mb-3`}>
                {meta.label}
              </div>
              <div className="space-y-2 text-xs font-mono">
                <Row label="Listings" value={s.count.toString()} />
                <Row label="Med. Rent" value={formatCHF(s.medianRent)} />
                <Row label="Med. CHF/m²" value={s.medianPricePerSqm.toString()} />
                <Row label="Avg. Rooms" value={s.avgRooms.toString()} />
                <Row label="Avg. m²" value={`${s.avgSqm} m²`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-[var(--text-tertiary)]">{label}</span>
      <span className="text-[var(--text-primary)]">{value}</span>
    </div>
  );
}
