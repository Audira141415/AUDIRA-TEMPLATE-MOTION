// Assembly sequence of the pavilion example. Phase windows are written in seconds of film time and
// converted to the construction clock (CLOCK units per second), so motion constants keep their
// real-time feel at any render frame rate. Which component belongs to which phase lives in
// pavilion.ts; the per-component timeline is derived by schedule(); scripts/buildforge-check.ts
// proves the sequence is physically ordered and clash-free.

import type { PhaseWindow } from "../assembly/schedule.ts";
import type { TerrainState } from "../environment/Terrain.ts";
import type { Stage } from "../labels/StageLabel.tsx";
import { ease, remap } from "../motion/easing.ts";
import { keys } from "../motion/track.ts";

/** Construction-clock units per second (the engine's motion constants assume 30). */
export const CLOCK = 30;
export const EXAMPLE_SECONDS = 10;
/** Seconds → clock units, rounded so windows written in seconds never lose a hair to float error. */
const sec = (v: number) => Math.round(v * CLOCK * 1000) / 1000;
const w = (phase: string, a: number, b: number, dur: number): PhaseWindow => ({ phase, start: sec(a), end: sec(b), dur: sec(dur) });

export const WINDOWS: PhaseWindow[] = [
  // 1 · the land
  w("setout", 0.6, 1.5, 0.3),
  w("strings", 1.3, 1.9, 0.3),
  // 2 · foundation
  w("footings", 2.6, 3.3, 0.35),
  w("strings-out", 3.2, 3.45, 0.15),
  w("setout-out", 3.45, 3.75, 0.2),
  w("formwork", 3.3, 3.75, 0.3),
  w("slab", 3.75, 4.6, 0.8),
  w("strike", 4.7, 5.0, 0.25),
  // 3 · frame
  w("columns", 4.9, 5.7, 0.4),
  w("beams", 5.7, 6.2, 0.4),
  w("crossbeams", 6.2, 6.6, 0.3),
  // 4 · roof and walls
  w("roof", 6.6, 7.4, 0.8),
  w("cap", 7.4, 7.9, 0.5),
  w("glazing", 6.7, 7.4, 0.45),
  w("screen", 7.4, 8.2, 0.8),
  // 5 · finished
  w("bench", 8.0, 8.4, 0.35),
  w("paving", 8.1, 8.9, 0.8),
  w("trees", 8.2, 9.2, 0.8),
  w("shrubs", 8.5, 9.3, 0.5),
];

/** Ground operations (not components). */
export const terrainAt = (c: number): TerrainState => ({
  contour: 1 - remap(c, sec(0.2), sec(0.9)),
  grade: ease.inOut(remap(c, sec(0.5), sec(1.3))),
  dig: ease.inOut(remap(c, sec(1.9), sec(3.0))),
  backfill: ease.inOut(remap(c, sec(4.7), sec(5.2))),
  lawn: ease.out(remap(c, sec(8.0), sec(9.3))),
});

/** Everything must be in place before this clock value (a short hold at the end). */
export const END = sec(9.6);

/** Stage labels, in seconds (the film converts them to frames). */
export const STAGES_S: Stage[] = [
  { from: 0, to: 1.9, n: "01", label: "LAHAN" },
  { from: 1.9, to: 4.8, n: "02", label: "FONDASI" },
  { from: 4.8, to: 6.6, n: "03", label: "RANGKA" },
  { from: 6.6, to: 8.0, n: "04", label: "ATAP & DINDING" },
  { from: 8.0, to: EXAMPLE_SECONDS, n: "05", label: "SELESAI" },
];

/**
 * Camera: one continuous move on the construction clock.
 * [clock, targetX, targetY, targetZ, azimuth°, elevation°, distance, fov°]; azimuth 0 looks at the
 * front (+z), positive swings the camera east (+x).
 */
export const RIG = keys(
  [sec(0), 0, 0.4, 1, -38, 22, 36, 36],
  [sec(1.6), 0, 0.0, 0.5, -30, 34, 29, 36],
  [sec(3.4), 0, -0.2, 0, -18, 42, 27, 36],
  [sec(4.7), 0, 0.4, 0, -6, 34, 27, 36],
  [sec(5.9), 0.2, 1.6, 0, 10, 25, 28, 36],
  [sec(7.2), 0.2, 2.2, 0, 22, 19, 30, 36],
  [sec(8.4), 0, 2.3, 0.6, 30, 14, 31, 36],
  [sec(EXAMPLE_SECONDS), 0, 2.2, 1.0, 34, 11, 33, 36],
);

export const LENS = { aperture: 0.00011, maxBlur: 0.0032, exposure: 1.0 };
