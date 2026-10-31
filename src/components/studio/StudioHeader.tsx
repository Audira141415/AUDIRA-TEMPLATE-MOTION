'use client';

import React from 'react';
import { Sparkles, Video, ShieldCheck, Zap } from 'lucide-react';

export const StudioHeader: React.FC = () => {
  return (
    <header className="w-full border-b-2 border-zinc-800 bg-[#0e0e11]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600 border-2 border-black shadow-brutal-sm flex items-center justify-center text-white font-black text-xl">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg text-white tracking-tight">
                AUDIRA <span className="text-orange-500">MOTION</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
                v1.0 Pro
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium hidden sm:block">
              One Idea, A Finished Reel • Powered by Remotion & Banter Engine
            </p>
          </div>
        </div>

        {/* Metrics & Badges */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl text-xs font-mono text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            6 Format Archetypes Ready
          </div>

          <a
            href="https://audira.my.id"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold transition-all"
          >
            By Agus Dwi Rianto
          </a>
        </div>
      </div>
    </header>
  );
};

