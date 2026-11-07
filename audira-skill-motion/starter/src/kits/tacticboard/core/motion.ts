// TACTICBOARD motion core — every value is a pure function of film time t (seconds).
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const smooth = (k: number) => {
  const x = clamp(k);
  return x * x * (3 - 2 * x);
};
export const easeInOut = (k: number) => {
  const x = clamp(k);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
/** Eased progress of t through [a, b]. */
export const seg = (t: number, a: number, b: number) => smooth((t - a) / (b - a));

/** Seeded PRNG (mulberry32). Never use Math.random in a kit. */
export const prng = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let r = Math.imul(s ^ (s >>> 15), 1 | s);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

export type V2 = [number, number];
export type V3 = [number, number, number];
export type Key = { t: number; p: V2 };

/** Piecewise eased path through timed keys (pitch x, z). */
export const track = (keys: Key[], t: number): V2 => {
  if (t <= keys[0].t) return keys[0].p;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (t <= b.t) {
      const k = easeInOut((t - a.t) / (b.t - a.t));
      return [lerp(a.p[0], b.p[0], k), lerp(a.p[1], b.p[1], k)];
    }
  }
  return keys[keys.length - 1].p;
};

// ---------------------------------------------------------------------------
// The play: home 4-3-3 (attacking toward -z) overloads the right flank.
// ---------------------------------------------------------------------------
export const PITCH = { halfW: 3.4, halfL: 5.2 } as const;

/** Beat timings (seconds). */
export const BEATS = {
  pass1: [1.9, 2.7] as V2, // CM -> RCM
  pass2: [3.1, 4.1] as V2, // RCM -> RW (switch)
  pass3: [4.9, 5.7] as V2, // RW -> overlapping RB
  cross: [6.2, 7.0] as V2, // RB low cross -> ST near post
  shot: [7.25, 7.75] as V2, // ST finish
  goal: 7.75,
};

type Player = { team: 0 | 1; n: number; keys: Key[] };
const st = (p: V2): Key[] => [{ t: 0, p }];

export const PLAYERS: Player[] = [
  // HOME 4-3-3
  { team: 0, n: 1, keys: st([0, 4.75]) },
  { team: 0, n: 3, keys: st([-2.4, 2.4]) },
  { team: 0, n: 4, keys: [{ t: 0, p: [-0.8, 2.9] }, { t: 6, p: [-0.6, 1.6] }] },
  { team: 0, n: 5, keys: [{ t: 0, p: [0.8, 2.9] }, { t: 6, p: [0.9, 1.4] }] },
  // RB overlap run
  { team: 0, n: 2, keys: [{ t: 0, p: [2.5, 2.4] }, { t: 3.0, p: [2.7, 0.6] }, { t: 5.6, p: [3.0, -3.55] }, { t: 7, p: [2.9, -3.9] }] },
  { team: 0, n: 6, keys: [{ t: 0, p: [0, 1.2] }, { t: 2.2, p: [0.1, 1.0] }, { t: 7, p: [0.3, -1.2] }] },
  { team: 0, n: 8, keys: [{ t: 0, p: [1.3, 0.9] }, { t: 1.9, p: [1.35, 0.45] }, { t: 7, p: [1.6, -2.4] }] },
  { team: 0, n: 10, keys: [{ t: 0, p: [-1.4, 0.6] }, { t: 7, p: [-1.0, -2.6] }] },
  { team: 0, n: 11, keys: [{ t: 0, p: [-2.6, -1.6] }, { t: 7, p: [-1.9, -3.5] }] },
  // ST near-post run
  { team: 0, n: 9, keys: [{ t: 0, p: [0, -2.0] }, { t: 5.4, p: [-0.3, -2.9] }, { t: 7.0, p: [0.45, -4.1] }, { t: 8.2, p: [0.6, -4.3] }] },
  // RW receives then cuts in
  { team: 0, n: 7, keys: [{ t: 0, p: [2.5, -1.2] }, { t: 4.0, p: [2.55, -1.75] }, { t: 5.0, p: [1.9, -2.2] }, { t: 7, p: [1.5, -3.1] }] },
  // AWAY 4-4-2 (defending the -z goal)
  { team: 1, n: 1, keys: [{ t: 0, p: [0, -4.9] }, { t: 6.9, p: [0.25, -4.85] }, { t: 7.55, p: [-0.15, -4.95] }] },
  // their full-back is dragged by the RW and leaves the overlap open
  { team: 1, n: 3, keys: [{ t: 0, p: [2.2, -3.4] }, { t: 4.2, p: [2.35, -2.3] }, { t: 6, p: [2.0, -2.6] }] },
  { team: 1, n: 5, keys: [{ t: 0, p: [0.75, -3.8] }, { t: 6.4, p: [1.2, -3.9] }] },
  { team: 1, n: 4, keys: [{ t: 0, p: [-0.75, -3.8] }, { t: 6.6, p: [-0.15, -3.75] }] },
  { team: 1, n: 2, keys: [{ t: 0, p: [-2.2, -3.4] }, { t: 7, p: [-1.4, -3.6] }] },
  { team: 1, n: 11, keys: [{ t: 0, p: [2.1, -2.2] }, { t: 4.5, p: [2.0, -1.6] }] },
  { team: 1, n: 6, keys: [{ t: 0, p: [0.7, -2.5] }, { t: 7, p: [1.1, -2.9] }] },
  { team: 1, n: 8, keys: [{ t: 0, p: [-0.7, -2.5] }, { t: 7, p: [-0.4, -2.8] }] },
  { team: 1, n: 7, keys: [{ t: 0, p: [-2.1, -2.2] }, { t: 7, p: [-1.6, -2.5] }] },
  { team: 1, n: 9, keys: [{ t: 0, p: [-0.5, -0.2] }, { t: 7, p: [0.1, -0.9] }] },
  { team: 1, n: 10, keys: [{ t: 0, p: [0.6, 0.2] }, { t: 7, p: [0.9, -0.6] }] },
];

/** Player position with a tiny seeded idle shuffle, so nothing is ever frozen. */
export const playerPos = (i: number, t: number): V2 => {
  const p = track(PLAYERS[i].keys, t);
  const r = prng(i * 97 + 13);
  const ph = r() * 6.28;
  const sp = 0.6 + r() * 0.5;
  return [p[0] + Math.sin(t * sp + ph) * 0.03, p[1] + Math.cos(t * sp * 0.8 + ph) * 0.03];
};

export const idx = (team: 0 | 1, n: number) => PLAYERS.findIndex((p) => p.team === team && p.n === n);

export const GOAL_POINT: V3 = [-0.24, 0.14, -5.42];
export const GOAL = { z: -5.2, halfW: 0.4, h: 0.26, depth: 0.38 } as const;

const at = (team: 0 | 1, n: number, tt: number): V3 => {
  const p = playerPos(idx(team, n), tt);
  return [p[0], 0.06, p[1] - 0.24];
};
const pass = (from: V3, to: V3, k: number, lift: number): V3 => {
  const e = easeInOut(k);
  return [lerp(from[0], to[0], e), lerp(from[1], to[1], e) + Math.sin(Math.PI * clamp(k)) * lift, lerp(from[2], to[2], e)];
};

/** Ball position (x, y, z) at time t. */
export const ballPos = (t: number): V3 => {
  const B = BEATS;
  const k = (s: V2) => (t - s[0]) / (s[1] - s[0]);
  if (t < B.pass1[0]) return at(0, 6, t);
  if (t < B.pass1[1]) return pass(at(0, 6, B.pass1[0]), at(0, 8, B.pass1[1]), k(B.pass1), 0.05);
  if (t < B.pass2[0]) return at(0, 8, t);
  if (t < B.pass2[1]) return pass(at(0, 8, B.pass2[0]), at(0, 7, B.pass2[1]), k(B.pass2), 0.55);
  if (t < B.pass3[0]) return at(0, 7, t);
  if (t < B.pass3[1]) return pass(at(0, 7, B.pass3[0]), at(0, 2, B.pass3[1]), k(B.pass3), 0.04);
  if (t < B.cross[0]) return at(0, 2, t);
  if (t < B.cross[1]) return pass(at(0, 2, B.cross[0]), at(0, 9, B.cross[1]), k(B.cross), 0.22);
  if (t < B.shot[0]) return at(0, 9, t);
  if (t < B.shot[1]) return pass(at(0, 9, B.shot[0]), GOAL_POINT, k(B.shot), 0.12);
  // ball settles in the bulging net
  const s = clamp((t - B.goal) / 0.6);
  return [GOAL_POINT[0], lerp(GOAL_POINT[1], 0.06, s), GOAL_POINT[2] - Math.sin(s * Math.PI) * 0.12 - 0.05 * s];
};

/** The four passes as [from, to] segments, used to draw the passing lanes. */
export const LANES: { win: V2; lift: number }[] = [
  { win: BEATS.pass1, lift: 0.05 },
  { win: BEATS.pass2, lift: 0.55 },
  { win: BEATS.pass3, lift: 0.04 },
  { win: BEATS.cross, lift: 0.22 },
  { win: BEATS.shot, lift: 0.12 },
];

/** Net bulge 0..1 after the goal, damped spring. */
export const netBulge = (t: number) => {
  const d = t - BEATS.goal;
  if (d < 0) return 0;
  return Math.exp(-d * 3.2) * Math.abs(Math.sin(d * 9));
};

/** Which coaching beat is on screen (0..3). */
export const beatIndex = (t: number) => (t < 3.0 ? 0 : t < 6.0 ? 1 : t < 7.8 ? 2 : 3);
