// DISASTERSIM — the sea: a displaced surface grid (crest foam by height) plus the cut-face water curtain
// that follows the wave profile down to the seafloor. Rebuilt in place every frame from waveH(x, z, t).
import React, { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { DISASTER_PALETTE as P } from "../lib/palette";
import { BLOCK, clamp, surfaceY, waveH } from "../core/motion";

const X0 = BLOCK.x0;
const X1 = 3.0; // grid runs past the coast so run-up can show above the beach
const NX = 150;
const NZ = 16;

export const TsunamiWater3D: React.FC<{ t: number }> = ({ t }) => {
  const { surface, curtain } = useMemo(() => {
    const surface = new THREE.PlaneGeometry(X1 - X0, BLOCK.halfD * 2, NX, NZ);
    surface.rotateX(-Math.PI / 2);
    surface.translate((X0 + X1) / 2, 0, 0);
    surface.setAttribute("color", new THREE.Float32BufferAttribute(new Float32Array(surface.attributes.position.count * 3), 3));
    const curtain = new THREE.BufferGeometry();
    const pos = new Float32Array((NX + 1) * 2 * 3);
    const col = new Float32Array((NX + 1) * 2 * 3);
    const idx: number[] = [];
    for (let i = 0; i < NX; i++) {
      const a = i * 2;
      idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
    curtain.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    curtain.setAttribute("color", new THREE.BufferAttribute(col, 3));
    curtain.setIndex(idx);
    return { surface, curtain };
  }, []);

  useLayoutEffect(() => {
    const sp = surface.attributes.position as THREE.BufferAttribute;
    const sc = surface.attributes.color as THREE.BufferAttribute;
    const sea = new THREE.Color(P.sea);
    const foam = new THREE.Color(P.foam);
    const c = new THREE.Color();
    for (let i = 0; i < sp.count; i++) {
      const x = sp.getX(i);
      const z = sp.getZ(i);
      const h = waveH(x, z, t);
      sp.setY(i, h);
      c.copy(sea).lerp(foam, clamp((h - 0.07) / 0.18) * 0.85);
      sc.setXYZ(i, c.r, c.g, c.b);
    }
    sp.needsUpdate = true;
    sc.needsUpdate = true;
    surface.computeVertexNormals();

    const cp = curtain.attributes.position as THREE.BufferAttribute;
    const cc = curtain.attributes.color as THREE.BufferAttribute;
    const top = new THREE.Color("#4BA9D6");
    const deep = new THREE.Color(P.seaDeep);
    for (let i = 0; i <= NX; i++) {
      const x = X0 + ((X1 - X0) * i) / NX;
      const h = waveH(x, BLOCK.halfD, t);
      const floor = surfaceY(x);
      const bottom = Math.min(h, floor);
      cp.setXYZ(i * 2, x, h, BLOCK.halfD + 0.003);
      cp.setXYZ(i * 2 + 1, x, bottom, BLOCK.halfD + 0.003);
      cc.setXYZ(i * 2, top.r, top.g, top.b);
      cc.setXYZ(i * 2 + 1, deep.r, deep.g, deep.b);
    }
    cp.needsUpdate = true;
    cc.needsUpdate = true;
    curtain.computeBoundingSphere();
    surface.computeBoundingSphere();
  }, [t, surface, curtain]);

  return (
    <group>
      <mesh geometry={surface} renderOrder={2}>
        <meshStandardMaterial vertexColors transparent opacity={0.82} roughness={0.12} metalness={0.1} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={curtain} renderOrder={1}>
        <meshBasicMaterial vertexColors transparent opacity={0.78} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
};
