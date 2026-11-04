// GLASSCRAFT Glass Sanctuary — hero spatial scene with floating frosted card, refractive droplets, and caustic floor.

import React from "react";
import { GLASS_PALETTE } from "../lib/palette";
import { GlassCard } from "../spatial/GlassCard";
import { LiquidDroplet } from "../spatial/LiquidDroplet";

interface GlassSanctuaryProps {
  f: number;
  cardTiltX?: number;
  cardTiltY?: number;
}

export const GlassSanctuary: React.FC<GlassSanctuaryProps> = ({ f, cardTiltX = 0, cardTiltY = 0 }) => {
  return (
    <group>
      {/* 1. Hero Floating Frosted Glass Card */}
      <GlassCard f={f} tiltX={cardTiltX} tiltY={cardTiltY} />

      {/* 2. Orbiting Optical Liquid Droplets */}
      <LiquidDroplet f={f} initialPos={[-2.4, 1.4, 0.8]} radius={0.38} color={GLASS_PALETTE.prismCyan} speed={0.04} />
      <LiquidDroplet f={f} initialPos={[2.5, -0.8, 1.1]} radius={0.48} color={GLASS_PALETTE.prismMagenta} speed={0.035} />
      <LiquidDroplet f={f} initialPos={[-1.8, -1.9, -0.6]} radius={0.28} color={GLASS_PALETTE.prismAmber} speed={0.045} />
      <LiquidDroplet f={f} initialPos={[2.1, 1.8, -0.9]} radius={0.32} color={GLASS_PALETTE.prismEmerald} speed={0.038} />

      {/* 3. Obsidian Studio Ground Floor with Caustic Specular Pool */}
      <mesh position={[0, -3.8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color={GLASS_PALETTE.voidDark}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </group>
  );
};
