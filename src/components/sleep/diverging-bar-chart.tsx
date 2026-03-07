"use client";

interface DivergingBarChartData {
  id: string;
  name: string;
  delta: number;
  countWith: number;
  avgWith: number;
}

export function DivergingBarChart({ data }: { data: DivergingBarChartData[] }) {
  if (data.length === 0) return null;

  const padLeft = 80;
  const padRight = 12;
  const padTop = 6;
  const padBottom = 6;
  const rowH = 22;
  const svgW = 500;
  const svgH = padTop + data.length * rowH + padBottom;

  const plotW = svgW - padLeft - padRight;
  const centerX = padLeft + plotW / 2;

  const maxDelta = Math.max(...data.map((d) => Math.abs(d.delta)), 0.1);
  const halfW = plotW / 2;
  const barScale = (delta: number) => (delta / maxDelta) * halfW;

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto">
      <defs>
        <linearGradient id="divBarPos" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <linearGradient id="divBarNeg" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>

      <line x1={centerX} y1={padTop} x2={centerX} y2={svgH - padBottom}
        stroke="#475569" strokeWidth="1" />

      {data.map((d, i) => {
        const y = padTop + i * rowH;
        const cy = y + rowH / 2;
        const bw = Math.abs(barScale(d.delta));
        const isPositive = d.delta >= 0;
        const lowConfidence = d.countWith < 5;
        const opacity = lowConfidence ? 0.5 : 1;

        const barX = isPositive ? centerX : centerX - bw;
        const labelX = isPositive ? centerX + bw + 4 : centerX - bw - 4;
        const labelAnchor = isPositive ? "start" : "end";

        return (
          <g key={d.id} opacity={opacity}>
            <text x={padLeft - 4} y={cy} textAnchor="end" dominantBaseline="central"
              fontSize="11" fill="#94a3b8">
              {d.name.length > 12 ? `${d.name.slice(0, 11)}...` : d.name}
            </text>
            <rect x={barX} y={y + 3} width={Math.max(bw, 1)} height={rowH - 6}
              rx="2.5" fill={isPositive ? "url(#divBarPos)" : "url(#divBarNeg)"} />
            <text x={labelX} y={cy} textAnchor={labelAnchor} dominantBaseline="central"
              className="font-data" fontSize="10" fill={isPositive ? "#22c55e" : "#ef4444"}>
              {d.delta >= 0 ? "+" : ""}{d.delta.toFixed(2)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
