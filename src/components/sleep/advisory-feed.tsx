"use client";

import { useState } from "react";
import { Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import type { Advisory } from "@/lib/engines/sleep-advisories";
import { getSignalColor, getSignalLabel } from "@/lib/engines/sleep-advisories";

interface AdvisoryFeedProps {
  advisories: Advisory[];
}

export function AdvisoryFeed({ advisories }: AdvisoryFeedProps) {
  const [expanded, setExpanded] = useState(false);

  // Show top 4, expand for all
  const actionable = advisories.filter((a) => a.signal !== "HOLD");
  const shown = expanded ? actionable : actionable.slice(0, 4);
  const hasMore = actionable.length > 4;

  if (actionable.length === 0) {
    return (
      <div className="card elevation-1 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Advisory Signals</h2>
        </div>
        <p className="text-[10px] text-text-muted">Log more entries to generate personalized signals.</p>
      </div>
    );
  }

  return (
    <div className="card elevation-1 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Advisory Signals</h2>
        <span className="text-[8px] text-text-muted ml-auto">{actionable.length} signals</span>
      </div>

      <div className="space-y-2">
        {shown.map((adv) => (
          <AdvisoryCard key={adv.id} advisory={adv} />
        ))}
      </div>

      {hasMore && (
        <button onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 w-full justify-center mt-2 pt-2 border-t border-border-default/30 text-[9px] text-text-muted hover:text-text-secondary transition-colors">
          {expanded ? (
            <><ChevronUp className="h-3 w-3" /> Show less</>
          ) : (
            <><ChevronDown className="h-3 w-3" /> Show {actionable.length - 4} more</>
          )}
        </button>
      )}
    </div>
  );
}

function AdvisoryCard({ advisory }: { advisory: Advisory }) {
  const signalColor = getSignalColor(advisory.signal);

  return (
    <div className="flex gap-2.5 items-start p-2 rounded-lg hover:bg-surface-2/50 transition-colors group">
      {/* Signal badge */}
      <div className="flex-shrink-0 mt-0.5">
        <span className="text-[7px] font-bold px-1.5 py-0.5 rounded tracking-wider"
          style={{
            backgroundColor: `color-mix(in srgb, ${signalColor} 15%, transparent)`,
            color: signalColor,
            border: `1px solid color-mix(in srgb, ${signalColor} 25%, transparent)`,
          }}>
          {getSignalLabel(advisory.signal)}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-[11px] text-text-primary font-medium truncate">{advisory.title}</span>
          <span className="text-[9px] font-data font-semibold flex-shrink-0" style={{ color: signalColor }}>
            {advisory.metric}
          </span>
        </div>
        <p className="text-[9px] text-text-muted mt-0.5 leading-relaxed">{advisory.body}</p>

        {/* Confidence bar */}
        <div className="flex items-center gap-1.5 mt-1">
          <div className="w-12 h-[2px] bg-surface-2 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-text-muted/50" style={{ width: `${advisory.confidence * 100}%` }} />
          </div>
          <span className="text-[7px] text-text-muted">{Math.round(advisory.confidence * 100)}% conf</span>
          <span className="text-[7px] text-text-muted/50 ml-auto">{advisory.category}</span>
        </div>
      </div>
    </div>
  );
}
