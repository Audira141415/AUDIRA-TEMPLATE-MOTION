'use client';

import React from 'react';
import { Storyboard, StoryboardLine } from '@/types/motion';

interface Props {
  storyboard: Storyboard;
  currentTime: number;
  currentLine: StoryboardLine | null;
}

export const CosmicVoyageTemplate: React.FC<Props> = ({ storyboard, currentTime, currentLine }) => {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#02040a] overflow-hidden select-none font-sans">
      {/* REAL PHOTOREALISTIC 3D PLANET VIDEO BACKGROUND */}
      <video
        src="/reels/cosmic_voyage.mp4"
        poster="/reels/cosmic_voyage.jpg"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-105"
      />

      {/* Atmospheric Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 pointer-events-none" />

      {/* TOP YOUTUBE LONG-FORM BADGE */}
      <div className="absolute top-5 left-4 z-40 font-mono pointer-events-none">
        <div className="bg-black/75 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20 shadow-2xl flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span className="text-[10px] font-black tracking-widest text-white uppercase">YOUTUBE</span>
        </div>
      </div>

      {/* ORBITAL TELEMETRY LEFT HUD */}
      <div className="absolute top-[32%] left-4 z-40 font-mono pointer-events-none max-w-[190px]">
        <div className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none drop-shadow-md">
          8 months
        </div>
        <p className="text-[10px] text-zinc-300 font-medium leading-relaxed mt-1 opacity-90 drop-shadow">
          THE JOURNEY AT THE EQUATOR IS 40,075 KILOMETERS.
        </p>
      </div>

      {/* SUBTITLE FOOTER - EXACT REFERENCE TEXT */}
      <div className="absolute bottom-[20%] inset-x-4 z-40 flex justify-center pointer-events-none text-center">
        <div className="max-w-[92%] px-4 py-2.5 rounded-2xl bg-black/80 backdrop-blur-md border border-white/15 shadow-2xl">
          <p className="text-xs sm:text-sm font-bold text-zinc-200 tracking-wide drop-shadow italic">
            &ldquo;{currentLine ? currentLine.text : 'The equator moves slower than a bicycle.'}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
};
