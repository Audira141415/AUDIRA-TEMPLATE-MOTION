import React, { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { ARCADE_PALETTE as P } from "../lib/palette";
import { canvasTex, makeCrtMaterial, makeGlowTexture, makeMarquee, makeSideArt } from "../lib/materials";
import { ArcadeState, V3, rng } from "../core/motion";
import { COINS, PLATFORMS, SPRITE, SPRITE_COLORS, STAR, coinTaken, heroX, heroY, isAirborne, score } from "../core/game";

// ---------------------------------------------------------------------------------------------
// Cabinet geometry (faces +z, origin at the floor centre). The CRT sits in a back-leaning bezel.
export const SCREEN = {
  w: 0.6,
  h: 0.78,
  center: [0, 1.575, 0.255] as V3,
  tilt: -0.158, // rotation.x
};
export const screenNormal = (): V3 => [0, Math.sin(-SCREEN.tilt), Math.cos(SCREEN.tilt)];

// ---------------------------------------------------------------------------------------------
// The game raster (96 × 128 px, 8 px per cell) — redrawn every frame from the shared level.
export const RASTER = { w: 96, h: 128, cell: 8, ground: 112 };

const drawSprite = (ctx: CanvasRenderingContext2D, x: number, y: number, legsAlt: boolean) => {
  SPRITE.forEach((row, j) => {
    for (let i = 0; i < row.length; i++) {
      const ch = row[i];
      if (ch === ".") continue;
      let ii = i;
      if (legsAlt && j >= 11) ii = i + (i < 6 ? 1 : -1);
      ctx.fillStyle = SPRITE_COLORS[ch];
      ctx.fillRect(Math.round(x + ii), Math.round(y + j), 1, 1);
    }
  });
};

const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, col: string) => {
  ctx.fillStyle = col;
  ctx.beginPath();
  for (let k = 0; k < 10; k++) {
    const a = (k / 10) * Math.PI * 2 - Math.PI / 2;
    const rad = k % 2 ? r * 0.45 : r;
    if (k === 0) ctx.moveTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
    else ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
  }
  ctx.closePath();
  ctx.fill();
};

const STARS = (() => {
  const r = rng(404);
  return Array.from({ length: 60 }, () => [r() * 400, r() * 90, r() > 0.8 ? 2 : 1] as const);
})();

export const drawGame = (ctx: CanvasRenderingContext2D, t: number) => {
  const { w, h, cell, ground } = RASTER;
  const hx = heroX(t);
  const hy = heroY(t);
  const view0 = hx - 3.6; // cells
  const toPx = (x: number) => (x - view0) * cell;
  const toPy = (y: number) => ground - y * cell;
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = P.gameSky;
  ctx.fillRect(0, 0, w, h);
  // parallax stars + planet
  for (const [sx, sy, sz] of STARS) {
    const x = ((sx - view0 * 2.4) % 400 + 400) % 400;
    if (x < w) {
      ctx.fillStyle = sz > 1 ? P.yellow : P.white;
      ctx.fillRect(Math.floor(x), Math.floor(sy), sz, sz);
    }
  }
  ctx.fillStyle = P.magenta;
  ctx.beginPath();
  ctx.arc(70 - view0 * 0.8, 30, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = P.orange;
  ctx.fillRect(Math.floor(54 - view0 * 0.8), 29, 32, 2);
  // platforms
  for (const p of PLATFORMS) {
    for (let x = Math.floor(p.x0); x < p.x1; x++) {
      const px = toPx(x);
      if (px < -cell || px > w) continue;
      const top = toPy(p.y);
      const bottom = p.y === 0 ? h : top + cell;
      ctx.fillStyle = P.brick;
      ctx.fillRect(Math.round(px), top, cell, bottom - top);
      ctx.fillStyle = P.brickShade;
      for (let yy = top + 3; yy < bottom; yy += 4) ctx.fillRect(Math.round(px) + ((yy / 4) % 2 ? 0 : 4), yy, 4, 1);
      ctx.fillStyle = P.grass;
      ctx.fillRect(Math.round(px), top, cell, 2);
    }
  }
  // coins
  for (const [cx, cy] of COINS) {
    if (coinTaken(t, cx)) continue;
    const px = toPx(cx);
    if (px < -4 || px > w + 4) continue;
    const squash = Math.abs(Math.cos(t * 6 + cx));
    ctx.fillStyle = P.yellow;
    ctx.fillRect(Math.round(px - 2 * squash), Math.round(toPy(cy) - 3), Math.max(1, Math.round(4 * squash)), 6);
  }
  // goal star
  if (t < 10.1) drawStar(ctx, toPx(STAR[0]), toPy(STAR[1]), 6 + Math.sin(t * 8) * 1, P.yellow);
  else if (t < 11.6) {
    ctx.fillStyle = P.yellow;
    ctx.font = "bold 9px monospace";
    ctx.fillText("+5000", toPx(STAR[0]) - 12, toPy(STAR[1]) - 4 - (t - 10.1) * 8);
  }
  // hero
  const legsAlt = !isAirborne(t) && Math.floor(t * 10) % 2 === 0;
  drawSprite(ctx, toPx(hx) - 6, toPy(hy) - 14, legsAlt);
  // HUD
  ctx.fillStyle = P.white;
  ctx.font = "bold 8px monospace";
  ctx.fillText(`1UP ${String(score(t)).padStart(6, "0")}`, 3, 9);
  ctx.fillStyle = P.cyan;
  ctx.fillText("HI 090000", 50, 9);
  if (t < 1.6) {
    ctx.fillStyle = Math.floor(t * 4) % 2 ? P.yellow : P.magenta;
    ctx.fillText("PLAYER 1 READY", 16, 64);
  }
};

// ---------------------------------------------------------------------------------------------
const profile = () => {
  const s = new THREE.Shape();
  const pts: [number, number][] = [
    [-0.5, 0], [0.45, 0], [0.45, 0.92], [0.68, 1.02], [0.68, 1.1], [0.3, 1.2], [0.18, 1.95], [0.48, 2.04], [0.48, 2.36], [-0.5, 2.36],
  ];
  pts.forEach(([z, y], i) => (i ? s.lineTo(z, y) : s.moveTo(z, y)));
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: 1.2, bevelEnabled: false });
  g.rotateY(-Math.PI / 2);
  g.translate(0.6, 0, 0);
  return g;
};

export const CrtCabinet3D: React.FC<{ s: ArcadeState }> = ({ s }) => {
  const res = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = RASTER.w;
    canvas.height = RASTER.h;
    const gameTex = new THREE.CanvasTexture(canvas);
    gameTex.colorSpace = THREE.SRGBColorSpace;
    gameTex.magFilter = THREE.NearestFilter;
    gameTex.minFilter = THREE.LinearFilter;
    gameTex.generateMipmaps = false;
    const crt = makeCrtMaterial(gameTex);
    const side = makeSideArt();
    side.repeat.set(1 / 1.2, 1 / 2.4);
    side.offset.set(0.5 / 1.2 + 0.08, 0);
    const screenGeo = new THREE.PlaneGeometry(SCREEN.w, SCREEN.h, 24, 24);
    const pos = screenGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i) / (SCREEN.w / 2);
      const y = pos.getY(i) / (SCREEN.h / 2);
      pos.setZ(i, 0.035 * (1 - x * x) * (1 - y * y));
    }
    screenGeo.computeVertexNormals();
    return {
      canvas,
      gameTex,
      crt,
      body: profile(),
      sideMat: new THREE.MeshStandardMaterial({ map: side, roughness: 0.35, metalness: 0.1 }),
      bodyMat: new THREE.MeshStandardMaterial({ color: P.cabinet, roughness: 0.4, metalness: 0.15 }),
      screenGeo,
      glow: makeGlowTexture(),
      marquee: makeMarquee(),
      coinText: canvasTex(256, 64, (ctx) => {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, 256, 64);
        ctx.fillStyle = P.orange;
        ctx.font = "bold 34px 'Courier New', monospace";
        ctx.textAlign = "center";
        ctx.fillText("INSERT COIN", 128, 44);
      }),
    };
  }, []);

  useLayoutEffect(() => {
    drawGame(res.canvas.getContext("2d")!, s.t);
    res.gameTex.needsUpdate = true;
    res.crt.uniforms.uPower.value = s.power;
    res.crt.uniforms.uTime.value = s.t;
  });

  const n = screenNormal();
  const panelTilt = Math.atan2(0.1, 0.38); // control panel slope
  return (
    <group>
      <mesh geometry={res.body} material={[res.sideMat, res.bodyMat]} castShadow receiveShadow />
      {/* bezel + CRT */}
      <group position={SCREEN.center} rotation={[SCREEN.tilt, 0, 0]}>
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[0.98, 0.9]} />
          <meshStandardMaterial color={P.bezel} roughness={0.25} metalness={0.4} />
        </mesh>
        <mesh geometry={res.screenGeo} material={res.crt} position={[0, 0, 0.0]} />
        {/* glass reflection sliver */}
        <mesh position={[-0.12, 0.2, 0.05]} rotation={[0, 0, 0.5]}>
          <planeGeometry args={[0.05, 0.5]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.06} depthWrite={false} />
        </mesh>
        {/* phosphor bloom halo */}
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[1.7, 1.9]} />
          <meshBasicMaterial map={res.glow} color={P.cyan} transparent opacity={0.22 * s.power} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      </group>
      <pointLight position={[SCREEN.center[0] + n[0] * 0.6, SCREEN.center[1] + n[1] * 0.6, SCREEN.center[2] + n[2] * 0.6]} color="#9EC9FF" intensity={1.6 * s.power} distance={4} decay={2} />
      {/* marquee */}
      <mesh position={[0, 2.2, 0.485]}>
        <planeGeometry args={[1.12, 0.28]} />
        <meshBasicMaterial map={res.marquee} toneMapped={false} />
      </mesh>
      <mesh position={[0, 2.2, 0.55]}>
        <planeGeometry args={[2.2, 0.9]} />
        <meshBasicMaterial map={res.glow} color={P.magenta} transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 2.3, 1.0]} color={P.magenta} intensity={1.2} distance={4} decay={2} />
      {/* control panel: joystick + three buttons */}
      <group position={[0, 1.155, 0.49]} rotation={[panelTilt, 0, 0]}>
        <mesh position={[0, 0.006, 0]}>
          <boxGeometry args={[1.18, 0.012, 0.36]} />
          <meshStandardMaterial color="#1B1F48" roughness={0.3} metalness={0.2} />
        </mesh>
        <group position={[-0.3, 0.012, 0.02]} rotation={[0.25 * Math.cos(s.t * 3.1), 0, -0.35 * s.stick]}>
          <mesh position={[0, 0.07, 0]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.14, 10]} />
            <meshStandardMaterial color="#C8C8D0" metalness={0.9} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.16, 0]} castShadow>
            <sphereGeometry args={[0.045, 20, 16]} />
            <meshStandardMaterial color={P.magenta} roughness={0.2} />
          </mesh>
        </group>
        {[P.cyan, P.yellow, P.orange].map((c, i) => (
          <mesh key={c} position={[0.05 + i * 0.13, 0.02 - (i === 0 ? s.buttonPress * 0.012 : 0), 0.03 - i * 0.02]}>
            <cylinderGeometry args={[0.04, 0.04, 0.03, 20]} />
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={i === 0 && s.buttonPress ? 0.9 : 0.25} roughness={0.25} />
          </mesh>
        ))}
      </group>
      {/* coin door */}
      <group position={[0, 0.58, 0.455]}>
        <mesh>
          <boxGeometry args={[0.46, 0.36, 0.02]} />
          <meshStandardMaterial color="#0B0D20" roughness={0.3} metalness={0.6} />
        </mesh>
        {[-0.09, 0.09].map((x) => (
          <mesh key={x} position={[x, 0.06, 0.015]}>
            <planeGeometry args={[0.06, 0.09]} />
            <meshBasicMaterial color={s.coinBlink ? P.orange : "#5A2A08"} toneMapped={false} />
          </mesh>
        ))}
        <mesh position={[0, -0.09, 0.015]}>
          <planeGeometry args={[0.36, 0.09]} />
          <meshBasicMaterial map={res.coinText} transparent opacity={s.coinBlink ? 1 : 0.35} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
};
