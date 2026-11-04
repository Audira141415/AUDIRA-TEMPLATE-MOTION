// A cut is one edit of a film: its clock, where each morph plays, how the object turns, where
// the camera goes, what the typography and the object perform. Every key is written in the
// cut's own clock units (`clock`), so the same choreography drives a silent preview (keys in
// 30 fps frames) and a narrated film (keys in voice-over seconds).

import type { Evolution } from "../morph/eraTimeline.ts";
import type { Tree } from "../morph/lerpTree.ts";
import type { Key } from "../../../core/motion/track.ts";

export type Cut<P extends Tree, Fx extends Record<string, number>> = {
  /** Length in seconds; the composition is `seconds × fps` frames. */
  seconds: number;
  /** Composition frame → this cut's clock. */
  clock: (frame: number, fps: number) => number;
  evolution: Evolution<P>;
  /** Turntable yaw (deg). */
  yaw: Key[];
  /** Pitch and roll (deg). */
  tilt: Key[];
  /** Camera rig: [tx, ty, tz, azDeg, elDeg, dist, fovDeg]. */
  rig: Key[];
  /** Visibility of year, descriptor and time rail (dropped during detail close-ups). */
  labels: Key[];
  /** Object performance channels (screen moments, lights…), one single-channel track each. */
  fx: { [K in keyof Fx]: Key[] };
  /** Title fades (clock units). */
  title: { in: [number, number]; out: [number, number] };
  /** Closing line under the year, faded in over `in`. */
  closing?: { text: string; in: [number, number] };
  /** Fade the whole frame to the studio white over this window. */
  fadeOut?: [number, number];
  /** Voice-over (path under public/), placed `offset` seconds into the film. */
  vo?: { src: string; offset: number };
};
