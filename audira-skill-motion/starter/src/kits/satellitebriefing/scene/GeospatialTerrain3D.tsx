import React from "react";
import { SATELLITEBRIEFING_PALETTE } from "../lib/palette";

export const GeospatialTerrain3D: React.FC<{ f: number }> = () => {
  return (
    <group>
      {/* Deep Ocean Bathymetry Base */}
      <mesh position={[0, -0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8.0, 8.0]} />
        <meshStandardMaterial color={SATELLITEBRIEFING_PALETTE.deepOcean} roughness={0.65} />
      </mesh>

      {/* Desaturated Analyst Port Peninsula Blocks */}
      <mesh position={[-0.9, 0.05, -0.4]}>
        <boxGeometry args={[2.6, 0.25, 1.8]} />
        <meshStandardMaterial color={SATELLITEBRIEFING_PALETTE.analystGrey} roughness={0.88} />
      </mesh>
      <mesh position={[1.1, 0.02, 0.55]}>
        <boxGeometry args={[1.8, 0.18, 1.2]} />
        <meshStandardMaterial color="#3E464B" roughness={0.88} />
      </mesh>

      {/* Georeferenced Coordinate Grid Lines */}
      {[-2, -1, 0, 1, 2].map((g) => (
        <React.Fragment key={g}>
          <mesh position={[g, -0.02, 0]}>
            <boxGeometry args={[0.012, 0.01, 6.0]} />
            <meshBasicMaterial color={SATELLITEBRIEFING_PALETTE.claimBlue} />
          </mesh>
          <mesh position={[0, -0.02, g]}>
            <boxGeometry args={[6.0, 0.01, 0.012]} />
            <meshBasicMaterial color={SATELLITEBRIEFING_PALETTE.claimBlue} />
          </mesh>
        </React.Fragment>
      ))}
    </group>
  );
};