// An evolution is a sequence of eras (parameter trees of one shape) joined by morphs.
// Holds show an era as-is; a morph interpolates leaf by leaf with its own timing rules.
// A morph can also play in reverse (a rewind through time): the object then passes through
// exactly the states of the forward morph, backwards. Times are in whatever clock the caller
// samples with (frames, seconds).

import { lerpTree, ruled, type Rule, type Tree } from "./lerpTree.ts";

export type Morph = {
  from: string;
  to: string;
  f0: number;
  f1: number;
  rules: Rule[];
  /** Timing for leaves no rule matches (fractions of the morph). */
  fallback?: { start: number; end: number };
  ease: (t: number) => number;
  /** Play from `to` back to `from` (the forward morph's states, in reverse order). */
  reverse?: boolean;
};

export type Evolution<P extends Tree> = {
  eras: Record<string, P>;
  order: string[];
  morphs: Morph[];
};

/** A morph without timing: which eras it joins and how its leaves are staggered. */
export type MorphDef = { from: string; to: string; rules: readonly Rule[]; fallback?: { start: number; end: number } };

/** Where (and which way) a morph plays, in the caller's clock units. */
export type MorphWindow<Id extends string = string> = { id: Id; t0: number; t1: number; reverse?: boolean };

/** Place timing-free morph definitions on a clock: the same object can be cut many ways. */
export const placeMorphs = <P extends Tree, Id extends string>(
  eras: Record<string, P>,
  order: readonly string[],
  defs: Record<Id, MorphDef>,
  windows: MorphWindow<Id>[],
  ease: (t: number) => number,
): Evolution<P> => ({
  eras,
  order: [...order],
  morphs: windows.map((w) => ({ ...defs[w.id], rules: [...defs[w.id].rules], f0: w.t0, f1: w.t1, reverse: w.reverse, ease })),
});

export type EraState<P> = {
  params: P;
  /** The two eras being joined (equal during a hold) — for spatial material sweeps. */
  a: P;
  b: P;
  /** Continuous era coordinate: 0 = first era … n-1 = last; fractional inside a morph. */
  eraPos: number;
  /** The morph in progress (null during a hold) and its linear time in forward terms (a reverse morph runs 1 → 0). */
  morph: Morph | null;
  t: number;
};

const startEra = (m: Morph) => (m.reverse ? m.to : m.from);
const endEra = (m: Morph) => (m.reverse ? m.from : m.to);

export const evaluate = <P extends Tree>(evo: Evolution<P>, frame: number): EraState<P> => {
  const idx = (id: string) => evo.order.indexOf(id);
  const m = evo.morphs.find((m) => frame >= m.f0 && frame < m.f1) ?? null;
  if (m) {
    const u = (frame - m.f0) / (m.f1 - m.f0);
    const t = m.reverse ? 1 - u : u;
    const p = ruled(t, m.rules, m.fallback ?? { start: 0, end: 1 }, m.ease);
    const a = evo.eras[m.from], b = evo.eras[m.to];
    return { params: lerpTree(a, b, p), a, b, eraPos: idx(m.from) + t, morph: m, t };
  }
  // hold: where the last finished morph ended (or where the first one starts)
  const done = evo.morphs.filter((m) => frame >= m.f1);
  const id = done.length ? endEra(done[done.length - 1]) : evo.morphs.length ? startEra(evo.morphs[0]) : evo.order[0];
  const e = evo.eras[id];
  return { params: e, a: e, b: e, eraPos: idx(id), morph: null, t: 0 };
};
