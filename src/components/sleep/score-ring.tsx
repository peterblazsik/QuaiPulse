"use client";

import { useState } from "react";
import type { SleepScoreBreakdown } from "@/lib/engines/sleep-score";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

const RINGS = [
  { key: "duration" as const, r: 62, stroke: 7, color: "#3b82f6", label: "Duration", weight: "30%" },
  { key: "quality" as const, r: 52, stroke: 6, color: "#22c55e", label: "Quality", weight: "25%" },
  { key: "latency" as const, r: 43, stroke: 5, color: "#06b6d4", label: "Latency", weight: "20%" },
  { key: "awakenings" as const, r: 35, stroke: 4, color: "#f59e0b", label: "Awakenings", weight: "15%" },
  { key: "consistency" as const, r: 28, stroke: 3, color: "#8b5cf6", label: "Consistency", weight: "10%" },
];

interface ScoreRingProps {
  breakdown: SleepScoreBreakdown;
}

export function ScoreRing({ breakdown }: ScoreRingProps) {
  const [hoveredRing, setHoveredRing] = useState<string | null>(null);

  return (
    <svg viewBox="0 0 160 160" className="w-full h-full">
      <defs>
        {RINGS.map((ring) => (
          <linearGradient key={`grad-${ring.key}`} id={`ring-${ring.key}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={ring.color} />
            <stop offset="100%" stopColor={ring.color} stopOpacity="0.6" />
          </linearGradient>
        ))}
        <filter id="ringGlow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>
      </defs>

      {/* Concentric rings */}
      {RINGS.map((ring) => {
        const circumference = 2 * Math.PI * ring.r;
        const arcLength = circumference * 0.75; // 270 degrees
        const score = clamp(breakdown[ring.key], 0, 100);
        const filledLength = (score / 100) * arcLength;
        const offset = arcLength - filledLength;
        const isHovered = hoveredRing === ring.key;

        return (
          <g key={ring.key}
            onMouseEnter={() => setHoveredRing(ring.key)}
            onMouseLeave={() => setHoveredRing(null)}
            style={{ cursor: "pointer" }}
          >
            {/* Background track */}
            <circle
              cx="80" cy="80" r={ring.r}
              fill="none" stroke="#1e293b" strokeWidth={ring.stroke}
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeLinecap="round" transform="rotate(135 80 80)"
            />

            {/* Glow layer */}
            <circle
              cx="80" cy="80" r={ring.r}
              fill="none" stroke={ring.color} strokeWidth={ring.stroke}
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeDashoffset={offset}
              strokeLinecap="round" transform="rotate(135 80 80)"
              filter="url(#ringGlow)"
              opacity={isHovered ? 0.5 : 0.25}
            />

            {/* Filled arc */}
            <circle
              cx="80" cy="80" r={ring.r}
              fill="none" stroke={`url(#ring-${ring.key})`}
              strokeWidth={isHovered ? ring.stroke + 1 : ring.stroke}
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeDashoffset={offset}
              strokeLinecap="round" transform="rotate(135 80 80)"
              opacity={isHovered ? 1 : 0.9}
              style={{ transition: "stroke-width 0.15s ease, opacity 0.15s ease" }}
            />
          </g>
        );
      })}

      {/* Center text */}
      {hoveredRing ? (
        <>
          <text x="80" y="74" textAnchor="middle" dominantBaseline="central"
            className="font-data" fontSize="28" fontWeight="300" fill="white">
            {breakdown[hoveredRing as keyof SleepScoreBreakdown]}
          </text>
          <text x="80" y="96" textAnchor="middle" dominantBaseline="central"
            fontSize="11" fill="#94a3b8">
            {RINGS.find((r) => r.key === hoveredRing)?.label}
          </text>
          <text x="80" y="108" textAnchor="middle" dominantBaseline="central"
            fontSize="10" fill="#64748b">
            {RINGS.find((r) => r.key === hoveredRing)?.weight} weight
          </text>
        </>
      ) : (
        <>
          <text x="80" y="76" textAnchor="middle" dominantBaseline="central"
            className="font-data" fontSize="36" fontWeight="300" fill="white">
            {breakdown.total}
          </text>
          <text x="80" y="100" textAnchor="middle" dominantBaseline="central"
            fontSize="10" fill="#94a3b8">
            Sleep Score
          </text>
        </>
      )}
    </svg>
  );
}
