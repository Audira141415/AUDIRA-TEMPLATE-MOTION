import React, { useLayoutEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ABYSS_PALETTE } from "../lib/palette";
import { makeGodRayTexture } from "../lib/materials";
import { cameraDepthY, descent, mulberry32, surfaceLight } from "../core/motion";

const SNOW = 2200;
const PLANKTON = 520;
const tmp = new THREE.Object3D();

/** Water colour for a descent fraction: teal -> twilight -> ink. */
const waterColour = (d: number) => {
  const a = new THREE.Color(ABYSS_PALETTE.surfaceTeal);
  const b = new THREE.Color(ABYSS_PALETTE.twilightBlue);
  const c = new THREE.Color(ABYSS_PALETTE.midnightInk);
  if (d < 0.3) return a.lerp(b, d / 0.3);
  return b.lerp(c, Math.min(1, (d - 0.3) / 0.45));
};

export const WaterColumn3D: React.FC<{ t: number }> = ({ t }) => {
  const { scene } = useThree();
  const d = descent(t);
  const camY = cameraDepthY(t);
  const sun = surfaceLight(t);

  // Background + exponential fog follow the depth
  useLayoutEffect(() => {
    const col = waterColour(d);
    scene.background = col;
    scene.fog = new THREE.FogExp2(col.getHex(), 0.085 + d * 0.03);
  }, [scene, d]);

  // Marine snow: one instanced mesh, slow fall + sideways drift
  const snow = useMemo(() => {
    const rnd = mulberry32(5201);
    const geo = new THREE.IcosahedronGeometry(1, 0);
    const mat = new THREE.MeshBasicMaterial({ color: ABYSS_PALETTE.marineSnow, transparent: true, opacity: 0.75 });
    const mesh = new THREE.InstancedMesh(geo, mat, SNOW);
    mesh.frustumCulled = false;
    const seeds = Array.from({ length: SNOW }, () => ({
      x: (rnd() - 0.5) * 12,
      y: 6 - rnd() * 52,
      z: (rnd() - 0.5) * 14,
      s: 0.006 + Math.pow(rnd(), 4) * 0.016,
      ph: rnd() * 6.28,
      v: 0.04 + rnd() * 0.08,
    }));
    return { mesh, seeds };
  }, []);

  // Bioluminescent plankton sparks, denser in the deep
  const plankton = useMemo(() => {
    const rnd = mulberry32(5202);
    const geo = new THREE.SphereGeometry(1, 6, 6);
    const mat = new THREE.MeshBasicMaterial();
    const mesh = new THREE.InstancedMesh(geo, mat, PLANKTON);
    mesh.frustumCulled = false;
    const palette = [ABYSS_PALETTE.lumenMagenta, ABYSS_PALETTE.lumenCyan, ABYSS_PALETTE.lumenViolet];
    const seeds = Array.from({ length: PLANKTON }, (_, i) => {
      mesh.setColorAt(i, new THREE.Color(palette[i % 3]).multiplyScalar(2.4));
      return { x: (rnd() - 0.5) * 11, y: -8 - rnd() * 36, z: (rnd() - 0.5) * 12, s: 0.012 + rnd() * 0.02, ph: rnd() * 6.28, f: 0.8 + rnd() * 2.4 };
    });
    return { mesh, seeds };
  }, []);

  useLayoutEffect(() => {
    snow.seeds.forEach((p, i) => {
      tmp.position.set(p.x + Math.sin(t * 0.4 + p.ph) * 0.15, p.y - t * p.v, p.z + Math.cos(t * 0.3 + p.ph) * 0.1);
      tmp.rotation.set(p.ph, t * 0.5 + p.ph, 0);
      tmp.scale.setScalar(p.s);
      tmp.updateMatrix();
      snow.mesh.setMatrixAt(i, tmp.matrix);
    });
    snow.mesh.instanceMatrix.needsUpdate = true;

    plankton.seeds.forEach((p, i) => {
      const tw = 0.35 + 0.65 * Math.pow(0.5 + 0.5 * Math.sin(t * p.f + p.ph), 3);
      tmp.position.set(p.x + Math.sin(t * 0.25 + p.ph) * 0.3, p.y + Math.sin(t * 0.5 + p.ph) * 0.2, p.z);
      tmp.rotation.set(0, 0, 0);
      tmp.scale.setScalar(p.s * tw);
      tmp.updateMatrix();
      plankton.mesh.setMatrixAt(i, tmp.matrix);
    });
    plankton.mesh.instanceMatrix.needsUpdate = true;
  });

  const rayTex = useMemo(() => makeGodRayTexture(), []);
  const rays = useMemo(() => {
    const rnd = mulberry32(5203);
    return Array.from({ length: 7 }, () => ({ x: (rnd() - 0.5) * 7, z: -1 - rnd() * 6, w: 1.2 + rnd() * 2.2, ry: (rnd() - 0.5) * 1.2, rz: (rnd() - 0.5) * 0.25, ph: rnd() * 6 }));
  }, []);

  const seabed = useMemo(() => {
    const geo = new THREE.PlaneGeometry(40, 40, 120, 120);
    geo.rotateX(-Math.PI / 2);
    const rnd = mulberry32(5204);
    const bumps = Array.from({ length: 14 }, () => ({ x: (rnd() - 0.5) * 16, z: (rnd() - 0.5) * 12 - 3, r: 0.6 + rnd() * 1.8, h: 0.3 + rnd() * 1.4 }));
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      let h = Math.sin(x * 0.7) * 0.15 + Math.sin(z * 1.1 + x * 0.3) * 0.12;
      for (const b of bumps) h += b.h * Math.exp(-((x - b.x) * (x - b.x) + (z - b.z) * (z - b.z)) / (b.r * b.r));
      pos.setY(i, h);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group>
      {/* Volumetric god-rays from the surface: fade with depth */}
      {rays.map((r, i) => (
        <mesh key={i} position={[r.x, -9, r.z]} rotation={[0, r.ry, r.rz]}>
          <planeGeometry args={[r.w, 30]} />
          <meshBasicMaterial
            map={rayTex}
            color={ABYSS_PALETTE.godRay}
            transparent
            opacity={(0.16 + 0.06 * Math.sin(t * 0.7 + r.ph)) * sun}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            fog={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Light from the surface, dying with depth; faint blue ambience */}
      <directionalLight position={[2, camY + 12, 3]} intensity={2.4 * sun + 0.05} color={ABYSS_PALETTE.godRay} />
      <hemisphereLight args={["#2B6E95", "#020509", 0.45 * sun + 0.06]} />

      <primitive object={snow.mesh} />
      <primitive object={plankton.mesh} />

      {/* Trench floor: silt dunes revealed only by living light */}
      <mesh geometry={seabed} position={[0, -39.7, -3]}>
        <meshStandardMaterial color={ABYSS_PALETTE.seabedSilt} roughness={0.95} metalness={0} />
      </mesh>
    </group>
  );
};
