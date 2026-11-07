import React, { useLayoutEffect, useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RevealStage3D } from "../scene/RevealStage3D";
import { Capsule3D, CAPSULE_CENTER } from "../scene/Capsule3D";
import { HoloCard3D } from "../scene/HoloCard3D";
import { Confetti3D } from "../scene/Confetti3D";
import { getGacharevealCamera } from "../camera/rig";
import { GacharevealOverlay } from "../camera/Overlay";
import { flash, rarityColor } from "../core/motion";
import { GACHAREVEAL_PALETTE as P } from "../lib/palette";

export const GACHAREVEAL_EXAMPLE_SECONDS = 12;

const CameraRig: React.FC<{ f: number }> = ({ f }) => {
  const { camera } = useThree();
  const cam = getGacharevealCamera(f);
  useLayoutEffect(() => {
    const c = camera as THREE.PerspectiveCamera;
    c.position.set(...cam.position);
    c.fov = cam.fov;
    c.lookAt(...cam.target);
    c.updateProjectionMatrix();
  });
  return null;
};

const StageEnv: React.FC = () => {
  const { gl, scene } = useThree();
  const env = useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const rt = pm.fromScene(new RoomEnvironment(), 0.04);
    pm.dispose();
    return rt;
  }, [gl]);
  useLayoutEffect(() => {
    scene.environment = env.texture;
    scene.environmentIntensity = 0.35;
    scene.background = new THREE.Color(P.void);
  }, [scene, env]);
  return null;
};

export const GacharevealExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * 60;
  const t = f / 60;
  const col = rarityColor(t);
  const fl = flash(t);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: P.void }}>
      <ThreeCanvas width={width} height={height} shadows camera={{ position: [0, 1.5, 5], fov: 46, near: 0.05, far: 80 }}>
        <CameraRig f={f} />
        <StageEnv />
        <ambientLight intensity={0.25} color="#8C8CFF" />
        <spotLight position={[0, 7, 3]} angle={0.5} penumbra={0.8} intensity={60} decay={1.5} color="#FFFFFF" castShadow shadow-mapSize={[1024, 1024]} />
        {/* rarity-coloured practical from the capsule core */}
        <pointLight position={[CAPSULE_CENTER.x, CAPSULE_CENTER.y + 0.3, CAPSULE_CENTER.z]} intensity={6 + fl * 20} distance={9} decay={1.6} color={col} />
        <directionalLight position={[-4, 3, -4]} intensity={1.1} color={col} />
        <directionalLight position={[3, 2, 5]} intensity={0.6} color="#FFE9C4" />

        <RevealStage3D t={t} />
        <Capsule3D t={t} />
        <HoloCard3D t={t} />
        <Confetti3D t={t} />
      </ThreeCanvas>
      <GacharevealOverlay f={f} />
    </div>
  );
};
