import { Highlight, themes } from "prism-react-renderer";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Lightbulb, AlertTriangle, GraduationCap, X } from "lucide-react";
import { createContext, useContext, useRef, useState, type ReactNode } from "react";

/** Per-slide counter so every Reveal gets a stagger delay in render order: one click, everything animates in. */
export const STILL = /audit|still/.test(location.search);
export const RevealScope = createContext<{ n: number }>({ n: 0 });

export function Reveal({ show = true, children, className = "" }: { show?: boolean; children: ReactNode; className?: string }) {
  const scope = useContext(RevealScope);
  const idx = useRef(-1);
  if (idx.current < 0) idx.current = scope.n++;
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 36, scale: 0.96 }}
      animate={show ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 36 }}
      transition={STILL ? { duration: 0 } : { duration: 0.5, delay: Math.min(idx.current * 0.1, 1.5) + 0.15, ease: [0.2, 0.9, 0.25, 1] }}>
      {children}
    </motion.div>
  );
}

export function Bullets({ items, step = Infinity, start = 0, size = "text-[40px]" }: { items: ReactNode[]; step?: number; start?: number; size?: string }) {
  return (
    <ul className={`space-y-5 ${size} leading-snug`}>
      {items.map((it, i) => (
        <Reveal key={i} show={step >= start + i}>
          <li className="flex gap-5">
            <span className="mt-[13px] h-[18px] w-[18px] shrink-0 rotate-45 border-2 border-ink bg-pop" />
            <span>{it}</span>
          </li>
        </Reveal>
      ))}
    </ul>
  );
}

type Tone = "accent" | "warm" | "sky" | "hot";
const soft: Record<Tone, string> = { accent: "bg-accent-soft", warm: "bg-warm-soft", sky: "bg-sky-soft", hot: "bg-hot-soft" };
const txt: Record<Tone, string> = { accent: "text-accent", warm: "text-warm", sky: "text-sky", hot: "text-hot" };
const solid: Record<Tone, string> = { accent: "bg-accent", warm: "bg-warm", sky: "bg-sky", hot: "bg-hot" };

export function Card({ title, children, tone = "accent", className = "" }: { title?: ReactNode; children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <div className={`hard border-2 border-ink ${soft[tone]} p-8 ${className}`}>
      {title && <div className={`display mb-3 text-[34px] font-extrabold leading-tight ${txt[tone]}`}>{title}</div>}
      <div className="text-[28px] leading-snug text-ink">{children}</div>
    </div>
  );
}

export function Callout({ kind = "tip", children }: { kind?: "tip" | "warn" | "exam"; children: ReactNode }) {
  const m = {
    tip: { i: <Lightbulb size={36} />, bg: "bg-pop-soft", l: "Key idea" },
    warn: { i: <AlertTriangle size={36} />, bg: "bg-warm-soft", l: "Watch out" },
    exam: { i: <GraduationCap size={36} />, bg: "bg-accent-soft", l: "Remember" },
  }[kind];
  return (
    <div className={`hard-sm flex items-start gap-5 border-2 border-ink ${m.bg} p-6`}>
      <div className="mt-1 flex h-14 w-14 shrink-0 items-center justify-center border-2 border-ink bg-white">{m.i}</div>
      <div>
        <div className="display text-[22px] font-extrabold uppercase tracking-widest">{m.l}</div>
        <div className="text-[28px] leading-snug">{children}</div>
      </div>
    </div>
  );
}

export function CodeBlock({ code, title = "sketch.ino", size = 26 }: { code: string; title?: string; size?: number }) {
  const [ok, setOk] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(code).then(() => { setOk(true); setTimeout(() => setOk(false), 1500); }, () => {}); };
  return (
    <div className="hard overflow-hidden border-2 border-ink bg-[#14142a]">
      <div className="flex items-center justify-between border-b-2 border-ink bg-pop px-6 py-2">
        <span className="font-mono text-[22px] font-bold text-ink">{title}</span>
        <button onClick={copy} className="press flex items-center gap-2 border-2 border-ink bg-white px-3 py-0.5 text-[20px] font-bold text-ink">
          {ok ? <Check size={20} /> : <Copy size={20} />} {ok ? "Copied" : "Copy"}
        </button>
      </div>
      <Highlight theme={themes.vsDark} code={code.trim()} language="cpp">
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className="m-0 p-6 font-mono leading-relaxed" style={{ fontSize: size, background: "transparent" }}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((t, k) => <span key={k} {...getTokenProps({ token: t })} />)}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}

export function Table({ head, rows, size = "text-[26px]", hi }: { head: string[]; rows: ReactNode[][]; size?: string; hi?: number }) {
  return (
    <div className="hard-sm overflow-hidden border-2 border-ink">
      <table className={`w-full border-collapse ${size}`}>
        <thead>
          <tr className="bg-ink text-bg">{head.map((h) => <th key={h} className="display px-6 py-3 text-left font-bold">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={`border-t-2 border-ink ${hi === i ? "bg-pop-soft" : i % 2 ? "bg-panel2/60" : "bg-white"}`}>
              {r.map((c, j) => <td key={j} className={`px-6 py-3 ${j === 0 ? "font-bold" : ""}`}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const Mono = ({ children }: { children: ReactNode }) => <code className="border border-ink/40 bg-pop-soft px-2 py-0.5 font-mono text-[0.88em] font-semibold text-ink">{children}</code>;

/** Click an item on the left, see its detail on the right. */
export function MasterDetail({ items, cols = 1 }: { items: { icon?: ReactNode; title: string; tone?: Tone; detail: ReactNode }[]; cols?: number }) {
  const [sel, setSel] = useState(0);
  const it = items[sel];
  const tone = it.tone ?? "accent";
  return (
    <div className="grid grid-cols-[auto_1fr] gap-10">
      <div className={`grid gap-3 ${cols === 2 ? "grid-cols-2" : ""}`}>
        {items.map((x, i) => (
          <button key={x.title} onClick={() => setSel(i)}
            className={`press hard-sm flex items-center gap-4 border-2 border-ink px-5 py-3 text-left text-[28px] font-bold ${i === sel ? `${solid[x.tone ?? "accent"]} text-white` : "bg-white text-ink"}`}>
            {x.icon}<span className={cols === 2 ? "text-[24px]" : ""}>{x.title}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={sel} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
          className={`hard border-2 border-ink ${soft[tone]} p-10`}>
          <div className={`display mb-5 text-[48px] font-extrabold leading-tight ${txt[tone]}`}>{it.title}</div>
          <div className="text-[32px] leading-snug">{it.detail}</div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** Click an answer. Right = green, wrong = red and the right one is revealed. */
export function QuizCard({ q, opts, a, why }: { q: string; opts: string[]; a: number; why: string }) {
  const [pick, setPick] = useState<number | null>(null);
  return (
    <div>
      <p className="mb-8 text-[40px] font-semibold leading-snug">{q}</p>
      <div className="grid grid-cols-2 gap-5">
        {opts.map((o, i) => {
          const done = pick !== null;
          const cls = !done ? "bg-white" : i === a ? "bg-sky-soft" : i === pick ? "bg-hot-soft" : "bg-white opacity-60";
          return (
            <button key={i} disabled={done} onClick={() => setPick(i)} className={`press hard-sm flex items-center gap-5 border-2 border-ink p-6 text-left text-[30px] ${cls}`}>
              <span className="display flex h-12 w-12 shrink-0 items-center justify-center border-2 border-ink bg-pop text-[26px] font-extrabold">{"ABCD"[i]}</span>
              <span className="flex-1">{o}</span>
              {done && i === a && <Check size={40} className="text-sky" />}
              {done && i === pick && i !== a && <X size={40} className="text-hot" />}
            </button>
          );
        })}
      </div>
      <div className="mt-8 min-h-[130px]">
        {pick !== null && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><Callout kind={pick === a ? "tip" : "warn"}><b>{pick === a ? "Correct! " : `Not quite: the answer is ${"ABCD"[a]}. `}</b>{why}</Callout></motion.div>}
        {pick === null && <p className="text-[26px] text-mute">Tap an answer.</p>}
      </div>
    </div>
  );
}
