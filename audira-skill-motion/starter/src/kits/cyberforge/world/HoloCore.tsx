// CYBERFORGE HoloCore — hero 3D quantum core with counter-rotating gimbal rings and faceted energy crystal.

import React from "react";
import * as THREE from "three";
import { CYBER_PALETTE } from "../lib/palette";
import { TelemetryRings } from "../hud/TelemetryRings";
import { TargetReticle } from "../hud/TargetReticle";
import { glitchJitter } from "../core/noise";

interface HoloCoreProps {
  f: number;
  lockProgress?: number;
  coreOverload?: number; // 0 to 1
}

export const HoloCore: React.FC<HoloCoreProps> = ({ f, lockProgress = 0, coreOverload = 0 }) => {
  // Deterministic micro glitch jitter
  const jitterY = glitchJitter(f, 101) * 0.04;
  const jitterRot = glitchJitter(f, 202) * 0.05;

  // Crystal rotations
  const rotY1 = f * 0.02 + jitterRot;
  const rotX1 = f * 0.015;

  // Gimbal ring rotations (opposing directions)
  const gimbalPitch = f * 0.03;
  const gimbalRoll = -f * 0.025;

  // Core energy breathing
  const pulse = Math.sin(f * 0.08) * 0.15 + 0.85;
  const coreScale = 1.0 + coreOverload * 0.35 + pulse * 0.08;

  // Color shift under overload
  const coreColor = coreOverload > 0.6 ? CYBER_PALETTE.alertMagenta : CYBER_PALETTE.cyan;

  return (
    <group position={[0, jitterY, 0]}>
      {/* 1. Inner Faceted Energy Crystal */}
      <mesh rotation={[rotX1, rotY1, 0]} scale={[coreScale, coreScale, coreScale]}>
        <icosahedronGeometry args={[0.9, 0]} />
        {/* Flat-shaded facets with normal blending: additive blending plus high emissive clipped every face to white. */}
        <meshStandardMaterial
          color={coreColor}
          emissive={coreColor}
          emissiveIntensity={0.35 + coreOverload * 0.6}
          roughness={0.25}
          metalness={0.4}
          flatShading
          transparent
          opacity={0.85}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* 1b. Facet edges, so the crystal reads as a hologram */}
      <mesh rotation={[rotX1, rotY1, 0]} scale={[coreScale * 1.004, coreScale * 1.004, coreScale * 1.004]}>
        <icosahedronGeometry args={[0.9, 0]} />
        <meshBasicMaterial color={CYBER_PALETTE.hudCyan} wireframe transparent opacity={0.9} toneMapped={false} />
      </mesh>

      {/* 2. Outer Wireframe Cage around the Crystal */}
      <mesh rotation={[-rotX1 * 1.2, -rotY1 * 1.2, 0]} scale={[coreScale * 1.15, coreScale * 1.15, coreScale * 1.15]}>
        <octahedronGeometry args={[1.05, 0]} />
        <meshBasicMaterial
          color={CYBER_PALETTE.electricViolet}
          wireframe
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Inner Gimbal Ring (Rotates on Pitch) */}
      <group rotation={[gimbalPitch, 0, 0]}>
        <mesh>
          <torusGeometry args={[1.5, 0.022, 16, 64]} />
          <meshBasicMaterial
            color={CYBER_PALETTE.cyan}
            transparent
            opacity={0.75}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* 4. Outer Gimbal Ring (Rotates on Roll) */}
      <group rotation={[0, 0, gimbalRoll]}>
        <mesh>
          <torusGeometry args={[1.85, 0.028, 16, 64]} />
          <meshBasicMaterial
            color={CYBER_PALETTE.solarAmber}
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* 5. Concentric HUD Telemetry Rings */}
      <TelemetryRings radius={2.4} f={f} color={CYBER_PALETTE.cyan} tiltX={Math.PI / 2.3} />

      {/* 6. Targeting Reticle Lock Box */}
      <TargetReticle f={f} lockProgress={lockProgress} size={2.1} />

      {/* 7. Central Vertical Energy Conduits */}
      <lineSegments>
        <bufferGeometry
          attach="geometry"
          {...new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, -3.5, 0),
            new THREE.Vector3(0, 3.5, 0),
          ])}
        />
        <lineBasicMaterial
          attach="material"
          color={CYBER_PALETTE.cyan}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
};
