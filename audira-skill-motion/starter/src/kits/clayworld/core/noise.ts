// CLAYWORLD noise utilities — deterministic fingerprint and surface indent generators.

export const hash = (n: number): number => {
  const s = Math.sin(n * 317.9 + 523.1) * 43758.5453;
  return s - Math.floor(s);
};

export const hash2 = (x: number, y: number): number => {
  const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return s - Math.floor(s);
};

/** Deterministic fingerprint bump pattern at (u, v) */
export const fingerprintBump = (u: number, v: number): number => {
  const freq = 32.0;
  const wave = Math.sin(Math.sqrt((u - 0.5) ** 2 + (v - 0.5) ** 2) * freq * Math.PI * 2);
  return wave * 0.05;
};
