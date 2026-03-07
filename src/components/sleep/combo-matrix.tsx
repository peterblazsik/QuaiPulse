"use client";

import { useState } from "react";
import { Grid3x3 } from "lucide-react";
import type { ComboMatrix as ComboMatrixType, ComboCell } from "@/lib/engines/sleep-combos";
import { getComboCellColor, getComboCellOpacity } from "@/lib/engines/sleep-combos";
import { SUPPLEMENTS, INTERVENTIONS } from "@/lib/data/sleep-defaults";

interface ComboMatrixProps {
  matrix: ComboMatrixType;
}

export function ComboMatrixChart({ matrix }: ComboMatrixProps) {
  const [hovered, setHovered] = useState<ComboCell | null>(null);

  if (matrix.cells.length === 0) {
    return (
      <div className="card elevation-1 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Grid3x3 className="h-3.5 w-3.5 text-text-muted" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Correlation Matrix</h2>
        </div>
        <p className="text-[10px] text-text-muted">Need entries with both supplements AND interventions to build correlations.</p>
      </div>
    );
  }

  const rows = matrix.supplementIds;
  const cols = matrix.interventionIds;

  function getCell(supId: string, intvId: string): ComboCell | undefined {
    return matrix.cells.find((c) => c.supplementId === supId && c.interventionId === intvId);
  }

  return (
    <div className="card elevation-1 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Grid3x3 className="h-3.5 w-3.5 text-text-muted" />
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Correlation Matrix</h2>
        <span className="text-[8px] text-text-muted ml-auto">supplement × intervention</span>
      </div>

      {/* Tooltip */}
      {hovered && (
        <div className="mb-2 p-2 rounded-lg bg-surface-2 border border-border-default/30">
          <div className="flex items-baseline gap-2">
            <span className="text-[10px] text-text-primary font-medium">
              {hovered.supplementName} + {hovered.interventionName}
            </span>
            <span className="font-data text-xs font-bold"
              style={{ color: hovered.avgQuality >= 4 ? "#22c55e" : hovered.avgQuality >= 3 ? "#f59e0b" : "#ef4444" }}>
              {hovered.avgQuality.toFixed(1)}/5
            </span>
          </div>
          <div className="flex gap-3 mt-0.5">
            <span className="text-[9px] text-text-muted">{hovered.count} nights</span>
            {hovered.avgLatency != null && (
              <span className="text-[9px] text-text-muted">latency {Math.round(hovered.avgLatency)}m</span>
            )}
            {hovered.avgAwakenings != null && (
              <span className="text-[9px] text-text-muted">{hovered.avgAwakenings.toFixed(1)} wakeups</span>
            )}
            <span className="text-[9px] font-data"
              style={{ color: hovered.avgQuality - matrix.baseline >= 0 ? "#22c55e" : "#ef4444" }}>
              {hovered.avgQuality - matrix.baseline >= 0 ? "+" : ""}{(hovered.avgQuality - matrix.baseline).toFixed(1)} vs baseline
            </span>
          </div>
        </div>
      )}

      {/* Grid-based matrix — fixed cell sizes, no SVG scaling issues */}
      <div className="overflow-x-auto -mx-4 px-4">
        <table className="border-collapse" style={{ fontSize: 0 }}>
          {/* Column header row */}
          <thead>
            <tr>
              <th className="w-[80px]" />
              {cols.map((intvId) => {
                const name = INTERVENTIONS.find((i) => i.id === intvId)?.name ?? intvId;
                const short = name.length > 10 ? name.slice(0, 8) + "…" : name;
                return (
                  <th key={`col-${intvId}`} className="pb-1 px-[1px]" style={{ width: 26 }}>
                    <div className="font-data text-[7px] text-text-muted font-normal whitespace-nowrap origin-bottom-left"
                      style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", height: 48, lineHeight: "26px" }}>
                      {short}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((supId) => {
              const sup = SUPPLEMENTS.find((s) => s.id === supId);
              const name = sup?.name ?? supId;
              const short = name.length > 14 ? name.slice(0, 12) + "…" : name;

              return (
                <tr key={`row-${supId}`}>
                  <td className="pr-1.5 text-right align-middle">
                    <span className="font-data text-[8px] text-slate-400 whitespace-nowrap">{short}</span>
                  </td>
                  {cols.map((intvId) => {
                    const cell = getCell(supId, intvId);
                    return (
                      <td key={`cell-${supId}-${intvId}`} className="p-[1px] align-middle">
                        {cell ? (
                          <div
                            className="flex items-center justify-center rounded-[3px] font-data text-[8px] font-semibold text-white/90 transition-all hover:ring-1 hover:ring-white/40 cursor-pointer"
                            style={{
                              width: 26,
                              height: 22,
                              backgroundColor: getComboCellColor(cell.avgQuality, matrix.baseline),
                              opacity: getComboCellOpacity(cell.count),
                            }}
                            onMouseEnter={() => setHovered(cell)}
                            onMouseLeave={() => setHovered(null)}
                          >
                            {cell.avgQuality.toFixed(1)}
                          </div>
                        ) : (
                          <div
                            className="rounded-[3px]"
                            style={{ width: 26, height: 22, backgroundColor: "#0f172a", opacity: 0.3 }}
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border-default/30">
        <span className="text-[8px] text-text-muted">quality:</span>
        {[
          { label: "−", color: "#ef4444" },
          { label: "=", color: "#1e3a5f" },
          { label: "+", color: "#3b82f6" },
          { label: "++", color: "#22c55e" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-0.5">
            <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: item.color }} />
            <span className="text-[7px] text-text-muted">{item.label}</span>
          </div>
        ))}
        <span className="text-[8px] text-text-muted ml-auto">opacity = sample size</span>
      </div>
    </div>
  );
}
