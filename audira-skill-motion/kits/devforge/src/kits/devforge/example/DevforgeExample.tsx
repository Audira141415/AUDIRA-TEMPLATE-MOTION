import React, { useLayoutEffect } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { DEVFORGE_PALETTE } from "../lib/palette";
import { IdeWindow3D } from "../ide/IdeWindow3D";
import { DevforgeOverlay } from "../camera/Overlay";
import { getDevCameraPose } from "../camera/rig";

export const DEVFORGE_EXAMPLE_SECONDS = 8;
const FILM_FPS = 60;

const CameraRig: React.FC<{ f: number }> = ({ f }) => {
  const { camera } = useThree();
  const pose = getDevCameraPose(f, DEVFORGE_EXAMPLE_SECONDS * FILM_FPS);

  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(...pose.position);
    cam.lookAt(new THREE.Vector3(...pose.target));
    cam.fov = pose.fov;
    cam.updateProjectionMatrix();
  }, [camera, pose]);

  return null;
};

export const DevforgeExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * FILM_FPS;

  return (
    <AbsoluteFill style={{ backgroundColor: DEVFORGE_PALETTE.ambientVoid }}>
      <ThreeCanvas
        width={width}
        height={height}
        dpr={1}
        shadows
        camera={{ fov: 36, position: [0.8, 0.4, 4.2] }}
      >
        <CameraRig f={f} />
        {/* Studio Lighting Setup */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[4, 6, 4]} intensity={2.2} color="#FFFFFF" />
        <directionalLight position={[-4, 2, -2]} intensity={1.4} color={DEVFORGE_PALETTE.accentNeon} />
        <pointLight position={[0, -1, 1]} intensity={2.0} color={DEVFORGE_PALETTE.metricProfit} />

        {/* 3D Floating IDE Window */}
        <IdeWindow3D f={f} />
      </ThreeCanvas>

      {/* HUD Telemetry & Metric Overlay */}
      <DevforgeOverlay f={f} />
    </AbsoluteFill>
  );
};
