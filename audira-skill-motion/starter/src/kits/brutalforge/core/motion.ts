export function computeProgress(f: number, totalFrames: number): number {
  return Math.min(Math.max(f / totalFrames, 0), 1);
}

export function smoothStep(t: number): number {
  return t * t * (3 - 2 * t);
}
