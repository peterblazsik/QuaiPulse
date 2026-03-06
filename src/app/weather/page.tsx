import { CloudSun } from "lucide-react";

export default function WeatherPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <CloudSun className="h-12 w-12 text-accent-primary" />
      <h2 className="mt-4 font-display text-2xl font-semibold text-text-primary">
        Weather
      </h2>
      <p className="mt-2 max-w-md text-sm text-text-tertiary">
        Zurich weather with Vienna comparison for visit planning.
        Coming in Phase 3.
      </p>
    </div>
  );
}
