import * as THREE from "three";
import { TRADINGTERMINAL_PALETTE } from "./palette";

export const getCandleMaterial = (isBull: boolean) =>
  new THREE.MeshStandardMaterial({
    color: isBull ? TRADINGTERMINAL_PALETTE.bullGreen : TRADINGTERMINAL_PALETTE.bearRed,
    emissive: isBull ? TRADINGTERMINAL_PALETTE.bullGreen : TRADINGTERMINAL_PALETTE.bearRed,
    emissiveIntensity: 0.35,
    roughness: 0.2,
    metalness: 0.1,
  });
