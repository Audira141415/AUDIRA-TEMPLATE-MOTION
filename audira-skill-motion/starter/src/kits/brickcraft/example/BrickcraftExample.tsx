import React, { useLayoutEffect, useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ToyRoomStage } from "../world/ToyRoomStage";
import { BrickAtmosphere } from "../world/Atmosphere";
import { getBrickCamera } from "../camera/rig";
import { BrickOverlay } from "../camera/Overlay";
import { stepFrame, characterWalk } from "../core/motion";

export const BRICKCRAFT_EXAMPLE_SECONDS = 8;

const CameraController: React.FC<{ progress: number }> = ({ progress }) => {
  const cam = useMemo(() => getBrickCamera(progress), [progress]);
  const { camera } = useThree();

  useLayoutEffect(() => {
    const c = camera as THREE.PerspectiveCamera;
    c.position.set(...cam.position);
    c.fov = cam.fov;
    c.lookAt(new THREE.Vector3(...cam.target));
    c.updateProjectionMatrix();
  }, [camera, cam]);

  return null;
};

export const BrickcraftExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Remotion 60 FPS normalized clock
  const f = (frame / fps) * 60;
  const totalF = (durationInFrames / fps) * 60;
  const progress = Math.min(1, Math.max(0, f / totalF));

  // Stepped stop-motion frame (15 FPS stepping = step of 4 frames at 60 FPS)
  const steppedF = stepFrame(f, 4);

  // Stepped character walking
  const walk = characterWalk(steppedF, 0.2);
  const characterX = (steppedF / 60) * 0.8 - 2.5;

  // Snapping bricks progress (starts at 2.0s, completes at 5.5s)
  const snapProgress = Math.max(0, Math.min(1, (f - 120) / 210));

  const subtitleText =
    progress < 0.35
      ? "LANGKAH 01: MERAKIT PONDASI & KARAKTER TOY"
      : progress < 0.7
      ? "LANGKAH 02: BRICK SNAP KE STRUKTUR ATAP"
      : "HASIL AKHIR: DIORAMA TOY ROOM STOP-MOTION";

  return (
    <AbsoluteFill style={{ backgroundColor: "#1e2124" }}>
      <ThreeCanvas
        width={width}
        height={height}
        shadows={{ type: THREE.PCFSoftShadowMap }}
        camera={{ position: [2, 3, 6], fov: 38 }}
      >
        <CameraController progress={progress} />
        <BrickAtmosphere />
        <ToyRoomStage
          snapProgress={snapProgress}
          characterX={characterX}
          characterZ={1.5}
          leftLegAngle={walk.leftLegAngle}
          rightLegAngle={walk.rightLegAngle}
          leftArmAngle={walk.leftArmAngle}
          rightArmAngle={walk.rightArmAngle}
          bodyBob={walk.bodyBob}
        />
      </ThreeCanvas>

      <BrickOverlay
        title="BRICKCRAFT 3D"
        subtitle={subtitleText}
        stepNumber={Math.floor(progress * 18) + 1}
      />
    </AbsoluteFill>
  );
};
