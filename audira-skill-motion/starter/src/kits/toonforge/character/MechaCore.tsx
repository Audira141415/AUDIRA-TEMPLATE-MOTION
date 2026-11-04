// TOONFORGE Mecha Core — hero 3D cel-shaded anime aerial craft with ink outlines and glowing plasma thrusters.

import React from "react";
import { TOON_PALETTE } from "../lib/palette";

interface MechaCoreProps {
  f: number;
  pitch?: number;
  roll?: number;
  thrustPower?: number; // 0 to 1
}

export const MechaCore: React.FC<MechaCoreProps> = ({
  f,
  pitch = 0,
  roll = 0,
  thrustPower = 1,
}) => {
  // Thruster flame flicker
  const flameScale = thrustPower * (1.0 + Math.sin(f * 0.8) * 0.15);

  return (
    <group rotation={[pitch, 0, roll]}>
      {/* 1. Main Fuselage (White Cel-Shaded Armor) */}
      <group>
        <mesh castShadow>
          <coneGeometry args={[0.55, 2.4, 4]} rotation={[Math.PI / 2, 0, 0]} />
          <meshToonMaterial color={TOON_PALETTE.mechaArmor} />
        </mesh>
        {/* Inverted-Hull Ink Outline */}
        <mesh scale={[1.08, 1.08, 1.04]}>
          <coneGeometry args={[0.55, 2.4, 4]} rotation={[Math.PI / 2, 0, 0]} />
          <meshBasicMaterial color={TOON_PALETTE.inkOutline} side={1} />
        </mesh>
      </group>

      {/* 2. Cockpit Canopy (Sakura Pink Visor) */}
      <mesh position={[0, 0.28, 0.2]} rotation={[Math.PI / 6, 0, 0]}>
        <boxGeometry args={[0.3, 0.2, 0.8]} />
        <meshToonMaterial color={TOON_PALETTE.sakuraPink} />
      </mesh>

      {/* 3. Swept Aerodynamic Left Wing */}
      <group position={[-1.2, 0, -0.3]} rotation={[0, -0.2, -0.1]}>
        <mesh castShadow>
          <boxGeometry args={[1.5, 0.08, 0.7]} />
          <meshToonMaterial color={TOON_PALETTE.mechaAccent} />
        </mesh>
        <mesh scale={[1.06, 1.6, 1.06]}>
          <boxGeometry args={[1.5, 0.08, 0.7]} />
          <meshBasicMaterial color={TOON_PALETTE.inkOutline} side={1} />
        </mesh>
      </group>

      {/* 4. Swept Aerodynamic Right Wing */}
      <group position={[1.2, 0, -0.3]} rotation={[0, 0.2, 0.1]}>
        <mesh castShadow>
          <boxGeometry args={[1.5, 0.08, 0.7]} />
          <meshToonMaterial color={TOON_PALETTE.mechaAccent} />
        </mesh>
        <mesh scale={[1.06, 1.6, 1.06]}>
          <boxGeometry args={[1.5, 0.08, 0.7]} />
          <meshBasicMaterial color={TOON_PALETTE.inkOutline} side={1} />
        </mesh>
      </group>

      {/* 5. Dual Cyan Plasma Thruster Plumes */}
      {thrustPower > 0.05 && (
        <group position={[0, 0, -1.2]}>
          {/* Left Thruster Flame */}
          <mesh position={[-0.35, 0, -flameScale * 0.7]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, flameScale, 1]}>
            <coneGeometry args={[0.2, 1.4, 6]} />
            <meshBasicMaterial color={TOON_PALETTE.skyCyan} />
          </mesh>
          {/* Right Thruster Flame */}
          <mesh position={[0.35, 0, -flameScale * 0.7]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, flameScale, 1]}>
            <coneGeometry args={[0.2, 1.4, 6]} />
            <meshBasicMaterial color={TOON_PALETTE.skyCyan} />
          </mesh>
        </group>
      )}
    </group>
  );
};
