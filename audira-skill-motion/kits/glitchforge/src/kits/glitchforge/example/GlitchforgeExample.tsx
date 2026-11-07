import React, { useLayoutEffect } from "react";
import * as THREE from "three";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { computeGlitchState } from "../core/motion";
import { GlitchCameraConfig, getGlitchCamera } from "../camera/rig";
import { GlitchforgeOverlay } from "../camera/Overlay";
import { StudioSet3D } from "../scene/StudioSet3D";
import { HeroSculpture3D } from "../scene/HeroSculpture3D";
import { GlitchPost } from "../scene/GlitchPost";
import { GLITCH_PALETTE } from "../lib/palette";

export const GLITCHFORGE_EXAMPLE_SECONDS = 12;

const CameraRig: React.FC<{ cam: GlitchCameraConfig }> = ({ cam }) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    const c = camera as THREE.PerspectiveCamera;
    c.position.set(...cam.position);
    c.up.set(Math.sin(cam.roll), Math.cos(cam.roll), 0);
    c.lookAt(...cam.target);
    c.fov = cam.fov;
    c.near = 0.1;
    c.far = 80;
    c.updateProjectionMatrix();
    c.updateMatrixWorld();
  }, [camera, cam]);
  return null;
};

const Scene: React.FC<{ f: number }> = ({ f }) => {
  const s = computeGlitchState(f);
  const cam = getGlitchCamera(s);
  return (
    <>
      <color attach="background" args={[GLITCH_PALETTE.studio]} />
      <CameraRig cam={cam} />
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[4, 9, 5]}
        intensity={2.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={6}
        shadow-camera-bottom={-3}
        shadow-bias={-0.0003}
        shadow-radius={8}
      />
      <pointLight position={[-3.5, 3, -1.5]} color={GLITCH_PALETTE.cyan} intensity={8} distance={9} decay={2} />
      <pointLight position={[3, 1.6, -2.5]} color={GLITCH_PALETTE.signalRed} intensity={5} distance={8} decay={2} />
      <StudioSet3D />
      <HeroSculpture3D s={s} />
      <GlitchPost s={s} />
    </>
  );
};

export const GlitchforgeExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * 60;
  const s = computeGlitchState(f);
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: GLITCH_PALETTE.studio }}>
      <ThreeCanvas width={width} height={height} shadows={{ type: THREE.PCFSoftShadowMap }} camera={{ position: [0, 2.9, 7.4], fov: 36 }}>
        <Scene f={f} />
      </ThreeCanvas>
      <GlitchforgeOverlay s={s} width={width} height={height} />
    </div>
  );
};
