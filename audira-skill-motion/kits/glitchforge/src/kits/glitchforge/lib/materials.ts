import * as THREE from "three";
import { GLITCH_PALETTE as P } from "./palette";

// Full-frame corruption pass. Every effect is driven by uniforms set from the frame clock, and all
// randomness comes from hash(seed) where seed re-rolls at a stepped 12 Hz — fully deterministic.
export const GlitchShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uSeed: { value: 0 },
    uSplit: { value: 0 },
    uTear: { value: 0 },
    uBlock: { value: 0 },
    uMosh: { value: 0 },
    uSort: { value: 0 },
    uLost: { value: 0 },
    uRes: { value: new THREE.Vector2(1080, 1920) },
  },
  vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uSeed, uSplit, uTear, uBlock, uMosh, uSort, uLost;
    uniform vec2 uRes;
    varying vec2 vUv;
    float hash(vec2 p){ p = fract(p * vec2(234.34, 435.345)); p += dot(p, p + 34.23); return fract(p.x * p.y); }
    float luma(vec3 c){ return dot(c, vec3(0.299, 0.587, 0.114)); }
    void main(){
      vec2 uv = vUv;
      // 1. scanline tears: whole rows shear sideways
      float row = floor(uv.y * 64.0);
      if (hash(vec2(row, uSeed)) < uTear * 0.32) uv.x += (hash(vec2(row, uSeed + 1.7)) - 0.5) * 0.22 * uTear;
      // 2. macroblock displacement (8x14 grid)
      vec2 blk = floor(uv * vec2(8.0, 14.0));
      if (hash(blk + uSeed) < uBlock * 0.28) uv += (vec2(hash(blk + uSeed + 3.1), hash(blk + uSeed + 5.3)) - 0.5) * 0.16 * uBlock;
      // 3. datamosh: blocks drag pixels along a stale motion vector and lose resolution
      vec2 mb = floor(uv * vec2(12.0, 21.0));
      float mosh = step(hash(mb + floor(uSeed * 0.25)), uMosh * 0.55);
      if (mosh > 0.5) {
        vec2 dir = normalize(vec2(hash(mb + 11.0) - 0.5, hash(mb + 17.0) - 0.5) + 1e-4);
        uv -= dir * 0.09 * uMosh;
        vec2 q = vec2(72.0, 128.0);
        uv = (floor(uv * q) + 0.5) / q;
      }
      uv = clamp(uv, 0.001, 0.999);
      // 4. RGB channel split (horizontal + slight vertical on blue)
      float s = uSplit * 0.022;
      vec3 c;
      c.r = texture2D(tDiffuse, uv + vec2(s, 0.0)).r;
      c.g = texture2D(tDiffuse, uv).g;
      c.b = texture2D(tDiffuse, uv - vec2(s, s * 0.35)).b;
      // 5. pixel sorting: in some columns, bright pixels stream downward
      float col = floor(uv.x * uRes.x / 4.0);
      if (hash(vec2(col, floor(uSeed * 0.5))) < uSort * 0.45) {
        vec3 best = c; float bl = luma(c);
        for (int i = 1; i < 14; i++) {
          vec3 sc = texture2D(tDiffuse, uv + vec2(0.0, float(i) * 0.014 * uSort)).rgb;
          float l = luma(sc);
          if (l > bl && l > 0.55) { best = sc; bl = l; }
        }
        c = mix(c, best * vec3(1.05, 0.95, 1.1), 0.9);
      }
      // mosh blocks get a tinted, posterised cast
      if (mosh > 0.5) c = floor(c * 6.0) / 6.0 * mix(vec3(1.0), vec3(0.85, 1.1, 1.15), hash(mb));
      // 6. signal lost: colour bars + snow + a dead raster line
      if (uLost > 0.0) {
        float bar = floor(vUv.x * 7.0);
        vec3 bars[7];
        bars[0] = vec3(0.9); bars[1] = vec3(0.9, 0.9, 0.1); bars[2] = vec3(0.1, 0.9, 0.9); bars[3] = vec3(0.1, 0.9, 0.1);
        bars[4] = vec3(0.9, 0.1, 0.9); bars[5] = vec3(0.9, 0.1, 0.1); bars[6] = vec3(0.1, 0.1, 0.9);
        vec3 b = vec3(0.0);
        for (int i = 0; i < 7; i++) if (float(i) == bar) b = bars[i];
        float snow = hash(floor(vUv * uRes / 3.0) + uSeed * 7.0);
        vec3 lostC = vUv.y > 0.32 ? mix(b, vec3(snow), 0.35) : vec3(snow * 0.8);
        c = mix(c, lostC, uLost);
      }
      // faint broadcast scanlines whenever the feed is unstable
      float unstable = clamp(uSplit + uTear + uLost, 0.0, 1.0);
      c *= 1.0 - unstable * 0.12 * step(0.5, fract(vUv.y * uRes.y / 3.0));
      gl_FragColor = vec4(c, 1.0);
    }`,
};

export const makePearlMaterial = () =>
  new THREE.MeshPhysicalMaterial({
    color: P.pearl,
    roughness: 0.18,
    metalness: 0.0,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    iridescence: 0.6,
    iridescenceIOR: 1.35,
    sheen: 0.4,
    sheenColor: new THREE.Color("#CFE6FF"),
  });

export const makeChromeMaterial = () => new THREE.MeshStandardMaterial({ color: P.chrome, metalness: 1, roughness: 0.08 });

/** Simple studio environment: a soft gradient room baked into a PMREM env map for reflections. */
export const makeStudioEnv = (renderer: THREE.WebGLRenderer) => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#BFC3CC");
  const box = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshBasicMaterial({ color: "#9A9EA8", side: THREE.BackSide }));
  scene.add(box);
  const panel = (pos: [number, number, number], scale: [number, number], color: string) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }));
    m.position.set(...pos);
    m.scale.set(scale[0], scale[1], 1);
    m.lookAt(0, 0, 0);
    scene.add(m);
  };
  panel([0, 4.9, 0], [6, 6], "#FFFFFF"); // overhead softbox
  panel([4.9, 1, 1], [2.5, 6], "#FFFFFF"); // key strip
  panel([-4.9, 1, -1], [2, 5], P.cyan); // cyan rim strip
  panel([0, 0.5, -4.9], [3, 4], P.signalRed); // red kicker
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(scene, 0.02).texture;
  pmrem.dispose();
  return env;
};
