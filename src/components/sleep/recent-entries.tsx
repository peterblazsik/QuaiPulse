"use client";

import { Moon, Pencil, Trash2 } from "lucide-react";
import type { SleepEntry } from "@/lib/stores/sleep-store";
import { QUALITY_LABELS, LOCATIONS } from "@/lib/data/sleep-defaults";

interface RecentEntriesProps {
  entries: SleepEntry[];
  onEdit: (entry: SleepEntry) => void;
  onRemove: (id: string) => void;
}

export function RecentEntries({ entries, onEdit, onRemove }: RecentEntriesProps) {
  return (
    <div className="card elevation-1 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Moon className="h-3.5 w-3.5 text-text-muted" />
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Recent Entries
        </h2>
        <span className="text-[10px] text-text-muted ml-auto">{entries.length} entries</span>
      </div>
      <div className="space-y-0.5">
        {[...entries].reverse().map((entry) => (
          <div key={entry.id}
            className="flex items-center gap-3 rounded-lg p-1.5 hover:bg-bg-tertiary/50 group transition-colors">
            <span className="font-data text-[10px] text-text-muted w-14 shrink-0">{entry.date.slice(5)}</span>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: QUALITY_LABELS[entry.quality].color }} />
              <span className="text-[10px] text-text-secondary">{entry.quality}/5</span>
            </div>
            <span className="font-data text-[10px] text-text-primary">{entry.hours}h</span>
            {entry.bedtime && entry.waketime && (
              <span className="font-data text-[10px] text-text-muted">{entry.bedtime}\u2013{entry.waketime}</span>
            )}
            {entry.sleepLatency != null && (
              <span className="font-data text-[10px] text-text-muted">{entry.sleepLatency}m</span>
            )}
            {entry.awakenings != null && entry.awakenings > 0 && (
              <span className="font-data text-[10px] text-amber-400/70">{entry.awakenings}w</span>
            )}
            <span className="text-[9px] text-text-muted truncate flex-1">
              {LOCATIONS.find(l => l.value === entry.location)?.label}
              {entry.interventions && entry.interventions.length > 0 ? ` +${entry.interventions.length} int.` : ""}
              {entry.notes ? ` \u2014 ${entry.notes}` : ""}
            </span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onEdit(entry)}
                className="p-1 rounded text-text-muted hover:text-accent-primary transition-colors" title="Edit">
                <Pencil className="h-3 w-3" />
              </button>
              <button onClick={() => { if (window.confirm(`Delete entry from ${entry.date}?`)) onRemove(entry.id); }}
                className="p-1 rounded text-text-muted hover:text-red-400 transition-colors" title="Delete">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
