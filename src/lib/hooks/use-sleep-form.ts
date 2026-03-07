"use client";

import { useState, useCallback } from "react";
import type { SleepEntry } from "@/lib/stores/sleep-store";
import type { SleepLocation, SleepQuality } from "@/lib/data/sleep-defaults";

const today = () => new Date().toISOString().split("T")[0];

export interface SleepFormState {
  formDate: string;
  formHours: number;
  formQuality: SleepQuality;
  formLocation: SleepLocation;
  formSupplements: string[];
  formInterventions: string[];
  formBedtime: string;
  formWaketime: string;
  formLatency: number | "";
  formAwakenings: number | "";
  formNotes: string;
  editingId: string | null;

  setFormDate: (v: string) => void;
  setFormHours: (v: number) => void;
  setFormQuality: (v: SleepQuality) => void;
  setFormLocation: (v: SleepLocation) => void;
  setFormBedtime: (v: string) => void;
  setFormWaketime: (v: string) => void;
  setFormLatency: (v: number | "") => void;
  setFormAwakenings: (v: number | "") => void;
  setFormNotes: (v: string) => void;

  toggleSupplement: (id: string) => void;
  toggleIntervention: (id: string) => void;
  loadEntry: (entry: SleepEntry) => void;
  cancelEdit: () => void;
  buildEntry: () => Omit<SleepEntry, "id">;
  resetForm: () => void;
}

export function useSleepForm(): SleepFormState {
  const [formDate, setFormDate] = useState(today());
  const [formHours, setFormHours] = useState(7.5);
  const [formQuality, setFormQuality] = useState<SleepQuality>(4);
  const [formLocation, setFormLocation] = useState<SleepLocation>("zurich");
  const [formSupplements, setFormSupplements] = useState<string[]>([]);
  const [formInterventions, setFormInterventions] = useState<string[]>([]);
  const [formBedtime, setFormBedtime] = useState("22:30");
  const [formWaketime, setFormWaketime] = useState("06:00");
  const [formLatency, setFormLatency] = useState<number | "">("");
  const [formAwakenings, setFormAwakenings] = useState<number | "">("");
  const [formNotes, setFormNotes] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setFormDate(today());
    setFormHours(7.5);
    setFormQuality(4);
    setFormLocation("zurich");
    setFormSupplements([]);
    setFormInterventions([]);
    setFormBedtime("22:30");
    setFormWaketime("06:00");
    setFormLatency("");
    setFormAwakenings("");
    setFormNotes("");
    setEditingId(null);
  }, []);

  const toggleSupplement = useCallback((id: string) => {
    setFormSupplements((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  }, []);

  const toggleIntervention = useCallback((id: string) => {
    setFormInterventions((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  }, []);

  const loadEntry = useCallback((entry: SleepEntry) => {
    setEditingId(entry.id);
    setFormDate(entry.date);
    setFormHours(entry.hours);
    setFormQuality(entry.quality);
    setFormLocation(entry.location);
    setFormSupplements(entry.supplements);
    setFormInterventions(entry.interventions ?? []);
    setFormBedtime(entry.bedtime ?? "22:30");
    setFormWaketime(entry.waketime ?? "06:00");
    setFormLatency(entry.sleepLatency ?? "");
    setFormAwakenings(entry.awakenings ?? "");
    setFormNotes(entry.notes ?? "");
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
  }, []);

  const buildEntry = useCallback((): Omit<SleepEntry, "id"> => ({
    date: formDate,
    hours: formHours,
    quality: formQuality,
    location: formLocation,
    supplements: formSupplements,
    interventions: formInterventions.length > 0 ? formInterventions : undefined,
    bedtime: formBedtime || undefined,
    waketime: formWaketime || undefined,
    sleepLatency: formLatency !== "" ? formLatency : undefined,
    awakenings: formAwakenings !== "" ? formAwakenings : undefined,
    notes: formNotes || undefined,
  }), [formDate, formHours, formQuality, formLocation, formSupplements, formInterventions, formBedtime, formWaketime, formLatency, formAwakenings, formNotes]);

  return {
    formDate, formHours, formQuality, formLocation, formSupplements, formInterventions,
    formBedtime, formWaketime, formLatency, formAwakenings, formNotes, editingId,
    setFormDate, setFormHours, setFormQuality, setFormLocation,
    setFormBedtime, setFormWaketime, setFormLatency, setFormAwakenings, setFormNotes,
    toggleSupplement, toggleIntervention, loadEntry, cancelEdit, buildEntry, resetForm,
  };
}
