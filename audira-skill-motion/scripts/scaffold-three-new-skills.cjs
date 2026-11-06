const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const KITS_DIR = path.join(ROOT, 'kits');
const STARTER_KITS_DIR = path.join(ROOT, 'starter', 'src', 'kits');
const STYLES_DIR = path.join(ROOT, 'styles');

const newSkills = [
  {
    slug: 'tradingterminal',
    styleId: 'trading-terminal',
    styleNum: 41,
    constPrefix: 'TRADINGTERMINAL',
    compPrefix: 'TradingTerminal',
    title: 'TRADINGTERMINAL — Institutional Financial Markets & Crypto Telemetry',
    subtitle: 'Procedural 3D/2D Candlestick charts, Order Book liquidity depth walls, real-time ticker tape, and PnL leverage telemetry.',
    category: 'Finance / Crypto Market Telemetry',
    badge: 'TERMINAL // 41',
    headerTag: '● BLOOMBERG CYBER // BTC/USDT 1D CHART',
    headline: 'BREAKOUT RESISTANCE $94,500',
    quote: '"Order book depth wall absorbs 1,420 BTC buy orders at key psychological pivot."',
    footerMeta: 'RSI 68.4 // EMA 20/50 CROSS // 20X LEVERAGE',
    bgHex: '#06080B',
    palette: {
      background: '#06080B',
      panelDark: '#0E131A',
      bullGreen: '#00E676',
      bearRed: '#FF1744',
      neutralAmber: '#FFB300',
      cyanTelemetry: '#00E5FF',
      text: '#FFFFFF'
    },
    geometry: {
      type: 'candlestick_and_depth_wall_boxes',
      bevelRadius: 0.005,
      polyBudget: 'instanced_quads_and_bars',
      silhouette: 'stepped_liquidity_and_ohlc'
    },
    materials: {
      type: 'emissive_neon_terminal_shaders',
      roughness: 0.15,
      metalness: 0.10,
      clearcoat: 0.20,
      normalMap: 'terminal_grid_scanlines'
    },
    lighting: {
      archetype: 'dark_room_screen_emission',
      keyLight: { kelvin: 6500, intensity: 1.2, angle: [0, 90, 0] },
      fillLight: { kelvin: 7500, intensity: 0.4 },
      rimLight: { kelvin: 8500, intensity: 0.8 },
      ambientOcclusion: { intensity: 0.5, radius: 0.2 }
    },
    camera: {
      type: 'horizontal_trendline_tracker',
      focalLengthMm: 50,
      fovDeg: 34,
      depthOfField: { enabled: false },
      motionConstraint: 'breakout_pan_and_snap_zoom'
    },
    motion: {
      fps: 60,
      physicsModel: 'candlestick_pulse_and_shake',
      characterCadence: 'ticker_tape_tick'
    },
    paletteCode: `export const TRADINGTERMINAL_PALETTE = {
  canvasVoid: "#06080B",
  panelDark: "#0E131A",
  bullGreen: "#00E676",
  bearRed: "#FF1744",
  neutralAmber: "#FFB300",
  cyanTelemetry: "#00E5FF",
  gridLine: "rgba(255, 255, 255, 0.08)",
};`,
    materialsCode: `import * as THREE from "three";
import { TRADINGTERMINAL_PALETTE } from "./palette";

export const getCandleMaterial = (isBull: boolean) =>
  new THREE.MeshStandardMaterial({
    color: isBull ? TRADINGTERMINAL_PALETTE.bullGreen : TRADINGTERMINAL_PALETTE.bearRed,
    emissive: isBull ? TRADINGTERMINAL_PALETTE.bullGreen : TRADINGTERMINAL_PALETTE.bearRed,
    emissiveIntensity: 0.35,
    roughness: 0.2,
    metalness: 0.1,
  });
`,
    motionCode: `export interface TradingTerminalState {
  tickerOffset: number;
  liveCandleY: number;
  depthPulse: number;
  currentPrice: number;
}

export const computeTradingTerminalState = (f: number): TradingTerminalState => {
  const t = f / 60;
  const progress = Math.min(1, f / 90);
  const surge = 1 - Math.pow(1 - progress, 3);
  return {
    tickerOffset: (f * 1.5) % 800,
    liveCandleY: 0.45 + surge * 0.95 + Math.sin(t * 8.0) * 0.04,
    depthPulse: 1 + Math.sin(t * 5.0) * 0.06,
    currentPrice: 91200 + surge * 3300 + Math.sin(t * 6.0) * 45,
  };
};`,
    rigCode: `import { computeTradingTerminalState } from "../core/motion";

export interface TradingTerminalCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getTradingTerminalCamera = (f: number): TradingTerminalCameraConfig => {
  const state = computeTradingTerminalState(f);
  const t = f / 60;
  return {
    position: [0.2 + Math.sin(t * 0.2) * 0.3, 1.45, 5.2 - Math.min(0.5, t * 0.08)],
    target: [0, 0.65, 0],
    fov: 34,
  };
};`,
    scene1Name: 'OrderBookDepthWall3D',
    scene1Code: `import React from "react";
import { computeTradingTerminalState } from "../core/motion";
import { TRADINGTERMINAL_PALETTE } from "../lib/palette";

export const OrderBookDepthWall3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeTradingTerminalState(f);
  return (
    <group position={[0, -0.1, -0.6]}>
      {/* Background Terminal Dark Slab */}
      <mesh position={[0, 0.8, -0.1]}>
        <planeGeometry args={[7.2, 4.5]} />
        <meshBasicMaterial color={TRADINGTERMINAL_PALETTE.panelDark} />
      </mesh>

      {/* Grid Lines */}
      {[-1.2, -0.4, 0.4, 1.2, 2.0].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0]}>
          <planeGeometry args={[6.8, 0.015]} />
          <meshBasicMaterial color="rgba(255, 255, 255, 0.07)" />
        </mesh>
      ))}

      {/* Left Liquidity Depth Wall (Bids - Green Step) */}
      <group position={[-1.8, 0.1, 0]}>
        {[0.3, 0.6, 0.9, 1.25].map((w, idx) => (
          <mesh key={idx} position={[(idx * 0.35) - 0.7, idx * 0.18, 0]}>
            <boxGeometry args={[0.3, 0.35 + idx * 0.25, 0.1]} />
            <meshStandardMaterial
              color={TRADINGTERMINAL_PALETTE.bullGreen}
              emissive={TRADINGTERMINAL_PALETTE.bullGreen}
              emissiveIntensity={0.2}
              transparent
              opacity={0.45}
            />
          </mesh>
        ))}
      </group>

      {/* Right Liquidity Depth Wall (Asks - Red Step) */}
      <group position={[1.8, 0.5, 0]}>
        {[1.25, 0.9, 0.6, 0.3].map((w, idx) => (
          <mesh key={idx} position={[(idx * 0.35) - 0.5, idx * 0.22, 0]}>
            <boxGeometry args={[0.3, 0.4 + idx * 0.28, 0.1]} />
            <meshStandardMaterial
              color={TRADINGTERMINAL_PALETTE.bearRed}
              emissive={TRADINGTERMINAL_PALETTE.bearRed}
              emissiveIntensity={0.2}
              transparent
              opacity={0.45}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};`,
    scene2Name: 'CandlestickChartArena3D',
    scene2Code: `import React from "react";
import { computeTradingTerminalState } from "../core/motion";
import { TRADINGTERMINAL_PALETTE } from "../lib/palette";

export const CandlestickChartArena3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeTradingTerminalState(f);
  const series = [
    { isBull: true, y: 0.1, h: 0.35, lowWick: 0.15, highWick: 0.2 },
    { isBull: false, y: 0.3, h: 0.28, lowWick: 0.12, highWick: 0.15 },
    { isBull: true, y: 0.25, h: 0.45, lowWick: 0.18, highWick: 0.25 },
    { isBull: true, y: 0.55, h: 0.52, lowWick: 0.2, highWick: 0.3 },
    { isBull: false, y: 0.75, h: 0.32, lowWick: 0.14, highWick: 0.18 },
    { isBull: true, y: 0.7, h: 0.65, lowWick: 0.22, highWick: 0.35 },
  ];

  return (
    <group position={[0, 0.25, 0]}>
      {/* Historical Candlesticks */}
      {series.map((c, idx) => {
        const x = (idx - 3.2) * 0.48;
        const col = c.isBull ? TRADINGTERMINAL_PALETTE.bullGreen : TRADINGTERMINAL_PALETTE.bearRed;
        return (
          <group key={idx} position={[x, c.y, 0]}>
            {/* Candle Wick Spine */}
            <mesh position={[0, c.h / 2, 0]}>
              <cylinderGeometry args={[0.012, 0.012, c.h + c.lowWick + c.highWick, 8]} />
              <meshBasicMaterial color={col} />
            </mesh>
            {/* Candle Body Box */}
            <mesh position={[0, c.h / 2, 0]}>
              <boxGeometry args={[0.26, c.h, 0.12]} />
              <meshStandardMaterial
                color={col}
                emissive={col}
                emissiveIntensity={0.3}
                roughness={0.2}
              />
            </mesh>
          </group>
        );
      })}

      {/* Live Surging Hero Breakout Candle */}
      <group position={[0.65, state.liveCandleY, 0]}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.016, 0.016, 1.2, 8]} />
          <meshBasicMaterial color={TRADINGTERMINAL_PALETTE.bullGreen} />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[0.3, 0.8, 0.16]} />
          <meshStandardMaterial
            color={TRADINGTERMINAL_PALETTE.bullGreen}
            emissive={TRADINGTERMINAL_PALETTE.bullGreen}
            emissiveIntensity={0.55}
          />
        </mesh>
        {/* Horizontal Laser Price Line */}
        <mesh position={[1.2, 0.8, 0]}>
          <planeGeometry args={[2.5, 0.02]} />
          <meshBasicMaterial color={TRADINGTERMINAL_PALETTE.cyanTelemetry} />
        </mesh>
      </group>
    </group>
  );
};`
  },
  {
    slug: 'historymap',
    styleId: 'history-map',
    styleNum: 42,
    constPrefix: 'HISTORYMAP',
    compPrefix: 'HistoryMap',
    title: 'HISTORYMAP — Geopolitical & War History Documentary Map Director',
    subtitle: 'Dynamic territorial borders shifting over centuries, tactile military pincer arrows, and continental 3D flyovers.',
    category: 'Cartography / Geopolitical War Documentary',
    badge: 'WAR HISTORY // 42',
    headerTag: '● FRONT TIMELINE // 117 AD - ROMAN EMPIRE',
    headline: 'IMPERIAL ADVANCE ACROSS DANUBE',
    quote: '"Legio XIII Gemina crosses the bridgehead, encircling Dacian strongholds in a classic pincer envelopment."',
    footerMeta: 'DANUBE RIVER BASIN // PINCER ENCIRCLEMENT // YEAR 117 AD',
    bgHex: '#1B2028',
    palette: {
      background: '#1B2028',
      romanCrimson: '#8B1E1E',
      daciaGold: '#C5A059',
      riverBlue: '#254B77',
      terrainNeutral: '#2E3642',
      arrowGlow: '#FF3344',
      text: '#ECEFF4'
    },
    geometry: {
      type: 'topographic_mesh_and_bezier_ribbons',
      bevelRadius: 0.01,
      polyBudget: 'topographic_provinces',
      silhouette: 'river_border_and_tactical_arrows'
    },
    materials: {
      type: 'matte_cartographic_paper_pbr',
      roughness: 0.88,
      metalness: 0.05,
      clearcoat: 0.00,
      normalMap: 'parchment_topography_crease'
    },
    lighting: {
      archetype: 'tactical_situation_room_spot',
      keyLight: { kelvin: 4800, intensity: 1.8, angle: [30, 60, 0] },
      fillLight: { kelvin: 6500, intensity: 0.4 },
      rimLight: { kelvin: 5200, intensity: 0.6 },
      ambientOcclusion: { intensity: 0.7, radius: 0.3 }
    },
    camera: {
      type: 'continental_dive_and_tilt',
      focalLengthMm: 45,
      fovDeg: 36,
      depthOfField: { enabled: false },
      motionConstraint: 'tactical_chokepoint_glide'
    },
    motion: {
      fps: 60,
      physicsModel: 'territorial_wipe_ease',
      characterCadence: 'military_arrow_pulse'
    },
    paletteCode: `export const HISTORYMAP_PALETTE = {
  oceanVoid: "#121822",
  terrainNeutral: "#2E3642",
  romanCrimson: "#8B1E1E",
  daciaGold: "#C5A059",
  riverBlue: "#254B77",
  arrowRed: "#FF3344",
  borderGold: "#D4AF37",
};`,
    materialsCode: `import * as THREE from "three";
import { HISTORYMAP_PALETTE } from "./palette";

export const getTerritoryMaterial = (color: string) =>
  new THREE.MeshStandardMaterial({
    color,
    roughness: 0.85,
    metalness: 0.05,
  });
`,
    motionCode: `export interface HistoryMapState {
  arrowProgress: number;
  territoryWipe: number;
  yearTick: number;
}

export const computeHistoryMapState = (f: number): HistoryMapState => {
  const t = f / 60;
  const progress = Math.min(1, Math.max(0, (f - 10) / 70));
  const ease = 1 - Math.pow(1 - progress, 3);
  return {
    arrowProgress: ease,
    territoryWipe: ease,
    yearTick: Math.floor(101 + ease * 16),
  };
};`,
    rigCode: `export interface HistoryMapCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getHistoryMapCamera = (f: number): HistoryMapCameraConfig => {
  const t = f / 60;
  return {
    position: [Math.sin(t * 0.2) * 0.5, 2.15, 5.4 - t * 0.06],
    target: [0, 0.35, 0],
    fov: 36,
  };
};`,
    scene1Name: 'CartographicTerrain3D',
    scene1Code: `import React from "react";
import { computeHistoryMapState } from "../core/motion";
import { HISTORYMAP_PALETTE } from "../lib/palette";

export const CartographicTerrain3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeHistoryMapState(f);
  return (
    <group>
      {/* Continental Basemap Slab */}
      <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.2, 4.8]} />
        <meshStandardMaterial color={HISTORYMAP_PALETTE.terrainNeutral} roughness={0.9} />
      </mesh>

      {/* S-Curved Danube River Ribbon */}
      <mesh position={[0, -0.18, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6.5, 0.18]} />
        <meshBasicMaterial color={HISTORYMAP_PALETTE.riverBlue} />
      </mesh>

      {/* Expanding Roman Empire Territory Shading */}
      <mesh position={[-1.2 + state.territoryWipe * 0.6, -0.17, -0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.5 + state.territoryWipe * 1.4, 2.2]} />
        <meshStandardMaterial
          color={HISTORYMAP_PALETTE.romanCrimson}
          transparent
          opacity={0.65}
          roughness={0.8}
        />
      </mesh>

      {/* Mountain Ridgelines (Cartographic Hatched Blocks) */}
      {[-1.8, -0.8, 0.2, 1.4].map((x, idx) => (
        <mesh key={idx} position={[x, -0.05, -0.8]}>
          <coneGeometry args={[0.35, 0.35, 4]} />
          <meshStandardMaterial color="#404B5A" roughness={0.88} />
        </mesh>
      ))}
    </group>
  );
};`,
    scene2Name: 'TacticalPincerArrows3D',
    scene2Code: `import React from "react";
import { computeHistoryMapState } from "../core/motion";
import { HISTORYMAP_PALETTE } from "../lib/palette";

export const TacticalPincerArrows3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeHistoryMapState(f);
  const arrowLength = state.arrowProgress * 1.6;

  return (
    <group position={[0, 0.05, 0]}>
      {/* North Pincer Arrow */}
      <group position={[-1.2, 0, 0.3]} rotation={[0, 0.35, 0]}>
        <mesh position={[arrowLength / 2, 0, 0]}>
          <boxGeometry args={[arrowLength, 0.06, 0.16]} />
          <meshBasicMaterial color={HISTORYMAP_PALETTE.arrowRed} />
        </mesh>
        <mesh position={[arrowLength, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <coneGeometry args={[0.18, 0.32, 3]} />
          <meshBasicMaterial color={HISTORYMAP_PALETTE.arrowRed} />
        </mesh>
      </group>

      {/* South Pincer Arrow */}
      <group position={[-1.1, 0, -0.4]} rotation={[0, -0.4, 0]}>
        <mesh position={[arrowLength / 2, 0, 0]}>
          <boxGeometry args={[arrowLength, 0.06, 0.16]} />
          <meshBasicMaterial color={HISTORYMAP_PALETTE.arrowRed} />
        </mesh>
        <mesh position={[arrowLength, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <coneGeometry args={[0.18, 0.32, 3]} />
          <meshBasicMaterial color={HISTORYMAP_PALETTE.arrowRed} />
        </mesh>
      </group>

      {/* Target Clashing Bastion Pin */}
      <mesh position={[0.45, 0.22, -0.05]}>
        <cylinderGeometry args={[0.03, 0.03, 0.45, 12]} />
        <meshBasicMaterial color={HISTORYMAP_PALETTE.borderGold} />
      </mesh>
      <mesh position={[0.45, 0.48, -0.05]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={HISTORYMAP_PALETTE.borderGold} />
      </mesh>
    </group>
  );
};`
  },
  {
    slug: 'islamicdocumentary',
    styleId: 'islamic-flat-documentary',
    styleNum: 43,
    constPrefix: 'ISLAMICDOCUMENTARY',
    compPrefix: 'IslamicDocumentary',
    title: 'ISLAMICDOCUMENTARY — Folk Islam & Islamic Golden Age Motion Director',
    subtitle: 'Sacred Arabesque 8-point stars, architectural dome silhouettes, royal gold leaf, and historical archival reverence.',
    category: 'Cultural / Islamic History Flat Documentary',
    badge: 'FOLK ISLAM // 43',
    headerTag: '● BAITUL HIKMAH // BAGHDAD 830 M',
    headline: 'ERA KEEMASAN ILMU PENGETAHUAN',
    quote: '"Di jantung kota Bundar Baghdad, ratusan ribu naskah ilmuwan dunia diterjemahkan ke dalam tinta emas kebenaran."',
    footerMeta: 'GEOMETRI GIRIH // ADAB VISUAL SHAHIH // OUD AKUSTIK',
    bgHex: '#142032',
    palette: {
      background: '#142032',
      lapisLazuli: '#1A365D',
      khalifahEmerald: '#0F4C3A',
      desertSand: '#E6D5AC',
      royalGold: '#D4AF37',
      cinnabarRed: '#9B2C2C',
      text: '#FFFFFF'
    },
    geometry: {
      type: 'arabesque_8point_stars_and_minarets',
      bevelRadius: 0.02,
      polyBudget: 'geometric_rosettes_and_arches',
      silhouette: 'horseshoe_arch_and_dome'
    },
    materials: {
      type: 'papyrus_and_specular_gold_leaf',
      roughness: 0.45,
      metalness: 0.65,
      clearcoat: 0.30,
      normalMap: 'zellij_mosaic_tiles'
    },
    lighting: {
      archetype: 'golden_hour_desert_sun',
      keyLight: { kelvin: 3400, intensity: 1.8, angle: [35, 45, 10] },
      fillLight: { kelvin: 5200, intensity: 0.5 },
      rimLight: { kelvin: 4000, intensity: 1.1 },
      ambientOcclusion: { intensity: 0.6, radius: 0.25 }
    },
    camera: {
      type: 'floating_sacred_parchment_orbit',
      focalLengthMm: 55,
      fovDeg: 32,
      depthOfField: { enabled: true, fStop: 2.2 },
      motionConstraint: 'slow_zen_reverence'
    },
    motion: {
      fps: 60,
      physicsModel: 'geometric_star_rotation_harmonic',
      characterCadence: 'reverent_parchment_scroll'
    },
    paletteCode: `export const ISLAMICDOCUMENTARY_PALETTE = {
  nightVoid: "#142032",
  lapisLazuli: "#1A365D",
  khalifahEmerald: "#0F4C3A",
  desertSand: "#E6D5AC",
  royalGold: "#D4AF37",
  cinnabarRed: "#9B2C2C",
};`,
    materialsCode: `import * as THREE from "three";
import { ISLAMICDOCUMENTARY_PALETTE } from "./palette";

export const getGoldMaterial = () =>
  new THREE.MeshStandardMaterial({
    color: ISLAMICDOCUMENTARY_PALETTE.royalGold,
    metalness: 0.88,
    roughness: 0.25,
    emissive: ISLAMICDOCUMENTARY_PALETTE.royalGold,
    emissiveIntensity: 0.25,
  });
`,
    motionCode: `export interface IslamicDocumentaryState {
  starRotation: number;
  domeReveal: number;
  lightPulse: number;
}

export const computeIslamicDocumentaryState = (f: number): IslamicDocumentaryState => {
  const t = f / 60;
  return {
    starRotation: t * 0.25,
    domeReveal: Math.min(1, f / 60),
    lightPulse: 1 + Math.sin(t * 2.5) * 0.12,
  };
};`,
    rigCode: `export interface IslamicDocumentaryCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getIslamicDocumentaryCamera = (f: number): IslamicDocumentaryCameraConfig => {
  const t = f / 60;
  return {
    position: [Math.sin(t * 0.25) * 0.6, 1.25, 5.2],
    target: [0, 0.45, 0],
    fov: 34,
  };
};`,
    scene1Name: 'ArabesqueGirihPortal3D',
    scene1Code: `import React from "react";
import { computeIslamicDocumentaryState } from "../core/motion";
import { ISLAMICDOCUMENTARY_PALETTE } from "../lib/palette";

export const ArabesqueGirihPortal3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeIslamicDocumentaryState(f);
  return (
    <group position={[0, 0.45, -0.3]}>
      {/* Background Lapis Lazuli Arch Portal */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[4.2, 4.2]} />
        <meshStandardMaterial color={ISLAMICDOCUMENTARY_PALETTE.lapisLazuli} roughness={0.7} />
      </mesh>

      {/* Primary Rotating Sacred 8-Point Star (Two Interlocking Squares) */}
      <group rotation={[0, 0, state.starRotation]}>
        <mesh>
          <boxGeometry args={[1.6, 1.6, 0.05]} />
          <meshStandardMaterial
            color={ISLAMICDOCUMENTARY_PALETTE.royalGold}
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[1.6, 1.6, 0.05]} />
          <meshStandardMaterial
            color={ISLAMICDOCUMENTARY_PALETTE.royalGold}
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>
        {/* Inner Emerald Octagon Core */}
        <mesh position={[0, 0, 0.04]}>
          <cylinderGeometry args={[0.65, 0.65, 0.04, 8]} />
          <meshStandardMaterial
            color={ISLAMICDOCUMENTARY_PALETTE.khalifahEmerald}
            roughness={0.5}
          />
        </mesh>
      </group>
    </group>
  );
};`,
    scene2Name: 'MosqueSilhouetteSkyline3D',
    scene2Code: `import React from "react";
import { computeIslamicDocumentaryState } from "../core/motion";
import { ISLAMICDOCUMENTARY_PALETTE } from "../lib/palette";

export const MosqueSilhouetteSkyline3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeIslamicDocumentaryState(f);
  return (
    <group position={[0, -0.45, 0.4]}>
      {/* Central Majestic Grand Dome Silhouette */}
      <mesh position={[0, 0.5, 0]} scale={[state.lightPulse, state.lightPulse, 1]}>
        <sphereGeometry args={[0.75, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={ISLAMICDOCUMENTARY_PALETTE.royalGold}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Left Slender Minaret */}
      <group position={[-1.6, 0.65, 0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.09, 1.6, 16]} />
          <meshStandardMaterial color={ISLAMICDOCUMENTARY_PALETTE.desertSand} roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <coneGeometry args={[0.11, 0.35, 16]} />
          <meshStandardMaterial color={ISLAMICDOCUMENTARY_PALETTE.royalGold} metalness={0.8} />
        </mesh>
      </group>

      {/* Right Slender Minaret */}
      <group position={[1.6, 0.65, 0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.09, 1.6, 16]} />
          <meshStandardMaterial color={ISLAMICDOCUMENTARY_PALETTE.desertSand} roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <coneGeometry args={[0.11, 0.35, 16]} />
          <meshStandardMaterial color={ISLAMICDOCUMENTARY_PALETTE.royalGold} metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
};`
  }
];

function createOverlayCode(k) {
  const textColor = '#ECEFF4';
  const badgeBg = 'rgba(10, 14, 20, 0.88)';
  const accentHex = k.palette.neutralAmber || k.palette.borderGold || k.palette.royalGold || '#FFB300';

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
            background: "rgba(10, 14, 20, 0.86)",
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

function generateStyleDnaSuite(s) {
  const dir = path.join(STYLES_DIR, s.styleId);
  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(path.join(dir, 'style.md'), `# STYLE DNA: ${s.title} — Style Overview\n# AUDIRA STYLE DNA LIBRARY\n\n**Style ID:** \`${s.styleId}\` (Audira Style #${s.styleNum})  \n**Internal Engine Kit:** \`kits/${s.slug}/\`  \n**Classification:** ${s.category}\n\n## Palette\n\`\`\`json\n${JSON.stringify(s.palette, null, 2)}\n\`\`\`\n`, 'utf8');
  fs.writeFileSync(path.join(dir, 'geometry.md'), `# STYLE DNA: ${s.title} — Geometry\n- **Mesh Classification:** \`${s.geometry.type}\`\n- **Silhouette:** \`${s.geometry.silhouette}\`\n`, 'utf8');
  fs.writeFileSync(path.join(dir, 'materials.md'), `# STYLE DNA: ${s.title} — Materials\n- **Archetype:** \`${s.materials.type}\`\n- **Roughness:** \`${s.materials.roughness}\`\n- **Metalness:** \`${s.materials.metalness}\`\n`, 'utf8');
  fs.writeFileSync(path.join(dir, 'lighting.md'), `# STYLE DNA: ${s.title} — Lighting\n- **Archetype:** \`${s.lighting.archetype}\`\n`, 'utf8');
  fs.writeFileSync(path.join(dir, 'camera.md'), `# STYLE DNA: ${s.title} — Camera\n- **Rig:** \`${s.camera.type}\` (${s.camera.focalLengthMm}mm, FOV ${s.camera.fovDeg}°)\n`, 'utf8');
  fs.writeFileSync(path.join(dir, 'motion.md'), `# STYLE DNA: ${s.title} — Motion\n- **FPS:** \`${s.motion.fps}\`\n- **Physics:** \`${s.motion.physicsModel}\`\n`, 'utf8');
  fs.writeFileSync(path.join(dir, 'dna.json'), JSON.stringify({
    $schema: 'https://audira.io/schemas/visual-dna.v1.json',
    styleId: s.styleId,
    styleNumber: s.styleNum,
    name: s.title,
    kit: s.slug,
    category: s.category,
    palette: s.palette,
    geometry: s.geometry,
    materials: s.materials,
    lighting: s.lighting,
    camera: s.camera,
    motion: s.motion,
  }, null, 2), 'utf8');
}

newSkills.forEach((k) => {
  // 1. Generate Style DNA in styles/<styleId>/
  generateStyleDnaSuite(k);

  // 2. Write to kits/<slug>/
  const kitRoot = path.join(KITS_DIR, k.slug);
  fs.mkdirSync(kitRoot, { recursive: true });
  fs.writeFileSync(path.join(kitRoot, 'KIT.md'), createKitMd(k), 'utf8');
  writeKitFiles(path.join(kitRoot, 'src', 'kits', k.slug), k);

  // 3. Write to starter/src/kits/<slug>/
  writeKitFiles(path.join(STARTER_KITS_DIR, k.slug), k);

  // 4. Write reference doc in references/<slug>.md
  const refPath = path.join(ROOT, 'references', `${k.slug}.md`);
  const refContent = `# ${k.title}\n\n${k.subtitle}\n\n- **Kit Path:** \`kits/${k.slug}/\`\n- **Style Number:** #${k.styleNum}\n- **Primary Scenes:** \`${k.scene1Name}\` + \`${k.scene2Name}\`\n- **Background Token:** \`${k.bgHex}\`\n- **Badge:** \`${k.badge}\`\n\n## Visual Guardrails\n1. Maintain strict 9:16 mobile safe zones (top 160px / bottom 280px clear).\n2. Pass the Mute Test: visual action and callout overlays must be self-explanatory with audio muted.\n`;
  fs.writeFileSync(refPath, refContent, 'utf8');

  console.log(`[STYLE KIT CREATED] #${k.styleNum} ${k.slug} (${k.compPrefix}Example)`);
});

