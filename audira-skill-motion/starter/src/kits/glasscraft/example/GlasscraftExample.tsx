// GLASSCRAFT technical example — an 8-second spatial computing showcase at 60 FPS.
// Features beveled frosted glass cards with transmission refraction, orbiting liquid droplets with
// dynamic surface tension wobble, iridescent rim lighting, and a modern spatial computing HUD.
//
// Time runs on film frames at a 60 fps clock (`f`), ensuring identical 30 fps preview and 60 fps final.

import React, { useLayoutEffect } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GLASS_PALETTE } from "../lib/palette";
import { GlassSanctuary } from "../world/GlassSanctuary";
import { GlassAtmosphere } from "../world/Atmosphere";
import { GlassOverlay } from "../camera/Overlay";
import { getGlassCameraPose } from "../camera/rig";
import { remap, ease } from "../core/motion";

export const GLASSCRAFT_EXAMPLE_SECONDS = 8;
const FILM_FPS = 60;

/** Camera Rig applying deterministic pose to the R3F camera */
const CameraRig: React.FC<{ f: number }> = ({ f }) => {
  const { camera } = useThree();
  const pose = getGlassCameraPose(f, GLASSCRAFT_EXAMPLE_SECONDS * FILM_FPS);

  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(...pose.position);
    cam.lookAt(new THREE.Vector3(...pose.target));
    cam.fov = pose.fov;
    cam.updateProjectionMatrix();
  }, [camera, pose]);

  return null;
};

/** 3D Spatial Computing Scene */
const GlassWorldScene: React.FC<{
  f: number;
  tiltX: number;
  tiltY: number;
}> = ({ f, tiltX, tiltY }) => {
  return (
    <>
      <CameraRig f={f} />
      <GlassAtmosphere />
      <GlassSanctuary f={f} cardTiltX={tiltX} cardTiltY={tiltY} />
    </>
  );
};

export const GlasscraftExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * FILM_FPS;

  // Spatial Gyroscopic Tilts
  // Gentle tactile parallax response
  const tiltX = Math.sin(f * 0.02) * 0.12 + (f > 150 ? ease.spatialFloat(remap(f, 150, 240, 0, 0.18)) : 0);
  const tiltY = Math.cos(f * 0.025) * 0.18 + (f > 180 ? -ease.spatialFloat(remap(f, 180, 280, 0, 0.35)) : 0);

  return (
    <AbsoluteFill style={{ backgroundColor: GLASS_PALETTE.voidDark }}>
      {/* 1. WebGL 3D Spatial Glassmorphism Canvas */}
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
        <GlassWorldScene f={f} tiltX={tiltX} tiltY={tiltY} />
      </ThreeCanvas>

      {/* 2. Spatial Computing Frosted Pill & Telemetry HUD Overlay */}
      <GlassOverlay f={f} />
    </AbsoluteFill>
  );
};
