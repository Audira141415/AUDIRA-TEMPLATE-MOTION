import React from "react";
import * as THREE from "three";
import { WATERCOLOR_PALETTE } from "../lib/palette";
import { computeWatercolorState } from "../core/motion";

export const StorybookCanvas3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeWatercolorState(f);

  return (
    <group>
      {/* 1. Heavyweight Cold-Press Watercolor Paper Backdrop */}
      <mesh position={[0, 2.2, -2.5]}>
        <planeGeometry args={[11, 10]} />
        <meshStandardMaterial
          color={WATERCOLOR_PALETTE.paperCanvas}
          roughness={0.96}
          metalness={0.0}
        />
      </mesh>

      {/* 2. Distant Cobalt Blue Mountain Wash Flat */}
      <group position={[0, 1.8, -1.8]}>
        <mesh receiveShadow>
          <coneGeometry args={[3.2, 2.8, 5]} />
          <meshStandardMaterial
            color={WATERCOLOR_PALETTE.washCobaltBlue}
            transparent
            opacity={0.82}
            roughness={0.92}
          />
        </mesh>
      </group>

      {/* 3. Middleground Rolling Pasture Hills (Sage Green Wash) */}
      <group position={[-1.2, 0.8 + state.hillSway1, -1.2]}>
        <mesh receiveShadow>
          <sphereGeometry args={[1.8, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial
            color={WATERCOLOR_PALETTE.washSageGreen}
            transparent
            opacity={0.88}
            roughness={0.92}
          />
        </mesh>
      </group>

      {/* Foreground Hill (Warm Ochre Sunlight Wash) */}
      <group position={[1.4, 0.4 + state.hillSway2, -0.6]}>
        <mesh receiveShadow>
          <sphereGeometry args={[1.6, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial
            color={WATERCOLOR_PALETTE.washOchreGold}
            transparent
            opacity={0.78}
            roughness={0.92}
          />
        </mesh>
      </group>

      {/* 4. Whimsical Watercolor Oak Tree */}
      <group position={[-1.5, 0.6, -0.3]} rotation={[0, 0, state.treeSway]}>
        {/* Tree Trunk with Earth Umber Wash */}
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.08, 0.14, 0.9, 8]} />
          <meshStandardMaterial color={WATERCOLOR_PALETTE.washEarthUmber} roughness={0.9} />
        </mesh>
        {/* Soft Foliage Washes */}
        <mesh position={[0, 1.1, 0]}>
          <sphereGeometry args={[0.55, 16, 16]} />
          <meshStandardMaterial color={WATERCOLOR_PALETTE.washPineGreen} roughness={0.92} />
        </mesh>
        <mesh position={[0.25, 1.35, 0.1]}>
          <sphereGeometry args={[0.42, 14, 14]} />
          <meshStandardMaterial color={WATERCOLOR_PALETTE.washSageGreen} roughness={0.92} />
        </mesh>
      </group>

      {/* 5. Floating Whimsical Dandelion Pollen / Petal Dust */}
      <group position={[state.pollenDriftX, 1.8 + state.pollenDriftY, 0.2]}>
        {[
          [-0.6, 0.2, 0.1], [0.4, -0.3, 0.2], [-0.1, 0.5, -0.1],
          [0.8, 0.1, 0.3], [-0.9, -0.2, 0.2]
        ].map((pt, i) => (
          <mesh key={i} position={pt as [number, number, number]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshBasicMaterial color={WATERCOLOR_PALETTE.washRoseDust} transparent opacity={0.65} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
