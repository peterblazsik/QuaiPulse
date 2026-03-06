"use client";

import { useMemo } from "react";
import type { ScoreDimension } from "@/lib/types";
import { SCORE_DIMENSIONS } from "@/lib/constants";
import { scoreColor } from "@/lib/engines/scoring";

interface RadarChartProps {
  scores: Record<ScoreDimension, number>;
  size?: number;
  showLabels?: boolean;
  accentColor?: string;
  className?: string;
}

const LABEL_SHORT: Record<ScoreDimension, string> = {
  commute: "COM",
  gym: "GYM",
  social: "SOC",
  lake: "LKE",
  airport: "AIR",
  food: "FOD",
  quiet: "QUI",
  transit: "TRN",
};

export function RadarChart({
  scores,
  size = 200,
  showLabels = true,
  accentColor,
  className = "",
}: RadarChartProps) {
  const center = size / 2;
  const radius = (size / 2) * 0.72;
  const labelRadius = (size / 2) * 0.92;
  const dims = SCORE_DIMENSIONS;
  const count = dims.length;

  const points = useMemo(() => {
    return dims.map((d, i) => {
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
      const value = scores[d.key as ScoreDimension] / 10;
      return {
        x: center + Math.cos(angle) * radius * value,
        y: center + Math.sin(angle) * radius * value,
        lx: center + Math.cos(angle) * labelRadius,
        ly: center + Math.sin(angle) * labelRadius,
        ax: center + Math.cos(angle) * radius,
        ay: center + Math.sin(angle) * radius,
        dim: d,
        score: scores[d.key as ScoreDimension],
      };
    });
  }, [scores, center, radius, labelRadius, count, dims]);

  const polygon = points.map((p) => `${p.x},${p.y}`).join(" ");

  // Grid rings at 2, 4, 6, 8, 10
  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];

  const fillColor = accentColor ?? "var(--accent-primary)";

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
    >
      {/* Grid rings */}
      {rings.map((r) => (
        <polygon
          key={r}
          points={dims
            .map((_, i) => {
              const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
              return `${center + Math.cos(angle) * radius * r},${center + Math.sin(angle) * radius * r}`;
            })
            .join(" ")}
          fill="none"
          stroke="var(--border-default)"
          strokeWidth={r === 1 ? 1 : 0.5}
          opacity={0.4}
        />
      ))}

      {/* Axis lines */}
      {points.map((p, i) => (
        <line
          key={i}
          x1={center}
          y1={center}
          x2={p.ax}
          y2={p.ay}
          stroke="var(--border-default)"
          strokeWidth={0.5}
          opacity={0.3}
        />
      ))}

      {/* Data polygon */}
      <polygon
        points={polygon}
        fill={fillColor}
        fillOpacity={0.15}
        stroke={fillColor}
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Data points */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={3}
          fill={scoreColor(p.score)}
          stroke="var(--bg-primary)"
          strokeWidth={1.5}
        />
      ))}

      {/* Labels */}
      {showLabels &&
        points.map((p, i) => (
          <text
            key={i}
            x={p.lx}
            y={p.ly}
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--text-tertiary)"
            fontSize={10}
            fontFamily="var(--font-jetbrains), monospace"
          >
            {LABEL_SHORT[p.dim.key as ScoreDimension]}
          </text>
        ))}
    </svg>
  );
}
