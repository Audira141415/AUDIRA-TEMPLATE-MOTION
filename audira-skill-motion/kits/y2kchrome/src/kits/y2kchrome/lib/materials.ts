import * as THREE from "three";
import { Y2KCHROME_PALETTE as P } from "./palette";

// Procedural sky environment + chrome / bubble materials. Chrome only looks like chrome if it
// has something to reflect, so the env scene is a blue-white sky with bright softbox panels and
// thin pink / lime / cyan stripes that read as iridescent streaks on the metal.

const vertexGradientSphere = (radius: number, stops: [number, string][]) => {
  const geo = new THREE.SphereGeometry(radius, 48, 32);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const cols: number[] = [];
  const cs = stops.map(([k, c]) => [k, new THREE.Color(c)] as const);
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i) / radius; // -1..1
    let c = cs[0][1].clone();
    for (let s = 0; s < cs.length - 1; s++) {
      const [k0, c0] = cs[s];
      const [k1, c1] = cs[s + 1];
      if (y >= k0 && y <= k1) c = c0.clone().lerp(c1, (y - k0) / (k1 - k0));
    }
    if (y > cs[cs.length - 1][0]) c = cs[cs.length - 1][1].clone();
    cols.push(c.r, c.g, c.b);
  }
  geo.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
  return geo;
};

export const SKY_STOPS: [number, string][] = [
  [-1, P.skyLow],
  [-0.15, P.skyLow],
  [0.02, P.skyHorizon],
  [0.3, P.skyMid],
  [1, P.skyTop],
];

export const makeSkyGeometry = (radius: number) => vertexGradientSphere(radius, SKY_STOPS);

export const makeEnvScene = () => {
  const scene = new THREE.Scene();
  scene.add(new THREE.Mesh(makeSkyGeometry(20), new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })));
  const panel = (w: number, h: number, color: string, pos: [number, number, number], intensity = 1) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide }));
    m.position.set(...pos);
    m.lookAt(0, 0, 0);
    scene.add(m);
  };
  panel(10, 4, "#FFFFFF", [0, 14, 8], 3); // overhead softbox
  panel(4, 10, "#FFFFFF", [-14, 3, 4], 2.2); // left strip
  panel(3, 8, "#FFFFFF", [13, 2, -6], 1.8);
  panel(18, 0.5, P.iriPink, [0, 1, -16], 1.6); // iridescent streaks
  panel(18, 0.4, P.iriLime, [0, -2, 16], 1.4);
  panel(0.5, 14, P.iriCyan, [16, 0, 4], 1.6);
  return scene;
};

export const chromeMaterial = () =>
  new THREE.MeshPhysicalMaterial({ color: P.chrome, metalness: 1, roughness: 0.04, iridescence: 0.35, iridescenceIOR: 1.6, iridescenceThicknessRange: [200, 600] });

export const bubbleMaterial = () =>
  new THREE.MeshPhysicalMaterial({
    color: "#FFFFFF",
    metalness: 0,
    roughness: 0.02,
    transparent: true,
    opacity: 0.32,
    iridescence: 1,
    iridescenceIOR: 1.3,
    iridescenceThicknessRange: [180, 820],
    clearcoat: 1,
    depthWrite: false,
    envMapIntensity: 2.2,
  });

/** Four-point lens sparkle with a soft core (additive sprite). */
export const makeSparkleTexture = () => {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const core = g.createRadialGradient(128, 128, 0, 128, 128, 60);
  core.addColorStop(0, "rgba(255,255,255,1)");
  core.addColorStop(0.25, "rgba(220,245,255,0.6)");
  core.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = core;
  g.fillRect(0, 0, 256, 256);
  const ray = (horizontal: boolean) => {
    const grad = horizontal ? g.createLinearGradient(0, 128, 256, 128) : g.createLinearGradient(128, 0, 128, 256);
    grad.addColorStop(0, "rgba(255,255,255,0)");
    grad.addColorStop(0.5, "rgba(255,255,255,1)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    if (horizontal) g.fillRect(0, 124, 256, 8);
    else g.fillRect(124, 0, 8, 256);
  };
  ray(true);
  ray(false);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

/** Soft round glow (sun, flare core). */
export const makeGlowTexture = () => {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.3, "rgba(255,255,255,0.45)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};
