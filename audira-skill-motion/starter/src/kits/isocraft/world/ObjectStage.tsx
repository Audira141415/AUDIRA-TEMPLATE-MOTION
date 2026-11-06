import React from "react";
import * as THREE from "three";
import { ISOCRAFT_PALETTE } from "../lib/palette";

export const IsoAppliance: React.FC<{ f: number }> = ({ f }) => {
  // See-through transparency cycle
  const seeThrough = Math.sin(f * 0.03) * 0.5 + 0.5;
  const shellOpacity = THREE.MathUtils.lerp(1.0, 0.25, seeThrough);
  const gearRot = f * 0.05;

  return (
    <group position={[0, 0, 0]} rotation={[0.4, 0.6, 0]}>
      {/* 1. Ground Flat Shadow */}
      <mesh position={[0.2, -1.2, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, 3.2]} />
        <meshBasicMaterial color={ISOCRAFT_PALETTE.shadowBlue} transparent opacity={0.35} />
      </mesh>

      {/* 2. Outer Casing (Shifts to see-through) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.8, 2.2, 1.4]} />
        <meshToonMaterial color={ISOCRAFT_PALETTE.bodyCoral} transparent opacity={shellOpacity} />
      </mesh>

      {/* 3. Internal Mechanism (Motors & Gears) */}
      <group position={[0, 0, 0]}>
        {/* Core Steel Shaft */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 1.8, 16]} />
          <meshToonMaterial color={ISOCRAFT_PALETTE.metalSteel} />
        </mesh>
        {/* Top Gear */}
        <mesh position={[0, 0.5, 0]} rotation={[0, gearRot, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.15, 12]} />
          <meshToonMaterial color={ISOCRAFT_PALETTE.accentYellow} />
        </mesh>
        {/* Bottom Counter-Gear */}
        <mesh position={[0, -0.4, 0]} rotation={[0, -gearRot * 1.5, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.15, 8]} />
          <meshToonMaterial color={ISOCRAFT_PALETTE.bodyMint} />
        </mesh>
      </group>
    </group>
  );
};
