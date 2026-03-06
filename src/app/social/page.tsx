"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  MapPin,
  Dumbbell,
  Crown,
  Brain,
  Waves,
  Utensils,
  Users,
  Laptop,
  ExternalLink,
  Star,
} from "lucide-react";
import { VENUES, type VenueData } from "@/lib/data/venues";
import { NEIGHBORHOODS } from "@/lib/data/neighborhoods";
import type { VenueType } from "@/lib/types";
import { formatCHF } from "@/lib/utils";
import { SOCIAL_IMAGES } from "@/lib/data/images";

const CATEGORY_CONFIG: {
  type: VenueType;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  { type: "gym", label: "Gyms", icon: <Dumbbell className="h-3.5 w-3.5" />, color: "#ef4444" },
  { type: "chess", label: "Chess", icon: <Crown className="h-3.5 w-3.5" />, color: "#8b5cf6" },
  { type: "ai_meetup", label: "AI/Tech", icon: <Brain className="h-3.5 w-3.5" />, color: "#3b82f6" },
  { type: "swimming", label: "Swimming", icon: <Waves className="h-3.5 w-3.5" />, color: "#06b6d4" },
  { type: "restaurant", label: "Food", icon: <Utensils className="h-3.5 w-3.5" />, color: "#f97316" },
  { type: "social", label: "Social", icon: <Users className="h-3.5 w-3.5" />, color: "#f59e0b" },
  { type: "coworking", label: "Coworking", icon: <Laptop className="h-3.5 w-3.5" />, color: "#22c55e" },
];

export default function SocialPage() {
  const [activeFilter, setActiveFilter] = useState<VenueType | "all">("all");

  const filtered = useMemo(() => {
    if (activeFilter === "all") return VENUES;
    return VENUES.filter((v) => v.type === activeFilter);
  }, [activeFilter]);

  const grouped = useMemo(() => {
    const groups: Record<string, VenueData[]> = {};
    for (const venue of filtered) {
      const nid = venue.neighborhoodId;
      if (!groups[nid]) groups[nid] = [];
      groups[nid].push(venue);
    }
    return groups;
  }, [filtered]);

  const neighborhoodName = (id: string) =>
    NEIGHBORHOODS.find((n) => n.id === id)?.name ?? id;

  return (
    <div className="space-y-6 relative">
      {/* Ambient glow */}
      <div className="ambient-glow glow-amber" />

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Social Infrastructure
        </h1>
        <p className="text-sm text-text-tertiary mt-1">
          {VENUES.length} venues mapped across {NEIGHBORHOODS.length}{" "}
          neighborhoods. Your social life, organized.
        </p>
      </div>

      {/* Category hero images */}
      {activeFilter !== "all" && SOCIAL_IMAGES[activeFilter] && (
        <div className="card-hero relative h-32 overflow-hidden rounded-xl">
          <Image
            src={SOCIAL_IMAGES[activeFilter]}
            alt={activeFilter}
            fill
            className="object-cover"
          />
          <div className="img-overlay-full" />
          <div className="relative z-10 flex h-full items-end p-4">
            <p className="font-display text-lg font-bold text-white">
              {CATEGORY_CONFIG.find(c => c.type === activeFilter)?.label}
            </p>
          </div>
        </div>
      )}

      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2">
        <FilterTab
          active={activeFilter === "all"}
          onClick={() => setActiveFilter("all")}
          color="var(--accent-primary)"
        >
          All ({VENUES.length})
        </FilterTab>
        {CATEGORY_CONFIG.map((cat) => {
          const count = VENUES.filter((v) => v.type === cat.type).length;
          return (
            <FilterTab
              key={cat.type}
              active={activeFilter === cat.type}
              onClick={() => setActiveFilter(cat.type)}
              color={cat.color}
            >
              <span className="flex items-center gap-1.5">
                {cat.icon}
                {cat.label} ({count})
              </span>
            </FilterTab>
          );
        })}
      </div>

      {/* Venue grid by neighborhood */}
      <div className="space-y-6">
        {Object.entries(grouped)
          .sort(([a], [b]) => neighborhoodName(a).localeCompare(neighborhoodName(b)))
          .map(([nid, venues]) => (
            <div key={nid}>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-3.5 w-3.5 text-text-muted" />
                <h3 className="text-sm font-semibold text-text-primary">
                  {neighborhoodName(nid)}
                </h3>
                <span className="text-[10px] text-text-muted">
                  {venues.length} venue{venues.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {venues.map((venue) => (
                  <VenueCard key={venue.id} venue={venue} />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function FilterTab({
  active,
  onClick,
  color,
  children,
}: {
  active: boolean;
  onClick: () => void;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
        active
          ? "text-text-primary"
          : "border-border-default bg-bg-secondary text-text-muted hover:text-text-secondary"
      }`}
      style={
        active
          ? {
              borderColor: `color-mix(in srgb, ${color} 50%, transparent)`,
              backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
            }
          : undefined
      }
    >
      {children}
    </button>
  );
}

function VenueCard({ venue }: { venue: VenueData }) {
  const cat = CATEGORY_CONFIG.find((c) => c.type === venue.type);

  return (
    <div className="rounded-lg border border-border-default bg-bg-secondary p-3 hover:border-accent-primary/30 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span style={{ color: cat?.color }}>{cat?.icon}</span>
            <h4 className="text-xs font-semibold text-text-primary truncate">
              {venue.name}
            </h4>
          </div>
          <p className="text-[10px] text-text-muted mt-0.5 truncate">
            {venue.address}
          </p>
        </div>
        {venue.rating && (
          <div className="flex items-center gap-0.5 shrink-0">
            <Star className="h-2.5 w-2.5 text-amber-400 fill-amber-400" />
            <span className="font-data text-[10px] text-amber-400">
              {venue.rating}
            </span>
          </div>
        )}
      </div>

      {/* Personal note */}
      {venue.personalNote && (
        <p className="text-[10px] text-text-tertiary mt-2 leading-snug italic">
          &ldquo;{venue.personalNote}&rdquo;
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-subtle">
        <div className="flex items-center gap-2">
          {venue.monthlyPrice && (
            <span className="font-data text-[10px] text-text-muted">
              {formatCHF(venue.monthlyPrice)}/mo
            </span>
          )}
          <div className="flex gap-1">
            {venue.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[8px] px-1.5 py-0.5 rounded bg-bg-tertiary text-text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        {venue.website && (
          <a
            href={venue.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-primary hover:text-accent-hover"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}
