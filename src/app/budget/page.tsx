import { Wallet } from "lucide-react";

export default function BudgetPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <Wallet className="h-12 w-12 text-accent-primary" />
      <h2 className="mt-4 font-display text-2xl font-semibold text-text-primary">
        Budget Simulator
      </h2>
      <p className="mt-2 max-w-md text-sm text-text-tertiary">
        Interactive sliders, what-if scenarios, and Amsterdam comparison.
        Coming in Phase 2.
      </p>
    </div>
  );
}
