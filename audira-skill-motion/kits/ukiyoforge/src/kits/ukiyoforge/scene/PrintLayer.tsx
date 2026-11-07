import React, { useMemo } from "react";
import * as THREE from "three";
import { depthScale } from "../core/motion";
import { paperMaterial } from "../lib/materials";

export interface PrintLayerProps {
  tex: THREE.Texture;
  /** centre in print coordinates (u across, v up) */
  u: number;
  v: number;
  /** size in print units */
  w: number;
  h: number;
  /** depth of the paper sheet */
  z: number;
  rotZ?: number;
  /** extra offset in print units (animation) */
  du?: number;
  dv?: number;
  scaleMul?: number;
  castShadow?: boolean;
  receiveShadow?: boolean;
  renderOrder?: number;
}

/**
 * One cut-paper sheet of the woodblock composition. It is authored in print space and
 * re-projected to its depth so the stack lines up perfectly from the print camera.
 */
export const PrintLayer: React.FC<PrintLayerProps> = ({ tex, u, v, w, h, z, rotZ = 0, du = 0, dv = 0, scaleMul = 1, castShadow = true, receiveShadow = true, renderOrder }) => {
  const mat = useMemo(() => paperMaterial(tex), [tex]);
  const s = depthScale(z);
  return (
    <mesh
      position={[(u + du) * s, (v + dv) * s, z]}
      rotation={[0, 0, rotZ]}
      scale={[w * s * scaleMul, h * s * scaleMul, 1]}
      material={mat}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      renderOrder={renderOrder}
    >
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
};
