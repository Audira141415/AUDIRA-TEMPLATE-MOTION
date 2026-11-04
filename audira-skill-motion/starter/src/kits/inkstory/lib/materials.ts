// INKSTORY Material Library — Raw ink wash, textured xuan paper, and cinnabar seal textures.

import * as THREE from "three";
import { INK_PALETTE } from "./palette";

export const createXuanPaperMaterial = (): THREE.MeshStandardMaterial => {
  return new THREE.MeshStandardMaterial({
    color: INK_PALETTE.agedXuanPaper,
    roughness: 0.95,
    metalness: 0.0,
  });
};

export const createDenseInkMaterial = (): THREE.MeshStandardMaterial => {
  return new THREE.MeshStandardMaterial({
    color: INK_PALETTE.pineSootBlack,
    roughness: 0.85,
    metalness: 0.05,
  });
};

export const createInkWashMistMaterial = (opacity = 0.4): THREE.MeshStandardMaterial => {
  return new THREE.MeshStandardMaterial({
    color: INK_PALETTE.mistPaleWash,
    roughness: 0.9,
    metalness: 0.0,
    transparent: true,
    opacity,
  });
};

export const createVermilionSealMaterial = (): THREE.MeshStandardMaterial => {
  return new THREE.MeshStandardMaterial({
    color: INK_PALETTE.vermilionCinnabar,
    roughness: 0.7,
    metalness: 0.1,
  });
};
