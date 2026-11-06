import * as THREE from "three";
import { KINTSUGI_PALETTE } from "./palette";

export function createPorcelainMaterial() {
  return new THREE.MeshStandardMaterial({
    color: KINTSUGI_PALETTE.porcelainMatte,
    roughness: 0.85,
    metalness: 0.05,
  });
}

export function createLiquidGoldMaterial() {
  return new THREE.MeshStandardMaterial({
    color: KINTSUGI_PALETTE.pureGoldLeaf,
    emissive: KINTSUGI_PALETTE.goldEmissive,
    emissiveIntensity: 0.7,
    roughness: 0.2,
    metalness: 0.9,
  });
}
