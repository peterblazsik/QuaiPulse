"use client";

import { usePathname } from "next/navigation";
import { Search, Menu } from "lucide-react";
import { useUIStore } from "@/lib/stores/ui-store";
import { daysUntil } from "@/lib/utils";
import { MOVE_DATE } from "@/lib/constants";

const ROUTE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/neighborhoods": "Neighborhoods",
  "/budget": "Budget Simulator",
  "/apartments": "Apartments",
  "/katie": "Katie Planner",
  "/social": "Social Map",
  "/checklist": "Move Checklist",
  "/ai": "AI Chat",
  "/currency": "Currency",
  "/weather": "Weather",
  "/settings": "Settings",
};

export function Header() {
  const pathname = usePathname();
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen);
  const setMobileSidebarOpen = useUIStore((s) => s.setMobileSidebarOpen);
  const days = daysUntil(MOVE_DATE);

  const title =
    ROUTE_TITLES[pathname] ??
    pathname
      .split("/")
      .pop()
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) ??
    "";

  return (
    <header className="glass-header flex h-12 shrink-0 items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="md:hidden text-text-tertiary hover:text-text-primary transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-sm font-medium text-text-primary">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search trigger */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 rounded-md border border-border-default bg-bg-primary/50 px-3 py-1.5 text-xs text-text-tertiary transition-colors hover:border-text-tertiary hover:text-text-secondary"
        >
          <Search className="h-3 w-3" />
          <span>Search...</span>
          <kbd>&#8984;K</kbd>
        </button>

        {/* Countdown */}
        {days > 0 && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-text-tertiary">Zurich in</span>
            <span className="font-data font-semibold text-accent-primary">
              {days}d
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
