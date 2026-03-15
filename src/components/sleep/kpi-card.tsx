"use client";

import type { LucideIcon } from "lucide-react";
import { DeltaBadge } from "./delta-badge";
import { Tip } from "@/components/ui/tooltip";

const KPI_TIPS: Record<string, string> = {
  "Hours (14d)": "Average sleep duration over last 14 nights",
  "Quality (14d)": "Average self-rated sleep quality (1-5 scale)",
  "Latency (14d)": "Average minutes to fall asleep. Lower is better",
  "Wake-ups (14d)": "Average night awakenings. Fewer is better",
  "Best Location": "Location with highest average sleep quality",
  "Best Supplement": "Supplement correlated with best sleep quality",
};

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
        <Tip content={KPI_TIPS[label]}>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted" tabIndex={0}>{label}</p>
        </Tip>
      </div>
      <div className="flex items-end gap-1.5 mt-1.5">
        <p className={`font-data text-2xl font-bold ${valueColor ?? "text-accent-primary"}`}>{value}</p>
        {delta != null && <DeltaBadge value={delta} suffix={deltaSuffix ?? ""} invertColor={invertDelta ?? false} />}
      </div>
      <p className="mt-0.5 text-xs text-text-tertiary">{subtitle}</p>
    </div>
  );
}
