// DISASTERSIM technical example — 12 s calm geohazard explainer on a sliced earth block.
// Hook (0–2.6 s): close on the locked fault as it loads. Rupture at 2.6 s: rebound, rings, magnitude.
// Development: the wave splits, slows and steepens toward the coast; warning ramp climbs; evacuation route lights.
// Payoff (~8.6–11 s): run-up on the beach while the town's route and high-ground beacon glow.
import React, { useLayoutEffect } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EarthBlock3D } from "../scene/EarthBlock3D";
import { TsunamiWater3D } from "../scene/TsunamiWater3D";
import { CoastalTown3D } from "../scene/CoastalTown3D";
import { getDisasterCamera } from "../camera/rig";
import { DisasterOverlay } from "../camera/Overlay";
import { DISASTER_PALETTE as P } from "../lib/palette";

export const DISASTERSIM_EXAMPLE_SECONDS = 12;

const CameraRig: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree();
  const pose = getDisasterCamera(t);
  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(...pose.position);
    cam.lookAt(...pose.target);
    cam.fov = pose.fov;
    cam.updateProjectionMatrix();
  }, [camera, pose]);
  return null;
};

export const DisastersimExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill style={{ background: P.void }}>
      <ThreeCanvas width={width} height={height} shadows camera={{ fov: 42, near: 0.05, far: 80, position: [1.5, -0.9, 5] }}>
        <CameraRig t={t} />
        <color attach="background" args={[P.void]} />
        <fog attach="fog" args={[P.void, 18, 46]} />
        <ambientLight intensity={0.45} color="#DCEAF2" />
        <hemisphereLight args={["#CFE6FF", "#2A2018", 0.5]} />
        <directionalLight
          position={[4, 8, 6]}
          intensity={2.1}
          color="#FFF4E6"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
          shadow-bias={-0.0005}
        />
        <directionalLight position={[-6, 3, 4]} intensity={0.7} color="#9CC8FF" />
        <pointLight position={[0, -3.6, 3.2]} intensity={3} distance={6} color={P.mantleHot} />
        <EarthBlock3D t={t} />
        <TsunamiWater3D t={t} />
        <CoastalTown3D t={t} />
      </ThreeCanvas>
      <DisasterOverlay t={t} height={height} />
    </AbsoluteFill>
  );
};
