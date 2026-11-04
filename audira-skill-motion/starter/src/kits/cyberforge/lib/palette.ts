// CYBERFORGE color palette — curated for OLED mobile contrast, holographic clarity, and military HUD optics.

export const CYBER_PALETTE = {
  // Primary holographic & laser channels
  cyan: "#00f0ff",
  cyanDim: "#006677",
  electricViolet: "#8a2be2",
  matrixLime: "#00ff88",
  alertMagenta: "#ff0077",
  solarAmber: "#ffaa00",

  // Deep space / void backgrounds
  voidDeep: "#04060d",
  voidSurface: "#090e1c",
  gridFloor: "#0c1830",
  gridLine: "#13284f",

  // HUD text & telemetry values
  hudCyan: "#d0f7ff",
  hudMuted: "#466280",
  hudWhite: "#f0f8ff",
  hudScanline: "rgba(0, 240, 255, 0.08)",
};

export type CyberPalette = typeof CYBER_PALETTE;
