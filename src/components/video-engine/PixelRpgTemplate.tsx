'use client';

import React from 'react';
import { Storyboard, StoryboardLine } from '@/types/motion';

interface Props {
  storyboard: Storyboard;
  currentTime: number;
  currentLine: StoryboardLine | null;
}

export const PixelRpgTemplate: React.FC<Props> = ({
  storyboard,
  currentTime,
  currentLine,
}) => {
  // Stamina/HP drops over time
  const playerHp = Math.max(10, Math.floor(100 - (currentTime / (storyboard.durationSec || 13)) * 85));
  const bossHp = Math.max(35, Math.floor(100 - (currentTime / (storyboard.durationSec || 13)) * 40));

  // Sprite animation bobbing
  const bobbing = Math.floor((currentTime * 4) % 2) * 8;

  return (
    <div className="relative w-full h-full bg-[#0a0d14] text-white overflow-hidden font-mono select-none">
      {/* 16-bit Scanline CRT Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-30 opacity-20"
        style={{
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Top Retro HUD: Encounter Name & Level */}
      <div className="absolute top-14 inset-x-4 z-20 flex justify-between items-center bg-black/80 p-3 rounded-lg border-2 border-emerald-500 shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 animate-ping rounded-none"></span>
          <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">
            BOSS BATTLE: MEETING 17:00
          </span>
        </div>
        <span className="text-xs font-bold text-yellow-400 bg-yellow-950/80 px-2 py-0.5 border border-yellow-500">
          LVL 99
        </span>
      </div>

      {/* Retro 16-Bit Battle Stage */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between pt-28 pb-48 px-6">
        {/* ENEMY / BOSS AREA (Top Right) */}
        <div className="flex flex-col items-end">
          {/* Boss Stats Box */}
          <div className="bg-black/90 p-3 border-2 border-white rounded-md w-64 shadow-brutal-sm mb-4">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-red-400">LORD OVERTIME</span>
              <span>LV.99</span>
            </div>
            <div className="w-full bg-zinc-800 h-3 border border-zinc-600 rounded-none overflow-hidden">
              <div 
                className="bg-red-500 h-full transition-all duration-300"
                style={{ width: `${bossHp}%` }}
              />
            </div>
            <div className="text-right text-[10px] text-zinc-400 mt-0.5">HP {bossHp}/100</div>
          </div>

          {/* Boss Pixel Sprite */}
          <div 
            className="w-40 h-40 transition-transform duration-150"
            style={{ transform: `translateY(${bobbing}px)` }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]">
              {/* Boss Body */}
              <rect x="25" y="30" width="50" height="50" fill="#dc2626" />
              <rect x="35" y="40" width="30" height="30" fill="#991b1b" />
              {/* Boss Horns */}
              <rect x="15" y="15" width="15" height="20" fill="#facc15" />
              <rect x="70" y="15" width="15" height="20" fill="#facc15" />
              {/* Glowing Red Eyes */}
              <rect x="32" y="45" width="10" height="8" fill="#ffffff" />
              <rect x="58" y="45" width="10" height="8" fill="#ffffff" />
              <rect x="35" y="47" width="5" height="5" fill="#000000" />
              <rect x="61" y="47" width="5" height="5" fill="#000000" />
            </svg>
          </div>
        </div>

        {/* HERO / PLAYER AREA (Bottom Left) */}
        <div className="flex flex-col items-start mt-6">
          {/* Hero Pixel Sprite */}
          <div 
            className="w-36 h-36 transition-transform duration-150 mb-3 ml-4"
            style={{ transform: `translateY(${-bobbing}px)` }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]">
              {/* Hero Cloak & Armor */}
              <rect x="30" y="35" width="40" height="45" fill="#2563eb" />
              <rect x="40" y="45" width="20" height="25" fill="#60a5fa" />
              {/* Sword */}
              <rect x="75" y="20" width="8" height="50" fill="#e2e8f0" />
              <rect x="70" y="60" width="18" height="6" fill="#f59e0b" />
              {/* Helmet & Eyes */}
              <rect x="35" y="18" width="30" height="22" fill="#475569" />
              <rect x="42" y="26" width="6" height="4" fill="#38bdf8" />
              <rect x="52" y="26" width="6" height="4" fill="#38bdf8" />
            </svg>
          </div>

          {/* Hero Stats Box */}
          <div className="bg-black/90 p-3 border-2 border-emerald-400 rounded-md w-64 shadow-brutal-sm">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-emerald-400">YOU (TIRED STAFF)</span>
              <span>LV.14</span>
            </div>
            <div className="w-full bg-zinc-800 h-3 border border-zinc-600 rounded-none overflow-hidden mb-1">
              <div 
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${playerHp}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-zinc-400">
              <span>HP {playerHp}/100</span>
              <span className="text-cyan-400">MP 12/50</span>
            </div>
          </div>
        </div>
      </div>

      {/* Classic 8-Bit Dialogue & Command Box at the Bottom */}
      <div className="absolute bottom-6 inset-x-4 z-40">
        <div className="bg-[#0f172a] p-4 rounded-lg border-4 border-white shadow-brutal flex flex-col gap-3">
          {/* Action Command Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs font-black">
            <button className="bg-emerald-600 hover:bg-emerald-500 p-2 text-left border-2 border-black flex items-center justify-between">
              <span>▶ [A] ALIBI SINYAL</span>
              <span className="text-[10px] text-emerald-200">5 MP</span>
            </button>
            <button className="bg-red-700 hover:bg-red-600 p-2 text-left border-2 border-black flex items-center justify-between">
              <span>▶ [B] PASRAH LEMBUR</span>
              <span className="text-[10px] text-red-200">99 HP</span>
            </button>
          </div>

          {/* Dialog prompt */}
          <div className="bg-black p-3 border-2 border-zinc-700 rounded text-xs text-yellow-300 flex items-start gap-2">
            <span className="animate-pulse">▶</span>
            <p className="leading-relaxed font-bold">
              {currentLine ? currentLine.text : storyboard.commentMagnetHook}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

