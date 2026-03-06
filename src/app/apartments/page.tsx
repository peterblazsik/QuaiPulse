import { Building2 } from "lucide-react";

export default function ApartmentsPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <Building2 className="h-12 w-12 text-accent-primary" />
      <h2 className="mt-4 font-display text-2xl font-semibold text-text-primary">
        Apartment Listings
      </h2>
      <p className="mt-2 max-w-md text-sm text-text-tertiary">
        Portal links, manual entry, scoring engine, and pipeline tracking.
        Coming in Phase 7.
      </p>
    </div>
  );
}
