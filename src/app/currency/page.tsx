import { ArrowLeftRight } from "lucide-react";

export default function CurrencyPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <ArrowLeftRight className="h-12 w-12 text-accent-primary" />
      <h2 className="mt-4 font-display text-2xl font-semibold text-text-primary">
        Currency Dashboard
      </h2>
      <p className="mt-2 max-w-md text-sm text-text-tertiary">
        CHF/EUR/HUF rates, trends, converter, and budget impact.
        Coming in Phase 9.
      </p>
    </div>
  );
}
