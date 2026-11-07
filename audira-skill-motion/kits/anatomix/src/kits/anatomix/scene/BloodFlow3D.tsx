// ANATOMIX — blood-flow particles: instanced cells riding the blue (oxygen-poor) and red (oxygen-rich) paths,
// surging on every heartbeat. Seeded lateral jitter so the stream has body.
import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ANATOMY_PALETTE as P } from "../lib/palette";
import { BLUE_PATHS, flowPhase, prng, RED_PATHS, seg, TL, beat } from "../core/motion";

const PER = 150;

const Stream: React.FC<{ paths: THREE.CatmullRomCurve3[]; color: string; t: number; on: number; seed: number }> = ({ paths, color, t, on, seed }) => {
  const N = PER * paths.length;
  const ref = useRef<THREE.InstancedMesh>(null);
  const jit = useMemo(() => {
    const r = prng(seed);
    return Array.from({ length: N }, () => ({ u: r(), dx: (r() - 0.5) * 0.09, dy: (r() - 0.5) * 0.09, dz: (r() - 0.5) * 0.09, s: 0.6 + r() * 0.6 }));
  }, [N, seed]);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new THREE.Object3D();
    const ph = flowPhase(t);
    const b = beat(t);
    for (let i = 0; i < N; i++) {
      const j = jit[i];
      const c = paths[i % paths.length];
      const u = (j.u + ph) % 1;
      const p = c.getPointAt(u);
      // fade in along the path as the circuit switches on
      const shown = u < on * 1.05;
      const edge = Math.min(1, u / 0.04, (1 - u) / 0.04);
      o.position.set(p.x + j.dx, p.y + j.dy, p.z + j.dz);
      o.scale.setScalar(shown ? 0.028 * j.s * edge * (1 + 0.25 * b.lub) : 0.0001);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  }, [t, on, jit, paths, N]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, N]} renderOrder={6}>
      <sphereGeometry args={[1, 10, 8]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </instancedMesh>
  );
};

export const BloodFlow3D: React.FC<{ t: number }> = ({ t }) => (
  <group>
    <Stream paths={BLUE_PATHS} color={P.deoxy} t={t} on={seg(t, TL.blue, TL.blue + 1.6)} seed={101} />
    <Stream paths={RED_PATHS} color={P.oxy} t={t} on={seg(t, TL.red, TL.red + 1.6)} seed={202} />
  </group>
);
