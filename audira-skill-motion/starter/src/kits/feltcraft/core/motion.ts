// FELTCRAFT motion core — pure functions of the 60-FPS-normalised frame `f`.
// Puppets move "on twos" like stop-motion (12 poses per second); the camera stays smooth.

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const win = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const smooth = (x: number) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};
export const easeInOutCubic = (x: number) => {
  const t = clamp01(x);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};
export const easeOutBack = (x: number, k = 1.7) => {
  const t = clamp01(x) - 1;
  return 1 + (k + 1) * t * t * t + k * t * t;
};

export const mulberry32 = (seed: number) => () => {
  let s = (seed = (seed + 0x6d2b79f5) | 0);
  s = Math.imul(s ^ (s >>> 15), s | 1);
  s ^= s + Math.imul(s ^ (s >>> 7), s | 61);
  return ((s ^ (s >>> 14)) >>> 0) / 4294967296;
};

export const STOP_FPS = 12;
/** Quantise seconds to stop-motion poses. */
export const stepT = (t: number, fps = STOP_FPS) => Math.floor(t * fps) / fps;
/** Tiny per-pose hand-placement jitter (seeded by the pose index, deterministic). */
export const poseJitter = (t: number, seed: number, amp = 0.006) => {
  const r = mulberry32(Math.floor(t * STOP_FPS) * 131 + seed);
  return [(r() - 0.5) * amp, (r() - 0.5) * amp, (r() - 0.5) * amp] as const;
};

// ---- Story clock (seconds) ----
export const POP_UP = [0.5, 1.6]; // fox pops up from behind the front hillock
export const HOP = [2.2, 6.9]; // hops along the stitched path
export const BUMP = 7.4; // bumps the yarn tree
export const APPLE_DROP = [7.9, 8.75];
export const CATCH = 8.75;
export const RAISE = [9.3, 10.2];
export const HEARTS = 10.0;

export const FOX_START = { x: -1.25, z: 0.55 };
export const FOX_END = { x: 0.72, z: 0.35 };

export interface FoxPose {
  x: number;
  y: number;
  z: number;
  squash: number;
  yaw: number;
  armLift: number; // 0 = down, 1 = holding apple above head
  earTwitch: number;
  holding: boolean;
}

export const computeFoxPose = (f: number): FoxPose => {
  const t = stepT(f / 60);
  const pop = easeOutBack(win(t, POP_UP[0], POP_UP[1]));
  const hopP = win(t, HOP[0], HOP[1]);
  const hops = 6;
  const phase = hopP * hops;
  const inHop = hopP > 0 && hopP < 1;
  const arc = inHop ? Math.sin((phase % 1) * Math.PI) : 0;
  const x = lerp(FOX_START.x, FOX_END.x, (Math.floor(phase) + smooth(phase % 1)) / hops);
  const z = lerp(FOX_START.z, FOX_END.z, hopP);
  const y = lerp(-0.9, 0, pop) + arc * 0.28;
  const landing = inHop ? Math.max(0, 1 - (phase % 1) * 5) : 0;
  const bump = Math.max(0, 1 - Math.abs(t - BUMP) / 0.25);
  const catchSquash = Math.max(0, 1 - Math.abs(t - CATCH) / 0.25);
  const squash = landing * 0.18 + bump * 0.12 + catchSquash * 0.15 - arc * 0.08;
  const yaw = t < HOP[0] ? 0.25 : t < HOP[1] + 0.2 ? 0.75 : lerp(0.75, 0.15, win(t, HOP[1] + 0.2, CATCH));
  const armLift = t >= CATCH ? 0.45 + 0.55 * easeOutBack(win(t, RAISE[0], RAISE[1])) : 0;
  const earTwitch = Math.sin(t * 9) * (t % 2.5 < 0.4 ? 0.25 : 0);
  return { x, y, z, squash, yaw, armLift, earTwitch, holding: t >= CATCH };
};
