"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ApartmentStatus } from "@/lib/types";

export interface SavedApartment {
  id: string;
  title: string;
  address: string;
  kreis: number;
  rent: number;
  rooms: number;
  sqm: number;
  sourceUrl: string;
  status: ApartmentStatus;
  notes: string;
  createdAt: string;
}

interface ApartmentStore {
  apartments: SavedApartment[];
  add: (apt: Omit<SavedApartment, "id" | "createdAt">) => void;
  remove: (id: string) => void;
  updateStatus: (id: string, status: ApartmentStatus) => void;
  updateNotes: (id: string, notes: string) => void;
}

const DEMO_APARTMENTS: SavedApartment[] = [
  {
    id: "apt-1",
    title: "Bright 2.5 room near Bederstrasse",
    address: "Bederstrasse 78, 8002 Zurich",
    kreis: 2,
    rent: 2450,
    rooms: 2.5,
    sqm: 58,
    sourceUrl: "",
    status: "interested",
    notes: "Great location, 10 min walk to office. 3rd floor, no elevator but manageable.",
    createdAt: "2026-03-01T00:00:00Z",
  },
  {
    id: "apt-2",
    title: "Modern 2 room on Birmensdorferstrasse",
    address: "Birmensdorferstrasse 210, 8003 Zurich",
    kreis: 3,
    rent: 1950,
    rooms: 2,
    sqm: 45,
    sourceUrl: "",
    status: "new",
    notes: "Affordable, near PureGym. Small but well-designed. Tram 13 right outside.",
    createdAt: "2026-03-02T00:00:00Z",
  },
  {
    id: "apt-3",
    title: "Renovated 2.5 room Seefeld",
    address: "Seefeldstrasse 152, 8008 Zurich",
    kreis: 8,
    rent: 2680,
    rooms: 2.5,
    sqm: 62,
    sourceUrl: "",
    status: "contacted",
    notes: "Stunning lakeside area. Viewing request sent. Dishwasher + balcony.",
    createdAt: "2026-03-03T00:00:00Z",
  },
];

export const useApartmentStore = create<ApartmentStore>()(
  persist(
    (set) => ({
      apartments: DEMO_APARTMENTS,
      add: (apt) =>
        set((s) => ({
          apartments: [
            ...s.apartments,
            {
              ...apt,
              id: `apt-${Date.now()}`,
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      remove: (id) =>
        set((s) => ({
          apartments: s.apartments.filter((a) => a.id !== id),
        })),
      updateStatus: (id, status) =>
        set((s) => ({
          apartments: s.apartments.map((a) =>
            a.id === id ? { ...a, status } : a
          ),
        })),
      updateNotes: (id, notes) =>
        set((s) => ({
          apartments: s.apartments.map((a) =>
            a.id === id ? { ...a, notes } : a
          ),
        })),
    }),
    { name: "quaipulse-apartments" }
  )
);
