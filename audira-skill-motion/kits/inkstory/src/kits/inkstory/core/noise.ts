// INKSTORY deterministic noise — organic edge fraying, paper fiber textures & ink wash gradients.

export const hash = (n: number): number => {
  const x = Math.sin(n * 213.1 + 821.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Deterministic ink splatter offset */
export const inkSplatter = (index: number, spread = 1.0): [number, number] => {
  const angle = hash(index * 7 + 1) * Math.PI * 2;
  const dist = Math.sqrt(hash(index * 7 + 2)) * spread;
  return [Math.cos(angle) * dist, Math.sin(angle) * dist];
};

