"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ApartmentStatus, InteractionLog, InteractionType } from "@/lib/types";

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
  interactions: InteractionLog[];
}

interface ApartmentStore {
  apartments: SavedApartment[];
  add: (apt: Omit<SavedApartment, "id" | "createdAt" | "interactions">) => void;
  remove: (id: string) => void;
  updateStatus: (id: string, status: ApartmentStatus) => void;
  updateNotes: (id: string, notes: string) => void;
  addInteraction: (apartmentId: string, type: InteractionType, summary: string) => void;
  removeInteraction: (apartmentId: string, interactionId: string) => void;
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
    interactions: [
      { id: "int-1", type: "email", date: "2026-03-05", summary: "Sent inquiry to Verwaltung" },
    ],
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
    interactions: [],
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
    interactions: [
      { id: "int-2", type: "email", date: "2026-03-07", summary: "Sent dossier and cover letter" },
      { id: "int-3", type: "phone", date: "2026-03-09", summary: "Called Verwaltung, left voicemail" },
    ],
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
              interactions: [],
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
      addInteraction: (apartmentId, type, summary) =>
        set((s) => ({
          apartments: s.apartments.map((a) =>
            a.id === apartmentId
              ? {
                  ...a,
                  interactions: [
                    ...a.interactions,
                    {
                      id: `int-${Date.now()}`,
                      type,
                      date: new Date().toISOString().split("T")[0],
                      summary,
                    },
                  ],
                }
              : a
          ),
        })),
      removeInteraction: (apartmentId, interactionId) =>
        set((s) => ({
          apartments: s.apartments.map((a) =>
            a.id === apartmentId
              ? {
                  ...a,
                  interactions: a.interactions.filter((i) => i.id !== interactionId),
                }
              : a
          ),
        })),
    }),
    {
      name: "quaipulse-apartments",
      version: 2,
      migrate: (persisted, version) => {
        const state = persisted as Record<string, unknown>;
        if (version < 2) {
          const apartments = state.apartments as Array<Record<string, unknown>> | undefined;
          if (apartments) {
            for (const apt of apartments) {
              if (!apt.interactions) {
                apt.interactions = [];
              }
            }
          }
        }
        return state;
      },
    }
  )
);
