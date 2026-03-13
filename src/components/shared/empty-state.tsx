import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  cta?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, cta }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-border-default bg-bg-secondary p-8 text-center">
      <Icon className="mx-auto h-10 w-10 text-text-muted/50" />
      <h3 className="mt-3 text-sm font-semibold text-text-secondary">{title}</h3>
      <p className="mt-1 text-xs text-text-muted max-w-sm mx-auto">{description}</p>
      {cta && (
        <button
          onClick={cta.onClick}
          className="mt-4 inline-flex items-center rounded-lg bg-accent-primary/15 border border-accent-primary/30 px-4 py-2 text-xs font-medium text-accent-primary hover:bg-accent-primary/25 transition-colors"
        >
          {cta.label}
        </button>
      )}
    </div>
  );
}
