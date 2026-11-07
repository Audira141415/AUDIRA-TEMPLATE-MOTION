import React, { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { STAINED_PALETTE } from "../lib/palette";
import { makeGlowTexture, makeLeadMaterial } from "../lib/materials";
import { DIAMOND, ROSE, SILL_Y, buildPanes, lancetShape, makeGlassTexture, type Pane, type RoseSeg } from "../lib/window";
import { easeOutBack, paneProgress, smooth, sunGlow } from "../core/motion";

const tmp = new THREE.Object3D();
const c = new THREE.Color();

/** Where a pane flies from: in front of the window (toward the nave), scattered and tumbling. */
const flightOffset = (seed: number): [number, number, number, number, number] => {
  const a = seed * Math.PI * 2;
  return [Math.cos(a) * (0.6 + seed * 1.4), Math.sin(a * 1.7) * 1.2 + 0.6, 2.4 + seed * 2.6, (seed - 0.5) * 6, (seed * 7.3) % 3];
};

const placePane = (x: number, y: number, seed: number, k: number, t: number) => {
  const [ox, oy, oz, rz, rx] = flightOffset(seed);
  const e = easeOutBack(k);
  const inv = 1 - e;
  tmp.position.set(x + ox * inv, y + oy * inv, oz * inv + Math.sin(t * 0.6 + seed * 9) * 0.004);
  tmp.rotation.set(rx * inv, rx * 0.5 * inv, rz * inv);
  tmp.scale.setScalar(k > 0 ? 1 : 0.0001);
};

/** Brightness of a pane: sun behind it + a glint when it seats in the lead. */
const paneLight = (t: number, delay: number, k: number) => {
  const glint = k >= 1 ? Math.exp(-(t - delay - 0.95) * 3.2) * 0.9 : 0.35 * k;
  return (k > 0 ? 0.25 + 0.75 * smooth(0, 1, k) : 0) * sunGlow(t) + glint;
};

export const LeadlightWindow3D: React.FC<{ t: number }> = ({ t }) => {
  const { panes, rose } = useMemo(() => buildPanes(), []);
  const glassTex = useMemo(() => makeGlassTexture(), []);
  const lead = useMemo(() => makeLeadMaterial(), []);
  const glowTex = useMemo(() => makeGlowTexture(), []);

  const quarries = useMemo(() => {
    const { a, b } = DIAMOND;
    const s = new THREE.Shape();
    const k = 0.84; // inset leaves the lead came visible between panes
    s.moveTo(0, b * k);
    s.lineTo(a * k, 0);
    s.lineTo(0, -b * k);
    s.lineTo(-a * k, 0);
    s.closePath();
    const geo = new THREE.ShapeGeometry(s);
    const mat = new THREE.MeshBasicMaterial({ map: glassTex, side: THREE.DoubleSide });
    const mesh = new THREE.InstancedMesh(geo, mat, panes.length);
    mesh.frustumCulled = false;
    panes.forEach((_, i) => mesh.setColorAt(i, new THREE.Color(0, 0, 0)));
    return mesh;
  }, [panes, glassTex]);

  const roseMeshes = useMemo(
    () =>
      rose.map((s: RoseSeg) => {
        const gap = s.r0 === 0 ? 0 : 0.035 / Math.max(0.4, s.r1);
        const geo = new THREE.RingGeometry(s.r0 === 0 ? 0 : s.r0 + 0.018, s.r1 - 0.018, 24, 1, s.a0 + gap, s.a1 - s.a0 - gap * 2);
        const mat = new THREE.MeshBasicMaterial({ map: glassTex, side: THREE.DoubleSide, color: new THREE.Color(0, 0, 0) });
        return { geo, mat, s };
      }),
    [rose, glassTex],
  );

  useLayoutEffect(() => {
    panes.forEach((p: Pane, i) => {
      const k = paneProgress(t, p.delay);
      placePane(p.x, p.y, p.seed, k, t);
      tmp.updateMatrix();
      quarries.setMatrixAt(i, tmp.matrix);
      c.copy(p.color).multiplyScalar(paneLight(t, p.delay, k));
      quarries.setColorAt(i, c);
    });
    quarries.instanceMatrix.needsUpdate = true;
    if (quarries.instanceColor) quarries.instanceColor.needsUpdate = true;
  });

  const backing = useMemo(() => new THREE.ShapeGeometry(lancetShape(0.02), 48), []);
  const bars = [-1.6, -0.2, 1.2];
  const flare = smooth(8.6, 10.4, t);

  return (
    <group>
      {/* lead backing: everything not glazed reads as came / blackened lead */}
      <mesh geometry={backing} material={lead} position={[0, 0, -0.03]} />
      <primitive object={quarries} />

      {/* rose window segments, each flying in on its own */}
      <group position={[ROSE.x, ROSE.y, 0]}>
        {roseMeshes.map(({ geo, mat, s }, i) => {
          const k = paneProgress(t, s.delay);
          placePane(0, 0, s.seed, k, t);
          mat.color.copy(s.color).multiplyScalar(paneLight(t, s.delay, k) * (s.r0 === 0 ? 1.4 : 1));
          return <mesh key={i} geometry={geo} material={mat} position={tmp.position.clone()} rotation={tmp.rotation.clone()} scale={tmp.scale.x} />;
        })}
        {[0.315, 0.695, 0.995, 1.215].map((r) => (
          <mesh key={r} material={lead} position={[0, 0, 0.02]}>
            <torusGeometry args={[r, r > 1.2 ? 0.05 : 0.022, 8, 96]} />
          </mesh>
        ))}
        {/* sun flare blooming through the heart of the rose at the payoff */}
        <mesh position={[0, 0, 0.12]} scale={0.8 + flare * 2.6}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={glowTex} color={STAINED_PALETTE.sunbeam} transparent opacity={0.15 + flare * 0.7} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>

      {/* iron saddle bars across the lancet */}
      {bars.map((y) => (
        <mesh key={y} material={lead} position={[0, y, 0.04]}>
          <boxGeometry args={[3.2, 0.045, 0.045]} />
        </mesh>
      ))}
      <mesh material={lead} position={[0, SILL_Y - 0.02, 0.03]}>
        <boxGeometry args={[3.1, 0.08, 0.08]} />
      </mesh>
    </group>
  );
};
