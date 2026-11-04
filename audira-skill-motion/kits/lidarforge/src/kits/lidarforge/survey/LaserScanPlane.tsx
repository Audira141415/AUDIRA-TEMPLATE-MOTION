// LIDARFORGE Laser Scan Plane — Vertical cutting plane sweeping across the terrain with telemetry indicators.

import React from "react";
import * as THREE from "three";
import { scanFrontZ } from "../core/motion";
import { LIDAR_PALETTE } from "../lib/palette";

interface LaserScanPlaneProps {
  f: number;
}

export const LaserScanPlane: React.FC<LaserScanPlaneProps> = ({ f }) => {
  const currentZ = scanFrontZ(f, -7, 7, 20, 360);

  return (
    <group position={[0, 0, currentZ]}>
      {/* Semi-transparent vertical laser sweep curtain */}
      <mesh>
        <planeGeometry args={[12, 6]} />
        <meshBasicMaterial
          color={LIDAR_PALETTE.laserScanFront}
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Laser Top Sweep Rail */}
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[12.2, 0.05, 0.05]} />
        <meshBasicMaterial color={LIDAR_PALETTE.laserScanFront} />
      </mesh>

      {/* Overhead Laser Sensor Projector Beam */}
      <mesh position={[0, 6, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[6, 6, 4]} />
        <meshBasicMaterial
          color={LIDAR_PALETTE.laserScanFront}
          transparent
          opacity={0.04}
          blending={THREE.AdditiveBlending}
          wireframe
        />
      </mesh>
    </group>
  );
};

