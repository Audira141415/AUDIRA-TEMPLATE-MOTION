// The original pixel game "ORBIT ROVER": one shared level description drives BOTH the 2D raster drawn on
// the CRT and the 3D voxel world the camera dives into, so the transition is spatially continuous.
// Units: 1 game cell = 1 world unit. y = 0 is the top of the ground row.
import { clamp01 } from "./motion";

export const SPRITE = [
  ".....c......",
  ".....c......",
  "...cccccc...",
  "..cwwwwwwc..",
  "..cwbbbbwc..",
  "..cwbttbwc..",
  "..cwbbbbwc..",
  "...cccccc...",
  "..oooooooo..",
  ".ooyoooooyo.",
  ".oooooooooo.",
  "..oo....oo..",
  "..kk....kk..",
  ".kkk....kkk.",
];

export const SPRITE_COLORS: Record<string, string> = {
  c: "#2EF2FF", // helmet rim + antenna
  w: "#F4F1FF", // visor frame
  b: "#141432", // visor
  t: "#2EF2FF", // visor glint
  o: "#FF8A1F", // suit
  y: "#FFD23F", // suit lights
  k: "#2A2550", // boots
};

export interface Platform {
  x0: number;
  x1: number; // exclusive
  y: number; // top surface height
}

// ground with two pits, plus floating ledges
export const PLATFORMS: Platform[] = [
  { x0: -6, x1: 14, y: 0 },
  { x0: 17, x1: 29, y: 0 },
  { x0: 32, x1: 52, y: 0 },
  { x0: 9, x1: 13, y: 3 },
  { x0: 20, x1: 24, y: 3.0 },
  { x0: 26, x1: 30, y: 5 },
  { x0: 36, x1: 41, y: 4 },
];

export const COINS: [number, number][] = [
  [5, 1.2], [7, 1.2], [10.5, 4.3], [12, 4.3], [15.5, 3.2], [21, 4.2], [23, 4.2], [28.2, 6.0], [30.5, 3.0], [37.5, 5.2], [39, 5.2],
];

export const STAR: [number, number] = [34.4, 7.4];

// Hero run: constant speed, scripted jumps (start time s, duration s, apex height above take-off)
const SPEED = 3.25;
const X0 = 1.5;
const JUMPS: { at: number; dur: number; h: number; land: number }[] = [
  { at: 2.0, dur: 0.75, h: 3.6, land: 3 }, // onto the first ledge
  { at: 3.3, dur: 1.5, h: 1.4, land: 0 }, // off the ledge, over the first pit
  { at: 5.55, dur: 0.6, h: 3.6, land: 3 }, // second ledge
  { at: 6.8, dur: 0.75, h: 3.1, land: 5 }, // high ledge
  { at: 8.0, dur: 1.45, h: 1.2, land: 0 }, // long drop over the second pit
  { at: 9.6, dur: 1.0, h: 6.6, land: 4 }, // the big jump to the star
];

export const heroX = (t: number) => X0 + SPEED * t;

export const heroY = (t: number) => {
  let base = 0;
  for (const j of JUMPS) {
    if (t < j.at) return base;
    const k = (t - j.at) / j.dur;
    if (k <= 1) {
      // parabola from base to land with apex base + h
      const apex = base + j.h;
      const a = clamp01(k);
      const up = apex - base;
      const down = apex - j.land;
      return a < 0.5 ? base + up * (1 - Math.pow(1 - a * 2, 2)) : apex - down * Math.pow((a - 0.5) * 2, 2);
    }
    base = j.land;
  }
  return base;
};

export const isAirborne = (t: number) => JUMPS.some((j) => t >= j.at && t <= j.at + j.dur);

export const coinTaken = (t: number, cx: number) => heroX(t) > cx - 0.2;

export const score = (t: number) => COINS.filter(([x]) => coinTaken(t, x)).length * 100 + (t > 10.1 ? 5000 : 0) + 4200;
