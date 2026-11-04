// DRAFTFORGE Drafting Table — blueprint drafting paper with millimeter grid lines and drawing boundary.

import React, { useMemo } from "react";
import * as THREE from "three";
import { DRAFT_PALETTE } from "../lib/palette";

interface DraftingTableProps {
  size?: number;
  divisions?: number;
}

export const DraftingTable: React.FC<DraftingTableProps> = ({ size = 32, divisions = 64 }) => {
  // Fine Millimeter Grid Lines
  const [fineGeo, majorGeo, borderGeo] = useMemo(() => {
    const finePts: THREE.Vector3[] = [];
    const majorPts: THREE.Vector3[] = [];
    const step = size / divisions;
    const half = size / 2;

    for (let i = 0; i <= divisions; i++) {
      const pos = -half + i * step;
      const isMajor = i % 8 === 0;
      const target = isMajor ? majorPts : finePts;

      // Lines parallel to Z
      target.push(new THREE.Vector3(pos, -2.0, -half), new THREE.Vector3(pos, -2.0, half));
      // Lines parallel to X
      target.push(new THREE.Vector3(-half, -2.0, pos), new THREE.Vector3(half, -2.0, pos));
    }

    // Outer architectural sheet border
    const bPts: THREE.Vector3[] = [
      new THREE.Vector3(-half + 0.5, -1.99, -half + 0.5),
      new THREE.Vector3(half - 0.5, -1.99, -half + 0.5),
      new THREE.Vector3(half - 0.5, -1.99, half - 0.5),
      new THREE.Vector3(-half + 0.5, -1.99, half - 0.5),
      new THREE.Vector3(-half + 0.5, -1.99, -half + 0.5),
    ];

    return [
      new THREE.BufferGeometry().setFromPoints(finePts),
      new THREE.BufferGeometry().setFromPoints(majorPts),
      new THREE.BufferGeometry().setFromPoints(bPts),
    ];
  }, [size, divisions]);

  return (
    <group>
      {/* 1. Fine Millimeter Grid */}
      <lineSegments>
        <bufferGeometry attach="geometry" {...fineGeo} />
        <lineBasicMaterial attach="material" color={DRAFT_PALETTE.gridFine} transparent opacity={0.65} />
      </lineSegments>

      {/* 2. Major 100mm Grid Lines */}
      <lineSegments>
        <bufferGeometry attach="geometry" {...majorGeo} />
        <lineBasicMaterial attach="material" color={DRAFT_PALETTE.gridMajor} transparent opacity={0.9} />
      </lineSegments>

      {/* 3. Outer Sheet Margin Border */}
      <line>
        <bufferGeometry attach="geometry" {...borderGeo} />
        <lineBasicMaterial attach="material" color={DRAFT_PALETTE.cadWhite} transparent opacity={0.8} />
      </line>
    </group>
  );
};
