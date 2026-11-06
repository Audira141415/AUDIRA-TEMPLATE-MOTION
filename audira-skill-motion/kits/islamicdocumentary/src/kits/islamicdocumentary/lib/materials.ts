import * as THREE from "three";
import { ISLAMICDOCUMENTARY_PALETTE } from "./palette";

export const getGoldMaterial = () =>
  new THREE.MeshStandardMaterial({
    color: ISLAMICDOCUMENTARY_PALETTE.royalGold,
    metalness: 0.88,
    roughness: 0.25,
    emissive: ISLAMICDOCUMENTARY_PALETTE.royalGold,
    emissiveIntensity: 0.25,
  });
