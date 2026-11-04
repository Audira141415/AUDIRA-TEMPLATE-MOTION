// Construction timeline evaluation: given a component, its slot and the frame, where is it
// and what does it look like. Pure functions of the frame number, so renders are
// deterministic and any frame can be rendered alone.

import { bezier, ease, remap } from "../motion/easing.ts";
import type { Slot } from "./schedule.ts";
import type { Component, Vec3 } from "../types.ts";

export type RigState = { kind: "single" | "sling" | "four"; lift: number; alpha: number };

export type CompState = {
  visible: boolean;
  /** Linear progress of the arrival (reversed while leaving). */
  lin: number;
  /** Eased progress for methods the renderer completes (spread, coat). */
  u: number;
  offset: Vec3;
  scale: Vec3;
  yaw: number;
  opacity: number;
  /** Fresh concrete: 1 just poured, 0 cured. */
  wet: number;
  ghost: number;
  rig: RigState | null;
};

/** Crane set-down: steady descent, very long soft landing. */
const craneDown = bezier(0.38, 0, 0.1, 1);
const install = bezier(0.3, 0, 0.12, 1);
export const RIG_LIFT = 11;
export const GHOST_LEAD = 14;
const CURE = 45;

export const stateOf = (c: Component, slot: Slot, f: number): CompState => {
  const m = c.method;
  let lin = remap(f, slot.start, slot.end);
  const leaving = slot.out && f > slot.out[0] ? remap(f, slot.out[0], slot.out[1]) : 0;
  if (leaving > 0) lin = 1 - leaving;
  const gone = slot.out !== undefined && f >= slot.out[1];
  const s: CompState = {
    visible: f > slot.start && !gone,
    lin,
    u: lin,
    offset: [0, 0, 0],
    scale: [1, 1, 1],
    yaw: 0,
    opacity: 1,
    wet: 0,
    ghost: 0,
    rig: null,
  };
  const cure = () => (f < slot.start ? 0 : 1 - remap(f, slot.end, slot.end + CURE));

  switch (m.kind) {
    case "lower": {
      const u = craneDown(lin);
      // a suspended load swings a little and settles as it is guided onto its seat
      const swing = (1 - lin) ** 2;
      s.offset = [0.08 * Math.sin(lin * 9) * swing, m.height * (1 - u), 0.06 * Math.sin(lin * 7 + 1) * swing];
      s.yaw = 0.05 * Math.sin(lin * 6.5) * swing;
      s.opacity = remap(lin, 0, 0.1);
      if (leaving > 0) s.rig = { kind: m.rig, lift: 0, alpha: s.opacity };
      else if (f > slot.start && f < slot.end + RIG_LIFT) {
        const lift = remap(f, slot.end, slot.end + RIG_LIFT);
        s.rig = { kind: m.rig, lift: ease.in(lift), alpha: s.opacity * (1 - remap(lift, 0.25, 1)) };
      }
      break;
    }
    case "slide": {
      const u = install(lin);
      s.offset = [m.from[0] * (1 - u), m.from[1] * (1 - u), m.from[2] * (1 - u)];
      s.opacity = remap(lin, 0, 0.25);
      break;
    }
    case "fill":
      s.u = ease.inOut(lin);
      s.scale = [1, Math.max(1e-3, s.u), 1];
      if (m.cure) s.wet = cure();
      break;
    case "spread":
      s.u = ease.sine(lin);
      if (m.cure) s.wet = cure();
      break;
    case "drive": {
      // carried in and stood up (first 30 %), then three blows
      const carry = remap(lin, 0, 0.3);
      const k = remap(lin, 0.3, 1) * 3;
      const blows = (Math.min(2, Math.floor(k)) + ease.out(remap(k - Math.min(2, Math.floor(k)), 0, 0.35))) / 3;
      s.offset = [0, m.depth * (1 - blows) + 0.5 * (1 - ease.out(carry)), 0];
      s.opacity = remap(lin, 0, 0.15);
      break;
    }
    case "draw":
      s.scale = [Math.max(1e-3, ease.inOut(lin)), 1, 1];
      break;
    case "grow": {
      const g = 0.04 + 0.96 * ease.release(lin);
      s.scale = [g, g, g];
      s.opacity = remap(lin, 0, 0.12);
      break;
    }
    case "coat":
      s.u = ease.inOut(lin);
      break;
    case "lay":
      break;
  }
  if (leaving > 0) s.opacity *= 1 - remap(leaving, 0.7, 1);
  const ghosted = c.ghost ?? !["drive", "draw", "grow"].includes(m.kind);
  if (ghosted && leaving === 0) s.ghost = remap(f, slot.start - GHOST_LEAD, slot.start) * (1 - remap(lin, 0.55, 0.97));
  return s;
};

/** Per-piece move inside a "lay" component: returns local progress (0 hidden … 1 seated). */
export const pieceProgress = (i: number, n: number, lin: number, each: number) => {
  const t0 = n > 1 ? (i / (n - 1)) * (1 - each) : 0;
  return remap(lin, t0, t0 + each);
};
