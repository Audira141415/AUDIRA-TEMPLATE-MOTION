import * as THREE from "three";
import { ABYSS_PALETTE } from "./palette";

/** Translucent jelly bell: thin, glossy, back faces visible, glows from inside. */
export const makeBellMaterial = (lumen: string) =>
  new THREE.MeshStandardMaterial({
    color: new THREE.Color(lumen).multiplyScalar(0.25),
    emissive: new THREE.Color(lumen),
    emissiveIntensity: 0.6,
    roughness: 0.15,
    metalness: 0,
    transparent: true,
    opacity: 0.32,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

/** Pure light (tentacles, rims, photophores, plankton): HDR colour so bloom catches it. */
export const makeLumenMaterial = (lumen: string, boost = 2.2, opacity = 1) =>
  new THREE.MeshBasicMaterial({
    color: new THREE.Color(lumen).multiplyScalar(boost),
    transparent: opacity < 1,
    opacity,
    blending: opacity < 1 ? THREE.AdditiveBlending : THREE.NormalBlending,
    depthWrite: opacity >= 1,
  });

export const makeHideMaterial = () =>
  new THREE.MeshStandardMaterial({ color: ABYSS_PALETTE.creatureHide, roughness: 0.3, metalness: 0.2 });

/** Soft vertical light-shaft texture: bright core, feathered sides, fading downward. */
export const makeGodRayTexture = () => {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 256;
  const g = c.getContext("2d")!;
  const img = g.createImageData(128, 256);
  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 128; x++) {
      const u = x / 127 - 0.5;
      const v = y / 255;
      const side = Math.exp(-(u * u) / 0.03);
      const fall = Math.pow(1 - v, 1.6);
      const a = side * fall * 255;
      const i = (y * 128 + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = a;
      img.data[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};
