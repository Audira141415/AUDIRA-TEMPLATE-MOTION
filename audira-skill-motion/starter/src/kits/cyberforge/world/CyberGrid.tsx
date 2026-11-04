// CYBERFORGE Cyber Grid — perspective floor grid with radial pulse wave and digital coordinate lines.

import React, { useMemo } from "react";
import * as THREE from "three";
import { CYBER_PALETTE } from "../lib/palette";

interface CyberGridProps {
  size?: number;
  divisions?: number;
  f: number;
}

export const CyberGrid: React.FC<CyberGridProps> = ({ size = 40, divisions = 40, f }) => {
  // Grid lines
  const gridGeo = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const step = size / divisions;
    const half = size / 2;

    for (let i = 0; i <= divisions; i++) {
      const pos = -half + i * step;
      // Parallel to Z
      points.push(new THREE.Vector3(pos, 0, -half), new THREE.Vector3(pos, 0, half));
      // Parallel to X
      points.push(new THREE.Vector3(-half, 0, pos), new THREE.Vector3(half, 0, pos));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [size, divisions]);

  // Dynamic radar pulse wave moving outward along the floor
  const waveRadius = (f * 0.25) % (size * 0.65);
  const waveGeo = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(a), 0, Math.sin(a)));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  const waveOpacity = Math.max(0, 1 - waveRadius / (size * 0.65));

  return (
    <group position={[0, -2.0, 0]}>
      {/* Baseline Grid */}
      <lineSegments>
        <bufferGeometry attach="geometry" {...gridGeo} />
        <lineBasicMaterial
          attach="material"
          color={CYBER_PALETTE.cyanDim}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Outward Expanding Radar Wave */}
      <line scale={[waveRadius, 1, waveRadius]}>
        <bufferGeometry attach="geometry" {...waveGeo} />
        <lineBasicMaterial
          attach="material"
          color={CYBER_PALETTE.cyan}
          transparent
          opacity={waveOpacity * 0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </line>

      {/* Secondary concentric floor circle */}
      <line scale={[12, 1, 12]}>
        <bufferGeometry attach="geometry" {...waveGeo} />
        <lineBasicMaterial
          attach="material"
          color={CYBER_PALETTE.electricViolet}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </line>
    </group>
  );
};
