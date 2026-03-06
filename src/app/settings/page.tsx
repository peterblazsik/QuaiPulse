"use client";

import {
  Settings,
  User,
  Key,
  Database,
  Download,
  MapPin,
  Wallet,
  Heart,
} from "lucide-react";
import { usePriorityStore } from "@/lib/stores/priority-store";
import { useBudgetStore } from "@/lib/stores/budget-store";

export default function SettingsPage() {
  const resetWeights = usePriorityStore((s) => s.resetWeights);
  const resetBudget = useBudgetStore((s) => s.resetValues);

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

      {/* API Configuration */}
      <SettingsSection
        icon={<Key className="h-4 w-4" />}
        title="API Configuration"
      >
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-success shrink-0" />
          <span className="text-xs text-text-secondary">
            Gemini API — configured via server environment variable
          </span>
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
              <Heart className="h-3.5 w-3.5 text-text-muted" />
              <span className="text-xs text-text-secondary">
                Checklist progress
              </span>
            </div>
            <span className="text-[10px] text-text-muted">
              Stored in session (resets on refresh)
            </span>
          </div>
        </div>
      </SettingsSection>

      {/* Export */}
      <SettingsSection
        icon={<Download className="h-4 w-4" />}
        title="Export"
      >
        <div className="flex flex-wrap gap-2">
          <ExportButton label="Budget as CSV" />
          <ExportButton label="Neighborhood rankings as PDF" />
          <ExportButton label="Katie visits as .ics" />
          <ExportButton label="Full data backup as JSON" />
        </div>
        <p className="text-[10px] text-text-muted mt-2 italic">
          Export functionality coming in Phase 9.
        </p>
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
          Built with Next.js 16, React 19, Tailwind 4, tRPC v11, Drizzle ORM
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

function ExportButton({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-lg border border-border-default bg-bg-primary/50 text-text-muted hover:text-text-secondary hover:border-border-default transition-colors">
      <Download className="h-2.5 w-2.5" />
      {label}
    </button>
  );
}
