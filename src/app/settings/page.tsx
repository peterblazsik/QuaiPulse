"use client";

import { useMemo } from "react";
import {
  Settings,
  User,
  Key,
  Database,
  Download,
  MapPin,
  Wallet,
  Heart,
  Keyboard,
  Moon,
  Palette,
} from "lucide-react";
import { usePriorityStore } from "@/lib/stores/priority-store";
import { useBudgetStore } from "@/lib/stores/budget-store";
import { useChecklistStore } from "@/lib/stores/checklist-store";
import { useApartmentStore } from "@/lib/stores/apartment-store";
import { useSleepStore } from "@/lib/stores/sleep-store";
import { ThemeSelector } from "@/components/layout/theme-selector";
import { NEIGHBORHOODS } from "@/lib/data/neighborhoods";
import { rankNeighborhoods } from "@/lib/engines/scoring";
import { calculateBudget, EXPENSE_CONFIG } from "@/lib/engines/budget-calculator";
import { PLANNED_VISITS } from "@/lib/data/katie-visits";
import {
  exportBudgetCSV,
  exportRankingsCSV,
  exportKatieICS,
  exportFullBackup,
} from "@/lib/exports";

export default function SettingsPage() {
  const resetWeights = usePriorityStore((s) => s.resetWeights);
  const weights = usePriorityStore((s) => s.weights);
  const resetBudget = useBudgetStore((s) => s.resetValues);
  const budgetValues = useBudgetStore((s) => s.values);
  const completedIds = useChecklistStore((s) => s.completedIds);
  const apartments = useApartmentStore((s) => s.apartments);
  const sleepEntries = useSleepStore((s) => s.entries);
  const removeSleepEntry = useSleepStore((s) => s.removeEntry);

  const handleResetSleep = () => {
    if (
      window.confirm(
        `Clear all ${sleepEntries.length} sleep entries? This cannot be undone.`
      )
    ) {
      // Remove all entries one by one (store has no bulk reset)
      for (const entry of sleepEntries) {
        removeSleepEntry(entry.id);
      }
    }
  };

  const ranked = useMemo(
    () => rankNeighborhoods(NEIGHBORHOODS, weights),
    [weights]
  );

  const breakdown = useMemo(
    () => calculateBudget(budgetValues),
    [budgetValues]
  );

  const handleExportBudget = () => {
    exportBudgetCSV(breakdown, EXPENSE_CONFIG, budgetValues);
  };

  const handleExportRankings = () => {
    exportRankingsCSV(ranked);
  };

  const handleExportKatie = () => {
    exportKatieICS(PLANNED_VISITS);
  };

  const handleExportBackup = () => {
    exportFullBackup({
      apartments,
      budgetValues,
      neighborhoods: ranked,
      completedChecklistIds: completedIds,
    });
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Settings
        </h1>
        <p className="text-sm text-text-tertiary mt-1">
          Profile, API keys, and data management.
        </p>
      </div>

      {/* Profile */}
      <SettingsSection
        icon={<User className="h-4 w-4" />}
        title="Profile"
      >
        <div className="grid grid-cols-2 gap-3">
          <ProfileField label="Name" value="Peter Blazsik" />
          <ProfileField label="Role" value="Finance AI & Innovation Lead" />
          <ProfileField label="Company" value="Zurich Insurance Group" />
          <ProfileField label="Office" value="Quai Zurich Campus, Mythenquai" />
          <ProfileField label="Start Date" value="July 1, 2026" />
          <ProfileField label="Languages" value="EN, HU native; DE basic" />
          <ProfileField label="Net Income" value="CHF 12,150/mo" />
          <ProfileField label="Health" value="Bilateral meniscus + torn ACL (left)" />
        </div>
      </SettingsSection>

      {/* Appearance */}
      <SettingsSection
        icon={<Palette className="h-4 w-4" />}
        title="Appearance"
      >
        <ThemeSelector collapsed={false} />
      </SettingsSection>

      {/* API Configuration */}
      <SettingsSection
        icon={<Key className="h-4 w-4" />}
        title="API Configuration"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success shrink-0" />
            <span className="text-xs text-text-secondary">
              Gemini API — configured via server environment variable
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success shrink-0" />
            <span className="text-xs text-text-secondary">
              Currency API — Frankfurter (free, no key needed)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success shrink-0" />
            <span className="text-xs text-text-secondary">
              Weather API — Open-Meteo (free, no key needed)
            </span>
          </div>
        </div>
        <p className="text-[10px] text-text-muted mt-2">
          API key is stored securely in <code className="bg-bg-tertiary px-1 rounded text-accent-primary">.env.local</code> and never exposed to the browser.
        </p>
      </SettingsSection>

      {/* Data management */}
      <SettingsSection
        icon={<Database className="h-4 w-4" />}
        title="Data Management"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-text-muted" />
              <span className="text-xs text-text-secondary">
                Neighborhood priority weights
              </span>
            </div>
            <button
              onClick={resetWeights}
              className="text-[10px] text-text-muted hover:text-warning transition-colors"
            >
              Reset to defaults
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-3.5 w-3.5 text-text-muted" />
              <span className="text-xs text-text-secondary">
                Budget slider values
              </span>
            </div>
            <button
              onClick={resetBudget}
              className="text-[10px] text-text-muted hover:text-warning transition-colors"
            >
              Reset to defaults
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="h-3.5 w-3.5 text-text-muted" />
              <span className="text-xs text-text-secondary">
                Sleep tracking data ({sleepEntries.length} entries)
              </span>
            </div>
            <button
              onClick={handleResetSleep}
              className="text-[10px] text-text-muted hover:text-warning transition-colors"
            >
              Clear all entries
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-3.5 w-3.5 text-text-muted" />
              <span className="text-xs text-text-secondary">
                Checklist progress
              </span>
            </div>
            <span className="text-[10px] text-text-muted">
              Persisted in localStorage
            </span>
          </div>
        </div>
      </SettingsSection>

      {/* Keyboard Shortcuts */}
      <SettingsSection
        icon={<Keyboard className="h-4 w-4" />}
        title="Keyboard Shortcuts"
      >
        <p className="text-[10px] text-text-muted mb-3">
          Press <kbd className="bg-bg-tertiary px-1.5 py-0.5 rounded text-accent-primary font-mono">G</kbd> then a letter to navigate (chord shortcuts).
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { key: "D", label: "Dashboard", path: "/" },
            { key: "N", label: "Neighborhoods", path: "/neighborhoods" },
            { key: "B", label: "Budget", path: "/budget" },
            { key: "A", label: "Apartments", path: "/apartments" },
            { key: "K", label: "Katie", path: "/katie" },
            { key: "S", label: "Social", path: "/social" },
            { key: "C", label: "Checklist", path: "/checklist" },
            { key: "I", label: "AI Chat", path: "/ai" },
            { key: "F", label: "Gym Finder", path: "/gym-finder" },
            { key: "Z", label: "Sleep", path: "/sleep" },
            { key: "L", label: "Flights", path: "/flights" },
            { key: "P", label: "Language", path: "/language" },
            { key: "U", label: "Subscriptions", path: "/subscriptions" },
          ].map((s) => (
            <div
              key={s.key}
              className="flex items-center gap-2 rounded-lg bg-bg-primary/50 border border-border-subtle px-2.5 py-1.5"
            >
              <kbd className="bg-bg-tertiary px-1.5 py-0.5 rounded text-[10px] font-mono text-accent-primary font-semibold min-w-[20px] text-center">
                {s.key}
              </kbd>
              <span className="text-[11px] text-text-secondary truncate">
                {s.label}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-text-muted mt-3">
          Also: <kbd className="bg-bg-tertiary px-1 py-0.5 rounded text-accent-primary font-mono">Cmd+K</kbd> command palette
        </p>
      </SettingsSection>

      {/* Export */}
      <SettingsSection
        icon={<Download className="h-4 w-4" />}
        title="Export"
      >
        <div className="flex flex-wrap gap-2">
          <ExportButton label="Budget as CSV" onClick={handleExportBudget} />
          <ExportButton label="Neighborhood rankings as CSV" onClick={handleExportRankings} />
          <ExportButton label="Katie visits as .ics" onClick={handleExportKatie} />
          <ExportButton label="Full data backup as JSON" onClick={handleExportBackup} />
        </div>
      </SettingsSection>

      {/* About */}
      <div className="rounded-xl border border-border-subtle bg-bg-secondary/50 p-4 text-center">
        <p className="text-xs text-text-muted">
          <span className="font-display font-semibold text-text-secondary">
            QuaiPulse
          </span>{" "}
          v0.1.0 — Personal Zurich Life Navigator
        </p>
        <p className="text-[10px] text-text-muted mt-1">
          Built with Next.js 15, React 19, Tailwind 4, Zustand, Framer Motion
        </p>
      </div>
    </div>
  );
}

function SettingsSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border-default bg-bg-secondary p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-text-muted">{icon}</span>
        <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-text-muted">
        {label}
      </p>
      <p className="text-xs text-text-primary mt-0.5">{value}</p>
    </div>
  );
}

function ExportButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-lg border border-border-default bg-bg-primary/50 text-text-muted hover:text-text-secondary hover:border-accent-primary/30 transition-colors"
    >
      <Download className="h-2.5 w-2.5" />
      {label}
    </button>
  );
}
