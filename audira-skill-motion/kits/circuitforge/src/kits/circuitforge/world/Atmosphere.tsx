// CIRCUITFORGE Atmosphere — Macro studio softbox illumination & gold pad specular kickers.

import React, { useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";
import { PMREMGenerator } from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { CIRCUIT_PALETTE } from "../lib/palette";

/**
 * Static studio reflection environment. Copper, ENIG gold and the silicon die are metallic
 * (metalness 0.75–0.95); without an environment to reflect, metal renders almost black.
 */
const CircuitReflections: React.FC<{ intensity?: number }> = ({ intensity = 0.6 }) => {
  const { gl, scene } = useThree();
  useLayoutEffect(() => {
    const pm = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const rt = pm.fromScene(room, 0.04);
    scene.environment = rt.texture;
    scene.environmentIntensity = intensity;
    return () => {
      scene.environment = null;
      rt.dispose();
      room.dispose();
      pm.dispose();
    };
  }, [gl, scene, intensity]);
  return null;
};

export const CircuitAtmosphere: React.FC = () => {
  return (
    <>
      <CircuitReflections />

      {/* Neutral Macro Ambient Fill */}
      <ambientLight color="#334155" intensity={1.1} />

      {/* Main Overhead Softbox (Clean specular band across silicon die) */}
      <directionalLight
        position={[4, 9, 5]}
        color="#ffffff"
        intensity={3.0}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Gold Pad Specular Kicker Light */}
      <pointLight position={[-4, 2, -4]} color="#ffd700" intensity={1.8} distance={12} />

      {/* Amber Current Glow Accent Light */}
      <pointLight position={[-2, 1, 0]} color={CIRCUIT_PALETTE.electronAmber} intensity={2.0} distance={8} />
    </>
  );
};
