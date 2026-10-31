'use client';

import React from 'react';
import { Storyboard, StoryboardLine } from '@/types/motion';

interface Props {
  storyboard: Storyboard;
  currentTime: number;
  currentLine: StoryboardLine | null;
}

export const WhiteboardTemplate: React.FC<Props> = ({
  storyboard,
  currentTime,
  currentLine,
}) => {
  // SVG drawing progress based on total elapsed time
  const progress = Math.min(1, Math.max(0, currentTime / (storyboard.durationSec || 12)));
  const pathTotalLength = 2400;
  const strokeOffset = pathTotalLength * (1 - progress);

  // Position of the marker hand along a curved path
  const handX = 200 + Math.sin(currentTime * 3) * 120 + progress * 400;
  const handY = 380 + Math.cos(currentTime * 2.5) * 80 + progress * 300;

  return (
    <div className="relative w-full h-full bg-[#f8f9fa] text-zinc-900 overflow-hidden font-sans select-none">
      {/* Paper / Whiteboard Grid Texture */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#94a3b8 1.5px, transparent 1.5px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Top Header Badge */}
      <div className="absolute top-16 inset-x-0 flex justify-center z-20">
        <div className="px-4 py-1.5 rounded-full bg-blue-100 border-2 border-blue-600 text-xs font-black text-blue-900 shadow-brutal-sm flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></span>
          LIVE WHITEBOARD DRAWING
        </div>
      </div>

      {/* SVG Canvas with Animated Path Tracing */}
      <svg viewBox="0 0 1080 1920" className="w-full h-full absolute inset-0 z-10 pointer-events-none">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#0284c7" />
          </marker>
        </defs>

        {/* Diagram Box 1: Brain Part A */}
        <g opacity={currentTime > 1 ? 1 : 0.2}>
          <rect x="140" y="380" width="360" height="220" rx="16" fill="#eff6ff" stroke="#1d4ed8" strokeWidth="8" strokeDasharray="6 6" />
          <text x="320" y="470" fill="#1e3a8a" textAnchor="middle" fontSize="32" fontWeight="900">
            PREFRONTAL
          </text>
          <text x="320" y="520" fill="#3b82f6" textAnchor="middle" fontSize="22" fontWeight="700">
            Logika & Masa Depan
          </text>
        </g>

        {/* Arrow between boxes */}
        <path
          d="M 520 490 L 720 490"
          stroke="#0284c7"
          strokeWidth="10"
          fill="none"
          markerEnd="url(#arrow)"
          strokeDasharray="600"
          strokeDashoffset={currentTime > 2 ? 0 : 600}
          className="transition-all duration-700"
        />

        {/* Diagram Box 2: Brain Part B */}
        <g opacity={currentTime > 4 ? 1 : 0.2}>
          <rect x="740" y="380" width="300" height="220" rx="16" fill="#fef2f2" stroke="#dc2626" strokeWidth="8" />
          <text x="890" y="470" fill="#991b1b" textAnchor="middle" fontSize="32" fontWeight="900">
            LIMBIK
          </text>
          <text x="890" y="520" fill="#ef4444" textAnchor="middle" fontSize="22" fontWeight="700">
            Rebahan & Dopamin
          </text>
        </g>

        {/* Big Animated Brain Sketch in the Center */}
        <path
          d="M 540 850 C 440 700 240 750 220 950 C 200 1150 400 1250 540 1350 C 680 1250 880 1150 860 950 C 840 750 640 700 540 850 Z"
          fill="none"
          stroke="#0f172a"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={pathTotalLength}
          strokeDashoffset={strokeOffset}
        />

        {/* Internal Neural Circuit Lines */}
        <path
          d="M 540 900 Q 420 1020 540 1150 Q 660 1020 540 900"
          fill="none"
          stroke="#2563eb"
          strokeWidth="8"
          strokeDasharray="1000"
          strokeDashoffset={currentTime > 5 ? 0 : 1000}
        />
      </svg>

      {/* Floating Marker Pen & Hand Icon */}
      <div 
        className="absolute z-30 transition-transform duration-75 pointer-events-none"
        style={{
          transform: `translate(${handX}px, ${handY}px) rotate(-25deg)`,
        }}
      >
        <div className="relative">
          {/* Marker Pen */}
          <div className="w-10 h-36 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 rounded-t-lg shadow-2xl border-2 border-black flex flex-col items-center">
            <div className="w-6 h-10 bg-zinc-900 mt-1 rounded-sm"></div>
            <div className="w-4 h-6 bg-zinc-800"></div>
            {/* Chisel Tip */}
            <div className="w-3 h-5 bg-blue-400 rounded-b-sm"></div>
          </div>
          {/* Hand Silhouette */}
          <div className="absolute -top-4 -right-10 w-24 h-24 bg-[#fed7aa] border-2 border-black rounded-full opacity-90 shadow-md"></div>
        </div>
      </div>

      {/* Big Key Metric Pill in Lower Half */}
      <div className="absolute bottom-24 inset-x-8 z-30">
        <div className="bg-white/95 p-5 rounded-2xl border-4 border-black shadow-brutal text-center">
          <span className="text-xs font-black uppercase text-red-600 tracking-wider block mb-1">
            FAKTA SAINS
          </span>
          <p className="font-black text-xl text-zinc-900 leading-snug">
            {currentLine ? currentLine.text : storyboard.commentMagnetHook}
          </p>
        </div>
      </div>
    </div>
  );
};

