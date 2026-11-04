// LIDARFORGE Survey World — Complete geospatial survey stage with point cloud, laser curtain & boundary frame.

import React from "react";
import { PointCloudTerrain } from "../survey/PointCloudTerrain";
import { LaserScanPlane } from "../survey/LaserScanPlane";
import { LIDAR_PALETTE } from "../lib/palette";

interface SurveyWorldProps {
  f: number;
}

export const SurveyWorld: React.FC<SurveyWorldProps> = ({ f }) => {
  return (
    <group>
      {/* 1. Point Cloud Terrain Mesh Returns */}
      <PointCloudTerrain f={f} />

      {/* 2. Sweeping Laser Scanline Plane */}
      <LaserScanPlane f={f} />

      {/* 3. Bounding Survey Volume Box Frame */}
      <lineSegments>
        <edgesGeometry args={[new (require("three").BoxGeometry)(12.4, 5, 15.4)]} />
        <lineBasicMaterial color={LIDAR_PALETTE.gridWireframe} transparent opacity={0.6} />
      </lineSegments>

      {/* 4. Ground Reference Grid Base */}
      <gridHelper
        args={[16, 16, LIDAR_PALETTE.gridWireframe, LIDAR_PALETTE.gridWireframe]}
        position={[0, -2.5, 0]}
      />
    </group>
  );
};

