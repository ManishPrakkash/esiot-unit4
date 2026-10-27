import { useState, type ReactNode } from "react";
import { clamp, deg, drag, knobAngle, svgPt } from "./drag";

const INK = "var(--color-ink)";
export const Panel = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`hard border-2 border-ink bg-white p-6 ${className}`}>{children}</div>
);
export const Hint = ({ children }: { children: ReactNode }) => (
  <div className="mt-3 inline-block border-2 border-ink bg-pop px-4 py-1 text-[24px] font-extrabold">☝ {children}</div>
);
const Stat = ({ label, value, tone = "text-accent" }: { label: string; value: ReactNode; tone?: string }) => (
  <div className="flex items-baseline justify-between border-b-2 border-ink/15 py-2 last:border-0"><span className="text-[26px] text-mute">{label}</span><span className={`font-mono text-[34px] font-bold ${tone}`}>{value}</span></div>
);
const Chips = ({ values, cur, set, fmt }: { values: number[]; cur: number; set: (v: number) => void; fmt: (v: number) => string }) => (
  <div className="flex gap-3">{values.map((v) => <button key={v} onClick={() => set(v)} className={`press hard-sm flex-1 border-2 border-ink py-3 text-[28px] font-extrabold ${cur === v ? "bg-pop" : "bg-white"}`}>{fmt(v)}</button>)}</div>
);

/** PWM: drag the falling edge of the wave; average voltage + LED follow. */
export function PwmDemo() {
  const [duty, setDuty] = useState(50);
  const value = Math.round((duty / 100) * 255);
  const volts = ((duty / 100) * 5).toFixed(2);
  const X0 = 60, T = 200, cycles = 4, hiY = 60, loY = 210;
  const hi = (T * duty) / 100;
  const yAvg = loY - (loY - hiY) * (duty / 100);
  let d = `M${X0} ${loY}`;
  for (let c = 0; c < cycles; c++) {
    const x = X0 + c * T;
    d += duty === 0 ? ` L${x + T} ${loY}` : duty === 100 ? ` L${x} ${hiY} L${x + T} ${hiY}` : ` L${x} ${hiY} L${x + hi} ${hiY} L${x + hi} ${loY} L${x + T} ${loY}`;
  }
  const move = (e: React.PointerEvent<SVGSVGElement>) => setDuty(clamp(Math.round((((svgPt(e, e.currentTarget).x - X0) / T) * 100) / 5) * 5, 0, 100));
  return (
    <div className="grid grid-cols-[1.6fr_1fr] gap-10">
      <Panel>
        <svg viewBox="0 0 880 270" className="w-full" {...drag(move)}>
          <line x1={X0} x2={X0 + T * cycles} y1={hiY} y2={hiY} stroke={INK} strokeOpacity=".25" strokeDasharray="6" />
          <line x1={X0} x2={X0 + T * cycles} y1={yAvg} y2={yAvg} stroke="var(--color-warm)" strokeWidth="5" strokeDasharray="14 8" />
          <path d={d} fill="none" stroke={INK} strokeWidth="9" strokeLinejoin="round" />
          <path d={d} fill="none" stroke="var(--color-accent)" strokeWidth="5" strokeLinejoin="round" />
          <text x="8" y={hiY + 8} fontSize="24" fontWeight="700" fill={INK}>5 V</text>
          <text x="8" y={loY + 8} fontSize="24" fontWeight="700" fill={INK}>0 V</text>
          <g transform={`translate(${X0 + hi} ${(hiY + loY) / 2})`}>
            <circle r="30" fill="var(--color-pop)" stroke={INK} strokeWidth="5" /><text textAnchor="middle" y="9" fontSize="28" fontWeight="800" fill={INK}>↔</text>
          </g>
          <text x={X0 + T / 2} y="258" textAnchor="middle" fontSize="22" fill="var(--color-mute)">one period</text>
          <path d={`M${X0} 240 H${X0 + T}`} stroke={INK} strokeWidth="2" />
        </svg>
        <div className="mt-2 flex items-center gap-8">
          <div className="h-24 w-24 rounded-full border-4 border-ink" style={{ background: `rgba(255,210,63,${0.1 + 0.9 * (duty / 100)})`, boxShadow: `0 0 ${duty * 0.9}px rgba(255,170,0,${duty / 110})` }} />
          <div className="text-[30px]">LED brightness follows the <b className="text-warm">average</b> (orange dashed line)</div>
        </div>
      </Panel>
      <div className="space-y-6">
        <Hint>Drag the wave edge left / right</Hint>
        <Panel>
          <div className="font-mono text-[32px]"><span className="text-mute">analogWrite(9, </span><b className="text-accent">{value}</b><span className="text-mute">);</span></div>
          <Stat label="Duty cycle" value={`${duty}%`} />
          <Stat label="Vavg = duty × 5 V" value={`${volts} V`} tone="text-warm" />
        </Panel>
        <Chips values={[0, 25, 50, 75, 100]} cur={duty} set={setDuty} fmt={(v) => `${v}%`} />
      </div>
    </div>
  );
}

/** IR obstacle sensor: drag the object toward the sensor; output is active LOW. */
export function IrDemo() {
  const [x, setX] = useState(620);
  const sensorX = 190;
  const dist = Math.round(((x - 40 - sensorX) / (760 - 40 - sensorX)) * 38 + 2);
  const detected = dist <= 10;
  const move = (e: React.PointerEvent<SVGSVGElement>) => setX(clamp(svgPt(e, e.currentTarget).x, sensorX + 60, 760));
  return (
    <div className="grid grid-cols-[1.6fr_1fr] gap-10">
      <Panel>
        <svg viewBox="0 0 900 340" className="w-full" {...drag(move)}>
          <rect x="40" y="110" width="150" height="130" fill={INK} transform="translate(6 6)" />
          <rect x="40" y="110" width="150" height="130" fill="var(--color-accent)" stroke={INK} strokeWidth="5" />
          <text x="115" y="95" textAnchor="middle" fontSize="26" fontWeight="800" fill={INK}>IR module</text>
          <circle cx="170" cy="150" r="14" fill="var(--color-hot)" stroke={INK} strokeWidth="4" />
          <circle cx="170" cy="205" r="14" fill="#fff" stroke={INK} strokeWidth="4" />
          <text x="60" y="160" fontSize="22" fontWeight="700" fill="#fff">TX</text><text x="60" y="215" fontSize="22" fontWeight="700" fill="#fff">RX</text>
          <circle cx="110" cy="260" r="12" fill={detected ? "var(--color-pop)" : "#fff"} stroke={INK} strokeWidth="4" />
          <text x="132" y="268" fontSize="20" fontWeight="700" fill={INK}>LED</text>
          <path d={`M190 150 L${x} 150`} stroke="var(--color-hot)" strokeWidth="6" strokeDasharray="14 10" />
          {detected && <path d={`M${x} 205 L190 205`} stroke="var(--color-sky)" strokeWidth="6" strokeDasharray="14 10" />}
          <g transform={`translate(${x} 0)`}>
            <rect x="0" y="100" width="100" height="160" fill={INK} transform="translate(6 6)" />
            <rect x="0" y="100" width="100" height="160" fill={detected ? "var(--color-sky)" : "var(--color-warm)"} stroke={INK} strokeWidth="5" />
            <text x="50" y="190" textAnchor="middle" fontSize="26" fontWeight="800" fill="#fff">object</text>
            <text x="50" y="222" textAnchor="middle" fontSize="30" fill="#fff">↔</text>
          </g>
          <line x1="190" x2={x} y1="300" y2="300" stroke={INK} strokeWidth="4" /><text x={(190 + x) / 2} y="332" textAnchor="middle" fontSize="28" fontWeight="800" fill={INK}>{dist} cm</text>
        </svg>
      </Panel>
      <div className="space-y-6">
        <Hint>Drag the object toward the sensor</Hint>
        <Panel>
          <Stat label="OUT pin" value={detected ? "LOW (0)" : "HIGH (1)"} tone={detected ? "text-sky" : "text-warm"} />
          <Stat label="Module LED" value={detected ? "ON" : "OFF"} tone={detected ? "text-sky" : "text-mute"} />
          <Stat label="Status" value={detected ? "Obstacle!" : "Clear"} tone="text-ink" />
        </Panel>
        <p className="text-[26px] text-mute">Typical range 2–10 cm. The trimpot on the module sets the threshold.</p>
      </div>
    </div>
  );
}

/** Knob drawn at (cx,cy): ridged cap with a pointer, angle 0 = up, clockwise positive. */
export function Knob({ cx, cy, r, ang }: { cx: number; cy: number; r: number; ang: number }) {
  return (
    <g>
      {Array.from({ length: 11 }, (_, k) => {
        const a = ((-135 + (270 / 10) * k) * Math.PI) / 180;
        return <line key={k} x1={cx + Math.sin(a) * (r + 14)} y1={cy - Math.cos(a) * (r + 14)} x2={cx + Math.sin(a) * (r + 30)} y2={cy - Math.cos(a) * (r + 30)} stroke={INK} strokeWidth="5" />;
      })}
      <circle cx={cx} cy={cy} r={r} fill={INK} transform="translate(6 6)" />
      <circle cx={cx} cy={cy} r={r} fill="var(--color-accent)" stroke={INK} strokeWidth="5" />
      <g transform={`rotate(${ang} ${cx} ${cy})`}>
        <circle cx={cx} cy={cy} r={r * 0.72} fill="var(--color-accent-soft)" stroke={INK} strokeWidth="4" />
        <rect x={cx - 9} y={cy - r * 0.72 + 6} width="18" height={r * 0.5} fill={INK} />
      </g>
    </g>
  );
}

/** Potentiometer: turn the knob by dragging around it. */
export function PotDemo() {
  const [a, setA] = useState(0);
  const adc = Math.round(((a + 135) / 270) * 1023);
  const volts = ((adc * 5) / 1023).toFixed(2);
  const pwm = Math.round((adc * 255) / 1023);
  return (
    <div className="grid grid-cols-[auto_1fr] gap-10">
      <Panel className="flex flex-col items-center">
        <svg viewBox="0 0 400 400" className="w-[500px]" {...drag((e) => setA(knobAngle(e, e.currentTarget, 200, 200)))}>
          <Knob cx={200} cy={200} r={130} ang={a} />
          <text x="62" y="372" fontSize="26" fontWeight="800" fill={INK}>0 V</text>
          <text x="294" y="372" fontSize="26" fontWeight="800" fill={INK}>5 V</text>
        </svg>
        <Hint>Grab the knob and turn it</Hint>
      </Panel>
      <div className="space-y-5">
        {[
          ["analogRead(A0)", String(adc), "0 – 1023 (10-bit ADC)", "text-accent"],
          ["Voltage at the wiper", `${volts} V`, "V = ADC × 5 / 1023", "text-warm"],
          ["map(adc, 0, 1023, 0, 255)", String(pwm), "ready for analogWrite()", "text-sky"],
        ].map(([t, v, c, col]) => (
          <Panel key={t} className="flex items-center justify-between !py-4">
            <div><div className="font-mono text-[28px] font-bold">{t}</div><div className="text-[22px] text-mute">{c}</div></div>
            <div className={`display text-[60px] font-extrabold ${col}`}>{v}</div>
          </Panel>
        ))}
        <div className="flex items-center gap-5"><div className="hard-sm h-10 flex-1 border-2 border-ink bg-white"><div className="h-full bg-pop" style={{ width: `${(pwm / 255) * 100}%` }} /></div><span className="text-[26px] font-bold">LED {Math.round((pwm / 255) * 100)}%</span></div>
      </div>
    </div>
  );
}

/** Servo: turn the pot knob (or drag the horn). Horn and knob turn the SAME way; 90° points straight up. */
export function ServoDemo() {
  const [th, setTh] = useState(90); // servo angle 0..180
  const knobA = -135 + (th / 180) * 270;
  const PX = 800, PY = 325, R = 190;
  const pos = (t: number, r: number) => [PX - Math.cos((t * Math.PI) / 180) * r, PY - Math.sin((t * Math.PI) / 180) * r];
  const [tx, ty] = pos(th, R);
  const pulse = 1 + th / 180;
  const hornMove = (e: React.PointerEvent<SVGElement>) => {
    const p = svgPt(e, (e.currentTarget as SVGGraphicsElement).ownerSVGElement!);
    let t = deg(Math.atan2(-(p.y - PY), -(p.x - PX)));
    if (t < 0) t = p.x < PX ? 0 : 180;
    setTh(Math.round(clamp(t, 0, 180)));
  };
  const knobMove = (e: React.PointerEvent<SVGElement>) => {
    const a = knobAngle(e as React.PointerEvent, (e.currentTarget as SVGGraphicsElement).ownerSVGElement!, 230, 230);
    setTh(Math.round(((a + 135) / 270) * 180));
  };
  const tp = (pulse / 20) * 600;
  return (
    <div className="space-y-4">
      <Panel className="!p-3">
        <svg viewBox="0 0 1100 560" className="h-[580px] w-full">
          {/* knob side */}
          <text x="230" y="60" textAnchor="middle" fontSize="30" fontWeight="800" fill={INK}>Potentiometer</text>
          <Knob cx={230} cy={230} r={110} ang={knobA} />
          <circle cx={230} cy={230} r={165} fill="transparent" {...drag(knobMove)} />
          <text x="200" y="400" fontSize="24" fontWeight="800" fill={INK}>0°</text><text x="290" y="400" fontSize="24" fontWeight="800" fill={INK}>180°</text>
          <path d="M400 240 H560" stroke={INK} strokeWidth="6" strokeDasharray="3 14" strokeLinecap="round" /><path d="M545 222 L575 240 L545 258" fill="none" stroke={INK} strokeWidth="6" />
          <text x="480" y="215" textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--color-mute)">map()</text>
          {/* servo side */}
          <text x={PX} y="40" textAnchor="middle" fontSize="30" fontWeight="800" fill={INK}>Servo</text>
          <path d={`M${PX - R} ${PY} A${R} ${R} 0 0 1 ${PX + R} ${PY}`} fill="none" stroke={INK} strokeWidth="5" strokeDasharray="3 10" strokeLinecap="round" />
          {[0, 45, 90, 135, 180].map((t) => {
            const [a, b] = pos(t, R - 12), [c, d] = pos(t, R + 14), [lx, ly] = pos(t, R + 48);
            return <g key={t}><line x1={a} y1={b} x2={c} y2={d} stroke={INK} strokeWidth={t === 90 ? 8 : 5} /><text x={lx} y={ly + 8} textAnchor="middle" fontSize={t === 90 ? 30 : 24} fontWeight="800" fill={t === 90 ? "var(--color-hot)" : INK}>{t}°</text></g>;
          })}
          <rect x={PX - 90} y={PY} width="180" height="120" fill={INK} transform="translate(6 6)" />
          <rect x={PX - 90} y={PY} width="180" height="120" fill="var(--color-warm)" stroke={INK} strokeWidth="5" />
          <rect x={PX - 125} y={PY + 45} width="250" height="26" fill="var(--color-warm)" stroke={INK} strokeWidth="5" />
          <text x={PX} y={PY + 95} textAnchor="middle" fontSize="26" fontWeight="800" fill="#fff">SG90</text>
          <line x1={PX} y1={PY} x2={tx} y2={ty} stroke={INK} strokeWidth="26" strokeLinecap="round" />
          <line x1={PX} y1={PY} x2={tx} y2={ty} stroke="var(--color-pop)" strokeWidth="14" strokeLinecap="round" />
          <circle cx={PX} cy={PY} r="22" fill="#fff" stroke={INK} strokeWidth="5" />
          <circle cx={tx} cy={ty} r="48" fill="transparent" {...drag(hornMove)} />
          {/* pulse trace */}
          <text x="130" y="470" fontSize="22" fontWeight="700" fill="var(--color-mute)">pulse (period 20 ms)</text>
          <path d={`M130 530 V490 H${130 + tp} V530 H730`} fill="none" stroke={INK} strokeWidth="9" /><path d={`M130 530 V490 H${130 + tp} V530 H730`} fill="none" stroke="var(--color-accent)" strokeWidth="5" />
          <text x={140 + tp} y="515" fontSize="28" fontWeight="800" fill="var(--color-accent)">{pulse.toFixed(2)} ms</text>
          <text x="880" y="520" fontSize="34" fontWeight="800" fontFamily="var(--font-mono)" fill={INK}>write({th})</text>
        </svg>
      </Panel>
      <Hint>Turn the knob (or drag the yellow horn): both turn clockwise together, 90° points straight up</Hint>
    </div>
  );
}
