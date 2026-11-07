// DISASTERSIM motion core — cross-section profiles, the slip event and the tsunami wave, all pure functions of t (s).
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const smooth = (k: number) => {
  const x = clamp(k);
  return x * x * (3 - 2 * x);
};
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

/** Block extents: x across the margin (ocean -> land), z is the block depth, front cut face at z = +HALF_D. */
export const BLOCK = { x0: -4, x1: 4, halfD: 1.8, bottom: -4.6 } as const;

const pl = (pts: [number, number][], x: number) => {
  if (x <= pts[0][0]) return pts[0][1];
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i];
    const [bx, by] = pts[i + 1];
    if (x <= bx) {
      const k = (x - ax) / (bx - ax);
      const s = k * k * (3 - 2 * k);
      return lerp(ay, by, 0.35 * k + 0.65 * s);
    }
  }
  return pts[pts.length - 1][1];
};

/** Seafloor / land surface height. Coastline where it crosses 0 (x ≈ 1.95). */
export const LAND_PTS: [number, number][] = [
  [-4, -0.9],
  [0, -0.9],
  [0.8, -0.55],
  [1.6, -0.16],
  [2.1, 0.08],
  [2.6, 0.22],
  [3.2, 0.58],
  [4, 0.95],
];
export const surfaceY = (x: number) => pl(LAND_PTS, x);
export const COAST_X = 1.95;

/** Top of the subducting oceanic slab (bends down under the continent). */
export const slabTop = (x: number) => (x <= 0 ? -0.9 : x <= 2 ? -0.9 - 0.5 * x : -1.9 - 0.7 * (x - 2));
export const SLAB_THICK = 0.6;

/** Event timing (s). */
export const EVENT = {
  slip: 2.6, // megathrust rupture
  magDone: 3.6,
  routeOn: 5.6, // evacuation route appears
  arrive: 8.6, // wave reaches the shoreline
};

/** Elastic rebound of the continental edge at the slip (units). */
export const rebound = (t: number) => {
  const d = t - EVENT.slip;
  if (d < 0) return { x: -0.04 * seg(t, 0, EVENT.slip), y: -0.025 * seg(t, 0, EVENT.slip) };
  const k = Math.exp(-d * 6) * Math.cos(d * 26);
  return { x: 0.03 - 0.07 * k, y: 0.02 - 0.045 * k };
};

/** Stress on the locked fault 0..1 before slip, then released. */
export const stress = (t: number) => (t < EVENT.slip ? seg(t, 0.2, EVENT.slip) : Math.exp(-(t - EVENT.slip) * 2.5));

/** Camera shake amplitude (only around the rupture). */
export const shake = (t: number) => {
  const d = t - EVENT.slip;
  if (d < 0 || d > 1.4) return [0, 0];
  const a = 0.05 * Math.exp(-d * 3.5);
  return [Math.sin(d * 61) * a, Math.sin(d * 47 + 1) * a * 0.7];
};

/** Tsunami: one landward pulse (slows and steepens in shallow water) + one seaward pulse. */
export const waveH = (x: number, z: number, t: number) => {
  const calm = 0.012 * Math.sin(x * 3.1 + t * 1.7) + 0.008 * Math.sin(z * 4.3 - t * 1.3 + x);
  const ts = t - EVENT.slip;
  if (ts < 0) return calm;
  const birth = smooth(ts / 0.6);
  // landward pulse: position along the margin, slows as depth decreases
  const travel = clamp(ts / (EVENT.arrive - EVENT.slip));
  const xl = lerp(-0.3, COAST_X + 0.05, 1 - Math.pow(1 - travel, 1.35));
  const shoal = 1 + 0.9 * smooth((xl + 0.3) / 2.3);
  const after = ts > EVENT.arrive - EVENT.slip ? Math.exp(-(ts - (EVENT.arrive - EVENT.slip)) * 0.9) : 1;
  const wl = lerp(0.62, 0.3, smooth((xl + 0.3) / 2.3));
  const front = Math.exp(-Math.pow((x - xl) / wl, 2)) * 0.15 * shoal * birth * after;
  // seaward pulse
  const xs = -0.3 - 0.55 * ts;
  const back = Math.exp(-Math.pow((x - xs) / 0.7, 2)) * 0.11 * birth * Math.exp(-ts * 0.18);
  // small across-block variation so the crest is not a ruler line
  const wob = 1 + 0.08 * Math.sin(z * 2.2 + x * 1.3);
  return calm + (front + back) * wob;
};

/** Warning level 0..3 (MONITORING, ADVISORY, WARNING, EVACUATE). */
export const warnLevel = (t: number) => (t < EVENT.slip + 0.3 ? 0 : t < 4.4 ? 1 : t < EVENT.routeOn ? 2 : 3);

/** Magnitude counter 0 -> 7.8 (fictional scenario). */
export const magnitude = (t: number) => 7.8 * seg(t, EVENT.slip, EVENT.magDone);
