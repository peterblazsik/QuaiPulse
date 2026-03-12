"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  Route,
  Languages,
  CreditCard,
  ArrowLeftRight,
  CloudSun,
  FileText,
  Settings,
  TrendingUp,
  PanelLeftClose,
  PanelLeft,
  LogOut,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useUIStore } from "@/lib/stores/ui-store";
import { cn } from "@/lib/utils";
import { ThemeSelector } from "./theme-selector";

const ICON_MAP = {
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
  Route,
  Languages,
  CreditCard,
  ArrowLeftRight,
  CloudSun,
  FileText,
  Settings,
  TrendingUp,
} as const;

interface NavItem {
  label: string;
  href: string;
  icon: keyof typeof ICON_MAP;
  shortcut?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/", icon: "LayoutDashboard", shortcut: "G D" },
      { label: "AI Chat", href: "/ai", icon: "Bot", shortcut: "G I" },
    ],
  },
  {
    label: "Zurich Life",
    items: [
      { label: "Neighborhoods", href: "/neighborhoods", icon: "MapPin", shortcut: "G N" },
      { label: "Apartments", href: "/apartments", icon: "Building2", shortcut: "G A" },
      { label: "Rental Intel", href: "/rental-intel", icon: "TrendingUp", shortcut: "G R" },
      { label: "Gym Finder", href: "/gym-finder", icon: "Dumbbell", shortcut: "G F" },
      { label: "Social Map", href: "/social", icon: "Users", shortcut: "G S" },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Budget", href: "/budget", icon: "Wallet", shortcut: "G B" },
      { label: "Subscriptions", href: "/subscriptions", icon: "CreditCard", shortcut: "G U" },
      { label: "Currency", href: "/currency", icon: "ArrowLeftRight" },
    ],
  },
  {
    label: "Travel & Katie",
    items: [
      { label: "Travel Intel", href: "/travel", icon: "Route", shortcut: "G T" },
      { label: "Flights", href: "/flights", icon: "Plane", shortcut: "G L" },
      { label: "Katie Planner", href: "/katie", icon: "Heart", shortcut: "G K" },
    ],
  },
  {
    label: "Wellness",
    items: [
      { label: "Sleep Intelligence", href: "/sleep", icon: "Moon", shortcut: "G Z" },
      { label: "Weather", href: "/weather", icon: "CloudSun" },
    ],
  },
  {
    label: "Move Prep",
    items: [
      { label: "Checklist", href: "/checklist", icon: "CheckSquare", shortcut: "G C" },
      { label: "Dossier", href: "/dossier", icon: "FileText", shortcut: "G O" },
      { label: "Language Prep", href: "/language", icon: "Languages", shortcut: "G P" },
    ],
  },
  {
    label: "",
    items: [
      { label: "Settings", href: "/settings", icon: "Settings" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, mobileSidebarOpen, setMobileSidebarOpen } = useUIStore();
  const { data: session } = useSession();

  return (
    <>
      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      <aside
        className={cn(
          "glass-sidebar fixed left-0 top-0 z-40 flex h-screen flex-col transition-all duration-200",
          // Desktop: show based on collapsed state
          sidebarCollapsed ? "md:w-16" : "md:w-64",
          // Mobile: off-screen by default, slide in when open
          mobileSidebarOpen ? "w-64 translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
      {/* Logo */}
      <div className="flex h-12 items-center gap-3 border-b border-border-default px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg overflow-hidden bg-black">
          <Image
            src="/images/logo/logo-icon.png"
            alt="QuaiPulse"
            width={32}
            height={32}
            className="object-contain"
          />
        </div>
        {!sidebarCollapsed && (
          <span className="font-display text-lg font-semibold text-text-primary">
            QuaiPulse
          </span>
        )}
      </div>

      {/* Nav */}
      <nav aria-label="Main navigation" className="flex-1 overflow-y-auto py-2">
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi} className={gi > 0 ? "mt-3" : ""}>
            {group.label && !sidebarCollapsed && (
              <p className="px-4 pb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                {group.label}
              </p>
            )}
            {group.label && sidebarCollapsed && gi > 0 && (
              <div className="mx-3 mb-1 border-t border-border-subtle" />
            )}
            {group.items.map((item) => {
              const Icon = ICON_MAP[item.icon];
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={cn(
                    "group flex items-center gap-3 px-4 py-1.5 text-sm transition-colors",
                    isActive
                      ? "bg-accent-primary/10 text-accent-primary"
                      : "text-text-secondary hover:bg-bg-tertiary/50 hover:text-text-primary"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.shortcut && (
                        <kbd className="hidden text-[10px] group-hover:inline-flex">
                          {item.shortcut}
                        </kbd>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Theme selector */}
      <div className="border-t border-border-default">
        <ThemeSelector collapsed={sidebarCollapsed} />
      </div>

      {/* User menu */}
      {session?.user && (
        <div className="border-t border-border-default px-3 py-2">
          <div className="flex items-center gap-2">
            {session.user.image && (
              <img
                src={session.user.image}
                alt=""
                className="h-6 w-6 rounded-full shrink-0"
                referrerPolicy="no-referrer"
              />
            )}
            {!sidebarCollapsed && (
              <>
                <span className="flex-1 truncate text-xs text-text-secondary">
                  {session.user.name ?? session.user.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="text-text-muted hover:text-text-primary transition-colors"
                  title="Sign out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="flex h-10 items-center justify-center border-t border-border-default text-text-tertiary transition-colors hover:text-text-primary"
      >
        {sidebarCollapsed ? (
          <PanelLeft className="h-4 w-4" />
        ) : (
          <PanelLeftClose className="h-4 w-4" />
        )}
      </button>
    </aside>
    </>
  );
}
