// BUILDFORGE daylight preset: warm white, soft beige, natural wood, light-grey concrete,
// mint landscaping, soft blue sky, warm sun.

import type { Look } from "../materials/library.ts";
import type { GroundLook } from "../environment/Terrain.ts";
import type { SkyLook } from "../environment/Sky.ts";
import type { Palette } from "../environment/Vegetation.ts";

export const LOOKS: Record<string, Look> = {
  precast: { color: "#c4c0b8", roughness: 0.86, tex: "concrete", tile: 2.4 },
  concrete: { color: "#cfcbc3", roughness: 0.9, tex: "concrete", tile: 3 },
  block: { color: "#bdb7ac", roughness: 0.95, tex: "concrete", tile: 1 },
  fair: { color: "#d3cfc7", roughness: 0.78, tex: "concrete", tile: 2.4 },
  plaster: { color: "#f1ede6", roughness: 0.9 },
  render: { color: "#f5f1ea", roughness: 0.84 },
  wood: { color: "#c38b5a", roughness: 0.6, tex: "wood", tile: 0.9 },
  woodPiece: { color: "#c48d5d", roughness: 0.62, tex: "wood", tile: 1 },
  plywood: { color: "#d8b783", roughness: 0.78, tex: "wood", tile: 1.4 },
  gravel: { color: "#b3ab9e", roughness: 1, tex: "gravel", tile: 0.7 },
  rebar: { color: "#7d5947", roughness: 0.5, metalness: 0.55 },
  frame: { color: "#34322f", roughness: 0.36, metalness: 0.6 },
  steel: { color: "#3c3b38", roughness: 0.38, metalness: 0.7 },
  hook: { color: "#e7ab3c", roughness: 0.45, metalness: 0.25 },
  cable: { color: "#2b2b2a", roughness: 0.5, metalness: 0.5 },
  stake: { color: "#c99b65", roughness: 0.8, tex: "wood", tile: 1 },
  marker: { color: "#ef8a3c", roughness: 0.6 },
  string: { color: "#fbfaf6", roughness: 0.6 },
  soil: { color: "#a98a6a", roughness: 1 },
  bed: { color: "#7a6450", roughness: 1 },
  paver: { color: "#e6dfd2", roughness: 0.82, tex: "concrete", tile: 1.5 },
  foliage: { color: "#ffffff", roughness: 0.95, vertexColors: true, env: 0.5, leaf: true },
  bark: { color: "#8e7a67", roughness: 0.92 },
  fabric: { color: "#ece6db", roughness: 0.95 },
  lamp: { color: "#f6efe2", roughness: 0.4, emissive: "#ffcf92" },
};

export const SKY: SkyLook = { zenith: "#5f9ad6", horizon: "#e6eeef", ground: "#cbc8b3", sun: "#fff0d6", cloud: "#fdfcf9" };
export const FOG = "#e9ede8";

export const GROUND: GroundLook = {
  meadow: "#afc08a",
  meadowDry: "#c9c79c",
  soil: "#d8c7a8",
  dug: "#a88b6c",
  lawn: "#a6c89c",
  lawnDeep: "#8fb68b",
  gravel: "#dcd6ca",
  bed: "#7f6a55",
};

export const LEAF: Record<"garden" | "wild" | "shrub", Palette> = {
  garden: { low: "#5f8f6c", mid: "#83b98e", high: "#b8dcb2" },
  wild: { low: "#68825a", mid: "#8fa979", high: "#bccb9b" },
  shrub: { low: "#5a8a66", mid: "#7fb68a", high: "#aed6a6" },
};
