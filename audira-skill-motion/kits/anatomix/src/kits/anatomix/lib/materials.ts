// ANATOMIX materials — clinical, non-gory surfaces: glossy translucent myocardium, glass vessels, hologram textures.
import * as THREE from "three";
import { ANATOMY_PALETTE as P } from "./palette";

/** Myocardium wall: glossy, wet-looking but clean; opacity driven per frame. */
export const makeWallMaterial = () =>
  new THREE.MeshPhysicalMaterial({
    color: P.tissue,
    roughness: 0.36,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.18,
    sheen: 0.6,
    sheenColor: new THREE.Color("#FFB3BE"),
    transparent: true,
    side: THREE.FrontSide,
  });

/** Vessel wall: translucent glass-like tube so the flow inside stays visible. */
export const makeVesselMaterial = (color: string, opacity = 0.5) =>
  new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.25,
    clearcoat: 1,
    transparent: true,
    opacity,
    depthWrite: false,
    emissive: color,
    emissiveIntensity: 0.12,
  });

const canvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
};

/** Imaging-suite backdrop: deep teal with a soft central bloom and faint scan lines (inside of a sphere). */
export const makeBackdropTexture = () => {
  const [c, g] = canvas(1024, 512);
  const grd = g.createRadialGradient(512, 256, 10, 512, 256, 520);
  grd.addColorStop(0, P.voidGlow);
  grd.addColorStop(0.55, "#06222A");
  grd.addColorStop(1, P.void);
  g.fillStyle = grd;
  g.fillRect(0, 0, 1024, 512);
  g.fillStyle = "rgba(63,224,208,0.035)";
  for (let y = 0; y < 512; y += 4) g.fillRect(0, y, 1024, 1);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

/** Projector floor: concentric rings + radial ticks, additive. */
export const makeProjectorTexture = () => {
  const [c, g] = canvas(512, 512);
  g.clearRect(0, 0, 512, 512);
  g.translate(256, 256);
  for (let r = 40; r < 250; r += 26) {
    g.strokeStyle = `rgba(159,245,236,${0.12 + (r % 52 === 40 ? 0.25 : 0.1)})`;
    g.lineWidth = r % 52 === 40 ? 3 : 1.5;
    g.beginPath();
    g.arc(0, 0, r, 0, Math.PI * 2);
    g.stroke();
  }
  for (let a = 0; a < 72; a++) {
    const ang = (a / 72) * Math.PI * 2;
    const l = a % 6 === 0 ? 26 : 12;
    g.strokeStyle = "rgba(159,245,236,0.45)";
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(Math.cos(ang) * (248 - l), Math.sin(ang) * (248 - l));
    g.lineTo(Math.cos(ang) * 248, Math.sin(ang) * 248);
    g.stroke();
  }
  return new THREE.CanvasTexture(c);
};

/** Soft radial glow. */
export const makeGlow = () => {
  const [c, g] = canvas(128, 128);
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.3, "rgba(255,255,255,0.35)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
};
