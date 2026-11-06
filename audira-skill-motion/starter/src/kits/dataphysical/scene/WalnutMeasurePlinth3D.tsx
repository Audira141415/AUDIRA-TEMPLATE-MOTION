import React from "react";
import { computeDataPhysicalState } from "../core/motion";
import { DATAPHYSICAL_PALETTE } from "../lib/palette";

export const WalnutMeasurePlinth3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeDataPhysicalState(f);
  return (
    <group rotation={[0, state.turntableYaw, 0]}>
      {/* Crafted Dark Walnut Slab */}
      <mesh position={[0, -0.22, 0]}>
        <boxGeometry args={[3.8, 0.44, 2.2]} />
        <meshStandardMaterial color={DATAPHYSICAL_PALETTE.walnutBase} roughness={0.55} metalness={0.1} />
      </mesh>

      {/* Brass Precision Scale Rail on Front Bevel */}
      <mesh position={[0, -0.05, 1.11]}>
        <boxGeometry args={[3.4, 0.08, 0.04]} />
        <meshStandardMaterial color={DATAPHYSICAL_PALETTE.brassGold} roughness={0.25} metalness={0.88} />
      </mesh>

      {/* Translucent Teal Acrylic Benchmark Plane */}
      <mesh position={[0, state.brassMarkerY, 0]}>
        <boxGeometry args={[3.5, 0.035, 1.85]} />
        <meshStandardMaterial
          color={DATAPHYSICAL_PALETTE.acrylicTeal}
          transparent
          opacity={0.45}
          roughness={0.12}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
};