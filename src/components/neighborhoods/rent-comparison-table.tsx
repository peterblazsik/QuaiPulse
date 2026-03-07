"use client";

import { motion } from "framer-motion";
import { formatCHF } from "@/lib/utils";
import type { ScoredNeighborhood } from "@/lib/engines/scoring";

interface RentComparisonTableProps {
  compared: ScoredNeighborhood[];
  colors: string[];
}

export function RentComparisonTable({ compared, colors }: RentComparisonTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="card p-5"
    >
      <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
        Rent Comparison (monthly)
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="text-left text-[10px] uppercase tracking-wider text-text-muted pb-2 pr-4">
                Type
              </th>
              {compared.map((n, i) => (
                <th key={n.id} className="text-center pb-2 px-2">
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: colors[i] }}>
                    {n.name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="font-data">
            <tr className="border-b border-border-subtle/50">
              <td className="text-text-secondary py-2 pr-4">Studio</td>
              {compared.map((n) => (
                <td key={n.id} className="text-center text-text-primary py-2 px-2">
                  {formatCHF(n.rentStudioMin)}-{formatCHF(n.rentStudioMax)}
                </td>
              ))}
            </tr>
            <tr className="border-b border-border-subtle/50 bg-accent-primary/5">
              <td className="text-text-secondary py-2 pr-4 font-medium">1 Bedroom</td>
              {compared.map((n) => {
                const cheapest = Math.min(...compared.map((x) => x.rentOneBrMin));
                const isCheapest = n.rentOneBrMin === cheapest;
                return (
                  <td key={n.id} className={`text-center py-2 px-2 ${isCheapest ? "text-success font-semibold" : "text-text-primary"}`}>
                    {formatCHF(n.rentOneBrMin)}-{formatCHF(n.rentOneBrMax)}
                    {isCheapest && compared.length > 1 && (
                      <span className="block text-[10px] text-success">Cheapest</span>
                    )}
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="text-text-secondary py-2 pr-4">2 Bedroom</td>
              {compared.map((n) => (
                <td key={n.id} className="text-center text-text-primary py-2 px-2">
                  {formatCHF(n.rentTwoBrMin)}-{formatCHF(n.rentTwoBrMax)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
