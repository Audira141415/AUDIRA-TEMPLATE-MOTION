import React from "react";
import { computeHd2dState } from "../core/motion";
import { HD2D_PALETTE } from "../lib/palette";

export const PixelHeroBillboard3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeHd2dState(f);
  // Pixel-grid constructed 2D sprite silhouette standing upright in 3D space
  return (
    <group position={[0.15, 0.02 + state.heroBobY, 0.55]}>
      {/* Contact Shadow Disc */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.38, 24]} />
        <meshBasicMaterial color="#05070B" />
      </mesh>

      {/* 16-Bit Pixel Sprite Hero (Layered Pixel Voxel Thin Slabs) */}
      {/* Boots */}
      <mesh position={[-0.12, 0.12, 0]}>
        <boxGeometry args={[0.14, 0.22, 0.06]} />
        <meshStandardMaterial color="#3B2314" roughness={0.9} />
      </mesh>
      <mesh position={[0.12, 0.12, 0]}>
        <boxGeometry args={[0.14, 0.22, 0.06]} />
        <meshStandardMaterial color="#3B2314" roughness={0.9} />
      </mesh>
      {/* Tunic Body */}
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[0.42, 0.42, 0.07]} />
        <meshStandardMaterial color="#1F3A60" roughness={0.85} />
      </mesh>
      {/* Flowing Scarlet Pixel Scarf */}
      <mesh position={[0.08, 0.62, 0.03]}>
        <boxGeometry args={[0.52, 0.14, 0.08]} />
        <meshStandardMaterial
          color={HD2D_PALETTE.heroScarlet}
          emissive={HD2D_PALETTE.heroScarlet}
          emissiveIntensity={0.25}
          roughness={0.8}
        />
      </mesh>
      {/* Pixel Head & Hair */}
      <mesh position={[0, 0.84, 0]}>
        <boxGeometry args={[0.36, 0.32, 0.07]} />
        <meshStandardMaterial color="#F3C6A5" roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.02, 0.01]}>
        <boxGeometry args={[0.42, 0.16, 0.08]} />
        <meshStandardMaterial color="#D99B52" roughness={0.85} />
      </mesh>

      {/* Floating Golden Torch Embers */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[
            -0.5 + i * 0.28 + Math.sin(f * 0.04 + i) * 0.1,
            0.3 + ((state.emberRiseY + i * 0.45) % 2.1),
            0.25 - (i % 2) * 0.3,
          ]}
        >
          <boxGeometry args={[0.05, 0.05, 0.05]} />
          <meshBasicMaterial color={HD2D_PALETTE.lanternAmber} />
        </mesh>
      ))}
    </group>
  );
};