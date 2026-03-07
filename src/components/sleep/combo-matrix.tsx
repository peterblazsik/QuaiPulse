"use client";

import { useState } from "react";
import { Grid3x3 } from "lucide-react";
import type { ComboMatrix as ComboMatrixType, ComboCell } from "@/lib/engines/sleep-combos";
import { getComboCellColor, getComboCellOpacity } from "@/lib/engines/sleep-combos";
import { SUPPLEMENTS, INTERVENTIONS } from "@/lib/data/sleep-defaults";

interface ComboMatrixProps {
  matrix: ComboMatrixType;
}

const CELL_SIZE = 28;
const GAP = 2;
const LABEL_W = 90;
const LABEL_H = 60;

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

  const svgW = LABEL_W + cols.length * (CELL_SIZE + GAP);
  const svgH = LABEL_H + rows.length * (CELL_SIZE + GAP);

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

      <div className="overflow-x-auto -mx-4 px-4">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto" style={{ minWidth: `${Math.min(svgW, 400)}px` }}>
          {/* Column labels (interventions) */}
          {cols.map((intvId, ci) => {
            const name = INTERVENTIONS.find((i) => i.id === intvId)?.name ?? intvId;
            const truncated = name.length > 12 ? name.slice(0, 10) + "…" : name;
            return (
              <text key={`col-${intvId}`}
                x={LABEL_W + ci * (CELL_SIZE + GAP) + CELL_SIZE / 2}
                y={LABEL_H - 4}
                textAnchor="end" dominantBaseline="central"
                transform={`rotate(-45 ${LABEL_W + ci * (CELL_SIZE + GAP) + CELL_SIZE / 2} ${LABEL_H - 4})`}
                className="font-data" fontSize="7" fill="#64748b">
                {truncated}
              </text>
            );
          })}

          {/* Row labels (supplements) + cells */}
          {rows.map((supId, ri) => {
            const sup = SUPPLEMENTS.find((s) => s.id === supId);
            const name = sup?.name ?? supId;
            const truncated = name.length > 16 ? name.slice(0, 14) + "…" : name;

            return (
              <g key={`row-${supId}`}>
                <text x={LABEL_W - 4}
                  y={LABEL_H + ri * (CELL_SIZE + GAP) + CELL_SIZE / 2}
                  textAnchor="end" dominantBaseline="central"
                  className="font-data" fontSize="7" fill="#94a3b8">
                  {truncated}
                </text>

                {cols.map((intvId, ci) => {
                  const cell = getCell(supId, intvId);
                  const cx = LABEL_W + ci * (CELL_SIZE + GAP);
                  const cy = LABEL_H + ri * (CELL_SIZE + GAP);

                  if (!cell) {
                    return (
                      <rect key={`cell-${supId}-${intvId}`}
                        x={cx} y={cy} width={CELL_SIZE} height={CELL_SIZE} rx={3}
                        fill="#0f172a" opacity={0.3}
                      />
                    );
                  }

                  const fillColor = getComboCellColor(cell.avgQuality, matrix.baseline);
                  const opacity = getComboCellOpacity(cell.count);
                  const isHovered = hovered?.supplementId === supId && hovered?.interventionId === intvId;

                  return (
                    <g key={`cell-${supId}-${intvId}`}
                      onMouseEnter={() => setHovered(cell)}
                      onMouseLeave={() => setHovered(null)}
                      style={{ cursor: "pointer" }}>
                      <rect x={cx} y={cy} width={CELL_SIZE} height={CELL_SIZE} rx={3}
                        fill={fillColor} opacity={opacity}
                        stroke={isHovered ? "#e2e8f0" : "none"} strokeWidth={isHovered ? 1.5 : 0}
                      />
                      <text x={cx + CELL_SIZE / 2} y={cy + CELL_SIZE / 2}
                        textAnchor="middle" dominantBaseline="central"
                        className="font-data" fontSize="8" fill="#e2e8f0" fontWeight="600"
                        style={{ pointerEvents: "none" }}>
                        {cell.avgQuality.toFixed(1)}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
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
