"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { NEIGHBORHOOD_IMAGES } from "@/lib/data/images";
import { ScoreBadge } from "@/components/neighborhoods/score-badge";
import type { ScoredNeighborhood } from "@/lib/engines/scoring";

interface CompareHeroCardsProps {
  compared: ScoredNeighborhood[];
  winnerId: string;
  colors: string[];
}

export function CompareHeroCards({ compared, winnerId, colors }: CompareHeroCardsProps) {
  return (
    <div style={{ gridTemplateColumns: `repeat(${compared.length}, 1fr)` }} className="grid gap-4">
      {compared.map((n, i) => {
        const img = NEIGHBORHOOD_IMAGES[n.id];
        const isWinner = n.id === winnerId;
        return (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`card overflow-hidden relative ${isWinner ? "ring-2 ring-accent-primary/50" : ""}`}
          >
            {img && (
              <div className="relative h-32">
                <Image src={img} alt={n.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                <div className="img-overlay-fade" />
                {isWinner && (
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-full bg-accent-primary/90 px-2 py-0.5 text-[10px] font-bold text-white">
                    <Trophy className="h-3 w-3" />
                    Best
                  </div>
                )}
              </div>
            )}
            <div className="p-4 text-center">
              <div
                className="h-1 w-8 rounded-full mx-auto mb-2"
                style={{ backgroundColor: colors[i] }}
              />
              <h3 className="font-display text-lg font-semibold text-text-primary">
                {n.name}
              </h3>
              <p className="text-[10px] text-text-muted uppercase tracking-wider">
                Kreis {n.kreis} — Rank #{n.rank}
              </p>
              <div className="mt-2 flex justify-center">
                <ScoreBadge score={n.weightedScore} size="lg" />
              </div>
              <p className="text-xs text-text-tertiary italic mt-2">{n.vibe}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
