import * as THREE from "three";
import { VINTAGE_PALETTE } from "./palette";

export function createParchmentMaterial() {
  return new THREE.MeshStandardMaterial({
    color: VINTAGE_PALETTE.parchmentSepia,
    roughness: 0.9,
    metalness: 0.05,
  });
}

export function createEngravingBrassMaterial() {
  return new THREE.MeshStandardMaterial({
    color: VINTAGE_PALETTE.agedGold,
    roughness: 0.45,
    metalness: 0.65,
  });
}
