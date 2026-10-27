// Dev-only: open with ?audit — presses → through the whole deck and reports content that crosses the footer line or right edge.
export function runAudit() {
  const out: string[] = [];
  let guard = 0;
  const key = (k: string) => dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true }));
  let n = 0;
  const seen = new Set<string>();
  const measure = () => {
    const scr = document.querySelector(".stage") as HTMLElement | null;
    const root = scr?.querySelector(":scope > div.flex-col") as HTMLElement | null;
    if (!root) { out.push("no root " + location.hash); return; }
    n++; seen.add(location.hash);
    const s = scr!.getBoundingClientRect();
    const k = s.width / 1920;
    let bottom = 0, right = 0, who = "";
    root.querySelectorAll("*").forEach((el) => {
      const r = (el as HTMLElement).getBoundingClientRect();
      if (el.children.length > 0 || r.width === 0 || r.height === 0 || getComputedStyle(el).visibility === "hidden") return;
      if ((r.bottom - s.top) / k > bottom) { bottom = (r.bottom - s.top) / k; who = el.tagName + "." + String((el as HTMLElement).className).slice(0, 30); }
      right = Math.max(right, (r.right - s.left) / k);
    });
    if (bottom > (+(location.search.split("audit=")[1] || 1000)) || right > 1890) out.push(`slide ${location.hash} bottom=${Math.round(bottom)} right=${Math.round(right)} (${who})`);
  };
  const tick = () => {
    measure();
    const before = location.hash;
    key("ArrowRight");
    setTimeout(() => {
      if (location.hash === before && ++guard > 3) { document.title = "AUDIT DONE"; const pre = document.createElement("pre"); pre.id = "audit"; pre.textContent = `measured=${n} slides=${seen.size}\n` + out.join("\n"); document.body.appendChild(pre); return; }
      if (location.hash !== before) guard = 0;
      setTimeout(tick, 350);
    }, 30);
  };
  setTimeout(tick, 800);
}
