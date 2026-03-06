import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-data text-6xl font-bold text-accent-primary">404</p>
      <p className="mt-4 font-display text-xl text-text-primary">
        Signal Lost
      </p>
      <p className="mt-2 text-sm text-text-tertiary">
        This route doesn&apos;t exist in the QuaiPulse network.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-accent-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
