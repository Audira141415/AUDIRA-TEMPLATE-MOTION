// EXAMPLE SUBJECT — a deliberately simple stand-in (a camera in three eras) that proves the
// TIMEFORGE engine runs with a parameter tree other than the phone's. It is a plumbing test and
// a template to copy, NOT an art-directed design. Units: cm, object space (front = +z, top = +y).

import type { MatState } from "../../../core/materials/sweep.ts";

export type Cam = {
  /** Body shell (fed straight to the engine's Slab). */
  body: { hw: number; hh: number; d: number; rc: number; reF: number; reB: number };
  /** Lens barrel on the front: radius, how far it stands out, centre offset on the face. */
  lens: { r: number; len: number; x: number; y: number };
  /** Top dial: radius and height (0 = sunk flush, i.e. gone). */
  dial: { r: number; ht: number; x: number };
  mats: { body: MatState; trim: MatState };
  /** Object performance is passed separately (StarterFx); this tree is pure design. */
};

export type StarterFx = Record<string, never>;
