/**
 * 3D World-Space Tracking Callout Pin & Telemetry Anchor.
 *
 * Authored by: AUDIRA (Agus Dwi R)
 */

import React, { useMemo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

export interface TrackedPinProps {
  anchor: [number, number, number];
  cardOffset?: [number, number, number];
  kicker?: string;
  title: string;
  value?: string;
  accentColor?: string;
  f?: number;
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

  const target = useMemo(() => new THREE.Vector3(...anchor), [anchor]);
  const cardPos = useMemo(
    () => new THREE.Vector3(anchor[0] + cardOffset[0], anchor[1] + cardOffset[1], anchor[2] + cardOffset[2]),
    [anchor, cardOffset]
  );
  const elbowPos = useMemo(
    () => new THREE.Vector3(target.x, cardPos.y, target.z),
    [target, cardPos]
  );

  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints([target, elbowPos, cardPos]);
  }, [target, elbowPos, cardPos]);

  const cardTexture = useMemo(() => {
    if (typeof document === "undefined") return new THREE.Texture();
    const cv = document.createElement("canvas");
    cv.width = 512;
    cv.height = 256;
    const ctx = cv.getContext("2d");
    if (!ctx) return new THREE.Texture();

    ctx.fillStyle = "rgba(10, 14, 22, 0.92)";
    ctx.roundRect(8, 8, 496, 240, 16);
    ctx.fill();

    ctx.fillStyle = accentColor;
    ctx.roundRect(8, 8, 12, 240, [16, 0, 0, 16]);
    ctx.fill();

    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3;
    ctx.roundRect(8, 8, 496, 240, 16);
    ctx.stroke();

    ctx.fillStyle = accentColor;
    ctx.font = "bold 20px monospace";
    ctx.fillText(kicker.toUpperCase(), 36, 48);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText(title, 36, 96);

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

  const pulseScale = 1.0 + (Math.sin(f * 0.1) * 0.5 + 0.5) * 0.4;
  const pulseOpacity = 0.8 - (Math.sin(f * 0.1) * 0.5 + 0.5) * 0.5;

  return (
    <group scale={[scale, scale, scale]}>
      <mesh position={anchor}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>

      <mesh position={anchor} scale={[pulseScale, pulseScale, pulseScale]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.08, 0.008, 8, 24]} />
        <meshBasicMaterial color={accentColor} transparent opacity={pulseOpacity} />
      </mesh>

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

      <group position={[cardPos.x, cardPos.y, cardPos.z]}>
        <mesh quaternion={camera.quaternion}>
          <planeGeometry args={[1.2, 0.6]} />
          <meshBasicMaterial map={cardTexture} transparent depthTest={false} />
        </mesh>
      </group>
    </group>
  );
};

