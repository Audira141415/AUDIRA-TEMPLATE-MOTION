import React from "react";
import { computeVisualInvestigationState } from "../core/motion";
import { VISUALINVESTIGATION_PALETTE } from "../lib/palette";

export const CourtroomEvidenceBoard3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeVisualInvestigationState(f);
  return (
    <group position={[0.92, 0.22, 0]} rotation={[-0.35, -0.15, 0]}>
      {/* Scanned Archival Court Dossier Sheet */}
      <mesh>
        <boxGeometry args={[1.95, 2.45, 0.04]} />
        <meshStandardMaterial color={VISUALINVESTIGATION_PALETTE.archivalPaper} roughness={0.95} />
      </mesh>

      {/* Simulated Printed Document Paragraph Bars */}
      {[0.75, 0.48, 0.22, -0.08, -0.35, -0.62].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0.025]}>
          <boxGeometry args={[1.55, 0.09, 0.01]} />
          <meshBasicMaterial color={VISUALINVESTIGATION_PALETTE.inkBlack} />
        </mesh>
      ))}

      {/* Animated Forensic Red Highlighter Wipe Over Key Evidence Clause */}
      <mesh position={[-0.78 + state.highlightWidth / 2, 0.22, 0.032]}>
        <boxGeometry args={[state.highlightWidth, 0.18, 0.012]} />
        <meshStandardMaterial
          color={VISUALINVESTIGATION_PALETTE.evidenceRed}
          emissive={VISUALINVESTIGATION_PALETTE.evidenceRed}
          emissiveIntensity={0.35}
          transparent
          opacity={0.78}
        />
      </mesh>
    </group>
  );
};