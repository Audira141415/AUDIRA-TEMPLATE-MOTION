'use client';

import React from 'react';
import { Storyboard, StoryboardLine } from '@/types/motion';

interface Props {
  storyboard: Storyboard;
  currentTime: number;
  currentLine: StoryboardLine | null;
}

export const ZombieSurvivalTemplate: React.FC<Props> = ({ storyboard, currentTime, currentLine }) => {
  // Rotating tactical radar angle
  const radarAngle = (currentTime * 75) % 360;

  return (
    <div className="absolute inset-0 w-full h-full bg-[#0d1409] overflow-hidden select-none font-sans">
      {/* REAL TACTICAL SIMULATION VIDEO BACKGROUND */}
      <video
        src="/reels/zombie_survival.mp4"
        poster="/reels/zombie_survival.jpg"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-105"
      />

      {/* Atmospheric Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/50 pointer-events-none" />

      {/* Dynamic Radar Sweep Overlay in Center */}
      <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-emerald-500/25 pointer-events-none flex items-center justify-center">
        <div 
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/20 via-transparent to-transparent"
          style={{ transform: `rotate(${radarAngle}deg)` }}
        />
        <div className="w-48 h-48 rounded-full border border-dashed border-emerald-400/30" />
      </div>

      {/* TOP TACTICAL HUD */}
      <div className="absolute top-5 inset-x-4 z-40 flex items-center justify-between font-mono pointer-events-none">
        <div className="bg-black/75 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-red-500/40 shadow-2xl flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs font-black text-red-400">OUTBREAK: DAY 42</span>
        </div>
        <div className="bg-black/75 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-emerald-500/30 shadow-2xl text-[10px] font-bold text-emerald-300">
          STATUS: <span className="text-white font-black">FORTIFIED</span>
        </div>
      </div>

      {/* CINEMATIC ALL-CAPS SUBTITLE - EXACT REFERENCE LOOK */}
      <div className="absolute bottom-[22%] inset-x-4 z-40 flex justify-center pointer-events-none text-center">
        <div className="max-w-[92%] px-5 py-2.5 rounded-2xl bg-black/80 backdrop-blur-md border border-white/20 shadow-2xl">
          <p className="text-lg sm:text-xl font-black text-white uppercase tracking-wider drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            {currentLine ? currentLine.text : 'AS LONG AS YOU REMAIN IN THE GROVE'}
          </p>
        </div>
      </div>
    </div>
  );
};
