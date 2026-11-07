import React, { useLayoutEffect } from "react";
import * as THREE from "three";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { computeRisoState } from "../core/motion";
import { RisoCameraConfig, getRisoCamera } from "../camera/rig";
import { RisoforgeOverlay } from "../camera/Overlay";
import { ZineSpread3D } from "../scene/ZineSpread3D";
import { PopupLayers3D } from "../scene/PopupLayers3D";
import { useRisoInks } from "../scene/inks";
import { RISO_PALETTE } from "../lib/palette";

export const RISOFORGE_EXAMPLE_SECONDS = 12;

const CameraRig: React.FC<{ cam: RisoCameraConfig }> = ({ cam }) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    const c = camera as THREE.PerspectiveCamera;
    c.position.set(...cam.position);
    c.up.set(...cam.up).normalize();
    c.lookAt(...cam.target);
    c.fov = cam.fov;
    c.near = 0.05;
    c.far = 80;
    c.updateProjectionMatrix();
    c.updateMatrixWorld();
  }, [camera, cam]);
  return null;
};

const Scene: React.FC<{ f: number; dotPx: number }> = ({ f, dotPx }) => {
  const inks = useRisoInks(dotPx);
  const s = computeRisoState(f);
  const cam = getRisoCamera(f);
  return (
    <>
      <color attach="background" args={[RISO_PALETTE.wall]} />
      <CameraRig cam={cam} />
      <ambientLight intensity={1.25} color="#FFF6E8" />
      <directionalLight
        position={[3.5, 8, 9]}
        intensity={1.35}
        color="#FFFFFF"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={8}
        shadow-camera-bottom={-4}
        shadow-bias={-0.0004}
        shadow-radius={6}
      />
      <ZineSpread3D s={s} inks={inks} />
      <PopupLayers3D s={s} inks={inks} />
    </>
  );
};

export const RisoforgeExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * 60;
  // halftone + grain scale with output height so preview and final print alike
  const dotPx = Math.max(3, Math.round((9 * height) / 1920));
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: RISO_PALETTE.wall }}>
      <ThreeCanvas flat width={width} height={height} shadows={{ type: THREE.PCFSoftShadowMap }} camera={{ position: [0, 11, 4.6], fov: 34 }}>
        <Scene f={f} dotPx={dotPx} />
      </ThreeCanvas>
      <RisoforgeOverlay f={f} width={width} height={height} />
    </div>
  );
};
