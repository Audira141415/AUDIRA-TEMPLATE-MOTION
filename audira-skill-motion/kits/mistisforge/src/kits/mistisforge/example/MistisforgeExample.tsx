import React, { useLayoutEffect } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { KampungNight3D } from "../scene/KampungNight3D";
import { PelitaLanterns3D } from "../scene/PelitaLanterns3D";
import { FogVeil3D } from "../scene/FogVeil3D";
import { getMistisCamera } from "../camera/rig";
import { MistisOverlay } from "../camera/Overlay";
import { MISTIS_PALETTE } from "../lib/palette";
import { computeMistisState } from "../core/motion";

export const MISTISFORGE_EXAMPLE_SECONDS = 12;

const CameraDriver: React.FC<{ f: number }> = ({ f }) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    const cam = getMistisCamera(f);
    const c = camera as THREE.PerspectiveCamera;
    c.position.set(...cam.position);
    c.fov = cam.fov;
    c.lookAt(...cam.target);
    c.updateProjectionMatrix();
  }, [camera, f]);
  return null;
};

export const MistisforgeExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * 60;
  const s = computeMistisState(f);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: MISTIS_PALETTE.nightSky }}>
      <ThreeCanvas width={width} height={height} camera={{ position: [0, 1.5, 8.6], fov: 52, near: 0.05, far: 80 }}>
        <CameraDriver f={f} />
        <color attach="background" args={[MISTIS_PALETTE.nightSky]} />
        <fogExp2 attach="fog" args={[MISTIS_PALETTE.fogNight, 0.055]} />

        {/* cold moonlight from behind the house (rim) + sky/ground bounce */}
        <hemisphereLight args={["#5C7AA6", "#1A1610", 0.9 + s.moonSurge * 0.5]} />
        <directionalLight position={[-3, 9, -14]} intensity={1.6 + s.moonSurge * 1.4} color={MISTIS_PALETTE.moonlight} />
        <directionalLight position={[4, 5, 8]} intensity={0.25} color="#6F86A8" />

        <KampungNight3D f={f} />
        <PelitaLanterns3D f={f} />
        <FogVeil3D f={f} />
      </ThreeCanvas>

      <MistisOverlay f={f} />
    </div>
  );
};
