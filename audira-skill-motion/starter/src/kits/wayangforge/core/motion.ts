// WAYANGFORGE motion core: everything derives from the 60-based frame clock `f`.

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const ramp = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const smooth = (x: number) => x * x * (3 - 2 * x);
export const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export const mulberry32 = (seed: number) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
export const vnoise = (x: number, seed = 0) => {
  const i = Math.floor(x);
  const fr = x - i;
  const a = hash(i + seed * 57.3);
  const b = hash(i + 1 + seed * 57.3);
  return a + (b - a) * smooth(fr);
};

/** Blencong oil-lamp position (in front of the kelir, above the dalang). */
export const BLENCONG: [number, number, number] = [0, 2.85, 1.75];
/** Kelir screen plane is z = 0, centred at y = 1.9. */
export const KELIR = { width: 5.0, height: 2.6, centerY: 1.9 };

/**
 * Project a puppet (centre point + size) from the blencong onto the kelir plane z=0.
 * Returns the shadow centre and its magnification k (closer to the lamp = bigger, softer).
 */
export const projectToKelir = (p: [number, number, number]) => {
  const [lx, ly, lz] = BLENCONG;
  const k = lz / (lz - p[2]);
  return { x: lx + (p[0] - lx) * k, y: ly + (p[1] - ly) * k, k };
};

export const blencongFlicker = (t: number) => 0.86 + 0.1 * vnoise(t * 6.5, 4) + 0.04 * vnoise(t * 17, 9);

export interface PuppetPose {
  pos: [number, number, number];
  rotZ: number;
  /** rotation about the rod (y) — the gunungan twirl */
  rotY: number;
  scale: number;
}

export interface WayangState {
  t: number;
  gunungan: PuppetPose;
  kesatria: PuppetPose;
  raksasa: PuppetPose;
  flame: number;
}

export const computeWayangState = (f: number): WayangState => {
  const t = f / 60;
  const bob = (ph: number, amp = 0.03) => Math.sin(t * 3.1 + ph) * amp;

  // Gunungan: twirls centre (hook), exits right, sweeps back huge for the closing payoff.
  const out = smooth(ramp(t, 2.0, 3.4));
  const back = smooth(ramp(t, 9.6, 11.0));
  const gx = lerp(lerp(0, 2.05, out), 0, back);
  const gz = lerp(lerp(0.45, 0.22, out), 1.05, back);
  const twirl = (1 - out) * Math.sin(t * 2.6) * 0.9 + back * Math.sin(t * 3.0) * 0.25;
  const gunungan: PuppetPose = { pos: [gx, 2.05 + bob(0, 0.02), gz], rotZ: lerp(0, -0.12, out) * (1 - back), rotY: twirl, scale: 1.0 };

  // Kesatria enters from the left, confronts, then steps toward the lamp (shadow swells).
  const kIn = easeInOut(ramp(t, 2.0, 4.0));
  const lunge = smooth(ramp(t, 8.6, 9.6));
  const kx = lerp(-3.1, -0.85, kIn) + Math.sin(t * 1.7) * 0.05 * kIn + lunge * 0.35;
  const kz = lerp(0.3, 0.75, lunge) * (1 - back * 0.4);
  const kesatria: PuppetPose = { pos: [kx, 2.0 + bob(1.2), kz], rotZ: Math.sin(t * 2.2) * 0.03 - lunge * 0.06, rotY: 0, scale: 1.0 };

  // Raksasa enters from the right, recoils and topples during the payoff.
  const rIn = easeInOut(ramp(t, 2.4, 4.4));
  const recoil = smooth(ramp(t, 9.2, 10.2));
  const rx = lerp(3.2, 0.95, rIn) + recoil * 0.8;
  const raksasa: PuppetPose = { pos: [rx, 1.98 + bob(2.4) - recoil * 0.25, 0.32], rotZ: -recoil * 0.55 + Math.sin(t * 2.0) * 0.03, rotY: 0, scale: 1.08 };

  return { t, gunungan, kesatria, raksasa, flame: blencongFlicker(t) };
};
