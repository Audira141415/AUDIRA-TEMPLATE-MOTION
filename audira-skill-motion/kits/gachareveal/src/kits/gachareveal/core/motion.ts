// GACHAREVEAL motion core — pure functions of the 60-FPS-normalised frame `f`.
// Anticipation (shake) → escalation (rarity tiers) → burst → card rise → flip → hero settle.

import * as THREE from "three";

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
export const easeOutCubic = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);
export const easeOutBack = (x: number, k = 1.6) => {
  const t = clamp01(x) - 1;
  return 1 + (k + 1) * t * t * t + k * t * t;
};

export const mulberry32 = (seed: number) => () => {
  let s = (seed = (seed + 0x6d2b79f5) | 0);
  s = Math.imul(s ^ (s >>> 15), s | 1);
  s ^= s + Math.imul(s ^ (s >>> 7), s | 61);
  return ((s ^ (s >>> 14)) >>> 0) / 4294967296;
};

// ---- Story clock (seconds) ----
export const TIERS = [
  { at: 1.8, color: "#3D8BFF", label: "LANGKA" },
  { at: 3.4, color: "#B04DFF", label: "EPIK" },
  { at: 5.0, color: "#FFC23D", label: "LEGENDARIS" },
];
export const BURST = 6.0;
export const RISE = [6.15, 7.7];
export const SPIN = [5.5, 8.9];
export const FLIP = [8.45, 9.45];

/** Current rarity tier index (−1 before the first tier). */
export const tierIndex = (t: number) => TIERS.reduce((acc, tr, i) => (t >= tr.at ? i : acc), -1);

/** Rarity colour with a short cross-fade at each upgrade. */
export const rarityColor = (t: number) => {
  const c = new THREE.Color("#5A6BFF").multiplyScalar(0.5);
  TIERS.forEach((tr) => c.lerp(new THREE.Color(tr.color), smooth(win(t, tr.at - 0.15, tr.at + 0.25))));
  return c;
};

/** Flash 1 → 0 right after each tier upgrade and the burst. */
export const flash = (t: number) => {
  let v = 0;
  for (const tr of TIERS) {
    const a = t - tr.at;
    if (a >= 0) v = Math.max(v, Math.exp(-a * 6));
  }
  const b = t - BURST;
  if (b >= 0) v = Math.max(v, 1.4 * Math.exp(-b * 3.5));
  return v;
};

/** Capsule shake: grows with each tier, stops at the burst. */
export const shake = (t: number) => {
  if (t >= BURST) return { x: 0, z: 0, rz: 0 };
  const amp = 0.015 + 0.03 * (tierIndex(t) + 1) + 0.05 * smooth(win(t, BURST - 0.8, BURST));
  const k = Math.floor(t * 30);
  const r = mulberry32(k * 977 + 3);
  return { x: (r() - 0.5) * amp, z: (r() - 0.5) * amp, rz: (r() - 0.5) * amp * 2.5 };
};
