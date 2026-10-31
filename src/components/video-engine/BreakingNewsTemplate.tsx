'use client';

import React from 'react';
import { Storyboard, StoryboardLine } from '@/types/motion';

interface Props {
  storyboard: Storyboard;
  currentTime: number;
  currentLine: StoryboardLine | null;
}

export const BreakingNewsTemplate: React.FC<Props> = ({
  storyboard,
  currentTime,
  currentLine,
}) => {
  // Chat receipts pop-up triggers
  const showReceipt = currentTime > 3.5;

  return (
    <div className="relative w-full h-full bg-[#0a0f1d] text-white overflow-hidden font-sans select-none">
      {/* Studio Background Grid with TV Camera Vignette */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* TOP: LIVE & TIME BADGE */}
      <div className="absolute top-14 inset-x-6 z-20 flex justify-between items-center">
        <div className="flex items-center gap-2 bg-red-600 px-3 py-1 rounded-sm border-2 border-black font-black text-xs tracking-widest animate-pulse shadow-brutal-sm">
          <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
          LIVE BROADCAST
        </div>
        <div className="bg-black/80 px-3 py-1 rounded-sm border border-zinc-700 text-xs font-mono font-bold text-zinc-300">
          21:45:12 WIB
        </div>
      </div>

      {/* CENTER VISUAL: Anchor Desk or Mock WhatsApp Chat Receipts */}
      <div className="absolute inset-x-6 top-32 bottom-48 z-10 flex flex-col items-center justify-center">
        {/* Floating Mock Phone Screen with WhatsApp Evidence */}
        <div className={`w-[85%] max-w-[340px] bg-zinc-900 rounded-3xl p-4 border-4 border-zinc-800 shadow-2xl transition-all duration-500 ${
          showReceipt ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-80 translate-y-4'
        }`}>
          {/* Phone Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs">
                OTW
              </div>
              <div>
                <div className="font-bold text-xs text-white">Temen Nongkrong</div>
                <div className="text-[10px] text-emerald-400">Online</div>
              </div>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">FORENSIK BUKTI</span>
          </div>

          {/* Chat Messages */}
          <div className="flex flex-col gap-2.5 text-xs">
            <div className="bg-zinc-800 text-zinc-200 p-2.5 rounded-2xl rounded-tl-sm self-start max-w-[85%] border border-zinc-700">
              Bro lo udah di mana? Kita udah nunggu 1 jam di cafe.
              <div className="text-[9px] text-zinc-400 text-right mt-1">19:12</div>
            </div>

            <div className={`bg-emerald-700 text-white p-2.5 rounded-2xl rounded-tr-sm self-end max-w-[85%] shadow-md transition-all duration-300 ${
              showReceipt ? 'ring-2 ring-yellow-400' : ''
            }`}>
              "Udah deket nih bro, lampu merah depan cafe!"
              <div className="text-[9px] text-emerald-200 text-right mt-1">19:14 ✓✓</div>
            </div>

            {/* Fact Check Stamp */}
            {showReceipt && (
              <div className="self-center mt-2 px-3 py-1 bg-red-600/90 border-2 border-white text-white font-black text-[11px] uppercase tracking-wider rounded rotate-[-6deg] animate-bounce">
                FAKTA: MASIH PAKE HANDUK
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LOWER THIRD: BREAKING NEWS RED BANNER */}
      <div className="absolute bottom-16 inset-x-0 z-30 flex flex-col">
        {/* Red Main Headline Box */}
        <div className="bg-red-600 px-6 py-3 border-y-4 border-black shadow-lg flex items-center gap-3">
          <div className="bg-white text-red-600 font-black px-2.5 py-1 text-xs tracking-tighter uppercase shrink-0">
            BREAKING
          </div>
          <div className="font-black text-sm md:text-base text-white tracking-wide truncate">
            {storyboard.title}
          </div>
        </div>

        {/* Yellow Sub-headline Pill */}
        <div className="bg-yellow-400 text-black px-6 py-2 border-b-2 border-black font-extrabold text-xs flex justify-between items-center">
          <span>LOKASI: CAFE JAKARTA SELATAN</span>
          <span className="text-[10px] bg-black text-yellow-400 px-1.5 py-0.5 rounded font-mono">EKSKLUSIF</span>
        </div>
      </div>

      {/* BOTTOM RUNNING TICKER TAPE */}
      <div className="absolute bottom-0 inset-x-0 h-10 bg-black border-t-2 border-zinc-800 z-30 flex items-center overflow-hidden">
        <div className="whitespace-nowrap font-mono text-xs font-bold text-yellow-400 animate-[marquee_12s_linear_infinite]">
          +++ UPDATE TERBARU: 98% ORANG YANG BILANG 'OTW' TERBUKTI MASIH MENCARI KUNCI MOTOR +++ KORBAN DILAPORKAN MULAI MENGUNYAH ES BATU KOSONG +++ POLISI HIMBAU JANGAN PERCAYA SEBELUM ADA LIVE LOCATION +++
        </div>
      </div>
    </div>
  );
};

