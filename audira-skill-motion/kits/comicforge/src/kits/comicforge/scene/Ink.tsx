import React, { useMemo } from "react";
import * as THREE from "three";
import { COMIC_PALETTE as P } from "../lib/palette";
import { makeHalftoneMaterial, makeOutlineMaterial } from "../lib/materials";

export type ComicMats = ReturnType<typeof buildComicMats>;

const buildComicMats = (dotPx: number) => ({
  suit: makeHalftoneMaterial(P.cyan, P.cyanShade, dotPx, 1),
  cape: makeHalftoneMaterial(P.magenta, "#B4006A", dotPx, 0),
  yellow: makeHalftoneMaterial(P.yellow, P.yellowShade, dotPx, 1),
  skin: makeHalftoneMaterial(P.skin, P.skinShade, dotPx, 0),
  ink: new THREE.MeshBasicMaterial({ color: P.ink }),
  white: new THREE.MeshBasicMaterial({ color: "#FFFFFF" }),
  concrete: makeHalftoneMaterial(P.concrete, P.concreteShade, dotPx, 0),
  drone: makeHalftoneMaterial(P.magenta, P.magentaShade, dotPx, 1),
  steel: makeHalftoneMaterial("#E6EEF5", "#6C7A92", dotPx, 1),
  red: makeHalftoneMaterial(P.red, "#8A0A10", dotPx, 0),
  outline: makeOutlineMaterial(0.035),
  outlineThin: makeOutlineMaterial(0.02),
  outlineThick: makeOutlineMaterial(0.07),
});

export const useComicMats = (dotPx: number) => useMemo(() => buildComicMats(dotPx), [dotPx]);

/** A smooth mesh with an inverted-hull ink line (works for spheres, capsules, cylinders, cones). */
export const Inked: React.FC<{
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  outline: THREE.Material;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}> = ({ geometry, material, outline, position, rotation, scale }) => (
  <group position={position} rotation={rotation} scale={scale}>
    <mesh geometry={geometry} material={material} />
    <mesh geometry={geometry} material={outline} />
  </group>
);

/** Box with a scaled-hull outline (split box normals would crack a normal-extruded hull). */
export const InkBox: React.FC<{
  size: [number, number, number];
  material: THREE.Material;
  ink: THREE.Material;
  t?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}> = ({ size, material, ink, t = 0.04, position, rotation }) => (
  <group position={position} rotation={rotation}>
    <mesh material={material}>
      <boxGeometry args={size} />
    </mesh>
    <mesh material={ink}>
      <boxGeometry args={[size[0] + 2 * t, size[1] + 2 * t, size[2] + 2 * t]} />
    </mesh>
  </group>
);

export const BACK_INK = new THREE.MeshBasicMaterial({ color: P.ink, side: THREE.BackSide });
