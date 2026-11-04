// PaperMaterial — the single material system every PAPERWORLD object is made of.
//
// Real cardstock reads through three things at once: low-frequency mottling (pulp density),
// fibres (short bright/dark hairs), and a cut edge that is paler than the dyed face. Here
// all three are procedural and seeded, so every render of every frame is identical.
//
// UVs are in scene units (ExtrudeGeometry's world UV generator uses shape coordinates), so
// the grain has the same physical scale on a door, a floor or a puppet's sleeve.

import {
  CanvasTexture,
  Color,
  DoubleSide,
  LinearMipmapLinearFilter,
  MeshStandardMaterial,
  NoColorSpace,
  RepeatWrapping,
  SRGBColorSpace,
  ShaderChunk,
  type Texture,
} from "three";
import { PAPER, PALETTE } from "../tokens.ts";

const SIZE = 1024;

const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** Tileable value noise sampled on the SIZE² grid (`cells` lattice cells per side). */
const tileNoise = (cells: number, rnd: () => number) => {
  const lattice = new Float32Array(cells * cells).map(() => rnd());
  const out = new Float32Array(SIZE * SIZE);
  const k = cells / SIZE;
  for (let y = 0; y < SIZE; y++) {
    const fy = y * k, y0 = Math.floor(fy), ty = fy - y0;
    const sy = ty * ty * (3 - 2 * ty);
    const r0 = (y0 % cells) * cells, r1 = ((y0 + 1) % cells) * cells;
    for (let x = 0; x < SIZE; x++) {
      const fx = x * k, x0 = Math.floor(fx), tx = fx - x0;
      const sx = tx * tx * (3 - 2 * tx);
      const c0 = x0 % cells, c1 = (x0 + 1) % cells;
      const a = lattice[r0 + c0] + (lattice[r0 + c1] - lattice[r0 + c0]) * sx;
      const b = lattice[r1 + c0] + (lattice[r1 + c1] - lattice[r1 + c0]) * sx;
      out[y * SIZE + x] = a + (b - a) * sy;
    }
  }
  return out;
};

type GrainMaps = { albedo: Texture; bump: Texture };
let maps: GrainMaps | null = null;

/** Draw the fibre layer: short curved hairs, wrapped so the tile repeats seamlessly. */
const fibres = (rnd: () => number) => {
  const c = document.createElement("canvas");
  c.width = c.height = SIZE;
  const g = c.getContext("2d")!;
  g.fillStyle = "rgb(128,128,128)";
  g.fillRect(0, 0, SIZE, SIZE);
  g.lineCap = "round";
  for (let i = 0; i < 5200; i++) {
    const x = rnd() * SIZE, y = rnd() * SIZE;
    const len = 6 + rnd() ** 2 * 46;
    const a = rnd() * Math.PI * 2;
    const bend = (rnd() - 0.5) * 0.9;
    const light = rnd() < 0.62;
    const alpha = 0.05 + rnd() * 0.11;
    g.strokeStyle = light ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha * 0.8})`;
    g.lineWidth = 0.5 + rnd() * 1.1;
    for (const ox of [-SIZE, 0, SIZE])
      for (const oy of [-SIZE, 0, SIZE]) {
        const px = x + ox, py = y + oy;
        if (px < -60 || px > SIZE + 60 || py < -60 || py > SIZE + 60) continue;
        g.beginPath();
        g.moveTo(px, py);
        g.quadraticCurveTo(
          px + Math.cos(a + bend) * len * 0.5,
          py + Math.sin(a + bend) * len * 0.5,
          px + Math.cos(a) * len,
          py + Math.sin(a) * len,
        );
        g.stroke();
      }
  }
  return g.getImageData(0, 0, SIZE, SIZE).data;
};

const build = (): GrainMaps => {
  const rnd = mulberry32(20261028);
  const m1 = tileNoise(4, rnd), m2 = tileNoise(12, rnd), m3 = tileNoise(40, rnd), fine = tileNoise(256, rnd);
  const fib = fibres(rnd);

  const make = (fn: (i: number) => number) => {
    const c = document.createElement("canvas");
    c.width = c.height = SIZE;
    const g = c.getContext("2d")!;
    const img = g.createImageData(SIZE, SIZE);
    for (let i = 0; i < SIZE * SIZE; i++) {
      const v = Math.max(0, Math.min(255, Math.round(fn(i) * 255)));
      img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
      img.data[i * 4 + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    return c;
  };

  // Albedo multiplier: ~0.965 mean, pulp mottling ±3 %, fibres ±4 %, tooth ±1.5 %.
  const albedoCanvas = make((i) => {
    const mottle = (m1[i] - 0.5) * 0.5 + (m2[i] - 0.5) * 0.35 + (m3[i] - 0.5) * 0.15;
    const f = (fib[i * 4] - 128) / 128;
    return 0.965 + mottle * 0.06 + f * 0.05 + (fine[i] - 0.5) * 0.03;
  });
  // Height: fibres stand proud, tooth gives the matte micro-relief.
  const bumpCanvas = make((i) => {
    const f = (fib[i * 4] - 128) / 128;
    return 0.5 + f * 0.35 + (fine[i] - 0.5) * 0.35 + (m3[i] - 0.5) * 0.2;
  });

  const tex = (c: HTMLCanvasElement, srgb: boolean) => {
    const t = new CanvasTexture(c);
    t.wrapS = t.wrapT = RepeatWrapping;
    t.repeat.set(1 / PAPER.grainTile, 1 / PAPER.grainTile);
    t.minFilter = LinearMipmapLinearFilter;
    t.anisotropy = 8;
    t.colorSpace = srgb ? SRGBColorSpace : NoColorSpace;
    t.needsUpdate = true;
    return t;
  };
  return { albedo: tex(albedoCanvas, true), bump: tex(bumpCanvas, false) };
};

export const grainMaps = () => (maps ??= build());

// ── Material factory ────────────────────────────────────────────────────────────

export type PaperOpts = {
  /** Raise/lower the fibre relief (default 1). */
  relief?: number;
  roughness?: number;
  /** Self-illumination for backlit paper (lamps, glowing doors). */
  emissive?: string;
  emissiveIntensity?: number;
  doubleSide?: boolean;
  /** 0 = edge identical to face, 1 = edge fully pale core. */
  core?: number;
};

const cache = new Map<string, MeshStandardMaterial>();

const resolve = (c: string) => (c in PALETTE ? PALETTE[c as keyof typeof PALETTE] : c);

const CORE = new Color("#fff9ee");

// three's screen-space bump mapping divides by the surface's screen derivatives; on a sliver seen exactly
// edge-on (or a software rasteriser's helper pixels) those can vanish and the normal becomes NaN, which the
// bloom then smears over the whole frame. Fall back to the geometric normal there.
const SAFE_BUMP = ShaderChunk.bumpmap_pars_fragment
  .replace(
    "vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );",
    "vec3 dX = dFdx( surf_pos.xyz );\n\t\tvec3 dY = dFdy( surf_pos.xyz );\n\t\tif ( dot( dX, dX ) < 1e-14 || dot( dY, dY ) < 1e-14 ) return surf_norm;\n\t\tvec3 vSigmaX = normalize( dX );",
  )
  .replace("vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );", "vec3 vSigmaY = normalize( dY );")
  .replace(
    "return normalize( abs( fDet ) * surf_norm - vGrad );",
    "vec3 pn = abs( fDet ) * surf_norm - vGrad;\n\t\tfloat l2 = dot( pn, pn );\n\t\treturn l2 > 1e-12 ? pn * inversesqrt( l2 ) : surf_norm;",
  );

const make = (color: string, o: PaperOpts, edge: boolean) => {
  const { albedo, bump } = grainMaps();
  const col = new Color(resolve(color));
  if (edge) col.lerp(CORE, o.core ?? 0.32);
  const m = new MeshStandardMaterial({
    color: col,
    map: albedo,
    bumpMap: bump,
    bumpScale: (edge ? 0.35 : 0.9) * (o.relief ?? 1),
    roughness: o.roughness ?? 0.93,
    metalness: 0,
    ...(o.doubleSide ? { side: DoubleSide } : {}),
  });
  m.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace("#include <bumpmap_pars_fragment>", SAFE_BUMP);
  };
  m.customProgramCacheKey = () => "paper-safe-bump";
  if (o.emissive) {
    m.emissive = new Color(resolve(o.emissive));
    m.emissiveIntensity = o.emissiveIntensity ?? 1;
  }
  return m;
};

const key = (color: string, o: PaperOpts, edge: boolean) =>
  `${color}|${o.relief ?? 1}|${o.roughness ?? 0.93}|${o.emissive ?? ""}|${o.emissiveIntensity ?? 1}|${o.doubleSide ? 1 : 0}|${o.core ?? 0.32}|${edge ? "e" : "f"}`;

/** Face material for a paper colour (palette name or hex). Cached and shared. */
export const paperFace = (color: string, o: PaperOpts = {}) => {
  const k = key(color, o, false);
  let m = cache.get(k);
  if (!m) cache.set(k, (m = make(color, o, false)));
  return m;
};

/** Cut-edge material: the paler core of the same stock. */
export const paperEdge = (color: string, o: PaperOpts = {}) => {
  const k = key(color, o, true);
  let m = cache.get(k);
  if (!m) cache.set(k, (m = make(color, o, true)));
  return m;
};

/** [face, edge] pair for ExtrudeGeometry's two groups (0 = caps, 1 = sides). */
export const paperPair = (color: string, o: PaperOpts = {}) => [paperFace(color, o), paperEdge(color, o)];
