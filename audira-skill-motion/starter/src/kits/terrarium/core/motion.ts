// TERRARIUM motion core — the day-night cycle, soil height field and the snail's path (pure functions of t, s).
import * as THREE from "three";
import { TERRA_PALETTE as P } from "../lib/palette";

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

/** Jar dimensions. */
export const JAR = { r: 1.0, bodyH: 2.15, neckR: 0.6, top: 2.75, inner: 0.95 } as const;
export const SOIL_BASE = 0.5;

/** Soil surface height inside the jar: a mound at the back-left and a dip for the pool. */
export const POOL: [number, number] = [0.42, 0.34];
export const soilY = (x: number, z: number) => {
  const rim = 1 - Math.pow(clamp(Math.hypot(x, z) / JAR.inner), 4); // flat where soil meets the glass
  const mound = 0.2 * Math.exp(-((x + 0.32) ** 2 + (z + 0.22) ** 2) / 0.28) * rim;
  const ripple = 0.025 * Math.sin(x * 3.1 + 0.4) * Math.sin(z * 2.6 + 1.1) * rim;
  const pool = 0.07 * Math.exp(-((x - POOL[0]) ** 2 + (z - POOL[1]) ** 2) / 0.035);
  return SOIL_BASE + mound + ripple - pool;
};

/** Day-night cycle across 12 s: morning -> noon -> dusk -> night. Keys at seconds. */
const KEYS = [
  { t: 0, sky: P.skyMorning, sun: "#FFC98A", sunI: 2.0, amb: 0.55, elev: 0.35, night: 0 },
  { t: 3.5, sky: P.skyNoon, sun: "#FFF6E8", sunI: 2.8, amb: 0.7, elev: 1.25, night: 0 },
  { t: 6.8, sky: P.skyNoon, sun: "#FFF1DC", sunI: 2.6, amb: 0.65, elev: 1.0, night: 0 },
  { t: 8.6, sky: P.skyDusk, sun: "#FF8A4A", sunI: 1.8, amb: 0.4, elev: 0.25, night: 0.15 },
  { t: 9.8, sky: P.skyNight, sun: "#7FA2FF", sunI: 0.7, amb: 0.16, elev: 0.9, night: 1 },
  { t: 12, sky: P.skyNight, sun: "#7FA2FF", sunI: 0.7, amb: 0.16, elev: 0.9, night: 1 },
];

export const dayState = (t: number) => {
  const tt = clamp(t, 0, 12);
  let i = 0;
  while (i < KEYS.length - 2 && tt > KEYS[i + 1].t) i++;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const k = smooth((tt - a.t) / (b.t - a.t));
  const sky = new THREE.Color(a.sky).lerp(new THREE.Color(b.sky), k);
  const sun = new THREE.Color(a.sun).lerp(new THREE.Color(b.sun), k);
  const az = -1.2 + (tt / 12) * 2.6; // sun / moon travels across
  const elev = lerp(a.elev, b.elev, k);
  return {
    sky,
    sun,
    sunI: lerp(a.sunI, b.sunI, k),
    amb: lerp(a.amb, b.amb, k),
    night: lerp(a.night, b.night, k),
    sunPos: [Math.cos(az) * 6 * Math.cos(elev), 6 * Math.sin(elev) + 1, Math.sin(az) * 6 * Math.cos(elev)] as [number, number, number],
    label: tt < 2.5 ? "MORNING" : tt < 7 ? "MIDDAY" : tt < 9.2 ? "DUSK" : "NIGHT",
    clock: (() => {
      const hours = 6 + (tt / 12) * 17; // 06:00 -> 23:00
      const h = Math.floor(hours);
      const m = Math.floor((hours - h) * 60);
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    })(),
  };
};

/** The snail glides along the soil (slow, eased), body undulating. */
export const snailAt = (t: number) => {
  const k = smooth(t / 12) * 0.85 + (t / 12) * 0.15;
  const x = lerp(0.18, -0.3, k);
  const z = lerp(0.58, 0.12, k) + Math.sin(k * 3.2) * 0.05;
  const dx = lerp(0.18, -0.3, k + 0.01) - x;
  const dz = lerp(0.58, 0.12, k + 0.01) + Math.sin((k + 0.01) * 3.2) * 0.05 - z;
  return { x, z, y: soilY(x, z), heading: Math.atan2(dx, dz), wave: Math.sin(t * 4.5) };
};
