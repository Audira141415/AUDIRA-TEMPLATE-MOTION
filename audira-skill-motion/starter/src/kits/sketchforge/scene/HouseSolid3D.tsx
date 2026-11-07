import React, { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { SKETCH_PALETTE as P } from "../lib/palette";
import { lerpColor, makeHatchTexture } from "../lib/materials";
import { HOUSE } from "../core/house";
import { SketchState, rng } from "../core/motion";

// Solid house: fills bottom-up behind a rising clip plane (clay pass), then shifts clay -> colour.
type Part = { key: string; final: string; emissive?: string };
const PARTS: Part[] = [
  { key: "walls", final: P.paperWhite },
  { key: "roof", final: P.graphiteMid },
  { key: "chimney", final: P.accent },
  { key: "door", final: P.accent },
  { key: "frames", final: P.accentDeep },
  { key: "glass", final: P.accentGlow, emissive: P.accentGlow },
  { key: "porch", final: P.paperShade },
];

export const HouseSolid3D: React.FC<{ s: SketchState; liftY: number }> = ({ s, liftY }) => {
  const { gl } = useThree();
  useLayoutEffect(() => {
    gl.localClippingEnabled = true;
  }, [gl]);

  const clip = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), 0), []);
  const hatch = useMemo(() => {
    const t = makeHatchTexture();
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(3, 3);
    return t;
  }, []);
  const mats = useMemo(() => {
    const out: Record<string, THREE.MeshStandardMaterial> = {};
    for (const p of PARTS)
      out[p.key] = new THREE.MeshStandardMaterial({ color: P.clay, roughness: 0.82, map: hatch, clippingPlanes: [clip], side: THREE.DoubleSide });
    return out;
  }, [clip, hatch]);
  const gableGeo = useMemo(() => {
    const sh = new THREE.Shape();
    sh.moveTo(-HOUSE.hd, 0);
    sh.lineTo(HOUSE.hd, 0);
    sh.lineTo(0, HOUSE.ridgeY - HOUSE.wallH);
    sh.lineTo(-HOUSE.hd, 0);
    const g = new THREE.ExtrudeGeometry(sh, { depth: HOUSE.hw * 2, bevelEnabled: false });
    g.rotateY(Math.PI / 2);
    g.translate(-HOUSE.hw, HOUSE.wallH, 0);
    return g;
  }, []);

  // clay fill: plane rises from below the floor to above the chimney, in world space (house may be lifted)
  clip.constant = -0.05 + s.clay * 2.75 + liftY;
  for (const p of PARTS) {
    const m = mats[p.key];
    m.color.copy(lerpColor(P.clay, p.final, s.colour));
    if (p.emissive) {
      m.emissive.set(p.emissive);
      m.emissiveIntensity = 0.9 * s.colour;
    }
  }
  if (s.clay <= 0) return null;

  const slope = Math.atan2(HOUSE.ridgeY - HOUSE.eaveY, HOUSE.eaveZ);
  const slopeLen = Math.hypot(HOUSE.ridgeY - HOUSE.eaveY, HOUSE.eaveZ);
  return (
    <group>
      <mesh material={mats.walls} position={[0, HOUSE.wallH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[HOUSE.hw * 2, HOUSE.wallH, HOUSE.hd * 2]} />
      </mesh>
      <mesh geometry={gableGeo} material={mats.walls} castShadow />
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          material={mats.roof}
          position={[0, (HOUSE.ridgeY + HOUSE.eaveY) / 2 + 0.04, (side * HOUSE.eaveZ) / 2]}
          rotation={[side * slope, 0, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[HOUSE.eaveX * 2, 0.08, slopeLen + 0.04]} />
        </mesh>
      ))}
      <mesh material={mats.chimney} position={[0.55, 2.025, -0.3]} castShadow>
        <boxGeometry args={[0.28, 0.95, 0.28]} />
      </mesh>
      <mesh material={mats.door} position={[0, 0.39, HOUSE.hd + 0.015]}>
        <boxGeometry args={[0.44, 0.78, 0.04]} />
      </mesh>
      <mesh material={mats.porch} position={[0, 0.04, HOUSE.hd + 0.15]} receiveShadow castShadow>
        <boxGeometry args={[0.9, 0.08, 0.3]} />
      </mesh>
      {[-0.68, 0.68].map((x) => (
        <group key={x} position={[x, 0.71, HOUSE.hd + 0.012]}>
          <mesh material={mats.frames}>
            <boxGeometry args={[0.44, 0.48, 0.03]} />
          </mesh>
          <mesh material={mats.glass} position={[0, 0, 0.012]}>
            <boxGeometry args={[0.36, 0.4, 0.02]} />
          </mesh>
        </group>
      ))}
      <group position={[HOUSE.hw + 0.012, 0.71, 0]}>
        <mesh material={mats.frames}>
          <boxGeometry args={[0.03, 0.48, 0.44]} />
        </mesh>
        <mesh material={mats.glass} position={[0.012, 0, 0]}>
          <boxGeometry args={[0.02, 0.4, 0.36]} />
        </mesh>
      </group>
    </group>
  );
};

/** Chimney puffs: graphite-tinted spheres that rise, swell and thin out (cyclic, deterministic). */
export const ChimneySmoke: React.FC<{ s: SketchState }> = ({ s }) => {
  const seeds = useMemo(() => {
    const r = rng(9);
    return Array.from({ length: 7 }, (_, i) => ({ off: i / 7, dx: (r() - 0.5) * 0.2, size: 0.12 + r() * 0.08 }));
  }, []);
  if (s.smoke <= 0) return null;
  return (
    <group position={[0.55, 2.55, -0.3]}>
      {seeds.map((sd, i) => {
        const k = (sd.off + s.smoke * 0.45) % 1;
        const born = s.smoke * 0.45 > sd.off ? 1 : 0;
        const sc = (sd.size * 0.6 + k * 0.2) * born;
        return (
          <mesh key={i} position={[sd.dx + k * 0.5, k * 1.5, -k * 0.2]} scale={sc}>
            <sphereGeometry args={[1, 14, 10]} />
            <meshStandardMaterial color={P.paper} roughness={1} transparent opacity={(1 - k) * 0.85} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
};
