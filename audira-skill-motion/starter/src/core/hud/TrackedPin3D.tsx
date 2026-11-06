/**
 * 3D World-Space Tracking Callout Pin & Telemetry Anchor.
 *
 * Renders an interactive 3D callout pin directly in world space:
 * - Emissive pulse ring at the target coordinates [x, y, z].
 * - Angled 3D leader line connecting target to the data card.
 * - Billboarded glassmorphism data card that auto-orients to camera.
 *
 * Authored by: AUDIRA (Agus Dwi R)
 */

import React, { useMemo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

export interface TrackedPinProps {
  /** 3D World coordinates of the component being inspected */
  anchor: [number, number, number];
  /** Offset of the data card relative to anchor [dx, dy, dz] */
  cardOffset?: [number, number, number];
  /** Main category / badge kicker */
  kicker?: string;
  /** Primary label text */
  title: string;
  /** Telemetry metric or specification value */
  value?: string;
  /** Theme accent color (hex) */
  accentColor?: string;
  /** Current animation frame for pulsing effects */
  f?: number;
  /** Global scale factor (default: 1.0) */
  scale?: number;
}

export const TrackedPin3D: React.FC<TrackedPinProps> = ({
  anchor,
  cardOffset = [0.6, 0.7, 0],
  kicker = "TELEMETRY",
  title,
  value,
  accentColor = "#00F0FF",
  f = 0,
  scale = 1.0,
}) => {
  const { camera } = useThree();

  // Target anchor point
  const target = useMemo(() => new THREE.Vector3(...anchor), [anchor]);
  // Card anchor point
  const cardPos = useMemo(
    () => new THREE.Vector3(anchor[0] + cardOffset[0], anchor[1] + cardOffset[1], anchor[2] + cardOffset[2]),
    [anchor, cardOffset]
  );
  // Intermediate elbow point for the angled leader line
  const elbowPos = useMemo(
    () => new THREE.Vector3(target.x, cardPos.y, target.z),
    [target, cardPos]
  );

  // Line geometry for the angled leader line: target -> elbow -> card
  const linePoints = useMemo(() => {
    return [target, elbowPos, cardPos];
  }, [target, elbowPos, cardPos]);

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(linePoints);
    return geo;
  }, [linePoints]);

  // Card texture generated dynamically on canvas
  const cardTexture = useMemo(() => {
    if (typeof document === "undefined") return new THREE.Texture();
    const cv = document.createElement("canvas");
    cv.width = 512;
    cv.height = 256;
    const ctx = cv.getContext("2d");
    if (!ctx) return new THREE.Texture();

    // Semi-transparent dark glass background
    ctx.fillStyle = "rgba(10, 14, 22, 0.92)";
    ctx.roundRect(8, 8, 496, 240, 16);
    ctx.fill();

    // Accent left indicator bar
    ctx.fillStyle = accentColor;
    ctx.roundRect(8, 8, 12, 240, [16, 0, 0, 16]);
    ctx.fill();

    // Glowing border stroke
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3;
    ctx.roundRect(8, 8, 496, 240, 16);
    ctx.stroke();

    // Kicker Text
    ctx.fillStyle = accentColor;
    ctx.font = "bold 20px monospace";
    ctx.fillText(kicker.toUpperCase(), 36, 48);

    // Title Text
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText(title, 36, 96);

    // Value / Metric Text if provided
    if (value) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.fillRect(36, 118, 440, 2);

      ctx.fillStyle = "#00FFC8";
      ctx.font = "bold 42px monospace";
      ctx.fillText(value, 36, 180);
    }

    const tex = new THREE.CanvasTexture(cv);
    tex.needsUpdate = true;
    return tex;
  }, [kicker, title, value, accentColor]);

  // Pulse animation calculations
  const pulseScale = 1.0 + (Math.sin(f * 0.1) * 0.5 + 0.5) * 0.4;
  const pulseOpacity = 0.8 - (Math.sin(f * 0.1) * 0.5 + 0.5) * 0.5;

  return (
    <group scale={[scale, scale, scale]}>
      {/* 1. Anchor Spot & Radar Pulse Ring */}
      <mesh position={anchor}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>

      {/* Expanding Ripple Ring */}
      <mesh position={anchor} scale={[pulseScale, pulseScale, pulseScale]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.08, 0.008, 8, 24]} />
        <meshBasicMaterial color={accentColor} transparent opacity={pulseOpacity} />
      </mesh>

      {/* 2. Angled Leader Line */}
      <primitive
        object={
          new THREE.Line(
            lineGeometry,
            new THREE.LineBasicMaterial({
              color: accentColor,
              transparent: true,
              opacity: 0.7,
              linewidth: 2,
            })
          )
        }
      />

      {/* 3. Billboarded Data Card */}
      <group position={[cardPos.x, cardPos.y, cardPos.z]}>
        <mesh quaternion={camera.quaternion}>
          <planeGeometry args={[1.2, 0.6]} />
          <meshBasicMaterial map={cardTexture} transparent depthTest={false} />
        </mesh>
      </group>
    </group>
  );
};

