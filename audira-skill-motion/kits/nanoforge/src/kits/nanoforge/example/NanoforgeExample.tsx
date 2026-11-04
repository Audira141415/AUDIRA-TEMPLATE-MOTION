// NANOFORGE technical example — an 8-second molecular nanotech sequence at 60 FPS.
// Features procedural DNA double helix with rotating base pairs, undulating cellular vesicles,
// Brownian thermal drift, bioluminescent lighting, and Cryo-EM microscopy telemetry.
//
// Time runs on film frames at a 60 fps clock (`f`), ensuring identical 30 fps preview and 60 fps final.

import React, { useLayoutEffect } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { NANO_PALETTE } from "../lib/palette";
import { MicroCosmos } from "../world/MicroCosmos";
import { NanoAtmosphere } from "../world/Atmosphere";
import { NanoOverlay } from "../camera/Overlay";
import { getNanoCameraPose } from "../camera/rig";

export const NANOFORGE_EXAMPLE_SECONDS = 8;
const FILM_FPS = 60;

/** Camera Rig applying deterministic pose to the R3F camera */
const CameraRig: React.FC<{ f: number }> = ({ f }) => {
  const { camera } = useThree();
  const pose = getNanoCameraPose(f, NANOFORGE_EXAMPLE_SECONDS * FILM_FPS);

  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(...pose.position);
    cam.lookAt(new THREE.Vector3(...pose.target));
    cam.fov = pose.fov;
    cam.updateProjectionMatrix();
  }, [camera, pose]);

  return null;
};

/** 3D Molecular Scene */
const NanoWorldScene: React.FC<{ f: number }> = ({ f }) => {
  return (
    <>
      <CameraRig f={f} />
      <NanoAtmosphere />
      <MicroCosmos f={f} />
    </>
  );
};

export const NanoforgeExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * FILM_FPS;

  return (
    <AbsoluteFill style={{ backgroundColor: NANO_PALETTE.microscopyVoid }}>
      {/* 1. WebGL 3D Cryo-EM & Molecular Nanotech Canvas */}
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
          fov: 34,
          near: 0.1,
          far: 500,
          position: [0, 0, 6],
        }}
      >
        <NanoWorldScene f={f} />
      </ThreeCanvas>

      {/* 2. Scientific Microscopy HUD Overlay */}
      <NanoOverlay f={f} />
    </AbsoluteFill>
  );
};

