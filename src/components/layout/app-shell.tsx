"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { StatusBar } from "./status-bar";
import { CommandPalette } from "./command-palette";
import { KeyboardHelp } from "./keyboard-help";
import { ThemeInit } from "./theme-init";
import { ErrorBoundary } from "./error-boundary";
import { useUIStore } from "@/lib/stores/ui-store";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);
  const { registerHelpToggle } = useKeyboardShortcuts();

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-accent-primary focus:px-4 focus:py-2 focus:text-sm focus:text-white">
        Skip to content
      </a>
      <ThemeInit />
      <Sidebar />
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-200",
          // No margin on mobile (sidebar is overlay), margin on desktop
          sidebarCollapsed ? "md:ml-16" : "md:ml-64"
        )}
      >
        <Header />
        <main id="main-content" className="flex-1 overflow-y-auto p-6 bg-dot-pattern">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
        <StatusBar />
      </div>
      <CommandPalette />
      <KeyboardHelp registerToggle={registerHelpToggle} />
    </div>
  );
}
