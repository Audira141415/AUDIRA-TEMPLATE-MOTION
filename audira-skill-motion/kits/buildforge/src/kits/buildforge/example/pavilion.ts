// BUILDFORGE technical example: a small steel-and-timber garden pavilion (6 × 4 m), built in the order a
// real crew would: set-out → excavation → pad footings → formwork → slab pour → steel columns → beams →
// timber roof boards → roof cap → back glazing → slatted side screen → bench → path → planting.
// It is a technical check and a starting point, not a story: never reuse it as a buyer's film.
//
// Every component has a seat, a placement method and what it bears on; timing lives in sequence.ts.

import { glazing } from "../geometry/openings.ts";
import { box, cast, merge, sub } from "../geometry/shapes.ts";
import { columnTree, roundTree, shrub } from "../environment/Vegetation.ts";
import type { SiteSpec } from "../environment/Terrain.ts";
import type { Component, Method, Piece, Vec3 } from "../types.ts";
import { LEAF } from "../presets/daylight.ts";

/* ───────────────────────── plan (metres) ───────────────────────── */

export const XS = [-3, 0, 3];
export const ZS = [-2, 2];
const HC = 0.08; // half column
export const LV = { pit: -0.4, footingTop: -0.12, slabBottom: -0.12, floor: 0.18, colTop: 3.0, beamTop: 3.24, boardsTop: 3.29, capTop: 3.4 };
export const SLAB = { x0: -3.5, x1: 3.5, z0: -2.5, z1: 2.5 };
export const PIT = { x0: SLAB.x0 - 0.3, x1: SLAB.x1 + 0.3, z0: SLAB.z0 - 0.3, z1: SLAB.z1 + 0.3 };
const COLUMNS: [number, number][] = XS.flatMap((x) => ZS.map((z) => [x, z] as [number, number]));

export const GARDEN_TREES: { at: Vec3; h: number; kind: "round" | "column"; seed: number }[] = [
  { at: [-6.6, 0, 1.2], h: 5.8, kind: "round", seed: 3 },
  { at: [6.9, 0, -1.6], h: 6.4, kind: "column", seed: 5 },
  { at: [6.4, 0, -4.6], h: 4.6, kind: "round", seed: 9 },
];
const SHRUBS: { at: Vec3; r: number; seed: number }[] = [
  { at: [-4.7, 0, 3.4], r: 0.5, seed: 21 },
  { at: [-2.0, 0, 3.7], r: 0.42, seed: 22 },
  { at: [2.1, 0, 3.9], r: 0.44, seed: 23 },
  { at: [4.4, 0, 3.0], r: 0.48, seed: 24 },
];

export const SITE: SiteSpec = {
  site: { x0: -10, x1: 10, z0: -8, z1: 11 },
  pit: PIT,
  depth: -LV.pit,
  slab: SLAB,
  beds: GARDEN_TREES.map((t) => ({ x0: t.at[0] - 1.1, x1: t.at[0] + 1.1, z0: t.at[2] - 1.0, z1: t.at[2] + 1.0 })),
  gravelBand: 0.35,
};

/* ───────────────────────── helpers ───────────────────────── */

const lowered = (height: number, rig: "single" | "sling" | "four" = "sling"): Method => ({ kind: "lower", height, rig });

/** A rigid element given by world min/max corners; its seat is the centre of its base. */
const elem = (
  id: string, phase: string, min: Vec3, max: Vec3,
  extra: Partial<Component> & { method: Method; material: string },
  make: (a: Vec3, b: Vec3) => ReturnType<typeof box> = cast,
): Component => {
  const at: Vec3 = [(min[0] + max[0]) / 2, min[1], (min[2] + max[2]) / 2];
  const lmin: Vec3 = [min[0] - at[0], 0, min[2] - at[2]];
  const lmax: Vec3 = [max[0] - at[0], max[1] - at[1], max[2] - at[2]];
  return { id, phase, at, part: { kind: "solid", build: () => [sub(make(lmin, lmax))], bounds: { min: lmin, max: lmax } }, ...extra };
};

/* ───────────────────────── 1 · set-out ───────────────────────── */

const setOut = (): Component[] => {
  const off = 1.2;
  const lines: { id: string; a: [number, number]; b: [number, number] }[] = [
    { id: "front", a: [SLAB.x0 - off, SLAB.z1], b: [SLAB.x1 + off, SLAB.z1] },
    { id: "back", a: [SLAB.x1 + off, SLAB.z0], b: [SLAB.x0 - off, SLAB.z0] },
    { id: "west", a: [SLAB.x0, SLAB.z0 - off], b: [SLAB.x0, SLAB.z1 + off] },
    { id: "east", a: [SLAB.x1, SLAB.z1 + off], b: [SLAB.x1, SLAB.z0 - off] },
  ];
  const out: Component[] = [];
  lines.forEach((l, li) =>
    [l.a, l.b].forEach((p, pi) =>
      out.push({
        id: `stake-${l.id}-${pi}`, phase: "setout", exit: "setout-out", key: li * 2 + pi,
        at: [p[0], 0, p[1]], material: "stake", method: { kind: "drive", depth: 0.35 },
        part: {
          kind: "solid",
          build: () => [sub(box([-0.03, -0.35, -0.03], [0.03, 0.52, 0.03])), sub(box([-0.034, 0.5, -0.034], [0.034, 0.58, 0.034]), "marker")],
          bounds: { min: [-0.034, -0.35, -0.034], max: [0.034, 0.58, 0.034] },
        },
      }),
    ),
  );
  lines.forEach((l, li) => {
    const dx = l.b[0] - l.a[0], dz = l.b[1] - l.a[1], L = Math.hypot(dx, dz);
    out.push({
      id: `string-${l.id}`, phase: "strings", exit: "strings-out", key: li,
      at: [l.a[0], 0.44, l.a[1]], rotY: Math.atan2(-dz, dx), material: "string", method: { kind: "draw" }, shadow: false,
      rests: [`stake-${l.id}-0`, `stake-${l.id}-1`],
      part: { kind: "solid", build: () => [sub(box([0, -0.008, -0.008], [L, 0.008, 0.008]))], bounds: { min: [0, -0.008, -0.008], max: [L, 0.008, 0.008] } },
    });
  });
  return out;
};

/* ───────────────────────── 2 · foundation ───────────────────────── */

const PAD = 0.4;
const foundation = (): Component[] => {
  const out: Component[] = [];
  COLUMNS.forEach(([x, z], i) =>
    out.push(elem(`pad-${x}-${z}`, "footings", [x - PAD, LV.pit + 0.01, z - PAD], [x + PAD, LV.footingTop, z + PAD], { method: { kind: "fill", cure: true }, material: "concrete", key: i }, box)),
  );
  const pads = out.map((c) => c.id);
  const fy0 = LV.slabBottom, fy1 = LV.floor + 0.06, t = 0.025;
  const forms: [string, Vec3, Vec3][] = [
    ["form-front", [SLAB.x0 - t, fy0, SLAB.z1], [SLAB.x1 + t, fy1, SLAB.z1 + t]],
    ["form-back", [SLAB.x0 - t, fy0, SLAB.z0 - t], [SLAB.x1 + t, fy1, SLAB.z0]],
    ["form-west", [SLAB.x0 - t, fy0, SLAB.z0], [SLAB.x0, fy1, SLAB.z1]],
    ["form-east", [SLAB.x1, fy0, SLAB.z0], [SLAB.x1 + t, fy1, SLAB.z1]],
  ];
  forms.forEach(([id, a, b], i) =>
    out.push(elem(id, "formwork", a, b, { method: { kind: "slide", from: [0, 1.1, 0] }, material: "plywood", exit: "strike", after: pads, key: i }, box)),
  );
  const s0: Vec3 = [SLAB.x0, 0, SLAB.z0], s1: Vec3 = [SLAB.x1, LV.floor - LV.slabBottom, SLAB.z1];
  out.push({
    id: "slab", phase: "slab", at: [0, LV.slabBottom, 0], material: "concrete",
    method: { kind: "spread", axis: "x", dir: 1, ramp: 1.0, cure: true },
    rests: pads, after: forms.map((f) => f[0]),
    part: { kind: "solid", build: () => [sub(box(s0, s1, [72, 1, 1]))], bounds: { min: s0, max: s1 } },
  });
  return out;
};

/* ───────────────────────── 3 · steel frame and roof ───────────────────────── */

const colId = (x: number, z: number) => `col-${x}-${z}`;
const xBeam = (z: number) => `beam-x${z}`;
const zBeam = (x: number) => `beam-z${x}`;

const frame = (): Component[] => {
  const out: Component[] = [];
  COLUMNS.forEach(([x, z]) =>
    out.push(elem(colId(x, z), "columns", [x - HC, LV.floor, z - HC], [x + HC, LV.colTop, z + HC], {
      method: lowered(7, "single"), material: "steel", rests: ["slab"], key: XS.indexOf(x),
    }, box)),
  );
  // two main beams along x, sitting on the column heads
  ZS.forEach((z, i) =>
    out.push(elem(xBeam(z), "beams", [XS[0] - 0.2, LV.colTop, z - 0.09], [XS[2] + 0.2, LV.beamTop, z + 0.09], {
      method: lowered(8), material: "steel", rests: XS.map((x) => colId(x, z)), key: i,
    }, box)),
  );
  // cross beams along z, between the main beams
  XS.forEach((x, i) =>
    out.push(elem(zBeam(x), "crossbeams", [x - 0.07, LV.colTop, ZS[0] + 0.09], [x + 0.07, LV.beamTop, ZS[1] - 0.09], {
      method: lowered(7), material: "steel", rests: ZS.map(xBeam), key: i,
    }, box)),
  );
  // timber roof boards laid one by one across the beams
  const boards: Piece[] = [];
  for (let x = -3.6, k = 0; x <= 3.6 + 1e-6; x += 0.2, k++)
    boards.push({ c: [x, (LV.beamTop + LV.boardsTop) / 2, 0], s: [0.19, LV.boardsTop - LV.beamTop, 5.4], tone: 0.9 + ((k * 37) % 11) / 70 });
  out.push({
    id: "roof-boards", phase: "roof", at: [0, 0, 0], material: "woodPiece",
    method: { kind: "lay", from: [0, 0.5, 0], each: 0.08 }, part: { kind: "pieces", pieces: boards },
    rests: [...ZS.map(xBeam), ...XS.map(zBeam)],
  });
  // thin roof cap lifted onto the boards
  out.push(elem("roof-cap", "cap", [-3.75, LV.boardsTop, -2.82], [3.75, LV.capTop, 2.82], {
    method: lowered(9, "four"), material: "render", rests: ["roof-boards"],
  }, (a, b) => cast(a, b, 0.02)));
  return out;
};

/* ───────────────────────── 4 · infill and fit-out ───────────────────────── */

const infill = (): Component[] => {
  const out: Component[] = [];
  const h = LV.colTop - LV.floor;
  // back wall: two glazed bays between the columns (outside is −z, so the unit is turned 180°)
  [[XS[0] + HC, XS[1] - HC], [XS[1] + HC, XS[2] - HC]].forEach(([x0, x1], i) => {
    const w = x1 - x0;
    out.push({
      id: `glazing-${i}`, phase: "glazing", key: i, at: [x1, LV.floor, ZS[0]], rotY: Math.PI, material: "frame",
      method: { kind: "slide", from: [0, 0, 1.6] },
      part: { kind: "solid", build: () => glazing(w, h, { maxPane: 1.0 }), bounds: { min: [0, 0, -0.05], max: [w, h, 0.05] } },
      rests: ["slab"], after: [xBeam(ZS[0])],
    });
  });
  // west side: a slatted timber screen, two rails then vertical slats
  const slats: Piece[] = [];
  const z0 = ZS[0] + HC, z1 = ZS[1] - HC, x = XS[0];
  for (const y of [LV.floor + 0.45, LV.colTop - 0.35]) slats.push({ c: [x + 0.045, y, (z0 + z1) / 2], s: [0.05, 0.05, z1 - z0], tone: 0.8 });
  for (let z = z0 + 0.04, k = 0; z <= z1 - 0.039; z += 0.11, k++) slats.push({ c: [x, (LV.floor + LV.colTop) / 2, z], s: [0.04, h, 0.05], tone: 0.92 + ((k * 29) % 9) / 70 });
  out.push({
    id: "screen", phase: "screen", at: [0, 0, 0], material: "woodPiece",
    method: { kind: "lay", from: [-0.8, 0, 0], each: 0.1 }, part: { kind: "pieces", pieces: slats },
    rests: ["slab"], after: [zBeam(XS[0])],
  });
  // a timber bench in front of the glazing
  const legs = [-1.8, 0, 1.8].map((lx) => box([lx - 0.05, 0, -0.18], [lx + 0.05, 0.4, 0.18]));
  out.push({
    id: "bench", phase: "bench", at: [0, LV.floor, -1.5], material: "wood",
    method: { kind: "slide", from: [0, 0.4, 1.2] },
    part: { kind: "solid", build: () => [sub(merge([...legs, box([-2, 0.4, -0.22], [2, 0.46, 0.22])]))], bounds: { min: [-2, 0, -0.22], max: [2, 0.46, 0.22] } },
    rests: ["slab"], after: ["glazing-0", "glazing-1"],
  });
  // stepping-stone path to the front
  const pavers: Piece[] = Array.from({ length: 7 }, (_, k) => ({ c: [0, 0.03, SLAB.z1 + 0.6 + k * 0.85], s: [1.4, 0.06, 0.6], tone: 0.95 + ((k * 7) % 5) / 50 }));
  out.push({ id: "path", phase: "paving", at: [0, 0, 0], material: "paver", method: { kind: "lay", from: [0, 0.35, 0], each: 0.22 }, part: { kind: "pieces", pieces: pavers } });
  return out;
};

/* ───────────────────────── 5 · planting ───────────────────────── */

const tree = (t: (typeof GARDEN_TREES)[number]): Component["part"] => ({
  kind: "solid",
  build: () => (t.kind === "round" ? roundTree(t.h, t.seed, LEAF.garden) : columnTree(t.h, t.seed, LEAF.garden)),
  bounds: { min: [-t.h * 0.3, 0, -t.h * 0.3], max: [t.h * 0.3, t.h, t.h * 0.3] },
});

const planting = (): Component[] => [
  ...GARDEN_TREES.map((t, i): Component => ({ id: `tree-${i}`, phase: "trees", key: i, at: t.at, material: "foliage", method: { kind: "grow" }, part: tree(t) })),
  ...SHRUBS.map((s, i): Component => ({
    id: `shrub-${i}`, phase: "shrubs", key: i, at: s.at, material: "foliage", method: { kind: "grow" },
    part: { kind: "solid", build: () => shrub(s.r, s.seed, LEAF.shrub), bounds: { min: [-s.r, 0, -s.r], max: [s.r, s.r * 1.4, s.r] } },
  })),
];

export const pavilionComponents = (): Component[] => [...setOut(), ...foundation(), ...frame(), ...infill(), ...planting()];
