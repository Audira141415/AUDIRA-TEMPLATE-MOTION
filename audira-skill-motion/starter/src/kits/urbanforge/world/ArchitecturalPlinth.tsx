import React, { useMemo } from "react";
import { BuildingMassing } from "../city/BuildingMassing";
import { DataProjection } from "../city/DataProjection";
import { createObsidianPlinthMaterial, createWaterInlayMaterial } from "../lib/materials";
import { URBAN_PALETTE } from "../lib/palette";

interface ArchitecturalPlinthProps {
  waveFrontZ?: number;
  projectedLayer?: "none" | "height" | "zoning" | "solar";
  pulseBrightness?: number;
}

export const ArchitecturalPlinth: React.FC<ArchitecturalPlinthProps> = ({
  waveFrontZ = 0,
  projectedLayer = "height",
  pulseBrightness = 1.0,
}) => {
  const plinthMat = useMemo(() => createObsidianPlinthMaterial(URBAN_PALETTE.obsidianPlinth), []);
  const waterMat = useMemo(() => createWaterInlayMaterial(URBAN_PALETTE.waterInlay), []);

  return (
    <group>
      {/* 1. Base Presentation Obsidian Plinth */}
      <mesh position={[0, -0.6, 0]} material={plinthMat} receiveShadow>
        <boxGeometry args={[14, 1.2, 14]} />
      </mesh>

      {/* 2. Plinth Baseplate (Ground for the model) */}
      <mesh position={[0, 0.01, 0]} material={plinthMat} receiveShadow>
        <boxGeometry args={[11.5, 0.02, 11.5]} />
      </mesh>

      {/* 3. Water Basin / Harbor Cutout Inlay */}
      <mesh position={[0, 0.02, 5.2]} material={waterMat} receiveShadow>
        <boxGeometry args={[11.5, 0.01, 1.1]} />
      </mesh>

      {/* 4. Fine Street Canyon Grid Lines */}
      <gridHelper
        args={[11, 22, URBAN_PALETTE.gridLine, URBAN_PALETTE.gridLine]}
        position={[0, 0.025, 0]}
      />

      {/* 5. Architectural Building Massing Models */}
      <BuildingMassing waveFrontZ={waveFrontZ} projectedLayer={projectedLayer} />

      {/* 6. Dynamic Projection Layer */}
      <DataProjection waveFrontZ={waveFrontZ} pulseBrightness={pulseBrightness} showPin={true} />
    </group>
  );
};
