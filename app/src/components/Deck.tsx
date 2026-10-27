import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize, Menu, X } from "lucide-react";
import type { Slide } from "../types";
import { RevealScope, STILL } from "./ui";

const W = 1920, H = 1080;
// [background, text colour on it]
const SECTION_COLORS: [string, string][] = [
  ["var(--color-accent)", "#fff"], ["var(--color-warm)", "#fff"], ["var(--color-sky)", "#fff"], ["var(--color-hot)", "#fff"], ["var(--color-pop)", "var(--color-ink)"],
];

function useFit() {
  const [s, setS] = useState(1);
  useLayoutEffect(() => {
    const f = () => setS(Math.min(innerWidth / W, innerHeight / H));
    f(); addEventListener("resize", f);
    return () => removeEventListener("resize", f);
  }, []);
  return s;
}

const readHash = (n: number) => Math.min(Math.max((parseInt(location.hash.slice(1)) || 1) - 1, 0), n - 1);

export function Deck({ slides }: { slides: Slide[] }) {
  const scale = useFit();
  const [i, setI] = useState(() => readHash(slides.length));
  const [menu, setMenu] = useState(false);
  const dir = useRef(1);
  const cur = slides[i];
  const scope = useMemo(() => ({ n: 0 }), [i]);

  const sections = useMemo(() => {
    const out: { name: string; first: number }[] = [];
    slides.forEach((s, k) => { if (!out.length || out[out.length - 1].name !== s.section) out.push({ name: s.section, first: k }); });
    return out;
  }, [slides]);
  const secIdx = sections.reduce((a, s, k) => (s.first <= i ? k : a), 0);
  const [bg, fg] = SECTION_COLORS[secIdx % SECTION_COLORS.length];

  const go = useCallback((n: number) => {
    const t = Math.min(Math.max(n, 0), slides.length - 1);
    dir.current = t >= i ? 1 : -1; setI(t); setMenu(false);
  }, [i, slides.length]);
  const next = useCallback(() => go(i + 1), [go, i]);
  const prev = useCallback(() => go(i - 1), [go, i]);

  useEffect(() => { history.replaceState(null, "", `#${i + 1}`); }, [i]);
  const fs = () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.());

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const m: Record<string, () => void> = {
        ArrowRight: next, PageDown: next, " ": next, ArrowDown: next,
        ArrowLeft: prev, PageUp: prev, ArrowUp: prev,
        Home: () => go(0), End: () => go(slides.length - 1),
        g: () => setMenu((v) => !v), G: () => setMenu((v) => !v), Escape: () => setMenu(false),
        f: fs, F: fs,
      };
      if (m[e.key]) { e.preventDefault(); m[e.key](); }
    };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [next, prev, go, slides.length]);

  // swipe for touch smartboards (ignored when the touch starts on an interactive demo)
  const sx = useRef<number | null>(null);

  return (
    <div className="fixed inset-0 overflow-hidden bg-bg"
      onTouchStart={(e) => { sx.current = (e.target as HTMLElement).closest("[data-grab],button,input") ? null : e.touches[0].clientX; }}
      onTouchEnd={(e) => { if (sx.current == null) return; const d = e.changedTouches[0].clientX - sx.current; sx.current = null; if (Math.abs(d) > 120) (d < 0 ? next : prev)(); }}>
      <div className="stage" style={{ transform: `translate(${(innerWidth - W * scale) / 2}px, ${(innerHeight - H * scale) / 2}px) scale(${scale})` }}>
        <div className="absolute inset-y-0 left-0 w-8 border-r-2 border-ink" style={{ background: bg }} />
        <AnimatePresence mode="wait">
          <motion.div key={i} className="absolute inset-0 flex flex-col pl-8"
            initial={{ opacity: 0, x: 60 * dir.current }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 * dir.current }} transition={{ duration: STILL ? 0 : 0.22 }}>
            <RevealScope.Provider value={scope}>
              {cur.bare ? cur.body(99) : (
                <>
                  <header className="px-24 pt-12">
                    <span className="inline-block border-2 border-ink px-5 py-1 text-[24px] font-extrabold uppercase tracking-[0.18em]" style={{ background: bg, color: fg }}>
                      {String(secIdx + 1).padStart(2, "0")} · {cur.section}
                    </span>
                    <h1 className="display mt-4 text-[70px] font-extrabold leading-[1.05] text-ink">{cur.title}</h1>
                  </header>
                  <main className="flex min-h-0 flex-1 flex-col justify-center px-24 pb-20 pt-4"><div>{cur.body(99)}</div></main>
                </>
              )}
            </RevealScope.Provider>
          </motion.div>
        </AnimatePresence>

        <footer className="absolute inset-x-0 bottom-0 flex h-16 items-center gap-6 border-t-2 border-ink bg-ink pl-16 pr-24 text-[22px] text-bg">
          <span className="display font-extrabold tracking-wide">ESIOT · Unit IV: GSM, Cloud Computing &amp; IoT</span>
          <div className="relative h-3 flex-1 overflow-hidden border border-bg/50"><div className="h-full bg-pop transition-all duration-300" style={{ width: `${((i + 1) / slides.length) * 100}%` }} /></div>
          <span className="font-mono font-bold text-yellow-300">{i + 1} / {slides.length}</span>
          <div className="flex gap-2">
            <Btn onClick={prev} label="Previous"><ChevronLeft size={26} /></Btn>
            <Btn onClick={next} label="Next"><ChevronRight size={26} /></Btn>
            <Btn onClick={() => setMenu(true)} label="Topics (G)"><Menu size={26} /></Btn>
            <Btn onClick={fs} label="Fullscreen (F)"><Maximize size={26} /></Btn>
          </div>
        </footer>

        {menu && (
          <div className="absolute inset-0 z-50 bg-bg p-24" onClick={() => setMenu(false)}>
            <div className="mb-8 flex items-center justify-between"><h2 className="display text-[64px] font-extrabold">Topics</h2><X size={48} /></div>
            <div className="grid grid-cols-3 gap-5" onClick={(e) => e.stopPropagation()}>
              {sections.map((s, k) => {
                const [b, f] = SECTION_COLORS[k % SECTION_COLORS.length];
                return (
                  <button key={s.name} onClick={() => go(s.first)} className={`press hard-sm flex items-center gap-4 border-2 border-ink p-5 text-left text-[28px] font-bold ${k === secIdx ? "bg-pop" : "bg-white"}`}>
                    <span className="display flex h-12 w-12 shrink-0 items-center justify-center border-2 border-ink text-[24px] font-extrabold" style={{ background: b, color: f }}>{String(k + 1).padStart(2, "0")}</span>{s.name}
                  </button>
                );
              })}
            </div>
            <p className="mt-8 text-[24px] text-mute">← → navigate · G topics · F fullscreen · Home / End</p>
          </div>
        )}
      </div>
    </div>
  );
}

const Btn = ({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) => (
  <button onClick={onClick} aria-label={label} title={label} className="border-2 border-bg/70 bg-ink p-2 text-bg hover:bg-bg hover:text-ink">{children}</button>
);
