/**
 * Procedural Micro-Roughness & Imperfection Texture Generator.
 *
 * Generates lightweight in-memory textures (micro-scratches, dust grain,
 * brushed metal grain) via HTML5 Canvas with zero external bitmap dependencies.
 * Adds tactile physical realism to PBR shaders.
 *
 * Authored by: AUDIRA (Agus Dwi R)
 */

import * as THREE from "three";

/**
 * Creates a seamless procedural micro-grain roughness map.
 * @param size Canvas resolution (default: 512x512)
 * @param intensity Noise grain contrast 0..1 (default: 0.15)
 */
export function createMicroRoughnessTexture(
  size: number = 512,
  intensity: number = 0.15
): THREE.CanvasTexture {
  if (typeof document === "undefined") {
    // Headless / SSR fallback
    return new THREE.CanvasTexture({} as HTMLCanvasElement);
  }

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (!ctx) return new THREE.CanvasTexture(canvas);

  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  // Generate multi-frequency value noise
  for (let i = 0; i < data.length; i += 4) {
    const rawVal = Math.random();
    const grain = Math.floor(128 + (rawVal - 0.5) * 255 * intensity);
    data[i] = grain;     // R
    data[i + 1] = grain; // G
    data[i + 2] = grain; // B
    data[i + 3] = 255;   // A
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Generates an anisotropic brushed-metal micro-streak texture.
 */
export function createBrushedMetalTexture(
  width: number = 512,
  height: number = 256
): THREE.CanvasTexture {
  if (typeof document === "undefined") {
    return new THREE.CanvasTexture({} as HTMLCanvasElement);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Fill neutral midtone gray
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, width, height);

  // Draw 800 subtle horizontal brushed micro-streaks
  for (let i = 0; i < 800; i++) {
    const y = Math.random() * height;
    const x = Math.random() * width;
    const length = 40 + Math.random() * 160;
    const opacity = 0.04 + Math.random() * 0.08;
    const isBright = Math.random() > 0.5;

    ctx.strokeStyle = isBright ? `rgba(255,255,255,${opacity})` : `rgba(0,0,0,${opacity})`;
    ctx.lineWidth = 1 + Math.random() * 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + length, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.needsUpdate = true;
  return texture;
}

