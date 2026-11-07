import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { computeUkiyoState, depthScale, mulberry32 } from "../core/motion";
import { makeCartoucheTexture, makeDotTexture, makeGreatCurlTexture, makeSealTexture } from "../lib/materials";
import { PrintLayer } from "./PrintLayer";

const CREST_Z = -1.0;
const dummy = new THREE.Object3D();

/** The towering foreground crest, its claw-foam spray, the cartouche and the seal stamp. */
export const GreatCrest3D: React.FC<{ f: number }> = ({ f }) => {
  const s = computeUkiyoState(f);
  const tex = useMemo(() => ({ curl: makeGreatCurlTexture(), cart: makeCartoucheTexture(), seal: makeSealTexture(), dot: makeDotTexture() }), []);
  const sprayRef = useRef<THREE.InstancedMesh>(null);
  const spray = useMemo(() => {
    const rnd = mulberry32(31);
    return Array.from({ length: 140 }, () => ({
      u: -0.1 + rnd() * 1.6,
      v: 1.5 + rnd() * 0.6,
      vx: -0.4 - rnd() * 1.4,
      vy: 0.4 + rnd() * 1.4,
      size: 0.03 + rnd() * 0.06,
      ph: rnd() * 6.28,
      z: CREST_Z + 0.05 + rnd() * 1.2,
    }));
  }, []);

  useLayoutEffect(() => {
    const m = sprayRef.current;
    if (!m) return;
    const b = s.burst;
    spray.forEach((p, i) => {
      const k = depthScale(p.z);
      // idle: flecks hover and drift above the crest; payoff: ballistic burst
      const ix = p.u + Math.sin(s.t * 1.3 + p.ph) * 0.05;
      const iy = p.v + Math.sin(s.t * 1.7 + p.ph) * 0.04;
      const tt = b * 1.6;
      const x = ix + p.vx * tt;
      const y = iy + p.vy * tt - 1.4 * tt * tt;
      dummy.position.set(x * k, y * k, p.z);
      dummy.rotation.set(0, 0, 0);
      const vis = b > 0 ? Math.max(0, 1.4 - b * 1.2) : i % 3 === 0 ? 0.45 : 0;
      dummy.scale.setScalar(Math.max(1e-4, p.size * k * vis));
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  }, [spray, s.t, s.burst]);

  const lean = s.breakK * 0.07 + Math.sin(s.t * 1.2) * 0.012;
  const sealScale = s.stamp;

  return (
    <group>
      <PrintLayer tex={tex.curl} u={1.05} v={-0.75} w={3.3} h={6.6} z={CREST_Z} du={-s.breakK * 0.2} dv={s.heave(4.2, 0.05) + s.breakK * 0.1} rotZ={lean} scaleMul={1 + s.breakK * 0.04} />
      <instancedMesh ref={sprayRef} args={[undefined, undefined, spray.length]} castShadow>
        <circleGeometry args={[1, 16]} />
        <meshStandardMaterial map={tex.dot} alphaTest={0.5} roughness={0.95} />
      </instancedMesh>
      {/* cartouche title box and the artist seal (pseudo-script only) */}
      <PrintLayer tex={tex.cart} u={-1.72} v={0.55} w={0.52} h={1.3} z={-0.4} castShadow={false} dv={Math.sin(s.t * 0.8) * 0.01} />
      {sealScale > 0.001 && <PrintLayer tex={tex.seal} castShadow={false} u={-1.72} v={-0.35} w={0.34} h={0.34} z={-0.3} scaleMul={Math.max(0.001, 1.8 - 0.8 * sealScale)} rotZ={(1 - sealScale) * 0.4} />}
    </group>
  );
};
