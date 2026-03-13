"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Building2, TrendingUp } from "lucide-react";
import { formatCHF } from "@/lib/utils";
import { useApartmentStore } from "@/lib/stores/apartment-store";
import { NEIGHBORHOODS } from "@/lib/data/neighborhoods";
import type { ApartmentStatus } from "@/lib/types";

const STATUS_CONFIG: {
  key: ApartmentStatus;
  label: string;
  color: string;
  shortLabel: string;
}[] = [
  { key: "new", label: "New", shortLabel: "New", color: "#64748b" },
  { key: "interested", label: "Interested", shortLabel: "Int", color: "#3b82f6" },
  { key: "contacted", label: "Contacted", shortLabel: "Con", color: "#f59e0b" },
  {
    key: "viewing_scheduled",
    label: "Viewing",
    shortLabel: "View",
    color: "#8b5cf6",
  },
  { key: "applied", label: "Applied", shortLabel: "App", color: "#06b6d4" },
  { key: "rejected", label: "Rejected", shortLabel: "Rej", color: "#ef4444" },
  { key: "accepted", label: "Accepted", shortLabel: "Acc", color: "#22c55e" },
];

export function ApartmentPipelineCard() {
  const apartments = useApartmentStore((s) => s.apartments);

  const stats = useMemo(() => {
    const active = apartments.filter((a) => a.status !== "rejected");
    const statusCounts = new Map<ApartmentStatus, number>();

    for (const apt of apartments) {
      statusCounts.set(apt.status, (statusCounts.get(apt.status) || 0) + 1);
    }

    const avgRent =
      active.length > 0
        ? active.reduce((sum, a) => sum + a.rent, 0) / active.length
        : 0;

    const rentRange =
      active.length > 0
        ? {
            min: Math.min(...active.map((a) => a.rent)),
            max: Math.max(...active.map((a) => a.rent)),
          }
        : null;

    // Most advanced status
    const statusOrder: ApartmentStatus[] = [
      "accepted",
      "applied",
      "viewing_scheduled",
      "contacted",
      "interested",
      "new",
    ];
    let furthestStatus: ApartmentStatus = "new";
    for (const s of statusOrder) {
      if (statusCounts.has(s) && (statusCounts.get(s) || 0) > 0) {
        furthestStatus = s;
        break;
      }
    }

    // Unique Kreis values
    const kreise = [...new Set(active.map((a) => a.kreis))].sort(
      (a, b) => a - b
    );

    return {
      total: apartments.length,
      active: active.length,
      statusCounts,
      avgRent,
      rentRange,
      furthestStatus,
      kreise,
    };
  }, [apartments]);

  const furthestConf = STATUS_CONFIG.find(
    (s) => s.key === stats.furthestStatus
  )!;

  return (
    <div className="card elevation-1 p-6 relative overflow-hidden">
      <div className="card-hover-line" />
      <div className="flex items-center justify-between mb-4">
        <p className="section-label">Apartment Pipeline</p>
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded"
            style={{
              color: furthestConf.color,
              backgroundColor: `color-mix(in srgb, ${furthestConf.color} 15%, transparent)`,
            }}
          >
            Furthest: {furthestConf.label}
          </span>
        </div>
      </div>

      {apartments.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-text-muted">
          <Building2 className="h-8 w-8 mb-2" />
          <p className="text-sm font-medium text-text-secondary">
            No apartments saved
          </p>
          <p className="text-[10px]">Browse the feed to start building your pipeline</p>
          <Link
            href="/apartments"
            className="mt-3 text-xs text-accent-primary hover:text-accent-primary/80 flex items-center gap-1"
          >
            Go to Apartments <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      ) : (
        <>
          {/* Status funnel visualization */}
          <div className="flex items-end gap-1 h-16 mb-4">
            {STATUS_CONFIG.filter((s) => s.key !== "rejected").map((s) => {
              const count = stats.statusCounts.get(s.key) || 0;
              const maxCount = Math.max(
                1,
                ...STATUS_CONFIG.map(
                  (sc) => stats.statusCounts.get(sc.key) || 0
                )
              );
              const height = count > 0 ? Math.max(20, (count / maxCount) * 100) : 4;

              return (
                <div
                  key={s.key}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <span className="font-data text-[10px] font-bold text-text-secondary">
                    {count > 0 ? count : ""}
                  </span>
                  <div
                    className="w-full rounded-t transition-all duration-500"
                    style={{
                      height: `${height}%`,
                      backgroundColor: count > 0 ? s.color : "var(--bg-tertiary)",
                      opacity: count > 0 ? 1 : 0.3,
                    }}
                  />
                  <span className="text-[9px] text-text-muted">
                    {s.shortLabel}
                  </span>
                </div>
              );
            })}
          </div>

          {/* KPI row */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-[10px] text-text-muted">Active</p>
              <p className="font-data text-lg font-bold text-text-primary">
                {stats.active}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-text-muted">Avg Rent</p>
              <p className="font-data text-lg font-bold text-text-primary">
                {formatCHF(stats.avgRent)}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-text-muted">Range</p>
              <p className="font-data text-sm font-bold text-text-primary">
                {stats.rentRange
                  ? `${formatCHF(stats.rentRange.min)}–${formatCHF(stats.rentRange.max)}`
                  : "—"}
              </p>
            </div>
          </div>

          {/* Kreis coverage */}
          {stats.kreise.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] text-text-muted">Kreis:</span>
              <div className="flex gap-1">
                {stats.kreise.map((k) => {
                  const hood = NEIGHBORHOODS.find((n) => n.kreis === k);
                  return (
                    <Link
                      key={k}
                      href={`/neighborhoods/${hood?.id || ""}`}
                      className="text-[10px] font-data font-bold px-1.5 py-0.5 rounded bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20 transition-colors"
                    >
                      K{k}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rejected count if any */}
          {(stats.statusCounts.get("rejected") || 0) > 0 && (
            <p className="text-[10px] text-text-muted mb-4">
              <span className="text-danger font-data font-bold">
                {stats.statusCounts.get("rejected")}
              </span>{" "}
              rejected
            </p>
          )}

          {/* Footer */}
          <Link
            href="/apartments?tab=pipeline"
            className="flex items-center justify-center gap-1.5 text-xs text-accent-primary hover:text-accent-primary/80 transition-colors py-2"
          >
            <TrendingUp className="h-3.5 w-3.5" />
            Manage Pipeline
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </>
      )}
    </div>
  );
}
