// CYBERFORGE DataStream — upward-floating digital particles & telemetry nodes.

import React, { useMemo } from "react";
import * as THREE from "three";
import { CYBER_PALETTE } from "../lib/palette";
import { hash } from "../core/noise";

interface DataStreamProps {
  count?: number;
  f: number;
}

export const DataStream: React.FC<DataStreamProps> = ({ count = 180, f }) => {
  // Deterministic particle generation
  const [positions, geo] = useMemo(() => {
    const coords: number[] = [];
    for (let i = 0; i < count; i++) {
      const radius = 0.5 + hash(i * 1.3) * 6.5;
      const angle = hash(i * 7.1) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const yOffset = hash(i * 3.7) * 8.0 - 2.0;

      coords.push(x, yOffset, z);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(coords, 3));
    return [coords, geometry];
  }, [count]);

  // Update Y positions based on frame `f` deterministically
  const animatedGeo = useMemo(() => {
    const updated = new Float32Array(positions);
    const speed = 0.04;
    for (let i = 0; i < count; i++) {
      const idx = i * 3 + 1; // Y index
      const base = positions[idx];
      // Float upward from -2 to 6, then loop
      updated[idx] = -2.0 + ((base + 2.0 + f * speed) % 8.0);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(updated, 3));
    return g;
  }, [positions, count, f]);

  return (
    <points>
      <bufferGeometry attach="geometry" {...animatedGeo} />
      <pointsMaterial
        attach="material"
        color={CYBER_PALETTE.cyan}
        size={0.06}
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
