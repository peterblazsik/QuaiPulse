import { MapPin } from "lucide-react";

export default function NeighborhoodsPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <MapPin className="h-12 w-12 text-accent-primary" />
      <h2 className="mt-4 font-display text-2xl font-semibold text-text-primary">
        Neighborhood Intelligence
      </h2>
      <p className="mt-2 max-w-md text-sm text-text-tertiary">
        Weighted scoring engine with 8 dimensions, radar charts, and real-time
        re-ranking. Coming in Phase 1.
      </p>
    </div>
  );
}
