"use client";

import { useState } from "react";
import { Phone, Mail, Eye, FileText, StickyNote, Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import type { InteractionLog, InteractionType } from "@/lib/types";
import { useApartmentStore } from "@/lib/stores/apartment-store";

const INTERACTION_TYPES: { key: InteractionType; label: string; icon: typeof Phone; color: string }[] = [
  { key: "phone", label: "Phone", icon: Phone, color: "#22c55e" },
  { key: "email", label: "Email", icon: Mail, color: "#3b82f6" },
  { key: "viewing", label: "Viewing", icon: Eye, color: "#8b5cf6" },
  { key: "document", label: "Document", icon: FileText, color: "#f59e0b" },
  { key: "note", label: "Note", icon: StickyNote, color: "#64748b" },
];

function getTypeConfig(type: InteractionType) {
  return INTERACTION_TYPES.find((t) => t.key === type) ?? INTERACTION_TYPES[4];
}

function relativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return dateStr;
}

interface InteractionTimelineProps {
  apartmentId: string;
  interactions: InteractionLog[];
}

export function InteractionTimeline({ apartmentId, interactions }: InteractionTimelineProps) {
  const [expanded, setExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newType, setNewType] = useState<InteractionType>("note");
  const [newSummary, setNewSummary] = useState("");

  const addInteraction = useApartmentStore((s) => s.addInteraction);
  const removeInteraction = useApartmentStore((s) => s.removeInteraction);

  const handleAdd = () => {
    if (!newSummary.trim()) return;
    addInteraction(apartmentId, newType, newSummary.trim());
    setNewSummary("");
    setShowForm(false);
  };

  if (interactions.length === 0 && !showForm) {
    return (
      <div className="mt-2 pt-2 border-t border-border-subtle">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1 text-[10px] text-text-muted hover:text-accent-primary transition-colors"
        >
          <Plus className="h-2.5 w-2.5" />
          Add interaction
        </button>
      </div>
    );
  }

  const sorted = [...interactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const visible = expanded ? sorted : sorted.slice(0, 2);

  return (
    <div className="mt-2 pt-2 border-t border-border-subtle">
      {/* Header */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Interactions ({interactions.length})
        </span>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-0.5 text-[10px] text-accent-primary hover:underline"
        >
          <Plus className="h-2.5 w-2.5" />
          Add
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="mb-2 rounded-lg bg-bg-primary/50 border border-border-subtle p-2 space-y-1.5">
          <div className="flex gap-1">
            {INTERACTION_TYPES.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  onClick={() => setNewType(t.key)}
                  className={`flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] transition-colors ${
                    newType === t.key
                      ? "font-medium"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                  style={
                    newType === t.key
                      ? { color: t.color, backgroundColor: `color-mix(in srgb, ${t.color} 15%, transparent)` }
                      : undefined
                  }
                >
                  <Icon className="h-2.5 w-2.5" />
                  {t.label}
                </button>
              );
            })}
          </div>
          <div className="flex gap-1">
            <input
              type="text"
              value={newSummary}
              onChange={(e) => setNewSummary(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="What happened?"
              className="flex-1 rounded border border-border-default bg-bg-primary px-2 py-1 text-[10px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
              autoFocus
            />
            <button
              onClick={handleAdd}
              disabled={!newSummary.trim()}
              className="rounded bg-accent-primary px-2 py-1 text-[10px] font-medium text-white disabled:opacity-40"
            >
              Add
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="rounded px-1.5 py-1 text-text-muted hover:text-text-primary"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* Timeline entries */}
      <div className="space-y-1">
        {visible.map((interaction) => {
          const conf = getTypeConfig(interaction.type);
          const Icon = conf.icon;
          return (
            <div
              key={interaction.id}
              className="group flex items-start gap-2 text-[10px]"
            >
              <div
                className="mt-0.5 shrink-0 rounded p-0.5"
                style={{ backgroundColor: `color-mix(in srgb, ${conf.color} 15%, transparent)` }}
              >
                <Icon className="h-2.5 w-2.5" style={{ color: conf.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-text-secondary">{interaction.summary}</span>
              </div>
              <span className="shrink-0 text-text-muted">{relativeTime(interaction.date)}</span>
              <button
                onClick={() => removeInteraction(apartmentId, interaction.id)}
                className="shrink-0 opacity-0 group-hover:opacity-100 text-text-muted hover:text-danger transition-opacity"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Expand/collapse */}
      {sorted.length > 2 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-0.5 mt-1 text-[10px] text-text-muted hover:text-text-secondary"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-2.5 w-2.5" /> Show less
            </>
          ) : (
            <>
              <ChevronDown className="h-2.5 w-2.5" /> {sorted.length - 2} more
            </>
          )}
        </button>
      )}
    </div>
  );
}

export function InteractionCountBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-accent-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-accent-primary">
      {count} interaction{count !== 1 ? "s" : ""}
    </span>
  );
}
