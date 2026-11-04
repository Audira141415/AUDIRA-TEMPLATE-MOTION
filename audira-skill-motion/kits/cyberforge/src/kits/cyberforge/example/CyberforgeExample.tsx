// CYBERFORGE technical example — an 8-second cinematic sci-fi hero sequence at any FPS.
// Features a quantum core activation, counter-rotating gimbal rings, expanding HUD telemetry,
// infinite cyber floor grid, upward data streams, and target lock-on telemetry.
//
// Time runs on film frames at a 60 fps clock (`f`), ensuring identical 30 fps preview and 60 fps final.

import React, { useLayoutEffect } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CYBER_PALETTE } from "../lib/palette";
import { CyberAtmosphere } from "../world/Atmosphere";
import { CyberGrid } from "../world/CyberGrid";
import { HoloCore } from "../world/HoloCore";
import { DataStream } from "../world/DataStream";
import { CyberOverlay } from "../camera/Overlay";
import { getCyberCameraPose } from "../camera/rig";
import { remap, ease } from "../core/motion";

export const CYBERFORGE_EXAMPLE_SECONDS = 8;
const FILM_FPS = 60;

/** Camera Rig applying deterministic pose to the R3F camera */
const CameraRig: React.FC<{ f: number }> = ({ f }) => {
  const { camera } = useThree();
  const pose = getCyberCameraPose(f, CYBERFORGE_EXAMPLE_SECONDS * FILM_FPS);

  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(...pose.position);
    cam.lookAt(new THREE.Vector3(...pose.target));
    cam.fov = pose.fov;
    cam.updateProjectionMatrix();
  }, [camera, pose]);

  return null;
};

/** 3D Cyber Scene */
const CyberWorld: React.FC<{ f: number; lockProgress: number; coreOverload: number }> = ({
  f,
  lockProgress,
  coreOverload,
}) => {
  return (
    <>
      <CameraRig f={f} />
      <CyberAtmosphere f={f} />
      <CyberGrid f={f} size={44} divisions={36} />
      <DataStream f={f} count={160} />
      <HoloCore f={f} lockProgress={lockProgress} coreOverload={coreOverload} />
    </>
  );
};

export const CyberforgeExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * FILM_FPS;

  // Lock progress ramps up from frame 270 to 360 (approx 4.5s to 6.0s)
  const lockProgress = remap(f, 270, 360, 0, 1);

  // Core overload pulse peaks during the locked phase (frame 360 to 480)
  const coreOverload = remap(f, 350, 440, 0, 1) * ease.surge(remap(f, 350, 480, 0, 1));

  return (
    <AbsoluteFill style={{ backgroundColor: CYBER_PALETTE.voidDeep }}>
      {/* 1. WebGL 3D Holographic Canvas */}
      <ThreeCanvas
        width={width}
        height={height}
        dpr={1}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 500,
          position: [0, 0, 8],
        }}
      >
        <CyberWorld f={f} lockProgress={lockProgress} coreOverload={coreOverload} />
      </ThreeCanvas>

      {/* 2. Tactical 2D Screen-space HUD Overlay */}
      <CyberOverlay f={f} lockProgress={lockProgress} brandTitle="CYBERFORGE // QUANTUM PROTOCOL" />
    </AbsoluteFill>
  );
};

