import { formatCHF } from "@/lib/utils";

interface RentCardProps {
  label: string;
  min: number;
  max: number;
  highlight?: boolean;
}

export function RentCard({ label, min, max, highlight = false }: RentCardProps) {
  return (
    <div
      className={`rounded-lg p-4 text-center ${
        highlight
          ? "border-2 border-accent-primary/30 bg-accent-primary/5"
          : "border border-border-subtle bg-bg-secondary/50"
      }`}
    >
      <p className="text-[10px] uppercase tracking-wider text-text-muted">
        {label}
      </p>
      <p className="font-data text-lg font-semibold text-text-primary mt-1">
        {formatCHF(min)} - {formatCHF(max)}
      </p>
      {highlight && (
        <p className="text-[10px] text-accent-primary mt-1">Target range</p>
      )}
    </div>
  );
}
