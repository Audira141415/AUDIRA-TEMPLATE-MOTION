// Subject + cut + frame → complete film state. Pure and deterministic: the 3D world, the
// typography and the QA scripts all sample these functions. Object-specific knowledge comes
// only through the Subject contract; all timing lives in the cut.

import { Euler, Matrix4, Quaternion, Vector3 } from "three";
import { shotAt as rigShot } from "../../../core/camera/director.ts";
import type { Sweep } from "../../../core/materials/sweep.ts";
import { evaluate, type EraState } from "../morph/eraTimeline.ts";
import type { Tree } from "../morph/lerpTree.ts";
import { ease, mix, remap } from "../../../core/motion/easing.ts";
import { sample } from "../../../core/motion/track.ts";
import type { Shot } from "../../../core/render/Post.tsx";
import { PLINTH, type StudioLook } from "../../../core/studio/Studio.tsx";
import type { Cut } from "./cut.ts";
import type { Subject } from "./subject.ts";

const D = Math.PI / 180;
const HOVER = 2.2; // default gap between the object and the plinth

// ── object pose ────────────────────────────────────────────────────────────────
export const poseAt = <P extends Tree, Fx extends Record<string, number>>(subject: Subject<P, Fx>, cut: Cut<P, Fx>, x: number, p: P) => {
  const [pitch, roll] = sample(cut.tilt, x);
  // hover above the plinth by the object's own (rotated) extent, so it never sinks into it
  const below = subject.halfHeight(p, roll * D);
  const pos = new Vector3(0, PLINTH.top + (subject.hover ?? HOVER) + below, 0);
  const [yaw] = sample(cut.yaw, x);
  const q = new Quaternion().setFromEuler(new Euler(pitch * D, yaw * D, roll * D, "YXZ"));
  return { pos, q, matrix: new Matrix4().compose(pos, q, new Vector3(1, 1, 1)) };
};

// ── camera ─────────────────────────────────────────────────────────────────────
export const shotAt = <P extends Tree, Fx extends Record<string, number>>(cut: Cut<P, Fx>, x: number): Shot =>
  rigShot(cut.rig, x, { aperture: 0.0009, maxBlur: 0.004, exposure: 1.0 });

// ── materials ──────────────────────────────────────────────────────────────────
const sweepAt = <P extends Tree>(sweep: Record<string, [number, number]>, era: EraState<P>): Sweep => {
  if (!era.morph) return { progress: 0, top: 1, bottom: -1, band: 0 };
  const [a, b] = sweep[era.morph.from] ?? [0, 1];
  return { progress: ease.inOut(remap(era.t, a, b)), top: 1, bottom: -1, band: 1.4 };
};

// ── studio ─────────────────────────────────────────────────────────────────────
const WARM: [number, number, number] = [1.06, 0.97, 0.88];
const COOL: [number, number, number] = [0.9, 1.03, 1.03];
/** The studio warms for the past and cools for the future; `eras` = number of eras. */
const lookAt = (eraPos: number, eras: number, morphing: boolean): StudioLook => {
  const k = eraPos / (eras - 1); // 0 past … 1 future
  const tint: [number, number, number] = k < 0.5 ? (WARM.map((w) => mix(w, 1, k * 2)) as [number, number, number]) : (COOL.map((c) => mix(1, c, (k - 0.5) * 2)) as [number, number, number]);
  return {
    envRotation: 0.35,
    envIntensity: 1.0,
    keyAz: 18 * D,
    keyEl: 66 * D,
    keyIntensity: 1.5,
    tint,
    tintAmount: 0.9,
    ring: morphing ? 1 : 0,
  };
};

export type FilmState<P extends Tree, Fx extends Record<string, number>> = {
  era: EraState<P>;
  sweep: Sweep;
  pose: ReturnType<typeof poseAt>;
  shot: Shot;
  look: StudioLook;
  blob: { x: number; z: number; sx: number; sz: number; rot: number; opacity: number };
  /** World points the subject exposes (e.g. a spatial-UI anchor). */
  anchors: Record<string, Vector3>;
  fx: Fx;
};

export const stateAt = <P extends Tree, Fx extends Record<string, number>>(subject: Subject<P, Fx>, cut: Cut<P, Fx>, frame: number, fps: number): FilmState<P, Fx> => {
  const x = cut.clock(frame, fps);
  const era = evaluate(cut.evolution, x);
  const p = era.params;
  const pose = poseAt(subject, cut, x, p);
  const ringPulse = era.morph ? Math.sin(Math.PI * era.t) : 0;
  const look = lookAt(era.eraPos, subject.order.length, false);
  look.ring = ringPulse;
  const foot = subject.footprint(p);
  const fx = Object.fromEntries(Object.entries(cut.fx).map(([k, track]) => [k, Math.max(0, sample(track as Cut<P, Fx>["rig"], x)[0])])) as Fx;
  return {
    era,
    sweep: sweepAt(subject.sweep, era),
    pose,
    shot: shotAt(cut, x),
    look,
    blob: { x: pose.pos.x, z: pose.pos.z, sx: foot.w * 3.2, sz: foot.d * 3.2 + 1.2, rot: sample(cut.yaw, x)[0] * D, opacity: 0.32 },
    anchors: subject.anchors?.(p, pose.matrix) ?? {},
    fx,
  };
};
