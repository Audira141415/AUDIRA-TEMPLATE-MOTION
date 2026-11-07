import React, { useLayoutEffect, useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { SkyDome3D } from "../scene/SkyDome3D";
import { ChromeBlob3D } from "../scene/ChromeBlob3D";
import { Bubbles3D } from "../scene/Bubbles3D";
import { getY2kchromeCamera } from "../camera/rig";
import { Y2kchromeOverlay } from "../camera/Overlay";
import { makeEnvScene } from "../lib/materials";
import { Y2KCHROME_PALETTE as P } from "../lib/palette";

export const Y2KCHROME_EXAMPLE_SECONDS = 12;

const CameraRig: React.FC<{ f: number }> = ({ f }) => {
  const { camera } = useThree();
  const cam = getY2kchromeCamera(f);
  useLayoutEffect(() => {
    const c = camera as THREE.PerspectiveCamera;
    c.position.set(...cam.position);
    c.fov = cam.fov;
    c.lookAt(...cam.target);
    c.updateProjectionMatrix();
  });
  return null;
};

/** Sky-coloured reflection environment: what makes the chrome read as Y2K chrome. */
const SkyEnv: React.FC = () => {
  const { gl, scene } = useThree();
  const env = useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const rt = pm.fromScene(makeEnvScene(), 0.02);
    pm.dispose();
    return rt;
  }, [gl]);
  useLayoutEffect(() => {
    scene.environment = env.texture;
    scene.environmentIntensity = 1;
  }, [scene, env]);
  return null;
};

export const Y2kchromeExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * 60;
  const t = f / 60;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: P.skyMid }}>
      <ThreeCanvas width={width} height={height} camera={{ position: [0, 1, 6], fov: 42, near: 0.05, far: 120 }}>
        <CameraRig f={f} />
        <SkyEnv />
        <ambientLight intensity={0.4} color="#DFF3FF" />
        <directionalLight position={[3, 6, 5]} intensity={1.6} color="#FFFFFF" />
        <directionalLight position={[-5, 1, -3]} intensity={0.8} color={P.iriCyan} />

        <SkyDome3D t={t} />
        <ChromeBlob3D t={t} />
        <Bubbles3D t={t} />
      </ThreeCanvas>
      <Y2kchromeOverlay f={f} />
    </div>
  );
};
