'use client';

import React from 'react';
import { Storyboard } from '@/types/motion';
import { ViralToolkit } from '@/components/studio/ViralToolkit';
import { 
  CheckCircle2, Sparkles, Video, Download, Clock, 
  Layers, Volume2, Type, Award, FolderOpen, Zap, ArrowRight 
} from 'lucide-react';

interface Props {
  storyboard: Storyboard;
  onOpenExport: () => void;
  onOpenVault?: () => void;
}

export const RenderLaunchpad: React.FC<Props> = ({
  storyboard,
  onOpenExport,
  onOpenVault,
}) => {
  const subtitleStyle = storyboard.subtitleConfig?.animationStyle || 'pop_bounce';
  const subtitleFont = storyboard.subtitleConfig?.fontFamily || 'montserrat';
  const aspectRatio = storyboard.visualLayout?.aspectRatio || '9:16';

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-200">
      {/* CARD 1: LAUNCHPAD RENDER GATEWAY */}
      <div className="bg-gradient-to-br from-card to-card/90 p-5 sm:p-6 rounded-3xl border-2 border-accent/40 shadow-card flex flex-col gap-4 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3 h-3" />
                Langkah 5: Siap Render
              </span>
              <span className="text-dim text-xs">•</span>
              <span className="text-[10px] font-mono text-muted uppercase">
                {aspectRatio} Aspect
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
              {storyboard.title || 'Studio Motion Reel'}
            </h3>
            <p className="text-xs text-muted mt-1">
              Semua elemen naskah, suara AI Cartesia, dan animasi telah terkalibrasi.
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center text-white border-2 border-black shadow-brutal shrink-0">
            <Video className="w-6 h-6" />
          </div>
        </div>

        {/* PRE-FLIGHT SPECS CHECKLIST */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-ink p-3 rounded-2xl border border-line text-xs relative z-10">
          <div className="flex flex-col gap-0.5 p-2 bg-tile rounded-xl">
            <span className="text-[10px] text-muted font-mono flex items-center gap-1">
              <Layers className="w-3 h-3 text-cyan-400" />
              Format
            </span>
            <span className="font-bold text-white uppercase text-[11px] truncate">
              {storyboard.format}
            </span>
          </div>

          <div className="flex flex-col gap-0.5 p-2 bg-tile rounded-xl">
            <span className="text-[10px] text-muted font-mono flex items-center gap-1">
              <Clock className="w-3 h-3 text-orange-400" />
              Durasi
            </span>
            <span className="font-bold text-white font-mono text-[11px]">
              {storyboard.durationSec.toFixed(1)}s ({storyboard.lines.length} Baris)
            </span>
          </div>

          <div className="flex flex-col gap-0.5 p-2 bg-tile rounded-xl">
            <span className="text-[10px] text-muted font-mono flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-emerald-400" />
              Suara AI
            </span>
            <span className="font-bold text-white text-[11px] truncate">
              Cartesia (id)
            </span>
          </div>

          <div className="flex flex-col gap-0.5 p-2 bg-tile rounded-xl">
            <span className="text-[10px] text-muted font-mono flex items-center gap-1">
              <Type className="w-3 h-3 text-amber-400" />
              Subtitle
            </span>
            <span className="font-bold text-white text-[11px] truncate uppercase">
              {subtitleStyle.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* PRIMARY RENDER ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 relative z-10">
          <button
            type="button"
            onClick={onOpenExport}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-white font-black text-sm uppercase tracking-wider shadow-brutal flex items-center justify-center gap-2 border-2 border-black transition-transform active:translate-y-0.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Mulai Render Video MP4 HD</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {onOpenVault && (
            <button
              type="button"
              onClick={onOpenVault}
              className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-tile hover:bg-zinc-800 text-paper hover:text-white border-2 border-edge text-xs font-bold flex items-center justify-center gap-2 transition-colors shrink-0"
            >
              <FolderOpen className="w-4 h-4 text-cyan-400" />
              <span>Buka Render Vault</span>
            </button>
          )}
        </div>
      </div>

      {/* CARD 2: VIRAL TOOLKIT (CAPTION & HASHTAGS GENERATOR) */}
      <ViralToolkit storyboard={storyboard} />

      {/* CARD 3: RETENTION BLUEPRINT */}
      <div className="bg-card p-5 rounded-3xl border border-line shadow-card flex flex-col gap-3">
        <h4 className="text-xs font-black uppercase text-orange-400 tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Rahasia Retensi BanterReels (Under The Hood)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-paper">
          <div className="bg-tile p-3 rounded-xl border border-line">
            <span className="font-mono font-bold text-orange-400 block mb-1">00:00.4 Detik</span>
            <p className="text-[11px] text-muted leading-relaxed">
              Hook audio pembuka meledak dalam 0.4s pertama untuk mengunci jempol penonton.
            </p>
          </div>
          <div className="bg-tile p-3 rounded-xl border border-line">
            <span className="font-mono font-bold text-yellow-400 block mb-1">Word Pop Captions</span>
            <p className="text-[11px] text-muted leading-relaxed">
              Teks menyala per kata tepat saat diucapkan untuk menjaga fokus mata penonton.
            </p>
          </div>
          <div className="bg-tile p-3 rounded-xl border border-line">
            <span className="font-mono font-bold text-cyan-400 block mb-1">Comment Magnet</span>
            <p className="text-[11px] text-muted leading-relaxed">
              Outro diakhiri pertanyaan pemicu debat agar algoritma melipatgandakan views.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
