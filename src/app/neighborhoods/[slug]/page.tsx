"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  ExternalLink,
  Star,
  ChevronRight,
} from "lucide-react";
import { NEIGHBORHOODS } from "@/lib/data/neighborhoods";
import { VENUES } from "@/lib/data/venues";
import { NEIGHBORHOOD_IMAGES } from "@/lib/data/images";
import { usePriorityStore } from "@/lib/stores/priority-store";
import { rankNeighborhoods, formatScore, scoreTextClass } from "@/lib/engines/scoring";
import { RadarChart } from "@/components/neighborhoods/radar-chart";
import { ScoreBadge } from "@/components/neighborhoods/score-badge";
import { SCORE_DIMENSIONS } from "@/lib/constants";
import { formatCHF } from "@/lib/utils";
import type { ScoreDimension, VenueType } from "@/lib/types";

const VENUE_TYPE_LABELS: Record<VenueType, string> = {
  gym: "Gyms & Fitness",
  chess: "Chess",
  ai_meetup: "AI & Tech Meetups",
  swimming: "Swimming",
  cycling: "Cycling",
  restaurant: "Restaurants & Food",
  social: "Social Spots",
  coworking: "Coworking",
};

const VENUE_TYPE_COLORS: Record<VenueType, string> = {
  gym: "text-emerald-400",
  chess: "text-amber-400",
  ai_meetup: "text-violet-400",
  swimming: "text-cyan-400",
  cycling: "text-lime-400",
  restaurant: "text-orange-400",
  social: "text-pink-400",
  coworking: "text-blue-400",
};

const PORTAL_LINKS = [
  { name: "Homegate", url: "https://www.homegate.ch/rent/real-estate/city-zurich/matching-list" },
  { name: "Flatfox", url: "https://flatfox.ch/en/search/?east=8.6&north=47.42&south=47.33&west=8.47" },
  { name: "ImmoScout24", url: "https://www.immoscout24.ch/en/real-estate/rent/city-zuerich" },
  { name: "Comparis", url: "https://en.comparis.ch/immobilien/marktplatz/zuerich/mieten" },
];

export default function NeighborhoodDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const weights = usePriorityStore((s) => s.weights);

  const neighborhood = NEIGHBORHOODS.find((n) => n.slug === slug);

  const ranked = useMemo(
    () => rankNeighborhoods(NEIGHBORHOODS, weights),
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
            className="object-cover"
            priority
          />
          <div className="img-overlay-full" />
          <div className="relative z-10 flex h-full flex-col justify-end p-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1">
                  Kreis {n.kreis}
                </p>
                <h1 className="font-display text-3xl font-bold text-white drop-shadow-lg">
                  {n.name}
                </h1>
                <p className="text-sm text-white/70 italic mt-1">{n.vibe}</p>
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
                Kreis {n.kreis}
              </p>
              <h1 className="font-display text-3xl font-bold text-text-primary">
                {n.name}
              </h1>
              <p className="text-sm text-text-tertiary italic mt-1">{n.vibe}</p>
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
        className="card p-5"
      >
        <p className="text-sm text-text-secondary leading-relaxed">
          {n.description}
        </p>
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
          <div className="space-y-3">
            {SCORE_DIMENSIONS.map((dim) => {
              const key = dim.key as ScoreDimension;
              const score = n.scores[key];
              const note = n.notes[key];
              return (
                <div key={key}>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: dim.color }}
                    />
                    <span className="text-xs text-text-secondary w-24 font-medium">
                      {dim.label}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-bg-tertiary overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(score / 10) * 100}%` }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: dim.color }}
                      />
                    </div>
                    <span
                      className={`font-data text-sm font-semibold w-8 text-right ${scoreTextClass(score)}`}
                    >
                      {formatScore(score)}
                    </span>
                  </div>
                  {note && (
                    <p className="text-[11px] text-text-muted ml-[136px] mt-1 leading-snug">
                      {note}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Rent Ranges */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card p-5"
      >
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
          Rent Ranges (monthly)
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <RentCard label="Studio" min={n.rentStudioMin} max={n.rentStudioMax} />
          <RentCard label="1 Bedroom" min={n.rentOneBrMin} max={n.rentOneBrMax} highlight />
          <RentCard label="2 Bedroom" min={n.rentTwoBrMin} max={n.rentTwoBrMax} />
        </div>
      </motion.div>

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
                    className={`text-xs font-semibold uppercase tracking-wider mb-2 ${VENUE_TYPE_COLORS[type]}`}
                  >
                    {VENUE_TYPE_LABELS[type]}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {venues.map((v) => (
                      <div
                        key={v.id}
                        className="rounded-lg border border-border-subtle bg-bg-secondary/50 p-3 hover:border-border-default transition-colors"
                      >
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
          {PORTAL_LINKS.map((portal) => (
            <a
              key={portal.name}
              href={portal.url}
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

function RentCard({
  label,
  min,
  max,
  highlight = false,
}: {
  label: string;
  min: number;
  max: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg p-4 text-center ${
        highlight
          ? "border-2 border-accent-primary/30 bg-accent-primary/5"
          : "border border-border-subtle bg-bg-secondary/50"
      }`}
    >
      <p className="text-[10px] uppercase tracking-wider text-text-muted">
        {label}
      </p>
      <p className="font-data text-lg font-semibold text-text-primary mt-1">
        {formatCHF(min)} - {formatCHF(max)}
      </p>
      {highlight && (
        <p className="text-[10px] text-accent-primary mt-1">Target range</p>
      )}
    </div>
  );
}
