"use client";

import { useState } from "react";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

interface DumbbellChartData {
  id: string;
  name: string;
  color: string;
  avgWith: number;
  avgWithout: number;
  countWith: number;
}

export function DumbbellChart({ data }: { data: DumbbellChartData[] }) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  if (data.length === 0) return null;

  const padLeft = 90;
  const padRight = 44;
  const padTop = 12;
  const padBottom = 20;
  const rowH = 28;
  const svgW = 500;
  const svgH = padTop + data.length * rowH + padBottom;
  const plotW = svgW - padLeft - padRight;

  const scaleMax = 5;
  const xOf = (v: number) => padLeft + (v / scaleMax) * plotW;
  const gridTicks = [0, 1, 2, 3, 4, 5];

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto">
      {/* Grid */}
      {gridTicks.map((t) => (
        <g key={`grid-${t}`}>
          <line x1={xOf(t)} y1={padTop} x2={xOf(t)} y2={svgH - padBottom}
            stroke="#1e293b" strokeWidth="1" />
          <text x={xOf(t)} y={svgH - padBottom + 12} textAnchor="middle"
            className="font-data" fontSize="8" fill="#64748b">{t}</text>
        </g>
      ))}

      {/* Rows */}
      {data.map((d, i) => {
        const y = padTop + i * rowH + rowH / 2;
        const isHovered = hoveredRow === d.id;
        const isPositive = d.avgWith > d.avgWithout;
        const delta = d.avgWith - d.avgWithout;
        const deltaStr = `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}`;
        const lineColor = isPositive ? "#22c55e" : "#f59e0b";

        const xWithout = xOf(clamp(d.avgWithout, 0, scaleMax));
        const xWith = xOf(clamp(d.avgWith, 0, scaleMax));

        return (
          <g key={d.id}
            onMouseEnter={() => setHoveredRow(d.id)}
            onMouseLeave={() => setHoveredRow(null)}>

            {i % 2 === 1 && (
              <rect x={0} y={y - rowH / 2} width={svgW} height={rowH}
                fill="rgba(255,255,255,0.02)" />
            )}
            {isHovered && (
              <rect x={0} y={y - rowH / 2} width={svgW} height={rowH}
                fill="rgba(255,255,255,0.04)" />
            )}

            <text x={padLeft - 6} y={y} textAnchor="end" dominantBaseline="central"
              fontSize="9" fill="#94a3b8">
              {d.name.length > 14 ? `${d.name.slice(0, 13)}...` : d.name}
            </text>

            <line x1={xWithout} y1={y} x2={xWith} y2={y}
              stroke={lineColor} strokeWidth="2" opacity={isHovered ? 1 : 0.7} />

            <circle cx={xWithout} cy={y} r={isHovered ? 5 : 4} fill="#475569" />
            <circle cx={xWith} cy={y} r={isHovered ? 5 : 4} fill={d.color} />

            <text x={svgW - padRight + 6} y={y} dominantBaseline="central"
              className="font-data" fontSize="9" fill={isPositive ? "#22c55e" : "#f59e0b"}>
              {deltaStr}
            </text>

            {isHovered && (
              <g>
                <rect x={xWith + 8} y={y - 9} width={28} height={16} rx="3"
                  fill="#0f172a" stroke="#334155" strokeWidth="1" />
                <text x={xWith + 22} y={y} textAnchor="middle" dominantBaseline="central"
                  className="font-data" fontSize="8" fill="#e2e8f0">
                  n={d.countWith}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
