import { mat } from "../../../core/materials/sweep.ts";
import type { EraLabel } from "../film/subject.ts";
import type { Cam } from "./params.ts";

const box: Cam = {
  body: { hw: 4.6, hh: 3.6, d: 4.2, rc: 0.35, reF: 0.15, reB: 0.15 },
  lens: { r: 1.0, len: 0.9, x: 0, y: -0.2 },
  dial: { r: 0.7, ht: 0.6, x: 2.6 },
  mats: { body: mat("#2b2a28", { rough: 0.7, sheen: 0.4 }), trim: mat("#c9c3b8", { rough: 0.3, metal: 1 }) },
};
const compact: Cam = {
  body: { hw: 4.4, hh: 2.6, d: 2.4, rc: 1.1, reF: 0.6, reB: 0.6 },
  lens: { r: 1.25, len: 1.4, x: -0.6, y: 0 },
  dial: { r: 0.5, ht: 0.3, x: 2.8 },
  mats: { body: mat("#c7c9cc", { rough: 0.35, metal: 0.8, cc: 0.4 }), trim: mat("#1d1f22", { rough: 0.4 }) },
};
const mirrorless: Cam = {
  body: { hw: 4.8, hh: 3.0, d: 1.8, rc: 0.9, reF: 0.3, reB: 0.5 },
  lens: { r: 1.9, len: 3.2, x: -0.4, y: -0.1 },
  dial: { r: 0.6, ht: 0.0, x: 3.0 },
  mats: { body: mat("#efece6", { rough: 0.45, cc: 0.6, ccRough: 0.2 }), trim: mat("#b9babd", { rough: 0.25, metal: 1, aniso: 0.5 }) },
};

export const ERAS = { box, compact, mirrorless };
export const ERA_ORDER = ["box", "compact", "mirrorless"] as const;
export const ERA_LABEL: Record<(typeof ERA_ORDER)[number], EraLabel> = {
  box: { year: 1950, decade: true, tag: "CONTOH · ERA 1" },
  compact: { year: 1995, decade: false, tag: "CONTOH · ERA 2" },
  mirrorless: { year: 2026, decade: false, tag: "CONTOH · ERA 3" },
};
