'use client';

import React from 'react';
import { Storyboard, StoryboardLine } from '@/types/motion';

interface Props {
  storyboard: Storyboard;
  currentTime: number;
  currentLine: StoryboardLine | null;
}

export const DocuStoryTemplate: React.FC<Props> = ({
  storyboard,
  currentTime,
  currentLine,
}) => {
  // Slow Ken Burns zoom scale from 1.0 to 1.15
  const kenBurnsScale = 1 + (currentTime / (storyboard.durationSec || 13)) * 0.15;
  const kenBurnsPanX = Math.sin(currentTime * 0.4) * 15;
  const kenBurnsPanY = Math.cos(currentTime * 0.3) * 10;

  return (
    <div className="relative w-full h-full bg-[#111110] text-[#f4f3f0] overflow-hidden font-serif select-none">
      {/* Cinematic Film Grain & Dust Texture */}
      <div 
        className="absolute inset-0 pointer-events-none z-30 opacity-25 mix-blend-screen"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #000 0%, #000 100%)`,
        }}
      />

      {/* Vignette Edges */}
      <div 
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          boxShadow: 'inset 0 0 100px rgba(0,0,0,0.85)',
        }}
      />

      {/* TOP: ARCHIVE TIMESTAMP & CLASSIFICATION */}
      <div className="absolute top-14 inset-x-6 z-30 flex justify-between items-center text-xs font-mono tracking-widest text-amber-200/70 border-b border-amber-500/20 pb-2">
        <span>ARCHIVE DECLASSIFIED</span>
        <span>REC // 1993.TOKYO</span>
      </div>

      {/* CENTER: KEN BURNS PHOTO FRAME */}
      <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center">
        <div 
          className="w-full h-full transition-transform duration-100 ease-linear"
          style={{
            transform: `scale(${kenBurnsScale}) translate(${kenBurnsPanX}px, ${kenBurnsPanY}px)`,
          }}
        >
          {/* Vintage Archival Illustration / Photo Placeholder */}
          <svg viewBox="0 0 1080 1920" className="w-full h-full object-cover">
            <defs>
              <filter id="sepiaTone">
                <feColorMatrix type="matrix" values="0.393 0.769 0.189 0 0  0.349 0.686 0.168 0 0  0.272 0.534 0.131 0 0  0 0 0 1 0" />
              </filter>
            </defs>
            {/* Dark sepia vintage background */}
            <rect width="1080" height="1920" fill="#292524" />
            <circle cx="540" cy="960" r="420" fill="#44403c" opacity="0.6" />
            
            {/* Scientific diagram / Patent schematic in vintage archival style */}
            <path d="M 240 700 L 840 700 M 540 500 L 540 1300" stroke="#d97706" strokeWidth="6" opacity="0.4" />
            <circle cx="540" cy="700" r="180" fill="none" stroke="#f59e0b" strokeWidth="8" opacity="0.5" strokeDasharray="12 12" />
            <circle cx="540" cy="960" r="260" fill="none" stroke="#d97706" strokeWidth="6" opacity="0.4" />
            
            {/* Waveform signal waves */}
            <path d="M 200 960 Q 370 820 540 960 T 880 960" fill="none" stroke="#fef3c7" strokeWidth="12" opacity="0.7" />
            <path d="M 200 1020 Q 370 1140 540 1020 T 880 1020" fill="none" stroke="#f59e0b" strokeWidth="8" opacity="0.5" />
          </svg>
        </div>
      </div>

      {/* BOTTOM: AUDIO WAVEFORM OSCILLOSCOPE */}
      <div className="absolute bottom-16 inset-x-8 z-30 flex flex-col items-center gap-3">
        {/* Animated Audio Frequency Bars */}
        <div className="flex items-end justify-center gap-1.5 h-12 w-full">
          {Array.from({ length: 24 }).map((_, i) => {
            const barHeight = Math.min(
              100,
              Math.max(15, Math.sin(currentTime * 8 + i * 0.5) * 45 + 50)
            );
            return (
              <div
                key={i}
                className="w-1.5 bg-amber-400/80 rounded-full transition-all duration-75"
                style={{ height: `${barHeight}%` }}
              />
            );
          })}
        </div>

        <div className="text-center font-sans">
          <p className="text-xs text-amber-200/80 font-mono tracking-wider">
            NARRASI DOKUMENTER HISTORIS
          </p>
        </div>
      </div>
    </div>
  );
};

