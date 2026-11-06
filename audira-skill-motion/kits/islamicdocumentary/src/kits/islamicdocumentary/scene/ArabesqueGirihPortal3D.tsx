import React from "react";
import { computeIslamicDocumentaryState } from "../core/motion";
import { ISLAMICDOCUMENTARY_PALETTE } from "../lib/palette";

export const ArabesqueGirihPortal3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeIslamicDocumentaryState(f);
  return (
    <group position={[0, 0.45, -0.3]}>
      {/* Background Lapis Lazuli Arch Portal */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[4.2, 4.2]} />
        <meshStandardMaterial color={ISLAMICDOCUMENTARY_PALETTE.lapisLazuli} roughness={0.7} />
      </mesh>

      {/* Primary Rotating Sacred 8-Point Star (Two Interlocking Squares) */}
      <group rotation={[0, 0, state.starRotation]}>
        <mesh>
          <boxGeometry args={[1.6, 1.6, 0.05]} />
          <meshStandardMaterial
            color={ISLAMICDOCUMENTARY_PALETTE.royalGold}
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[1.6, 1.6, 0.05]} />
          <meshStandardMaterial
            color={ISLAMICDOCUMENTARY_PALETTE.royalGold}
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>
        {/* Inner Emerald Octagon Core */}
        <mesh position={[0, 0, 0.04]}>
          <cylinderGeometry args={[0.65, 0.65, 0.04, 8]} />
          <meshStandardMaterial
            color={ISLAMICDOCUMENTARY_PALETTE.khalifahEmerald}
            roughness={0.5}
          />
        </mesh>
      </group>
    </group>
  );
};