"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { StatusBar } from "./status-bar";
import { CommandPalette } from "./command-palette";
import { KeyboardHelp } from "./keyboard-help";
import { ThemeInit } from "./theme-init";
import { useUIStore } from "@/lib/stores/ui-store";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);
  const { registerHelpToggle } = useKeyboardShortcuts();

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      <ThemeInit />
      <Sidebar />
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-200",
          sidebarCollapsed ? "ml-16" : "ml-64"
        )}
      >
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-dot-pattern">{children}</main>
        <StatusBar />
      </div>
      <CommandPalette />
      <KeyboardHelp registerToggle={registerHelpToggle} />
    </div>
  );
}
