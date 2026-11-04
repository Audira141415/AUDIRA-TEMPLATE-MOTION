// Height-field toolkit: graded grids, bilinear lookup, baked sun visibility + ambient occlusion.
//
// A WORLDFORGE terrain is one analytic height function sampled on two graded grids: a dense
// "near" patch where the camera travels (sub-metre at the hero location, coarser toward its
// edges) and a coarse "far" patch out to the horizon. Grid spacing grows exponentially away
// from the origin, so detail is spent where the camera is. Because the sun never moves within
// a film, terrain self-shadowing and AO are baked once per grid vertex (pure CPU, seeded) —
// long mountain and dune shadows cost nothing per frame and can never flicker.

export type Axis = {
  n: number;
  /** Index of coordinate 0. */
  c: number;
  coord: Float64Array;
  /** Fractional index of a coordinate (inverse of the spacing map). */
  inv: (x: number) => number;
};

/** Spacing s(x) = s0 + k·|x|: a graded axis covering [min, max] with x = 0 on a grid line. */
export const expAxis = (min: number, max: number, s0: number, k: number): Axis => {
  const uOf = (x: number) => (Math.sign(x) * Math.log(1 + (k * Math.abs(x)) / s0)) / k;
  const lo = Math.ceil(-uOf(min));
  const hi = Math.ceil(uOf(max));
  const n = lo + hi + 1;
  const coord = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const u = i - lo;
    coord[i] = (Math.sign(u) * (s0 / k)) * (Math.exp(k * Math.abs(u)) - 1);
  }
  return { n, c: lo, coord, inv: (x: number) => lo + uOf(x) };
};

export type Grid = {
  ax: Axis;
  az: Axis;
  /** Heights, row-major: index = j * ax.n + i (i along x, j along z). */
  h: Float32Array;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
};

export const makeGrid = (ax: Axis, az: Axis, height: (x: number, z: number) => number): Grid => {
  const h = new Float32Array(ax.n * az.n);
  for (let j = 0; j < az.n; j++) {
    const z = az.coord[j];
    for (let i = 0; i < ax.n; i++) h[j * ax.n + i] = height(ax.coord[i], z);
  }
  return { ax, az, h, minX: ax.coord[0], maxX: ax.coord[ax.n - 1], minZ: az.coord[0], maxZ: az.coord[az.n - 1] };
};

export const inside = (g: Grid, x: number, z: number, margin = 0) =>
  x > g.minX + margin && x < g.maxX - margin && z > g.minZ + margin && z < g.maxZ - margin;

/** Bilinear height lookup in grid-index space (clamped to the grid). */
export const lookup = (g: Grid, x: number, z: number) => {
  const nx = g.ax.n, nz = g.az.n;
  let fi = g.ax.inv(x), fj = g.az.inv(z);
  if (fi < 0) fi = 0; else if (fi > nx - 1.0001) fi = nx - 1.0001;
  if (fj < 0) fj = 0; else if (fj > nz - 1.0001) fj = nz - 1.0001;
  const i = fi | 0, j = fj | 0;
  // Linear in true coordinates within the cell (the mesh is linear there too).
  const x0 = g.ax.coord[i], x1 = g.ax.coord[i + 1];
  const z0 = g.az.coord[j], z1 = g.az.coord[j + 1];
  let tx = (x - x0) / (x1 - x0), tz = (z - z0) / (z1 - z0);
  tx = tx < 0 ? 0 : tx > 1 ? 1 : tx;
  tz = tz < 0 ? 0 : tz > 1 ? 1 : tz;
  const k = j * nx + i;
  const a = g.h[k] + (g.h[k + 1] - g.h[k]) * tx;
  const b = g.h[k + nx] + (g.h[k + nx + 1] - g.h[k + nx]) * tx;
  return a + (b - a) * tz;
};

/** Height at any point: the near grid where it exists, otherwise the far grid. */
export const makeWorldHeight = (near: Grid, far: Grid) => (x: number, z: number) =>
  inside(near, x, z) ? lookup(near, x, z) : lookup(far, x, z);

export type BakeOpts = {
  /** Unit vector toward the sun. */
  sun: [number, number, number];
  /** Highest point in the world: rays above it can stop. */
  maxH: number;
  maxDist: number;
  /** Penumbra half-width as a slope (tan of angle). */
  soft: number;
};

/**
 * Sun visibility per grid vertex, 0..1 with soft penumbrae: march toward the sun and keep the
 * smallest clearance angle between the ray and the terrain.
 */
export const bakeSun = (g: Grid, height: (x: number, z: number) => number, o: BakeOpts) => {
  const [lx, ly, lz] = o.sun;
  const lh = Math.hypot(lx, lz);
  const dx = lx / lh, dz = lz / lh, tanE = ly / lh;
  const nx = g.ax.n, nz = g.az.n;
  const out = new Float32Array(nx * nz);
  for (let j = 0; j < nz; j++) {
    const z = g.az.coord[j];
    const sz = j > 0 ? z - g.az.coord[j - 1] : g.az.coord[1] - z;
    for (let i = 0; i < nx; i++) {
      const x = g.ax.coord[i];
      const sx = i > 0 ? x - g.ax.coord[i - 1] : g.ax.coord[1] - x;
      const spacing = Math.max(sx, sz);
      const h0 = g.h[j * nx + i] + 0.12 + 0.04 * spacing;
      let vis = 1;
      let s = spacing * 0.8;
      while (s < o.maxDist) {
        const ry = h0 + s * tanE;
        if (ry > o.maxH) break;
        const th = height(x + dx * s, z + dz * s);
        const v = 0.5 + (ry - th) / s / (2 * o.soft);
        if (v < vis) {
          vis = v;
          if (vis <= 0) { vis = 0; break; }
        }
        s = s * 1.045 + 0.3 * spacing;
      }
      out[j * nx + i] = vis > 1 ? 1 : vis;
    }
  }
  return out;
};

/** Horizon-based ambient occlusion per vertex (8 directions, exponential steps). */
export const bakeAO = (g: Grid, height: (x: number, z: number) => number, radius: number, strength: number) => {
  const nx = g.ax.n, nz = g.az.n;
  const out = new Float32Array(nx * nz);
  const dirs = Array.from({ length: 8 }, (_, k) => [Math.cos((k / 8) * Math.PI * 2 + 0.3), Math.sin((k / 8) * Math.PI * 2 + 0.3)]);
  const steps: number[] = [];
  for (let s = 1.2; s < radius; s *= 1.6) steps.push(s);
  for (let j = 0; j < nz; j++) {
    const z = g.az.coord[j];
    for (let i = 0; i < nx; i++) {
      const x = g.ax.coord[i];
      const h0 = g.h[j * nx + i];
      let occ = 0;
      for (const [cx, cz] of dirs) {
        let m = 0;
        for (const s of steps) {
          const t = (height(x + cx * s, z + cz * s) - h0) / s;
          if (t > m) m = t;
        }
        occ += m / Math.sqrt(1 + m * m);
      }
      const ao = 1 - (occ / 8) * strength;
      out[j * nx + i] = ao < 0 ? 0 : ao;
    }
  }
  return out;
};

/** Grid-space normal (world units), written into `out` as xyz per vertex. */
export const gridNormals = (g: Grid) => {
  const nx = g.ax.n, nz = g.az.n;
  const out = new Float32Array(nx * nz * 3);
  for (let j = 0; j < nz; j++) {
    const j0 = j > 0 ? j - 1 : j, j1 = j < nz - 1 ? j + 1 : j;
    const dz = g.az.coord[j1] - g.az.coord[j0];
    for (let i = 0; i < nx; i++) {
      const i0 = i > 0 ? i - 1 : i, i1 = i < nx - 1 ? i + 1 : i;
      const dx = g.ax.coord[i1] - g.ax.coord[i0];
      const gx = (g.h[j * nx + i1] - g.h[j * nx + i0]) / dx;
      const gz = (g.h[j1 * nx + i] - g.h[j0 * nx + i]) / dz;
      const l = Math.hypot(gx, 1, gz);
      const k = (j * nx + i) * 3;
      out[k] = -gx / l;
      out[k + 1] = 1 / l;
      out[k + 2] = -gz / l;
    }
  }
  return out;
};
