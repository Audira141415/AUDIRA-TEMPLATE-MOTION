import * as THREE from "three";
import { BACKROOMS_PALETTE } from "./palette";

export const getWallpaperMaterial = () =>
  new THREE.MeshStandardMaterial({
    color: BACKROOMS_PALETTE.wallpaperYellow,
    roughness: 0.82,
    metalness: 0.0,
  });
