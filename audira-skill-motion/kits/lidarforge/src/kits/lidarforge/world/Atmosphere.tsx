// LIDARFORGE Atmosphere — Nocturnal aerial survey lighting with cold laser accents.

import React from "react";
import { LIDAR_PALETTE } from "../lib/palette";

export const LidarAtmosphere: React.FC = () => {
  return (
    <>
      {/* Cold Survey Ambient */}
      <ambientLight color="#0f172a" intensity={0.9} />

      {/* Primary Overhead Drone Illuminator */}
      <directionalLight position={[0, 10, 4]} color="#e2e8f0" intensity={1.5} />

      {/* Laser Front Kicker Light */}
      <pointLight position={[0, 3, 0]} color={LIDAR_PALETTE.laserScanFront} intensity={2.5} distance={15} />
    </>
  );
};

