"use client";

import { Zap, Pill, Activity } from "lucide-react";
import type { TonightProtocol } from "@/lib/engines/protocol-recommender";
import { SUPPLEMENT_STACKS } from "@/lib/data/sleep-defaults";

interface ProtocolHeroProps {
  protocol: TonightProtocol;
}

export function ProtocolHero({ protocol }: ProtocolHeroProps) {
  const stackName = protocol.closestStack
    ? SUPPLEMENT_STACKS.find((s) => s.id === protocol.closestStack)?.name ?? null
    : null;

  return (
    <div className="card elevation-1 p-5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-purple-500/5 pointer-events-none" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-4 w-4 text-accent-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent-primary">
            Tonight&apos;s Protocol
          </h2>
          {stackName && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/20 ml-auto">
              ≈ {stackName}
            </span>
          )}
        </div>

        {/* Supplements */}
        {protocol.supplements.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Pill className="h-3 w-3 text-text-muted" />
              <span className="text-xs uppercase tracking-wider text-text-muted font-semibold">Supplements</span>
            </div>
            <div className="space-y-1.5">
              {protocol.supplements.map((item) => (
                <div key={item.id} className="flex items-center gap-2 group">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-text-secondary font-medium flex-1 min-w-0 truncate">
                    {item.name}
                  </span>
                  <span className="text-xs text-text-muted font-data">{item.timing}</span>
                  <span className="text-xs font-data font-semibold"
                    style={{ color: item.delta >= 0.5 ? "#22c55e" : item.delta >= 0.2 ? "#3b82f6" : "#64748b" }}>
                    +{item.delta.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interventions */}
        {protocol.interventions.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Activity className="h-3 w-3 text-text-muted" />
              <span className="text-xs uppercase tracking-wider text-text-muted font-semibold">Interventions</span>
            </div>
            <div className="space-y-1.5">
              {protocol.interventions.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-primary flex-shrink-0" />
                  <span className="text-sm text-text-secondary font-medium flex-1 min-w-0 truncate">
                    {item.name}
                  </span>
                  <span className="text-xs text-text-muted font-data">{item.timing}</span>
                  <span className="text-xs font-data font-semibold"
                    style={{ color: item.delta >= 0.5 ? "#22c55e" : item.delta >= 0.2 ? "#3b82f6" : "#64748b" }}>
                    +{item.delta.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prediction footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border-default/50">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted uppercase tracking-wider">Predicted quality</span>
            <span className="font-data text-base font-bold"
              style={{ color: protocol.predictedQuality >= 4 ? "#22c55e" : protocol.predictedQuality >= 3 ? "#f59e0b" : "#ef4444" }}>
              {protocol.predictedQuality.toFixed(1)}/5
            </span>
          </div>
          <span className="text-xs text-text-muted">
            {protocol.totalItems} items
          </span>
        </div>
      </div>
    </div>
  );
}
