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
  interventions?: string[]; // intervention IDs performed that day
  bedtime?: string; // HH:MM
  waketime?: string; // HH:MM
  sleepLatency?: number; // minutes to fall asleep
  awakenings?: number; // number of times woke up
  notes?: string;
}

function generateDemoData(): SleepEntry[] {
  const entries: SleepEntry[] = [];
  const today = new Date();

  const patterns = [
    // Days 1-14 (oldest to newest, weeks 4-3 ago)
    { hours: 6.0, quality: 3 as SleepQuality, location: "zurich" as SleepLocation, supplements: ["magnesium-glycinate"], interventions: ["morning-light"], bedtime: "23:00", waketime: "06:00", sleepLatency: 28, awakenings: 2 },
    { hours: 5.5, quality: 2 as SleepQuality, location: "zurich" as SleepLocation, supplements: [], interventions: [], bedtime: "23:45", waketime: "05:45", sleepLatency: 35, awakenings: 3, notes: "Restless, no protocol" },
    { hours: 7.0, quality: 3 as SleepQuality, location: "zurich" as SleepLocation, supplements: ["magnesium-glycinate"], interventions: ["physiological-sigh"], bedtime: "23:00", waketime: "06:00", sleepLatency: 22, awakenings: 2 },
    { hours: 7.5, quality: 4 as SleepQuality, location: "zurich" as SleepLocation, supplements: ["magnesium-glycinate", "l-theanine"], interventions: ["morning-light", "resistance-training"], bedtime: "22:30", waketime: "06:00", sleepLatency: 15, awakenings: 1 },
    { hours: 6.5, quality: 3 as SleepQuality, location: "zurich" as SleepLocation, supplements: ["magnesium-glycinate"], interventions: ["morning-light"], bedtime: "22:45", waketime: "06:00", sleepLatency: 20, awakenings: 2 },
    { hours: 5.0, quality: 2 as SleepQuality, location: "travel" as SleepLocation, supplements: ["melatonin"], interventions: [], bedtime: "00:15", waketime: "05:30", sleepLatency: 45, awakenings: 3, notes: "Airport hotel, early flight" },
    { hours: 6.0, quality: 3 as SleepQuality, location: "vienna" as SleepLocation, supplements: [], interventions: ["physiological-sigh"], bedtime: "23:00", waketime: "06:00", sleepLatency: 30, awakenings: 2, notes: "Katie's place, sofa bed" },
    { hours: 7.0, quality: 3 as SleepQuality, location: "vienna" as SleepLocation, supplements: ["melatonin", "magnesium-glycinate"], interventions: ["cognitive-shuffle"], bedtime: "22:30", waketime: "06:00", sleepLatency: 20, awakenings: 1 },
    { hours: 7.5, quality: 4 as SleepQuality, location: "zurich" as SleepLocation, supplements: ["magnesium-glycinate", "glycine"], interventions: ["yoga-nidra", "morning-light"], bedtime: "22:15", waketime: "06:00", sleepLatency: 12, awakenings: 1 },
    { hours: 6.5, quality: 3 as SleepQuality, location: "zurich" as SleepLocation, supplements: ["magnesium-glycinate"], interventions: ["resistance-training"], bedtime: "23:00", waketime: "06:00", sleepLatency: 18, awakenings: 2 },
    { hours: 8.0, quality: 4 as SleepQuality, location: "zurich" as SleepLocation, supplements: ["magnesium-glycinate", "l-theanine", "glycine"], interventions: ["yoga-nidra", "swimming", "evening-light-block"], bedtime: "22:00", waketime: "06:00", sleepLatency: 10, awakenings: 1 },
    { hours: 6.0, quality: 2 as SleepQuality, location: "zurich" as SleepLocation, supplements: [], interventions: [], bedtime: "00:00", waketime: "06:00", sleepLatency: 30, awakenings: 3, notes: "Late dinner, couldn't wind down" },
    { hours: 7.0, quality: 3 as SleepQuality, location: "zurich" as SleepLocation, supplements: ["magnesium-glycinate", "melatonin"], interventions: ["cognitive-shuffle", "morning-light"], bedtime: "22:30", waketime: "06:00", sleepLatency: 18, awakenings: 1 },
    { hours: 7.5, quality: 4 as SleepQuality, location: "zurich" as SleepLocation, supplements: ["magnesium-glycinate", "l-theanine"], interventions: ["resistance-training", "morning-light"], bedtime: "22:30", waketime: "06:00", sleepLatency: 14, awakenings: 1 },
    // Days 15-28 (weeks 2-1 ago, showing improvement arc)
    { hours: 7.5, quality: 4 as SleepQuality, location: "zurich" as SleepLocation, supplements: ["magnesium-glycinate"], interventions: ["yoga-nidra", "morning-light"], bedtime: "22:30", waketime: "06:00", sleepLatency: 15, awakenings: 1 },
    { hours: 6.5, quality: 3 as SleepQuality, location: "zurich" as SleepLocation, supplements: [], interventions: ["morning-light"], bedtime: "23:15", waketime: "06:00", sleepLatency: 25, awakenings: 2 },
    { hours: 8.0, quality: 5 as SleepQuality, location: "zurich" as SleepLocation, supplements: ["melatonin", "magnesium-glycinate", "glycine"], interventions: ["yoga-nidra", "swimming", "evening-light-block"], bedtime: "22:00", waketime: "06:00", sleepLatency: 8, awakenings: 0 },
    { hours: 7.0, quality: 4 as SleepQuality, location: "zurich" as SleepLocation, supplements: ["magnesium-glycinate", "l-theanine"], interventions: ["resistance-training", "morning-light"], bedtime: "22:45", waketime: "06:00", sleepLatency: 12, awakenings: 1 },
    { hours: 5.5, quality: 2 as SleepQuality, location: "travel" as SleepLocation, supplements: ["melatonin"], interventions: [], bedtime: "23:30", waketime: "05:30", sleepLatency: 40, awakenings: 3, notes: "Hotel bed uncomfortable" },
    { hours: 6.0, quality: 3 as SleepQuality, location: "vienna" as SleepLocation, supplements: [], interventions: ["physiological-sigh"], bedtime: "23:00", waketime: "06:00", sleepLatency: 30, awakenings: 2, notes: "Katie's place, sofa bed" },
    { hours: 7.0, quality: 3 as SleepQuality, location: "vienna" as SleepLocation, supplements: ["melatonin", "magnesium-glycinate"], interventions: ["cognitive-shuffle"], bedtime: "22:30", waketime: "06:00", sleepLatency: 20, awakenings: 1 },
    { hours: 8.5, quality: 5 as SleepQuality, location: "zurich" as SleepLocation, supplements: ["magnesium-glycinate", "glycine", "l-theanine", "apigenin"], interventions: ["yoga-nidra", "swimming", "evening-light-block", "bedroom-temp"], bedtime: "22:00", waketime: "06:30", sleepLatency: 5, awakenings: 0, notes: "Perfect night — full protocol" },
    { hours: 7.0, quality: 4 as SleepQuality, location: "zurich" as SleepLocation, supplements: ["magnesium-glycinate"], interventions: ["resistance-training"], bedtime: "22:30", waketime: "06:00", sleepLatency: 15, awakenings: 1 },
    { hours: 6.5, quality: 3 as SleepQuality, location: "zurich" as SleepLocation, supplements: ["magnesium-glycinate"], interventions: ["morning-light"], bedtime: "23:00", waketime: "06:00", sleepLatency: 22, awakenings: 2 },
    { hours: 7.5, quality: 4 as SleepQuality, location: "zurich" as SleepLocation, supplements: ["melatonin", "magnesium-glycinate", "l-theanine"], interventions: ["yoga-nidra", "morning-light", "evening-light-block"], bedtime: "22:15", waketime: "06:00", sleepLatency: 10, awakenings: 1 },
    { hours: 5.0, quality: 2 as SleepQuality, location: "zurich" as SleepLocation, supplements: ["pea", "tart-cherry"], interventions: [], bedtime: "23:30", waketime: "05:00", sleepLatency: 35, awakenings: 3, notes: "Knee pain kept me up" },
    { hours: 8.0, quality: 5 as SleepQuality, location: "zurich" as SleepLocation, supplements: ["magnesium-glycinate", "glycine", "apigenin", "tart-cherry"], interventions: ["yoga-nidra", "resistance-training", "cold-shower", "evening-light-block"], bedtime: "22:00", waketime: "06:00", sleepLatency: 7, awakenings: 0 },
    { hours: 7.0, quality: 4 as SleepQuality, location: "zurich" as SleepLocation, supplements: ["magnesium-glycinate", "l-theanine"], interventions: ["swimming", "morning-light"], bedtime: "22:30", waketime: "06:00", sleepLatency: 12, awakenings: 1 },
  ];

  for (let i = 0; i < patterns.length; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - (patterns.length - 1 - i));
    const p = patterns[i];
    entries.push({
      id: `demo-${i}`,
      date: date.toISOString().split("T")[0],
      hours: p.hours,
      quality: p.quality,
      location: p.location,
      supplements: p.supplements,
      interventions: p.interventions,
      bedtime: p.bedtime,
      waketime: p.waketime,
      sleepLatency: p.sleepLatency,
      awakenings: p.awakenings,
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
