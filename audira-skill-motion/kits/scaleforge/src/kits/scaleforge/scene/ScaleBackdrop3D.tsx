// SCALEFORGE — backdrop planes: white studio floor that dissolves as the exponent climbs, a star field that
// fades in, and foreground motes for depth. Background colour itself is set in the example from spaceMix.
import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { SCALE_PALETTE as P } from "../lib/palette";
import { prng, spaceMix, toRender, zoomAt } from "../core/motion";

type Z = ReturnType<typeof zoomAt>;
const STARS = 2600;
const MOTES = 90;

export const ScaleBackdrop3D: React.FC<{ z: Z; t: number }> = ({ z, t }) => {
  const sm = spaceMix(z.e);
  const groundY = toRender([0, 0], z)[1];
  const moteRef = useRef<THREE.InstancedMesh>(null);

  const stars = useMemo(() => {
    const r = prng(1977);
    const pos = new Float32Array(STARS * 3);
    const col = new Float32Array(STARS * 3);
    const c = new THREE.Color();
    for (let i = 0; i < STARS; i++) {
      const u = r() * 2 - 1;
      const a = r() * Math.PI * 2;
      const rad = 380 + r() * 120;
      const s = Math.sqrt(1 - u * u);
      pos.set([Math.cos(a) * s * rad, u * rad, Math.sin(a) * s * rad - 60], i * 3);
      c.setHSL(0.58 + r() * 0.12, 0.4, 0.6 + r() * 0.4);
      col.set([c.r, c.g, c.b], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return g;
  }, []);

  const motes = useMemo(() => {
    const r = prng(55);
    return Array.from({ length: MOTES }, () => ({ x: -4 + r() * 8, y: -5 + r() * 10, z: 3 + r() * 4.5, ph: r() * 6.28, s: 0.5 + r() }));
  }, []);

  useLayoutEffect(() => {
    const m = moteRef.current;
    if (!m) return;
    const o = new THREE.Object3D();
    motes.forEach((d, i) => {
      o.position.set(d.x + Math.sin(t * 0.4 + d.ph) * 0.15, d.y + Math.cos(t * 0.3 + d.ph) * 0.15, d.z);
      o.scale.setScalar(0.012 * d.s);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  }, [t, motes]);

  return (
    <group>
      {/* studio floor (shadow catcher) */}
      {sm < 0.98 && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, groundY, -40]} receiveShadow>
          <planeGeometry args={[400, 240]} />
          <meshStandardMaterial color={P.studioFloor} roughness={0.75} transparent opacity={1 - sm} />
        </mesh>
      )}
      {/* stars */}
      <points geometry={stars}>
        <pointsMaterial vertexColors size={2.2} sizeAttenuation={false} transparent opacity={sm} depthWrite={false} />
      </points>
      {/* foreground motes: dust in the studio, faint glints in space */}
      <instancedMesh ref={moteRef} args={[undefined, undefined, MOTES]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color={sm > 0.5 ? "#BFD6FF" : "#8D96A3"} transparent opacity={0.35} depthWrite={false} />
      </instancedMesh>
    </group>
  );
};
