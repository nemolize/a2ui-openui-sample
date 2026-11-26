// One chart view both libraries draw: bars are <rect data-bar> so a check can count them.
export function BarChartView({ title, labels, values }: { title?: string; labels?: string[]; values?: number[] }) {
  const ls = labels ?? [];
  const vs = values ?? [];
  const max = Math.max(1, ...vs);
  const w = 40;
  const gap = 12;
  const h = 120;
  return (
    <figure style={{ margin: 0 }}>
      {title ? <figcaption style={{ fontWeight: 600 }}>{title}</figcaption> : null}
      <svg width={ls.length * (w + gap) + gap} height={h + 24} role="img" aria-label={title}>
        {vs.map((v, i) => {
          const bh = Math.round((v / max) * h);
          return (
            <g key={i}>
              <rect data-bar="" x={gap + i * (w + gap)} y={h - bh} width={w} height={bh} fill="#4f7cff" />
              <text x={gap + i * (w + gap) + w / 2} y={h + 16} textAnchor="middle" fontSize="12">
                {ls[i] ?? ""}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
