// The contract between the TIMEFORGE engine and one evolving object (a "subject"). The engine
// owns time, camera, studio, materials sweep, typography and voice-over; a subject supplies the
// parameter tree's eras (via its cuts), how it is labelled, how big it is, and how it is drawn.
// The phone film (src/subjects/phones) is the only art-directed implementation so far.

import type React from "react";
import type { Matrix4, Vector3 } from "three";
import type { Sweep } from "../../../core/materials/sweep.ts";
import type { EraState } from "../morph/eraTimeline.ts";
import type { Tree } from "../morph/lerpTree.ts";
import type { FilmState } from "./choreography.ts";

export type EraLabel = {
  year: number;
  /** Show an "s" after the year while holding this era (1990s), hidden while rolling. */
  decade: boolean;
  /** One short descriptor line under the year. */
  tag: string;
};

export type Subject<P extends Tree, Fx extends Record<string, number>> = {
  /** Small caps line over the year at the start (e.g. "EVOLUSI PONSEL"). */
  title: string;
  /** Era ids in time order. */
  order: readonly string[];
  labels: Record<string, EraLabel>;
  /** Stops on the time rail, one per era. */
  rail: string[];
  /** Eras whose descriptor turns accent-coloured near the end of the morph into them (speculative concepts). */
  accentEras?: string[];
  /** Material scan window per morph, keyed by the morph's `from` era (fractions of the morph). */
  sweep: Record<string, [number, number]>;
  /** Distance from the object origin down to its lowest point for these params and roll (rad). */
  halfHeight: (p: P, roll: number) => number;
  /** Contact-shadow footprint half-sizes in object space. */
  footprint: (p: P) => { w: number; d: number };
  /** Gap between the object and the plinth (default 2.2). */
  hover?: number;
  /** Named world points derived from the object (e.g. where a spatial UI attaches). */
  anchors?: (p: P, matrix: Matrix4) => Record<string, Vector3>;
  /** The object in its own space; the film poses it. */
  Model: React.FC<{ era: EraState<P>; sweep: Sweep; font: string; fx: Fx }>;
  /** World-space extras that are not part of the object (spatial UI, props). */
  Extras?: React.FC<{ s: FilmState<P, Fx>; font: string }>;
};
