// TERRARIUM — the resident: a tiny snail with a spiral shell (instanced spheres along a log spiral),
// a soft foot that ripples as it glides, and eye stalks that sway. Its path comes from snailAt(t).
import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { TERRA_PALETTE as P } from "../lib/palette";
import { snailAt } from "../core/motion";

const SHELL = 46;

export const Snail3D: React.FC<{ t: number }> = ({ t }) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const body = useMemo(() => new THREE.MeshPhysicalMaterial({ color: P.snailBody, roughness: 0.35, clearcoat: 0.8, clearcoatRoughness: 0.3 }), []);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new THREE.Object3D();
    const c = new THREE.Color();
    for (let k = 0; k < SHELL; k++) {
      const u = k / (SHELL - 1);
      const ang = u * Math.PI * 4.4;
      const rad = 0.052 * Math.exp(-u * 1.5);
      o.position.set(0, Math.sin(ang) * rad, Math.cos(ang) * rad);
      o.scale.setScalar(0.046 * Math.exp(-u * 1.7) + 0.004);
      o.updateMatrix();
      m.setMatrixAt(k, o.matrix);
      m.setColorAt(k, c.set(k % 6 < 3 ? P.shell : P.shellBand));
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, []);

  const s = snailAt(t);
  const stretch = 1 + 0.06 * s.wave;
  return (
    <group position={[s.x, s.y + 0.012, s.z]} rotation={[0, s.heading, 0]}>
      {/* foot / body along +z */}
      <mesh material={body} position={[0, 0.012, 0.02]} rotation={[Math.PI / 2, 0, 0]} scale={[1, stretch, 0.55]} castShadow>
        <capsuleGeometry args={[0.026, 0.15, 6, 14]} />
      </mesh>
      {/* head + eye stalks */}
      <group position={[0, 0.03, 0.11 * stretch]}>
        {[1, -1].map((sd) => (
          <group key={sd} rotation={[-0.5 + Math.sin(t * 2 + sd) * 0.08, 0, sd * 0.3]}>
            <mesh material={body} position={[0, 0.03, 0]}>
              <cylinderGeometry args={[0.004, 0.006, 0.06, 8]} />
            </mesh>
            <mesh position={[0, 0.062, 0]}>
              <sphereGeometry args={[0.007, 10, 8]} />
              <meshStandardMaterial color="#2A2420" roughness={0.3} />
            </mesh>
          </group>
        ))}
      </group>
      {/* shell sits on the back, coiled in the y-z plane */}
      <group position={[0, 0.065, -0.02]} rotation={[0, 0, 0.12]}>
        <instancedMesh ref={ref} args={[undefined, undefined, SHELL]} castShadow>
          <sphereGeometry args={[1, 16, 12]} />
          <meshPhysicalMaterial roughness={0.3} clearcoat={1} clearcoatRoughness={0.15} />
        </instancedMesh>
      </group>
    </group>
  );
};
