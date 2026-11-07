// Risograph spot inks (one drum each) + paper stock. Overprints are produced by multiply blending,
// never by picking a mixed colour: pink×blue = violet, pink×yellow = red-orange, blue×yellow = green.
export const RISO_PALETTE = {
  fluoPink: "#FF48B0", // Riso Fluorescent Pink
  blue: "#0078BF", // Riso Blue
  yellow: "#FFE800", // Riso Yellow
  paper: "#F6F0E2", // uncoated cream stock
  paperShade: "#E4DAC6",
  mat: "#7FA59A", // self-healing cutting mat
  matLine: "#5F857B",
  staple: "#B9BEC4",
  ink: "#1D1A2A", // overlay text only
  wall: "#D9D2C4",
};

export const DRUM = { pink: 0, blue: 1, yellow: 2 } as const;
