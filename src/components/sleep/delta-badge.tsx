"use client";

import { Tip } from "@/components/ui/tooltip";

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
    <Tip content="Change vs previous 14-day period">
      <span className={`inline-flex items-center font-data text-xs px-1.5 py-0.5 rounded ${
        isGood ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
      }`} tabIndex={0}>
        {isPositive ? "+" : ""}{value.toFixed(1)}{suffix}
      </span>
    </Tip>
  );
}
