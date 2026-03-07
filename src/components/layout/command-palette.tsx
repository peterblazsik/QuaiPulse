"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  LayoutDashboard,
  MapPin,
  Wallet,
  Building2,
  Heart,
  Users,
  CheckSquare,
  Bot,
  Dumbbell,
  Moon,
  Plane,
  Languages,
  CreditCard,
  ArrowLeftRight,
  CloudSun,
  Settings,
} from "lucide-react";
import { useUIStore } from "@/lib/stores/ui-store";

const COMMANDS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, group: "Navigate" },
  { label: "Neighborhoods", href: "/neighborhoods", icon: MapPin, group: "Navigate" },
  { label: "Budget Simulator", href: "/budget", icon: Wallet, group: "Navigate" },
  { label: "Apartments", href: "/apartments", icon: Building2, group: "Navigate" },
  { label: "Katie Planner", href: "/katie", icon: Heart, group: "Navigate" },
  { label: "Social Map", href: "/social", icon: Users, group: "Navigate" },
  { label: "Move Checklist", href: "/checklist", icon: CheckSquare, group: "Navigate" },
  { label: "AI Chat", href: "/ai", icon: Bot, group: "Navigate" },
  { label: "Gym Finder", href: "/gym-finder", icon: Dumbbell, group: "Navigate" },
  { label: "Sleep Intelligence", href: "/sleep", icon: Moon, group: "Navigate" },
  { label: "Flight Scanner", href: "/flights", icon: Plane, group: "Navigate" },
  { label: "Language Prep", href: "/language", icon: Languages, group: "Navigate" },
  { label: "Subscriptions", href: "/subscriptions", icon: CreditCard, group: "Navigate" },
  { label: "Currency Dashboard", href: "/currency", icon: ArrowLeftRight, group: "Navigate" },
  { label: "Weather", href: "/weather", icon: CloudSun, group: "Navigate" },
  { label: "Settings", href: "/settings", icon: Settings, group: "Navigate" },
];

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const triggerRef = useRef<Element | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (!commandPaletteOpen) {
          triggerRef.current = document.activeElement;
        }
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  // Focus trap
  useEffect(() => {
    if (!commandPaletteOpen || !dialogRef.current) return;
    const dialog = dialogRef.current;
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'input, button, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    dialog.addEventListener("keydown", handleTab);
    return () => dialog.removeEventListener("keydown", handleTab);
  }, [commandPaletteOpen]);

  // Restore focus on close
  useEffect(() => {
    if (!commandPaletteOpen && triggerRef.current instanceof HTMLElement) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Command palette" ref={dialogRef}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setCommandPaletteOpen(false)}
      />
      {/* Palette */}
      <div className="flex items-start justify-center pt-[20vh]">
        <Command
          className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border-default bg-bg-secondary shadow-2xl"
          onKeyDown={(e) => {
            if (e.key === "Escape") setCommandPaletteOpen(false);
          }}
        >
          <Command.Input
            placeholder="Where to? Type a command..."
            className="w-full border-b border-border-default bg-transparent px-4 py-3 text-sm text-text-primary outline-none placeholder:text-text-muted"
            autoFocus
          />
          <Command.List className="max-h-72 overflow-y-auto p-2">
            <Command.Empty className="px-4 py-6 text-center text-sm text-text-tertiary">
              No results found.
            </Command.Empty>
            <Command.Group
              heading="Navigate"
              className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted"
            >
              {COMMANDS.map((cmd) => {
                const Icon = cmd.icon;
                return (
                  <Command.Item
                    key={cmd.href}
                    value={cmd.label}
                    onSelect={() => {
                      router.push(cmd.href);
                      setCommandPaletteOpen(false);
                    }}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors data-[selected=true]:bg-accent-primary/10 data-[selected=true]:text-accent-primary"
                  >
                    <Icon className="h-4 w-4" />
                    {cmd.label}
                  </Command.Item>
                );
              })}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
