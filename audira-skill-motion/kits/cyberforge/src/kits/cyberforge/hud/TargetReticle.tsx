// CYBERFORGE 3D Target Reticle — sci-fi corner brackets, lock-on trackers, and center crosshair.

import React, { useMemo } from "react";
import * as THREE from "three";
import { CYBER_PALETTE } from "../lib/palette";
import { lerp } from "../core/motion";

interface TargetReticleProps {
  f: number;
  lockProgress?: number; // 0 to 1
  size?: number;
  color?: string;
  lockedColor?: string;
}

export const TargetReticle: React.FC<TargetReticleProps> = ({
  f,
  lockProgress = 0,
  size = 1.8,
  color = CYBER_PALETTE.cyan,
  lockedColor = CYBER_PALETTE.alertMagenta,
}) => {
  // Corner bracket size: smoothly clamps tighter as lock progresses
  const currentSize = lerp(size * 1.35, size, lockProgress);
  const arm = currentSize * 0.22;

  const bracketGeo = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const h = currentSize / 2;

    // Top-Left Corner
    points.push(new THREE.Vector3(-h, h - arm, 0), new THREE.Vector3(-h, h, 0));
    points.push(new THREE.Vector3(-h, h, 0), new THREE.Vector3(-h + arm, h, 0));

    // Top-Right Corner
    points.push(new THREE.Vector3(h - arm, h, 0), new THREE.Vector3(h, h, 0));
    points.push(new THREE.Vector3(h, h, 0), new THREE.Vector3(h, h - arm, 0));

    // Bottom-Right Corner
    points.push(new THREE.Vector3(h, -h + arm, 0), new THREE.Vector3(h, -h, 0));
    points.push(new THREE.Vector3(h, -h, 0), new THREE.Vector3(h - arm, -h, 0));

    // Bottom-Left Corner
    points.push(new THREE.Vector3(-h + arm, -h, 0), new THREE.Vector3(-h, -h, 0));
    points.push(new THREE.Vector3(-h, -h, 0), new THREE.Vector3(-h, -h + arm, 0));

    return new THREE.BufferGeometry().setFromPoints(points);
  }, [currentSize, arm]);

  const activeColor = lockProgress > 0.85 ? lockedColor : color;
  const pulse = Math.sin(f * 0.15) * 0.15 + 0.85;

  return (
    <group>
      <lineSegments>
        <bufferGeometry attach="geometry" {...bracketGeo} />
        <lineBasicMaterial
          attach="material"
          color={activeColor}
          transparent
          opacity={pulse}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
};

