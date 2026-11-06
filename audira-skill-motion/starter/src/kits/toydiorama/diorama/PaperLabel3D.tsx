import React, { useMemo } from "react";
import * as THREE from "three";
import { TOYDIORAMA_PALETTE } from "../lib/palette";
import { computeToyDioramaState } from "../core/motion";

export const PaperLabel3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeToyDioramaState(f);

  // High-res canvas texture for the taped kraft paper label
  const paperTexture = useMemo(() => {
    if (typeof document === "undefined") return new THREE.Texture();
    const cv = document.createElement("canvas");
    cv.width = 512;
    cv.height = 360;
    const ctx = cv.getContext("2d");
    if (!ctx) return new THREE.Texture();

    // Paper card background
    ctx.fillStyle = TOYDIORAMA_PALETTE.paperCard;
    ctx.fillRect(0, 0, 512, 360);

    // Subtle paper grain border
    ctx.strokeStyle = "rgba(0,0,0,0.12)";
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, 496, 344);

    // Header Tag
    ctx.fillStyle = "#D95D39";
    ctx.font = "bold 20px monospace";
    ctx.fillText("DIORAMA EXHIBIT // 01", 32, 54);

    // Main Editorial Title
    ctx.fillStyle = TOYDIORAMA_PALETTE.paperText;
    ctx.font = "900 36px 'Helvetica Neue', Arial, sans-serif";
    ctx.fillText("MINIATURE STAGE", 32, 108);

    // Subtitle & Specs
    ctx.fillStyle = "#555D68";
    ctx.font = "bold 22px 'Helvetica Neue', Arial, sans-serif";
    ctx.fillText("PBR TOY CHARACTERS", 32, 144);

    // Body Annotation
    ctx.fillStyle = "#333A42";
    ctx.font = "18px 'Helvetica Neue', Arial, sans-serif";
    ctx.fillText("• Stylized Blocky Geometry", 32, 196);
    ctx.fillText("• Matte Plastic & Soft Clay", 32, 230);
    ctx.fillText("• Static Macro Theatrical Rig", 32, 264);

    // Footer Stamp
    ctx.fillStyle = "#888F98";
    ctx.font = "bold 16px monospace";
    ctx.fillText("AUDIRA MOTION © 2026", 32, 318);

    const tex = new THREE.CanvasTexture(cv);
    tex.needsUpdate = true;
    return tex;
  }, []);

  return (
    <group
      position={[-1.25, 1.45, -0.3]}
      rotation={[0.04, 0.14, state.labelSway - 0.05]}
    >
      {/* 1. Paper Card Mesh */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.35, 0.95, 0.02]} />
        <meshStandardMaterial
          color={TOYDIORAMA_PALETTE.paperCard}
          roughness={0.92}
          metalness={0.0}
        />
      </mesh>

      {/* Faceplate with Crisp Editorial Texture */}
      <mesh position={[0, 0, 0.012]}>
        <planeGeometry args={[1.34, 0.94]} />
        <meshBasicMaterial map={paperTexture} />
      </mesh>

      {/* 2. Semi-translucent Washi Tape Strip at top */}
      <mesh position={[0, 0.48, 0.022]} rotation={[0, 0, -0.04]}>
        <boxGeometry args={[0.55, 0.16, 0.005]} />
        <meshStandardMaterial
          color="#E6C875"
          transparent
          opacity={0.88}
          roughness={0.7}
        />
      </mesh>
    </group>
  );
};
