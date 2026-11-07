import { mulberry32 } from "../core/motion";

// Original embroidery motif: a five-petal flower (bunga raya-like, stylised), two leaves,
// a stem, a gold songket-style diamond ring and gold couched petal outlines.
// Coordinates are on the fabric plane: x right, z toward the viewer (y is up out of the cloth).

export type ThreadGroup = "crimson" | "vermilion" | "blush" | "leaf" | "moss" | "gold";

export interface Stitch {
  a: [number, number];
  b: [number, number];
  /** start time in seconds */
  start: number;
  group: ThreadGroup;
  /** thread radius */
  r: number;
}

export interface Knot {
  p: [number, number];
  start: number;
}

const rot = (x: number, z: number, a: number): [number, number] => [x * Math.cos(a) - z * Math.sin(a), x * Math.sin(a) + z * Math.cos(a)];

export const FLOWER_CENTER: [number, number] = [0.08, -0.12];

const schedule = (list: Omit<Stitch, "start">[], t0: number, t1: number): Stitch[] =>
  list.map((s, i) => ({ ...s, start: t0 + ((t1 - t0) * i) / Math.max(1, list.length - 1) }));

export const buildPattern = () => {
  const rnd = mulberry32(59);
  const [cx, cz] = FLOWER_CENTER;
  const petals: Omit<Stitch, "start">[][] = [];
  const outlines: Omit<Stitch, "start">[] = [];
  const L = 0.46;

  for (let p = 0; p < 5; p++) {
    const ang = (p / 5) * Math.PI * 2 - Math.PI / 2 + 0.2;
    const list: Omit<Stitch, "start">[] = [];
    // satin stitches across the petal, slanted 12 degrees
    const steps = 40;
    for (let i = 1; i < steps; i++) {
      const s = i / steps;
      const w = 0.135 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.12 + s * 0.93)), 0.6) * (1 + 0.1 * Math.sin(s * 9));
      const ax = s * L;
      const [x0, z0] = rot(ax - 0.02, -w, ang);
      const [x1, z1] = rot(ax + 0.02, w, ang);
      const group: ThreadGroup = s < 0.34 ? "crimson" : s < 0.72 ? "vermilion" : "blush";
      list.push({ a: [cx + x0, cz + z0], b: [cx + x1, cz + z1], group, r: 0.0065 });
    }
    petals.push(list);
    // gold couched outline around the petal edge
    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < 14; i++) {
        const s0 = i / 14;
        const s1 = (i + 1) / 14;
        const w0 = 0.15 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.12 + s0 * 0.93)), 0.6);
        const w1 = 0.15 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.12 + s1 * 0.93)), 0.6);
        const [x0, z0] = rot(s0 * L, side * w0, ang);
        const [x1, z1] = rot(s1 * L, side * w1, ang);
        outlines.push({ a: [cx + x0, cz + z0], b: [cx + x1, cz + z1], group: "gold", r: 0.0055 });
      }
    }
  }

  // French-knot centre
  const knots: Knot[] = [];
  for (let i = 0; i < 46; i++) {
    const a = rnd() * Math.PI * 2;
    const r = Math.sqrt(rnd()) * 0.075;
    knots.push({ p: [cx + Math.cos(a) * r, cz + Math.sin(a) * r], start: 6.0 + i * 0.012 });
  }

  // Leaves: fishbone stitch (two slanted stitches per step from the midrib)
  const leaves: Omit<Stitch, "start">[] = [];
  const leafDefs: [number, number, number, number][] = [
    [-0.34, 0.34, 2.45, 0.36],
    [0.36, 0.42, 0.75, 0.32],
  ];
  for (const [lx, lz, ang, len] of leafDefs) {
    for (let i = 1; i < 22; i++) {
      const s = i / 22;
      const w = 0.11 * Math.pow(Math.sin(Math.PI * s), 0.9);
      for (const side of [-1, 1]) {
        const [x0, z0] = rot(s * len, 0, ang);
        const [x1, z1] = rot(s * len - 0.05, side * w, ang);
        leaves.push({ a: [lx + x0, lz + z0], b: [lx + x1, lz + z1], group: side < 0 ? "leaf" : "moss", r: 0.006 });
      }
    }
  }
  // Stem: overlapping stem stitch along a curve from the flower down to the leaves
  const stem: Omit<Stitch, "start">[] = [];
  for (let i = 0; i < 26; i++) {
    const s0 = i / 26;
    const s1 = (i + 1.6) / 26;
    const pt = (s: number): [number, number] => [cx - 0.05 + Math.sin(s * 2.4) * 0.12 - s * 0.05, cz + 0.2 + s * 0.6];
    stem.push({ a: pt(s0), b: pt(Math.min(1, s1)), group: "moss", r: 0.0075 });
  }

  // Songket-style diamond ring in gold at radius 0.8
  const ring: Omit<Stitch, "start">[] = [];
  const N = 22;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const R = 0.8;
    const c: [number, number] = [Math.cos(a) * R, Math.sin(a) * R];
    const radial: [number, number] = [Math.cos(a), Math.sin(a)];
    const tang: [number, number] = [-Math.sin(a), Math.cos(a)];
    const d = 0.07;
    const pts: [number, number][] = [
      [c[0] + radial[0] * d, c[1] + radial[1] * d],
      [c[0] + tang[0] * d * 0.8, c[1] + tang[1] * d * 0.8],
      [c[0] - radial[0] * d, c[1] - radial[1] * d],
      [c[0] - tang[0] * d * 0.8, c[1] - tang[1] * d * 0.8],
    ];
    for (let k = 0; k < 4; k++) ring.push({ a: pts[k], b: pts[(k + 1) % 4], group: "gold", r: 0.006 });
    // little connecting bar to the next diamond
    const nb: [number, number] = [Math.cos(a + Math.PI / N) * R, Math.sin(a + Math.PI / N) * R];
    ring.push({ a: [c[0] + tang[0] * d * 0.8, c[1] + tang[1] * d * 0.8], b: nb, group: "gold", r: 0.0045 });
  }

  // Timeline: petal 1 first (hook), the rest accelerating, then leaves, ring, outlines
  const stitches: Stitch[] = [
    ...schedule(petals[0], 0.3, 2.4),
    ...schedule([...petals[1], ...petals[2]], 2.4, 4.2),
    ...schedule([...petals[3], ...petals[4]], 4.2, 5.6),
    ...schedule([...stem, ...leaves], 5.2, 7.6),
    ...schedule(ring, 7.4, 9.2),
    ...schedule(outlines, 9.0, 10.5),
  ];
  return { stitches, knots };
};

/** The stitch being laid at time t (needle follows it). */
export const activeStitch = (stitches: Stitch[], t: number) => {
  let best = stitches[0];
  for (const s of stitches) if (s.start <= t) best = s;
  return best;
};
