// ANATOMIX motion core — heartbeat, reveal timing and blood-flow paths (all pure functions of t in seconds).
import * as THREE from "three";

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

export const BPM = 72;
const HZ = BPM / 60;

/** Lub-dub envelope: lub (ventricles) at phase 0, dub at phase 0.32. Returns { lub, dub, phase }. */
export const beat = (t: number) => {
  const ph = (t * HZ) % 1;
  const g = (c: number, w: number) => Math.exp(-Math.pow((ph - c) / w, 2));
  return { lub: g(0.06, 0.07) + g(1.06, 0.07), dub: g(0.34, 0.06), phase: ph };
};

/** Timeline (s). */
export const TL = {
  reveal: [1.8, 4.2] as [number, number], // outer wall turns translucent
  blue: 2.4, // right-heart circuit appears
  red: 5.0, // left-heart circuit appears
  labels: [5.6, 6.4, 7.2, 8.0],
  payoff: 8.8,
};

/** Outer-wall opacity: opaque hook, translucent from ~4 s. */
export const wallOpacity = (t: number) => lerp(1, 0.22, seg(t, TL.reveal[0], TL.reveal[1]));

type P3 = [number, number, number];
const curve = (pts: P3[]) => new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)), false, "centripetal");

/** Vessel centre-lines (also used by the particles). */
export const VESSELS = {
  aorta: curve([[0.12, 0.3, 0.03], [0.1, 1.3, 0.05], [-0.08, 1.62, -0.1], [0.3, 1.52, -0.45], [0.45, 0.7, -0.6], [0.45, -0.8, -0.6]]),
  brachio: curve([[-0.05, 1.58, -0.12], [-0.12, 1.85, -0.12], [-0.15, 2.1, -0.12]]),
  carotid: curve([[0.15, 1.6, -0.3], [0.18, 1.85, -0.3], [0.2, 2.08, -0.3]]),
  pulmonary: curve([[0, 0.2, 0.38], [0.02, 0.95, 0.4], [0.35, 1.15, 0.25], [0.85, 1.2, 0.05]]),
  pulmonaryR: curve([[0.02, 0.95, 0.4], [-0.35, 1.12, 0.25], [-0.85, 1.15, 0.1]]),
  svc: curve([[-0.55, 1.75, 0], [-0.52, 0.9, 0], [-0.5, 0.5, 0.02]]),
  ivc: curve([[-0.5, -1.4, -0.1], [-0.5, -0.6, -0.02], [-0.5, -0.2, 0]]),
  pvein1: curve([[1.2, 0.5, -0.2], [0.85, 0.47, -0.17], [0.55, 0.42, -0.15]]),
  pvein2: curve([[1.15, 0.22, -0.35], [0.85, 0.26, -0.27], [0.55, 0.3, -0.2]]),
};

/** Blood paths through chambers and vessels. */
export const BLUE_PATHS = [
  curve([[-0.55, 1.75, 0], [-0.52, 0.9, 0], [-0.48, 0.35, 0.05], [-0.3, -0.2, 0.2], [-0.15, -0.5, 0.25], [0, 0.2, 0.38], [0.05, 0.95, 0.4], [0.35, 1.15, 0.25], [0.85, 1.2, 0.05]]),
  curve([[-0.5, -1.4, -0.1], [-0.5, -0.3, 0], [-0.48, 0.3, 0.05], [-0.3, -0.25, 0.2], [-0.1, -0.4, 0.25], [0, 0.25, 0.38], [0.02, 0.95, 0.4], [-0.35, 1.12, 0.25], [-0.85, 1.15, 0.1]]),
];
export const RED_PATHS = [
  curve([[1.2, 0.5, -0.2], [0.55, 0.42, -0.15], [0.3, -0.1, -0.05], [0.3, -0.6, -0.05], [0.15, -0.2, 0], [0.1, 0.4, 0.05], [0.1, 1.3, 0.05], [-0.08, 1.62, -0.1], [0.3, 1.52, -0.45], [0.45, 0.7, -0.6], [0.45, -0.8, -0.6]]),
  curve([[1.15, 0.22, -0.35], [0.5, 0.3, -0.2], [0.3, -0.15, -0.05], [0.28, -0.55, 0], [0.12, -0.1, 0.02], [0.1, 0.5, 0.05], [0.05, 1.35, 0.0], [-0.06, 1.6, -0.12], [-0.15, 2.1, -0.12]]),
];

/** Flow phase: steady drift plus a surge on every lub (blood is pushed, not streamed). */
export const flowPhase = (t: number) => {
  const cyc = t * HZ;
  const whole = Math.floor(cyc);
  const frac = cyc - whole;
  const surge = smooth(clamp(frac / 0.35));
  return (whole + surge) * 0.085 + t * 0.03;
};

/** Label anchors in world space (the overlay projects them to the screen). */
export const ANCHORS: { name: string; sub: string; p: P3; side: -1 | 1; color: string }[] = [
  { name: "AORTA", sub: "to the body", p: [-0.02, 1.62, -0.1], side: 1, color: "#FF3B4A" },
  { name: "PULMONARY ARTERY", sub: "to the lungs", p: [-0.55, 1.13, 0.2], side: -1, color: "#3B7BFF" },
  { name: "RIGHT ATRIUM", sub: "receives blue", p: [-0.5, 0.35, 0.1], side: -1, color: "#3B7BFF" },
  { name: "LEFT VENTRICLE", sub: "strongest wall", p: [0.32, -0.5, 0.0], side: 1, color: "#FF3B4A" },
];

/** Deform a unit-sphere point into a stylised heart (apex down and to the patient's left = +x). */
export const heartify = (v: THREE.Vector3) => {
  let { x, y, z } = v;
  if (y < 0) {
    const k = 1 + y * 0.52;
    x *= k;
    z *= k;
    x += 0.32 * y * y;
    y *= 1.2;
  } else {
    x *= 1.12;
    z *= 0.95;
    y *= 0.9;
  }
  // interventricular groove on the front face
  const n = new THREE.Vector3(1, 0.4, 0).normalize();
  const d = x * n.x + y * n.y;
  if (z > 0) {
    const g = Math.max(0, 1 - Math.abs(d - 0.08) / 0.14);
    z -= 0.05 * g;
  }
  v.set(x * 0.98, y - 0.1, z * 0.92);
  return v;
};
