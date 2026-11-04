// CIRCUITFORGE technical example — an 8-second 3D PCB electronics sequence at 60 FPS.
// Features 3D FR-4 substrate, octilinear copper traces, central BGA silicon processor,
// glowing electron current streams, gold ENIG test pads, and hardware diagnostic HUD telemetry.
//
// Time runs on film frames at a 60 fps clock (`f`), ensuring identical 30 fps preview and 60 fps final.

import React, { useLayoutEffect } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CIRCUIT_PALETTE } from "../lib/palette";
import { CircuitStage } from "../world/CircuitStage";
import { CircuitAtmosphere } from "../world/Atmosphere";
import { CircuitOverlay } from "../camera/Overlay";
import { getCircuitCameraPose } from "../camera/rig";

export const CIRCUITFORGE_EXAMPLE_SECONDS = 8;
const FILM_FPS = 60;

/** Camera Rig applying deterministic pose to the R3F camera */
const CameraRig: React.FC<{ f: number }> = ({ f }) => {
  const { camera } = useThree();
  const pose = getCircuitCameraPose(f, CIRCUITFORGE_EXAMPLE_SECONDS * FILM_FPS);

  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(...pose.position);
    cam.lookAt(new THREE.Vector3(...pose.target));
    cam.fov = pose.fov;
    cam.updateProjectionMatrix();
  }, [camera, pose]);

  return null;
};

/** 3D Motherboard Circuit Scene */
const CircuitWorldScene: React.FC<{ f: number }> = ({ f }) => {
  return (
    <>
      <CameraRig f={f} />
      <CircuitAtmosphere />
      <CircuitStage f={f} />
    </>
  );
};

export const CircuitforgeExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * FILM_FPS;

  return (
    <AbsoluteFill style={{ backgroundColor: CIRCUIT_PALETTE.solderMaskDark }}>
      {/* 1. WebGL 3D PCB Motherboard Canvas */}
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
          position: [0, 4, 6],
        }}
      >
        <CircuitWorldScene f={f} />
      </ThreeCanvas>

      {/* 2. Hardware Diagnostic HUD Overlay */}
      <CircuitOverlay f={f} />
    </AbsoluteFill>
  );
};

