// DRAFTFORGE 3D Dimension Line — technical measurement lines, extension ticks, and arrowhead geometry.

import React, { useMemo } from "react";
import * as THREE from "three";
import { DRAFT_PALETTE } from "../lib/palette";

interface DimensionLineProps {
  start: [number, number, number];
  end: [number, number, number];
  offset?: [number, number, number];
  color?: string;
  progress?: number; // 0 to 1 draw progress
}

export const DimensionLine: React.FC<DimensionLineProps> = ({
  start,
  end,
  offset = [0, 0.4, 0],
  color = DRAFT_PALETTE.dimensionGold,
  progress = 1,
}) => {
  const geo = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const p1 = new THREE.Vector3(...start);
    const p2 = new THREE.Vector3(...end);
    const off = new THREE.Vector3(...offset);

    // Dimension line points (offset from the object)
    const d1 = p1.clone().add(off);
    const d2 = p2.clone().add(off);

    // Extension lines from object to dimension line
    points.push(p1, d1.clone().add(off.clone().multiplyScalar(0.2)));
    points.push(p2, d2.clone().add(off.clone().multiplyScalar(0.2)));

    // Main dimension span
    const currentD2 = d1.clone().lerp(d2, progress);
    points.push(d1, currentD2);

    // Arrowheads (small 45-degree ticks)
    const dir = d2.clone().sub(d1).normalize();
    const perp = new THREE.Vector3(-dir.y, dir.x, dir.z).normalize().multiplyScalar(0.12);
    const arrowLen = 0.2;

    if (progress > 0.05) {
      // Arrow 1 at start
      points.push(d1, d1.clone().add(dir.clone().multiplyScalar(arrowLen)).add(perp));
      points.push(d1, d1.clone().add(dir.clone().multiplyScalar(arrowLen)).sub(perp));
    }

    if (progress > 0.95) {
      // Arrow 2 at end
      points.push(d2, d2.clone().sub(dir.clone().multiplyScalar(arrowLen)).add(perp));
      points.push(d2, d2.clone().sub(dir.clone().multiplyScalar(arrowLen)).sub(perp));
    }

    return new THREE.BufferGeometry().setFromPoints(points);
  }, [start, end, offset, progress]);

  return (
    <lineSegments>
      <bufferGeometry attach="geometry" {...geo} />
      <lineBasicMaterial attach="material" color={color} transparent opacity={0.9} depthWrite={false} />
    </lineSegments>
  );
};

