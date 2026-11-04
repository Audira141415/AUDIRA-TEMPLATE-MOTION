// NANOFORGE MicroCosmos — Hero molecular scene with DNA helix, cellular vesicles & suspended bio-particles.

import React, { useMemo } from "react";
import { NANO_PALETTE } from "../lib/palette";
import { DnaHelix } from "../cellular/DnaHelix";
import { CellularVesicle } from "../cellular/CellularVesicle";
import { hash } from "../core/noise";

interface MicroCosmosProps {
  f: number;
}

export const MicroCosmos: React.FC<MicroCosmosProps> = ({ f }) => {
  // Ambient floating nanoparticles in cytoplasm
  const particles = useMemo(() => {
    const list = [];
    for (let i = 0; i < 48; i++) {
      const x = (hash(i * 3 + 1) - 0.5) * 14;
      const y = (hash(i * 3 + 2) - 0.5) * 14;
      const z = (hash(i * 3 + 3) - 0.5) * 10;
      const size = 0.05 + hash(i) * 0.08;
      const speed = 0.01 + hash(i + 50) * 0.02;
      list.push({ id: i, x, y, z, size, speed });
    }
    return list;
  }, []);

  return (
    <group>
      {/* 1. Hero DNA Double Helix at Center */}
      <DnaHelix f={f} rungsCount={36} helixHeight={14} radius={1.4} />

      {/* 2. Surrounding Cellular Vesicles */}
      <CellularVesicle f={f} initialPos={[-3.2, 2.5, -2]} radius={0.9} color={NANO_PALETTE.membraneGlow} />
      <CellularVesicle f={f} initialPos={[3.4, -1.8, -1.5]} radius={1.1} color={NANO_PALETTE.thymineCyan} />
      <CellularVesicle f={f} initialPos={[-2.8, -3.2, 1.2]} radius={0.75} color={NANO_PALETTE.cytosineViolet} />
      <CellularVesicle f={f} initialPos={[2.6, 3.6, 1.8]} radius={0.65} color={NANO_PALETTE.guanineRuby} />

      {/* 3. Ambient Brownian Molecular Solutes */}
      {particles.map((p) => {
        const driftY = ((f * p.speed + p.y + 7) % 14) - 7;
        const driftX = p.x + Math.sin(f * 0.03 + p.id) * 0.2;
        return (
          <mesh key={p.id} position={[driftX, driftY, p.z]}>
            <sphereGeometry args={[p.size, 12, 12]} />
            <meshStandardMaterial
              color={NANO_PALETTE.thymineCyan}
              emissive={NANO_PALETTE.thymineCyan}
              emissiveIntensity={0.8}
              transparent
              opacity={0.6}
            />
          </mesh>
        );
      })}
    </group>
  );
};

