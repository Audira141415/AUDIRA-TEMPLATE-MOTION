import React, { useMemo } from "react";
import * as THREE from "three";
import { feltMaterial, fuzzShellMaterial } from "../lib/materials";

// Needle-felted wool part: a felt base mesh plus N alpha-tested fuzz shells, each a little
// larger and sparser, so the silhouette reads soft and fibrous (no clay sheen).

type V3 = [number, number, number];
const matCache = new Map<string, THREE.Material>();
const cached = (key: string, make: () => THREE.Material) => {
  let m = matCache.get(key);
  if (!m) {
    m = make();
    matCache.set(key, m);
  }
  return m;
};

export const Fuzzy: React.FC<{
  geometry: THREE.BufferGeometry;
  color: string;
  shells?: number;
  spacing?: number;
  position?: V3;
  rotation?: V3;
  scale?: V3 | number;
}> = ({ geometry, color, shells = 4, spacing = 0.018, position, rotation, scale }) => {
  const base = useMemo(() => cached(`felt-${color}`, () => feltMaterial(color, 1.5)), [color]);
  const layers = useMemo(() => Array.from({ length: shells }, (_, i) => cached(`fuzz-${color}-${i}`, () => fuzzShellMaterial(color, i))), [color, shells]);
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh geometry={geometry} material={base} castShadow receiveShadow />
      {layers.map((m, i) => (
        <mesh key={i} geometry={geometry} material={m} scale={1 + (i + 1) * spacing} />
      ))}
    </group>
  );
};

// Shared unit geometries (reuse everywhere — cheap and consistent).
export const SPHERE = new THREE.SphereGeometry(1, 40, 28);
export const CONE = new THREE.ConeGeometry(1, 1, 24, 1);
export const CYL = new THREE.CylinderGeometry(1, 1, 1, 24);
