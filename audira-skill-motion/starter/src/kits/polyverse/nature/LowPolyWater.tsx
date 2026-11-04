// POLYVERSE Low-Poly Water — faceted polygonal river and lake surface with vertex bobbing.

import React, { useMemo } from "react";
import * as THREE from "three";
import { POLY_PALETTE } from "../lib/palette";
import { waterWave } from "../core/motion";

interface LowPolyWaterProps {
  f: number;
  width?: number;
  length?: number;
}

export const LowPolyWater: React.FC<LowPolyWaterProps> = ({ f, width = 2.4, length = 7.0 }) => {
  const [baseGeo, initialPositions] = useMemo(() => {
    const geo = new THREE.PlaneGeometry(width, length, 6, 14);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position.array.slice();
    return [geo, pos];
  }, [width, length]);

  const animatedGeo = useMemo(() => {
    const geo = baseGeo.clone();
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = initialPositions[i * 3];
      const z = initialPositions[i * 3 + 2];
      const dy = waterWave(x, z, f);
      pos.setY(i, dy);
    }
    geo.computeVertexNormals();
    return geo;
  }, [baseGeo, initialPositions, f]);

  return (
    <mesh position={[0, 0.08, 0]}>
      <primitive object={animatedGeo} attach="geometry" />
      <meshStandardMaterial
        color={POLY_PALETTE.waterSurface}
        roughness={0.15}
        metalness={0.1}
        transparent
        opacity={0.85}
        flatShading
      />
    </mesh>
  );
};
