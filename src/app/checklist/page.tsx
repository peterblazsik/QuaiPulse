import { CheckSquare } from "lucide-react";

export default function ChecklistPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <CheckSquare className="h-12 w-12 text-accent-primary" />
      <h2 className="mt-4 font-display text-2xl font-semibold text-text-primary">
        Move Checklist
      </h2>
      <p className="mt-2 max-w-md text-sm text-text-tertiary">
        Timeline view, dossier tracker, and progress ring.
        Coming in Phase 6.
      </p>
    </div>
  );
}
