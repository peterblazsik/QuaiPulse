"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { ALL_LOCATIONS } from "@/lib/data/neighborhoods";
import { VENUES } from "@/lib/data/venues";
import { NEIGHBORHOOD_IMAGES } from "@/lib/data/images";
import { usePriorityStore } from "@/lib/stores/priority-store";
import { rankNeighborhoods } from "@/lib/engines/scoring";
import { RadarChart } from "@/components/neighborhoods/radar-chart";
import { ScoreBadge } from "@/components/neighborhoods/score-badge";
import { ScoreBreakdown } from "@/components/neighborhoods/score-breakdown";
import { VibeBadges, CrowdTags, LocationTypeBadge } from "@/components/neighborhoods/vibe-badges";
import { VenueCard } from "@/components/neighborhoods/venue-card";
import { RentalPriceBreakdown } from "@/components/neighborhoods/rental-price-breakdown";
import { formatCHF } from "@/lib/utils";
import { VENUE_TYPE_LABELS, VENUE_TYPE_TEXT_COLORS } from "@/lib/data/venue-config";
import { PORTALS } from "@/lib/data/portal-urls";
import type { VenueType } from "@/lib/types";

export default function NeighborhoodDetailPage() {
  const params = useParams();
  const rawSlug = params.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug ?? "";
  const weights = usePriorityStore((s) => s.weights);

  const neighborhood = ALL_LOCATIONS.find((n) => n.slug === slug);

  const ranked = useMemo(
    () => rankNeighborhoods(ALL_LOCATIONS, weights),
    [weights]
  );

  const scored = ranked.find((n) => n.slug === slug);

  const nearbyVenues = useMemo(() => {
    if (!neighborhood) return [];
    return VENUES.filter((v) => v.neighborhoodId === neighborhood.id);
  }, [neighborhood]);

  const venuesByType = useMemo(() => {
    const grouped: Partial<Record<VenueType, typeof nearbyVenues>> = {};
    for (const v of nearbyVenues) {
      if (!grouped[v.type]) grouped[v.type] = [];
      grouped[v.type]!.push(v);
    }
    return grouped;
  }, [nearbyVenues]);

  if (!neighborhood || !scored) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-text-secondary text-lg">Neighborhood not found</p>
        <Link
          href="/neighborhoods"
          className="text-accent-primary hover:underline flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to rankings
        </Link>
      </div>
    );
  }

  const n = scored;
  const heroImage = NEIGHBORHOOD_IMAGES[n.id];

  return (
    <div className="space-y-6 relative max-w-5xl">
      {/* Ambient glow */}
      <div className="ambient-glow glow-cyan" />

      {/* Back nav */}
      <Link
        href="/neighborhoods"
        className="inline-flex items-center gap-2 text-sm text-text-tertiary hover:text-accent-primary transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to rankings
      </Link>

      {/* Hero */}
      {heroImage && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-hero relative h-64 overflow-hidden rounded-xl"
        >
          <Image
            src={heroImage}
            alt={n.name}
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
            priority
          />
          <div className="img-overlay-full" />
          <div className="relative z-10 flex h-full flex-col justify-end p-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1">
                  {n.locationType === "zurich_kreis" ? `Kreis ${n.kreis}` : n.region || "Lake Zurich"}
                </p>
                <h1 className="font-display text-3xl font-bold text-white drop-shadow-lg">
                  {n.name}
                </h1>
                <p className="text-sm text-white/70 italic mt-1">{n.vibe}</p>
                {n.hoodmapVibes && n.hoodmapVibes.length > 0 && (
                  <div className="mt-2">
                    <VibeBadges vibes={n.hoodmapVibes} size="md" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-text-muted">Rank</p>
                  <p className="font-data text-2xl font-bold text-white">#{n.rank}</p>
                </div>
                <ScoreBadge score={n.weightedScore} size="lg" />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* No hero fallback header */}
      {!heroImage && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1">
                {n.locationType === "zurich_kreis" ? `Kreis ${n.kreis}` : n.region || "Lake Zurich"}
              </p>
              <h1 className="font-display text-3xl font-bold text-text-primary">
                {n.name}
              </h1>
              <p className="text-sm text-text-tertiary italic mt-1">{n.vibe}</p>
              {n.hoodmapVibes && n.hoodmapVibes.length > 0 && (
                <div className="mt-2">
                  <VibeBadges vibes={n.hoodmapVibes} size="md" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-text-muted">Rank</p>
                <p className="font-data text-2xl font-bold text-text-primary">#{n.rank}</p>
              </div>
              <ScoreBadge score={n.weightedScore} size="lg" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="card p-5 space-y-3"
      >
        <p className="text-sm text-text-secondary leading-relaxed">
          {n.description}
        </p>
        {n.crowdTags && n.crowdTags.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1.5">
              Hoodmaps crowd tags
            </p>
            <CrowdTags tags={n.crowdTags} size="md" />
          </div>
        )}
      </motion.div>

      {/* Score Analysis — Radar + Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-5"
      >
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-5">
          Score Analysis
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar */}
          <div className="flex justify-center items-center">
            <RadarChart scores={n.scores} size={280} showLabels={true} />
          </div>

          {/* Dimension scores */}
          <ScoreBreakdown scores={n.scores} notes={n.notes} />
        </div>
      </motion.div>

      {/* Rental Market Breakdown */}
      <RentalPriceBreakdown locationId={n.id} locationName={n.name} />

      {/* Pros & Cons */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="card p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-success mb-3">
            Pros
          </h2>
          <ul className="space-y-2">
            {n.pros.map((pro, i) => (
              <li
                key={i}
                className="text-sm text-text-secondary flex items-start gap-2"
              >
                <span className="text-success mt-0.5 shrink-0 font-bold">+</span>
                {pro}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-danger mb-3">
            Cons
          </h2>
          <ul className="space-y-2">
            {n.cons.map((con, i) => (
              <li
                key={i}
                className="text-sm text-text-secondary flex items-start gap-2"
              >
                <span className="text-danger mt-0.5 shrink-0 font-bold">-</span>
                {con}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Nearby Venues */}
      {nearbyVenues.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card p-5"
        >
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
            Nearby Venues ({nearbyVenues.length})
          </h2>
          <div className="space-y-5">
            {(Object.entries(venuesByType) as [VenueType, typeof nearbyVenues][]).map(
              ([type, venues]) => (
                <div key={type}>
                  <h3
                    className={`text-xs font-semibold uppercase tracking-wider mb-2 ${VENUE_TYPE_TEXT_COLORS[type]}`}
                  >
                    {VENUE_TYPE_LABELS[type]}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {venues.map((v) => (
                      <VenueCard key={v.id} venue={v} />
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </motion.div>
      )}

      {/* Apartment Portal Links */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-5"
      >
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
          Search Apartments in {n.name}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PORTALS.map((portal) => (
            <a
              key={portal.id}
              href={n.kreis && portal.kreisFilters[n.kreis] ? `${portal.baseUrl}${portal.kreisFilters[n.kreis]}` : portal.baseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border-subtle bg-bg-secondary/50 p-3 hover:border-accent-primary/50 hover:bg-accent-primary/5 transition-colors group text-center"
            >
              <p className="text-sm font-medium text-text-primary group-hover:text-accent-primary transition-colors">
                {portal.name}
              </p>
              <p className="text-[10px] text-text-muted mt-1 flex items-center justify-center gap-1">
                Search
                <ExternalLink className="h-3 w-3" />
              </p>
            </a>
          ))}
        </div>
      </motion.div>

      {/* Bottom nav */}
      <div className="flex items-center justify-between pb-8">
        <Link
          href="/neighborhoods"
          className="text-sm text-text-tertiary hover:text-accent-primary transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          All neighborhoods
        </Link>
        {n.rank < ranked.length && (
          <Link
            href={`/neighborhoods/${ranked[n.rank].slug}`}
            className="text-sm text-text-tertiary hover:text-accent-primary transition-colors flex items-center gap-2"
          >
            Next: {ranked[n.rank].name} (#{ranked[n.rank].rank})
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}

