import React, { useLayoutEffect } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { AUDIRABOT_PALETTE } from "../lib/palette";
import { AudiraBotMesh } from "../robot/AudiraBotMesh";
import { AudirabotOverlay } from "../camera/Overlay";
import { getBotCameraPose } from "../camera/rig";
import { TrackedPin3D } from "../hud/TrackedPin3D";

export const AUDIRABOT_EXAMPLE_SECONDS = 8;
const FILM_FPS = 60;

const CameraRig: React.FC<{ f: number }> = ({ f }) => {
  const { camera } = useThree();
  const pose = getBotCameraPose(f, AUDIRABOT_EXAMPLE_SECONDS * FILM_FPS);

  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(...pose.position);
    cam.lookAt(new THREE.Vector3(...pose.target));
    cam.fov = pose.fov;
    cam.updateProjectionMatrix();
  }, [camera, pose]);

  return null;
};

export const AudirabotExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * FILM_FPS;

  return (
    <AbsoluteFill style={{ backgroundColor: AUDIRABOT_PALETTE.ambientVoid }}>
      <ThreeCanvas
        width={width}
        height={height}
        dpr={1}
        shadows
        camera={{ fov: 35, position: [0, 0.8, 3] }}
      >
        <CameraRig f={f} />
        {/* Studio Lighting Setup */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[4, 6, 4]} intensity={2.0} color="#FFFFFF" />
        <directionalLight position={[-4, 2, -2]} intensity={1.2} color={AUDIRABOT_PALETTE.thrusterPlasma} />
        <pointLight position={[0, -1, 0]} intensity={2.5} distance={3} color={AUDIRABOT_PALETTE.thrusterPlasma} />
        
        {/* Mascot Robot */}
        <AudiraBotMesh f={f} />

        {/* 3D World-Space Telemetry Callout Pin */}
        <TrackedPin3D
          anchor={[0, 0.2, 0.5]}
          cardOffset={[0.75, 0.6, 0]}
          kicker="NEURAL COMPANION"
          title="COGNITION CORE"
          value="4.80 GHz"
          accentColor={AUDIRABOT_PALETTE.eyeCyan}
          f={f}
          scale={0.8}
        />
      </ThreeCanvas>

      {/* Telemetry Dialogue Overlay */}
      <AudirabotOverlay f={f} />
    </AbsoluteFill>
  );
};
