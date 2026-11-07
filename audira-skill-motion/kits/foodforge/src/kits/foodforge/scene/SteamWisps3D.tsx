import React, { useMemo } from "react";
import * as THREE from "three";
import { mulberry32 } from "../core/motion";
import { makeSteamTexture } from "../lib/materials";
import { BROTH_Y } from "./RamenBowl3D";

// Rising steam: camera-facing additive sprites on looping, phase-offset lifecycles. Backlit by
// the warm rim light so it reads against the dark studio void.

export const SteamWisps3D: React.FC<{ t: number; steam: number }> = ({ t, steam }) => {
  const texes = useMemo(() => [makeSteamTexture(11), makeSteamTexture(23), makeSteamTexture(37)], []);
  const wisps = useMemo(() => {
    const rnd = mulberry32(4590);
    return Array.from({ length: 16 }, (_, i) => ({
      x: (rnd() - 0.5) * 0.9,
      z: (rnd() - 0.5) * 0.7,
      period: 3.0 + rnd() * 1.6,
      phase: rnd(),
      drift: 0.2 + rnd() * 0.3,
      tex: i % 3,
      s: 0.55 + rnd() * 0.45,
    }));
  }, []);
  return (
    <group>
      {wisps.map((w, i) => {
        const u = (t / w.period + w.phase) % 1;
        const y = BROTH_Y + 0.1 + u * 1.9;
        const x = w.x * (1 - u * 0.4) + Math.sin(t * 0.9 + i * 1.7 + u * 3) * w.drift * u;
        const life = Math.sin(Math.PI * u);
        const s = w.s * (0.6 + u * 1.3);
        return (
          <sprite key={i} position={[x, y, w.z]} scale={[s, s * 1.5, 1]}>
            <spriteMaterial
              map={texes[w.tex]}
              color="#FFD9B0"
              transparent
              opacity={life * 0.36 * steam}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              rotation={u * 0.8 + i}
            />
          </sprite>
        );
      })}
    </group>
  );
};
