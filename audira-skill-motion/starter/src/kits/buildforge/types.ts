// BUILDFORGE core vocabulary. A structure is a flat list of components; each one knows its
// seat (final pose), how it physically arrives there (method), what it bears on, and which
// phase installs it. Timing lives in the assembly sequence, never in the component.

import type { BufferGeometry } from "three";

export type Vec3 = [number, number, number];

/** One physical piece of a multi-piece component (a block, a slat, a board): local centre and size, metres. */
export type Piece = {
  c: Vec3;
  s: Vec3;
  /** Brightness multiplier (natural variation between blocks or boards). */
  tone?: number;
  /** Bedding material: appears in place when its turn comes instead of being carried in. */
  instant?: boolean;
};

/** A sub-mesh of a solid component; `material` overrides the component's own. */
export type SubMesh = { geom: BufferGeometry; material?: string };

export type Part =
  /**
   * One rigid element (column, beam, plank, window unit…). Built lazily: the check script never
   * needs GL. `boxes` is an exact box decomposition for clash checks when bounds would lie
   * (a coat with openings, a planter around its soil).
   */
  | { kind: "solid"; build: () => SubMesh[]; bounds: { min: Vec3; max: Vec3 }; boxes?: [Vec3, Vec3][] }
  /** Many identical small elements placed one after another (masonry, cladding slats, deck boards). */
  | { kind: "pieces"; pieces: Piece[] };

/** How a component physically reaches its seat. Offsets are in the component's local frame. */
export type Method =
  /** Crane lift: hangs from a hook, comes straight down, the rigging lifts away after set-down. */
  | { kind: "lower"; height: number; rig: "single" | "sling" | "four" }
  /** Carried in by installers along an offset (windows into openings, boards into place). */
  | { kind: "slide"; from: Vec3 }
  /** Poured or placed material rising from the bottom of its form (footings, gravel). */
  | { kind: "fill"; cure?: boolean }
  /** A pour front advancing across the form, with a sloped leading edge (slabs). Needs a geometry subdivided along `axis`. */
  | { kind: "spread"; axis: "x" | "z"; dir: 1 | -1; ramp: number; cure?: boolean }
  /** Hammered into the ground in blows (survey stakes). */
  | { kind: "drive"; depth: number }
  /** A line pulled taut from its start (local x) to its end. */
  | { kind: "draw" }
  /** Planting growing from its base. */
  | { kind: "grow" }
  /** A finish coat applied bottom → top behind a travelling front (render, plaster). */
  | { kind: "coat" }
  /** Pieces laid one by one; `each` = share of the component window one piece's move takes. */
  | { kind: "lay"; from: Vec3; each: number };

export type Component = {
  id: string;
  /** Assembly phase that installs it; the sequence gives each phase a time window. */
  phase: string;
  part: Part;
  /** Seat: world position of the part's local origin once installed. */
  at: Vec3;
  rotY?: number;
  material: string;
  method: Method;
  /** Components this one bears on or is fixed to: they must be complete before it starts. */
  rests?: string[];
  /** Procedural predecessors that carry no load (e.g. the slab is poured after the formwork is set). */
  after?: string[];
  /** Order inside its phase window; equal keys start together. Defaults to list order. */
  key?: number;
  /** Temporary works (stakes, formwork, spoil) leave the site during this phase, by the reverse of `method`. */
  exit?: string;
  /** Surface turns into this material when the named finish sweep passes over it. */
  finish?: { material: string; sweep: string };
  ghost?: boolean;
  shadow?: boolean;
};
