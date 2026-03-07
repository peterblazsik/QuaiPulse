"use client";

interface DeltaBadgeProps {
  value: number;
  suffix: string;
  invertColor: boolean;
}

export function DeltaBadge({ value, suffix, invertColor }: DeltaBadgeProps) {
  if (Math.abs(value) < 0.05) return null;
  const isPositive = value > 0;
  const isGood = invertColor ? !isPositive : isPositive;
  return (
    <span className={`inline-flex items-center font-data text-[10px] px-1.5 py-0.5 rounded ${
      isGood ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400"
    }`}>
      {isPositive ? "+" : ""}{value.toFixed(1)}{suffix}
    </span>
  );
}
