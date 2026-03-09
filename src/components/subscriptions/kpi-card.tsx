export function KPICard({
  label,
  value,
  sublabel,
  icon,
  color,
}: {
  label: string;
  value: string;
  sublabel: string;
  icon?: React.ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-border-default bg-bg-secondary p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon ? (
          <div
            className="flex h-6 w-6 items-center justify-center rounded-md"
            style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`, color }}
          >
            {icon}
          </div>
        ) : (
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        )}
        <span className="text-[10px] text-text-muted uppercase tracking-wider">{label}</span>
      </div>
      <p className="font-data text-xl font-bold text-text-primary">{value}</p>
      <p className="text-[10px] text-text-tertiary mt-0.5">{sublabel}</p>
    </div>
  );
}
