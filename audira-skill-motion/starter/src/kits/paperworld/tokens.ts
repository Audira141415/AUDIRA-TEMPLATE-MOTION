// PAPERWORLD design tokens. One palette, one set of physical constants, used by every set.
// Colours are authored in sRGB; three.js converts them to linear for lighting.

export const PALETTE = {
  ivory: "#f3ead9",
  ivoryLight: "#faf4e8",
  ivoryShade: "#e5d8c1",
  coral: "#e3806a",
  coralDeep: "#c4614f",
  coralLight: "#f0a892",
  mint: "#9dd1bb",
  mintDeep: "#6eaa93",
  mintLight: "#cbe8da",
  gold: "#e7b54a",
  goldDeep: "#c38f2b",
  goldLight: "#f2d58e",
  cobalt: "#5f7cb6",
  cobaltDeep: "#435e95",
  cobaltLight: "#9eb2da",
  brown: "#7d5843",
  brownDeep: "#523729",
  brownLight: "#ae8a70",
  skin: "#f3d6bf",
  ink: "#3b2a22",
} as const;

export type PaperColor = keyof typeof PALETTE;

/** Physical constants (scene units ≈ centimetres of a desk-top diorama). */
export const PAPER = {
  /** Cardstock thickness for cut-outs. */
  card: 0.06,
  /** Heavier board for walls, frames and floors. */
  board: 0.16,
  /** World size of one tile of the grain texture. */
  grainTile: 9,
  /** The puppet's full height, used to scale every set. */
  puppetHeight: 6.3,
} as const;

/** Film format. */
export const FORMAT = { width: 1080, height: 1920, fps: 60 } as const;
