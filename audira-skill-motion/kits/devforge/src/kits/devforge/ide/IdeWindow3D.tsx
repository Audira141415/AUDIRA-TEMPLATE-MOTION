import React, { useMemo } from "react";
import * as THREE from "three";
import { DEVFORGE_PALETTE } from "../lib/palette";
import { computeDevforgeState } from "../core/motion";

const CODE_LINES = [
  "-- Roblox Luau // Monetized Game Loop",
  "local Marketplace = game:GetService('MarketplaceService')",
  "local Players = game:GetService('Players')",
  "",
  "local PASS_ID = 84920194 -- Double Coins VIP",
  "",
  "local function onPlayerTouch(hitPart)",
  "    local char = hitPart.Parent",
  "    local player = Players:GetPlayerFromCharacter(char)",
  "    if player then",
  "        local hasPass = Marketplace:UserOwnsGamePassAsync(player.UserId, PASS_ID)",
  "        local reward = hasPass and 100 or 50",
  "        awardCoins(player, reward)",
  "        spawnVisualReward(char.PrimaryPart.Position)",
  "    end",
  "end",
  "",
  "print('[SUCCESS] Game monetization loop active!')",
];

export const IdeWindow3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeDevforgeState(f);

  // Generate dynamic syntax-highlighted IDE texture
  const texture = useMemo(() => {
    if (typeof document === "undefined") return new THREE.Texture();
    const cv = document.createElement("canvas");
    cv.width = 1024;
    cv.height = 720;
    const ctx = cv.getContext("2d");
    if (!ctx) return new THREE.Texture();

    // Editor Background
    ctx.fillStyle = DEVFORGE_PALETTE.editorBg;
    ctx.roundRect(0, 0, 1024, 720, 20);
    ctx.fill();

    // Editor Header Bar
    ctx.fillStyle = DEVFORGE_PALETTE.editorHeader;
    ctx.roundRect(0, 0, 1024, 56, [20, 20, 0, 0]);
    ctx.fill();

    // macOS Window Control Buttons
    ctx.fillStyle = DEVFORGE_PALETTE.windowButtonRed;
    ctx.beginPath(); ctx.arc(28, 28, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = DEVFORGE_PALETTE.windowButtonYellow;
    ctx.beginPath(); ctx.arc(52, 28, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = DEVFORGE_PALETTE.windowButtonGreen;
    ctx.beginPath(); ctx.arc(76, 28, 7, 0, Math.PI * 2); ctx.fill();

    // Tab Header
    ctx.fillStyle = DEVFORGE_PALETTE.editorBg;
    ctx.fillRect(110, 12, 210, 44);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 15px monospace";
    ctx.fillText("game_monetize.luau", 130, 39);

    // Line Numbers Gutter
    ctx.fillStyle = DEVFORGE_PALETTE.editorBorder;
    ctx.fillRect(72, 56, 1, 664);

    // Render Typewriter Code
    let totalCharsRevealed = state.codeCharCount;
    let yPos = 92;

    ctx.font = "16px monospace";
    for (let i = 0; i < CODE_LINES.length; i++) {
      const line = CODE_LINES[i];
      // Draw Line Number
      ctx.fillStyle = DEVFORGE_PALETTE.codeComment;
      ctx.fillText(String(i + 1).padStart(2, " "), 28, yPos);

      // Determine text substring to draw
      if (totalCharsRevealed <= 0) break;
      const charsInLine = Math.min(line.length, totalCharsRevealed);
      const textToDraw = line.slice(0, charsInLine);
      totalCharsRevealed -= line.length;

      // Syntax Highlight Colors
      if (line.startsWith("--")) {
        ctx.fillStyle = DEVFORGE_PALETTE.codeComment;
      } else if (line.includes("local ") || line.includes("function") || line.includes("end") || line.includes("then")) {
        ctx.fillStyle = DEVFORGE_PALETTE.codeKeyword;
      } else if (line.includes("'") || line.includes('"')) {
        ctx.fillStyle = DEVFORGE_PALETTE.codeString;
      } else if (line.includes(":") || line.includes("print")) {
        ctx.fillStyle = DEVFORGE_PALETTE.codeFunc;
      } else {
        ctx.fillStyle = "#E6EDF3";
      }

      ctx.fillText(textToDraw, 94, yPos);
      yPos += 30;
    }

    const tex = new THREE.CanvasTexture(cv);
    tex.needsUpdate = true;
    return tex;
  }, [state.codeCharCount]);

  return (
    <group position={[0, state.windowHoverZ, 0]} rotation={[state.windowTiltX, state.windowTiltY, 0]}>
      {/* 3D Glassmorphic IDE Frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.2, 2.25, 0.08]} />
        <meshPhysicalMaterial
          color={DEVFORGE_PALETTE.editorBg}
          roughness={0.1}
          metalness={0.2}
          clearcoat={0.9}
        />
      </mesh>

      {/* Code Screen Faceplate */}
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[3.16, 2.21]} />
        <meshBasicMaterial map={texture} />
      </mesh>

      {/* Luminous Neon Frame Border */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(3.22, 2.27, 0.09)]} />
        <lineBasicMaterial color={DEVFORGE_PALETTE.accentNeon} transparent opacity={0.65} />
      </lineSegments>

      {/* 3D Game Block / Coin that Spawns Out of the Screen */}
      {state.spawnProgress > 0 && (
        <group
          position={[0.7, -0.2, 0.1 + state.spawnProgress * 0.9]}
          rotation={[f * 0.05, f * 0.06, 0]}
          scale={[state.spawnProgress, state.spawnProgress, state.spawnProgress]}
        >
          {/* Main Gold Robux Coin / Stud Box */}
          <mesh>
            <cylinderGeometry args={[0.35, 0.35, 0.12, 24]} />
            <meshStandardMaterial
              color={DEVFORGE_PALETTE.amberGold}
              metalness={0.85}
              roughness={0.2}
              emissive={DEVFORGE_PALETTE.amberGold}
              emissiveIntensity={0.2}
            />
          </mesh>
          {/* Stud Center Node */}
          <mesh position={[0, 0.07, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.08, 16]} />
            <meshStandardMaterial color={DEVFORGE_PALETTE.amberGold} metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Luminous Particle Halo */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.48, 0.015, 12, 32]} />
            <meshBasicMaterial color={DEVFORGE_PALETTE.metricProfit} transparent opacity={0.7} />
          </mesh>
        </group>
      )}
    </group>
  );
};
