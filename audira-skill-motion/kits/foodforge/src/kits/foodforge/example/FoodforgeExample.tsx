import React, { useLayoutEffect, useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { TabletopSet3D } from "../scene/TabletopSet3D";
import { RamenBowl3D } from "../scene/RamenBowl3D";
import { SteamWisps3D } from "../scene/SteamWisps3D";
import { getFoodforgeCamera } from "../camera/rig";
import { FoodforgeOverlay } from "../camera/Overlay";
import { computeFoodState } from "../core/motion";
import { FOODFORGE_PALETTE as P } from "../lib/palette";

export const FOODFORGE_EXAMPLE_SECONDS = 12;

const CameraRig: React.FC<{ f: number }> = ({ f }) => {
  const { camera } = useThree();
  const cam = getFoodforgeCamera(f);
  useLayoutEffect(() => {
    const c = camera as THREE.PerspectiveCamera;
    c.position.set(...cam.position);
    c.fov = cam.fov;
    c.lookAt(...cam.target);
    c.updateProjectionMatrix();
  });
  return null;
};

/** Soft studio reflections for the glossy broth, glaze and lacquer (procedural, no HDR file). */
const StudioEnv: React.FC = () => {
  const { gl, scene } = useThree();
  const env = useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const rt = pm.fromScene(new RoomEnvironment(), 0.04);
    pm.dispose();
    return rt;
  }, [gl]);
  useLayoutEffect(() => {
    scene.environment = env.texture;
    scene.environmentIntensity = 0.28;
    scene.background = new THREE.Color(P.backdrop);
  }, [scene, env]);
  return null;
};

export const FoodforgeExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * 60;
  const st = computeFoodState(f);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: P.backdrop }}>
      <ThreeCanvas width={width} height={height} shadows camera={{ position: [0, 2, 4.5], fov: 40, near: 0.05, far: 60 }}>
        <CameraRig f={f} />
        <StudioEnv />
        <ambientLight intensity={0.12} color={P.keyWarm} />
        {/* warm softbox key, front-right */}
        <directionalLight
          position={[2.6, 4.2, 3.2]}
          intensity={2.3}
          color={P.keyWarm}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-3}
          shadow-camera-right={3}
          shadow-camera-top={3}
          shadow-camera-bottom={-3}
          shadow-bias={-0.0004}
          shadow-radius={4}
        />
        {/* hot backlight rim: makes steam and glaze edges glow */}
        <spotLight position={[-1.8, 3.4, -3.2]} angle={0.55} penumbra={0.9} intensity={34} decay={1.6} color={P.rimWarm} />
        <directionalLight position={[3, 1.4, -3]} intensity={0.9} color={P.rimWarm} />
        {/* cool kicker for separation on the left */}
        <directionalLight position={[-4, 1.5, 1.5]} intensity={0.35} color={P.fillCool} />

        <TabletopSet3D f={f} />
        <RamenBowl3D t={st.t} lift={st.lift} chopIn={st.chopIn} />
        <SteamWisps3D t={st.t} steam={st.steam} />
      </ThreeCanvas>
      <FoodforgeOverlay f={f} />
    </div>
  );
};
