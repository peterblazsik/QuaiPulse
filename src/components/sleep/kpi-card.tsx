"use client";

import type { LucideIcon } from "lucide-react";
import { DeltaBadge } from "./delta-badge";

interface KpiCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  valueColor?: string;
  delta?: number | null;
  deltaSuffix?: string;
  invertDelta?: boolean;
  subtitle: string;
}

export function KpiCard({ icon: Icon, label, value, valueColor, delta, deltaSuffix, invertDelta, subtitle }: KpiCardProps) {
  return (
    <div className="card elevation-1 p-3 relative overflow-hidden">
      <div className="card-hover-line" />
      <div className="flex items-center gap-1.5">
        <Icon className="h-3 w-3 text-text-muted" />
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">{label}</p>
      </div>
      <div className="flex items-end gap-1.5 mt-1.5">
        <p className={`font-data text-2xl font-bold ${valueColor ?? "text-accent-primary"}`}>{value}</p>
        {delta != null && <DeltaBadge value={delta} suffix={deltaSuffix ?? ""} invertColor={invertDelta ?? false} />}
      </div>
      <p className="mt-0.5 text-xs text-text-tertiary">{subtitle}</p>
    </div>
  );
}
