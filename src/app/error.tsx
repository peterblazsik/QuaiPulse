"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
      <div className="h-12 w-12 rounded-xl bg-danger/10 flex items-center justify-center">
        <AlertTriangle className="h-6 w-6 text-danger" />
      </div>
      <h2 className="font-display text-lg font-semibold text-text-primary">
        Something went wrong
      </h2>
      <p className="text-sm text-text-tertiary text-center max-w-md">
        An unexpected error occurred. This has been logged. You can try again or
        navigate to another page.
      </p>
      <button
        onClick={reset}
        className="flex items-center gap-2 rounded-lg bg-accent-primary px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
      >
        <RotateCcw className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}
