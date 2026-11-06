import * as THREE from "three";
import { AUDIRABOT_PALETTE } from "./palette";

export function createChassisMaterial() {
  return new THREE.MeshStandardMaterial({
    color: AUDIRABOT_PALETTE.chassisWhite,
    roughness: 0.25,
    metalness: 0.1,
  });
}

export function createInnerJointMaterial() {
  return new THREE.MeshStandardMaterial({
    color: AUDIRABOT_PALETTE.chassisDark,
    roughness: 0.4,
    metalness: 0.8,
  });
}

export function createVisorGlassMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: AUDIRABOT_PALETTE.visorGlass,
    roughness: 0.05,
    metalness: 0.9,
    reflectivity: 0.9,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  });
}

export function createOledEyeMaterial(colorHex: string = AUDIRABOT_PALETTE.eyeCyan) {
  return new THREE.MeshBasicMaterial({
    color: colorHex,
  });
}

export function createThrusterPlasmaMaterial() {
  return new THREE.MeshBasicMaterial({
    color: AUDIRABOT_PALETTE.thrusterPlasma,
    transparent: true,
    opacity: 0.85,
  });
}
