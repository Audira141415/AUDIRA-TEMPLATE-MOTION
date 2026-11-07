import { lerp, smooth, track } from "../core/motion";
import type { StainedShot } from "../lib/post";

/**
 * Reverent pull-back: starts nose-to-glass on the rose's golden heart while the first panes seat,
 * glides back through the nave as the lancet assembles top-down, then sinks low so the coloured
 * light pools on the floor lead the eye up to the finished window.
 */
const POS = [
  { t: 0, v: [0.25, 2.7, 3.1] as [number, number, number] },
  { t: 2.2, v: [0.6, 2.2, 4.4] as [number, number, number] },
  { t: 5, v: [1.5, 0.4, 8.2] as [number, number, number] },
  { t: 8, v: [0.8, -1.2, 10.8] as [number, number, number] },
  { t: 10.5, v: [-0.6, -1.8, 12.0] as [number, number, number] },
  { t: 12, v: [-1.0, -2.0, 12.4] as [number, number, number] },
];
const TARGET = [
  { t: 0, v: [0, 2.75, 0] as [number, number, number] },
  { t: 2.2, v: [0, 2.5, 0] as [number, number, number] },
  { t: 5, v: [0, 1.3, 0] as [number, number, number] },
  { t: 8, v: [0, -0.2, 0.8] as [number, number, number] },
  { t: 10.5, v: [0, -1.1, 1.0] as [number, number, number] },
  { t: 12, v: [0, -1.1, 1.0] as [number, number, number] },
];

export const getStainedCamera = (t: number): StainedShot => ({
  pos: track(POS, t),
  target: track(TARGET, t),
  fov: lerp(38, 60, smooth(1.5, 9.5, t)),
  roll: Math.sin(t * 0.35) * 0.012,
  exposure: 1.05,
});
