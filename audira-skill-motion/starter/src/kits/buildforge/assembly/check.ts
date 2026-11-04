// Construction-sequence QA without a GPU. Schedules the components, then checks
//  1. order — nothing starts before what it bears on (or must follow) is complete, and temporary
//     works are not struck while something still bears on them;
//  2. clashes — no two installed solids overlap in volume while both are on site (parts that
//     legitimately touch share faces, which is not an overlap);
//  3. timing — every component is in place before `end` (construction-clock units).
// Rotations other than multiples of 90° are checked with their axis-aligned envelope.

import { schedule, validate, type PhaseWindow, type Timeline } from "./schedule.ts";
import type { Component, Vec3 } from "../types.ts";

export type CheckResult = {
  ok: boolean;
  components: number;
  timeline: Timeline;
  order: string[];
  clashes: string[];
  late: string[];
};

type Box = { min: number[]; max: number[] };

const toWorld = (c: Component, [a, b]: [Vec3, Vec3]): Box => {
  const r = c.rotY ?? 0, cos = Math.cos(r), sin = Math.sin(r);
  const xs: number[] = [], zs: number[] = [];
  for (const x of [a[0], b[0]]) for (const z of [a[2], b[2]]) { xs.push(x * cos + z * sin + c.at[0]); zs.push(-x * sin + z * cos + c.at[2]); }
  return { min: [Math.min(...xs), c.at[1] + a[1], Math.min(...zs)], max: [Math.max(...xs), c.at[1] + b[1], Math.max(...zs)] };
};

const boxesOf = (c: Component): [Vec3, Vec3][] =>
  c.part.kind === "solid"
    ? c.part.boxes ?? [[c.part.bounds.min, c.part.bounds.max]]
    : c.part.pieces.filter((p) => !p.instant).map((p) => [p.c.map((v, k) => v - p.s[k] / 2) as Vec3, p.c.map((v, k) => v + p.s[k] / 2) as Vec3]);

/**
 * `skip` leaves components out of the clash test only (set-out on open ground, reinforcement cast
 * into a slab, planting). Planting (`grow`) is always skipped.
 */
export const checkSequence = (components: Component[], windows: PhaseWindow[], o: { end: number; skip?: (c: Component) => boolean; eps?: number }): CheckResult => {
  const timeline = schedule(components, windows);
  const order = validate(components, timeline);
  const EPS = o.eps ?? 0.004;
  const skip = (c: Component) => c.method.kind === "grow" || (o.skip?.(c) ?? false);
  const solids = components.filter((c) => !skip(c)).map((c) => {
    const bs = boxesOf(c).map((b) => toWorld(c, b));
    const env = { min: [0, 1, 2].map((k) => Math.min(...bs.map((b) => b.min[k]))), max: [0, 1, 2].map((k) => Math.max(...bs.map((b) => b.max[k]))) };
    return { c, bs, env, s: timeline.get(c.id)! };
  });
  const hit = (a: Box, b: Box) => [0, 1, 2].every((k) => Math.min(a.max[k], b.max[k]) - Math.max(a.min[k], b.min[k]) > EPS);
  const clashes: string[] = [];
  for (let i = 0; i < solids.length; i++)
    for (let j = i + 1; j < solids.length; j++) {
      const A = solids[i], B = solids[j];
      const aOut = A.s.out?.[1] ?? Infinity, bOut = B.s.out?.[1] ?? Infinity;
      if (A.s.start >= bOut || B.s.start >= aOut || !hit(A.env, B.env)) continue;
      const pair = A.bs.flatMap((a) => B.bs.filter((b) => hit(a, b)).map((b) => [a, b] as const))[0];
      if (pair) {
        const ov = [0, 1, 2].map((k) => Math.min(pair[0].max[k], pair[1].max[k]) - Math.max(pair[0].min[k], pair[1].min[k]));
        clashes.push(`${A.c.id} × ${B.c.id}  overlap ${ov.map((v) => v.toFixed(3)).join(" ")} at ${pair[0].min.map((v) => v.toFixed(2)).join(",")}`);
      }
    }
  const late = components.filter((c) => timeline.get(c.id)!.end > o.end).map((c) => c.id);
  return { ok: !order.length && !clashes.length && !late.length, components: components.length, timeline, order, clashes, late };
};

export const report = (id: string, r: CheckResult, windows: number) => {
  console.log(`[${id}] ${r.components} components, ${windows} phases`);
  for (const i of r.order) console.log(`order: ${i}`);
  for (const c of r.clashes.slice(0, 40)) console.log(`clash ${c}`);
  if (r.late.length) console.log(`finishes after the end: ${r.late.join(", ")}`);
  console.log(r.ok ? `[${id}] OK: sequence is physically ordered, no clashes, finishes in time` : `[${id}] FAIL: ${r.order.length} order issues, ${r.clashes.length} clashes, ${r.late.length} late`);
  return r.ok;
};
