import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { MOSAIC_PALETTE } from "./palette";
import { mulberry32 } from "../core/motion";

/** Glazed ceramic / stone tessera: per-instance colour, glossy clearcoat for the raking sheen. */
export const makeCeramicMaterial = () =>
  new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.42, metalness: 0, clearcoat: 0.7, clearcoatRoughness: 0.18 });

/** Gold smalti: gold leaf under glass, mirror-like, catches the environment. */
export const makeGoldMaterial = () =>
  new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.32, metalness: 1.0, envMapIntensity: 0.9 });

/** Lime grout bed with a little sand noise. */
export const makeGroutTexture = () => {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const rnd = mulberry32(6002);
  g.fillStyle = MOSAIC_PALETTE.grout;
  g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 3000; i++) {
    g.fillStyle = `rgba(${rnd() < 0.5 ? "60,45,30" : "255,250,240"},${0.05 + rnd() * 0.1})`;
    g.fillRect(rnd() * 256, rnd() * 256, 1 + rnd() * 2, 1 + rnd() * 2);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
};

/** Procedural studio environment (no network) so gold and glaze have something to reflect. */
export const makeEnvironment = (gl: THREE.WebGLRenderer) => {
  const pmrem = new THREE.PMREMGenerator(gl);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  return env;
};
