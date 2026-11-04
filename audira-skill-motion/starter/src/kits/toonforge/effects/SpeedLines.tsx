// TOONFORGE Speed Lines — procedural radial anime action streaks radiating from screen center.

import React, { useMemo } from "react";
import * as THREE from "three";
import { TOON_PALETTE } from "../lib/palette";
import { hash } from "../core/noise";

interface SpeedLinesProps {
  f: number;
  count?: number;
  intensity?: number; // 0 to 1
  innerRadius?: number;
  outerRadius?: number;
}

export const SpeedLines: React.FC<SpeedLinesProps> = ({
  f,
  count = 48,
  intensity = 1,
  innerRadius = 2.0,
  outerRadius = 7.5,
}) => {
  // Speed lines regenerate / flicker every 2 frames for intense anime cadence
  const stepF = Math.floor(f / 2) * 2;

  const linesGeo = useMemo(() => {
    const points: THREE.Vector3[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + hash(i + stepF) * 0.08;
      const r1 = innerRadius + hash(i * 3.7 + stepF) * 0.8;
      const r2 = outerRadius + hash(i * 7.1 + stepF) * 1.5;

      const p1 = new THREE.Vector3(Math.cos(angle) * r1, Math.sin(angle) * r1, 0);
      const p2 = new THREE.Vector3(Math.cos(angle) * r2, Math.sin(angle) * r2, 0);

      points.push(p1, p2);
    }

    return new THREE.BufferGeometry().setFromPoints(points);
  }, [count, innerRadius, outerRadius, stepF]);

  if (intensity <= 0.01) return null;

  return (
    <group position={[0, 0, 1.5]}>
      <lineSegments>
        <bufferGeometry attach="geometry" {...linesGeo} />
        <lineBasicMaterial
          attach="material"
          color={TOON_PALETTE.actionSpeedLine}
          transparent
          opacity={intensity * 0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
};
