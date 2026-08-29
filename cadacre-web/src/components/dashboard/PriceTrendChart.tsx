"use client";

export function PriceTrendChart({
  history,
  valueLabel = "Median house price",
}: {
  history: { year: number; value: number }[];
  valueLabel?: string;
}) {
  if (history.length < 2) {
    return (
      <p className="mt-2 text-xs text-charcoal/50">
        Not enough public data to show a trend.
      </p>
    );
  }

  const width = 280;
  const height = 64;
  const padding = 4;
  const values = history.map((h) => h.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = history.map((h, i) => {
    const x = padding + (i / (history.length - 1)) * (width - padding * 2);
    const y = height - padding - ((h.value - min) / range) * (height - padding * 2);
    return { x, y, ...h };
  });

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const first = history[0];
  const last = history[history.length - 1];
  const change = ((last.value - first.value) / first.value) * 100;

  return (
    <div className="mt-2">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label={`${valueLabel} trend`}>
        <path d={path} fill="none" stroke="var(--survey-brass)" strokeWidth={1.5} />
        {points.map((p) => (
          <circle key={p.year} cx={p.x} cy={p.y} r={2} fill="var(--survey-brass)" />
        ))}
      </svg>
      <div className="mt-1 flex items-center justify-between font-mono-figure text-[10px] text-charcoal/50">
        <span>
          {first.year}: ${first.value.toLocaleString("en-AU")}
        </span>
        <span className={change >= 0 ? "text-deep-forest" : "text-red-700"}>
          {change >= 0 ? "+" : ""}
          {change.toFixed(0)}%
        </span>
        <span>
          {last.year}: ${last.value.toLocaleString("en-AU")}
        </span>
      </div>
    </div>
  );
}
