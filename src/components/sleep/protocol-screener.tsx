"use client";

import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Filter } from "lucide-react";
import type { SupplementStat } from "@/lib/hooks/use-sleep-analytics";
import { SUPPLEMENTS } from "@/lib/data/sleep-defaults";

type SortField = "name" | "tier" | "delta" | "hitRate" | "latencyDelta" | "countWith" | "avgWith";
type SortDir = "asc" | "desc";

interface ProtocolScreenerProps {
  stats: SupplementStat[];
}

export function ProtocolScreener({ stats }: ProtocolScreenerProps) {
  const [sortField, setSortField] = useState<SortField>("delta");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [tierFilter, setTierFilter] = useState<number | null>(null);

  const filtered = useMemo(() => {
    let data = [...stats];
    if (tierFilter !== null) data = data.filter((s) => s.tier === tierFilter);
    return data;
  }, [stats, tierFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let va: number | string = 0;
      let vb: number | string = 0;

      switch (sortField) {
        case "name": va = a.name; vb = b.name; break;
        case "tier": va = a.tier; vb = b.tier; break;
        case "delta": va = a.delta; vb = b.delta; break;
        case "hitRate": va = a.hitRate; vb = b.hitRate; break;
        case "latencyDelta": va = a.latencyDelta ?? 999; vb = b.latencyDelta ?? 999; break;
        case "countWith": va = a.countWith; vb = b.countWith; break;
        case "avgWith": va = a.avgWith; vb = b.avgWith; break;
      }

      if (typeof va === "string" && typeof vb === "string") {
        return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      return sortDir === "asc" ? (va as number) - (vb as number) : (vb as number) - (va as number);
    });
  }, [filtered, sortField, sortDir]);

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => d === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ArrowUpDown className="h-2.5 w-2.5 text-text-muted/40" />;
    return sortDir === "asc"
      ? <ArrowUp className="h-2.5 w-2.5 text-accent-primary" />
      : <ArrowDown className="h-2.5 w-2.5 text-accent-primary" />;
  }

  return (
    <div className="card elevation-1 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="h-3.5 w-3.5 text-text-muted" />
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Supplement Screener
        </h2>
        <div className="flex items-center gap-1 ml-auto">
          {[null, 1, 2, 3].map((tier) => (
            <button key={tier ?? "all"} onClick={() => setTierFilter(tier)}
              className="text-[8px] px-1.5 py-0.5 rounded transition-colors"
              style={{
                backgroundColor: tierFilter === tier ? "rgba(59, 130, 246, 0.2)" : "transparent",
                color: tierFilter === tier ? "#60a5fa" : "#64748b",
                border: tierFilter === tier ? "1px solid rgba(59, 130, 246, 0.3)" : "1px solid transparent",
              }}>
              {tier === null ? "ALL" : `T${tier}`}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full text-[10px]">
          <thead>
            <tr className="border-b border-border-default/30">
              {([
                { field: "name" as SortField, label: "Supplement", align: "left" as const, width: "flex-1" },
                { field: "tier" as SortField, label: "T", align: "center" as const, width: "w-6" },
                { field: "avgWith" as SortField, label: "Avg Q", align: "right" as const, width: "w-10" },
                { field: "delta" as SortField, label: "Δ", align: "right" as const, width: "w-10" },
                { field: "hitRate" as SortField, label: "Hit%", align: "right" as const, width: "w-10" },
                { field: "latencyDelta" as SortField, label: "Lat Δ", align: "right" as const, width: "w-12" },
                { field: "countWith" as SortField, label: "n", align: "right" as const, width: "w-6" },
              ]).map((col) => (
                <th key={col.field}
                  className={`pb-1.5 font-semibold text-text-muted uppercase tracking-wider cursor-pointer select-none hover:text-text-secondary transition-colors ${col.width} text-${col.align}`}
                  onClick={() => toggleSort(col.field)}>
                  <span className="inline-flex items-center gap-0.5">
                    {col.label}
                    <SortIcon field={col.field} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => {
              const supData = SUPPLEMENTS.find((sup) => sup.id === s.id);
              return (
                <tr key={s.id} className="border-b border-border-default/10 hover:bg-surface-2/50 transition-colors group">
                  <td className="py-1.5 text-left">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="text-text-secondary font-medium truncate">{s.name}</span>
                    </div>
                  </td>
                  <td className="py-1.5 text-center">
                    <span className="text-[8px] font-data" style={{ color: s.tier === 1 ? "#22c55e" : s.tier === 2 ? "#f59e0b" : "#64748b" }}>
                      T{s.tier}
                    </span>
                  </td>
                  <td className="py-1.5 text-right font-data"
                    style={{ color: s.avgWith >= 4 ? "#22c55e" : s.avgWith >= 3 ? "#f59e0b" : "#ef4444" }}>
                    {s.avgWith.toFixed(1)}
                  </td>
                  <td className="py-1.5 text-right font-data font-semibold"
                    style={{ color: s.delta >= 0.5 ? "#22c55e" : s.delta >= 0.2 ? "#3b82f6" : s.delta < 0 ? "#ef4444" : "#64748b" }}>
                    {s.delta > 0 ? "+" : ""}{s.delta.toFixed(2)}
                  </td>
                  <td className="py-1.5 text-right">
                    <div className="inline-flex items-center gap-1">
                      <div className="w-8 h-[3px] bg-surface-2 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{
                          width: `${s.hitRate * 100}%`,
                          backgroundColor: s.hitRate >= 0.7 ? "#22c55e" : s.hitRate >= 0.5 ? "#f59e0b" : "#ef4444",
                        }} />
                      </div>
                      <span className="font-data text-text-muted">{Math.round(s.hitRate * 100)}</span>
                    </div>
                  </td>
                  <td className="py-1.5 text-right font-data"
                    style={{ color: s.latencyDelta != null ? (s.latencyDelta < -3 ? "#22c55e" : s.latencyDelta > 3 ? "#ef4444" : "#64748b") : "#334155" }}>
                    {s.latencyDelta != null ? `${s.latencyDelta > 0 ? "+" : ""}${Math.round(s.latencyDelta)}m` : "—"}
                  </td>
                  <td className="py-1.5 text-right font-data text-text-muted">
                    {s.countWith}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sorted.length === 0 && (
        <p className="text-[10px] text-text-muted text-center py-4">No supplement data yet. Log entries with supplements.</p>
      )}
    </div>
  );
}
