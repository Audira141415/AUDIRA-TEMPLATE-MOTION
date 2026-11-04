// TIMEFORGE morph core: interpolate two parameter trees of identical shape. Each numeric
// leaf gets its own progress from a timing function keyed by its dotted path, so every
// component of an object can transform on its own schedule (component-level animation)
// while the whole object stays one continuous state. Pure: same inputs, same output.

export type Tree = number | boolean | string | Tree[] | { [k: string]: Tree };

/** Maps a leaf path ("keys.7.h", "body.hw") to that leaf's eased progress 0..1. */
export type Progress = (path: string) => number;

export const lerpTree = <T extends Tree>(a: T, b: T, p: Progress, path = ""): T => {
  if (typeof a === "number") {
    const t = p(path);
    return (a + ((b as number) - a) * t) as T;
  }
  if (typeof a === "boolean" || typeof a === "string") return (p(path) < 0.5 ? a : b) as T;
  if (Array.isArray(a)) {
    const bb = b as Tree[];
    if (bb.length !== a.length) throw new Error(`lerpTree: length mismatch at "${path}"`);
    return a.map((x, i) => lerpTree(x, bb[i], p, path ? `${path}.${i}` : String(i))) as T;
  }
  const out: Record<string, Tree> = {};
  const bo = b as Record<string, Tree>;
  for (const k of Object.keys(a)) {
    if (!(k in bo)) throw new Error(`lerpTree: key "${k}" missing in target at "${path}"`);
    out[k] = lerpTree((a as Record<string, Tree>)[k], bo[k], p, path ? `${path}.${k}` : k);
  }
  return out as T;
};

/** One timing rule: leaves whose path matches run over [start, end] of the transition. */
export type Rule = { match: RegExp | string; start: number; end: number; ease?: (t: number) => number };

/**
 * Build a Progress from ordered rules (first match wins) for a transition at local time
 * `t` (0..1). `fallback` covers unmatched leaves.
 */
export const ruled = (
  t: number,
  rules: Rule[],
  fallback: Omit<Rule, "match">,
  defaultEase: (t: number) => number,
): Progress => {
  const cache = new Map<string, number>();
  return (path) => {
    const hit = cache.get(path);
    if (hit !== undefined) return hit;
    const r = rules.find((r) => (typeof r.match === "string" ? path.startsWith(r.match) : r.match.test(path))) ?? fallback;
    const x = Math.min(1, Math.max(0, (t - r.start) / Math.max(1e-6, r.end - r.start)));
    const v = (r.ease ?? defaultEase)(x);
    cache.set(path, v);
    return v;
  };
};
