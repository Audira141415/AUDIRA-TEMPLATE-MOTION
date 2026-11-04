// LIDARFORGE Point Cloud Terrain — High-density 3D LiDAR points with elevation colormapping and dynamic scanline reveal.

import React, { useMemo } from "react";
import * as THREE from "three";
import { terrainHeight } from "../core/noise";
import { scanFrontZ, clamp } from "../core/motion";
import { LIDAR_PALETTE } from "../lib/palette";

interface PointCloudTerrainProps {
  f: number;
}

export const PointCloudTerrain: React.FC<PointCloudTerrainProps> = ({ f }) => {
  const currentScanZ = scanFrontZ(f, -7, 7, 20, 360);

  // Generate 8,400 survey point returns in an 80x105 grid
  const { geometry } = useMemo(() => {
    const pointsX = 80;
    const pointsZ = 105;
    const count = pointsX * pointsZ;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const cBedrock = new THREE.Color(LIDAR_PALETTE.elevationBedrock);
    const cGround = new THREE.Color(LIDAR_PALETTE.elevationGround);
    const cRidge = new THREE.Color(LIDAR_PALETTE.elevationRidge);
    const cPeak = new THREE.Color(LIDAR_PALETTE.elevationPeak);

    let idx = 0;
    for (let i = 0; i < pointsX; i++) {
      const x = ((i / (pointsX - 1)) - 0.5) * 12; // -6 to +6
      for (let j = 0; j < pointsZ; j++) {
        const z = ((j / (pointsZ - 1)) - 0.5) * 15; // -7.5 to +7.5
        const y = terrainHeight(x, z);

        positions[idx * 3] = x;
        positions[idx * 3 + 1] = y;
        positions[idx * 3 + 2] = z;

        // Elevation-based colormap interpolation (-1.5m to +2.5m)
        const tHeight = clamp((y + 1.2) / 3.4, 0, 1);
        const col = new THREE.Color();
        if (tHeight < 0.35) {
          col.lerpColors(cBedrock, cGround, tHeight / 0.35);
        } else if (tHeight < 0.75) {
          col.lerpColors(cGround, cRidge, (tHeight - 0.35) / 0.4);
        } else {
          col.lerpColors(cRidge, cPeak, (tHeight - 0.75) / 0.25);
        }

        colors[idx * 3] = col.r;
        colors[idx * 3 + 1] = col.g;
        colors[idx * 3 + 2] = col.b;

        idx++;
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return { geometry: geom };
  }, []);

  return (
    <group>
      <points geometry={geometry}>
        <pointsMaterial
          size={0.065}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
        />
      </points>

      {/* Leading Edge Highlight: Glowing laser scan line across the points */}
      <mesh position={[0, 0.4, currentScanZ]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12.5, 0.12]} />
        <meshBasicMaterial
          color={LIDAR_PALETTE.laserScanFront}
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};
