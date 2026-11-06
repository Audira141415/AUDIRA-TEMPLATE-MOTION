import * as THREE from "three";
import { ISOCRAFT_PALETTE } from "./palette";

export function createInkOutlineMaterial(thickness = 0.04) {
  return new THREE.MeshBasicMaterial({
    color: ISOCRAFT_PALETTE.inkBlack,
    side: THREE.BackSide,
  });
}

export function createIsoToonMaterial(colorHex: string, opacity = 1.0) {
  return new THREE.MeshToonMaterial({
    color: colorHex,
    transparent: opacity < 1.0,
    opacity,
    wireframe: false,
  });
}
