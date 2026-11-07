// TACTICBOARD materials — all procedural (CanvasTexture), no network assets.
import * as THREE from "three";
import { TACTIC_PALETTE as P } from "./palette";
import { prng, PITCH } from "../core/motion";

/** Painted surface = field of play + 0.18 run-off margin each side. */
export const PITCH_SURFACE = { w: PITCH.halfW * 2 + 0.36, l: PITCH.halfL * 2 + 0.36 } as const;

/** Pitch surface: 14 mowed stripes, seeded grass speckle, chalk markings painted on. */
export const makePitchTexture = () => {
  const W = 1024;
  const H = Math.round((W * PITCH_SURFACE.l) / PITCH_SURFACE.w);
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  const bands = 14;
  for (let i = 0; i < bands; i++) {
    g.fillStyle = i % 2 ? P.grassDark : P.grassLight;
    g.fillRect(0, (i * H) / bands, W, H / bands + 1);
  }
  // seeded blade speckle
  const r = prng(4242);
  for (let i = 0; i < 26000; i++) {
    const l = r() > 0.5;
    g.fillStyle = l ? "rgba(255,255,230,0.05)" : "rgba(0,30,0,0.07)";
    g.fillRect(r() * W, r() * H, 1 + r() * 2, 2 + r() * 3);
  }
  // chalk lines
  const u = W / PITCH_SURFACE.w; // px per world unit
  const m = 0.18 * u; // margin around the field of play
  g.strokeStyle = "rgba(244,246,238,0.92)";
  g.lineWidth = 0.035 * u;
  const fw = W - 2 * m;
  const fh = H - 2 * m;
  g.strokeRect(m, m, fw, fh);
  g.beginPath();
  g.moveTo(m, H / 2);
  g.lineTo(W - m, H / 2);
  g.stroke();
  g.beginPath();
  g.arc(W / 2, H / 2, 0.85 * u, 0, Math.PI * 2);
  g.stroke();
  g.fillStyle = "rgba(244,246,238,0.95)";
  g.beginPath();
  g.arc(W / 2, H / 2, 0.05 * u, 0, Math.PI * 2);
  g.fill();
  for (const top of [true, false]) {
    const y0 = top ? m : H - m;
    const dir = top ? 1 : -1;
    const box = (w: number, d: number) => g.strokeRect(W / 2 - (w * u) / 2, top ? y0 : y0 - d * u, w * u, d * u);
    box(3.9, 1.55);
    box(1.8, 0.55);
    g.beginPath();
    g.arc(W / 2, y0 + dir * 1.05 * u, 0.04 * u, 0, Math.PI * 2);
    g.fill();
    g.beginPath();
    g.arc(W / 2, y0 + dir * 1.05 * u, 0.85 * u, top ? 0.2 * Math.PI : 1.2 * Math.PI, top ? 0.8 * Math.PI : 1.8 * Math.PI);
    g.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
};

/** Top face of a player token: team disc, white ring, shirt number. */
export const makeTokenTexture = (team: 0 | 1, n: number) => {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  g.fillStyle = team === 0 ? P.home : P.away;
  g.fillRect(0, 0, 128, 128);
  g.strokeStyle = "rgba(255,255,255,0.9)";
  g.lineWidth = 7;
  g.beginPath();
  g.arc(64, 64, 52, 0, Math.PI * 2);
  g.stroke();
  g.fillStyle = "#FFFFFF";
  g.font = "bold 62px Arial, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(String(n), 64, 68);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

/** Goal-net mesh texture (alpha grid). */
export const makeNetTexture = () => {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  g.clearRect(0, 0, 64, 64);
  g.strokeStyle = "rgba(255,255,255,0.85)";
  g.lineWidth = 3;
  g.strokeRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(14, 4);
  return tex;
};

/** Soft radial glow sprite for floodlights / bokeh. */
export const makeGlowTexture = () => {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.25, "rgba(255,255,255,0.45)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
};
