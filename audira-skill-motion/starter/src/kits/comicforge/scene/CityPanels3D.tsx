import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { COMIC_PALETTE as P } from "../lib/palette";
import { drawDotField, makeCanvasTexture } from "../lib/materials";
import { rng } from "../core/motion";
import { ComicMats, InkBox, Inked } from "./Ink";

// ---------- Background: halftone night sky (C+M dots over a magenta horizon glow) ----------
const Sky: React.FC = () => {
  const tex = useMemo(
    () =>
      makeCanvasTexture(512, 1024, (ctx) => {
        const g = ctx.createLinearGradient(0, 0, 0, 1024);
        g.addColorStop(0, P.skyTop);
        g.addColorStop(0.55, "#7A2E9E");
        g.addColorStop(1, P.skyLow);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 512, 1024);
        // magenta Ben-Day dots densest at the horizon
        ctx.globalAlpha = 0.55;
        drawDotField(ctx, 0, 0, 512, 1024, "rgba(0,0,0,0)", P.magenta, 18, (_u, v) => v * v);
        ctx.globalAlpha = 0.35;
        drawDotField(ctx, 0, 0, 512, 1024, "rgba(0,0,0,0)", P.cyan, 22, (_u, v) => (1 - v) * 0.7);
        ctx.globalAlpha = 1;
        // big yellow comic moon
        ctx.fillStyle = P.yellow;
        ctx.strokeStyle = P.ink;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(150, 300, 70, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        drawDotField(ctx, 95, 245, 110, 110, "rgba(0,0,0,0)", P.yellowShade, 10, (u, v) => {
          const d = Math.hypot(u - 0.5, v - 0.5);
          return d < 0.48 ? Math.max(0, (u + v - 0.9) * 0.9) : 0;
        });
      }),
    [],
  );
  return (
    <mesh position={[0, 8, -42]}>
      <planeGeometry args={[80, 110]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
};

// ---------- Midground: instanced skyline with ink hulls and lit windows ----------
type Bld = { x: number; z: number; w: number; d: number; h: number };

const buildCity = (): Bld[] => {
  const r = rng(51);
  const out: Bld[] = [];
  for (let row = 0; row < 4; row++) {
    const z = -8 - row * 6.5;
    let x = -16 + r() * 1.5;
    while (x < 16) {
      const w = 1.6 + r() * 2.2;
      const h = 3 + r() * (5 + row * 2.6);
      out.push({ x: x + w / 2, z: z - r() * 2, w, d: 1.8 + r() * 1.5, h });
      x += w + 0.35 + r() * 0.8;
    }
  }
  return out;
};

const Skyline: React.FC<{ mats: ComicMats }> = ({ mats }) => {
  const blds = useMemo(buildCity, []);
  const body = useRef<THREE.InstancedMesh>(null);
  const hull = useRef<THREE.InstancedMesh>(null);
  const win = useRef<THREE.InstancedMesh>(null);
  const windows = useMemo(() => {
    const r = rng(7);
    const list: { p: [number, number, number]; lit: boolean }[] = [];
    for (const b of blds) {
      const cols = Math.max(2, Math.floor(b.w / 0.55));
      const rows = Math.floor((b.h - 0.6) / 0.75);
      for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++) {
          const px = b.x - b.w / 2 + (i + 0.5) * (b.w / cols);
          list.push({ p: [px, 0.6 + j * 0.75, b.z + b.d / 2 + 0.012], lit: r() > 0.55 });
        }
    }
    return list;
  }, [blds]);

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    blds.forEach((b, i) => {
      m.compose(new THREE.Vector3(b.x, b.h / 2 - 3, b.z), new THREE.Quaternion(), new THREE.Vector3(b.w, b.h, b.d));
      body.current!.setMatrixAt(i, m);
      const t = 0.08;
      m.compose(new THREE.Vector3(b.x, b.h / 2 - 3, b.z), new THREE.Quaternion(), new THREE.Vector3(b.w + t * 2, b.h + t * 2, b.d + t * 2));
      hull.current!.setMatrixAt(i, m);
    });
    body.current!.instanceMatrix.needsUpdate = true;
    hull.current!.instanceMatrix.needsUpdate = true;
    const c = new THREE.Color();
    windows.forEach((w, i) => {
      m.compose(new THREE.Vector3(w.p[0], w.p[1] - 3, w.p[2]), new THREE.Quaternion(), new THREE.Vector3(1, 1, 1));
      win.current!.setMatrixAt(i, m);
      win.current!.setColorAt(i, c.set(w.lit ? P.yellow : "#27306E"));
    });
    win.current!.instanceMatrix.needsUpdate = true;
    if (win.current!.instanceColor) win.current!.instanceColor.needsUpdate = true;
  }, [blds, windows]);

  return (
    <group>
      <instancedMesh ref={body} args={[undefined, mats.concrete, blds.length]}>
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>
      <instancedMesh ref={hull} args={[undefined, backInkSide, blds.length]}>
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>
      <instancedMesh ref={win} args={[undefined, undefined, windows.length]}>
        <planeGeometry args={[0.3, 0.42]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
};

const backInkSide = new THREE.MeshBasicMaterial({ color: P.ink, side: THREE.BackSide });

// ---------- Foreground: the hero's rooftop ----------
const Rooftop: React.FC<{ mats: ComicMats }> = ({ mats }) => {
  const geo = useMemo(
    () => ({
      tank: new THREE.CylinderGeometry(0.75, 0.75, 1.3, 20),
      roof: new THREE.ConeGeometry(0.85, 0.6, 20),
      leg: new THREE.CylinderGeometry(0.05, 0.05, 1.2, 6),
      mast: new THREE.CylinderGeometry(0.04, 0.06, 2.6, 6),
      ball: new THREE.SphereGeometry(0.12, 12, 10),
    }),
    [],
  );
  return (
    <group>
      <InkBox size={[6.5, 9, 6]} position={[-0.6, -4.5, 0.3]} material={mats.concrete} ink={backInkSide} t={0.06} />
      {/* parapet ledges */}
      {[
        { s: [6.7, 0.35, 0.3] as [number, number, number], p: [-0.6, 0.17, 3.3] as [number, number, number] },
        { s: [0.3, 0.35, 6.2] as [number, number, number], p: [2.65, 0.17, 0.3] as [number, number, number] },
        { s: [0.3, 0.35, 6.2] as [number, number, number], p: [-3.85, 0.17, 0.3] as [number, number, number] },
      ].map((l, i) => (
        <InkBox key={i} size={l.s} position={l.p} material={mats.steel} ink={backInkSide} t={0.04} />
      ))}
      {/* water tower */}
      <group position={[-2.4, 0, -1.6]}>
        {[
          [-0.5, -0.5],
          [0.5, -0.5],
          [-0.5, 0.5],
          [0.5, 0.5],
        ].map(([x, z], i) => (
          <Inked key={i} geometry={geo.leg} material={mats.steel} outline={mats.outlineThin} position={[x, 0.6, z]} />
        ))}
        <Inked geometry={geo.tank} material={mats.red} outline={mats.outline} position={[0, 1.85, 0]} />
        <Inked geometry={geo.roof} material={mats.steel} outline={mats.outline} position={[0, 2.8, 0]} />
      </group>
      {/* AC unit + antenna */}
      <InkBox size={[1.1, 0.7, 0.8]} position={[1.4, 0.35, -1.5]} material={mats.steel} ink={backInkSide} t={0.04} />
      <InkBox size={[0.7, 0.05, 0.7]} position={[1.4, 0.73, -1.5]} material={mats.ink} ink={backInkSide} t={0.0} />
      <Inked geometry={geo.mast} material={mats.steel} outline={mats.outlineThin} position={[2.1, 1.3, -2.3]} />
      <Inked geometry={geo.ball} material={mats.red} outline={mats.outlineThin} position={[2.1, 2.65, -2.3]} />
      {/* neighbour rooftops dropping away into the street */}
      <InkBox size={[4, 12, 4]} position={[5.4, -7.6, -1.5]} material={mats.concrete} ink={backInkSide} t={0.06} />
      <InkBox size={[3.5, 12, 3]} position={[-6.6, -7, -2.5]} material={mats.concrete} ink={backInkSide} t={0.06} />
    </group>
  );
};

// ---------- Comic page with a panel-shaped hole the camera flies through ----------
type PageTheme = "cover" | "action";

const makePageTexture = (theme: PageTheme, holeW: number, holeH: number, pw: number, ph: number) =>
  makeCanvasTexture(1024, Math.round((1024 * ph) / pw), (ctx) => {
    const W = 1024;
    const H = Math.round((1024 * ph) / pw);
    const sx = W / pw;
    ctx.fillStyle = P.newsprint;
    ctx.fillRect(0, 0, W, H);
    const hx = W / 2 - (holeW / 2) * sx;
    const hy = H / 2 - (holeH / 2) * sx;
    const hw = holeW * sx;
    const hh = holeH * sx;
    const g = 22; // gutter
    const panel = (x: number, y: number, w: number, h: number, bg: string, dot: string, cov: (u: number, v: number) => number) => {
      drawDotField(ctx, x, y, w, h, bg, dot, 14, cov);
      ctx.strokeStyle = P.ink;
      ctx.lineWidth = 9;
      ctx.strokeRect(x, y, w, h);
    };
    if (theme === "cover") {
      panel(40, 40, W - 80, hy - g - 40, P.yellow, P.red, (u, v) => 0.15 + u * 0.5 * v);
      panel(40, hy + hh + g, W - 80, H - (hy + hh + g) - 40, P.cyan, P.skyTop, (u) => 0.2 + u * 0.5);
      panel(40, hy, hx - g - 40, hh, P.magenta, P.yellow, (_u, v) => v * 0.6);
      panel(hx + hw + g, hy, W - 40 - (hx + hw + g), hh, P.magenta, P.yellow, (_u, v) => (1 - v) * 0.6);
      // masthead lettering
      ctx.save();
      ctx.translate(W / 2, 40 + (hy - g - 40) * 0.55);
      ctx.rotate(-0.05);
      ctx.font = "italic 900 118px Impact, 'Arial Black', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineWidth = 18;
      ctx.strokeStyle = P.ink;
      ctx.strokeText("SKYLINE GUARDIAN", 0, 0);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText("SKYLINE GUARDIAN", 0, 0);
      ctx.restore();
      ctx.font = "900 40px Impact, sans-serif";
      ctx.fillStyle = P.ink;
      ctx.textAlign = "left";
      ctx.fillText("ISSUE 51  •  10¢", 70, 95);
    } else {
      panel(40, 40, (W - 80) * 0.58, hy - g - 40, P.cyan, P.skyTop, (u, v) => u * v);
      panel(40 + (W - 80) * 0.58 + g, 40, (W - 80) * 0.42 - g, hy - g - 40, P.red, P.yellow, () => 0.35);
      panel(40, hy + hh + g, W - 80, H - (hy + hh + g) - 40, P.yellow, P.magenta, (u) => u * 0.6);
      panel(40, hy, hx - g - 40, hh, P.skyTop, P.cyan, (_u, v) => 0.6 - v * 0.5);
      panel(hx + hw + g, hy, W - 40 - (hx + hw + g), hh, P.cyan, P.ink, (_u, v) => v * 0.4);
    }
    // the window panel itself: heavy key-line border around the hole
    ctx.strokeStyle = P.ink;
    ctx.lineWidth = 16;
    ctx.strokeRect(hx + 4, hy + 4, hw - 8, hh - 8);
    // narration caption box overlapping the hole border
    ctx.fillStyle = P.yellow;
    const cw = hw * 0.78;
    ctx.fillRect(hx - 6, hy - 6, cw, 74);
    ctx.lineWidth = 7;
    ctx.strokeRect(hx - 6, hy - 6, cw, 74);
    ctx.fillStyle = P.ink;
    ctx.font = "900 34px Impact, 'Arial Black', sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(theme === "cover" ? "MEANWHILE, ABOVE NEON BAY..." : "A SHADOW CROSSES THE MOON!", hx + 14, hy + 31);
  });

const PanelPage: React.FC<{ z: number; holeW: number; holeH: number; cy: number; tilt: number; theme: PageTheme }> = ({ z, holeW, holeH, cy, tilt, theme }) => {
  const pw = 12;
  const ph = 18;
  const { geo, tex } = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-40, -40);
    s.lineTo(40, -40);
    s.lineTo(40, 40);
    s.lineTo(-40, 40);
    s.lineTo(-40, -40);
    const h = new THREE.Path();
    h.moveTo(-holeW / 2, -holeH / 2);
    h.lineTo(-holeW / 2, holeH / 2);
    h.lineTo(holeW / 2, holeH / 2);
    h.lineTo(holeW / 2, -holeH / 2);
    h.lineTo(-holeW / 2, -holeH / 2);
    s.holes.push(h);
    const g = new THREE.ShapeGeometry(s);
    const t = makePageTexture(theme, holeW, holeH, pw, ph);
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    t.repeat.set(1 / pw, 1 / ph);
    t.offset.set(0.5, 0.5);
    return { geo: g, tex: t };
  }, [holeW, holeH, theme]);
  const frame = 0.09;
  return (
    <group position={[0, cy, z]} rotation={[0, 0, tilt]}>
      <mesh geometry={geo}>
        <meshBasicMaterial map={tex} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      {/* physical card thickness of the panel border */}
      {[
        [0, holeH / 2, holeW + frame * 2, frame],
        [0, -holeH / 2, holeW + frame * 2, frame],
        [holeW / 2, 0, frame, holeH],
        [-holeW / 2, 0, frame, holeH],
      ].map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, -0.12]}>
          <boxGeometry args={[w, h, 0.24]} />
          <meshBasicMaterial color={P.ink} />
        </mesh>
      ))}
    </group>
  );
};

export const CityPanels3D: React.FC<{ mats: ComicMats }> = ({ mats }) => (
  <group>
    <Sky />
    <Skyline mats={mats} />
    <Rooftop mats={mats} />
    <PanelPage z={20} holeW={4.0} holeH={6.4} cy={2.4} tilt={0} theme="cover" />
    <PanelPage z={12.5} holeW={5.6} holeH={8.4} cy={2.6} tilt={0.07} theme="action" />
  </group>
);
