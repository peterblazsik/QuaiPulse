"use client";

import { Moon, Plus } from "lucide-react";
import type { SleepFormState } from "@/lib/hooks/use-sleep-form";
import {
  LOCATIONS,
  QUALITY_LABELS,
  SUPPLEMENTS,
  INTERVENTIONS,
  type SleepQuality,
} from "@/lib/data/sleep-defaults";

interface EntryFormProps {
  form: SleepFormState;
  onSubmit: () => void;
}

export function EntryForm({ form, onSubmit }: EntryFormProps) {
  return (
    <div className="card elevation-1 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Plus className="h-3.5 w-3.5 text-text-muted" />
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {form.editingId ? "Edit Entry" : "Log Sleep"}
        </h2>
        {form.editingId && (
          <button onClick={form.cancelEdit}
            className="ml-auto text-[10px] text-text-muted hover:text-text-secondary">
            Cancel
          </button>
        )}
      </div>
      <div className="space-y-2.5">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[9px] uppercase tracking-wider text-text-muted block mb-0.5">Date</label>
            <input type="date" value={form.formDate} onChange={(e) => form.setFormDate(e.target.value)}
              className="w-full rounded-lg border border-border-default bg-bg-tertiary px-2.5 py-1.5 text-xs text-text-primary focus:border-accent-primary focus:outline-none" />
          </div>
          <div>
            <label className="text-[9px] uppercase tracking-wider text-text-muted block mb-0.5">Hours</label>
            <input type="number" value={form.formHours} onChange={(e) => form.setFormHours(Number(e.target.value))}
              min={0} max={16} step={0.5}
              className="w-full rounded-lg border border-border-default bg-bg-tertiary px-2.5 py-1.5 text-xs text-text-primary font-data focus:border-accent-primary focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="text-[9px] uppercase tracking-wider text-text-muted block mb-0.5">Quality</label>
          <div className="flex gap-1.5">
            {([1, 2, 3, 4, 5] as SleepQuality[]).map((q) => (
              <button key={q} type="button" onClick={() => form.setFormQuality(q)}
                aria-label={`Rate quality ${q} - ${QUALITY_LABELS[q].label}`}
                className="flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold transition-all"
                style={{
                  backgroundColor: form.formQuality === q ? QUALITY_LABELS[q].color : "var(--bg-tertiary)",
                  color: form.formQuality === q ? "#fff" : "var(--text-muted)",
                  border: form.formQuality === q ? `2px solid ${QUALITY_LABELS[q].color}` : "2px solid var(--border-default)",
                }}
                title={QUALITY_LABELS[q].label}
              >{q}</button>
            ))}
            <span className="text-[9px] text-text-muted self-center ml-1">{QUALITY_LABELS[form.formQuality].label}</span>
          </div>
        </div>

        <div>
          <label className="text-[9px] uppercase tracking-wider text-text-muted block mb-0.5">Location</label>
          <select value={form.formLocation} onChange={(e) => form.setFormLocation(e.target.value as typeof form.formLocation)}
            className="w-full rounded-lg border border-border-default bg-bg-tertiary px-2.5 py-1.5 text-xs text-text-primary focus:border-accent-primary focus:outline-none">
            {LOCATIONS.map((loc) => <option key={loc.value} value={loc.value}>{loc.label}</option>)}
          </select>
        </div>

        <div>
          <label className="text-[9px] uppercase tracking-wider text-text-muted block mb-0.5">Supplements</label>
          <div className="flex flex-wrap gap-1">
            {SUPPLEMENTS.map((sup) => {
              const active = form.formSupplements.includes(sup.id);
              return (
                <button key={sup.id} type="button" onClick={() => form.toggleSupplement(sup.id)}
                  className="text-[8px] px-1.5 py-0.5 rounded-full transition-all font-medium"
                  style={{
                    backgroundColor: active ? `color-mix(in srgb, ${sup.color} 20%, transparent)` : "var(--bg-tertiary)",
                    color: active ? sup.color : "var(--text-muted)",
                    border: active ? `1px solid color-mix(in srgb, ${sup.color} 40%, transparent)` : "1px solid var(--border-default)",
                  }}>{sup.name}</button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-[9px] uppercase tracking-wider text-text-muted block mb-0.5">Interventions</label>
          <div className="flex flex-wrap gap-1">
            {INTERVENTIONS.map((intv) => {
              const active = form.formInterventions.includes(intv.id);
              return (
                <button key={intv.id} type="button" onClick={() => form.toggleIntervention(intv.id)}
                  className="text-[8px] px-1.5 py-0.5 rounded-full transition-all font-medium"
                  style={{
                    backgroundColor: active ? "rgba(59, 130, 246, 0.15)" : "var(--bg-tertiary)",
                    color: active ? "#60a5fa" : "var(--text-muted)",
                    border: active ? "1px solid rgba(59, 130, 246, 0.3)" : "1px solid var(--border-default)",
                  }}>{intv.name.length > 20 ? intv.name.slice(0, 18) + "..." : intv.name}</button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[9px] uppercase tracking-wider text-text-muted block mb-0.5">Bedtime</label>
            <input type="time" value={form.formBedtime} onChange={(e) => form.setFormBedtime(e.target.value)}
              className="w-full rounded-lg border border-border-default bg-bg-tertiary px-2.5 py-1.5 text-xs text-text-primary font-data focus:border-accent-primary focus:outline-none" />
          </div>
          <div>
            <label className="text-[9px] uppercase tracking-wider text-text-muted block mb-0.5">Wake time</label>
            <input type="time" value={form.formWaketime} onChange={(e) => form.setFormWaketime(e.target.value)}
              className="w-full rounded-lg border border-border-default bg-bg-tertiary px-2.5 py-1.5 text-xs text-text-primary font-data focus:border-accent-primary focus:outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[9px] uppercase tracking-wider text-text-muted block mb-0.5">Latency (min)</label>
            <input type="number" value={form.formLatency} onChange={(e) => form.setFormLatency(e.target.value === "" ? "" : Number(e.target.value))}
              min={0} max={180} placeholder="\u2014"
              className="w-full rounded-lg border border-border-default bg-bg-tertiary px-2.5 py-1.5 text-xs text-text-primary font-data placeholder:text-text-muted/50 focus:border-accent-primary focus:outline-none" />
          </div>
          <div>
            <label className="text-[9px] uppercase tracking-wider text-text-muted block mb-0.5">Awakenings</label>
            <input type="number" value={form.formAwakenings} onChange={(e) => form.setFormAwakenings(e.target.value === "" ? "" : Number(e.target.value))}
              min={0} max={20} placeholder="\u2014"
              className="w-full rounded-lg border border-border-default bg-bg-tertiary px-2.5 py-1.5 text-xs text-text-primary font-data placeholder:text-text-muted/50 focus:border-accent-primary focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="text-[9px] uppercase tracking-wider text-text-muted block mb-0.5">Notes</label>
          <textarea value={form.formNotes} onChange={(e) => form.setFormNotes(e.target.value)} rows={2} placeholder="Optional notes..."
            className="w-full rounded-lg border border-border-default bg-bg-tertiary px-2.5 py-1.5 text-xs text-text-primary placeholder:text-text-muted/50 focus:border-accent-primary focus:outline-none resize-none" />
        </div>

        <button type="button" onClick={onSubmit}
          className="w-full rounded-lg bg-accent-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-accent-hover flex items-center justify-center gap-2">
          <Moon className="h-3.5 w-3.5" />
          {form.editingId ? "Update Entry" : "Log Night"}
        </button>
      </div>
    </div>
  );
}
