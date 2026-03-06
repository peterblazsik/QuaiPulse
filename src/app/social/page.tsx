import { Users } from "lucide-react";

export default function SocialPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <Users className="h-12 w-12 text-accent-primary" />
      <h2 className="mt-4 font-display text-2xl font-semibold text-text-primary">
        Social Infrastructure Map
      </h2>
      <p className="mt-2 max-w-md text-sm text-text-tertiary">
        Interactive MapLibre map with gyms, chess clubs, AI meetups, swimming,
        and social spots. Coming in Phase 5.
      </p>
    </div>
  );
}
