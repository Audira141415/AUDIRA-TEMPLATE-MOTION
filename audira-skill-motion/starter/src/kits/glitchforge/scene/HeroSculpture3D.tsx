import React, { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { GLITCH_PALETTE as P } from "../lib/palette";
import { makeChromeMaterial, makePearlMaterial } from "../lib/materials";
import { GlitchState, rng } from "../core/motion";

// The clean hero: a pearl torus-knot sculpture with orbiting chrome beads. During corruption the knot is
// cut into horizontal slices (clipping planes) that shear sideways, and additive R/B ghost copies drift
// off it — the 3D layer of the glitch, under the full-frame post pass.
const SLICES = 6;
const Y0 = 1.0;
const Y1 = 3.6;

export const HeroSculpture3D: React.FC<{ s: GlitchState }> = ({ s }) => {
  const { gl } = useThree();
  useLayoutEffect(() => {
    gl.localClippingEnabled = true;
  }, [gl]);
  const res = useMemo(() => {
    const knot = new THREE.TorusKnotGeometry(0.72, 0.24, 320, 48, 2, 3);
    const slices = Array.from({ length: SLICES }, (_, i) => {
      const lo = Y0 + ((Y1 - Y0) * i) / SLICES;
      const hi = Y0 + ((Y1 - Y0) * (i + 1)) / SLICES;
      const m = makePearlMaterial();
      // keep y in [lo, hi] (first/last slice open-ended)
      m.clippingPlanes = [
        ...(i > 0 ? [new THREE.Plane(new THREE.Vector3(0, 1, 0), -lo)] : []),
        ...(i < SLICES - 1 ? [new THREE.Plane(new THREE.Vector3(0, -1, 0), hi)] : []),
      ];
      m.clipShadows = true;
      return m;
    });
    const ghost = (c: string) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false, wireframe: true });
    return { knot, slices, chrome: makeChromeMaterial(), ghostR: ghost(P.signalRed), ghostB: ghost(P.signalBlue), bead: new THREE.SphereGeometry(0.16, 32, 24) };
  }, []);

  const t = s.t;
  const spin = t * 0.35;
  const r = rng(900 + Math.floor(t * 12) * 7);
  const center: [number, number, number] = [0, 2.3, 0];
  return (
    <group>
      {/* slices: each one shears independently when the feed corrupts */}
      {res.slices.map((m, i) => {
        const dx = (r() - 0.5) * 0.7 * s.slice * (r() < 0.6 ? 1 : 0);
        return (
          <group key={i} position={[dx, 0, 0]}>
            <mesh geometry={res.knot} material={m} position={center} rotation={[0.35, spin, 0.1]} castShadow receiveShadow />
          </group>
        );
      })}
      {s.ghost > 0.02 && (
        <>
          <mesh geometry={res.knot} material={res.ghostR} position={[center[0] + 0.25 * s.ghost, center[1] + 0.05 * s.ghost, center[2]]} rotation={[0.35, spin - 0.08 * s.ghost, 0.1]} />
          <mesh geometry={res.knot} material={res.ghostB} position={[center[0] - 0.25 * s.ghost, center[1] - 0.04 * s.ghost, center[2]]} rotation={[0.35, spin + 0.08 * s.ghost, 0.1]} />
        </>
      )}
      {/* orbiting chrome beads */}
      {[0, 1, 2, 3, 4].map((i) => {
        const a = t * 0.9 + (i / 5) * Math.PI * 2;
        const y = 2.3 + Math.sin(a * 2 + i) * 0.35;
        return <mesh key={i} geometry={res.bead} material={res.chrome} position={[Math.cos(a) * 1.55, y, Math.sin(a) * 1.55]} scale={0.7 + (i % 3) * 0.25} castShadow />;
      })}
    </group>
  );
};
