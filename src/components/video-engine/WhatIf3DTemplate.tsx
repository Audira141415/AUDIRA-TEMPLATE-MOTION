'use client';

import React from 'react';
import { Storyboard, StoryboardLine } from '@/types/motion';

interface Props {
  storyboard: Storyboard;
  currentTime: number;
  currentLine: StoryboardLine | null;
}

export const WhatIf3DTemplate: React.FC<Props> = ({ storyboard, currentTime, currentLine }) => {
  // Live Gas counter simulation (starts at 52M and climbs to 696M+ liters)
  const duration = storyboard.durationSec || 14;
  const progress = Math.min(currentTime / duration, 1);
  const gasVolumeLiters = Math.floor(52000000 + progress * 644857638);
  const formattedGas = gasVolumeLiters.toLocaleString('en-US');

  return (
    <div className="absolute inset-0 w-full h-full bg-[#050c18] overflow-hidden select-none font-sans">
      {/* 3D SIMULATION REAL VIDEO LOOP BACKGROUND */}
      <video
        src="/reels/what_if_3d.mp4"
        poster="/reels/what_if_3d.jpg"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-105"
      />

      {/* Atmospheric Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

      {/* TOP LIVE METRIC TICKER HUD - EXACT VIBE FROM WHAT IF 3D */}
      <div className="absolute top-5 inset-x-4 z-40 flex flex-col items-start font-mono pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/20 shadow-2xl text-left">
          <span className="text-[10px] font-extrabold tracking-widest text-zinc-300 block uppercase">
            GAS RELEASED
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none drop-shadow-md">
            {formattedGas} <span className="text-base text-sky-400 font-bold">L</span>
          </div>
          <span className="text-[9px] font-bold text-sky-300 tracking-wider block mt-0.5">
            8.2 BILLION PEOPLE ON EARTH
          </span>
        </div>
      </div>

      {/* QUESTION HOOK / SUBTITLE - BOLD CINEMATIC SERIF-INSPIRED */}
      <div className="absolute bottom-[22%] inset-x-4 z-40 flex justify-center pointer-events-none text-center">
        <div className="max-w-[92%] px-4 py-2.5 rounded-2xl bg-black/75 backdrop-blur-md border border-white/15 shadow-2xl">
          <p className="text-base sm:text-lg font-black text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] italic">
            &ldquo;{currentLine ? currentLine.text : 'Everyone on Earth farts at once.'}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
};
