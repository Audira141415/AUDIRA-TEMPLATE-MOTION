// LIDARFORGE technical example — an 8-second 3D point cloud aerial survey sequence at 60 FPS.
// Features 8,400+ elevation-colored terrain points, sweeping laser scanline curtain,
// drone flight camera trajectory, and geospatial survey HUD telemetry.
//
// Time runs on film frames at a 60 fps clock (`f`), ensuring identical 30 fps preview and 60 fps final.

import React, { useLayoutEffect } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { LIDAR_PALETTE } from "../lib/palette";
import { SurveyWorld } from "../world/SurveyWorld";
import { LidarAtmosphere } from "../world/Atmosphere";
import { LidarOverlay } from "../camera/Overlay";
import { getLidarCameraPose } from "../camera/rig";

export const LIDARFORGE_EXAMPLE_SECONDS = 8;
const FILM_FPS = 60;

/** Camera Rig applying deterministic pose to the R3F camera */
const CameraRig: React.FC<{ f: number }> = ({ f }) => {
  const { camera } = useThree();
  const pose = getLidarCameraPose(f, LIDARFORGE_EXAMPLE_SECONDS * FILM_FPS);

  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(...pose.position);
    cam.lookAt(new THREE.Vector3(...pose.target));
    cam.fov = pose.fov;
    cam.updateProjectionMatrix();
  }, [camera, pose]);

  return null;
};

/** 3D Geospatial Survey Scene */
const LidarWorldScene: React.FC<{ f: number }> = ({ f }) => {
  return (
    <>
      <CameraRig f={f} />
      <LidarAtmosphere />
      <SurveyWorld f={f} />
    </>
  );
};

export const LidarforgeExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * FILM_FPS;

  return (
    <AbsoluteFill style={{ backgroundColor: LIDAR_PALETTE.surveyVoid }}>
      {/* 1. WebGL 3D Point Cloud Canvas */}
      <ThreeCanvas
        width={width}
        height={height}
        dpr={1}
        shadows
        gl={{
          antialias: true,
          powerPreference: "high-performance",
        }}
        camera={{
          fov: 38,
          near: 0.1,
          far: 500,
          position: [0, 5, 8],
        }}
      >
        <LidarWorldScene f={f} />
      </ThreeCanvas>

      {/* 2. Geospatial Survey HUD Overlay */}
      <LidarOverlay f={f} />
    </AbsoluteFill>
  );
};

