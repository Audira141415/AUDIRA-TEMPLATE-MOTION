// A 7 s silent cut in seconds: hold, morph, hold, morph, hold — enough to exercise every engine path.

import type { Cut } from "../film/cut.ts";
import { keys } from "../../../core/motion/track.ts";
import { makeEvolution } from "./evolution.ts";
import type { Cam, StarterFx } from "./params.ts";

export const STARTER_CUT: Cut<Cam, StarterFx> = {
  seconds: 7,
  clock: (frame, fps) => frame / fps,
  evolution: makeEvolution([
    { id: "m1", t0: 1.2, t1: 3.2 },
    { id: "m2", t0: 4.2, t1: 6.2 },
  ]),
  yaw: keys([0, -35], [7, 20]),
  tilt: keys([0, 0, 0]),
  rig: keys([0, 0, -3.0, 0, 6, 4, 48, 24], [7, 0, -3.2, 0, 4, 7, 46, 24]),
  labels: keys([0, 1]),
  fx: {},
  title: { in: [0, 0.5], out: [1.0, 1.6] },
};
