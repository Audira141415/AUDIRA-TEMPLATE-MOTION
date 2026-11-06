import * as THREE from "three";
import { DEVFORGE_PALETTE } from "./palette";

export function createGlassChassisMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: DEVFORGE_PALETTE.editorBg,
    roughness: 0.15,
    metalness: 0.1,
    transmission: 0.25,
    transparent: true,
    opacity: 0.95,
    reflectivity: 0.8,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  });
}

export function createNeonBorderMaterial(colorHex: string = DEVFORGE_PALETTE.accentNeon) {
  return new THREE.MeshBasicMaterial({
    color: colorHex,
    transparent: true,
    opacity: 0.85,
  });
}

export function createGlowBlockMaterial() {
  return new THREE.MeshStandardMaterial({
    color: DEVFORGE_PALETTE.accentNeon,
    roughness: 0.2,
    metalness: 0.4,
    emissive: DEVFORGE_PALETTE.accentNeon,
    emissiveIntensity: 0.35,
  });
}
