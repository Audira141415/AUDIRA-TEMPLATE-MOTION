import React from "react";
import * as THREE from "three";
import { THERMAL_PALETTE } from "../lib/palette";

export const HeatSinkThermal: React.FC<{ f: number }> = ({ f }) => {
  const pulse = Math.sin(f * 0.05) * 0.5 + 0.5;
  const coreColor = new THREE.Color(THERMAL_PALETTE.flirAmber).lerp(new THREE.Color(THERMAL_PALETTE.flirYellow), pulse);

  return (
    <group position={[0, 0, 0]} rotation={[0.4, f * 0.015, 0]}>
      {/* Central Hot Core */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 0.4, 1.2]} />
        <meshStandardMaterial color={coreColor} emissive={coreColor} emissiveIntensity={0.8} />
      </mesh>
      {/* Cold Perimeter Radiator Fins */}
      {[-1.2, -0.8, -0.4, 0.4, 0.8, 1.2].map((x, idx) => (
        <mesh key={idx} position={[x, 0.5, 0]}>
          <boxGeometry args={[0.08, 0.8, 1.4]} />
          <meshStandardMaterial color={THERMAL_PALETTE.deepViolet} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
};
