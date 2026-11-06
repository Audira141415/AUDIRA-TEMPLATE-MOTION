import React from "react";
import { BACKROOMS_PALETTE } from "../lib/palette";

export const LiminalMaze3D: React.FC<{ f: number }> = () => {
  const pillars = [-3.0, -1.0, 1.0, 3.0];
  return (
    <group>
      {/* Damp Ochre Institutional Carpet Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 16]} />
        <meshStandardMaterial color={BACKROOMS_PALETTE.carpetOchre} roughness={0.95} />
      </mesh>

      {/* Suspended Acoustic Ceiling Tile Grid */}
      <mesh position={[0, 2.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 16]} />
        <meshStandardMaterial color="#C8C2A8" roughness={0.9} />
      </mesh>

      {/* Repeating Modular Yellow Wallpaper Partition Walls */}
      {pillars.map((z, idx) => (
        <React.Fragment key={idx}>
          <mesh position={[-1.45, 1.35, z]}>
            <boxGeometry args={[0.45, 2.7, 1.1]} />
            <meshStandardMaterial color={BACKROOMS_PALETTE.wallpaperYellow} roughness={0.82} />
          </mesh>
          <mesh position={[1.45, 1.35, z - 0.5]}>
            <boxGeometry args={[0.45, 2.7, 1.1]} />
            <meshStandardMaterial color={BACKROOMS_PALETTE.wallpaperYellow} roughness={0.82} />
          </mesh>
        </React.Fragment>
      ))}

      {/* Far Back Partition Wall */}
      <mesh position={[0, 1.35, -5.5]}>
        <boxGeometry args={[6.0, 2.7, 0.3]} />
        <meshStandardMaterial color={BACKROOMS_PALETTE.wallpaperYellow} roughness={0.85} />
      </mesh>
    </group>
  );
};