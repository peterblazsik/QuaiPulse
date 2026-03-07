"use client";

import { MapPin, Star } from "lucide-react";
import { formatCHF } from "@/lib/utils";
import type { VenueData } from "@/lib/data/venues";

interface VenueCardProps {
  venue: VenueData;
}

export function VenueCard({ venue: v }: VenueCardProps) {
  return (
    <div className="rounded-lg border border-border-subtle bg-bg-secondary/50 p-3 hover:border-border-default transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium text-text-primary truncate">
            {v.name}
          </p>
          <p className="text-[11px] text-text-muted flex items-center gap-1 mt-0.5">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{v.address}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {v.rating && (
            <span className="flex items-center gap-0.5 text-xs text-amber-400 font-data">
              <Star className="h-3 w-3 fill-amber-400" />
              {v.rating.toFixed(1)}
            </span>
          )}
          {v.monthlyPrice && (
            <span className="font-data text-xs text-text-tertiary">
              {formatCHF(v.monthlyPrice)}/mo
            </span>
          )}
        </div>
      </div>
      {v.personalNote && (
        <p className="text-[11px] text-text-tertiary mt-1.5 leading-snug italic">
          {v.personalNote}
        </p>
      )}
      {v.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {v.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 rounded bg-bg-tertiary text-text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
