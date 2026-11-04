// PRECISION technical example — an 8-second industrial CMF showcase at 60 FPS.
// Demonstrates macro seam inspection, monotonic exploded part separation, titanium/ceramic PBR materials,
// magnetic snap reassembly, and Swiss-style technical typography callouts.
//
// Time runs on film frames at a 60 fps clock (`f`), ensuring identical 30 fps preview and 60 fps final.

import React, { useLayoutEffect } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { PRECISION_PALETTE } from "../lib/palette";
import { StudioStage } from "../world/StudioStage";
import { ExplodedAssembly } from "../assembly/ExplodedPart";
import { PrecisionOverlay } from "../camera/Overlay";
import { getPrecisionCameraPose } from "../camera/rig";
import { remap, ease } from "../core/motion";

export const PRECISION_EXAMPLE_SECONDS = 8;
const FILM_FPS = 60;

/** Camera Rig applying deterministic pose to the R3F camera */
const CameraRig: React.FC<{ f: number }> = ({ f }) => {
  const { camera } = useThree();
  const pose = getPrecisionCameraPose(f, PRECISION_EXAMPLE_SECONDS * FILM_FPS);

  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(...pose.position);
    cam.lookAt(new THREE.Vector3(...pose.target));
    cam.fov = pose.fov;
    cam.updateProjectionMatrix();
  }, [camera, pose]);

  return null;
};

/** 3D Industrial Stage Scene */
const PrecisionWorldScene: React.FC<{
  f: number;
  explodeProgress: number;
}> = ({ f, explodeProgress }) => {
  return (
    <>
      <CameraRig f={f} />
      <StudioStage />
      <ExplodedAssembly f={f} explodeProgress={explodeProgress} />
    </>
  );
};

export const PrecisionExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * FILM_FPS;

  // Exploded Timing:
  // Frames 0 - 140: Closed / Docked
  // Frames 140 - 240: Exploding outward
  // Frames 240 - 320: Suspended exploded state
  // Frames 320 - 400: Magnetic snap reassembly
  // Frames 400 - 480: Hero packshot
  let explodeProgress = 0;
  if (f >= 140 && f < 240) {
    explodeProgress = ease.explodeEase(remap(f, 140, 240, 0, 1));
  } else if (f >= 240 && f < 320) {
    explodeProgress = 1;
  } else if (f >= 320 && f < 400) {
    explodeProgress = 1 - ease.magneticSnap(remap(f, 320, 400, 0, 1));
  } else if (f >= 400) {
    explodeProgress = 0;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: PRECISION_PALETTE.satinBlack }}>
      {/* 1. WebGL 3D Industrial CMF Canvas */}
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
          fov: 32,
          near: 0.1,
          far: 500,
          position: [0, 0, 5],
        }}
      >
        <PrecisionWorldScene f={f} explodeProgress={explodeProgress} />
      </ThreeCanvas>

      {/* 2. Minimalist Swiss CMF Typography Overlay */}
      <PrecisionOverlay f={f} />
    </AbsoluteFill>
  );
};
