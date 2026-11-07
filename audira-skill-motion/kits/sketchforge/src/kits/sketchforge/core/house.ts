// Stroke model of the original "little house" (units: world, origin = centre of the footprint on the page).
// kind: edge = real silhouette line (drawn, then lifted into 3D wire); cons = construction guide (flat only);
// hatch = roof shading (flat only). Strokes are drawn in array order, each taking time ∝ its length.
import { V3, rng } from "./motion";

export type StrokeKind = "edge" | "cons" | "hatch";
export interface Stroke {
  a: V3;
  b: V3;
  kind: StrokeKind;
  start: number; // draw progress window
  end: number;
  liftDelay: number; // 0..0.55 within the extrude phase
  jitter: V3; // sketchy offset for the second pass
}

export const HOUSE = { hw: 1.1, hd: 0.8, wallH: 1.3, ridgeY: 2.1, eaveY: 1.1, eaveZ: 1.0, eaveX: 1.28 };

const rect = (out: [V3, V3, StrokeKind][], pts: V3[], kind: StrokeKind = "edge") => {
  for (let i = 0; i < pts.length; i++) out.push([pts[i], pts[(i + 1) % pts.length], kind]);
};

export const buildStrokes = (): Stroke[] => {
  const { hw, hd, wallH, ridgeY, eaveY, eaveZ, eaveX } = HOUSE;
  const raw: [V3, V3, StrokeKind][] = [];
  // construction guides first
  raw.push([[-2.1, 0, hd], [2.1, 0, hd], "cons"]);
  raw.push([[-2.1, 0, -hd], [2.1, 0, -hd], "cons"]);
  raw.push([[hw, 0, -1.9], [hw, 0, 1.9], "cons"]);
  raw.push([[-hw, 0, -1.9], [-hw, 0, 1.9], "cons"]);
  raw.push([[0, 0, 0], [0, 2.6, 0], "cons"]);
  raw.push([[hw, 0, -hd], [hw, wallH, hd], "cons"]);
  raw.push([[hw, 0, hd], [hw, wallH, -hd], "cons"]);
  // walls
  rect(raw, [[-hw, 0, -hd], [hw, 0, -hd], [hw, 0, hd], [-hw, 0, hd]]);
  for (const [x, z] of [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]]) raw.push([[x, 0, z], [x, wallH, z], "edge"]);
  rect(raw, [[-hw, wallH, -hd], [hw, wallH, -hd], [hw, wallH, hd], [-hw, wallH, hd]]);
  // gables
  for (const x of [-hw, hw]) {
    raw.push([[x, wallH, -hd], [x, ridgeY, 0], "edge"]);
    raw.push([[x, ridgeY, 0], [x, wallH, hd], "edge"]);
  }
  // roof
  raw.push([[-eaveX, ridgeY, 0], [eaveX, ridgeY, 0], "edge"]);
  for (const z of [-eaveZ, eaveZ]) {
    raw.push([[-eaveX, eaveY, z], [eaveX, eaveY, z], "edge"]);
    raw.push([[-eaveX, ridgeY, 0], [-eaveX, eaveY, z], "edge"]);
    raw.push([[eaveX, ridgeY, 0], [eaveX, eaveY, z], "edge"]);
  }
  // chimney
  const cx0 = 0.41, cx1 = 0.69, cz0 = -0.44, cz1 = -0.16, cy0 = 1.55, cy1 = 2.5;
  rect(raw, [[cx0, cy1, cz0], [cx1, cy1, cz0], [cx1, cy1, cz1], [cx0, cy1, cz1]]);
  for (const [x, z] of [[cx0, cz0], [cx1, cz0], [cx1, cz1], [cx0, cz1]]) raw.push([[x, cy0, z], [x, cy1, z], "edge"]);
  // door + porch
  rect(raw, [[-0.22, 0, hd], [-0.22, 0.78, hd], [0.22, 0.78, hd], [0.22, 0, hd]]);
  rect(raw, [[-0.45, 0.08, hd], [0.45, 0.08, hd], [0.45, 0.08, hd + 0.3], [-0.45, 0.08, hd + 0.3]]);
  // windows (front) with mullions
  for (const cx of [-0.68, 0.68]) {
    rect(raw, [[cx - 0.19, 0.5, hd], [cx + 0.19, 0.5, hd], [cx + 0.19, 0.92, hd], [cx - 0.19, 0.92, hd]]);
    raw.push([[cx, 0.5, hd], [cx, 0.92, hd], "edge"]);
    raw.push([[cx - 0.19, 0.71, hd], [cx + 0.19, 0.71, hd], "edge"]);
  }
  // side window
  rect(raw, [[hw, 0.5, -0.2], [hw, 0.5, 0.2], [hw, 0.92, 0.2], [hw, 0.92, -0.2]]);
  // roof hatching (front slope)
  for (let x = -1.15; x <= 1.16; x += 0.115) raw.push([[x, ridgeY - 0.05, 0.05], [x + 0.06, eaveY + 0.08, eaveZ - 0.08], "hatch"]);
  // side-wall hatching
  for (let z = -0.72; z <= 0.72; z += 0.1) raw.push([[hw + 0.005, 0.05, z], [hw + 0.005, wallH - 0.05, z + 0.12], "hatch"]);

  const len = (s: [V3, V3, StrokeKind]) => Math.hypot(s[1][0] - s[0][0], s[1][1] - s[0][1], s[1][2] - s[0][2]) * (s[2] === "hatch" ? 0.35 : 1);
  const total = raw.reduce((a, s) => a + len(s), 0);
  const r = rng(63);
  let acc = 0;
  return raw.map((s) => {
    const l = len(s);
    const start = acc / total;
    acc += l;
    const avgY = (s[0][1] + s[1][1]) / 2;
    return {
      a: s[0],
      b: s[1],
      kind: s[2],
      start,
      end: acc / total,
      liftDelay: 0.55 * Math.min(1, avgY / 2.5),
      jitter: [(r() - 0.5) * 0.03, (r() - 0.5) * 0.02, (r() - 0.5) * 0.03] as V3,
    };
  });
};
