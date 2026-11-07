// TERRARIUM — the vessel and its room: lathed refractive glass jar, cork stopper, condensation droplets on the
// inner wall (some slide down), walnut table, sky dome tinted by the day cycle, window bokeh, foreground fern.
import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { makeBokehTexture, makeCorkTexture, makeGlassMaterial, makeLeafTexture, makeWoodTexture } from "../lib/materials";
import { clamp, dayState, JAR, prng } from "../core/motion";

const DROPS = 460;
const BOKEH = 22;

const PROFILE: [number, number][] = [
  [0.001, 0],
  [0.86, 0],
  [0.96, 0.03],
  [0.995, 0.1],
  [1.0, 0.25],
  [1.0, 1.95],
  [0.985, 2.12],
  [0.93, 2.3],
  [0.82, 2.44],
  [0.68, 2.55],
  [0.61, 2.62],
  [0.6, 2.7],
  [0.63, 2.73],
  [0.64, 2.77],
  [0.6, 2.79],
];

export const GlassJar3D: React.FC<{ t: number; leaf: { pos: [number, number, number]; quat: [number, number, number, number] } }> = ({ t, leaf }) => {
  const glass = useMemo(() => makeGlassMaterial(), []);
  const jarGeo = useMemo(() => new THREE.LatheGeometry(PROFILE.map(([x, y]) => new THREE.Vector2(x * JAR.r, y)), 128), []);
  const wood = useMemo(() => makeWoodTexture(), []);
  const cork = useMemo(() => makeCorkTexture(), []);
  const leafTex = useMemo(() => makeLeafTexture(), []);
  const bokehTex = useMemo(() => makeBokehTexture(), []);
  const dropRef = useRef<THREE.InstancedMesh>(null);

  const drops = useMemo(() => {
    const r = prng(6262);
    return Array.from({ length: DROPS }, () => ({
      a: r() * Math.PI * 2,
      y: 1.05 + Math.pow(r(), 0.7) * 1.25,
      s: 0.006 + Math.pow(r(), 3) * 0.028,
      slide: r() > 0.9 ? 0.04 + r() * 0.1 : 0,
      ph: r(),
    }));
  }, []);
  const bokeh = useMemo(() => {
    const r = prng(7373);
    return Array.from({ length: BOKEH }, () => {
      const a = r() * Math.PI * 2;
      const rad = 9 + r() * 5;
      return { p: [Math.cos(a) * rad, 1 + r() * 4.5, Math.sin(a) * rad] as [number, number, number], s: 0.5 + r() * 1.1, warm: r() > 0.35 };
    });
  }, []);

  useLayoutEffect(() => {
    const m = dropRef.current;
    if (!m) return;
    const o = new THREE.Object3D();
    drops.forEach((d, i) => {
      // sliding drops run down and respawn (condensation cycle)
      const yy = d.slide ? 2.3 - (((d.ph + t * d.slide) % 1) * 1.25) : d.y;
      const rad = yy > 1.95 ? 0.985 - (yy - 1.95) * 0.35 : 0.985;
      o.position.set(Math.cos(d.a) * rad * JAR.r, yy, Math.sin(d.a) * rad * JAR.r);
      o.lookAt(0, yy, 0);
      const grow = 0.6 + 0.4 * clamp(t / 6);
      o.scale.set(d.s * grow, d.s * grow * (d.slide ? 1.5 : 1), d.s * 0.45);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  }, [t, drops]);

  const day = dayState(t);

  return (
    <group>
      {/* room: sky dome + window bokeh */}
      <mesh>
        <sphereGeometry args={[30, 32, 16]} />
        <meshBasicMaterial color={day.sky} side={THREE.BackSide} fog={false} />
      </mesh>
      {bokeh.map((b, i) => (
        <sprite key={i} position={b.p} scale={[b.s, b.s, 1]}>
          <spriteMaterial
            map={bokehTex}
            color={b.warm ? "#FFD59A" : "#CFE8FF"}
            transparent
            opacity={0.18 + 0.55 * day.night}
            depthWrite={false}
            fog={false}
          />
        </sprite>
      ))}

      {/* table */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
        <circleGeometry args={[9, 64]} />
        <meshStandardMaterial map={wood} roughness={0.5} metalness={0.05} />
      </mesh>

      {/* jar + stopper */}
      <mesh geometry={jarGeo} material={glass} castShadow={false} renderOrder={10} />
      <mesh position={[0, 2.78, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.57, 0.3, 48]} />
        <meshStandardMaterial map={cork} roughness={0.92} />
      </mesh>

      {/* condensation */}
      <instancedMesh ref={dropRef} args={[undefined, undefined, DROPS]} renderOrder={11}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshPhysicalMaterial color="#FFFFFF" roughness={0.02} clearcoat={1} transparent opacity={0.75} depthWrite={false} />
      </instancedMesh>

      {/* foreground: out-of-focus fern frond hanging in front of the lens */}
      <mesh position={leaf.pos} quaternion={leaf.quat} renderOrder={20}>
        <planeGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial map={leafTex} transparent depthWrite={false} color={new THREE.Color("#FFFFFF").multiplyScalar(0.35 + 0.65 * (1 - day.night))} />
      </mesh>
    </group>
  );
};
