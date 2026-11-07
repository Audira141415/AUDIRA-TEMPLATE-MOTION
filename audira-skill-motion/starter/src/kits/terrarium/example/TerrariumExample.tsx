// TERRARIUM technical example — 12 s macro orbit around a living glass-jar terrarium.
// Hook (0–2 s): sunlit jar on a table, refraction through curved glass. Development: midday condensation,
// droplets sliding down, pool ripples, the snail gliding. Payoff (~9.5–11 s): night falls, mushrooms glow,
// fireflies drift, camera reaches the snail at eye level.
import React, { useLayoutEffect } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GlassJar3D } from "../scene/GlassJar3D";
import { JarGarden3D } from "../scene/JarGarden3D";
import { Snail3D } from "../scene/Snail3D";
import { getTerraCamera, leafPose } from "../camera/rig";
import { TerraOverlay } from "../camera/Overlay";
import { dayState } from "../core/motion";

export const TERRARIUM_EXAMPLE_SECONDS = 12;

const CameraRig: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree();
  const pose = getTerraCamera(t);
  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(...pose.position);
    cam.lookAt(...pose.target);
    cam.fov = pose.fov;
    cam.updateProjectionMatrix();
  }, [camera, pose]);
  return null;
};

export const TerrariumExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const day = dayState(t);
  const sky = `#${day.sky.getHexString()}`;

  return (
    <AbsoluteFill style={{ background: sky }}>
      <ThreeCanvas width={width} height={height} shadows camera={{ fov: 34, near: 0.05, far: 80, position: [3, 2.7, 5.6] }}>
        <CameraRig t={t} />
        <color attach="background" args={[sky]} />
        <fog attach="fog" args={[sky, 9, 26]} />
        <ambientLight intensity={day.amb} color={day.night > 0.5 ? "#9FB4FF" : "#FFF3E2"} />
        <hemisphereLight args={[day.sky, "#3A2A1C", 0.35 + 0.25 * (1 - day.night)]} />
        <directionalLight
          position={day.sunPos}
          intensity={day.sunI}
          color={day.sun}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-3}
          shadow-camera-right={3}
          shadow-camera-top={3}
          shadow-camera-bottom={-3}
          shadow-bias={-0.0006}
        />
        <directionalLight position={[-4, 3, -4]} intensity={0.6} color="#CFE6FF" />
        <JarGarden3D t={t} />
        <Snail3D t={t} />
        <GlassJar3D t={t} leaf={leafPose(t)} />
      </ThreeCanvas>
      <TerraOverlay t={t} height={height} />
    </AbsoluteFill>
  );
};
