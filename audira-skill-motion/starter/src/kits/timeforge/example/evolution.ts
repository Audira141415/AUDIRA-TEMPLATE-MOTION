// Per-component timing for the starter's two morphs (fractions of each morph).

import { placeMorphs, type MorphDef, type MorphWindow } from "../morph/eraTimeline.ts";
import type { Rule } from "../morph/lerpTree.ts";
import { ease } from "../../../core/motion/easing.ts";
import { ERA_ORDER, ERAS } from "./eras.ts";
import type { Cam } from "./params.ts";

const r = (match: Rule["match"], start: number, end: number): Rule => ({ match, start, end });

export const MORPHS = {
  // the dial sinks first, then the box rounds off around a lens that slides out
  m1: { from: "box", to: "compact", rules: [r("dial.", 0, 0.4), r("body.", 0.2, 0.8), r("lens.", 0.45, 1)] },
  m2: { from: "compact", to: "mirrorless", rules: [r("body.", 0, 0.6), r("lens.", 0.3, 1), r("dial.", 0, 0.3)] },
} satisfies Record<string, MorphDef>;

export const SWEEP: Record<string, [number, number]> = { box: [0.2, 0.8], compact: [0.1, 0.6] };

export const makeEvolution = (windows: MorphWindow<keyof typeof MORPHS>[]) => placeMorphs<Cam, keyof typeof MORPHS>(ERAS, ERA_ORDER, MORPHS, windows, ease.inOut);
