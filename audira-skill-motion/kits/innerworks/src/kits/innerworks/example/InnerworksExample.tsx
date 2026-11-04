// INNERWORKS technical example — an 8-second cutaway mechanical explainer at 60 FPS.
// Demonstrates x-ray translucent housing transition, intermeshing brass gear trains,
// RPM acceleration, and kinematic cross-section telemetry.
//
// Time runs on film frames at a 60 fps clock (`f`), ensuring identical 30 fps preview and 60 fps final.

import React, { useLayoutEffect } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { INNERWORKS_PALETTE } from "../lib/palette";
import { CutawayStage } from "../world/CutawayStage";
import { InnerworksOverlay } from "../camera/Overlay";
import { getInnerworksCameraPose } from "../camera/rig";
import { remap, ease } from "../core/motion";

export const INNERWORKS_EXAMPLE_SECONDS = 8;
const FILM_FPS = 60;

/** Camera Rig applying deterministic pose to the R3F camera */
const CameraRig: React.FC<{ f: number }> = ({ f }) => {
  const { camera } = useThree();
  const pose = getInnerworksCameraPose(f, INNERWORKS_EXAMPLE_SECONDS * FILM_FPS);

  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(...pose.position);
    cam.lookAt(new THREE.Vector3(...pose.target));
    cam.fov = pose.fov;
    cam.updateProjectionMatrix();
  }, [camera, pose]);

  return null;
};

/** 3D Mechanical Stage Scene */
const InnerworksWorldScene: React.FC<{
  f: number;
  cutawayProgress: number;
}> = ({ f, cutawayProgress }) => {
  return (
    <>
      <CameraRig f={f} />
      <CutawayStage f={f} cutawayProgress={cutawayProgress} />
    </>
  );
};

export const InnerworksExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * FILM_FPS;

  // Cutaway progression:
  // Frames 0 - 80: Solid enclosure
  // Frames 80 - 180: Slicing into translucent x-ray
  // Frames 180 - 480: Fully exposed internal kinematics
  const cutawayProgress = f < 80 ? 0 : ease.smooth(remap(f, 80, 180, 0, 1));

  return (
    <AbsoluteFill style={{ backgroundColor: INNERWORKS_PALETTE.machineDark }}>
      {/* 1. WebGL 3D Cutaway Mechanics Canvas */}
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
          position: [0, 0, 6],
        }}
      >
        <InnerworksWorldScene f={f} cutawayProgress={cutawayProgress} />
      </ThreeCanvas>

      {/* 2. Kinematic Telemetry Overlay */}
      <InnerworksOverlay f={f} />
    </AbsoluteFill>
  );
};

