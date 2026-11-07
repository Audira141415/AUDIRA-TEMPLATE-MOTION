import React from "react";
import { ARCADE_PALETTE as P } from "../lib/palette";
import { ArcadeState, BEAT } from "../core/motion";
import { score } from "../core/game";

const PIXEL = "'Courier New', 'Lucida Console', monospace";

export const ArcadecrtOverlay: React.FC<{ s: ArcadeState; width: number; height: number }> = ({ s, width, height }) => {
  const k = height / 1920;
  const t = s.t;
  const inK = Math.min(1, t / 0.5);
  const quote = t < 2 ? "Midnight. One cabinet still hums in the dark." : t < BEAT.dive ? "Grab the stick, lean in… closer… closer." : t < BEAT.grab ? "Now you're inside the cartridge." : "STAR GET! Every pixel was a world all along.";
  return (
    <div style={{ position: "absolute", inset: 0, width, height, pointerEvents: "none" }}>
      {/* in-world CRT treatment: scanlines + tube vignette (only once we are inside the screen) */}
      {s.inside && (
        <>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.28) 0px, rgba(0,0,0,0.28) ${2 * k}px, rgba(0,0,0,0) ${2 * k}px, rgba(0,0,0,0) ${5 * k}px)` }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.65) 100%)" }} />
        </>
      )}
      {/* dive flash: phosphor white bloom */}
      {s.flash > 0 && <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at center, rgba(235,250,255,${s.flash}) 30%, rgba(46,242,255,${s.flash * 0.8}) 100%)` }} />}
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxSizing: "border-box",
          padding: `${180 * k}px ${56 * k}px ${380 * k}px`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          opacity: inK,
          fontFamily: PIXEL,
          fontWeight: 700,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 22 * k, letterSpacing: 4 * k, color: P.cyan, textShadow: `0 0 ${10 * k}px ${P.cyan}` }}>CREDIT 01 // CAB 66</div>
            <div style={{ fontSize: 70 * k, lineHeight: 1, color: P.yellow, marginTop: 8 * k, letterSpacing: -1 * k, textShadow: `${4 * k}px ${4 * k}px 0 ${P.magenta}, 0 0 ${18 * k}px rgba(255,210,63,0.6)` }}>
              INSERT
              <br />
              WORLD
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ border: `${3 * k}px solid ${P.magenta}`, color: P.white, fontSize: 22 * k, padding: `${8 * k}px ${14 * k}px`, background: "rgba(7,6,15,0.75)", boxShadow: `0 0 ${14 * k}px ${P.magenta}` }}>ARCADECRT // 66</div>
            <div style={{ marginTop: 10 * k, fontSize: 22 * k, color: P.white, textShadow: `0 0 ${8 * k}px ${P.cyan}` }}>1UP {String(score(t)).padStart(6, "0")}</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 * k }}>
          <div style={{ background: "rgba(7,6,15,0.82)", border: `${2 * k}px solid ${P.cyan}`, boxShadow: `0 0 ${16 * k}px rgba(46,242,255,0.45)`, padding: `${14 * k}px ${20 * k}px`, maxWidth: 840 * k }}>
            <div style={{ fontSize: 30 * k, lineHeight: 1.25, color: P.white }}>{quote}</div>
            <div style={{ fontSize: 16 * k, marginTop: 8 * k, color: P.magenta, letterSpacing: 2 * k }}>CRT SCANLINE · RGB FRINGE · VOXEL DIVE</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18 * k, color: P.cyan, letterSpacing: 2 * k }}>
            <span style={{ opacity: s.coinBlink ? 1 : 0.35, color: P.orange }}>PRESS START</span>
            <span>Creator: AUDIRA</span>
          </div>
        </div>
      </div>
    </div>
  );
};
