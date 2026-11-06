import * as THREE from "three";
import { THERMAL_PALETTE } from "./palette";

export function createThermalGradientMaterial() {
  return new THREE.MeshStandardMaterial({
    color: THERMAL_PALETTE.flirAmber,
    emissive: THERMAL_PALETTE.flirMagenta,
    emissiveIntensity: 0.6,
    roughness: 0.3,
  });
}
