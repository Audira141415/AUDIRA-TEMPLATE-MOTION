import * as THREE from "three";

export const getTerritoryMaterial = (color: string) =>
  new THREE.MeshStandardMaterial({
    color,
    roughness: 0.85,
    metalness: 0.05,
  });
