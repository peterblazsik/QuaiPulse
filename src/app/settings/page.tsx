import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <Settings className="h-12 w-12 text-accent-primary" />
      <h2 className="mt-4 font-display text-2xl font-semibold text-text-primary">
        Settings
      </h2>
      <p className="mt-2 max-w-md text-sm text-text-tertiary">
        Profile, preferences, API keys, and data management.
      </p>
    </div>
  );
}
