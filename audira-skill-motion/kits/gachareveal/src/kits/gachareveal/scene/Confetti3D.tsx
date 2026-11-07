import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { BURST, FLIP, mulberry32 } from "../core/motion";
import { GACHAREVEAL_PALETTE as P } from "../lib/palette";
import { makeGlowTexture } from "../lib/materials";
import { CAPSULE_CENTER } from "./Capsule3D";
import { CARD_REST } from "./HoloCard3D";

// Instanced confetti (ballistic with drag, tumbling quads) fired at the burst and a second puff
// at the flip, plus slow golden motes that drift up around the revealed card.

const N = 520;

export const Confetti3D: React.FC<{ t: number }> = ({ t }) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const glow = useMemo(makeGlowTexture, []);
  const parts = useMemo(() => {
    const rnd = mulberry32(6531);
    return Array.from({ length: N }, (_, i) => {
      const second = i >= N * 0.6;
      const a = rnd() * Math.PI * 2;
      const up = 0.4 + rnd() * 0.9;
      const sp = (second ? 2.2 : 4.2) * (0.5 + rnd());
      return {
        t0: second ? FLIP[1] - 0.15 : BURST,
        o: second ? CARD_REST.clone() : CAPSULE_CENTER.clone(),
        v: new THREE.Vector3(Math.cos(a) * sp, up * sp * 1.1, Math.sin(a) * sp * 0.8),
        spin: new THREE.Vector3(rnd() * 12, rnd() * 12, rnd() * 12),
        c: new THREE.Color(P.confetti[i % P.confetti.length]),
        s: 0.6 + rnd() * 0.8,
      };
    });
  }, []);

  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new THREE.Object3D();
    const drag = 1.6;
    const g = -2.2;
    parts.forEach((p, i) => {
      const a = t - p.t0;
      if (a < 0) {
        o.position.set(0, -50, 0);
        o.scale.setScalar(0.0001);
      } else {
        const k = (1 - Math.exp(-drag * a)) / drag; // integrated velocity with linear drag
        o.position.set(p.o.x + p.v.x * k, p.o.y + p.v.y * k + 0.5 * g * a * a * 0.6, p.o.z + p.v.z * k);
        if (o.position.y < 0.02) o.position.y = 0.02;
        o.rotation.set(p.spin.x * a, p.spin.y * a, p.spin.z * a);
        o.scale.setScalar(p.s * Math.max(0, 1 - a / 5.5));
      }
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
      m.setColorAt(i, p.c);
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [t, parts]);

  const motes = useMemo(() => {
    const rnd = mulberry32(6541);
    return Array.from({ length: 26 }, () => ({ x: (rnd() - 0.5) * 3.2, z: (rnd() - 0.5) * 1.6 + 0.4, ph: rnd(), sp: 0.15 + rnd() * 0.2, s: 0.06 + rnd() * 0.1 }));
  }, []);
  const moteOn = Math.max(0, Math.min(1, (t - FLIP[0]) / 0.8));

  return (
    <group>
      <instancedMesh ref={ref} args={[undefined, undefined, N]}>
        <planeGeometry args={[0.07, 0.11]} />
        <meshStandardMaterial roughness={0.35} metalness={0.5} side={THREE.DoubleSide} emissive="#ffffff" emissiveIntensity={0.25} />
      </instancedMesh>
      {moteOn > 0 &&
        motes.map((m, i) => {
          const u = (t * m.sp + m.ph) % 1;
          return (
            <sprite key={i} position={[m.x, 0.6 + u * 3.6, m.z]} scale={[m.s, m.s, 1]}>
              <spriteMaterial map={glow} color={P.hudGold} transparent opacity={moteOn * Math.sin(Math.PI * u)} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
            </sprite>
          );
        })}
    </group>
  );
};
