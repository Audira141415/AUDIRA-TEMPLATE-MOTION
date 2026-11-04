import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { ArchitecturalPlinth } from "../world/ArchitecturalPlinth";
import { UrbanAtmosphere } from "../world/Atmosphere";
import { getUrbanCamera } from "../camera/rig";
import { UrbanOverlay } from "../camera/Overlay";
import { getSolarPosition, getProjectionWave } from "../core/motion";

export const URBANFORGE_EXAMPLE_SECONDS = 8;

const CameraController: React.FC<{ progress: number }> = ({ progress }) => {
  const cam = useMemo(() => getUrbanCamera(progress), [progress]);

  return (
    <perspectiveCamera
      makeDefault
      position={cam.position}
      fov={cam.fov}
      onUpdate={(self) => {
        self.lookAt(new THREE.Vector3(...cam.target));
        self.updateProjectionMatrix();
      }}
    />
  );
};

export const UrbanforgeExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Remotion 60 FPS normalized clock
  const f = (frame / fps) * 60;
  const totalF = (durationInFrames / fps) * 60;
  const progress = Math.min(1, Math.max(0, f / totalF));

  // Solar position sweep over the day
  const solar = getSolarPosition(progress);

  // Data projection wave (starts at 1.5s, finishes at 6.5s)
  const waveProgress = Math.max(0, Math.min(1, (f - 90) / 300));
  const { waveFrontZ, pulseBrightness } = getProjectionWave(waveProgress);

  const activeLayer =
    progress < 0.45
      ? "URBAN HEIGHT CLASSIFICATION (CYAN/AMBER)"
      : progress < 0.8
      ? "CIVIC ZONING & DENSITY OCCLUSION"
      : "SOLAR SHADOW ENVELOPE (17:30 SUNSET)";

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0c" }}>
      <ThreeCanvas
        shadows={{ type: THREE.PCFSoftShadowMap }}
        camera={{ position: [4, 8, 8], fov: 40 }}
      >
        <CameraController progress={progress} />
        <UrbanAtmosphere sunPosition={solar.position} sunIntensity={solar.intensity} />
        <ArchitecturalPlinth
          waveFrontZ={waveFrontZ}
          projectedLayer={progress < 0.65 ? "height" : "zoning"}
          pulseBrightness={pulseBrightness}
        />
      </ThreeCanvas>

      <UrbanOverlay
        timeString={solar.timeString}
        activeLayer={activeLayer}
        buildingCount={24}
        maxHeight="168 M"
      />
    </AbsoluteFill>
  );
};

