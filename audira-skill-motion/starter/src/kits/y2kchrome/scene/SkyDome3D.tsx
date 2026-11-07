import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mulberry32 } from "../core/motion";
import { Y2KCHROME_PALETTE as P } from "../lib/palette";
import { makeGlowTexture, makeSkyGeometry } from "../lib/materials";

// Background + midground: glossy aqua sky dome, a soft sun glow, and puffy cloud banks drifting
// below the hero (Frutiger-aero "above the clouds" staging).

const CLOUDS = 9;
const PUFFS = 8;

export const SkyDome3D: React.FC<{ t: number }> = ({ t }) => {
  const sky = useMemo(() => makeSkyGeometry(45), []);
  const glow = useMemo(makeGlowTexture, []);
  const ref = useRef<THREE.InstancedMesh>(null);
  const clouds = useMemo(() => {
    const rnd = mulberry32(5401);
    return Array.from({ length: CLOUDS }, (_, i) => ({
      x: -9 + (i / (CLOUDS - 1)) * 18 + (rnd() - 0.5) * 1.5,
      y: -2.6 - rnd() * 1.4,
      z: -2 - rnd() * 7,
      speed: 0.08 + rnd() * 0.08,
      puffs: Array.from({ length: PUFFS }, () => ({ dx: (rnd() - 0.5) * 2.6, dy: rnd() * 0.5, dz: (rnd() - 0.5) * 1.2, r: 0.5 + rnd() * 0.6 })),
    }));
  }, []);

  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new THREE.Object3D();
    let n = 0;
    clouds.forEach((c) => {
      const x = ((c.x + t * c.speed + 10) % 20) - 10;
      c.puffs.forEach((p) => {
        o.position.set(x + p.dx, c.y + p.dy, c.z + p.dz);
        o.scale.set(p.r * 1.25, p.r * 0.85, p.r);
        o.updateMatrix();
        m.setMatrixAt(n++, o.matrix);
      });
    });
    m.instanceMatrix.needsUpdate = true;
  }, [t, clouds]);

  return (
    <group>
      <mesh geometry={sky}>
        <meshBasicMaterial vertexColors side={THREE.BackSide} toneMapped={false} />
      </mesh>
      <sprite position={[-6, 7, -20]} scale={[16, 16, 1]}>
        <spriteMaterial map={glow} color="#FFFFFF" transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </sprite>
      <instancedMesh ref={ref} args={[undefined, undefined, CLOUDS * PUFFS]}>
        <sphereGeometry args={[1, 28, 18]} />
        <meshPhysicalMaterial color={P.cloud} roughness={0.85} sheen={1} sheenColor={P.cloudShade} emissive="#BFE4FF" emissiveIntensity={0.25} />
      </instancedMesh>
    </group>
  );
};
