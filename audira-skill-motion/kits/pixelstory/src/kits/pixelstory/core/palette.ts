// Lamplight Diorama palette. Shadows are wine-black, never neutral; teal is reserved
// for things that are alive (a spark's heart, a creature's glow, living tiles).

export const C = {
  ink: "#0D0809",
  char: "#1B1115",
  wine: "#3D141D",
  burgundy: "#6B1F2D",
  crimson: "#9A2F35",
  ember: "#C2501F",
  amber: "#E8892E",
  gold: "#F4B860",
  glow: "#FFE0A6",
  ivory: "#F3E6CC",
  ivoryDim: "#CDBB9C",
  teal: "#3FB7A8",
  tealDeep: "#1F6B66",
} as const;

export type RGB = [number, number, number];

export const hexToRgb = (hex: string): RGB => {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
};

export const rgbToHex = ([r, g, b]: RGB): string =>
  "#" +
  [r, g, b]
    .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0"))
    .join("");

export const mixHex = (a: string, b: string, t: number): string => {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t]);
};

export const rgba = (hex: string, a: number): string => {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
};

// Material ramps for per-pixel relighting, darkest → brightest. Each ramp is hue-shifted:
// shadows drift toward wine, highlights toward gold, the way warm practical light behaves.
export const RAMPS = {
  wood: ["#120a0b", "#24120f", "#3a1d14", "#5a2d19", "#7f421f", "#a85d27", "#cf8336", "#f0b25c"],
  woodDark: ["#0d0809", "#190d0d", "#2a1511", "#3f1f15", "#5b2c1a", "#7c3d1f", "#a2562a", "#c8783a"],
  plaster: ["#0f0a0c", "#1d1216", "#2d1a1d", "#432422", "#5f3426", "#84492c", "#ae6735", "#d99248"],
  paper: ["#16100f", "#2e2220", "#4b3833", "#6e564a", "#9a7c63", "#c4a47f", "#e6caa0", "#fbe9c8"],
  metal: ["#0b0809", "#17110f", "#251a16", "#38261c", "#503424", "#6e472d", "#946337", "#be8846"],
  book1: ["#0e0708", "#1d0b0f", "#2f0f16", "#45141d", "#5f1b25", "#7f2530", "#a3343c", "#c44c48"],
  book2: ["#0b0a09", "#1a1410", "#2c2016", "#3f2d1b", "#574021", "#755827", "#99752f", "#c49a3f"],
  book3: ["#08090a", "#101415", "#18201f", "#1f2c29", "#283a35", "#344b43", "#476152", "#647c63"],
  leaf: ["#07090a", "#0d1310", "#141d14", "#1d2a18", "#2a3a1b", "#3d4f1f", "#566826", "#76852f"],
  sky: ["#06070a", "#0a0d12", "#0f141a", "#161c22", "#1f262a", "#2c3333", "#3e4440", "#57584d"],
  amberLamp: ["#2a1208", "#4f2009", "#7a320c", "#a54812", "#cc6419", "#e8892e", "#f6b35a", "#ffe0a6"],
  ivoryLit: ["#1a1312", "#3a2c26", "#5f4a3e", "#8a705a", "#b39678", "#d6bb97", "#ecd6b2", "#fff1d6"],
  teal: ["#050b0b", "#0a1717", "#0f2424", "#143433", "#1f4c49", "#2b6d67", "#3fb7a8", "#9ff0e2"],
  screen: ["#0a0708", "#140d0e", "#1f1414", "#2e1d1a", "#432a20", "#5e3b28", "#7f5232", "#a86c3c"],
  // Exterior — sky bands and land masses, lit by a sun-disc.
  dusk: ["#12070b", "#220a10", "#3a0f18", "#5a1820", "#7f2426", "#a8392a", "#cf5a2c", "#ef8a3a"],
  mesa: ["#0b0608", "#170a0e", "#261015", "#38161b", "#4f1e21", "#6a2926", "#8c3a2c", "#b55336"],
  stone: ["#0a0708", "#150e10", "#241619", "#352023", "#4a2c2c", "#643c36", "#865243", "#ad6d52"],
  frame: ["#110c0c", "#241b19", "#3d2f2a", "#5b4740", "#7f655a", "#a88a78", "#d1b49a", "#f3e6cc"],
} as const;

export type RampName = keyof typeof RAMPS;
