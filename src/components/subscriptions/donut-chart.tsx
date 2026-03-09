import { formatEUR } from "@/lib/utils";

export function DonutChart({
  data,
}: {
  data: { category: string; amount: number; color: string; label: string }[];
}) {
  const total = data.reduce((sum, d) => sum + d.amount, 0);
  const size = 160;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  let accumulated = 0;
  const segments = data.map((d) => {
    const pct = d.amount / total;
    const offset = accumulated;
    accumulated += pct;
    return { ...d, pct, offset };
  });

  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {segments.map((seg) => (
          <circle
            key={seg.category}
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${seg.pct * circumference} ${circumference}`}
            strokeDashoffset={-seg.offset * circumference}
            transform={`rotate(-90 ${cx} ${cy})`}
            className="transition-all duration-300"
          />
        ))}
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          className="fill-text-primary font-data text-lg font-bold"
          style={{ fontSize: "18px" }}
        >
          {formatEUR(total)}
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          className="fill-text-muted"
          style={{ fontSize: "10px" }}
        >
          /month
        </text>
      </svg>
    </div>
  );
}
