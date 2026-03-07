"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SleepLocation, SleepQuality } from "@/lib/data/sleep-defaults";

export interface SleepEntry {
  id: string;
  date: string; // YYYY-MM-DD
  hours: number;
  quality: SleepQuality;
  location: SleepLocation;
  supplements: string[];
  notes?: string;
}

function generateDemoData(): SleepEntry[] {
  const entries: SleepEntry[] = [];
  const today = new Date();

  const patterns = [
    { hours: 7.5, quality: 4 as SleepQuality, location: "zurich" as SleepLocation, supplements: ["magnesium"] },
    { hours: 6.5, quality: 3 as SleepQuality, location: "zurich" as SleepLocation, supplements: [] },
    { hours: 8.0, quality: 5 as SleepQuality, location: "zurich" as SleepLocation, supplements: ["melatonin", "magnesium"] },
    { hours: 7.0, quality: 4 as SleepQuality, location: "zurich" as SleepLocation, supplements: ["magnesium"] },
    { hours: 5.5, quality: 2 as SleepQuality, location: "travel" as SleepLocation, supplements: ["melatonin"], notes: "Hotel bed uncomfortable" },
    { hours: 6.0, quality: 3 as SleepQuality, location: "vienna" as SleepLocation, supplements: [], notes: "Katie's place, sofa bed" },
    { hours: 7.0, quality: 3 as SleepQuality, location: "vienna" as SleepLocation, supplements: ["melatonin"] },
    { hours: 8.5, quality: 5 as SleepQuality, location: "zurich" as SleepLocation, supplements: ["magnesium", "valerian"], notes: "Perfect night" },
    { hours: 7.0, quality: 4 as SleepQuality, location: "zurich" as SleepLocation, supplements: [] },
    { hours: 6.5, quality: 3 as SleepQuality, location: "zurich" as SleepLocation, supplements: ["magnesium"] },
    { hours: 7.5, quality: 4 as SleepQuality, location: "zurich" as SleepLocation, supplements: ["melatonin", "magnesium"] },
    { hours: 5.0, quality: 2 as SleepQuality, location: "zurich" as SleepLocation, supplements: [], notes: "Knee pain kept me up" },
    { hours: 8.0, quality: 5 as SleepQuality, location: "zurich" as SleepLocation, supplements: ["magnesium", "chamomile"] },
    { hours: 7.0, quality: 4 as SleepQuality, location: "zurich" as SleepLocation, supplements: ["magnesium"] },
  ];

  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - (13 - i));
    const p = patterns[i];
    entries.push({
      id: `demo-${i}`,
      date: date.toISOString().split("T")[0],
      hours: p.hours,
      quality: p.quality,
      location: p.location,
      supplements: p.supplements,
      notes: p.notes,
    });
  }

  return entries;
}

interface SleepStore {
  entries: SleepEntry[];
  addEntry: (entry: Omit<SleepEntry, "id">) => void;
  removeEntry: (id: string) => void;
  updateEntry: (id: string, updates: Partial<SleepEntry>) => void;
}

export const useSleepStore = create<SleepStore>()(
  persist(
    (set) => ({
      entries: generateDemoData(),
      addEntry: (entry) =>
        set((s) => ({
          entries: [...s.entries, { ...entry, id: `sleep-${Date.now()}` }],
        })),
      removeEntry: (id) =>
        set((s) => ({
          entries: s.entries.filter((e) => e.id !== id),
        })),
      updateEntry: (id, updates) =>
        set((s) => ({
          entries: s.entries.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        })),
    }),
    { name: "quaipulse-sleep" }
  )
);
