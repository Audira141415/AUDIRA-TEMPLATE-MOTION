'use client';

import React from 'react';
import { Storyboard, StoryboardLine } from '@/types/motion';

interface Props {
  storyboard: Storyboard;
  currentTime: number;
  currentLine: StoryboardLine | null;
}

export const CleanExplainerTemplate: React.FC<Props> = ({
  storyboard,
  currentTime,
  currentLine,
}) => {
  // Step indicator (1 to 3) based on time
  const currentStep = currentTime < 3.8 ? 1 : currentTime < 7.8 ? 2 : 3;

  // Metric growth animation
  const chartHeight1 = Math.min(85, Math.max(20, Math.floor(currentTime * 18)));
  const chartHeight2 = Math.min(65, Math.max(15, Math.floor(currentTime * 12)));
  const chartHeight3 = Math.min(95, Math.max(25, Math.floor(currentTime * 22)));

  return (
    <div className="relative w-full h-full bg-[#09090b] text-white overflow-hidden font-sans select-none p-6 flex flex-col justify-between">
      {/* Subtle Background Radial Gradient */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 20%, #6366f1 0%, transparent 60%)',
        }}
      />

      {/* TOP HEADER & SOURCE CITATION */}
      <div className="relative z-20 pt-8 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold tracking-widest uppercase">
            FRAMEWORK DATA
          </span>
          <span className="text-[11px] text-zinc-400 font-mono">
            REF: ALGO-REPORT-2026
          </span>
        </div>
        <h1 className="text-xl md:text-2xl font-black text-white leading-tight">
          {storyboard.title}
        </h1>
      </div>

      {/* CENTER: ANIMATED STEP CARDS & DATA CHARTS */}
      <div className="relative z-10 flex flex-col items-center gap-6 my-auto">
        {/* Step Progress Pills */}
        <div className="flex items-center gap-2 w-full max-w-[320px]">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                step <= currentStep
                  ? 'bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-[0_0_12px_rgba(99,102,241,0.5)]'
                  : 'bg-zinc-800'
              }`}
            />
          ))}
        </div>

        {/* Dynamic Graphic Card */}
        <div className="w-full max-w-[320px] bg-zinc-900/90 rounded-2xl p-5 border border-zinc-800 backdrop-blur-xl shadow-2xl flex flex-col gap-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400 font-medium">Retention Score Benchmark</span>
            <span className="text-indigo-400 font-mono font-bold">+148% Viral Boost</span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-32 flex items-end justify-between gap-4 pt-4 border-b border-zinc-800">
            {/* Bar 1 */}
            <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <div 
                className="w-full bg-zinc-700 rounded-t-md transition-all duration-500"
                style={{ height: `${chartHeight2}%` }}
              />
              <span className="text-[10px] text-zinc-400 font-mono">0.0s</span>
            </div>
            {/* Bar 2 (Hook Retention) */}
            <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <div 
                className="w-full bg-indigo-500 rounded-t-md transition-all duration-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                style={{ height: `${chartHeight1}%` }}
              />
              <span className="text-[10px] text-indigo-300 font-mono font-bold">0.4s</span>
            </div>
            {/* Bar 3 (Outro Loop) */}
            <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <div 
                className="w-full bg-cyan-400 rounded-t-md transition-all duration-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                style={{ height: `${chartHeight3}%` }}
              />
              <span className="text-[10px] text-cyan-300 font-mono font-bold">12s</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-black text-sm">
              {currentStep}
            </div>
            <div className="text-xs text-zinc-300">
              {currentStep === 1 && "Detik Pertama: Potong nafas, hook visual meledak"}
              {currentStep === 2 && "Tengah: Ganti angle kamera tiap 2 detik"}
              {currentStep === 3 && "Akhir: Outro memancing debat di komentar"}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM CITATION & CALLOUT */}
      <div className="relative z-20 pb-8 flex flex-col gap-2 text-center">
        <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 text-xs text-zinc-300">
          <span className="font-bold text-white">Actionable Tip:</span> {storyboard.commentMagnetHook}
        </div>
      </div>
    </div>
  );
};

