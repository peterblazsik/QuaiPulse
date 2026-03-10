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
    <span className={`inline-flex items-center font-data text-xs px-1.5 py-0.5 rounded ${
      isGood ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
    }`}>
      {isPositive ? "+" : ""}{value.toFixed(1)}{suffix}
    </span>
  );
}
