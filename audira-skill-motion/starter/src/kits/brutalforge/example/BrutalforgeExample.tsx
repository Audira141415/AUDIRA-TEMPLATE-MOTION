import React, { useLayoutEffect } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { BRUTAL_PALETTE } from "../lib/palette";
import { BrutalCard3D as ObjectStage } from "../world/ObjectStage";
import { BrutalOverlay } from "../camera/Overlay";
import { getCameraPose } from "../camera/rig";

export const BRUTALFORGE_EXAMPLE_SECONDS = 8;
const FILM_FPS = 60;

const CameraRig: React.FC<{ f: number }> = ({ f }) => {
  const { camera } = useThree();
  const pose = getCameraPose(f, BRUTALFORGE_EXAMPLE_SECONDS * FILM_FPS);

  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(...pose.position);
    cam.lookAt(new THREE.Vector3(...pose.target));
    cam.fov = pose.fov;
    cam.updateProjectionMatrix();
  }, [camera, pose]);

  return null;
};

export const BrutalforgeExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * FILM_FPS;

  return (
    <AbsoluteFill style={{ backgroundColor: BRUTAL_PALETTE.neoYellow }}>
      <ThreeCanvas
        width={width}
        height={height}
        dpr={1}
        camera={{ fov: 34, position: [0, 2, 4.5] }}
      >
        <CameraRig f={f} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 8, 5]} intensity={1.8} />
        <ObjectStage f={f} />
      </ThreeCanvas>
      <BrutalOverlay f={f} />
    </AbsoluteFill>
  );
};
