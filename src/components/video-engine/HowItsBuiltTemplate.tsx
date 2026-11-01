'use client';

import React from 'react';
import { Storyboard, StoryboardLine } from '@/types/motion';

interface Props {
  storyboard: Storyboard;
  currentTime: number;
  currentLine: StoryboardLine | null;
}

export const HowItsBuiltTemplate: React.FC<Props> = ({ storyboard, currentTime, currentLine }) => {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#18110b] overflow-hidden select-none font-sans">
      {/* REAL 3D ARCHITECTURAL CUTAWAY VIDEO BACKGROUND */}
      <video
        src="/reels/how_its_built.mp4"
        poster="/reels/how_its_built.jpg"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-105"
      />

      {/* Atmospheric Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 pointer-events-none" />

      {/* TOP ARCHITECTURAL METRIC HUD */}
      <div className="absolute top-5 inset-x-4 z-40 flex items-center justify-between font-mono pointer-events-none">
        <div className="bg-black/75 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-amber-500/30 shadow-2xl flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span className="text-xs font-black text-amber-300">DEPTH: -12.4 METERS</span>
        </div>
        <div className="bg-black/75 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 shadow-2xl text-[10px] font-bold text-zinc-300">
          TEMP: <span className="text-emerald-400 font-black">21°C</span> • O2: <span className="text-sky-400 font-black">99.4%</span>
        </div>
      </div>

      {/* HOOK SUBTITLE AT BOTTOM */}
      <div className="absolute bottom-[20%] inset-x-4 z-40 flex justify-center pointer-events-none text-center">
        <div className="max-w-[92%] px-4 py-2.5 rounded-2xl bg-black/85 backdrop-blur-md border border-white/15 shadow-2xl">
          <p className="text-base sm:text-lg font-black text-white tracking-tight leading-snug drop-shadow-md">
            {currentLine ? currentLine.text : 'A real build, cut open and shown step by step: the underground greenhouse.'}
          </p>
        </div>
      </div>
    </div>
  );
};
