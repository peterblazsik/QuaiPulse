"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Upload,
  ExternalLink,
  RotateCcw,
  Lock,
  Info,
} from "lucide-react";
import {
  DOSSIER_DOCUMENTS,
  DOSSIER_CATEGORIES,
  type DossierDocument,
  type DossierCategory,
} from "@/lib/data/dossier-items";
import { useDossierStore } from "@/lib/stores/dossier-store";
import { KPICard } from "@/components/subscriptions/kpi-card";
import type { DossierStatus } from "@/lib/types";

const STATUS_CONFIG: Record<DossierStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  missing: { label: "Missing", color: "#ef4444", bg: "rgba(239,68,68,0.12)", icon: AlertCircle },
  in_progress: { label: "In Progress", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", icon: Clock },
  obtained: { label: "Obtained", color: "#22c55e", bg: "rgba(34,197,94,0.12)", icon: CheckCircle2 },
  uploaded: { label: "Uploaded", color: "#3b82f6", bg: "rgba(59,130,246,0.12)", icon: Upload },
};

const STATUS_CYCLE: DossierStatus[] = ["missing", "in_progress", "obtained", "uploaded"];

function isComplete(status: DossierStatus): boolean {
  return status === "obtained" || status === "uploaded";
}

/** O(1) lookup by document ID */
const DOCS_BY_ID = new Map(DOSSIER_DOCUMENTS.map((d) => [d.id, d]));

/** Static grouping — DOSSIER_DOCUMENTS never changes */
const GROUPED_DOCUMENTS: Map<DossierCategory, DossierDocument[]> = (() => {
  const map = new Map<DossierCategory, DossierDocument[]>();
  for (const doc of DOSSIER_DOCUMENTS) {
    const list = map.get(doc.category) ?? [];
    list.push(doc);
    map.set(doc.category, list);
  }
  return map;
})();

export default function DossierPage() {
  const { statuses, notes, urls, setStatus, setNote, setUrl, reset } = useDossierStore();

  const getStatus = (id: string): DossierStatus => statuses[id] ?? "missing";

  const stats = useMemo(() => {
    const resolve = (id: string): DossierStatus => statuses[id] ?? "missing";
    const total = DOSSIER_DOCUMENTS.length;
    const required = DOSSIER_DOCUMENTS.filter((d) => d.required).length;
    const counts: Record<DossierStatus, number> = { missing: 0, in_progress: 0, obtained: 0, uploaded: 0 };
    let requiredDone = 0;

    for (const doc of DOSSIER_DOCUMENTS) {
      const s = resolve(doc.id);
      counts[s]++;
      if (doc.required && isComplete(s)) requiredDone++;
    }

    const pct = total > 0 ? Math.round(((counts.obtained + counts.uploaded) / total) * 100) : 0;
    return { total, required, requiredDone, counts, pct };
  }, [statuses]);

  function isDepsBlocked(doc: DossierDocument): boolean {
    if (!doc.dependsOn?.length) return false;
    return doc.dependsOn.some((depId) => !isComplete(getStatus(depId)));
  }

  function cycleStatus(docId: string) {
    const current = getStatus(docId);
    const idx = STATUS_CYCLE.indexOf(current);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    setStatus(docId, next);
  }

  return (
    <div className="space-y-6 relative">
      <div className="ambient-glow glow-cyan" />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Dossier Tracker
          </h1>
          <p className="text-sm text-text-tertiary mt-1">
            {stats.total} documents across {GROUPED_DOCUMENTS.size} categories. Track every paper for the move.
          </p>
        </div>
        <button
          onClick={() => {
            if (window.confirm("Reset all dossier progress? This cannot be undone.")) reset();
          }}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border-default bg-bg-secondary text-text-muted hover:text-text-secondary transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <KPICard
          label="Overall"
          value={`${stats.pct}%`}
          sublabel={`${stats.counts.obtained + stats.counts.uploaded} of ${stats.total} done`}
          color={stats.pct >= 80 ? "#22c55e" : stats.pct >= 40 ? "#f59e0b" : "#ef4444"}
        />
        <KPICard
          label="Required"
          value={`${stats.requiredDone}/${stats.required}`}
          sublabel="critical documents"
          color={stats.requiredDone === stats.required ? "#22c55e" : "#f59e0b"}
        />
        <KPICard
          label="Missing"
          value={String(stats.counts.missing)}
          sublabel="not started"
          color="#ef4444"
        />
        <KPICard
          label="In Progress"
          value={String(stats.counts.in_progress)}
          sublabel="being obtained"
          color="#f59e0b"
        />
        <KPICard
          label="Complete"
          value={String(stats.counts.obtained + stats.counts.uploaded)}
          sublabel="obtained or uploaded"
          color="#22c55e"
        />
      </div>

      {/* Progress bar */}
      <div className="h-2.5 rounded-full bg-bg-tertiary overflow-hidden flex">
        {(["uploaded", "obtained", "in_progress", "missing"] as const).map((status) => {
          const pct = stats.total > 0 ? (stats.counts[status] / stats.total) * 100 : 0;
          if (pct === 0) return null;
          return (
            <motion.div
              key={status}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.5 }}
              className="h-full"
              style={{ backgroundColor: STATUS_CONFIG[status].color }}
              title={`${STATUS_CONFIG[status].label}: ${stats.counts[status]}`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4">
        {STATUS_CYCLE.map((s) => {
          const cfg = STATUS_CONFIG[s];
          return (
            <div key={s} className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cfg.color }} />
              <span className="text-[10px] text-text-muted">{cfg.label}</span>
              <span className="font-data text-[10px] text-text-muted">({stats.counts[s]})</span>
            </div>
          );
        })}
      </div>

      {/* Document categories */}
      {Array.from(GROUPED_DOCUMENTS.entries()).map(([category, docs]) => {
        const catCfg = DOSSIER_CATEGORIES[category];
        const catDone = docs.filter((d) => isComplete(getStatus(d.id))).length;

        return (
          <section key={category}>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: catCfg.color }} />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                {catCfg.label}
              </h2>
              <span className="font-data text-[10px] text-text-muted ml-auto">
                {catDone}/{docs.length}
              </span>
            </div>

            <div className="space-y-2">
              {docs.map((doc) => (
                <DocumentRow
                  key={doc.id}
                  doc={doc}
                  status={getStatus(doc.id)}
                  blocked={isDepsBlocked(doc)}
                  note={notes[doc.id] ?? ""}
                  docUrl={urls[doc.id] ?? ""}
                  onCycleStatus={() => cycleStatus(doc.id)}
                  onSetStatus={(s) => setStatus(doc.id, s)}
                  onSetNote={(n) => setNote(doc.id, n)}
                  onSetUrl={(u) => setUrl(doc.id, u)}
                  getStatus={getStatus}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

/* ─────────────── Document Row ─────────────── */

function DocumentRow({
  doc,
  status,
  blocked,
  note,
  docUrl,
  onCycleStatus,
  onSetStatus,
  onSetNote,
  onSetUrl,
  getStatus,
}: {
  doc: DossierDocument;
  status: DossierStatus;
  blocked: boolean;
  note: string;
  docUrl: string;
  onCycleStatus: () => void;
  onSetStatus: (s: DossierStatus) => void;
  onSetNote: (n: string) => void;
  onSetUrl: (u: string) => void;
  getStatus: (id: string) => DossierStatus;
}) {
  const cfg = STATUS_CONFIG[status];
  const StatusIcon = cfg.icon;
  const done = isComplete(status);

  // Local state for note — sync to store on blur to avoid per-keystroke writes
  const [localNote, setLocalNote] = useState(note);
  const [localUrl, setLocalUrl] = useState(docUrl);

  // Sync from store when values change externally (e.g., reset)
  useEffect(() => { setLocalNote(note); }, [note]);
  useEffect(() => { setLocalUrl(docUrl); }, [docUrl]);

  return (
    <div
      className={`rounded-lg border p-4 transition-all ${
        done
          ? "border-border-default/50 bg-bg-primary/30 opacity-75"
          : blocked
            ? "border-amber-500/20 bg-amber-500/5"
            : "border-border-default bg-bg-secondary hover:border-border-default/80"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Status button */}
        <button
          onClick={onCycleStatus}
          className="shrink-0 mt-0.5 rounded-full p-1 transition-colors hover:opacity-80"
          style={{ backgroundColor: cfg.bg, color: cfg.color }}
          title={`Status: ${cfg.label} — click to advance`}
        >
          <StatusIcon className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`text-xs font-semibold ${done ? "text-text-muted line-through" : "text-text-primary"}`}>
              {doc.title}
            </h3>
            {doc.required && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-medium">
                Required
              </span>
            )}
            {blocked && (
              <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-medium">
                <Lock className="h-2.5 w-2.5" />
                Blocked
              </span>
            )}
            {doc.url && (
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-[10px] text-accent-primary hover:underline"
              >
                <ExternalLink className="h-2.5 w-2.5" />
                Link
              </a>
            )}
          </div>

          <p className="text-[10px] text-text-tertiary mt-0.5 leading-snug">
            {doc.description}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className="text-[10px] text-text-muted">
              Source: <span className="text-text-secondary">{doc.source}</span>
            </span>
            {doc.processingTime && (
              <span className="flex items-center gap-1 text-[10px] text-text-muted">
                <Clock className="h-2.5 w-2.5" />
                {doc.processingTime}
              </span>
            )}
            {doc.costCHF != null && (
              <span className="font-data text-[10px] text-text-muted">
                CHF {doc.costCHF}
              </span>
            )}
          </div>

          {/* Tips */}
          {doc.tips && (
            <div className="mt-2 flex items-start gap-1.5">
              <Info className="h-3 w-3 text-accent-primary shrink-0 mt-0.5" />
              <p className="text-[10px] text-text-secondary italic leading-snug">
                {doc.tips}
              </p>
            </div>
          )}

          {/* Blocked-by list */}
          {blocked && doc.dependsOn && (
            <div className="mt-2 flex flex-wrap gap-1">
              {doc.dependsOn.map((depId) => {
                if (isComplete(getStatus(depId))) return null;
                const depDoc = DOCS_BY_ID.get(depId);
                return (
                  <span
                    key={depId}
                    className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400"
                  >
                    <Lock className="h-2 w-2" />
                    {depDoc?.title ?? depId}
                  </span>
                );
              })}
            </div>
          )}

          {/* Personal note — syncs to store on blur */}
          <div className="mt-2">
            <input
              type="text"
              value={localNote}
              onChange={(e) => setLocalNote(e.target.value)}
              onBlur={() => { if (localNote !== note) onSetNote(localNote); }}
              placeholder="Add a personal note..."
              className="w-full text-[10px] bg-transparent border-b border-border-subtle/50 py-1 text-text-secondary placeholder:text-text-muted/50 focus:outline-none focus:border-accent-primary/50"
            />
          </div>

          {/* Document URL */}
          <div className="mt-1.5 flex items-center gap-1.5">
            <ExternalLink className="h-2.5 w-2.5 text-text-muted shrink-0" />
            <input
              type="url"
              value={localUrl}
              onChange={(e) => setLocalUrl(e.target.value)}
              onBlur={() => { if (localUrl !== docUrl) onSetUrl(localUrl); }}
              placeholder="Paste document URL..."
              className="flex-1 text-[10px] bg-transparent border-b border-border-subtle/50 py-0.5 text-accent-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent-primary/50"
            />
            {localUrl && (
              <a
                href={localUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-accent-primary hover:underline"
              >
                Open
              </a>
            )}
          </div>
        </div>

        {/* Status selector */}
        <div className="shrink-0">
          <select
            value={status}
            onChange={(e) => onSetStatus(e.target.value as DossierStatus)}
            className="text-[10px] rounded border border-border-default bg-bg-tertiary px-2 py-1 text-text-secondary focus:outline-none focus:border-accent-primary"
          >
            {STATUS_CYCLE.map((s) => (
              <option key={s} value={s}>
                {STATUS_CONFIG[s].label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
