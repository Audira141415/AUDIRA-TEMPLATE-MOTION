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
  const layout = storyboard.visualLayout;
  const showHeader = layout?.showHeader !== false;
  const showGraphic = layout?.showGraphic !== false;
  const showCallout = layout?.showCallout !== false;
  const graphicScale = layout?.graphicScale || 'normal';
  const theme = layout?.canvasTheme || 'default';
  const subY = storyboard.subtitleConfig?.customY ?? 68;

  // Determine smart layout offset based on subtitle position to guarantee ZERO collision
  const isSubtitleUpper = subY < 36;
  const isSubtitleCenter = subY >= 36 && subY <= 56;
  const isSubtitleLower = subY > 56 && subY <= 76;
  const isSubtitleBottom = subY > 76;

  // Step indicator (1 to 3) based on time
  const currentStep = currentTime < 3.8 ? 1 : currentTime < 7.8 ? 2 : 3;

  // Metric growth animation
  const chartHeight1 = Math.min(85, Math.max(20, Math.floor(currentTime * 18)));
  const chartHeight2 = Math.min(65, Math.max(15, Math.floor(currentTime * 12)));
  const chartHeight3 = Math.min(95, Math.max(25, Math.floor(currentTime * 22)));

  // Theme styling configurations
  const themeStyles = {
    default: {
      bg: 'bg-[#09090b]',
      gradient: 'radial-gradient(circle at 50% 15%, #4f46e5 0%, transparent 60%)',
      accentBadge: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400',
      pillActive: 'bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-[0_0_12px_rgba(99,102,241,0.5)]',
      cardBg: 'bg-zinc-900/90 border-zinc-800',
      chartBar2: 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]',
      stepBox: 'bg-indigo-600/20 text-indigo-400',
    },
    obsidian: {
      bg: 'bg-[#050507]',
      gradient: 'radial-gradient(circle at 50% 10%, #27272a 0%, transparent 50%)',
      accentBadge: 'bg-zinc-800 border-zinc-700 text-zinc-300',
      pillActive: 'bg-gradient-to-r from-zinc-300 to-zinc-500 shadow-[0_0_10px_rgba(255,255,255,0.2)]',
      cardBg: 'bg-zinc-950/95 border-zinc-800',
      chartBar2: 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.4)]',
      stepBox: 'bg-zinc-800 text-white',
    },
    cyber_grid: {
      bg: 'bg-[#030914]',
      gradient: 'radial-gradient(circle at 50% 20%, #0284c7 0%, transparent 70%)',
      accentBadge: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300',
      pillActive: 'bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_12px_rgba(6,182,212,0.6)]',
      cardBg: 'bg-[#061325]/90 border-cyan-900/60',
      chartBar2: 'bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.7)]',
      stepBox: 'bg-cyan-500/20 text-cyan-300',
    },
    amber_studio: {
      bg: 'bg-[#120b05]',
      gradient: 'radial-gradient(circle at 50% 15%, #d97706 0%, transparent 60%)',
      accentBadge: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
      pillActive: 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]',
      cardBg: 'bg-[#1c120a]/90 border-amber-900/50',
      chartBar2: 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.6)]',
      stepBox: 'bg-amber-500/20 text-amber-300',
    },
    neon_bloom: {
      bg: 'bg-[#0e0517]',
      gradient: 'radial-gradient(circle at 50% 15%, #9333ea 0%, transparent 60%)',
      accentBadge: 'bg-purple-500/20 border-purple-500/40 text-purple-300',
      pillActive: 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_12px_rgba(168,85,247,0.5)]',
      cardBg: 'bg-[#180a29]/90 border-purple-900/50',
      chartBar2: 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.6)]',
      stepBox: 'bg-purple-500/20 text-purple-300',
    },
  }[theme] || {
    bg: 'bg-[#09090b]',
    gradient: 'radial-gradient(circle at 50% 15%, #4f46e5 0%, transparent 60%)',
    accentBadge: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400',
    pillActive: 'bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-[0_0_12px_rgba(99,102,241,0.5)]',
    cardBg: 'bg-zinc-900/90 border-zinc-800',
    chartBar2: 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]',
    stepBox: 'bg-indigo-600/20 text-indigo-400',
  };

  return (
    <div className={`relative w-full h-full ${themeStyles.bg} text-white overflow-hidden font-sans select-none p-5 flex flex-col justify-between`}>
      {/* Dynamic Ambient Background Glow */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none transition-all duration-500"
        style={{ background: themeStyles.gradient }}
      />

      {/* Cyber Grid Pattern for Tech Theme */}
      {theme === 'cyber_grid' && (
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #0284c7 1px, transparent 1px), linear-gradient(to bottom, #0284c7 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      )}

      {/* ZONE 1: TOP HEADER & SOURCE CITATION (NON-COLLIDING SAFE BOUNDS) */}
      {showHeader ? (
        <div className={`relative z-20 pt-2 pb-1 flex flex-col gap-1 transition-all ${
          isSubtitleUpper ? 'max-h-[60px]' : 'opacity-100'
        }`}>
          <div className="flex justify-between items-center">
            <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black tracking-widest uppercase ${themeStyles.accentBadge}`}>
              FRAMEWORK DATA
            </span>
            <span className="text-[9px] text-zinc-400 font-mono">
              REF: ALGO-2026
            </span>
          </div>
          <h1 className={`font-black text-white leading-tight tracking-tight ${
            isSubtitleUpper 
              ? 'text-xs line-clamp-1 truncate' 
              : 'text-sm sm:text-base line-clamp-2'
          }`}>
            {storyboard.title}
          </h1>
        </div>
      ) : (
        <div className="h-2" />
      )}

      {/* ZONE 2: CENTER ANIMATED GRAPHIC & DATA CHARTS */}
      {showGraphic ? (
        <div className={`relative z-10 flex flex-col items-center gap-2 transition-all duration-300 ${
          isSubtitleUpper 
            ? 'mt-auto mb-2 scale-[0.92]' 
            : isSubtitleCenter 
            ? 'mt-auto mb-3 scale-[0.88]' 
            : isSubtitleBottom
            ? 'my-auto scale-[0.98]'
            : 'mt-1 mb-auto'
        } ${
          graphicScale === 'compact' ? 'scale-90' : graphicScale === 'large' ? 'scale-105' : ''
        }`}>
          {/* Step Progress Bar Pills */}
          <div className="flex items-center gap-1.5 w-full max-w-[290px]">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                  step <= currentStep
                    ? themeStyles.pillActive
                    : 'bg-zinc-800/80'
                }`}
              />
            ))}
          </div>

          {/* Dynamic Graphic Card (Calibrated Height for Zero Collision with Subtitles) */}
          <div className={`w-full max-w-[290px] rounded-2xl p-3 border backdrop-blur-xl shadow-xl flex flex-col gap-2 transition-colors ${themeStyles.cardBg}`}>
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-zinc-400 font-medium">
                {layout?.customMediaUrl ? 'Dokumen & Bukti Visual' : 'Retention Score Benchmark'}
              </span>
              <span className="text-cyan-400 font-mono font-bold">
                {layout?.customMediaUrl ? 'VERIFIKASI A1' : '+148% Viral Boost'}
              </span>
            </div>

            {layout?.customMediaUrl ? (
              <div className="relative w-full h-24 sm:h-28 rounded-xl overflow-hidden border border-zinc-700 bg-black/60 flex items-center justify-center">
                <img
                  src={layout.customMediaUrl}
                  alt={layout.customMediaLabel || 'Bukti Media'}
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/85 text-[8px] font-mono text-cyan-300 border border-cyan-800">
                  {layout.customMediaLabel || 'LAMPIRAN BUKTI'}
                </div>
              </div>
            ) : (
              /* Bar Chart Visualization (Compact h-16 sm:h-20) */
              <div className="h-16 sm:h-20 flex items-end justify-between gap-3 pt-1 border-b border-zinc-800/80 pb-1.5">
                {/* Bar 1 */}
                <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <div 
                    className="w-full bg-zinc-700/80 rounded-t transition-all duration-500"
                    style={{ height: `${chartHeight2}%` }}
                  />
                  <span className="text-[9px] text-zinc-400 font-mono">0.0s</span>
                </div>
                {/* Bar 2 (Hook Retention) */}
                <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <div 
                    className={`w-full rounded-t transition-all duration-500 ${themeStyles.chartBar2}`}
                    style={{ height: `${chartHeight1}%` }}
                  />
                  <span className="text-[9px] text-indigo-300 font-mono font-bold">0.4s</span>
                </div>
                {/* Bar 3 (Outro Loop) */}
                <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <div 
                    className="w-full bg-cyan-400 rounded-t transition-all duration-500 shadow-[0_0_12px_rgba(6,182,212,0.5)]"
                    style={{ height: `${chartHeight3}%` }}
                  />
                  <span className="text-[9px] text-cyan-300 font-mono font-bold">12s</span>
                </div>
              </div>
            )}

            {/* Step Explanation Snippet */}
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-md flex items-center justify-center font-black text-[11px] shrink-0 ${themeStyles.stepBox}`}>
                {currentStep}
              </div>
              <div className="text-[10px] sm:text-[11px] text-zinc-300 line-clamp-1 leading-snug">
                {currentStep === 1 && "Detik 1: Potong nafas, hook visual meledak"}
                {currentStep === 2 && "Tengah: Ganti angle kamera tiap 2 detik"}
                {currentStep === 3 && "Akhir: Outro memancing debat di komentar"}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-zinc-600 text-xs font-mono uppercase tracking-widest">
            • Focus Mode (Visual Disembunyikan) •
          </div>
        </div>
      )}

      {/* ZONE 3: BOTTOM ACTIONABLE TIP (SEPARATED FROM SUBTITLE DOCK) */}
      {showCallout && !isSubtitleBottom ? (
        <div className={`relative z-20 pb-2 flex flex-col gap-1 text-center transition-all ${
          isSubtitleLower ? 'opacity-90 scale-95' : 'opacity-100'
        }`}>
          <div className="p-2 sm:p-2.5 bg-zinc-900/90 rounded-xl border border-zinc-800/90 text-[10px] sm:text-[11px] text-zinc-300 backdrop-blur-md shadow-lg">
            <span className="font-bold text-white mr-1">Actionable Tip:</span>
            {storyboard.commentMagnetHook || "Simpan video ini biar lo inget langkah nomor duanya!"}
          </div>
        </div>
      ) : (
        <div className="h-2" />
      )}
    </div>
  );
};
