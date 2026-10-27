import { useEffect, useRef, useState } from "react";
import { clamp, deg, drag, rad } from "./drag";
import { Hint, Panel } from "./Demos";



/** 3D slab that rotates by roll/pitch/yaw (CSS 3D). */
function Box({ roll, pitch, yaw, label }: { roll: number; pitch: number; yaw: number; label?: string }) {
  const faces: [string, string, string][] = [
    ["translateZ(70px)", "var(--color-accent)", label ?? "TOP"],
    ["rotateY(180deg) translateZ(70px)", "var(--color-sky)", ""],
    ["rotateY(90deg) translateZ(110px)", "var(--color-warm)", ""],
    ["rotateY(-90deg) translateZ(110px)", "var(--color-warm)", ""],
    ["rotateX(90deg) translateZ(20px)", "var(--color-pop)", "Z↑"],
    ["rotateX(-90deg) translateZ(20px)", "var(--color-hot)", ""],
  ];
  return (
    <div className="pointer-events-none flex h-[440px] scale-[1.3] items-center justify-center" style={{ perspective: 900 }}>
      <div style={{ width: 220, height: 40, position: "relative", transformStyle: "preserve-3d", transform: `rotateX(${-pitch}deg) rotateZ(${roll}deg) rotateY(${yaw}deg) rotateX(-20deg) rotateY(-25deg)` }}>
        {faces.map(([t, c, l], i) => (
          <div key={i} className="absolute flex items-center justify-center font-mono text-[24px] font-extrabold text-white"
            style={{ transform: t, background: c, border: "3px solid #1b1b2f", color: c === "var(--color-pop)" ? "#1b1b2f" : "#fff", ...(i < 2 ? { width: 220, height: 40 } : i < 4 ? { width: 140, height: 40, left: 40 } : { width: 220, height: 140, top: -50 }) }}>{l}</div>
        ))}
      </div>
    </div>
  );
}

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-baseline justify-between border-b-2 border-ink/15 py-2 last:border-0"><span className="text-[26px] text-mute">{label}</span><span className="font-mono text-[32px] font-bold">{children}</span></div>
);

/** ADXL335: drag the board to tilt it; g -> voltage -> ADC -> roll recovered. */
export function AccelDemo() {
  const [roll, setRoll] = useState(30);
  const [pitch, setPitch] = useState(0);
  const r = rad(roll), p = rad(pitch);
  const g = { x: -Math.sin(p), y: Math.sin(r) * Math.cos(p), z: Math.cos(r) * Math.cos(p) };
  const v = (x: number) => 1.65 + 0.33 * x;
  const adc = (x: number) => Math.round((v(x) / 5) * 1024);
  const rollOut = deg(Math.atan2(g.y, g.z));
  return (
    <div className="grid grid-cols-[1fr_1.2fr] gap-10">
      <Panel className="relative !p-0">
        <div className="relative h-[560px] overflow-hidden bg-pop-soft"
          {...drag((e) => { if (e.type === "pointermove") { setRoll((v) => clamp(v + e.movementX * 0.6, -90, 90)); setPitch((v) => clamp(v - e.movementY * 0.6, -90, 90)); } })}>
          <div className="pt-16"><Box roll={roll} pitch={pitch} yaw={0} /></div>
          <div className="absolute inset-x-0 bottom-4 text-center"><Hint>Drag the board to tilt it</Hint></div>
        </div>
      </Panel>
      <div className="space-y-5">
        <div className="hard-sm overflow-hidden border-2 border-ink">
          <table className="w-full text-[28px]">
            <thead><tr className="bg-ink text-bg">{["Axis", "g", "Voltage", "ADC"].map((h) => <th key={h} className="display px-5 py-3 text-left">{h}</th>)}</tr></thead>
            <tbody className="bg-white font-mono">
              {(["x", "y", "z"] as const).map((a) => (
                <tr key={a} className="border-t-2 border-ink"><td className="px-5 py-3 font-extrabold text-warm">{a.toUpperCase()}</td><td className="px-5 py-3">{g[a].toFixed(2)}</td><td className="px-5 py-3">{v(g[a]).toFixed(2)} V</td><td className="px-5 py-3">{adc(g[a])}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <Panel>
          <Row label="Roll (tilt)">{roll.toFixed(0)}°</Row>
          <Row label="Pitch (tilt)">{pitch.toFixed(0)}°</Row>
          <div className="mt-2 font-mono text-[26px] text-mute">g = (V − 1.65) / 0.330</div>
          <div className="font-mono text-[28px]">roll = atan2(ay, az) = <b className="text-accent">{rollOut.toFixed(1)}°</b></div>
        </Panel>
      </div>
    </div>
  );
}

const hsl = (h: number, l: number): [number, number, number] => {
  const s = 1, a = s * Math.min(l, 1 - l);
  const f = (n: number) => { const k = (n + h / 30) % 12; return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))); };
  return [f(0), f(8), f(4)];
};

/** TCS230: pick a colour on the pad (or a preset); see the three filter pulse widths and mapped RGB. */
export function ColorDemo() {
  const [pt, setPt] = useState({ x: 0.0, y: 0.45 });
  const [exact, setExact] = useState<[number, number, number] | null>(null);
  const rgb = exact ?? hsl(pt.x * 360, 1 - pt.y); // top of the pad = white, bottom = black
  const names = ["Red", "Green", "Blue"], cols = ["#d93025", "#12a150", "#2f3cf0"];
  const pw = (c: number) => Math.round(300 - (c / 255) * 270); // µs: bright -> short pulse
  const filt = [["LOW", "LOW"], ["HIGH", "HIGH"], ["LOW", "HIGH"]];
  const preset = (r: number, g: number, b: number) => {
    // find the pad point closest to this colour (hue from rgb)
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    let h = 0;
    if (d) h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
    setExact([r, g, b]);
    setPt({ x: h / 360, y: 1 - (mx + mn) / 510 });
  };
  const padMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const b = e.currentTarget.getBoundingClientRect();
    setExact(null);
    setPt({ x: clamp((e.clientX - b.left) / b.width, 0, 1), y: clamp((e.clientY - b.top) / b.height, 0, 1) });
  };
  return (
    <div className="grid grid-cols-[1fr_1.25fr] gap-10">
      <div className="space-y-5">
        <div className="relative h-[340px] border-2 border-ink hard" {...drag(padMove)}
          style={{ background: "linear-gradient(to bottom, rgb(255,255,255), rgba(255,255,255,0) 50%, rgba(0,0,0,0) 50%, rgb(0,0,0)), linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)" }}>
          <div className="pointer-events-none absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-ink" style={{ left: `${pt.x * 100}%`, top: `${pt.y * 100}%`, background: `rgb(${rgb.join(",")})`, boxShadow: "0 0 0 3px #fff" }} />
        </div>
        <Hint>Drag on the pad to choose a colour</Hint>
        <div className="grid grid-cols-6 gap-3">
          {([[220, 40, 40], [30, 170, 70], [50, 70, 230], [250, 215, 30], [255, 255, 255], [0, 0, 0]] as [number, number, number][]).map((c, i) => <button key={i} onClick={() => preset(...c)} className="press hard-sm h-16 border-2 border-ink" style={{ background: `rgb(${c.join(",")})` }} aria-label="preset colour" />)}
        </div>
      </div>
      <div className="space-y-5">
        <div className="flex items-center gap-6">
          <div className="hard h-28 w-40 border-2 border-ink" style={{ background: `rgb(${rgb.join(",")})` }} />
          <div className="font-mono text-[34px] font-bold">rgb({rgb.join(", ")})</div>
        </div>
        <div className="hard-sm overflow-hidden border-2 border-ink">
          <table className="w-full text-[26px]">
            <thead><tr className="bg-ink text-bg">{["Filter", "S2", "S3", "pulseIn µs", "map → 0–255"].map((h) => <th key={h} className="display px-4 py-3 text-left">{h}</th>)}</tr></thead>
            <tbody className="bg-white font-mono">
              {names.map((n, k) => (
                <tr key={n} className="border-t-2 border-ink"><td className="px-4 py-3 font-extrabold" style={{ color: cols[k] }}>{n}</td><td className="px-4 py-3">{filt[k][0]}</td><td className="px-4 py-3">{filt[k][1]}</td><td className="px-4 py-3">{pw(rgb[k])}</td><td className="px-4 py-3">{rgb[k]}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <Panel className="space-y-3">
          {names.map((n, k) => <div key={n} className="flex items-center gap-4"><span className="w-24 text-[26px] font-bold">{n}</span><div className="h-7 flex-1 border-2 border-ink bg-panel2"><div className="h-full" style={{ width: `${(rgb[k] / 255) * 100}%`, background: cols[k] }} /></div></div>)}
        </Panel>
        <p className="text-[24px] text-mute">More of a colour reflected → higher frequency → <b>shorter</b> pulse.</p>
      </div>
    </div>
  );
}

/** Gyro: drag the slab sideways to spin it; yaw angle is the integral of the measured rate. Bias makes it drift. */
export function GyroDemo() {
  const [angle, setAngle] = useState(0);
  const [rate, setRate] = useState(0);
  const [bias, setBias] = useState(0);
  const st = useRef({ rate: 0, bias: 0, lastMove: 0 });
  st.current.bias = bias;
  useEffect(() => {
    let last = performance.now(), id = 0;
    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05); last = t;
      const s = st.current;
      if (t - s.lastMove > 90) s.rate *= 0.93; // settles when you stop dragging
      if (Math.abs(s.rate) < 0.5) s.rate = 0;
      setRate(Math.round(s.rate));
      setAngle((a) => (a + (s.rate + s.bias) * dt) % 360);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);
  const spin = (e: React.PointerEvent) => {
    if (e.type !== "pointermove") return;
    st.current.rate = clamp(e.movementX * 18, -500, 500);
    st.current.lastMove = performance.now();
  };
  return (
    <div className="grid grid-cols-[1.2fr_1fr] gap-10">
      <Panel className="!p-0">
        <div className="relative h-[560px] overflow-hidden bg-sky-soft" {...drag(spin)}>
          <div className="pt-16"><Box roll={0} pitch={0} yaw={angle} label="MPU" /></div>
          <div className="absolute inset-x-0 bottom-4 text-center"><Hint>Drag sideways to spin it</Hint></div>
        </div>
      </Panel>
      <div className="space-y-5">
        <Panel>
          <Row label="gz (rate)">{rate} °/s</Row>
          <Row label="angle += gz × dt">{angle.toFixed(1)}°</Row>
        </Panel>
        <Panel>
          <div className="mb-3 text-[26px] font-bold">Sensor bias (a tiny constant error)</div>
          <div className="flex gap-3">{[0, 3, 8].map((b) => <button key={b} onClick={() => setBias(b)} className={`press hard-sm flex-1 border-2 border-ink py-3 text-[28px] font-extrabold ${bias === b ? "bg-pop" : "bg-white"}`}>{b === 0 ? "none" : `+${b} °/s`}</button>)}</div>
          <p className="mt-4 text-[24px] text-mute">Pick a bias, then let go: the cube keeps creeping. That is <b className="text-warm">gyro drift</b>.</p>
        </Panel>
        <button onClick={() => { st.current.rate = 0; setAngle(0); }} className="press hard-sm w-full border-2 border-ink bg-white py-3 text-[28px] font-extrabold">Reset angle</button>
      </div>
    </div>
  );
}

