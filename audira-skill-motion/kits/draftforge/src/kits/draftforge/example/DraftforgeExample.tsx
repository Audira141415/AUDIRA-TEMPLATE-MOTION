// DRAFTFORGE technical example — an 8-second architectural CAD blueprint & exploded view sequence.
// Features animated vector CAD drafting, orthographic-to-isometric camera tilt, 3D dimension callouts,
// turbine rotation, and mechanical exploded assembly alignment.
//
// Time runs on film frames at a 60 fps clock (`f`), ensuring identical 30 fps preview and 60 fps final.

import React, { useLayoutEffect } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { DRAFT_PALETTE } from "../lib/palette";
import { DraftingTable } from "../world/DraftingTable";
import { CadModel } from "../world/CadModel";
import { CompassRose } from "../cad/CompassRose";
import { DraftOverlay } from "../camera/Overlay";
import { getDraftCameraPose } from "../camera/rig";
import { remap, ease } from "../core/motion";

export const DRAFTFORGE_EXAMPLE_SECONDS = 8;
const FILM_FPS = 60;

/** Camera Rig applying deterministic pose to the R3F camera */
const CameraRig: React.FC<{ f: number }> = ({ f }) => {
  const { camera } = useThree();
  const pose = getDraftCameraPose(f, DRAFTFORGE_EXAMPLE_SECONDS * FILM_FPS);

  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(...pose.position);
    cam.lookAt(new THREE.Vector3(...pose.target));
    cam.fov = pose.fov;
    cam.updateProjectionMatrix();
  }, [camera, pose]);

  return null;
};

/** 3D CAD Blueprint Scene */
const DraftWorld: React.FC<{ f: number; drawProgress: number; explodeProgress: number }> = ({
  f,
  drawProgress,
  explodeProgress,
}) => {
  return (
    <>
      <CameraRig f={f} />
      <ambientLight color={DRAFT_PALETTE.blueprintNavy} intensity={1.5} />
      <directionalLight position={[5, 10, 5]} color="#ffffff" intensity={1.2} />
      <DraftingTable size={36} divisions={72} />
      <CompassRose radius={0.8} position={[4.0, -1.95, -4.0]} />
      <CadModel f={f} drawProgress={drawProgress} explodeProgress={explodeProgress} />
    </>
  );
};

export const DraftforgeExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * FILM_FPS;

  // CAD lines draw on during frames 0 to 120 (0 - 2s)
  const drawProgress = remap(f, 0, 110, 0, 1);

  // Exploded assembly separates during frames 260 to 380 (approx 4.3s - 6.3s)
  const explodeProgress = ease.draft(remap(f, 260, 380, 0, 1));

  return (
    <AbsoluteFill style={{ backgroundColor: DRAFT_PALETTE.blueprintDark }}>
      {/* 1. WebGL 3D CAD Blueprint Canvas */}
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
          fov: 36,
          near: 0.1,
          far: 500,
          position: [0, 8, 3],
        }}
      >
        <DraftWorld f={f} drawProgress={drawProgress} explodeProgress={explodeProgress} />
      </ThreeCanvas>

      {/* 2. Architectural Sheet Border & Title Block Stamp */}
      <DraftOverlay f={f} projectTitle="PROJECT: AEROSPACE TURBOJET MK-IV" sheetNo="01 / 04" />
    </AbsoluteFill>
  );
};

