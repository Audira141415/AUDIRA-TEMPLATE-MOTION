// SCALEFORGE — the six subjects, each modelled in real metres (base on y = 0) and placed by the log-zoom
// transform: render position = (P - C) / S, render scale = 1 / S. Hidden when sub-pixel or gigantic.
import React, { useMemo } from "react";
import * as THREE from "three";
import { SCALE_PALETTE as P } from "../lib/palette";
import { makeEarthTextures, makeFacadeTexture, makeGlow, makeSunTexture } from "../lib/materials";
import { OBJECTS, prng, RADII, toRender, visibleSize, zoomAt } from "../core/motion";

type Z = ReturnType<typeof zoomAt>;

/** Ant, modelled in millimetres then scaled to metres (5 mm body). */
const Ant: React.FC<{ t: number }> = ({ t }) => {
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: P.ant, roughness: 0.28, clearcoat: 0.8, clearcoatRoughness: 0.2 }), []);
  const legs = [-1, 0, 1].flatMap((i) => [1, -1].map((side) => ({ i, side })));
  return (
    <group scale={0.001} position={[0, 0, 0]}>
      <group position={[0, 0.95, 0]}>
        <mesh material={mat} position={[-1.55, 0.15, 0]} scale={[1.15, 0.8, 0.85]} castShadow>
          <sphereGeometry args={[1, 32, 20]} />
        </mesh>
        <mesh material={mat} position={[-0.55, 0.0, 0]} scale={[0.22, 0.2, 0.2]}>
          <sphereGeometry args={[1, 16, 12]} />
        </mesh>
        <mesh material={mat} position={[0.25, 0.1, 0]} scale={[0.75, 0.42, 0.42]} castShadow>
          <sphereGeometry args={[1, 24, 16]} />
        </mesh>
        <mesh material={mat} position={[1.3, 0.3, 0]} scale={[0.55, 0.5, 0.52]} castShadow>
          <sphereGeometry args={[1, 24, 16]} />
        </mesh>
        {/* antennae */}
        {[1, -1].map((s) => (
          <mesh key={s} material={mat} position={[1.7, 0.85, s * 0.25]} rotation={[s * 0.5, 0, -0.9 + Math.sin(t * 3 + s) * 0.12]}>
            <cylinderGeometry args={[0.035, 0.03, 1.2, 6]} />
          </mesh>
        ))}
        {/* legs: upper + lower segment, gentle walk cycle */}
        {legs.map(({ i, side }, k) => {
          const ph = Math.sin(t * 7 + k * 1.7) * 0.18;
          return (
            <group key={k} position={[0.25 + i * 0.3, 0.0, side * 0.3]} rotation={[side * 0.9, i * 0.4 + ph, 0]}>
              <mesh material={mat} position={[0, -0.45, 0]}>
                <cylinderGeometry args={[0.05, 0.045, 0.95, 6]} />
              </mesh>
              <mesh material={mat} position={[0, -0.85, side * 0.35]} rotation={[side * -1.3, 0, 0]}>
                <cylinderGeometry args={[0.04, 0.03, 0.9, 6]} />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
};

/** Architectural scale figure, 1.75 m. */
const Person: React.FC = () => {
  const m = useMemo(() => new THREE.MeshStandardMaterial({ color: P.figure, roughness: 0.55 }), []);
  return (
    <group rotation={[0, -0.4, 0]}>
      {[-0.1, 0.1].map((x) => (
        <mesh key={x} material={m} position={[x, 0.45, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.75, 6, 12]} />
        </mesh>
      ))}
      <mesh material={m} position={[0, 1.18, 0]} castShadow>
        <capsuleGeometry args={[0.17, 0.42, 6, 16]} />
      </mesh>
      {[-0.25, 0.25].map((x) => (
        <mesh key={x} material={m} position={[x, 1.12, 0]} rotation={[0, 0, x > 0 ? 0.12 : -0.12]} castShadow>
          <capsuleGeometry args={[0.05, 0.58, 6, 10]} />
        </mesh>
      ))}
      <mesh material={m} position={[0, 1.62, 0]} castShadow>
        <sphereGeometry args={[0.12, 24, 16]} />
      </mesh>
    </group>
  );
};

/** 330 m tower with setbacks and a spire. */
const Tower: React.FC = () => {
  const facade = useMemo(() => makeFacadeTexture(), []);
  const tiers: [number, number, number][] = [
    [52, 190, 0],
    [40, 80, 190],
    [28, 38, 270],
  ];
  return (
    <group>
      {tiers.map(([w, h, y], i) => (
        <mesh key={i} position={[0, y + h / 2, 0]} castShadow>
          <boxGeometry args={[w, h, w]} />
          <meshStandardMaterial map={facade} roughness={0.25} metalness={0.55} color="#DCE6F0" />
        </mesh>
      ))}
      <mesh position={[0, 308 + 11, 0]}>
        <cylinderGeometry args={[0.6, 2.4, 22, 8]} />
        <meshStandardMaterial color="#C9D3DD" metalness={0.8} roughness={0.25} />
      </mesh>
    </group>
  );
};

/** 8,800 m peak: displaced cone with snowline vertex colours. */
const Mountain: React.FC = () => {
  const geo = useMemo(() => {
    const g = new THREE.ConeGeometry(9500, 8800, 72, 26, false);
    g.translate(0, 4400, 0);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const r = prng(8848);
    const bumps = Array.from({ length: 9 }, () => ({ a: r() * Math.PI * 2, f: 2 + Math.floor(r() * 7), amp: 0.05 + r() * 0.1 }));
    const cols: number[] = [];
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const ang = Math.atan2(z, x);
      const h = y / 8800;
      let k = 1;
      bumps.forEach((b) => (k += Math.sin(ang * b.f + b.a + h * 6) * b.amp * (1 - h)));
      const ridge = 1 + 0.12 * Math.abs(Math.sin(ang * 3 + 1.1)) * (1 - h);
      const s = h < 0.999 ? k * ridge : 1;
      pos.setXYZ(i, x * s, y + Math.sin(ang * 5) * 180 * (1 - h) * h * 4, z * s);
      const snow = h > 0.62 + 0.06 * Math.sin(ang * 4);
      c.set(snow ? P.snow : P.rock);
      if (!snow) c.lerp(new THREE.Color("#5B6B4C"), Math.max(0, 0.25 - h) * 3);
      cols.push(c.r, c.g, c.b);
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <mesh geometry={geo} castShadow>
      <meshStandardMaterial vertexColors roughness={0.9} flatShading />
    </mesh>
  );
};

const Earth: React.FC<{ t: number }> = ({ t }) => {
  const tex = useMemo(() => makeEarthTextures(), []);
  const R = RADII.earth;
  return (
    <group position={[0, R, 0]} rotation={[0.41, t * 0.12, 0]}>
      <mesh>
        <sphereGeometry args={[R, 96, 64]} />
        <meshStandardMaterial map={tex.surface} roughness={0.7} metalness={0} />
      </mesh>
      <mesh rotation={[0, t * 0.05, 0]}>
        <sphereGeometry args={[R * 1.012, 96, 64]} />
        <meshStandardMaterial map={tex.clouds} transparent depthWrite={false} roughness={1} />
      </mesh>
      <mesh>
        <sphereGeometry args={[R * 1.06, 64, 48]} />
        <meshBasicMaterial color={P.atmosphere} transparent opacity={0.16} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
};

const Sun: React.FC<{ t: number }> = ({ t }) => {
  const tex = useMemo(() => makeSunTexture(), []);
  const glow = useMemo(() => makeGlow(), []);
  const R = RADII.sun;
  return (
    <group position={[0, R, 0]}>
      <mesh rotation={[0.1, t * 0.04, 0]}>
        <sphereGeometry args={[R, 96, 64]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <sprite scale={[R * 3.4, R * 3.4, 1]}>
        <spriteMaterial map={glow} color={P.sunEdge} transparent opacity={0.75} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
    </group>
  );
};

export const ScaleObjects3D: React.FC<{ t: number; z: Z }> = ({ t, z }) => {
  return (
    <group>
      {OBJECTS.map((o) => {
        const [x, y] = toRender([o.pos[0], o.pos[1] - o.height / 2], z);
        const renderSize = o.size / z.S;
        if (!visibleSize(renderSize)) return null;
        return (
          <group key={o.key} position={[x, y, 0]} scale={1 / z.S}>
            {o.key === "ant" && <Ant t={t} />}
            {o.key === "person" && <Person />}
            {o.key === "tower" && <Tower />}
            {o.key === "mountain" && <Mountain />}
            {o.key === "earth" && <Earth t={t} />}
            {o.key === "sun" && <Sun t={t} />}
          </group>
        );
      })}
    </group>
  );
};
