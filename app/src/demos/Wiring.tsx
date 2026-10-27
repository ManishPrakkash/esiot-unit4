export type Wire = { from: string; to: string; color: string; note?: string };

/** Pin-to-pin wiring diagram: board on the left, module on the right, coloured wires between. */
export function Wiring({ left, right, wires, height }: { left: string; right: string; wires: Wire[]; height?: number }) {
  const gap = 78;
  const h = height ?? wires.length * gap + 110;
  const y0 = 112;
  const ink = "var(--color-ink)";
  return (
    <svg viewBox={`0 0 1000 ${h}`} className="w-full">
      <rect x="18" y="18" width="270" height={h - 24} fill={ink} />
      <rect x="10" y="10" width="270" height={h - 24} fill="#fff" stroke={ink} strokeWidth="4" />
      <rect x="10" y="10" width="270" height="62" fill="var(--color-accent)" stroke={ink} strokeWidth="4" />
      <text x="145" y="52" textAnchor="middle" fontSize="30" fontWeight="800" fill="#fff" fontFamily="var(--font-display)">{left}</text>
      <rect x="728" y="18" width="270" height={h - 24} fill={ink} />
      <rect x="720" y="10" width="270" height={h - 24} fill="var(--color-pop-soft)" stroke={ink} strokeWidth="4" />
      <rect x="720" y="10" width="270" height="62" fill="var(--color-pop)" stroke={ink} strokeWidth="4" />
      <text x="855" y="52" textAnchor="middle" fontSize="30" fontWeight="800" fill={ink} fontFamily="var(--font-display)">{right}</text>
      {wires.map((w, i) => {
        const y = y0 + i * gap;
        const d = `M280 ${y} C 430 ${y}, 570 ${y}, 720 ${y}`;
        return (
          <g key={i}>
            <path d={d} stroke={ink} strokeWidth="17" fill="none" strokeLinecap="round" />
            <path d={d} stroke={w.color} strokeWidth="9" fill="none" strokeLinecap="round" />
            <circle cx="280" cy={y} r="12" fill="#fff" stroke={ink} strokeWidth="4" /><circle cx="720" cy={y} r="12" fill="#fff" stroke={ink} strokeWidth="4" />
            <text x="258" y={y + 10} textAnchor="end" fontSize="28" fontWeight="700" fontFamily="var(--font-mono)" fill={ink}>{w.from}</text>
            <text x="744" y={y + 10} fontSize="28" fontWeight="700" fontFamily="var(--font-mono)" fill={ink}>{w.to}</text>
            {w.note && <text x="500" y={y - 20} textAnchor="middle" fontSize="22" fontWeight="600" fill="var(--color-mute)">{w.note}</text>}
          </g>
        );
      })}
    </svg>
  );
}
