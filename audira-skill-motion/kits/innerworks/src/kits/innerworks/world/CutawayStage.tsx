// INNERWORKS Cutaway Stage — X-Ray translucent outer chassis revealing internal mechanisms.

import React from "react";
import { INNERWORKS_PALETTE } from "../lib/palette";
import { GearTrain } from "../mechanisms/GearTrain";

interface CutawayStageProps {
  f: number;
  cutawayProgress: number; // 0 = solid shell, 1 = full x-ray transparency
}

export const CutawayStage: React.FC<CutawayStageProps> = ({ f, cutawayProgress }) => {
  return (
    <group>
      {/* 1. Internal Precision Gear Mechanism */}
      <GearTrain f={f} />

      {/* 2. Outer Protective Cutaway Housing */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[4.4, 4.2, 1.2]} />
        <meshPhysicalMaterial
          color={INNERWORKS_PALETTE.steelChassis}
          roughness={0.2}
          metalness={0.7}
          transmission={cutawayProgress * 0.9}
          transparent
          opacity={1.0 - cutawayProgress * 0.75}
          wireframe={cutawayProgress > 0.4}
        />
      </mesh>

      {/* 3. Lighting Rig */}
      <ambientLight color="#1e293b" intensity={1.0} />
      <directionalLight position={[5, 8, 5]} color="#ffffff" intensity={2.2} castShadow />
      <pointLight position={[-4, 2, 3]} color={INNERWORKS_PALETTE.xrayCyan} intensity={2.5} distance={12} />
      <pointLight position={[3, -3, -2]} color={INNERWORKS_PALETTE.hydraulicAmber} intensity={1.8} distance={10} />
    </group>
  );
};

