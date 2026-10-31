'use client';

import React from 'react';
import { Storyboard, StoryboardLine } from '@/types/motion';

interface Props {
  storyboard: Storyboard;
  currentTime: number;
  currentLine: StoryboardLine | null;
}

export const RobloxTemplate: React.FC<Props> = ({ storyboard, currentTime, currentLine }) => {
  const charA = storyboard.characters.characterA;
  const charB = storyboard.characters.characterB;

  const isSpeakerA = currentLine ? currentLine.speaker === charA.name : true;
  const emotion = currentLine?.emotion || 'neutral';

  // Obby jump cycle
  const jumpOffsetA = isSpeakerA && currentLine ? Math.abs(Math.sin(currentTime * 7)) * 18 : 0;
  const jumpOffsetB = !isSpeakerA && currentLine ? Math.abs(Math.sin(currentTime * 7)) * 18 : 0;

  // Head bobbing & arm swing
  const armSwingA = isSpeakerA && currentLine ? Math.sin(currentTime * 12) * 12 : 0;
  const armSwingB = !isSpeakerA && currentLine ? Math.sin(currentTime * 12) * 12 : 0;
  const mouthOpen = currentLine ? (Math.sin(currentTime * 18) > 0.2 ? 1 : 0) : 0;

  // OOF effect trigger
  const isOofMoment = emotion === 'shocked' || emotion === 'angry';

  return (
    <div className="absolute inset-0 w-full h-full bg-[#070b19] overflow-hidden select-none font-sans">
      {/* 3D OBBY SKY & BACKGROUND GRID */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1b3a] via-[#0d1629] to-[#1a0808]" />

        {/* Floating Voxel Clouds */}
        <div 
          className="absolute top-12 left-0 right-0 flex justify-between opacity-25"
          style={{ transform: `translateX(${Math.sin(currentTime * 0.2) * 15}px)` }}
        >
          <div className="w-20 h-8 bg-white rounded-lg shadow-[3px_3px_0_rgba(0,0,0,0.3)] ml-4" />
          <div className="w-28 h-10 bg-white rounded-lg shadow-[4px_4px_0_rgba(0,0,0,0.3)] mr-6" />
        </div>

        {/* Perspective Obby Platforms */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lavaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#b91c1c" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#7f1d1d" stopOpacity="1" />
            </linearGradient>
            <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            </pattern>
          </defs>

          <rect width="1080" height="1920" fill="url(#gridPattern)" />

          {/* Floating Neon Obby Step 1 (Left Cyan) */}
          <g transform="translate(60, 1180)">
            <polygon points="0,50 380,50 410,90 30,90" fill="#0284c7" />
            <polygon points="380,50 410,90 410,130 380,90" fill="#0369a1" />
            <rect x="0" y="0" width="380" height="50" rx="8" fill="#38bdf8" stroke="#000" strokeWidth="6" />
            {[40, 110, 180, 250, 320].map((cx, i) => (
              <circle key={i} cx={cx} cy="25" r="10" fill="#0284c7" stroke="#000" strokeWidth="3" />
            ))}
          </g>

          {/* Floating Neon Obby Step 2 (Center Magenta - Danger Stage) */}
          <g transform="translate(350, 1100)">
            <polygon points="0,50 380,50 410,90 30,90" fill="#be185d" />
            <polygon points="380,50 410,90 410,130 380,90" fill="#9d174d" />
            <rect x="0" y="0" width="380" height="50" rx="8" fill="#f43f5e" stroke="#000" strokeWidth="6" />
            {[40, 110, 180, 250, 320].map((cx, i) => (
              <circle key={i} cx={cx} cy="25" r="10" fill="#be185d" stroke="#000" strokeWidth="3" />
            ))}
          </g>

          {/* Floating Neon Obby Step 3 (Right Lime) */}
          <g transform="translate(640, 1180)">
            <polygon points="0,50 380,50 410,90 30,90" fill="#15803d" />
            <polygon points="380,50 410,90 410,130 380,90" fill="#166534" />
            <rect x="0" y="0" width="380" height="50" rx="8" fill="#22c55e" stroke="#000" strokeWidth="6" />
            {[40, 110, 180, 250, 320].map((cx, i) => (
              <circle key={i} cx={cx} cy="25" r="10" fill="#15803d" stroke="#000" strokeWidth="3" />
            ))}
          </g>

          {/* Glowing Red Lava Floor Below */}
          <rect x="0" y="1660" width="1080" height="260" fill="url(#lavaGrad)" />
          <line x1="0" y1="1660" x2="1080" y2="1660" stroke="#fca5a5" strokeWidth="8" strokeDasharray="16 8" />
        </svg>
      </div>

      {/* ROBLOX TOP IN-GAME HUD - SINGLE UNIFIED NON-OVERLAPPING BAR */}
      <div className="absolute top-3 inset-x-3 z-30 flex items-center justify-between text-white font-mono text-[11px] pointer-events-none">
        {/* Left: Roblox Logo + Location / Stage */}
        <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/20 shadow-md">
          <span className="font-black text-xs text-yellow-400">☰ Roblox</span>
          <span className="text-zinc-500">|</span>
          <span className="text-[10px] font-bold text-cyan-300 truncate max-w-[130px]">
            {storyboard.locationName || 'Tower of Hell'}
          </span>
        </div>

        {/* Right: Robux + Health */}
        <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/20 shadow-md">
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-black flex items-center justify-center text-[9px] font-black">R$</span>
          <span className="text-emerald-300 font-black text-[10px] mr-1">999K</span>
          <div className="w-12 h-2 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
            <div className={`h-full transition-all duration-300 ${isOofMoment ? 'bg-red-500 w-[30%]' : 'bg-emerald-500 w-full'}`} />
          </div>
        </div>
      </div>

      {/* ROBLOX CENTRAL CHAT BUBBLE - DEDICATED DIALOGUE ZONE (NEVER TOUCHES AVATAR FACES) */}
      {currentLine && (
        <div className="absolute top-[14%] inset-x-3 sm:inset-x-4 z-40 flex justify-center pointer-events-none">
          <div className="w-full max-w-[320px] bg-white border-[3px] border-black rounded-2xl p-3 shadow-[6px_6px_0_#000] relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-1 mb-1 border-b border-zinc-200">
              <span className={`text-[11px] font-black uppercase tracking-wider ${
                isSpeakerA ? 'text-blue-600' : 'text-red-600'
              }`}>
                [{currentLine.speaker}] {isSpeakerA ? '💬 (Noob)' : '💬 (Pro)'}
              </span>
              <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase">
                {currentLine.emotion || 'chat'}
              </span>
            </div>
            <p className="text-[13px] sm:text-[14px] font-black text-black leading-snug">
              {currentLine.text}
            </p>
            {/* Dynamic arrow pointing to the speaking avatar */}
            <div 
              className={`absolute -bottom-2.5 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-black transition-all duration-200 ${
                isSpeakerA ? 'left-[25%]' : 'right-[25%]'
              }`}
            />
          </div>
        </div>
      )}

      {/* CHARACTER A: THE CLASSIC ROBLOX NOOB (LEFT SIDE) */}
      <div 
        className="absolute bottom-[16%] left-[6%] z-30 flex flex-col items-center transition-transform duration-100 w-[38%] max-w-[130px]"
        style={{ transform: `translateY(-${jumpOffsetA}px) scale(${isSpeakerA ? 1.05 : 0.92})` }}
      >
        {/* 3D Vector Blocky Avatar: NOOB */}
        <div className="relative w-24 sm:w-28 h-40 sm:h-48 flex flex-col items-center">
          {/* Head: Yellow Block with Classic Roblox Smile :) */}
          <div className="w-12 sm:w-14 h-12 sm:h-14 bg-[#ffd900] rounded-lg border-2 border-black shadow-[3px_3px_0_#000] relative z-20 flex flex-col items-center justify-center">
            <div className="flex gap-2 mb-0.5">
              <div className="w-2 h-2 bg-black rounded-full" />
              <div className="w-2 h-2 bg-black rounded-full" />
            </div>
            {mouthOpen ? (
              <div className="w-3.5 h-2 bg-[#7a1212] rounded-full border border-black" />
            ) : (
              <div className="w-3 h-1 border-b-2 border-black rounded-full" />
            )}
          </div>

          {/* Torso & Arms */}
          <div className="relative flex items-center justify-center mt-[-3px] z-10">
            <div 
              className="w-5 sm:w-6 h-14 sm:h-16 bg-[#ffd900] rounded-sm border-2 border-black shadow-[2px_2px_0_#000] origin-top mr-[-2px]"
              style={{ transform: `rotate(${-10 + armSwingA}deg)` }}
            />
            <div className="w-14 sm:w-16 h-14 sm:h-16 bg-[#0055bf] rounded-sm border-2 border-black shadow-[3px_3px_0_#000] flex items-center justify-center relative">
              <span className="text-white font-black text-lg tracking-tighter drop-shadow-[1px_1px_0_#000]">
                R
              </span>
            </div>
            <div 
              className="w-5 sm:w-6 h-14 sm:h-16 bg-[#ffd900] rounded-sm border-2 border-black shadow-[2px_2px_0_#000] origin-top ml-[-2px]"
              style={{ transform: `rotate(${10 - armSwingA}deg)` }}
            />
          </div>

          {/* Legs: Green Blocks */}
          <div className="flex gap-1 mt-[-3px] z-0">
            <div className="w-6 sm:w-7 h-14 sm:h-16 bg-[#00a850] rounded-b-sm border-2 border-black shadow-[2px_2px_0_#000]" />
            <div className="w-6 sm:w-7 h-14 sm:h-16 bg-[#00a850] rounded-b-sm border-2 border-black shadow-[2px_2px_0_#000]" />
          </div>

          {/* Name Tag */}
          <div className="mt-1 bg-black/80 border border-white/30 px-2 py-0.5 rounded-full text-[9px] font-black text-yellow-300 truncate max-w-full">
            {charA.name} [LV.1]
          </div>
        </div>
      </div>

      {/* CHARACTER B: THE PRO BACON / COOL PLAYER (RIGHT SIDE) */}
      <div 
        className="absolute bottom-[16%] right-[6%] z-30 flex flex-col items-center transition-transform duration-100 w-[38%] max-w-[130px]"
        style={{ transform: `translateY(-${jumpOffsetB}px) scale(${!isSpeakerA ? 1.05 : 0.92})` }}
      >
        {/* 3D Vector Blocky Avatar: PRO BACON */}
        <div className="relative w-24 sm:w-28 h-40 sm:h-48 flex flex-col items-center">
          {/* Hair & Head */}
          <div className="relative w-12 sm:w-14 h-12 sm:h-14">
            <div className="absolute -top-2 left-0 right-0 h-3.5 bg-[#633b1e] rounded-t border border-black flex gap-0.5 px-0.5">
              <div className="w-1.5 h-2.5 bg-[#824f2b] rounded-t" />
              <div className="w-2 h-3.5 bg-[#9c5f34] rounded-t" />
              <div className="w-1.5 h-2.5 bg-[#824f2b] rounded-t" />
            </div>

            <div className="w-12 sm:w-14 h-12 sm:h-14 bg-[#f5d0a9] rounded-lg border-2 border-black shadow-[3px_3px_0_#000] relative z-20 flex flex-col items-center justify-center">
              <div className="w-9 sm:w-10 h-3 bg-black rounded border border-zinc-400 flex items-center justify-between px-1 mb-1">
                <div className="w-1 h-0.5 bg-cyan-400 rounded-sm" />
                <div className="w-1 h-0.5 bg-cyan-400 rounded-sm" />
              </div>
              <div className="w-2.5 h-0.5 border-b-2 border-black rounded-full" />
            </div>
          </div>

          {/* Torso & Arms */}
          <div className="relative flex items-center justify-center mt-[-3px] z-10">
            <div 
              className="w-5 sm:w-6 h-14 sm:h-16 bg-[#1f2937] rounded-sm border-2 border-black shadow-[2px_2px_0_#000] origin-top mr-[-2px]"
              style={{ transform: `rotate(${-10 + armSwingB}deg)` }}
            />
            <div className="w-14 sm:w-16 h-14 sm:h-16 bg-[#111827] rounded-sm border-2 border-black shadow-[3px_3px_0_#000] flex flex-col items-center justify-center relative">
              <div className="w-3.5 h-3.5 rounded-full bg-red-600 flex items-center justify-center font-black text-white text-[8px]">
                ★
              </div>
              <span className="text-[7px] text-zinc-400 font-bold mt-0.5">PRO</span>
            </div>
            <div 
              className="w-5 sm:w-6 h-14 sm:h-16 bg-[#1f2937] rounded-sm border-2 border-black shadow-[2px_2px_0_#000] origin-top ml-[-2px]"
              style={{ transform: `rotate(${10 - armSwingB}deg)` }}
            />
          </div>

          {/* Legs: Dark Pants */}
          <div className="flex gap-1 mt-[-3px] z-0">
            <div className="w-6 sm:w-7 h-14 sm:h-16 bg-[#374151] rounded-b-sm border-2 border-black shadow-[2px_2px_0_#000]" />
            <div className="w-6 sm:w-7 h-14 sm:h-16 bg-[#374151] rounded-b-sm border-2 border-black shadow-[2px_2px_0_#000]" />
          </div>

          {/* Name Tag */}
          <div className="mt-1 bg-black/80 border border-white/30 px-2 py-0.5 rounded-full text-[9px] font-black text-emerald-400 truncate max-w-full">
            {charB.name} [PRO]
          </div>
        </div>
      </div>

      {/* OOF! IMPACT BADGE */}
      {isOofMoment && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none animate-in zoom-in-75 duration-150">
          <div className="bg-red-600 border-3 border-black px-4 py-2 rounded-xl shadow-[6px_6px_0_#000] rotate-[-6deg] flex items-center gap-2">
            <span className="text-2xl font-black text-yellow-300 font-mono tracking-tight drop-shadow-[2px_2px_0_#000]">
              💥 OOF!
            </span>
          </div>
        </div>
      )}

      {/* ROBLOX MOBILE CONTROLS (Jump button in bottom right) */}
      <div className="absolute bottom-4 right-4 z-30 pointer-events-none">
        <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex flex-col items-center justify-center shadow-lg">
          <span className="text-sm">🦘</span>
          <span className="text-[7px] font-black text-white/80">JUMP</span>
        </div>
      </div>
    </div>
  );
};
