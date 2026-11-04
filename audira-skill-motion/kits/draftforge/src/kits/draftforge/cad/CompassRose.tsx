// DRAFTFORGE 3D Compass Rose — architectural north indicator and circular degree compass.

import React, { useMemo } from "react";
import * as THREE from "three";
import { DRAFT_PALETTE } from "../lib/palette";

export const CompassRose: React.FC<{ radius?: number; position?: [number, number, number] }> = ({
  radius = 0.9,
  position = [4.5, -1.8, -4.5],
}) => {
  const geo = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 48;

    // Outer circle
    for (let i = 0; i <= segments; i++) {
      const a1 = (i / segments) * Math.PI * 2;
      const a2 = ((i + 1) / segments) * Math.PI * 2;
      points.push(
        new THREE.Vector3(Math.cos(a1) * radius, 0, Math.sin(a1) * radius),
        new THREE.Vector3(Math.cos(a2) * radius, 0, Math.sin(a2) * radius)
      );
    }

    // Cardinal Cross
    const rL = radius * 1.25;
    points.push(new THREE.Vector3(0, 0, -rL), new THREE.Vector3(0, 0, rL));
    points.push(new THREE.Vector3(-radius, 0, 0), new THREE.Vector3(radius, 0, 0));

    // North Pointer Arrowhead
    const tip = new THREE.Vector3(0, 0, -rL);
    points.push(tip, new THREE.Vector3(-radius * 0.22, 0, -radius * 0.7));
    points.push(tip, new THREE.Vector3(radius * 0.22, 0, -radius * 0.7));

    return new THREE.BufferGeometry().setFromPoints(points);
  }, [radius]);

  return (
    <group position={position}>
      <lineSegments>
        <bufferGeometry attach="geometry" {...geo} />
        <lineBasicMaterial attach="material" color={DRAFT_PALETTE.cadCyan} transparent opacity={0.75} />
      </lineSegments>
    </group>
  );
};

