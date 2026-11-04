// CYBERFORGE noise & glitch generator — strictly deterministic seeded PRNG.

/** Deterministic 1D hash */
export const hash = (n: number): number => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return s - Math.floor(s);
};

/** Deterministic 2D hash */
export const hash2 = (x: number, y: number): number => {
  const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return s - Math.floor(s);
};

/** Deterministic digital glitch displacement (returns offset between -1 and 1 on glitch frames) */
export const glitchJitter = (frame: number, seed = 42): number => {
  const block = Math.floor(frame / 4);
  const chance = hash(block * 7.13 + seed);
  if (chance > 0.88) {
    return (hash(frame * 13.37 + seed) - 0.5) * 2;
  }
  return 0;
};

