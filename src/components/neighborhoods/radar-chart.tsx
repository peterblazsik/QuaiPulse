"use client";

import { useMemo } from "react";
import type { ScoreDimension } from "@/lib/types";
import { SCORE_DIMENSIONS } from "@/lib/constants";
import { scoreColor } from "@/lib/engines/scoring";

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

interface RadarDataset {
  scores: Record<ScoreDimension, number>;
  color: string;
  id?: string;
}

interface RadarChartProps {
  /** Single dataset (backward compatible) */
  scores?: Record<ScoreDimension, number>;
  /** Multiple overlaid datasets */
  datasets?: RadarDataset[];
  size?: number;
  showLabels?: boolean;
  /** Accent color for single-dataset mode */
  accentColor?: string;
  className?: string;
}

const RINGS = [0.2, 0.4, 0.6, 0.8, 1.0];

export function RadarChart({
  scores,
  datasets,
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

  // Normalize to datasets array
  const resolvedDatasets: RadarDataset[] = useMemo(() => {
    if (datasets && datasets.length > 0) return datasets;
    if (scores) return [{ scores, color: accentColor ?? "var(--accent-primary)" }];
    return [];
  }, [scores, datasets, accentColor]);

  const axisPoints = useMemo(() => {
    return dims.map((_, i) => {
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
      return {
        x: center + Math.cos(angle) * radius,
        y: center + Math.sin(angle) * radius,
        lx: center + Math.cos(angle) * labelRadius,
        ly: center + Math.sin(angle) * labelRadius,
      };
    });
  }, [center, radius, labelRadius, count, dims]);

  const isOverlay = resolvedDatasets.length > 1;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
    >
      {/* Grid rings */}
      {RINGS.map((r) => (
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
      {axisPoints.map((p, i) => (
        <line
          key={i}
          x1={center}
          y1={center}
          x2={p.x}
          y2={p.y}
          stroke="var(--border-default)"
          strokeWidth={0.5}
          opacity={0.3}
        />
      ))}

      {/* Data polygons */}
      {resolvedDatasets.map((ds, di) => {
        const points = dims.map((d, i) => {
          const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
          const value = ds.scores[d.key as ScoreDimension] / 10;
          return {
            x: center + Math.cos(angle) * radius * value,
            y: center + Math.sin(angle) * radius * value,
            score: ds.scores[d.key as ScoreDimension],
          };
        });

        const polygon = points.map((p) => `${p.x},${p.y}`).join(" ");

        return (
          <g key={ds.id ?? di}>
            <polygon
              points={polygon}
              fill={ds.color}
              fillOpacity={isOverlay ? 0.08 : 0.15}
              stroke={ds.color}
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
                fill={isOverlay ? ds.color : scoreColor(p.score)}
                stroke="var(--bg-primary)"
                strokeWidth={1.5}
              />
            ))}
          </g>
        );
      })}

      {/* Labels */}
      {showLabels &&
        axisPoints.map((p, i) => (
          <text
            key={i}
            x={p.lx}
            y={p.ly}
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--text-tertiary)"
            fontSize={size >= 280 ? 11 : 10}
            fontFamily="var(--font-jetbrains), monospace"
          >
            {LABEL_SHORT[dims[i].key as ScoreDimension]}
          </text>
        ))}
    </svg>
  );
}
