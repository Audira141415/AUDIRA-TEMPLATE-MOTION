import * as THREE from "three";
import { mulberry32 } from "../core/motion";
import { UKIYO_PALETTE as P } from "./palette";

// Every print element is drawn procedurally on canvas: flat colour fields, bokashi gradients,
// carved key-lines and washi fibre grain. The composition is original (wave from the right,
// twin-peak mountain, rising sun, two boats) and does not copy any historical print.

type Ctx = CanvasRenderingContext2D;
const canvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
};
const toTex = (c: HTMLCanvasElement) => {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

/** Washi fibres + slight woodgrain mottling, applied on top of any fill (keeps alpha). */
const washiGrain = (g: Ctx, w: number, h: number, seed: number, strength = 1) => {
  const rnd = mulberry32(seed);
  g.save();
  g.globalCompositeOperation = "source-atop";
  for (let i = 0; i < (w * h) / 900; i++) {
    g.strokeStyle = `rgba(255,250,235,${0.06 * strength})`;
    g.lineWidth = 0.6 + rnd();
    const x = rnd() * w;
    const y = rnd() * h;
    g.beginPath();
    g.moveTo(x, y);
    g.quadraticCurveTo(x + (rnd() - 0.5) * 30, y + (rnd() - 0.5) * 30, x + (rnd() - 0.5) * 50, y + (rnd() - 0.5) * 50);
    g.stroke();
  }
  // woodblock grain: faint horizontal streaks from the carved block
  for (let y = 0; y < h; y += 3) {
    g.fillStyle = `rgba(20,20,40,${0.025 * strength * rnd()})`;
    g.fillRect(0, y, w, 1);
  }
  g.restore();
};

export const makeSkyTexture = () => {
  const c = canvas(512, 1024);
  const g = c.getContext("2d")!;
  // bokashi: Prussian blue fades into ochre dawn near the horizon
  const grd = g.createLinearGradient(0, 0, 0, 1024);
  grd.addColorStop(0, P.prussianDeep);
  grd.addColorStop(0.18, P.prussian);
  grd.addColorStop(0.5, P.indigoWash);
  grd.addColorStop(0.72, P.ochrePale);
  grd.addColorStop(1, "#F2C98A");
  g.fillStyle = grd;
  g.fillRect(0, 0, 512, 1024);
  washiGrain(g, 512, 1024, 3, 1.4);
  return toTex(c);
};

export const makeSunTexture = () => {
  const c = canvas(256, 256);
  const g = c.getContext("2d")!;
  g.fillStyle = P.vermilion;
  g.beginPath();
  g.arc(128, 128, 118, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "#A8301C";
  g.lineWidth = 6;
  g.stroke();
  washiGrain(g, 256, 256, 9, 1.2);
  return toTex(c);
};

/** Long stylised cloud ribbon with rounded scalloped ends and a key-line. */
export const makeCloudTexture = (seed: number) => {
  const c = canvas(1024, 160);
  const g = c.getContext("2d")!;
  const rnd = mulberry32(seed);
  g.beginPath();
  g.moveTo(60, 110);
  for (let x = 60; x <= 964; x += 70) g.quadraticCurveTo(x + 35, 40 - rnd() * 20, x + 70, 80 + rnd() * 10);
  g.quadraticCurveTo(1010, 100, 964, 128);
  g.lineTo(60, 128);
  g.quadraticCurveTo(14, 118, 60, 110);
  g.fillStyle = P.ochrePale;
  g.fill();
  g.strokeStyle = P.keyLine;
  g.lineWidth = 3;
  g.stroke();
  washiGrain(g, 1024, 160, seed + 4);
  return toTex(c);
};

/** Original twin-peak mountain with a dripping snow cap and dawn bokashi. */
export const makeMountainTexture = () => {
  const c = canvas(1024, 1024);
  const g = c.getContext("2d")!;
  g.beginPath();
  g.moveTo(0, 1024);
  g.lineTo(0, 860);
  g.quadraticCurveTo(220, 700, 380, 300);
  g.lineTo(440, 250);
  g.lineTo(500, 330);
  g.lineTo(560, 380);
  g.lineTo(640, 220);
  g.lineTo(700, 200);
  g.quadraticCurveTo(820, 620, 1024, 820);
  g.lineTo(1024, 1024);
  g.closePath();
  const grd = g.createLinearGradient(0, 200, 0, 1024);
  grd.addColorStop(0, "#A8442C");
  grd.addColorStop(0.4, "#5C4A6A");
  grd.addColorStop(1, P.prussianDeep);
  g.fillStyle = grd;
  g.fill();
  g.strokeStyle = P.keyLine;
  g.lineWidth = 5;
  g.stroke();
  // snow caps with drips
  g.save();
  g.clip();
  g.fillStyle = P.foam;
  g.beginPath();
  g.moveTo(330, 360);
  g.lineTo(440, 230);
  g.lineTo(560, 360);
  g.lineTo(640, 200);
  g.lineTo(760, 360);
  for (let x = 760; x >= 330; x -= 36) g.lineTo(x - 18, 360 + ((x / 36) % 2 ? 70 : 20));
  g.closePath();
  g.fill();
  g.strokeStyle = P.keyLine;
  g.lineWidth = 3;
  g.stroke();
  // ridge strokes
  g.strokeStyle = "rgba(15,39,71,0.6)";
  g.lineWidth = 4;
  for (let i = 0; i < 9; i++) {
    g.beginPath();
    g.moveTo(420 + i * 30, 430 + (i % 3) * 20);
    g.quadraticCurveTo(380 + i * 40, 650, 300 + i * 60, 900);
    g.stroke();
  }
  g.restore();
  washiGrain(g, 1024, 1024, 21);
  return toTex(c);
};

/** Small foam claw: a white finger curling at its tip. */
const claw = (g: Ctx, x: number, y: number, size: number, dir: number) => {
  g.save();
  g.translate(x, y);
  g.scale(dir, 1);
  g.fillStyle = P.foam;
  g.strokeStyle = P.keyLine;
  g.lineWidth = Math.max(1.5, size * 0.12);
  g.beginPath();
  g.moveTo(0, 0);
  g.quadraticCurveTo(size * 0.9, size * 0.1, size * 1.1, size * 0.9);
  g.quadraticCurveTo(size * 0.8, size * 1.25, size * 0.55, size * 0.95);
  g.quadraticCurveTo(size * 0.75, size * 0.7, size * 0.6, size * 0.45);
  g.quadraticCurveTo(size * 0.3, size * 0.35, 0, size * 0.5);
  g.closePath();
  g.fill();
  g.stroke();
  g.restore();
};

/** A row of rolling waves for a mid layer. Crests near the top, body fills down. */
export const makeWaveRowTexture = (seed: number, crests: number, amp: number) => {
  const W = 1024;
  const H = 384;
  const c = canvas(W, H);
  const g = c.getContext("2d")!;
  const rnd = mulberry32(seed);
  const y0 = 150;
  const curve = (dy: number) => {
    const pts: [number, number][] = [];
    for (let x = 0; x <= W; x += 4) {
      const u = (x / W) * crests + seed * 0.37;
      const fr = u - Math.floor(u);
      const hump = Math.pow(Math.sin(Math.PI * Math.pow(fr, 0.7)), 1.6);
      pts.push([x, y0 + dy - hump * amp]);
    }
    return pts;
  };
  const top = curve(0);
  g.beginPath();
  g.moveTo(0, H);
  top.forEach(([x, y]) => g.lineTo(x, y));
  g.lineTo(W, H);
  g.closePath();
  const grd = g.createLinearGradient(0, y0 - amp, 0, H);
  grd.addColorStop(0, P.prussian);
  grd.addColorStop(1, P.prussianDeep);
  g.fillStyle = grd;
  g.fill();
  // carved inner stripes following the crest line
  g.save();
  g.clip();
  for (let k = 1; k <= 6; k++) {
    g.strokeStyle = k % 2 ? P.prussianLight : "rgba(157,181,204,0.6)";
    g.lineWidth = 3;
    g.beginPath();
    curve(k * 22).forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
    g.stroke();
  }
  g.restore();
  // key-line
  g.strokeStyle = P.keyLine;
  g.lineWidth = 4;
  g.beginPath();
  top.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
  g.stroke();
  // foam caps + claws on each crest
  for (let i = 0; i < crests + 1; i++) {
    const cx = ((i - (seed * 0.37) % 1) / crests) * W + (W / crests) * 0.62;
    if (cx < 10 || cx > W - 10) continue;
    const cy = y0 - amp * 0.95;
    for (let k = 0; k < 5; k++) claw(g, cx - 30 + k * 16 + rnd() * 4, cy + k * 6 + rnd() * 6, 14 + rnd() * 6, -1);
  }
  washiGrain(g, W, H, seed + 7);
  return toTex(c);
};

/** The towering foreground crest, rising from the right and curling left. 1024x2048. */
export const makeGreatCurlTexture = () => {
  const c = canvas(1024, 2048);
  const g = c.getContext("2d")!;
  const rnd = mulberry32(57);
  g.beginPath();
  g.moveTo(1024, 2048);
  g.lineTo(1024, 760);
  g.bezierCurveTo(960, 520, 700, 330, 440, 380);
  g.bezierCurveTo(300, 410, 230, 520, 290, 600);
  g.bezierCurveTo(340, 660, 430, 640, 450, 590);
  g.bezierCurveTo(560, 620, 640, 760, 620, 1000);
  g.bezierCurveTo(600, 1400, 520, 1700, 380, 2048);
  g.closePath();
  const grd = g.createLinearGradient(1024, 400, 400, 1800);
  grd.addColorStop(0, P.prussian);
  grd.addColorStop(1, P.prussianDeep);
  g.fillStyle = grd;
  g.fill();
  g.save();
  g.clip();
  // inner carved stripes following the wave face
  for (let k = 0; k < 14; k++) {
    g.strokeStyle = k % 2 ? P.prussianLight : "rgba(157,181,204,0.55)";
    g.lineWidth = 6;
    g.beginPath();
    g.moveTo(1024, 820 + k * 60);
    g.bezierCurveTo(900 - k * 6, 640 + k * 50, 720 + k * 10, 600 + k * 40, 600 + k * 30, 900 + k * 55);
    g.stroke();
  }
  g.restore();
  g.strokeStyle = P.keyLine;
  g.lineWidth = 7;
  g.stroke();
  // foam band along the outer crest
  g.fillStyle = P.foam;
  g.beginPath();
  g.moveTo(1024, 760);
  g.bezierCurveTo(960, 520, 700, 330, 440, 380);
  g.bezierCurveTo(330, 400, 270, 480, 300, 560);
  g.bezierCurveTo(360, 470, 520, 440, 640, 470);
  g.bezierCurveTo(820, 520, 960, 650, 1024, 840);
  g.closePath();
  g.fill();
  g.strokeStyle = P.keyLine;
  g.lineWidth = 4;
  g.stroke();
  // claw fingers hanging from the lip, reaching left/down
  for (let i = 0; i < 26; i++) {
    const u = i / 25;
    const x = 300 + u * 620 + rnd() * 10;
    const y = 470 + Math.sin(u * Math.PI) * -60 + u * u * 220 + rnd() * 10;
    claw(g, x, y, 26 + rnd() * 16 - u * 10, -1);
  }
  for (let i = 0; i < 10; i++) claw(g, 260 + rnd() * 60, 540 + i * 18, 22 + rnd() * 10, -1);
  // spray dots above the crest
  g.fillStyle = P.foam;
  g.strokeStyle = P.keyLine;
  g.lineWidth = 2;
  for (let i = 0; i < 60; i++) {
    const x = 260 + rnd() * 700;
    const y = 220 + rnd() * 220 - (x - 260) * 0.05;
    const r = 4 + rnd() * 9;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
    g.stroke();
  }
  washiGrain(g, 1024, 2048, 33);
  return toTex(c);
};

/** Long rowing boat (oshiokuri-style hull, generic) with crouched rowers. */
export const makeBoatTexture = (seed: number) => {
  const c = canvas(512, 160);
  const g = c.getContext("2d")!;
  const rnd = mulberry32(seed);
  // rowers: hunched rounded backs + straw hats
  for (let i = 0; i < 7; i++) {
    const x = 90 + i * 48 + rnd() * 6;
    g.fillStyle = P.prussianDeep;
    g.beginPath();
    g.ellipse(x, 92, 15, 18, 0, Math.PI, 0);
    g.fill();
    g.fillStyle = P.ochre;
    g.beginPath();
    g.ellipse(x, 74, 13, 6, 0, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = P.keyLine;
    g.lineWidth = 2;
    g.stroke();
  }
  g.beginPath();
  g.moveTo(10, 70);
  g.quadraticCurveTo(60, 100, 120, 100);
  g.lineTo(440, 100);
  g.quadraticCurveTo(490, 98, 505, 82);
  g.quadraticCurveTo(470, 128, 420, 132);
  g.lineTo(110, 132);
  g.quadraticCurveTo(40, 120, 10, 70);
  g.fillStyle = "#E8C890";
  g.fill();
  g.strokeStyle = P.keyLine;
  g.lineWidth = 3;
  g.stroke();
  g.fillStyle = "#B88A4A";
  g.fillRect(110, 104, 320, 6);
  washiGrain(g, 512, 160, seed);
  return toTex(c);
};

/** Cartouche: cream title box with vermilion border and vertical pseudo-script (not real text). */
export const makeCartoucheTexture = () => {
  const c = canvas(256, 640);
  const g = c.getContext("2d")!;
  const rnd = mulberry32(88);
  g.fillStyle = P.washi;
  g.fillRect(0, 0, 256, 640);
  g.strokeStyle = P.vermilion;
  g.lineWidth = 10;
  g.strokeRect(10, 10, 236, 620);
  g.lineWidth = 3;
  g.strokeRect(24, 24, 208, 592);
  g.strokeStyle = P.keyLine;
  g.lineCap = "round";
  for (let col = 0; col < 2; col++) {
    let y = 54;
    const x = 160 - col * 70;
    while (y < 560) {
      const h = 22 + rnd() * 24;
      g.lineWidth = 5 + rnd() * 4;
      g.beginPath();
      g.moveTo(x - 12 + rnd() * 6, y);
      g.lineTo(x + 12 - rnd() * 6, y + rnd() * 6);
      g.moveTo(x + (rnd() - 0.5) * 8, y - 4);
      g.quadraticCurveTo(x + (rnd() - 0.5) * 20, y + h * 0.5, x + (rnd() - 0.5) * 14, y + h);
      if (rnd() < 0.6) {
        g.moveTo(x - 10, y + h * 0.6);
        g.lineTo(x + 10, y + h * 0.4);
      }
      g.stroke();
      y += h + 14;
    }
  }
  washiGrain(g, 256, 640, 89);
  return toTex(c);
};

/** Red artist-seal with carved pseudo-glyph (not real characters). */
export const makeSealTexture = () => {
  const c = canvas(128, 128);
  const g = c.getContext("2d")!;
  const rnd = mulberry32(5);
  g.fillStyle = P.vermilion;
  g.fillRect(6, 6, 116, 116);
  g.strokeStyle = P.washi;
  g.lineWidth = 7;
  g.lineCap = "square";
  for (let i = 0; i < 6; i++) {
    g.beginPath();
    const x = 22 + rnd() * 80;
    const y = 22 + rnd() * 80;
    g.moveTo(x, y);
    g.lineTo(rnd() < 0.5 ? x : 22 + rnd() * 84, rnd() < 0.5 ? y : 22 + rnd() * 84);
    g.stroke();
  }
  g.strokeRect(14, 14, 100, 100);
  return toTex(c);
};

export const makeDotTexture = () => {
  const c = canvas(64, 64);
  const g = c.getContext("2d")!;
  g.fillStyle = P.foam;
  g.strokeStyle = P.keyLine;
  g.lineWidth = 4;
  g.beginPath();
  g.arc(32, 32, 26, 0, Math.PI * 2);
  g.fill();
  g.stroke();
  return toTex(c);
};

export const makeBirdTexture = () => {
  const c = canvas(128, 64);
  const g = c.getContext("2d")!;
  g.strokeStyle = P.keyLine;
  g.lineWidth = 6;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(8, 20);
  g.quadraticCurveTo(40, 8, 64, 40);
  g.quadraticCurveTo(88, 8, 120, 20);
  g.stroke();
  return toTex(c);
};

/** Paper print layer material: matte washi, cut-out alpha, casts/receives paper shadows. */
export const paperMaterial = (map: THREE.Texture) =>
  new THREE.MeshStandardMaterial({ map, roughness: 0.96, metalness: 0, alphaTest: 0.5, side: THREE.DoubleSide });
