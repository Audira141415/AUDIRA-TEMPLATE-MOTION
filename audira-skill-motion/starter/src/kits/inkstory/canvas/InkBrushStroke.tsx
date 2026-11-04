// INKSTORY Ink Brush Stroke — Dynamic sweeping calligraphic stroke in 3D space with write-on progression.

import React, { useMemo } from "react";
import { INK_PALETTE } from "../lib/palette";
import { clamp, remap, ease } from "../core/motion";

interface InkBrushStrokeProps {
  f: number;
  startFrame?: number;
  endFrame?: number;
}

export const InkBrushStroke: React.FC<InkBrushStrokeProps> = ({
  f,
  startFrame = 30,
  endFrame = 160,
}) => {
  const progress = clamp(remap(f, startFrame, endFrame, 0, 1), 0, 1);
  const strokeSegments = 28;
  const visibleSegments = Math.floor(progress * strokeSegments);

  // Generate an elegant S-curve brush stroke path
  const points = useMemo(() => {
    const list = [];
    for (let i = 0; i <= strokeSegments; i++) {
      const t = i / strokeSegments;
      const x = (t - 0.5) * 5.4;
      const y = Math.sin(t * Math.PI) * 1.8 - 0.2;
      const z = Math.cos(t * Math.PI * 1.5) * 0.4;
      // Brush pressure thickness: thin entry, heavy belly, tapering finish
      const thickness = 0.08 + ease.brushStroke(t) * 0.22;
      list.push({ t, x, y, z, thickness });
    }
    return list;
  }, []);

  return (
    <group>
      {points.slice(0, visibleSegments).map((pt, idx) => (
        <mesh key={idx} position={[pt.x, pt.y, pt.z]} rotation={[0, 0, pt.t * 0.4]}>
          <cylinderGeometry args={[pt.thickness, pt.thickness * 0.9, 0.25, 16]} />
          <meshStandardMaterial
            color={INK_PALETTE.pineSootBlack}
            roughness={0.9}
            metalness={0.05}
          />
        </mesh>
      ))}
    </group>
  );
};
