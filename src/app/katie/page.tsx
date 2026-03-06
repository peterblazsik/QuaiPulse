import { Heart } from "lucide-react";

export default function KatiePage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <Heart className="h-12 w-12 text-accent-primary" />
      <h2 className="mt-4 font-display text-2xl font-semibold text-text-primary">
        Katie Visit Planner
      </h2>
      <p className="mt-2 max-w-md text-sm text-text-tertiary">
        Calendar, cost calculator, flight vs train comparison, and annual
        projections. Coming in Phase 4.
      </p>
    </div>
  );
}
