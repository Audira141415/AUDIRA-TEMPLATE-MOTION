// CIRCUITFORGE BGA Microchip — Central processor package with integrated heat spreader & SMT decoupling capacitors.

import React from "react";
import { CIRCUIT_PALETTE } from "../lib/palette";

export const MicrochipBga: React.FC = () => {
  return (
    <group position={[0, 0.15, 0]}>
      {/* 1. Substrate Interposer */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.22, 3.2]} />
        <meshStandardMaterial
          color={CIRCUIT_PALETTE.solderMaskDark}
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>

      {/* 2. Silicon Die / Nickel-Plated Copper Heat Spreader */}
      <mesh position={[0, 0.18, 0]} castShadow>
        <boxGeometry args={[2.4, 0.14, 2.4]} />
        <meshStandardMaterial
          color={CIRCUIT_PALETTE.siliconDie}
          roughness={0.18}
          metalness={0.88}
        />
      </mesh>

      {/* 3. Gold Corner Pin 1 Indicator Marker */}
      <mesh position={[-1.2, 0.26, -1.2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
        <meshStandardMaterial color={CIRCUIT_PALETTE.enigGold} roughness={0.15} metalness={0.95} />
      </mesh>

      {/* 4. Surrounding SMT Decoupling Capacitors (0603 Package) */}
      {[-1.8, 1.8].map((x) =>
        [-0.8, 0, 0.8].map((z, idx) => (
          <group key={`${x}-${idx}`} position={[x, 0.06, z]}>
            {/* Ceramic Body */}
            <mesh>
              <boxGeometry args={[0.35, 0.16, 0.22]} />
              <meshStandardMaterial color="#c2a68c" roughness={0.4} />
            </mesh>
            {/* Solder Terminals */}
            <mesh position={[-0.18, 0, 0]}>
              <boxGeometry args={[0.06, 0.17, 0.23]} />
              <meshStandardMaterial color={CIRCUIT_PALETTE.tinSolder} metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0.18, 0, 0]}>
              <boxGeometry args={[0.06, 0.17, 0.23]} />
              <meshStandardMaterial color={CIRCUIT_PALETTE.tinSolder} metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        ))
      )}
    </group>
  );
};

