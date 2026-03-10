"use client";

import { useEffect, useCallback } from "react";
import { X, Moon, Plus } from "lucide-react";
import type { SleepFormState } from "@/lib/hooks/use-sleep-form";
import {
  LOCATIONS,
  QUALITY_LABELS,
  SUPPLEMENTS,
  INTERVENTIONS,
  type SleepQuality,
} from "@/lib/data/sleep-defaults";

interface EntrySlideOverProps {
  open: boolean;
  onClose: () => void;
  form: SleepFormState;
  onSubmit: () => void;
}

export function EntrySlideOver({ open, onClose, form, onSubmit }: EntrySlideOverProps) {
  // Escape key closes
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, handleKeyDown]);

  function handleSubmit() {
    onSubmit();
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={onClose} />
      )}

      {/* Slide-over panel */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md z-50 transform transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="h-full bg-bg-primary border-l border-border-default overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-bg-primary/95 backdrop-blur-sm border-b border-border-default p-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-accent-primary" />
              <h2 className="text-sm font-semibold text-text-primary">
                {form.editingId ? "Edit Entry" : "Log Sleep"}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {form.editingId && (
                <button onClick={() => { form.cancelEdit(); }}
                  className="text-[10px] text-text-muted hover:text-text-secondary px-2 py-1">
                  Cancel Edit
                </button>
              )}
              <button onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-bg-tertiary transition-colors"
                aria-label="Close">
                <X className="h-4 w-4 text-text-muted" />
              </button>
            </div>
          </div>

          {/* Form body */}
          <div className="p-4 space-y-4">
            {/* Date + Hours */}
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Date">
                <input type="date" value={form.formDate} onChange={(e) => form.setFormDate(e.target.value)}
                  className="form-input" />
              </FormField>
              <FormField label="Hours slept">
                <input type="number" value={form.formHours} onChange={(e) => form.setFormHours(Number(e.target.value))}
                  min={0} max={16} step={0.5}
                  className="form-input font-data" />
              </FormField>
            </div>

            {/* Quality */}
            <FormField label="Quality">
              <div className="flex gap-2">
                {([1, 2, 3, 4, 5] as SleepQuality[]).map((q) => (
                  <button key={q} type="button" onClick={() => form.setFormQuality(q)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all"
                    style={{
                      backgroundColor: form.formQuality === q ? QUALITY_LABELS[q].color : "var(--bg-tertiary)",
                      color: form.formQuality === q ? "#fff" : "var(--text-muted)",
                      border: form.formQuality === q ? `2px solid ${QUALITY_LABELS[q].color}` : "2px solid var(--border-default)",
                    }}
                    title={QUALITY_LABELS[q].label}>
                    {q}
                  </button>
                ))}
                <span className="text-xs text-text-muted self-center ml-2">{QUALITY_LABELS[form.formQuality].label}</span>
              </div>
            </FormField>

            {/* Location */}
            <FormField label="Location">
              <select value={form.formLocation} onChange={(e) => form.setFormLocation(e.target.value as typeof form.formLocation)}
                className="form-input">
                {LOCATIONS.map((loc) => <option key={loc.value} value={loc.value}>{loc.label}</option>)}
              </select>
            </FormField>

            {/* Bedtime + Waketime */}
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Bedtime">
                <input type="time" value={form.formBedtime} onChange={(e) => form.setFormBedtime(e.target.value)}
                  className="form-input font-data" />
              </FormField>
              <FormField label="Wake time">
                <input type="time" value={form.formWaketime} onChange={(e) => form.setFormWaketime(e.target.value)}
                  className="form-input font-data" />
              </FormField>
            </div>

            {/* Latency + Awakenings */}
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Latency (min)">
                <input type="number" value={form.formLatency} onChange={(e) => form.setFormLatency(e.target.value === "" ? "" : Number(e.target.value))}
                  min={0} max={180} placeholder="—"
                  className="form-input font-data" />
              </FormField>
              <FormField label="Awakenings">
                <input type="number" value={form.formAwakenings} onChange={(e) => form.setFormAwakenings(e.target.value === "" ? "" : Number(e.target.value))}
                  min={0} max={20} placeholder="—"
                  className="form-input font-data" />
              </FormField>
            </div>

            {/* Supplements */}
            <FormField label={`Supplements (${form.formSupplements.length})`}>
              <div className="flex flex-wrap gap-1.5">
                {SUPPLEMENTS.map((sup) => {
                  const active = form.formSupplements.includes(sup.id);
                  return (
                    <button key={sup.id} type="button" onClick={() => form.toggleSupplement(sup.id)}
                      className="text-xs px-2 py-1 rounded-full transition-all font-medium"
                      style={{
                        backgroundColor: active ? `color-mix(in srgb, ${sup.color} 20%, transparent)` : "var(--bg-tertiary)",
                        color: active ? sup.color : "var(--text-muted)",
                        border: active ? `1px solid color-mix(in srgb, ${sup.color} 40%, transparent)` : "1px solid var(--border-default)",
                      }}>
                      {sup.name}
                    </button>
                  );
                })}
              </div>
            </FormField>

            {/* Interventions */}
            <FormField label={`Interventions (${form.formInterventions.length})`}>
              <div className="flex flex-wrap gap-1.5">
                {INTERVENTIONS.map((intv) => {
                  const active = form.formInterventions.includes(intv.id);
                  return (
                    <button key={intv.id} type="button" onClick={() => form.toggleIntervention(intv.id)}
                      className="text-xs px-2 py-1 rounded-full transition-all font-medium"
                      style={{
                        backgroundColor: active ? "rgba(59, 130, 246, 0.15)" : "var(--bg-tertiary)",
                        color: active ? "#60a5fa" : "var(--text-muted)",
                        border: active ? "1px solid rgba(59, 130, 246, 0.3)" : "1px solid var(--border-default)",
                      }}>
                      {intv.name}
                    </button>
                  );
                })}
              </div>
            </FormField>

            {/* Notes */}
            <FormField label="Notes">
              <textarea value={form.formNotes} onChange={(e) => form.setFormNotes(e.target.value)} rows={3}
                placeholder="Optional notes..."
                className="form-input resize-none" />
            </FormField>

            {/* Submit */}
            <button type="button" onClick={handleSubmit}
              className="w-full rounded-lg bg-accent-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover flex items-center justify-center gap-2">
              <Moon className="h-4 w-4" />
              {form.editingId ? "Update Entry" : "Log Night"}
            </button>

            {/* Keyboard hint */}
            <p className="text-[11px] text-text-muted text-center">
              Press <kbd className="px-1 py-0.5 rounded bg-bg-tertiary text-text-secondary">Esc</kbd> to close
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wider text-text-muted block mb-1 font-semibold">{label}</label>
      {children}
    </div>
  );
}
