import type { ReactNode } from "react";

/** One slide. `steps` = extra arrow-presses on this slide before moving on (staged reveal). */
export type Slide = {
  section: string;
  title: string;
  steps?: number;
  /** full-bleed layout without the standard title header */
  bare?: boolean;
  body: (step: number) => ReactNode;
};
