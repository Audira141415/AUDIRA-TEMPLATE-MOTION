import React from "react";
import { URBAN_PALETTE } from "../lib/palette";

interface UrbanAtmosphereProps {
  sunPosition?: [number, number, number];
  sunIntensity?: number;
}

export const UrbanAtmosphere: React.FC<UrbanAtmosphereProps> = ({
  sunPosition = [8, 12, 6],
  sunIntensity = 1.8,
}) => {
  return (
    <>
      {/* 1. Neutral Low Exhibition Ambient (Keeps shadows clean and deep) */}
      <ambientLight intensity={0.4} color="#e5e7eb" />

      {/* 2. Simulated Moving Sun (Directional Light with Shadow Maps) */}
      <directionalLight
        position={sunPosition}
        intensity={sunIntensity}
        color={URBAN_PALETTE.sunDaylight}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={35}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0005}
      />

      {/* 3. Subtle Projector Light Throw from Ceiling */}
      <spotLight
        position={[0, 14, 0]}
        intensity={0.8}
        color={URBAN_PALETTE.projectedCyan}
        angle={Math.PI / 6}
        penumbra={0.7}
        distance={25}
      />
    </>
  );
};

