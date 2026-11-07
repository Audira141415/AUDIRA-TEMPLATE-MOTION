import * as THREE from "three";
import { SKETCH_PALETTE as P } from "./palette";
import { rng } from "../core/motion";

const canvasTex = (w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

/** Sketchbook page: cream tooth, faint smudges, a margin rule and a few erased ghost lines. */
export const makeSketchPaper = () =>
  canvasTex(1024, 1365, (ctx) => {
    const r = rng(63);
    ctx.fillStyle = P.paper;
    ctx.fillRect(0, 0, 1024, 1365);
    for (let i = 0; i < 14000; i++) {
      ctx.fillStyle = r() > 0.5 ? "rgba(255,255,255,0.25)" : "rgba(120,110,95,0.07)";
      ctx.fillRect(r() * 1024, r() * 1365, 1 + r() * 1.5, 1 + r() * 1.5);
    }
    // graphite smudges from the side of the hand
    for (let i = 0; i < 5; i++) {
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 90 + r() * 80);
      g.addColorStop(0, "rgba(60,60,66,0.08)");
      g.addColorStop(1, "rgba(60,60,66,0)");
      ctx.save();
      ctx.translate(r() * 1024, r() * 1365);
      ctx.scale(1.8, 0.7);
      ctx.fillStyle = g;
      ctx.fillRect(-200, -200, 400, 400);
      ctx.restore();
    }
    // erased ghost lines
    ctx.strokeStyle = "rgba(70,70,76,0.07)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      const x = r() * 1024, y = r() * 1365;
      ctx.moveTo(x, y);
      ctx.lineTo(x + (r() - 0.5) * 500, y + (r() - 0.5) * 300);
      ctx.stroke();
    }
    // page notes in pencil
    ctx.fillStyle = "rgba(47,48,52,0.55)";
    ctx.font = "italic 30px 'Segoe Print', 'Comic Sans MS', cursive";
    ctx.fillText("little house — study no. 63", 70, 1270);
    ctx.font = "italic 24px 'Segoe Print', 'Comic Sans MS', cursive";
    ctx.fillText("roof pitch ~35°, chimney left of ridge", 70, 1310);
  });

/** Smooth graphite-ish desk with subtle brushed streaks. */
export const makeDeskTexture = () =>
  canvasTex(1024, 1024, (ctx) => {
    const r = rng(7);
    ctx.fillStyle = P.desk;
    ctx.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 1600; i++) {
      ctx.strokeStyle = `rgba(${r() > 0.5 ? "255,255,255" : "0,0,0"},${0.02 + r() * 0.03})`;
      ctx.beginPath();
      const y = r() * 1024;
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y + (r() - 0.5) * 8);
      ctx.stroke();
    }
  });

/** Hatching pattern used as a roughness/bump-less "pencil shading" map on the clay stage. */
export const makeHatchTexture = () =>
  canvasTex(256, 256, (ctx) => {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = "rgba(47,48,52,0.13)";
    ctx.lineWidth = 2;
    for (let i = -256; i < 512; i += 10) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 256, 256);
      ctx.stroke();
    }
  });

export const lerpColor = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), k);
