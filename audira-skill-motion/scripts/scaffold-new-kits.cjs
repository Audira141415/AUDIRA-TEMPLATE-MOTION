const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const KITS_DIR = path.join(ROOT, 'kits');
const STARTER_KITS_DIR = path.join(ROOT, 'starter', 'src', 'kits');
const STYLES_DIR = path.join(ROOT, 'styles');

// Also add Style #34 (abstract-fluid-motion -> fluidforge) to styles/ so all 40 styles have modular DNA
const fluidStyleDna = {
  id: 'abstract-fluid-motion',
  styleNumber: 34,
  name: 'Abstract Fluid Motion & Iridescent Liquid Metal',
  kit: 'fluidforge',
  category: 'Abstract CGI / Iridescent Ferrofluid & Chrome',
  palette: {
    background: '#05060A',
    primary: '#00F0FF',
    secondary: '#FF007A',
    accent: '#7000FF',
    chromeSilver: '#E2E8F0',
    text: '#FFFFFF'
  },
  geometry: {
    type: 'metaball_liquid_blobs_and_rings',
    bevelRadius: 0.08,
    polyBudget: 'high_subdivision_smooth',
    silhouette: 'flowing_ferrofluid_droplets'
  },
  materials: {
    type: 'iridescent_liquid_chrome',
    roughness: 0.06,
    metalness: 0.96,
    clearcoat: 1.00,
    normalMap: 'rippling_surface_tension'
  },
  lighting: {
    archetype: 'chromatic_studio_softboxes',
    keyLight: { kelvin: 6500, intensity: 2.2, angle: [35, 45, 15] },
    fillLight: { kelvin: 8500, intensity: 0.8 },
    rimLight: { kelvin: 10000, intensity: 2.5 },
    ambientOcclusion: { intensity: 0.7, radius: 0.3 }
  },
  camera: {
    type: 'zero_gravity_orbital_glide',
    focalLengthMm: 50,
    fovDeg: 34,
    depthOfField: { enabled: true, fStop: 2.0 },
    motionConstraint: 'smooth_harmonic_orbit'
  },
  motion: {
    fps: 60,
    physicsModel: 'surface_tension_harmonic_wave',
    characterCadence: 'zero_g_coalescence'
  }
};

function writeFluidStyleDna(s) {
  const dir = path.join(STYLES_DIR, s.id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'style.md'), `# STYLE DNA: ${s.name} — Style Overview\n# AUDIRA STYLE DNA LIBRARY\n\n**Style ID:** \`${s.id}\` (Audira Style #${s.styleNumber})  \n**Internal Engine Kit:** \`kits/${s.kit}/\`  \n**Classification:** ${s.category}\n\n## Palette\n\`\`\`json\n${JSON.stringify(s.palette, null, 2)}\n\`\`\`\n`, 'utf8');
  fs.writeFileSync(path.join(dir, 'geometry.md'), `# STYLE DNA: ${s.name} — Geometry\n- **Mesh Classification:** \`${s.geometry.type}\`\n- **Silhouette:** \`${s.geometry.silhouette}\`\n`, 'utf8');
  fs.writeFileSync(path.join(dir, 'materials.md'), `# STYLE DNA: ${s.name} — Materials\n- **Archetype:** \`${s.materials.type}\`\n- **Roughness:** \`${s.materials.roughness}\`\n- **Metalness:** \`${s.materials.metalness}\`\n`, 'utf8');
  fs.writeFileSync(path.join(dir, 'lighting.md'), `# STYLE DNA: ${s.name} — Lighting\n- **Archetype:** \`${s.lighting.archetype}\`\n`, 'utf8');
  fs.writeFileSync(path.join(dir, 'camera.md'), `# STYLE DNA: ${s.name} — Camera\n- **Rig:** \`${s.camera.type}\` (${s.camera.focalLengthMm}mm, FOV ${s.camera.fovDeg}°)\n`, 'utf8');
  fs.writeFileSync(path.join(dir, 'motion.md'), `# STYLE DNA: ${s.name} — Motion\n- **FPS:** \`${s.motion.fps}\`\n- **Physics:** \`${s.motion.physicsModel}\`\n`, 'utf8');
  fs.writeFileSync(path.join(dir, 'dna.json'), JSON.stringify({ $schema: 'https://audira.io/schemas/visual-dna.v1.json', styleId: s.id, styleNumber: s.styleNumber, ...s }, null, 2), 'utf8');
}

writeFluidStyleDna(fluidStyleDna);

const KITS = [
  {
    slug: 'fluidforge',
    styleNum: 34,
    constPrefix: 'FLUIDFORGE',
    compPrefix: 'Fluidforge',
    title: 'FLUIDFORGE — Abstract Fluid Motion & Iridescent Liquid Metal',
    subtitle: 'Zero-gravity ferrofluid chrome spheres, iridescent caustic rings, and harmonic surface tension.',
    badge: 'FLUIDFORGE // 34',
    headerTag: '● CHROMATIC FERROFLUID // ZERO-G',
    headline: 'LIQUID METAL HARMONICS',
    quote: '"Surface tension binds liquid chrome into weightless acoustic geometry."',
    footerMeta: 'IRIDESCENT CHROME // 60FPS HARMONIC',
    bgHex: '#05060A',
    paletteCode: `export const FLUIDFORGE_PALETTE = {
  voidDark: "#05060A",
  chromeCore: "#E2E8F0",
  cyanIridescent: "#00F0FF",
  magentaReflect: "#FF007A",
  violetDeep: "#7000FF",
  causticGold: "#FFD166",
};`,
    materialsCode: `import * as THREE from "three";
import { FLUIDFORGE_PALETTE } from "./palette";

export const getLiquidChromeMaterial = () =>
  new THREE.MeshStandardMaterial({
    color: FLUIDFORGE_PALETTE.chromeCore,
    roughness: 0.08,
    metalness: 0.95,
  });

export const getIridescentOrbMaterial = (color: string) =>
  new THREE.MeshStandardMaterial({
    color,
    roughness: 0.12,
    metalness: 0.88,
    emissive: color,
    emissiveIntensity: 0.22,
  });
`,
    motionCode: `export interface FluidforgeState {
  corePulse: number;
  orbitAngle: number;
  waveOffset: number;
  ringTilt: number;
}

export const computeFluidforgeState = (f: number): FluidforgeState => {
  const t = f / 60;
  return {
    corePulse: 1 + Math.sin(t * 2.4) * 0.08,
    orbitAngle: t * 0.85,
    waveOffset: Math.sin(t * 1.6) * 0.25,
    ringTilt: Math.sin(t * 0.9) * 0.35,
  };
};`,
    rigCode: `export interface FluidforgeCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getFluidforgeCamera = (f: number): FluidforgeCameraConfig => {
  const t = f / 60;
  return {
    position: [Math.sin(t * 0.3) * 0.8, 0.4 + Math.cos(t * 0.25) * 0.3, 5.4],
    target: [0, 0.1, 0],
    fov: 34,
  };
};`,
    scene1Name: 'CausticRingArena3D',
    scene1Code: `import React from "react";
import { computeFluidforgeState } from "../core/motion";
import { FLUIDFORGE_PALETTE } from "../lib/palette";

export const CausticRingArena3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeFluidforgeState(f);
  return (
    <group>
      {/* Outer Iridescent Torus Rings */}
      <mesh rotation={[0.6 + state.ringTilt, state.orbitAngle * 0.5, 0]}>
        <torusGeometry args={[1.85, 0.035, 24, 96]} />
        <meshStandardMaterial
          color={FLUIDFORGE_PALETTE.cyanIridescent}
          emissive={FLUIDFORGE_PALETTE.cyanIridescent}
          emissiveIntensity={0.45}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      <mesh rotation={[-0.5 - state.ringTilt, -state.orbitAngle * 0.4, 0.4]}>
        <torusGeometry args={[2.25, 0.025, 24, 96]} />
        <meshStandardMaterial
          color={FLUIDFORGE_PALETTE.magentaReflect}
          emissive={FLUIDFORGE_PALETTE.magentaReflect}
          emissiveIntensity={0.4}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {/* Reflective Dark Mirror Floor */}
      <mesh position={[0, -2.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[6, 64]} />
        <meshStandardMaterial color="#080A12" roughness={0.15} metalness={0.85} />
      </mesh>
    </group>
  );
};`,
    scene2Name: 'LiquidMetalOrb3D',
    scene2Code: `import React from "react";
import { computeFluidforgeState } from "../core/motion";
import { FLUIDFORGE_PALETTE } from "../lib/palette";

export const LiquidMetalOrb3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeFluidforgeState(f);
  const droplets = [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <group position={[0, state.waveOffset * 0.4, 0]}>
      {/* Central Ferrofluid Chrome Core */}
      <mesh scale={[state.corePulse, 1 / state.corePulse, state.corePulse]}>
        <sphereGeometry args={[0.92, 64, 64]} />
        <meshStandardMaterial
          color={FLUIDFORGE_PALETTE.chromeCore}
          metalness={0.96}
          roughness={0.06}
        />
      </mesh>

      {/* Coalescing Satellite Liquid Droplets */}
      {droplets.map((i) => {
        const angle = state.orbitAngle + (i * Math.PI * 2) / droplets.length;
        const radius = 1.32 + Math.sin(f * 0.05 + i) * 0.18;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(angle * 2 + i) * 0.45;
        const color = i % 2 === 0 ? FLUIDFORGE_PALETTE.cyanIridescent : FLUIDFORGE_PALETTE.magentaReflect;
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.18 + (i % 3) * 0.04, 32, 32]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.25}
              metalness={0.92}
              roughness={0.08}
            />
          </mesh>
        );
      })}
    </group>
  );
};`
  },
  {
    slug: 'hd2d',
    styleNum: 35,
    constPrefix: 'HD2D',
    compPrefix: 'Hd2d',
    title: 'HD2D — Octopath-Style 2D Pixel Sprites in 3D Tilt-Shift Diorama',
    subtitle: '2D pixel-art billboard characters inside a physically lit 3D timber town diorama with warm 2400K lanterns and shallow tilt-shift DOF.',
    badge: 'HD-2D // 35',
    headerTag: '● TILT-SHIFT PIXEL DIORAMA // 2400K LANTERNS',
    headline: 'EMBERGATE CROSSING',
    quote: '"Crisp 16-bit pixel sprites cast real 3D contact shadows across rain-slicked cobblestones."',
    footerMeta: '8FPS SPRITE STEP // 60FPS 3D CAMERA',
    bgHex: '#0B0E14',
    paletteCode: `export const HD2D_PALETTE = {
  nightVoid: "#0B0E14",
  lanternAmber: "#E5A93C",
  midnightSlate: "#18202F",
  heroScarlet: "#FF4A3D",
  cobbleStone: "#2A3242",
  timberBeam: "#3D291A",
  mistSilver: "#D4D9E2",
};`,
    materialsCode: `import * as THREE from "three";
import { HD2D_PALETTE } from "./palette";

export const getCobblestoneMaterial = () =>
  new THREE.MeshStandardMaterial({
    color: HD2D_PALETTE.cobbleStone,
    roughness: 0.78,
    metalness: 0.1,
  });

export const getTimberMaterial = () =>
  new THREE.MeshStandardMaterial({
    color: HD2D_PALETTE.timberBeam,
    roughness: 0.88,
    metalness: 0.0,
  });
`,
    motionCode: `export interface Hd2dState {
  spriteStepFrame: number;
  lanternFlicker: number;
  heroBobY: number;
  emberRiseY: number;
}

export const computeHd2dState = (f: number): Hd2dState => {
  // 8fps stepped sprite cadence inside 60fps timeline
  const spriteStepFrame = Math.floor(f / 7.5);
  const t = f / 60;
  return {
    spriteStepFrame,
    lanternFlicker: 1.8 + Math.sin(t * 7.0) * 0.2 + Math.cos(t * 13.0) * 0.1,
    heroBobY: (spriteStepFrame % 2) * 0.04,
    emberRiseY: (t * 0.6) % 2.4,
  };
};`,
    rigCode: `export interface Hd2dCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getHd2dCamera = (f: number): Hd2dCameraConfig => {
  const t = f / 60;
  // Elevated 3/4 tilt-shift diorama perspective
  return {
    position: [Math.sin(t * 0.2) * 0.6, 2.55, 5.6 - t * 0.04],
    target: [0, 0.55, 0],
    fov: 32,
  };
};`,
    scene1Name: 'TimberTownDiorama3D',
    scene1Code: `import React from "react";
import { computeHd2dState } from "../core/motion";
import { HD2D_PALETTE } from "../lib/palette";

export const TimberTownDiorama3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeHd2dState(f);
  return (
    <group>
      {/* Stepped Diorama Cobblestone Base */}
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[5.2, 0.6, 3.8]} />
        <meshStandardMaterial color={HD2D_PALETTE.cobbleStone} roughness={0.82} />
      </mesh>

      {/* Left Timber Guildhouse */}
      <group position={[-1.55, 0.85, -0.8]}>
        <mesh>
          <boxGeometry args={[1.5, 1.7, 1.4]} />
          <meshStandardMaterial color="#252B3B" roughness={0.85} />
        </mesh>
        {/* Warm Lit Pixel Window */}
        <mesh position={[0.3, 0.1, 0.71]}>
          <planeGeometry args={[0.45, 0.55]} />
          <meshStandardMaterial
            color={HD2D_PALETTE.lanternAmber}
            emissive={HD2D_PALETTE.lanternAmber}
            emissiveIntensity={1.4}
          />
        </mesh>
      </group>

      {/* Right Stone Archway & Tavern */}
      <group position={[1.55, 0.95, -0.7]}>
        <mesh>
          <boxGeometry args={[1.6, 1.9, 1.5]} />
          <meshStandardMaterial color="#1E2433" roughness={0.85} />
        </mesh>
        <mesh position={[-0.35, 0.15, 0.76]}>
          <planeGeometry args={[0.5, 0.55]} />
          <meshStandardMaterial
            color={HD2D_PALETTE.lanternAmber}
            emissive={HD2D_PALETTE.lanternAmber}
            emissiveIntensity={1.2}
          />
        </mesh>
      </group>

      {/* Warm 2400K Street Lantern Post */}
      <group position={[-0.65, 0.65, 0.45]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 1.3, 12]} />
          <meshStandardMaterial color="#151821" roughness={0.5} metalness={0.6} />
        </mesh>
        <mesh position={[0.15, 0.55, 0]}>
          <boxGeometry args={[0.22, 0.28, 0.22]} />
          <meshStandardMaterial
            color={HD2D_PALETTE.lanternAmber}
            emissive={HD2D_PALETTE.lanternAmber}
            emissiveIntensity={state.lanternFlicker}
          />
        </mesh>
        <pointLight
          position={[0.2, 0.55, 0.1]}
          color={HD2D_PALETTE.lanternAmber}
          intensity={state.lanternFlicker * 1.5}
          distance={5}
        />
      </group>
    </group>
  );
};`,
    scene2Name: 'PixelHeroBillboard3D',
    scene2Code: `import React from "react";
import { computeHd2dState } from "../core/motion";
import { HD2D_PALETTE } from "../lib/palette";

export const PixelHeroBillboard3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeHd2dState(f);
  // Pixel-grid constructed 2D sprite silhouette standing upright in 3D space
  return (
    <group position={[0.15, 0.02 + state.heroBobY, 0.55]}>
      {/* Contact Shadow Disc */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.38, 24]} />
        <meshBasicMaterial color="#05070B" />
      </mesh>

      {/* 16-Bit Pixel Sprite Hero (Layered Pixel Voxel Thin Slabs) */}
      {/* Boots */}
      <mesh position={[-0.12, 0.12, 0]}>
        <boxGeometry args={[0.14, 0.22, 0.06]} />
        <meshStandardMaterial color="#3B2314" roughness={0.9} />
      </mesh>
      <mesh position={[0.12, 0.12, 0]}>
        <boxGeometry args={[0.14, 0.22, 0.06]} />
        <meshStandardMaterial color="#3B2314" roughness={0.9} />
      </mesh>
      {/* Tunic Body */}
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[0.42, 0.42, 0.07]} />
        <meshStandardMaterial color="#1F3A60" roughness={0.85} />
      </mesh>
      {/* Flowing Scarlet Pixel Scarf */}
      <mesh position={[0.08, 0.62, 0.03]}>
        <boxGeometry args={[0.52, 0.14, 0.08]} />
        <meshStandardMaterial
          color={HD2D_PALETTE.heroScarlet}
          emissive={HD2D_PALETTE.heroScarlet}
          emissiveIntensity={0.25}
          roughness={0.8}
        />
      </mesh>
      {/* Pixel Head & Hair */}
      <mesh position={[0, 0.84, 0]}>
        <boxGeometry args={[0.36, 0.32, 0.07]} />
        <meshStandardMaterial color="#F3C6A5" roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.02, 0.01]}>
        <boxGeometry args={[0.42, 0.16, 0.08]} />
        <meshStandardMaterial color="#D99B52" roughness={0.85} />
      </mesh>

      {/* Floating Golden Torch Embers */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[
            -0.5 + i * 0.28 + Math.sin(f * 0.04 + i) * 0.1,
            0.3 + ((state.emberRiseY + i * 0.45) % 2.1),
            0.25 - (i % 2) * 0.3,
          ]}
        >
          <boxGeometry args={[0.05, 0.05, 0.05]} />
          <meshBasicMaterial color={HD2D_PALETTE.lanternAmber} />
        </mesh>
      ))}
    </group>
  );
};`
  },
  {
    slug: 'memphisdiorama',
    styleNum: 36,
    constPrefix: 'MEMPHISDIORAMA',
    compPrefix: 'MemphisDiorama',
    title: 'MEMPHISDIORAMA — 1980s Ettore Sottsass Architectural Tabletop Model',
    subtitle: 'Playful geometric architectural massing, canary yellow & coral pink blocks, terrazzo base, and hard cool-purple shadows.',
    badge: 'MEMPHIS // 36',
    headerTag: '● MILANO 1981 // SOTTSASS TABLETOP',
    headline: 'TERRAZZO TOTEM',
    quote: '"Bold geometric primitives cast crisp violet shadows across warm archival paper."',
    footerMeta: 'FLAT SHADED // ZERO DOF BLUR',
    bgHex: '#FFFCF6',
    darkText: true,
    paletteCode: `export const MEMPHISDIORAMA_PALETTE = {
  paperWarm: "#FFFCF6",
  canaryYellow: "#FFD234",
  coralPink: "#FF5A5F",
  skyBlue: "#5CC8FF",
  mintGreen: "#5EDFB0",
  shadowPurple: "#705890",
  indigoInk: "#25214A",
};`,
    materialsCode: `import * as THREE from "three";
import { MEMPHISDIORAMA_PALETTE } from "./palette";

export const getMemphisMatteMaterial = (color: string) =>
  new THREE.MeshStandardMaterial({
    color,
    roughness: 0.92,
    metalness: 0.0,
  });
`,
    motionCode: `export interface MemphisDioramaState {
  totemSpin: number;
  sphereBounceY: number;
  archRockZ: number;
}

export const computeMemphisDioramaState = (f: number): MemphisDioramaState => {
  const t = f / 60;
  return {
    totemSpin: t * 0.65,
    sphereBounceY: Math.abs(Math.sin(t * 2.2)) * 0.28,
    archRockZ: Math.sin(t * 1.5) * 0.08,
  };
};`,
    rigCode: `export interface MemphisDioramaCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getMemphisDioramaCamera = (f: number): MemphisDioramaCameraConfig => {
  const t = f / 60;
  return {
    position: [Math.sin(t * 0.25) * 1.1, 2.35, 5.8],
    target: [0, 0.45, 0],
    fov: 36,
  };
};`,
    scene1Name: 'TerrazzoPlinth3D',
    scene1Code: `import React from "react";
import { MEMPHISDIORAMA_PALETTE } from "../lib/palette";

export const TerrazzoPlinth3D: React.FC<{ f: number }> = () => {
  return (
    <group>
      {/* Hard Cool-Purple Architectural Drop Shadow Slab */}
      <mesh position={[0.38, -0.52, -0.25]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.2, 3.0]} />
        <meshBasicMaterial color={MEMPHISDIORAMA_PALETTE.shadowPurple} />
      </mesh>

      {/* Main White Terrazzo Tabletop Plinth */}
      <mesh position={[0, -0.25, 0]}>
        <boxGeometry args={[4.0, 0.5, 2.8]} />
        <meshStandardMaterial color="#F4EFE6" roughness={0.9} />
      </mesh>

      {/* Terrazzo Confetti Specks on Plinth Top */}
      {[-1.4, -0.7, 0.1, 0.8, 1.3].map((x, idx) => (
        <mesh key={idx} position={[x, 0.01, (idx % 2 === 0 ? 0.6 : -0.5)]} rotation={[-Math.PI / 2, 0, idx]}>
          <planeGeometry args={[0.22, 0.14]} />
          <meshBasicMaterial
            color={
              idx % 3 === 0
                ? MEMPHISDIORAMA_PALETTE.coralPink
                : idx % 3 === 1
                ? MEMPHISDIORAMA_PALETTE.skyBlue
                : MEMPHISDIORAMA_PALETTE.canaryYellow
            }
          />
        </mesh>
      ))}
    </group>
  );
};`,
    scene2Name: 'SottsassTotem3D',
    scene2Code: `import React from "react";
import { computeMemphisDioramaState } from "../core/motion";
import { MEMPHISDIORAMA_PALETTE } from "../lib/palette";

export const SottsassTotem3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeMemphisDioramaState(f);
  return (
    <group>
      {/* Canary Yellow Stepped Pyramid Pedestal */}
      <mesh position={[-0.85, 0.35, 0]}>
        <boxGeometry args={[1.1, 0.7, 1.1]} />
        <meshStandardMaterial color={MEMPHISDIORAMA_PALETTE.canaryYellow} roughness={0.88} />
      </mesh>

      {/* Coral Pink Postmodern Archway */}
      <group position={[0.55, 0.75, -0.15]} rotation={[0, 0, state.archRockZ]}>
        <mesh position={[-0.45, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 1.5, 24]} />
          <meshStandardMaterial color={MEMPHISDIORAMA_PALETTE.coralPink} roughness={0.88} />
        </mesh>
        <mesh position={[0.45, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 1.5, 24]} />
          <meshStandardMaterial color={MEMPHISDIORAMA_PALETTE.coralPink} roughness={0.88} />
        </mesh>
        <mesh position={[0, 0.75, 0]}>
          <boxGeometry args={[1.35, 0.32, 0.45]} />
          <meshStandardMaterial color={MEMPHISDIORAMA_PALETTE.indigoInk} roughness={0.88} />
        </mesh>
      </group>

      {/* Mint Green Tilted Ring & Bouncing Sky-Blue Sphere */}
      <mesh position={[-0.85, 1.15, 0]} rotation={[0.3, state.totemSpin, 0.2]}>
        <torusGeometry args={[0.42, 0.11, 20, 48]} />
        <meshStandardMaterial color={MEMPHISDIORAMA_PALETTE.mintGreen} roughness={0.85} />
      </mesh>

      <mesh position={[0.55, 0.35 + state.sphereBounceY, 0.45]}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial color={MEMPHISDIORAMA_PALETTE.skyBlue} roughness={0.85} />
      </mesh>
    </group>
  );
};`
  },
  {
    slug: 'dataphysical',
    styleNum: 37,
    constPrefix: 'DATAPHYSICAL',
    compPrefix: 'DataPhysical',
    title: 'DATAPHYSICAL — 3D Data Physicalization & Sculptural Stats',
    subtitle: 'Tactile museum-grade statistical sculptures in brushed aluminum, translucent teal acrylic, walnut wood, and burnt orange.',
    badge: 'DATA PHYSICAL // 37',
    headerTag: '● SCULPTURAL TELEMETRY // PHYSICAL METRICS',
    headline: 'Q4 CAPEX MONOLITH',
    quote: '"Every plate is a countable unit; every benchmark is machined into physical brass and acrylic."',
    footerMeta: 'WALNUT & BRUSHED ALUMINUM // MACRO STUDIO',
    bgHex: '#1C1D20',
    paletteCode: `export const DATAPHYSICAL_PALETTE = {
  studioGreige: "#1C1D20",
  walnutBase: "#2A1B14",
  machinedAluminum: "#C8CCD1",
  acrylicTeal: "#9FD3D6",
  brassGold: "#D2B07A",
  focalOrange: "#D4521C",
};`,
    materialsCode: `import * as THREE from "three";
import { DATAPHYSICAL_PALETTE } from "./palette";

export const getAluminumMaterial = () =>
  new THREE.MeshStandardMaterial({
    color: DATAPHYSICAL_PALETTE.machinedAluminum,
    roughness: 0.22,
    metalness: 0.88,
  });

export const getBrassMaterial = () =>
  new THREE.MeshStandardMaterial({
    color: DATAPHYSICAL_PALETTE.brassGold,
    roughness: 0.25,
    metalness: 0.85,
  });
`,
    motionCode: `export interface DataPhysicalState {
  heroBarHeight: number;
  brassMarkerY: number;
  turntableYaw: number;
}

export const computeDataPhysicalState = (f: number): DataPhysicalState => {
  const t = f / 60;
  const progress = Math.min(1, f / 75);
  const easeOut = 1 - Math.pow(1 - progress, 3);
  return {
    heroBarHeight: 0.2 + easeOut * 1.95,
    brassMarkerY: 0.1 + easeOut * 1.45,
    turntableYaw: Math.sin(t * 0.35) * 0.28,
  };
};`,
    rigCode: `export interface DataPhysicalCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getDataPhysicalCamera = (f: number): DataPhysicalCameraConfig => {
  const t = f / 60;
  return {
    position: [0.6 + Math.sin(t * 0.2) * 0.4, 1.65, 5.2 + t * 0.05],
    target: [0, 0.55, 0],
    fov: 28,
  };
};`,
    scene1Name: 'WalnutMeasurePlinth3D',
    scene1Code: `import React from "react";
import { computeDataPhysicalState } from "../core/motion";
import { DATAPHYSICAL_PALETTE } from "../lib/palette";

export const WalnutMeasurePlinth3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeDataPhysicalState(f);
  return (
    <group rotation={[0, state.turntableYaw, 0]}>
      {/* Crafted Dark Walnut Slab */}
      <mesh position={[0, -0.22, 0]}>
        <boxGeometry args={[3.8, 0.44, 2.2]} />
        <meshStandardMaterial color={DATAPHYSICAL_PALETTE.walnutBase} roughness={0.55} metalness={0.1} />
      </mesh>

      {/* Brass Precision Scale Rail on Front Bevel */}
      <mesh position={[0, -0.05, 1.11]}>
        <boxGeometry args={[3.4, 0.08, 0.04]} />
        <meshStandardMaterial color={DATAPHYSICAL_PALETTE.brassGold} roughness={0.25} metalness={0.88} />
      </mesh>

      {/* Translucent Teal Acrylic Benchmark Plane */}
      <mesh position={[0, state.brassMarkerY, 0]}>
        <boxGeometry args={[3.5, 0.035, 1.85]} />
        <meshStandardMaterial
          color={DATAPHYSICAL_PALETTE.acrylicTeal}
          transparent
          opacity={0.45}
          roughness={0.12}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
};`,
    scene2Name: 'StackedMetalColumns3D',
    scene2Code: `import React from "react";
import { computeDataPhysicalState } from "../core/motion";
import { DATAPHYSICAL_PALETTE } from "../lib/palette";

export const StackedMetalColumns3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeDataPhysicalState(f);
  const series = [0.65, 0.95, 1.25, 0.85, 1.4, 2.15, 1.1];

  return (
    <group rotation={[0, state.turntableYaw, 0]}>
      {series.map((h, i) => {
        const isHero = i === 5;
        const x = (i - 3) * 0.46;
        const actualH = isHero ? state.heroBarHeight : h;
        const color = isHero ? DATAPHYSICAL_PALETTE.focalOrange : DATAPHYSICAL_PALETTE.machinedAluminum;
        return (
          <group key={i} position={[x, 0, 0]}>
            <mesh position={[0, actualH / 2, 0]}>
              <boxGeometry args={[0.32, actualH, 0.65]} />
              <meshStandardMaterial
                color={color}
                roughness={isHero ? 0.35 : 0.2}
                metalness={isHero ? 0.25 : 0.88}
              />
            </mesh>
            {/* Brass Cap on Top of Each Column */}
            <mesh position={[0, actualH + 0.025, 0]}>
              <boxGeometry args={[0.32, 0.04, 0.65]} />
              <meshStandardMaterial
                color={DATAPHYSICAL_PALETTE.brassGold}
                roughness={0.22}
                metalness={0.9}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};`
  },
  {
    slug: 'satellitebriefing',
    styleNum: 38,
    constPrefix: 'SATELLITEBRIEFING',
    compPrefix: 'SatelliteBriefing',
    title: 'SATELLITEBRIEFING — 3D Satellite & OSINT Geospatial Reconnaissance',
    subtitle: 'Logarithmic orbital zoom from planetary grid to desaturated analyst terrain with amber vector callouts and scale bars.',
    badge: 'OSINT GEO // 38',
    headerTag: '● SENTINEL-2 OPTICAL // 0.5M GSD NADIR',
    headline: 'STRAIT RECONNAISSANCE',
    quote: '"Desaturated satellite terrain isolates amber target reticles and calibrated meter-scale vectors."',
    footerMeta: 'LAT 01°17\'N LON 103°51\'E // ELEV 420KM',
    bgHex: '#070B0E',
    paletteCode: `export const SATELLITEBRIEFING_PALETTE = {
  spaceVoid: "#070B0E",
  analystGrey: "#4A5358",
  deepOcean: "#102A45",
  vectorWhite: "#F2F5F6",
  readingAmber: "#FFBE55",
  claimBlue: "#2E70CE",
};`,
    materialsCode: `import * as THREE from "three";
import { SATELLITEBRIEFING_PALETTE } from "./palette";

export const getTerrainMaterial = () =>
  new THREE.MeshStandardMaterial({
    color: SATELLITEBRIEFING_PALETTE.analystGrey,
    roughness: 0.85,
    metalness: 0.05,
  });
`,
    motionCode: `export interface SatelliteBriefingState {
  cameraAltitude: number;
  reticlePulse: number;
  scanAngle: number;
}

export const computeSatelliteBriefingState = (f: number): SatelliteBriefingState => {
  const t = f / 60;
  // Logarithmic descent from high orbit to tactical nadir view
  const progress = Math.min(1, f / 120);
  const cameraAltitude = 6.8 * Math.pow(0.52, progress);
  return {
    cameraAltitude,
    reticlePulse: 1 + Math.sin(t * 4.0) * 0.08,
    scanAngle: t * 0.4,
  };
};`,
    rigCode: `import { computeSatelliteBriefingState } from "../core/motion";

export interface SatelliteBriefingCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getSatelliteBriefingCamera = (f: number): SatelliteBriefingCameraConfig => {
  const state = computeSatelliteBriefingState(f);
  return {
    position: [Math.sin(state.scanAngle) * 0.6, state.cameraAltitude, 2.2],
    target: [0, 0, 0],
    fov: 42,
  };
};`,
    scene1Name: 'GeospatialTerrain3D',
    scene1Code: `import React from "react";
import { SATELLITEBRIEFING_PALETTE } from "../lib/palette";

export const GeospatialTerrain3D: React.FC<{ f: number }> = () => {
  return (
    <group>
      {/* Deep Ocean Bathymetry Base */}
      <mesh position={[0, -0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8.0, 8.0]} />
        <meshStandardMaterial color={SATELLITEBRIEFING_PALETTE.deepOcean} roughness={0.65} />
      </mesh>

      {/* Desaturated Analyst Port Peninsula Blocks */}
      <mesh position={[-0.9, 0.05, -0.4]}>
        <boxGeometry args={[2.6, 0.25, 1.8]} />
        <meshStandardMaterial color={SATELLITEBRIEFING_PALETTE.analystGrey} roughness={0.88} />
      </mesh>
      <mesh position={[1.1, 0.02, 0.55]}>
        <boxGeometry args={[1.8, 0.18, 1.2]} />
        <meshStandardMaterial color="#3E464B" roughness={0.88} />
      </mesh>

      {/* Georeferenced Coordinate Grid Lines */}
      {[-2, -1, 0, 1, 2].map((g) => (
        <React.Fragment key={g}>
          <mesh position={[g, -0.02, 0]}>
            <boxGeometry args={[0.012, 0.01, 6.0]} />
            <meshBasicMaterial color={SATELLITEBRIEFING_PALETTE.claimBlue} />
          </mesh>
          <mesh position={[0, -0.02, g]}>
            <boxGeometry args={[6.0, 0.01, 0.012]} />
            <meshBasicMaterial color={SATELLITEBRIEFING_PALETTE.claimBlue} />
          </mesh>
        </React.Fragment>
      ))}
    </group>
  );
};`,
    scene2Name: 'OrbitalTargetReticle3D',
    scene2Code: `import React from "react";
import { computeSatelliteBriefingState } from "../core/motion";
import { SATELLITEBRIEFING_PALETTE } from "../lib/palette";

export const OrbitalTargetReticle3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeSatelliteBriefingState(f);
  const targets: [number, number, number][] = [
    [-0.45, 0.22, -0.15],
    [0.85, 0.16, 0.45],
    [0.15, 0.05, -0.75],
  ];

  return (
    <group>
      {targets.map((pos, idx) => (
        <group key={idx} position={pos}>
          {/* Amber OSINT Bounding Box Ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[state.reticlePulse, state.reticlePulse, 1]}>
            <ringGeometry args={[0.26, 0.31, 4]} />
            <meshBasicMaterial color={SATELLITEBRIEFING_PALETTE.readingAmber} />
          </mesh>
          {/* Vertical Telemetry Pin Pillar */}
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.9, 8]} />
            <meshBasicMaterial color={SATELLITEBRIEFING_PALETTE.readingAmber} />
          </mesh>
          <mesh position={[0, 0.92, 0]}>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshBasicMaterial color={SATELLITEBRIEFING_PALETTE.vectorWhite} />
          </mesh>
        </group>
      ))}
    </group>
  );
};`
  },
  {
    slug: 'backrooms',
    styleNum: 39,
    constPrefix: 'BACKROOMS',
    compPrefix: 'Backrooms',
    title: 'BACKROOMS — Liminal 3D Corridors & 90s Found Footage',
    subtitle: 'Endless monochromatic yellow office corridors, buzzing fluorescent ceiling troffers, and handheld VHS camcorder bob.',
    badge: 'LIMINAL // 39',
    headerTag: '● PLAY ▶ // SP 02:14:09 // SEP 14 1996',
    headline: 'LEVEL 0 THRESHOLD',
    quote: '"Six hundred million square miles of randomly segmented empty rooms and buzzing fluorescent ballast."',
    footerMeta: 'VHS HI-8 CAMCORDER // 30FPS STEP',
    bgHex: '#0A0B09',
    paletteCode: `export const BACKROOMS_PALETTE = {
  voidDark: "#0A0B09",
  wallpaperYellow: "#D5BD66",
  carpetOchre: "#8C763C",
  trimWood: "#4D3D26",
  fluorescentWhite: "#F5F2DC",
  alarmRed: "#FF2222",
};`,
    materialsCode: `import * as THREE from "three";
import { BACKROOMS_PALETTE } from "./palette";

export const getWallpaperMaterial = () =>
  new THREE.MeshStandardMaterial({
    color: BACKROOMS_PALETTE.wallpaperYellow,
    roughness: 0.82,
    metalness: 0.0,
  });
`,
    motionCode: `export interface BackroomsState {
  walkBobY: number;
  walkSwayX: number;
  walkForwardZ: number;
  tubeFlicker: number;
}

export const computeBackroomsState = (f: number): BackroomsState => {
  const t = f / 60;
  const flicker = Math.sin(f * 1.9) > 0.88 ? 0.35 : 1.35;
  return {
    walkBobY: Math.abs(Math.sin(t * 4.2)) * 0.06,
    walkSwayX: Math.sin(t * 2.1) * 0.08,
    walkForwardZ: (t * 0.55) % 3.0,
    tubeFlicker: flicker,
  };
};`,
    rigCode: `import { computeBackroomsState } from "../core/motion";

export interface BackroomsCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getBackroomsCamera = (f: number): BackroomsCameraConfig => {
  const state = computeBackroomsState(f);
  return {
    position: [state.walkSwayX, 1.35 + state.walkBobY, 4.8 - state.walkForwardZ],
    target: [state.walkSwayX * 0.5, 1.3, -4.0],
    fov: 58,
  };
};`,
    scene1Name: 'LiminalMaze3D',
    scene1Code: `import React from "react";
import { BACKROOMS_PALETTE } from "../lib/palette";

export const LiminalMaze3D: React.FC<{ f: number }> = () => {
  const pillars = [-3.0, -1.0, 1.0, 3.0];
  return (
    <group>
      {/* Damp Ochre Institutional Carpet Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 16]} />
        <meshStandardMaterial color={BACKROOMS_PALETTE.carpetOchre} roughness={0.95} />
      </mesh>

      {/* Suspended Acoustic Ceiling Tile Grid */}
      <mesh position={[0, 2.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 16]} />
        <meshStandardMaterial color="#C8C2A8" roughness={0.9} />
      </mesh>

      {/* Repeating Modular Yellow Wallpaper Partition Walls */}
      {pillars.map((z, idx) => (
        <React.Fragment key={idx}>
          <mesh position={[-1.45, 1.35, z]}>
            <boxGeometry args={[0.45, 2.7, 1.1]} />
            <meshStandardMaterial color={BACKROOMS_PALETTE.wallpaperYellow} roughness={0.82} />
          </mesh>
          <mesh position={[1.45, 1.35, z - 0.5]}>
            <boxGeometry args={[0.45, 2.7, 1.1]} />
            <meshStandardMaterial color={BACKROOMS_PALETTE.wallpaperYellow} roughness={0.82} />
          </mesh>
        </React.Fragment>
      ))}

      {/* Far Back Partition Wall */}
      <mesh position={[0, 1.35, -5.5]}>
        <boxGeometry args={[6.0, 2.7, 0.3]} />
        <meshStandardMaterial color={BACKROOMS_PALETTE.wallpaperYellow} roughness={0.85} />
      </mesh>
    </group>
  );
};`,
    scene2Name: 'FluorescentCeiling3D',
    scene2Code: `import React from "react";
import { computeBackroomsState } from "../core/motion";
import { BACKROOMS_PALETTE } from "../lib/palette";

export const FluorescentCeiling3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeBackroomsState(f);
  const lightsZ = [-4.0, -1.5, 1.0, 3.5];

  return (
    <group>
      {lightsZ.map((z, i) => {
        const intensity = i === 1 ? state.tubeFlicker : 1.3;
        return (
          <group key={i} position={[0, 2.66, z]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.9, 0.45]} />
              <meshStandardMaterial
                color={BACKROOMS_PALETTE.fluorescentWhite}
                emissive={BACKROOMS_PALETTE.fluorescentWhite}
                emissiveIntensity={intensity}
              />
            </mesh>
            <pointLight
              position={[0, -0.25, 0]}
              color={BACKROOMS_PALETTE.fluorescentWhite}
              intensity={intensity * 0.75}
              distance={5.5}
            />
          </group>
        );
      })}
    </group>
  );
};`
  },
  {
    slug: 'visualinvestigation',
    styleNum: 40,
    constPrefix: 'VISUALINVESTIGATION',
    compPrefix: 'VisualInvestigation',
    title: 'VISUALINVESTIGATION — Visual Journalism & Forensic Courtroom Desk',
    subtitle: 'Mute-Test compliant forensic desk with named courtroom speaker podiums, verbatim quote callouts, and synchronized clock.',
    badge: 'FORENSIC // 40',
    headerTag: '● COURTROOM RECONSTRUCTION // 14:32:08 WIB',
    headline: 'EXHIBIT A-04: VERBATIM TRANSCRIPT',
    quote: '"SAKSI AHLI (DR. R. SURYADI): Metadata dokumen asli tercatat pada pukul 14:32 WIB di register kepaniteraan."',
    footerMeta: 'MUTE-TEST VERIFIED // WHO + WHAT + WHEN',
    bgHex: '#0B0C0E',
    paletteCode: `export const VISUALINVESTIGATION_PALETTE = {
  deskVoid: "#0B0C0E",
  panelCharcoal: "#141619",
  hairlineGrey: "#2E3238",
  evidenceRed: "#FF4A2E",
  archivalPaper: "#E4E0D4",
  inkBlack: "#1D1D1B",
  verifiedGreen: "#10B981",
};`,
    materialsCode: `import * as THREE from "three";
import { VISUALINVESTIGATION_PALETTE } from "./palette";

export const getArchivalPaperMaterial = () =>
  new THREE.MeshStandardMaterial({
    color: VISUALINVESTIGATION_PALETTE.archivalPaper,
    roughness: 0.94,
    metalness: 0.0,
  });
`,
    motionCode: `export interface VisualInvestigationState {
  highlightWidth: number;
  activePodiumPulse: number;
  deskZoomZ: number;
}

export const computeVisualInvestigationState = (f: number): VisualInvestigationState => {
  const t = f / 60;
  const wipeProgress = Math.min(1, Math.max(0, (f - 15) / 50));
  return {
    highlightWidth: 0.05 + wipeProgress * 1.55,
    activePodiumPulse: 1 + Math.sin(t * 4.5) * 0.08,
    deskZoomZ: 5.4 - Math.min(0.65, t * 0.12),
  };
};`,
    rigCode: `import { computeVisualInvestigationState } from "../core/motion";

export interface VisualInvestigationCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getVisualInvestigationCamera = (f: number): VisualInvestigationCameraConfig => {
  const state = computeVisualInvestigationState(f);
  return {
    position: [0, 2.15, state.deskZoomZ],
    target: [0, 0.25, 0],
    fov: 30,
  };
};`,
    scene1Name: 'ForensicDesk3D',
    scene1Code: `import React from "react";
import { VISUALINVESTIGATION_PALETTE } from "../lib/palette";

export const ForensicDesk3D: React.FC<{ f: number }> = () => {
  return (
    <group>
      {/* Cold Charcoal Forensic Investigation Table */}
      <mesh position={[0, -0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.5, 5.5]} />
        <meshStandardMaterial color={VISUALINVESTIGATION_PALETTE.panelCharcoal} roughness={0.9} />
      </mesh>

      {/* Courtroom Architectural Floorplan Blueprint Slab */}
      <mesh position={[-0.95, -0.18, 0.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.1, 2.4]} />
        <meshStandardMaterial color="#1B222C" roughness={0.85} />
      </mesh>

      {/* Labeled Courtroom Podium Blocks: Judge (Top), Prosecutor (Left), Witness (Center-Active), Defense (Right) */}
      {/* Judge Bench */}
      <mesh position={[-0.95, -0.05, -0.65]}>
        <boxGeometry args={[1.1, 0.22, 0.32]} />
        <meshStandardMaterial color="#384152" roughness={0.8} />
      </mesh>
      {/* Active Speaker Podium (Highlighted in Evidence Red) */}
      <mesh position={[-0.95, 0.02, 0.15]}>
        <boxGeometry args={[0.42, 0.34, 0.42]} />
        <meshStandardMaterial
          color={VISUALINVESTIGATION_PALETTE.evidenceRed}
          emissive={VISUALINVESTIGATION_PALETTE.evidenceRed}
          emissiveIntensity={0.45}
          roughness={0.5}
        />
      </mesh>
    </group>
  );
};`,
    scene2Name: 'CourtroomEvidenceBoard3D',
    scene2Code: `import React from "react";
import { computeVisualInvestigationState } from "../core/motion";
import { VISUALINVESTIGATION_PALETTE } from "../lib/palette";

export const CourtroomEvidenceBoard3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeVisualInvestigationState(f);
  return (
    <group position={[0.92, 0.22, 0]} rotation={[-0.35, -0.15, 0]}>
      {/* Scanned Archival Court Dossier Sheet */}
      <mesh>
        <boxGeometry args={[1.95, 2.45, 0.04]} />
        <meshStandardMaterial color={VISUALINVESTIGATION_PALETTE.archivalPaper} roughness={0.95} />
      </mesh>

      {/* Simulated Printed Document Paragraph Bars */}
      {[0.75, 0.48, 0.22, -0.08, -0.35, -0.62].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0.025]}>
          <boxGeometry args={[1.55, 0.09, 0.01]} />
          <meshBasicMaterial color={VISUALINVESTIGATION_PALETTE.inkBlack} />
        </mesh>
      ))}

      {/* Animated Forensic Red Highlighter Wipe Over Key Evidence Clause */}
      <mesh position={[-0.78 + state.highlightWidth / 2, 0.22, 0.032]}>
        <boxGeometry args={[state.highlightWidth, 0.18, 0.012]} />
        <meshStandardMaterial
          color={VISUALINVESTIGATION_PALETTE.evidenceRed}
          emissive={VISUALINVESTIGATION_PALETTE.evidenceRed}
          emissiveIntensity={0.35}
          transparent
          opacity={0.78}
        />
      </mesh>
    </group>
  );
};`
  }
];

function createOverlayCode(k) {
  const textColor = k.darkText ? '#25214A' : '#ECEFF4';
  const badgeBg = k.darkText ? 'rgba(37, 33, 74, 0.9)' : 'rgba(10, 12, 16, 0.86)';
  const accentHex = k.darkText ? '#FF5A5F' : '#FFBE55';

  return `import React from "react";

export const ${k.compPrefix}Overlay: React.FC<{ f: number }> = ({ f }) => {
  const opacity = Math.min(1, f / 30);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "54px 44px",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        color: "${textColor}",
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          opacity,
        }}
      >
        <div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "3px",
              color: "${accentHex}",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            ${k.headerTag}
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 900,
              letterSpacing: "0.5px",
              lineHeight: 1.08,
            }}
          >
            ${k.headline}
          </div>
        </div>

        <div
          style={{
            background: "${badgeBg}",
            border: "1px solid ${accentHex}",
            color: "#FFFFFF",
            padding: "8px 16px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "2px",
          }}
        >
          ${k.badge}
        </div>
      </div>

      {/* Bottom Verbatim / Telemetry Callout */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          opacity,
        }}
      >
        <div
          style={{
            background: "rgba(10, 12, 16, 0.85)",
            borderLeft: "4px solid ${accentHex}",
            padding: "14px 20px",
            maxWidth: "680px",
            color: "#F8FAFC",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: 1.4,
              marginBottom: "6px",
            }}
          >
            ${k.quote}
          </div>
          <div style={{ fontSize: "11px", letterSpacing: "2px", color: "rgba(255,255,255,0.65)" }}>
            ${k.footerMeta}
          </div>
        </div>

        <div style={{ fontSize: "12px", opacity: 0.6, textAlign: "right" }}>
          AUDIRA MOTION v4.0
          <br />
          EBU R128 (-14 LUFS)
        </div>
      </div>
    </div>
  );
};
`;
}

function createExampleCode(k) {
  return `import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { ${k.scene1Name} } from "../scene/${k.scene1Name}";
import { ${k.scene2Name} } from "../scene/${k.scene2Name}";
import { get${k.compPrefix}Camera } from "../camera/rig";
import { ${k.compPrefix}Overlay } from "../camera/Overlay";

export const ${k.constPrefix}_EXAMPLE_SECONDS = 12;

export const ${k.compPrefix}Example: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * 60;

  const cam = get${k.compPrefix}Camera(f);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "${k.bgHex}" }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{
          position: cam.position,
          fov: cam.fov,
          near: 0.1,
          far: 60,
        }}
        onCreated={({ camera }) => {
          camera.lookAt(cam.target[0], cam.target[1], cam.target[2]);
        }}
      >
        <ambientLight intensity={0.45} color="#FFFFFF" />
        <directionalLight position={[4.5, 7.5, 5.0]} intensity={1.65} color="#FFF8E7" />
        <directionalLight position={[-4.0, 4.0, -3.5]} intensity={0.75} color="#90CAF9" />

        <${k.scene1Name} f={f} />
        <${k.scene2Name} f={f} />
      </ThreeCanvas>

      <${k.compPrefix}Overlay f={f} />
    </div>
  );
};
`;
}

function createKitMd(k) {
  return `# ${k.constPrefix} — Kit Guide (Style #${k.styleNum})

> ${k.subtitle}

## Quick Start

\`\`\`tsx
import { ${k.compPrefix}Example } from "./example/${k.compPrefix}Example";
import { ${k.scene1Name} } from "./scene/${k.scene1Name}";
import { ${k.scene2Name} } from "./scene/${k.scene2Name}";
import { get${k.compPrefix}Camera } from "./camera/rig";
import { ${k.compPrefix}Overlay } from "./camera/Overlay";
\`\`\`
`;
}

function writeKitFiles(baseDir, k) {
  const dirs = ['camera', 'core', 'example', 'lib', 'scene'];
  dirs.forEach((d) => fs.mkdirSync(path.join(baseDir, d), { recursive: true }));

  fs.writeFileSync(path.join(baseDir, 'lib', 'palette.ts'), k.paletteCode, 'utf8');
  fs.writeFileSync(path.join(baseDir, 'lib', 'materials.ts'), k.materialsCode, 'utf8');
  fs.writeFileSync(path.join(baseDir, 'core', 'motion.ts'), k.motionCode, 'utf8');
  fs.writeFileSync(path.join(baseDir, 'camera', 'rig.ts'), k.rigCode, 'utf8');
  fs.writeFileSync(path.join(baseDir, 'camera', 'Overlay.tsx'), createOverlayCode(k), 'utf8');
  fs.writeFileSync(path.join(baseDir, 'scene', `${k.scene1Name}.tsx`), k.scene1Code, 'utf8');
  fs.writeFileSync(path.join(baseDir, 'scene', `${k.scene2Name}.tsx`), k.scene2Code, 'utf8');
  fs.writeFileSync(path.join(baseDir, 'example', `${k.compPrefix}Example.tsx`), createExampleCode(k), 'utf8');
}

KITS.forEach((k) => {
  // 1. Write to kits/<slug>/KIT.md and kits/<slug>/src/kits/<slug>/...
  const kitRoot = path.join(KITS_DIR, k.slug);
  fs.mkdirSync(kitRoot, { recursive: true });
  fs.writeFileSync(path.join(kitRoot, 'KIT.md'), createKitMd(k), 'utf8');
  writeKitFiles(path.join(kitRoot, 'src', 'kits', k.slug), k);

  // 2. Write to starter/src/kits/<slug>/...
  writeKitFiles(path.join(STARTER_KITS_DIR, k.slug), k);

  // 3. Write reference art direction doc in references/<slug>.md
  const refPath = path.join(ROOT, 'references', `${k.slug}.md`);
  const refContent = `# ${k.title}\n\n${k.subtitle}\n\n- **Kit Path:** \`kits/${k.slug}/\`\n- **Style Number:** #${k.styleNum}\n- **Primary Scene:** \`${k.scene1Name}\` + \`${k.scene2Name}\`\n- **Background Token:** \`${k.bgHex}\`\n- **Badge:** \`${k.badge}\`\n\n## Visual Guardrails\n1. Maintain strict 9:16 mobile safe zones (top 160px / bottom 280px clear).\n2. Pass the Mute Test: visual action and callout overlays must be self-explanatory with audio muted.\n`;
  fs.writeFileSync(refPath, refContent, 'utf8');

  console.log(`[KIT CREATED] #${k.styleNum} ${k.slug} (${k.compPrefix}Example)`);
});

