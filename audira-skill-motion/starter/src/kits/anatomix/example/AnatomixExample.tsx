// ANATOMIX technical example — 12 s clinical anatomy explainer of a stylised (non-gory) heart.
// Hook (0–2 s): close on an opaque beating heart. Development: wall turns translucent, blue right-heart
// circuit, then red left-heart circuit, labels with leader lines. Payoff (~8.8–11 s): both circuits flowing,
// hologram rings flare, camera keeps orbiting.
import React, { useLayoutEffect } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Heart3D } from "../scene/Heart3D";
import { BloodFlow3D } from "../scene/BloodFlow3D";
import { HoloSuite3D } from "../scene/HoloSuite3D";
import { getAnatomyCamera } from "../camera/rig";
import { AnatomyOverlay } from "../camera/Overlay";
import { ANATOMY_PALETTE as P } from "../lib/palette";

export const ANATOMIX_EXAMPLE_SECONDS = 12;

const CameraRig: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree();
  const pose = getAnatomyCamera(t);
  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(...pose.position);
    cam.lookAt(...pose.target);
    cam.fov = pose.fov;
    cam.updateProjectionMatrix();
  }, [camera, pose]);
  return null;
};

export const AnatomixExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill style={{ background: P.void }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 34, near: 0.1, far: 80, position: [0, 1, 6] }}>
        <CameraRig t={t} />
        <color attach="background" args={[P.void]} />
        <ambientLight intensity={0.35} color="#CFF7F2" />
        <directionalLight position={[3, 5, 5]} intensity={2.2} color="#FFF3EE" />
        <directionalLight position={[-4, 2, -3]} intensity={1.4} color={P.holo} />
        <pointLight position={[0, -0.9, 0.6]} intensity={3} distance={5} color={P.holo} />
        <HoloSuite3D t={t} />
        <BloodFlow3D t={t} />
        <Heart3D t={t} />
      </ThreeCanvas>
      <AnatomyOverlay t={t} width={width} height={height} />
    </AbsoluteFill>
  );
};
