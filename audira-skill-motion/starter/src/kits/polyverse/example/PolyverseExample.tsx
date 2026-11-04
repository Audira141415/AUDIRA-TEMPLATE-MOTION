// POLYVERSE technical example — an 8-second cinematic low-poly floating island diorama at 60 FPS.
// Features flat-shaded faceted terrain, pine trees swaying in the wind, faceted water vertex waves,
// drifting geometric clouds, and a majestic isometric telephoto orbital camera.
//
// Time runs on film frames at a 60 fps clock (`f`), ensuring identical 30 fps preview and 60 fps final.

import React, { useLayoutEffect } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { POLY_PALETTE } from "../lib/palette";
import { FloatingIsland } from "../world/FloatingIsland";
import { PolyAtmosphere } from "../world/Atmosphere";
import { PolyOverlay } from "../camera/Overlay";
import { getPolyCameraPose } from "../camera/rig";

export const POLYVERSE_EXAMPLE_SECONDS = 8;
const FILM_FPS = 60;

/** Camera Rig applying deterministic pose to the R3F camera */
const CameraRig: React.FC<{ f: number }> = ({ f }) => {
  const { camera } = useThree();
  const pose = getPolyCameraPose(f, POLYVERSE_EXAMPLE_SECONDS * FILM_FPS);

  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(...pose.position);
    cam.lookAt(new THREE.Vector3(...pose.target));
    cam.fov = pose.fov;
    cam.updateProjectionMatrix();
  }, [camera, pose]);

  return null;
};

/** 3D Low-Poly World Scene */
const PolyWorldScene: React.FC<{ f: number }> = ({ f }) => {
  return (
    <>
      <CameraRig f={f} />
      <PolyAtmosphere f={f} />
      <FloatingIsland f={f} />
    </>
  );
};

export const PolyverseExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * FILM_FPS;

  return (
    <AbsoluteFill style={{ backgroundColor: POLY_PALETTE.skyDawn }}>
      {/* 1. WebGL 3D Flat-Shaded Low-Poly Canvas */}
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
          fov: 30,
          near: 0.1,
          far: 500,
          position: [7, 4, 7],
        }}
      >
        <PolyWorldScene f={f} />
      </ThreeCanvas>

      {/* 2. Minimalist Swiss 2D Screen Overlay */}
      <PolyOverlay f={f} islandName="AETHEL // ISLE OF PRISMS" />
    </AbsoluteFill>
  );
};
