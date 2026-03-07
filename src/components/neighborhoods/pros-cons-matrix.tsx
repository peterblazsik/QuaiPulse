"use client";

import { motion } from "framer-motion";
import type { ScoredNeighborhood } from "@/lib/engines/scoring";

interface ProsConsMatrixProps {
  compared: ScoredNeighborhood[];
  colors: string[];
}

export function ProsConsMatrix({ compared, colors }: ProsConsMatrixProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card p-5"
    >
      <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
        Pros & Cons Matrix
      </h2>
      <div style={{ gridTemplateColumns: `repeat(${compared.length}, 1fr)` }} className="grid gap-4">
        {compared.map((n, i) => (
          <div key={n.id}>
            <h3
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: colors[i] }}
            >
              {n.name}
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-success mb-1.5">Pros</p>
                <ul className="space-y-1">
                  {n.pros.map((pro, j) => (
                    <li key={j} className="text-xs text-text-secondary flex items-start gap-1.5">
                      <span className="text-success shrink-0 mt-0.5 font-bold">+</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-danger mb-1.5">Cons</p>
                <ul className="space-y-1">
                  {n.cons.map((con, j) => (
                    <li key={j} className="text-xs text-text-secondary flex items-start gap-1.5">
                      <span className="text-danger shrink-0 mt-0.5 font-bold">-</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
