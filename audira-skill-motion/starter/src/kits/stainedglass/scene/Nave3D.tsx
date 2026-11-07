import React, { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { STAINED_PALETTE } from "../lib/palette";
import { makeShaftTexture, makeStoneTexture } from "../lib/materials";
import { buildPanes, lancetShape, makeFloorPoolTexture } from "../lib/window";
import { assembled, mulberry32, sunGlow } from "../core/motion";

const FLOOR_Y = -5.5;
const MOTES = 450;
const tmp = new THREE.Object3D();

/** Stone nave around the window: splayed wall, flagstone floor, columns, light shafts, coloured light pools, dust. */
export const Nave3D: React.FC<{ t: number }> = ({ t }) => {
  const glow = sunGlow(t);
  const built = assembled(t);

  const wall = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-8, FLOOR_Y);
    s.lineTo(8, FLOOR_Y);
    s.lineTo(8, 10);
    s.lineTo(-8, 10);
    s.closePath();
    s.holes.push(lancetShape(0.0) as unknown as THREE.Path);
    const geo = new THREE.ExtrudeGeometry(s, { depth: 0.7, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06, bevelSegments: 2, curveSegments: 48 });
    const tex = makeStoneTexture(5810, 4, 8);
    tex.repeat.set(0.25, 0.25);
    const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92, metalness: 0, color: "#B9AE9C" });
    return { geo, mat };
  }, []);

  const floor = useMemo(() => {
    const tex = makeStoneTexture(5811, 3, 3, true);
    tex.repeat.set(4, 5);
    return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55, metalness: 0.05, color: "#A79C8A" });
  }, []);

  const pool = useMemo(() => {
    const { panes, rose } = buildPanes();
    return makeFloorPoolTexture(panes, rose);
  }, []);
  const shaft = useMemo(() => makeShaftTexture(), []);

  const motes = useMemo(() => {
    const rnd = mulberry32(5812);
    const mesh = new THREE.InstancedMesh(
      new THREE.SphereGeometry(1, 6, 6),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(STAINED_PALETTE.sunbeam).multiplyScalar(1.3), transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false }),
      MOTES,
    );
    mesh.frustumCulled = false;
    const seeds = Array.from({ length: MOTES }, () => ({ u: rnd(), v: rnd(), w: rnd(), s: 0.004 + rnd() * 0.009, ph: rnd() * 6.28 }));
    return { mesh, seeds };
  }, []);

  useLayoutEffect(() => {
    motes.seeds.forEach((p, i) => {
      // motes live inside the slanted beam volume: window (z≈0.5, y≈0) down to the floor pool (z≈5.5)
      const along = (p.v + t * 0.012) % 1;
      const y = 2.5 - along * 7.6 + Math.sin(t * 0.5 + p.ph) * 0.12;
      const z = 0.6 + along * 5.2 + Math.cos(t * 0.4 + p.ph) * 0.1;
      const x = (p.u - 0.5) * (3.0 + along * 0.8) + Math.sin(t * 0.3 + p.ph * 2) * 0.08;
      const tw = 0.4 + 0.6 * Math.pow(0.5 + 0.5 * Math.sin(t * 2.1 + p.ph * 5), 2);
      tmp.position.set(x, y, z);
      tmp.scale.setScalar(p.s * tw * (0.4 + 0.6 * glow));
      tmp.updateMatrix();
      motes.mesh.setMatrixAt(i, tmp.matrix);
    });
    motes.mesh.instanceMatrix.needsUpdate = true;
  });

  const spotTarget = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(0, FLOOR_Y, 6);
    o.updateMatrixWorld();
    return o;
  }, []);

  // shaft plane oriented along the beam (window -> floor)
  const beamAngle = -Math.atan2(5.2, 7.6);
  const tints = [STAINED_PALETTE.sunbeam, STAINED_PALETTE.ruby, STAINED_PALETTE.azure, STAINED_PALETTE.amber];

  return (
    <group>
      <ambientLight intensity={0.22} color="#C9B79C" />
      <hemisphereLight args={["#E9D8B8", "#2A2118", 0.25]} />
      {/* sun through the glass: warm key falling into the nave */}
      <spotLight position={[0, 2.5, -2]} target={spotTarget} angle={0.55} penumbra={0.8} intensity={40 * glow} distance={22} decay={1.4} color={STAINED_PALETTE.sunbeam} />
      <pointLight position={[-1.2, 1.5, 1.2]} intensity={3 * glow} distance={6} color={STAINED_PALETTE.ruby} />
      <pointLight position={[1.2, 0.5, 1.2]} intensity={3 * glow} distance={6} color={STAINED_PALETTE.azure} />
      <pointLight position={[0, 3, 1.4]} intensity={3 * glow} distance={6} color={STAINED_PALETTE.amber} />

      <mesh geometry={wall.geo} material={wall.mat} position={[0, 0, -0.1]} />
      {/* deep shadow behind the glass so unglazed gaps read as lead */}
      <mesh position={[0, 0.8, -0.4]}>
        <planeGeometry args={[4, 9]} />
        <meshBasicMaterial color="#050403" />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y, 7]} material={floor}>
        <planeGeometry args={[16, 16]} />
      </mesh>

      {/* coloured light pooled on the flagstones */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y + 0.01, 3.9]}>
        <planeGeometry args={[4.2, 5.6]} />
        <meshBasicMaterial map={pool} transparent opacity={1.0 * built * Math.min(1.5, glow)} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* volumetric shafts */}
      {tints.map((tint, i) => (
        <mesh key={i} position={[(i - 1.5) * 0.7, -1.4, 2.9]} rotation={[beamAngle, 0, (i - 1.5) * 0.04]}>
          <planeGeometry args={[i === 0 ? 2.8 : 1.1, 9.4]} />
          <meshBasicMaterial map={shaft} color={tint} transparent opacity={(i === 0 ? 0.16 : 0.1) * built * glow} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <primitive object={motes.mesh} />

      {/* foreground columns (parallax framing) */}
      {[-2.9, 2.9].map((x) => (
        <group key={x} position={[x, 0, 3.6]}>
          <mesh position={[0, -0.25, 0]}>
            <cylinderGeometry args={[0.36, 0.38, 10.5, 32]} />
            <meshStandardMaterial color="#8E8474" roughness={0.9} />
          </mesh>
          <mesh position={[0, FLOOR_Y + 0.25, 0]}>
            <boxGeometry args={[1.0, 0.5, 1.0]} />
            <meshStandardMaterial color="#7D7466" roughness={0.9} />
          </mesh>
          <mesh position={[0, FLOOR_Y + 0.6, 0]}>
            <cylinderGeometry args={[0.46, 0.5, 0.2, 32]} />
            <meshStandardMaterial color="#857B6C" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
