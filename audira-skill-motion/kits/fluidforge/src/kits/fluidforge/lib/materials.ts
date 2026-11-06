import * as THREE from "three";
import { FLUIDFORGE_PALETTE } from "./palette";

export const getLiquidChromeMaterial = () =>
  new THREE.MeshStandardMaterial({
    color: FLUIDFORGE_PALETTE.chromeCore,
    roughness: 0.08,
    metalness: 0.95,
  });

export const getIridescentOrbMaterial = (color: string) =>
  new THREE.MeshStandardMaterial({
    color,
    roughness: 0.12,
    metalness: 0.88,
    emissive: color,
    emissiveIntensity: 0.22,
  });
