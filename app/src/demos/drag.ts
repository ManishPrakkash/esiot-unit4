import type { PointerEvent } from "react";

/** Pointer position in the SVG's own coordinate system (works through the stage's CSS scaling). */
export function svgPt(e: PointerEvent, svg: SVGSVGElement) {
  const pt = svg.createSVGPoint();
  pt.x = e.clientX; pt.y = e.clientY;
  const m = svg.getScreenCTM();
  return m ? pt.matrixTransform(m.inverse()) : pt;
}

/** Spread onto any element: calls fn on press and on every move while pressed (pointer captured). */
export const drag = (fn: (e: PointerEvent<any>) => void) => ({
  "data-grab": "",
  onPointerDown: (e: PointerEvent<any>) => { (e.currentTarget as Element).setPointerCapture(e.pointerId); fn(e); },
  onPointerMove: (e: PointerEvent<any>) => { if ((e.currentTarget as Element).hasPointerCapture(e.pointerId)) fn(e); },
});

export const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);
export const deg = (r: number) => (r * 180) / Math.PI;
export const rad = (d: number) => (d * Math.PI) / 180;

/** Knob angle (0 = up, clockwise +) from a pointer relative to its centre, limited to ±135° like a real pot. */
export function knobAngle(e: PointerEvent, svg: SVGSVGElement, cx: number, cy: number) {
  const p = svgPt(e, svg);
  const a = deg(Math.atan2(p.x - cx, -(p.y - cy)));
  return clamp(a, -135, 135);
}
