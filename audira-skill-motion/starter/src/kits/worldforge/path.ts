// Plan-view paths for vehicles and people: Catmull-Rom through the points, sampled by arc
// length so speed along the path is exact (wheels and footsteps can be derived from distance).

export type P2 = [number, number];

export type PlanPath = {
  length: number;
  /** Position and unit direction at arc length s (clamped). */
  at: (s: number) => { p: P2; dir: P2 };
};

const cr = (a: number, b: number, c: number, d: number, t: number) =>
  0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);

export const planPath = (pts: P2[], perSeg = 40): PlanPath => {
  const n = pts.length;
  const get = (i: number) => pts[Math.max(0, Math.min(n - 1, i))];
  const samples: P2[] = [];
  for (let i = 0; i < n - 1; i++) {
    const a = get(i - 1), b = get(i), c = get(i + 1), d = get(i + 2);
    for (let k = 0; k < perSeg; k++) {
      const t = k / perSeg;
      samples.push([cr(a[0], b[0], c[0], d[0], t), cr(a[1], b[1], c[1], d[1], t)]);
    }
  }
  samples.push(pts[n - 1]);
  const cum = [0];
  for (let i = 1; i < samples.length; i++) cum.push(cum[i - 1] + Math.hypot(samples[i][0] - samples[i - 1][0], samples[i][1] - samples[i - 1][1]));
  const length = cum[cum.length - 1];
  const at = (s: number) => {
    const x = Math.max(0, Math.min(length - 1e-6, s));
    let lo = 0, hi = cum.length - 1;
    while (hi - lo > 1) {
      const m = (lo + hi) >> 1;
      if (cum[m] <= x) lo = m;
      else hi = m;
    }
    const f = (x - cum[lo]) / Math.max(1e-9, cum[hi] - cum[lo]);
    const A = samples[lo], B = samples[hi];
    const dx = B[0] - A[0], dz = B[1] - A[1];
    const l = Math.hypot(dx, dz) || 1;
    return { p: [A[0] + dx * f, A[1] + dz * f] as P2, dir: [dx / l, dz / l] as P2 };
  };
  return { length, at };
};

/** Distance travelled with a smooth start: rest until t0, accelerate over `ramp`, then speed v. */
export const travel = (t: number, t0: number, ramp: number, v: number) => {
  if (t <= t0) return 0;
  const u = t - t0;
  if (u < ramp) return (v * u * u) / (2 * ramp);
  return v * (u - ramp / 2);
};
