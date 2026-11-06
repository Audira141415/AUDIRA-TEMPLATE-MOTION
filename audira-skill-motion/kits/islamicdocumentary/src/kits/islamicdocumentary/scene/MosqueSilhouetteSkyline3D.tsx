import React from "react";
import { computeIslamicDocumentaryState } from "../core/motion";
import { ISLAMICDOCUMENTARY_PALETTE } from "../lib/palette";

export const MosqueSilhouetteSkyline3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeIslamicDocumentaryState(f);
  return (
    <group position={[0, -0.45, 0.4]}>
      {/* Central Majestic Grand Dome Silhouette */}
      <mesh position={[0, 0.5, 0]} scale={[state.lightPulse, state.lightPulse, 1]}>
        <sphereGeometry args={[0.75, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={ISLAMICDOCUMENTARY_PALETTE.royalGold}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Left Slender Minaret */}
      <group position={[-1.6, 0.65, 0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.09, 1.6, 16]} />
          <meshStandardMaterial color={ISLAMICDOCUMENTARY_PALETTE.desertSand} roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <coneGeometry args={[0.11, 0.35, 16]} />
          <meshStandardMaterial color={ISLAMICDOCUMENTARY_PALETTE.royalGold} metalness={0.8} />
        </mesh>
      </group>

      {/* Right Slender Minaret */}
      <group position={[1.6, 0.65, 0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.09, 1.6, 16]} />
          <meshStandardMaterial color={ISLAMICDOCUMENTARY_PALETTE.desertSand} roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <coneGeometry args={[0.11, 0.35, 16]} />
          <meshStandardMaterial color={ISLAMICDOCUMENTARY_PALETTE.royalGold} metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
};