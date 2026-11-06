import React from "react";
import { computeHistoryMapState } from "../core/motion";
import { HISTORYMAP_PALETTE } from "../lib/palette";

export const TacticalPincerArrows3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeHistoryMapState(f);
  const arrowLength = state.arrowProgress * 1.6;

  return (
    <group position={[0, 0.05, 0]}>
      {/* North Pincer Arrow */}
      <group position={[-1.2, 0, 0.3]} rotation={[0, 0.35, 0]}>
        <mesh position={[arrowLength / 2, 0, 0]}>
          <boxGeometry args={[arrowLength, 0.06, 0.16]} />
          <meshBasicMaterial color={HISTORYMAP_PALETTE.arrowRed} />
        </mesh>
        <mesh position={[arrowLength, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <coneGeometry args={[0.18, 0.32, 3]} />
          <meshBasicMaterial color={HISTORYMAP_PALETTE.arrowRed} />
        </mesh>
      </group>

      {/* South Pincer Arrow */}
      <group position={[-1.1, 0, -0.4]} rotation={[0, -0.4, 0]}>
        <mesh position={[arrowLength / 2, 0, 0]}>
          <boxGeometry args={[arrowLength, 0.06, 0.16]} />
          <meshBasicMaterial color={HISTORYMAP_PALETTE.arrowRed} />
        </mesh>
        <mesh position={[arrowLength, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <coneGeometry args={[0.18, 0.32, 3]} />
          <meshBasicMaterial color={HISTORYMAP_PALETTE.arrowRed} />
        </mesh>
      </group>

      {/* Target Clashing Bastion Pin */}
      <mesh position={[0.45, 0.22, -0.05]}>
        <cylinderGeometry args={[0.03, 0.03, 0.45, 12]} />
        <meshBasicMaterial color={HISTORYMAP_PALETTE.borderGold} />
      </mesh>
      <mesh position={[0.45, 0.48, -0.05]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={HISTORYMAP_PALETTE.borderGold} />
      </mesh>
    </group>
  );
};