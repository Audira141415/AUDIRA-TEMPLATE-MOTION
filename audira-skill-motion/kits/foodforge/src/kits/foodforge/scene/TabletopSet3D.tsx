import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mulberry32 } from "../core/motion";
import { FOODFORGE_PALETTE as P } from "../lib/palette";
import { makeBokehTexture, makeWalnutTexture } from "../lib/materials";

// The food-studio set: oiled walnut table (midground), warm-lit back wall with defocused bokeh
// practicals (background), side props (soy dish, linen, scallion stalks) and sesame crumbs.

const BokehField: React.FC<{ t: number }> = ({ t }) => {
  const tex = useMemo(() => makeBokehTexture(), []);
  const dots = useMemo(() => {
    const rnd = mulberry32(4522);
    return Array.from({ length: 22 }, () => ({
      x: (rnd() - 0.5) * 9,
      y: 0.6 + rnd() * 4.2,
      z: -5.5 - rnd() * 3.5,
      s: 0.35 + rnd() * 0.9,
      o: 0.18 + rnd() * 0.3,
      ph: rnd() * 6.28,
      warm: rnd() > 0.25,
    }));
  }, []);
  return (
    <group>
      {dots.map((d, i) => (
        <sprite key={i} position={[d.x + Math.sin(t * 0.3 + d.ph) * 0.08, d.y, d.z]} scale={[d.s, d.s, 1]}>
          <spriteMaterial
            map={tex}
            color={d.warm ? P.bokeh : "#FFE2B8"}
            transparent
            opacity={d.o * (0.85 + 0.15 * Math.sin(t * 1.3 + d.ph))}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  );
};

const SesameCrumbs: React.FC = () => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const N = 90;
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const rnd = mulberry32(4533);
    const o = new THREE.Object3D();
    for (let i = 0; i < N; i++) {
      const a = rnd() * Math.PI * 2;
      const r = 1.0 + rnd() * 0.9;
      o.position.set(Math.cos(a) * r + 0.25, 0.008, Math.sin(a) * r * 0.7 + 0.35);
      o.rotation.set(0, rnd() * 6.28, 0);
      o.scale.set(1, 0.45, 0.62);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, N]} castShadow>
      <sphereGeometry args={[0.014, 8, 6]} />
      <meshStandardMaterial color={P.sesame} roughness={0.55} />
    </instancedMesh>
  );
};

const SoyDish: React.FC = () => {
  const geo = useMemo(
    () =>
      new THREE.LatheGeometry(
        [
          new THREE.Vector2(0.0, 0.0),
          new THREE.Vector2(0.18, 0.0),
          new THREE.Vector2(0.27, 0.06),
          new THREE.Vector2(0.29, 0.09),
          new THREE.Vector2(0.26, 0.09),
          new THREE.Vector2(0.17, 0.035),
          new THREE.Vector2(0.0, 0.035),
        ],
        48,
      ),
    [],
  );
  return (
    <group position={[-1.25, 0, -0.55]}>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshPhysicalMaterial color="#E9E1D2" roughness={0.3} clearcoat={0.8} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.062, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.235, 40]} />
        <meshPhysicalMaterial color={P.soy} roughness={0.05} clearcoat={1} clearcoatRoughness={0.02} />
      </mesh>
    </group>
  );
};

const Linen: React.FC = () => (
  <group position={[1.25, 0.012, -0.35]} rotation={[0, -0.35, 0]}>
    <mesh castShadow receiveShadow>
      <boxGeometry args={[0.95, 0.024, 0.62]} />
      <meshStandardMaterial color="#D8CBB3" roughness={0.95} />
    </mesh>
    <mesh position={[0, 0.02, 0.18]} castShadow>
      <boxGeometry args={[0.95, 0.018, 0.2]} />
      <meshStandardMaterial color="#C9B99C" roughness={0.95} />
    </mesh>
    {/* chopstick rest */}
    <mesh position={[-0.25, 0.06, -0.1]} rotation={[0, 0, Math.PI / 2]} castShadow>
      <capsuleGeometry args={[0.035, 0.16, 6, 12]} />
      <meshPhysicalMaterial color="#3E6E8C" roughness={0.25} clearcoat={1} />
    </mesh>
  </group>
);

const ScallionStalks: React.FC = () => (
  <group position={[0.95, 0.03, 0.75]} rotation={[0, 0.6, 0]}>
    {[0, 1, 2].map((i) => (
      <group key={i} position={[0, 0, i * 0.075]} rotation={[0, i * 0.08, Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.026, 0.03, 0.75, 14]} />
          <meshPhysicalMaterial color={P.scallion} roughness={0.35} clearcoat={0.6} />
        </mesh>
        <mesh position={[0, -0.47, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.034, 0.2, 14]} />
          <meshPhysicalMaterial color="#EEF2DE" roughness={0.4} clearcoat={0.5} />
        </mesh>
      </group>
    ))}
  </group>
);

export const TabletopSet3D: React.FC<{ f: number }> = ({ f }) => {
  const t = f / 60;
  const wood = useMemo(() => {
    const tex = makeWalnutTexture();
    tex.repeat.set(1.6, 1.6);
    return tex;
  }, []);
  const wallGlow = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 512;
    const g = c.getContext("2d")!;
    g.fillStyle = P.backdrop;
    g.fillRect(0, 0, 512, 512);
    const grad = g.createRadialGradient(256, 300, 0, 256, 300, 300);
    grad.addColorStop(0, "#6B3A1C");
    grad.addColorStop(0.45, "#2E180C");
    grad.addColorStop(1, P.backdrop);
    g.fillStyle = grad;
    g.fillRect(0, 0, 512, 512);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  return (
    <group>
      {/* Back wall with warm glow pool (background plane) */}
      <mesh position={[0, 2.4, -9.5]}>
        <planeGeometry args={[22, 14]} />
        <meshBasicMaterial map={wallGlow} toneMapped={false} />
      </mesh>
      <BokehField t={t} />

      {/* Walnut table */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[9, 9]} />
        <meshPhysicalMaterial map={wood} roughness={0.42} clearcoat={0.35} clearcoatRoughness={0.35} color="#B07A52" />
      </mesh>

      <SoyDish />
      <Linen />
      <ScallionStalks />
      <SesameCrumbs />
    </group>
  );
};
