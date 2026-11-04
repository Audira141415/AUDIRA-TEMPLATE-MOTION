// NANOFORGE Procedural DNA Double Helix — Helical sugar-phosphate backbones & complementary base-pair rungs.

import React, { useMemo } from "react";
import { NANO_PALETTE } from "../lib/palette";
import { brownianDrift } from "../core/motion";

interface DnaHelixProps {
  f: number;
  rungsCount?: number;
  helixHeight?: number;
  radius?: number;
}

export const DnaHelix: React.FC<DnaHelixProps> = ({
  f,
  rungsCount = 32,
  helixHeight = 12,
  radius = 1.3,
}) => {
  const rotationAngle = f * 0.015;
  const jitter = brownianDrift(f, 0.04, 0.05);

  // Generate helical base-pairs along Y axis
  const rungs = useMemo(() => {
    const items = [];
    const stepY = helixHeight / rungsCount;
    const twistPerRung = (Math.PI * 2 * 2.5) / rungsCount; // 2.5 full helical turns

    for (let i = 0; i < rungsCount; i++) {
      const y = (i - rungsCount / 2) * stepY;
      const angle = i * twistPerRung;
      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      const x2 = -x1;
      const z2 = -z1;

      // Color pair: Alternate Adenine-Thymine (Gold-Cyan) & Guanine-Cytosine (Ruby-Violet)
      const isAtPair = i % 2 === 0;
      const colorA = isAtPair ? NANO_PALETTE.adenineGold : NANO_PALETTE.guanineRuby;
      const colorB = isAtPair ? NANO_PALETTE.thymineCyan : NANO_PALETTE.cytosineViolet;

      items.push({ id: i, y, x1, z1, x2, z2, angle, colorA, colorB });
    }
    return items;
  }, [rungsCount, helixHeight, radius]);

  return (
    <group rotation={[0.2, rotationAngle, jitter]}>
      {rungs.map((r) => (
        <group key={r.id} position={[0, r.y, 0]}>
          {/* Backbone Strand 1 Node */}
          <mesh position={[r.x1, 0, r.z1]}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.3} metalness={0.2} />
          </mesh>

          {/* Backbone Strand 2 Node */}
          <mesh position={[r.x2, 0, r.z2]}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.3} metalness={0.2} />
          </mesh>

          {/* Connecting Nucleotide Base Left */}
          <mesh position={[r.x1 * 0.5, 0, r.z1 * 0.5]} rotation={[0, -r.angle, 0]}>
            <boxGeometry args={[radius * 0.9, 0.08, 0.08]} />
            <meshStandardMaterial color={r.colorA} emissive={r.colorA} emissiveIntensity={0.5} roughness={0.2} />
          </mesh>

          {/* Connecting Nucleotide Base Right */}
          <mesh position={[r.x2 * 0.5, 0, r.z2 * 0.5]} rotation={[0, -r.angle, 0]}>
            <boxGeometry args={[radius * 0.9, 0.08, 0.08]} />
            <meshStandardMaterial color={r.colorB} emissive={r.colorB} emissiveIntensity={0.5} roughness={0.2} />
          </mesh>

          {/* Central Hydrogen Bond Sparkle */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

