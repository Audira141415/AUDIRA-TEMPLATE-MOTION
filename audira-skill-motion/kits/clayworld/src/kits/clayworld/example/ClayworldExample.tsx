// CLAYWORLD technical example — an 8-second stop-motion clay creature story with squash-and-stretch hops.
// Features a handcrafted plasticine character, mushroom tabletop diorama, stepped 15 FPS cadence,
// and warm miniature studio lighting.
//
// Time runs on film frames at a 60 fps clock (`f`), ensuring identical 30 fps preview and 60 fps final.

import React, { useLayoutEffect } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CLAY_PALETTE } from "../lib/palette";
import { ClayCreature } from "../character/ClayCreature";
import { ClayDiorama } from "../world/ClayDiorama";
import { ClayAtmosphere } from "../world/Atmosphere";
import { ClayOverlay } from "../camera/Overlay";
import { getClayCameraPose } from "../camera/rig";
import { stepFrame } from "../core/motion";

export const CLAYWORLD_EXAMPLE_SECONDS = 8;
const FILM_FPS = 60;

/** Camera Rig applying deterministic pose to the R3F camera */
const CameraRig: React.FC<{ f: number }> = ({ f }) => {
  const { camera } = useThree();
  const pose = getClayCameraPose(f, CLAYWORLD_EXAMPLE_SECONDS * FILM_FPS);

  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(...pose.position);
    cam.lookAt(new THREE.Vector3(...pose.target));
    cam.fov = pose.fov;
    cam.updateProjectionMatrix();
  }, [camera, pose]);

  return null;
};

/** 3D Clay Scene */
const ClayWorldScene: React.FC<{
  f: number;
  hopHeight: number;
  squashFactor: number;
  blinkState: boolean;
}> = ({ f, hopHeight, squashFactor, blinkState }) => {
  return (
    <>
      <CameraRig f={f} />
      <ClayAtmosphere />
      <ClayDiorama />
      <ClayCreature
        f={f}
        hopHeight={hopHeight}
        squashFactor={squashFactor}
        blinkState={blinkState}
        color={CLAY_PALETTE.terracotta}
      />
    </>
  );
};

export const ClayworldExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * FILM_FPS;

  // Enforce authentic 15 FPS stepped animation clock for character physics
  const sf = stepFrame(f, 4);

  // Discrete stop-motion blinking at specific frame ranges
  const blinkState =
    (sf >= 60 && sf <= 72) ||
    (sf >= 220 && sf <= 232) ||
    (sf >= 410 && sf <= 422);

  // Hop 1: Frames 140 to 200
  let hopHeight = 0;
  let squashFactor = 0;

  if (sf >= 130 && sf < 144) {
    // Anticipation crouch / squash
    squashFactor = -0.22;
  } else if (sf >= 144 && sf < 180) {
    // Air jump arc with stretch
    const progress = (sf - 144) / 36;
    hopHeight = Math.sin(progress * Math.PI) * 0.9;
    squashFactor = 0.28 * Math.cos(progress * Math.PI);
  } else if (sf >= 180 && sf < 196) {
    // Impact landing squash
    squashFactor = -0.3;
  }

  // Hop 2: Frames 240 to 310
  if (sf >= 240 && sf < 252) {
    squashFactor = -0.25;
  } else if (sf >= 252 && sf < 294) {
    const progress = (sf - 252) / 42;
    hopHeight = Math.sin(progress * Math.PI) * 1.35;
    squashFactor = 0.35 * Math.cos(progress * Math.PI);
  } else if (sf >= 294 && sf < 312) {
    squashFactor = -0.32;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: CLAY_PALETTE.studioBackground }}>
      {/* 1. WebGL 3D Claymation Canvas */}
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
          position: [0, 1.5, 4],
        }}
      >
        <ClayWorldScene
          f={f}
          hopHeight={hopHeight}
          squashFactor={squashFactor}
          blinkState={blinkState}
        />
      </ThreeCanvas>

      {/* 2. Tactile 2D Handcrafted Vignette & Film Stamp */}
      <ClayOverlay f={f} filmTitle="THE LITTLE CLAY CRITTER" />
    </AbsoluteFill>
  );
};

