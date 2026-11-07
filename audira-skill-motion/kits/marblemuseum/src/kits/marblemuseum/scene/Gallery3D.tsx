import React, { useLayoutEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MARBLE_PALETTE } from "../lib/palette";
import { makeBeamTexture, makeEnvironment, makeFloorTexture, makeGiltMaterial, makeMarbleMaterial, makePaintingTexture } from "../lib/materials";
import { BUST_HEAD, mulberry32, skylight } from "../core/motion";

const MOTES = 320;
const tmp = new THREE.Object3D();

/** Fluted Doric-style shaft: cylinder with radial flutes carved into its vertices. */
const flutedShaft = (r: number, h: number) => {
  const geo = new THREE.CylinderGeometry(r * 0.92, r, h, 96, 1, true);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const a = Math.atan2(z, x);
    const k = 1 - 0.05 * Math.pow(Math.abs(Math.cos(a * 10)), 0.6);
    pos.setX(i, x * k);
    pos.setZ(i, z * k);
  }
  geo.computeVertexNormals();
  return geo;
};

const Column: React.FC<{ pos: [number, number, number]; mat: THREE.Material; shaft: THREE.BufferGeometry }> = ({ pos, mat, shaft }) => (
  <group position={pos}>
    <mesh material={mat} position={[0, 0.12, 0]}>
      <boxGeometry args={[0.95, 0.24, 0.95]} />
    </mesh>
    <mesh material={mat} position={[0, 0.3, 0]}>
      <torusGeometry args={[0.36, 0.07, 12, 48]} />
    </mesh>
    <mesh geometry={shaft} material={mat} position={[0, 3.2, 0]} />
    <mesh material={mat} position={[0, 6.2, 0]}>
      <cylinderGeometry args={[0.48, 0.34, 0.24, 48]} />
    </mesh>
    <mesh material={mat} position={[0, 6.4, 0]}>
      <boxGeometry args={[1.0, 0.16, 1.0]} />
    </mesh>
  </group>
);

/** Classical gallery: polished floor, oxblood walls with dado, coffered skylight, columns, gilded painting, skylight beam + motes. */
export const Gallery3D: React.FC<{ t: number }> = ({ t }) => {
  const { gl, scene } = useThree();
  const env = useMemo(() => makeEnvironment(gl), [gl]);
  useLayoutEffect(() => {
    scene.environment = env;
    scene.environmentIntensity = 0.18;
    scene.background = new THREE.Color("#120807");
    scene.fog = new THREE.Fog("#1A0C0A", 9, 24);
  }, [scene, env]);

  const sky = skylight(t);
  const floorTex = useMemo(() => {
    const tex = makeFloorTexture();
    tex.repeat.set(3, 3);
    return tex;
  }, []);
  const colMat = useMemo(() => makeMarbleMaterial({ color: "#E4DDD1", scale: 0.7, strength: 0.4, roughness: 0.4 }), []);
  const shaft = useMemo(() => flutedShaft(0.36, 5.8), []);
  const gilt = useMemo(() => makeGiltMaterial(), []);
  const painting = useMemo(() => makePaintingTexture(), []);
  const beam = useMemo(() => makeBeamTexture(), []);
  const spotTarget = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(BUST_HEAD[0], BUST_HEAD[1] - 0.2, BUST_HEAD[2] + 0.1);
    o.updateMatrixWorld();
    return o;
  }, []);

  const motes = useMemo(() => {
    const rnd = mulberry32(6120);
    const mesh = new THREE.InstancedMesh(
      new THREE.SphereGeometry(1, 6, 6),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(MARBLE_PALETTE.skylight).multiplyScalar(1.4), transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }),
      MOTES,
    );
    mesh.frustumCulled = false;
    const seeds = Array.from({ length: MOTES }, () => ({ a: rnd() * 6.28, r: Math.sqrt(rnd()) * 0.9, y: rnd(), s: 0.004 + rnd() * 0.008, ph: rnd() * 6.28 }));
    return { mesh, seeds };
  }, []);
  useLayoutEffect(() => {
    motes.seeds.forEach((p, i) => {
      const y = 0.4 + ((p.y + t * 0.015) % 1) * 6.6;
      tmp.position.set(Math.cos(p.a + t * 0.05) * p.r + Math.sin(t * 0.4 + p.ph) * 0.05, y, 0.35 + Math.sin(p.a + t * 0.05) * p.r * 0.8);
      tmp.scale.setScalar(p.s * (0.6 + 0.4 * Math.sin(t * 1.7 + p.ph)) * (0.6 + 0.6 * sky));
      tmp.updateMatrix();
      motes.mesh.setMatrixAt(i, tmp.matrix);
    });
    motes.mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* light: skylight key on the face, warm rim from behind, low gallery fill */}
      <ambientLight intensity={0.06} color="#F3E2CC" />
      <hemisphereLight args={["#F7EBDD", "#2A1210", 0.18]} />
      <spotLight position={[0.6, 7.4, 1.6]} target={spotTarget} angle={0.32} penumbra={0.75} intensity={22 * sky} distance={14} decay={1.5} color={MARBLE_PALETTE.skylight} />
      <directionalLight position={[-2.5, 4, -3.5]} intensity={0.7 + 0.6 * sky} color={MARBLE_PALETTE.rimWarm} />
      <pointLight position={[2.8, 2.4, 2.2]} intensity={1.2} distance={7} color="#FFDDB5" />
      <pointLight position={[0, 3.2, -3.2]} intensity={5} distance={4} color="#FFD7A0" />

      {/* polished floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial map={floorTex} roughness={0.16} metalness={0.05} envMapIntensity={0.8} />
      </mesh>

      {/* walls with dado and crown */}
      {[
        { p: [0, 3.5, -4.2] as [number, number, number], r: 0 },
        { p: [-5.2, 3.5, 0] as [number, number, number], r: Math.PI / 2 },
        { p: [5.2, 3.5, 0] as [number, number, number], r: -Math.PI / 2 },
      ].map((w, i) => (
        <group key={i} position={w.p} rotation={[0, w.r, 0]}>
          <mesh>
            <planeGeometry args={[11, 7]} />
            <meshStandardMaterial color={MARBLE_PALETTE.wallOxblood} roughness={0.85} />
          </mesh>
          <mesh position={[0, -2.75, 0.03]}>
            <boxGeometry args={[11, 1.5, 0.06]} />
            <meshStandardMaterial color={MARBLE_PALETTE.wallDado} roughness={0.6} />
          </mesh>
          <mesh position={[0, -2.0, 0.07]}>
            <boxGeometry args={[11, 0.08, 0.1]} />
            <meshStandardMaterial color={MARBLE_PALETTE.giltDeep} roughness={0.4} metalness={0.6} />
          </mesh>
        </group>
      ))}

      {/* gilded frame + original painting on the back wall */}
      <group position={[0, 3.1, -4.12]}>
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[1.8, 2.25]} />
          <meshStandardMaterial map={painting} roughness={0.7} />
        </mesh>
        {[
          [0, 1.24, 2.2, 0.24],
          [0, -1.24, 2.2, 0.24],
          [-1.0, 0, 0.24, 2.72],
          [1.0, 0, 0.24, 2.72],
        ].map(([x, y, w, h], i) => (
          <mesh key={i} material={gilt} position={[x, y, 0.07]}>
            <boxGeometry args={[w, h, 0.14]} />
          </mesh>
        ))}
        {[
          [0, 1.14, 1.84, 0.05],
          [0, -1.14, 1.84, 0.05],
          [-0.9, 0, 0.05, 2.3],
          [0.9, 0, 0.05, 2.3],
        ].map(([x, y, w, h], i) => (
          <mesh key={`i${i}`} material={gilt} position={[x, y, 0.12]}>
            <boxGeometry args={[w, h, 0.05]} />
          </mesh>
        ))}
      </group>

      {/* colonnade */}
      <Column pos={[-2.6, 0, -2.4]} mat={colMat} shaft={shaft} />
      <Column pos={[2.6, 0, -2.4]} mat={colMat} shaft={shaft} />
      <Column pos={[-3.9, 0, 2.6]} mat={colMat} shaft={shaft} />
      <Column pos={[3.9, 0, 1.8]} mat={colMat} shaft={shaft} />

      {/* coffered ceiling with the skylight opening */}
      <mesh position={[0, 6.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.0, 9, 4, 1, Math.PI / 4]} />
        <meshStandardMaterial color="#3B2620" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 7.0, 0]} rotation={[Math.PI / 2, 0, Math.PI / 4]}>
        <planeGeometry args={[1.45, 1.45]} />
        <meshBasicMaterial color={new THREE.Color(MARBLE_PALETTE.skylight).multiplyScalar(1.5 * sky)} side={THREE.DoubleSide} />
      </mesh>

      {/* volumetric skylight beam (two crossed planes) */}
      {[0, Math.PI / 2].map((ry) => (
        <mesh key={ry} position={[0.25, 3.7, 0.45]} rotation={[0.08, ry, 0.06]}>
          <planeGeometry args={[1.7, 6.6]} />
          <meshBasicMaterial map={beam} color={MARBLE_PALETTE.skylight} transparent opacity={0.07 * sky} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} fog={false} />
        </mesh>
      ))}
      <primitive object={motes.mesh} />

      {/* soft contact shadow under the plinth */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <circleGeometry args={[1.25, 48]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} depthWrite={false} />
      </mesh>
    </group>
  );
};
