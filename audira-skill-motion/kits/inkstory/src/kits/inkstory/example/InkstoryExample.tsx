// INKSTORY technical example — an 8-second traditional ink wash painting sequence at 60 FPS.
// Features 3D layered Shan Shui mountain peaks, billowing mist, animated calligraphy stroke write-on,
// swaying ink bamboo, red cinnabar seal stamp, and traditional vertical verse.
//
// Time runs on film frames at a 60 fps clock (`f`), ensuring identical 30 fps preview and 60 fps final.

import React, { useLayoutEffect } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { INK_PALETTE } from "../lib/palette";
import { InkMountainDiorama } from "../world/InkMountainDiorama";
import { InkAtmosphere } from "../world/Atmosphere";
import { InkOverlay } from "../camera/Overlay";
import { getInkCameraPose } from "../camera/rig";

export const INKSTORY_EXAMPLE_SECONDS = 8;
const FILM_FPS = 60;

/** Camera Rig applying deterministic pose to the R3F camera */
const CameraRig: React.FC<{ f: number }> = ({ f }) => {
  const { camera } = useThree();
  const pose = getInkCameraPose(f, INKSTORY_EXAMPLE_SECONDS * FILM_FPS);

  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(...pose.position);
    cam.lookAt(new THREE.Vector3(...pose.target));
    cam.fov = pose.fov;
    cam.updateProjectionMatrix();
  }, [camera, pose]);

  return null;
};

/** 3D Ink Wash Scene */
const InkWorldScene: React.FC<{ f: number }> = ({ f }) => {
  return (
    <>
      <CameraRig f={f} />
      <InkAtmosphere />
      <InkMountainDiorama f={f} />
    </>
  );
};

export const InkstoryExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * FILM_FPS;

  return (
    <AbsoluteFill style={{ backgroundColor: INK_PALETTE.agedXuanPaper }}>
      {/* 1. WebGL 3D Ink Wash Shan Shui Canvas */}
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
          fov: 35,
          near: 0.1,
          far: 500,
          position: [0, 0, 6],
        }}
      >
        <InkWorldScene f={f} />
      </ThreeCanvas>

      {/* 2. Traditional Vertical Poetry & Cinnabar Seal Overlay */}
      <InkOverlay f={f} />
    </AbsoluteFill>
  );
};

