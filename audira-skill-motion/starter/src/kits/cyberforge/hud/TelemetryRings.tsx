// CYBERFORGE 3D Telemetry Rings — concentric rotating HUD circles with degree ticks and cardinal gaps.

import React, { useMemo } from "react";
import * as THREE from "three";
import { CYBER_PALETTE } from "../lib/palette";

interface TelemetryRingsProps {
  radius?: number;
  f: number;
  color?: string;
  tiltX?: number;
  tiltZ?: number;
}

export const TelemetryRings: React.FC<TelemetryRingsProps> = ({
  radius = 2.5,
  f,
  color = CYBER_PALETTE.cyan,
  tiltX = Math.PI / 2,
  tiltZ = 0,
}) => {
  // Ring 1: Smooth continuous circle with 4 cardinal notch breaks
  const outerCircleGeo = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 96;
    for (let i = 0; i <= segments; i++) {
      // Create slight gaps at 0, 90, 180, 270 degrees
      const angle = (i / segments) * Math.PI * 2;
      const deg = (angle * 180) / Math.PI;
      const nearGap = [0, 90, 180, 270, 360].some((g) => Math.abs(deg - g) < 4);
      if (!nearGap) {
        points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
      } else if (points.length > 0) {
        // Break segment by pushing NaN or separate lines
      }
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [radius]);

  // Ring 2: Ticked degree compass ring
  const ticksGeo = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const tickCount = 48;
    const rInner = radius * 0.88;
    const rOuter = radius * 0.93;
    const rMajor = radius * 0.96;

    for (let i = 0; i < tickCount; i++) {
      const angle = (i / tickCount) * Math.PI * 2;
      const isMajor = i % 4 === 0;
      const rOut = isMajor ? rMajor : rOuter;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      points.push(new THREE.Vector3(cos * rInner, sin * rInner, 0));
      points.push(new THREE.Vector3(cos * rOut, sin * rOut, 0));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [radius]);

  // Ring 3: Segmented dashed arc
  const arcGeo = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 40;
    const arcRad = radius * 1.12;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 0.8; // Partial 144 degree arc
      points.push(new THREE.Vector3(Math.cos(angle) * arcRad, Math.sin(angle) * arcRad, 0));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [radius]);

  // Rotations driven deterministically by frame clock `f`
  const rotZ1 = (f * 0.008) % (Math.PI * 2);
  const rotZ2 = (-f * 0.012) % (Math.PI * 2);
  const rotZ3 = (f * 0.015) % (Math.PI * 2);

  return (
    <group rotation={[tiltX, 0, tiltZ]}>
      {/* Outer ring */}
      <line rotation={[0, 0, rotZ1]}>
        <bufferGeometry attach="geometry" {...outerCircleGeo} />
        <lineBasicMaterial attach="material" color={color} transparent opacity={0.65} blending={THREE.AdditiveBlending} />
      </line>

      {/* Middle tick ring */}
      <lineSegments rotation={[0, 0, rotZ2]}>
        <bufferGeometry attach="geometry" {...ticksGeo} />
        <lineBasicMaterial attach="material" color={color} transparent opacity={0.85} blending={THREE.AdditiveBlending} />
      </lineSegments>

      {/* Dynamic orbital arc */}
      <line rotation={[0, 0, rotZ3]}>
        <bufferGeometry attach="geometry" {...arcGeo} />
        <lineBasicMaterial attach="material" color={CYBER_PALETTE.electricViolet} transparent opacity={0.7} blending={THREE.AdditiveBlending} />
      </line>
    </group>
  );
};
