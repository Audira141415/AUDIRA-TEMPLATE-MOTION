// TEXTVOYAGE MonolithType — a word built from extruded blocks (one instanced mesh per word).

import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { GLYPH_H, layoutBlocks } from "../lib/blockFont";

interface MonolithTypeProps {
  text: string;
  /** Edge length of one block in world units. */
  cell?: number;
  /** Extrusion depth in world units. */
  depth?: number;
  /** Gap between blocks as a fraction of `cell` (0 = solid letters). */
  gap?: number;
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  metalness?: number;
  roughness?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

/** Centered on its position: x across the word, y up the glyph height. */
export const MonolithType: React.FC<MonolithTypeProps> = ({
  text,
  cell = 0.2,
  depth = 0.5,
  gap = 0.08,
  color,
  emissive = "#000000",
  emissiveIntensity = 0,
  metalness = 0.75,
  roughness = 0.3,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const { cells, cols } = useMemo(() => layoutBlocks(text), [text]);
  const geo = useMemo(() => {
    const s = cell * (1 - gap);
    return new THREE.BoxGeometry(s, s, depth);
  }, [cell, gap, depth]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    cells.forEach(([cx, cy], i) => {
      const x = (cx - (cols - 1) / 2) * cell;
      const y = ((GLYPH_H - 1) / 2 - cy) * cell;
      m.makeTranslation(x, y, 0);
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [cells, cols, cell]);

  return (
    <group position={position} rotation={rotation}>
      <instancedMesh ref={ref} args={[geo, undefined, cells.length]} key={`${text}-${cells.length}`}>
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          metalness={metalness}
          roughness={roughness}
        />
      </instancedMesh>
    </group>
  );
};
