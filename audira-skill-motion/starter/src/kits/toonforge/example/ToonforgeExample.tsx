// TOONFORGE technical example — an 8-second high-octane anime action sequence at 60 FPS.
// Features cel-shaded mecha craft with inverted-hull ink outlines, thruster ignition snap,
// radial manga speed lines, impact camera shake, and dramatic comic overlays.
//
// Time runs on film frames at a 60 fps clock (`f`), ensuring identical 30 fps preview and 60 fps final.

import React, { useLayoutEffect } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { TOON_PALETTE } from "../lib/palette";
import { MechaCore } from "../character/MechaCore";
import { SpeedLines } from "../effects/SpeedLines";
import { AnimeDiorama } from "../world/AnimeDiorama";
import { ToonAtmosphere } from "../world/Atmosphere";
import { ToonOverlay } from "../camera/Overlay";
import { getToonCameraPose } from "../camera/rig";
import { remap, ease } from "../core/motion";

export const TOONFORGE_EXAMPLE_SECONDS = 8;
const FILM_FPS = 60;

/** Camera Rig applying deterministic pose to the R3F camera */
const CameraRig: React.FC<{ f: number }> = ({ f }) => {
  const { camera } = useThree();
  const pose = getToonCameraPose(f, TOONFORGE_EXAMPLE_SECONDS * FILM_FPS);

  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(...pose.position);
    cam.lookAt(new THREE.Vector3(...pose.target));
    cam.fov = pose.fov;
    cam.updateProjectionMatrix();
  }, [camera, pose]);

  return null;
};

/** 3D Cel-Shaded Anime Scene */
const ToonWorldScene: React.FC<{
  f: number;
  pitch: number;
  roll: number;
  thrustPower: number;
  speedLinesIntensity: number;
}> = ({ f, pitch, roll, thrustPower, speedLinesIntensity }) => {
  return (
    <>
      <CameraRig f={f} />
      <ToonAtmosphere />
      <AnimeDiorama f={f} />
      <MechaCore f={f} pitch={pitch} roll={roll} thrustPower={thrustPower} />
      <SpeedLines f={f} count={52} intensity={speedLinesIntensity} />
    </>
  );
};

export const ToonforgeExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * FILM_FPS;

  // Mecha Aerodynamics & Boost timing
  // Frames 0-160: Idle warming up
  // Frames 160-320: Full boost speed burst
  // Frames 320-480: Cruise hero glide
  const isBoostPhase = f >= 160 && f < 320;
  const thrustPower = isBoostPhase ? 1.0 : f < 160 ? remap(f, 60, 160, 0.1, 0.4) : 0.65;
  const speedLinesIntensity = isBoostPhase ? 1.0 : f >= 320 ? remap(f, 320, 380, 0.8, 0.0) : 0.0;

  // Aerodynamic roll into bank
  const roll = isBoostPhase ? ease.animeSnap(remap(f, 160, 240, 0, 0.45)) : 0.15;
  const pitch = isBoostPhase ? -0.15 : 0.05;

  return (
    <AbsoluteFill style={{ backgroundColor: TOON_PALETTE.animeDusk }}>
      {/* 1. WebGL 3D Cel-Shaded Anime Canvas */}
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
          fov: 42,
          near: 0.1,
          far: 500,
          position: [0, 0, 6],
        }}
      >
        <ToonWorldScene
          f={f}
          pitch={pitch}
          roll={roll}
          thrustPower={thrustPower}
          speedLinesIntensity={speedLinesIntensity}
        />
      </ThreeCanvas>

      {/* 2. Manga Comic Letterbox & Action Banner Overlay */}
      <ToonOverlay f={f} episodeTitle="PROJECT: VALKYRIE // EP. 01" />
    </AbsoluteFill>
  );
};
