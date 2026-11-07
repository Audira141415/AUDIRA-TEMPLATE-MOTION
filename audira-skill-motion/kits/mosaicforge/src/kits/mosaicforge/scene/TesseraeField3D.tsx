import React, { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { layTiles, PANEL, type Tile } from "../lib/image";
import { makeCeramicMaterial, makeGoldMaterial } from "../lib/materials";
import { dropCurve, tileProgress } from "../core/motion";

const tmp = new THREE.Object3D();
const TILE_H = 0.034;

/** Thousands of tesserae (two instanced meshes: glazed ceramic + gold smalti) raining down and settling into the picture. */
export const TesseraeField3D: React.FC<{ t: number }> = ({ t }) => {
  const tiles = useMemo(() => layTiles(), []);

  const meshes = useMemo(() => {
    // slightly bevelled cube: chamfered edges read as hand-cut stone
    const geo = new THREE.BoxGeometry(PANEL.pitch, TILE_H, PANEL.pitch, 1, 1, 1);
    const ceramicTiles = tiles.filter((x) => !x.gold);
    const goldTiles = tiles.filter((x) => x.gold);
    const ceramic = new THREE.InstancedMesh(geo, makeCeramicMaterial(), ceramicTiles.length);
    const gold = new THREE.InstancedMesh(geo, makeGoldMaterial(), goldTiles.length);
    ceramicTiles.forEach((tile, i) => ceramic.setColorAt(i, tile.color));
    goldTiles.forEach((tile, i) => gold.setColorAt(i, tile.color));
    ceramic.frustumCulled = false;
    gold.frustumCulled = false;
    return { ceramic, gold, ceramicTiles, goldTiles };
  }, [tiles]);

  useLayoutEffect(() => {
    const place = (mesh: THREE.InstancedMesh, list: Tile[]) => {
      list.forEach((tile, i) => {
        const k = tileProgress(t, tile.delay);
        if (k <= 0) {
          tmp.position.set(0, -50, 0);
          tmp.scale.setScalar(0.0001);
        } else {
          const h = dropCurve(k);
          const spin = (1 - Math.min(1, k / 0.72)) * (2 + tile.seed * 6);
          tmp.position.set(tile.x + (tile.seed - 0.5) * 0.9 * h, TILE_H / 2 + 0.002 + h * (2.2 + tile.seed * 2.6), tile.z + (tile.seed - 0.3) * 0.7 * h);
          tmp.rotation.set(tile.tilt[0] + spin * 0.7, tile.rot + spin, tile.tilt[1] + spin * 0.4);
          tmp.scale.set(tile.size, 1, tile.size * (0.92 + tile.seed * 0.1));
        }
        tmp.updateMatrix();
        mesh.setMatrixAt(i, tmp.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    };
    place(meshes.ceramic, meshes.ceramicTiles);
    place(meshes.gold, meshes.goldTiles);
  });

  return (
    <group>
      <primitive object={meshes.ceramic} />
      <primitive object={meshes.gold} />
    </group>
  );
};

export const TESSERAE_COUNT = Math.round(PANEL.w / PANEL.pitch) * Math.round(PANEL.h / PANEL.pitch);
