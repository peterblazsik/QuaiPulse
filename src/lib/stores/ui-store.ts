"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeId = "midnight" | "obsidian" | "swiss";

export const THEMES: { id: ThemeId; label: string; preview: [string, string, string] }[] = [
  { id: "midnight", label: "Midnight Blue", preview: ["#0f172a", "#3b82f6", "#1e293b"] },
  { id: "obsidian", label: "Obsidian Gold", preview: ["#0a0a08", "#d4a853", "#161412"] },
  { id: "swiss", label: "Swiss Banking", preview: ["#FAF9F6", "#1B3A6B", "#DDD9D0"] },
];

interface UIStore {
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  commandPaletteOpen: boolean;
  theme: ThemeId;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setTheme: (theme: ThemeId) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      mobileSidebarOpen: false,
      commandPaletteOpen: false,
      theme: "midnight",
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      setTheme: (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        set({ theme });
      },
    }),
    {
      name: "quaipulse-ui",
      partialize: (state) => ({ theme: state.theme, sidebarCollapsed: state.sidebarCollapsed }),
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          document.documentElement.setAttribute("data-theme", state.theme);
        }
      },
    }
  )
);
