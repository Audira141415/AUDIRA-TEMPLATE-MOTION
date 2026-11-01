'use client';

import React, { useMemo } from 'react';
import { Storyboard, StoryboardLine } from '@/types/motion';
import { Radio, Wifi, ShieldAlert, Video, MapPin, Eye, Mic } from 'lucide-react';

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
  const layout = storyboard.visualLayout;
  const newsMode = layout?.newsMode || 'forensic_leak';
  const newsUrgency = layout?.newsUrgency || 'breaking';

  // Live broadcast simulated clock (e.g. 21:45:12 + currentTime seconds)
  const clockText = useMemo(() => {
    const baseSeconds = 21 * 3600 + 45 * 60 + Math.floor(currentTime);
    const hrs = Math.floor(baseSeconds / 3600) % 24;
    const mins = Math.floor((baseSeconds % 3600) / 60);
    const secs = baseSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} WIB`;
  }, [currentTime]);

  // Urgency badge configuration
  const urgencyConfig = {
    breaking: {
      badgeBg: 'bg-red-600',
      badgeText: 'text-white',
      badgeBorder: 'border-black',
      label: '🔴 BREAKING NEWS',
      glow: 'shadow-[0_0_15px_rgba(239,68,68,0.7)]',
    },
    flash: {
      badgeBg: 'bg-yellow-400',
      badgeText: 'text-black font-black',
      badgeBorder: 'border-black',
      label: '⚡ FLASH ALERT',
      glow: 'shadow-[0_0_15px_rgba(250,204,21,0.8)]',
    },
    investigasi: {
      badgeBg: 'bg-indigo-600',
      badgeText: 'text-white',
      badgeBorder: 'border-black',
      label: '🚨 INVESTIGASI A1',
      glow: 'shadow-[0_0_15px_rgba(99,102,241,0.7)]',
    },
    special: {
      badgeBg: 'bg-orange-600',
      badgeText: 'text-white',
      badgeBorder: 'border-black',
      label: '⚠️ LAPORAN KHUSUS',
      glow: 'shadow-[0_0_15px_rgba(234,88,12,0.7)]',
    },
  }[newsUrgency] || {
    badgeBg: 'bg-red-600',
    badgeText: 'text-white',
    badgeBorder: 'border-black',
    label: '🔴 BREAKING NEWS',
    glow: 'shadow-[0_0_15px_rgba(239,68,68,0.7)]',
  };

  // Generate dynamic running ticker string from storyboard lines & magnet hook
  const runningTickerText = useMemo(() => {
    if (layout?.customTicker) return layout.customTicker;
    const bullets = storyboard.lines.map((l) => `${l.speaker.toUpperCase()}: "${l.text}"`);
    return `+++ ${urgencyConfig.label}: ${storyboard.title.toUpperCase()} +++ LOKASI: ${(storyboard.locationName || 'JAKARTA').toUpperCase()} +++ REAKSI: ${storyboard.commentMagnetHook || 'KOMENTAR NETIZEN MEMANAS'} +++ ${bullets.join(' +++ ')} +++`;
  }, [storyboard, layout?.customTicker, urgencyConfig.label]);

  // Active line index
  const activeLineIndex = storyboard.lines.findIndex((l) => l.id === currentLine?.id);

  // Mouth & blink for studio anchor
  const isSpeaking = !!currentLine;
  const mouthMovement = isSpeaking ? Math.sin(currentTime * 18) > 0.2 : false;
  const isBlinking = (currentTime % 3.6) < 0.2;

  // Waveform equalizer bars animation
  const eqBars = [
    Math.min(100, Math.max(15, Math.floor(Math.sin(currentTime * 10) * 45 + 50))),
    Math.min(100, Math.max(20, Math.floor(Math.sin(currentTime * 14 + 1) * 40 + 55))),
    Math.min(100, Math.max(30, Math.floor(Math.sin(currentTime * 18 + 2) * 50 + 50))),
    Math.min(100, Math.max(15, Math.floor(Math.sin(currentTime * 12 + 3) * 40 + 50))),
    Math.min(100, Math.max(25, Math.floor(Math.sin(currentTime * 16 + 4) * 45 + 55))),
  ];

  return (
    <div className="relative w-full h-full bg-[#070b14] text-white overflow-hidden font-sans select-none flex flex-col justify-between">
      {/* BACKGROUND BROADCAST NOISE & CRT SCANLINES */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 30%, #1e3a8a 0%, #030712 85%)',
        }}
      />
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none z-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.04), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.04))',
          backgroundSize: '100% 3px, 4px 100%',
        }}
      />

      {/* TOP: LIVE TV STATUS BAR & TELEMETRY */}
      <div className="relative z-30 pt-3 px-3 flex items-center justify-between pointer-events-none">
        {/* Left: Urgency Pulse Badge */}
        <div className="flex items-center gap-1.5">
          <div className={`flex items-center gap-1.5 ${urgencyConfig.badgeBg} ${urgencyConfig.badgeText} px-2.5 py-1 rounded-sm border-2 ${urgencyConfig.badgeBorder} text-[10px] font-black tracking-wider uppercase shadow-[2px_2px_0px_0px_#000] ${urgencyConfig.glow}`}>
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>{urgencyConfig.label}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 bg-black/80 px-2 py-1 rounded-sm border border-zinc-700 text-[10px] font-mono text-zinc-300">
            <Radio className="w-3 h-3 text-red-500 animate-pulse" />
            <span>CH-08</span>
          </div>
        </div>

        {/* Right: Live Satellite Feed & Clock */}
        <div className="flex items-center gap-1.5">
          <div className="bg-black/85 px-2 py-1 rounded-sm border border-zinc-800 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <Wifi className="w-3 h-3" />
            <span className="hidden sm:inline">LIVE SAT:</span>
            <span>{clockText}</span>
          </div>
        </div>
      </div>

      {/* CENTER STAGE: DYNAMIC BROADCAST CONTENT BASED ON NEWS MODE */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-3 my-auto max-h-[58%] overflow-hidden">
        {/* MODE 1: FORENSIC CHAT LEAK (WHATSAPP/TELEGRAM EVIDENCE SYNCED TO STORYBOARD LINES) */}
        {newsMode === 'forensic_leak' && (
          <div className="w-full max-w-[330px] bg-[#0c1222] rounded-2xl border-3 border-zinc-800 shadow-[6px_6px_0px_0px_#000] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Phone App Header */}
            <div className="bg-zinc-900/95 px-3 py-2 border-b-2 border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-600 border border-emerald-400 flex items-center justify-center font-black text-xs text-white">
                  WA
                </div>
                <div>
                  <div className="font-extrabold text-xs text-white flex items-center gap-1">
                    <span>{storyboard.characters.characterB.name || 'Target Investigasi'}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-[9px] text-zinc-400 font-mono">
                    {currentLine ? '● Sedang Mengetik...' : 'Online • Transkrip Bocor'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <span className="px-1.5 py-0.5 rounded bg-red-600/20 border border-red-500/40 text-[9px] font-mono text-red-300 font-bold uppercase tracking-wider">
                  BUKTI A1
                </span>
              </div>
            </div>

            {/* Dynamic Conversation Bubble List (Real Storyboard Lines) */}
            <div className="p-3 flex flex-col gap-2 max-h-[260px] overflow-hidden bg-[#070b16]">
              {/* Leaked Image Attachment / Custom B-Roll */}
              {layout?.customMediaUrl && (
                <div className="mb-1 p-1 bg-black/60 rounded-xl border border-zinc-700 overflow-hidden relative shadow-lg">
                  <img
                    src={layout.customMediaUrl}
                    alt={layout.customMediaLabel || 'Bukti Lampiran'}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-red-600/90 text-white font-mono text-[8px] font-bold tracking-wider">
                    LAMPIRAN DOKUMEN [A1]
                  </div>
                </div>
              )}

              {storyboard.lines.map((line, idx) => {
                const isLineActive = activeLineIndex === idx;
                const isLinePast = activeLineIndex > idx;
                const isLineFuture = activeLineIndex < idx;
                const isSpeakerA = line.speaker === storyboard.characters.characterA.name;

                // Only render active or past lines
                if (isLineFuture) return null;

                return (
                  <div
                    key={line.id}
                    className={`flex flex-col transition-all duration-300 ${
                      isSpeakerA ? 'items-start' : 'items-end'
                    } ${isLineActive ? 'scale-100 opacity-100' : 'scale-98 opacity-75'}`}
                  >
                    <div className="text-[9px] font-mono text-zinc-400 mb-0.5 px-1 font-bold">
                      {line.speaker} [{line.speakerRole.toUpperCase()}]
                    </div>

                    <div
                      className={`max-w-[88%] p-2.5 rounded-2xl text-xs font-semibold shadow-md transition-all ${
                        isSpeakerA
                          ? 'bg-zinc-800 text-zinc-100 rounded-tl-sm border border-zinc-700'
                          : 'bg-emerald-700 text-white rounded-tr-sm border border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                      } ${isLineActive ? 'ring-2 ring-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.4)]' : ''}`}
                    >
                      <p className="leading-snug">{line.text}</p>
                      <div className="text-[8px] font-mono opacity-70 text-right mt-1 flex items-center justify-end gap-1">
                        <span>{line.emotion}</span>
                        <span>•</span>
                        <span>19:{12 + idx} ✓✓</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Dynamic Forensic Fact-Check Stamp based on emotion */}
              {currentLine && (
                <div className="self-center mt-1 py-1 px-3 bg-red-600 border-2 border-white text-white font-black text-[10px] uppercase tracking-wider rounded-sm shadow-[3px_3px_0px_0px_#000] rotate-[-3deg] animate-in zoom-in-75 duration-150">
                  {currentLine.emotion === 'shocked' || currentLine.emotion === 'angry'
                    ? '⚠️ FAKTA: TERBUKTI BOHONG'
                    : '🔍 STATUS: SEDANG DIVERIFIKASI'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODE 2: ANCHOR STUDIO (NEWS DESK & EQUALIZER & WALL MONITOR) */}
        {newsMode === 'anchor_studio' && (
          <div className="w-full max-w-[340px] flex flex-col items-center relative">
            {/* Studio Back-Wall Video Screen */}
            <div className="w-full bg-[#0a1226] border-2 border-cyan-500/50 rounded-2xl p-3 shadow-2xl relative overflow-hidden mb-[-24px] z-0">
              <div className="flex justify-between items-center pb-1.5 border-b border-cyan-900/60 text-[10px] text-cyan-400 font-mono">
                <span className="flex items-center gap-1 font-bold">
                  <Video className="w-3 h-3 text-red-500 animate-pulse" />
                  STUDIO MAIN FEED
                </span>
                <span className="font-bold text-yellow-400">FPS: 60.0</span>
              </div>

              {/* Dynamic Sound Waveform Equalizer or Custom Evidence */}
              {layout?.customMediaUrl ? (
                <div className="relative w-full h-14 rounded overflow-hidden mt-1 border border-cyan-800">
                  <img
                    src={layout.customMediaUrl}
                    alt={layout.customMediaLabel || 'Bukti Studio'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 left-1 bg-red-600/90 px-1 py-0.2 rounded text-[7px] font-mono text-white font-bold tracking-wider">
                    BUKTI A1 LIVE
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-1 h-12 pt-2 px-2">
                  {eqBars.map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-cyan-600 via-indigo-500 to-yellow-400 rounded-t-sm transition-all duration-100"
                      style={{ height: `${isSpeaking ? h : 15}%` }}
                    />
                  ))}
                </div>
              )}

              <div className="mt-2 text-center text-xs font-black text-cyan-200 line-clamp-1">
                {storyboard.title}
              </div>
            </div>

            {/* News Anchor Presenter Avatar */}
            <div className="relative z-10 flex flex-col items-center">
              {/* Head */}
              <div className="w-16 h-16 bg-[#fed7aa] rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_#000] relative flex flex-col items-center justify-center z-20">
                {/* Hair */}
                <div className="absolute -top-2 inset-x-0 h-4 bg-[#1e293b] rounded-t-xl" />
                {/* Eyes */}
                <div className="flex gap-3 mb-1 mt-2">
                  <div className={`w-2.5 h-2.5 bg-black rounded-full ${isBlinking ? 'scale-y-10' : ''}`} />
                  <div className={`w-2.5 h-2.5 bg-black rounded-full ${isBlinking ? 'scale-y-10' : ''}`} />
                </div>
                {/* Mouth */}
                {mouthMovement ? (
                  <div className="w-4 h-2 bg-[#7f1d1d] rounded-full border border-black animate-pulse" />
                ) : (
                  <div className="w-3.5 h-1 border-b-2 border-black rounded-full" />
                )}
              </div>

              {/* Suit Torso */}
              <div className="w-24 h-16 bg-[#0f172a] rounded-t-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] flex flex-col items-center justify-start pt-1 z-10 mt-[-4px]">
                <div className="w-5 h-6 bg-red-600 border border-black clip-tie" />
              </div>

              {/* News Desk Bar */}
              <div className="w-full bg-[#1e293b] border-2 border-black rounded-xl p-2 shadow-[4px_4px_0px_0px_#000] flex items-center justify-between mt-[-10px] z-30">
                <div className="flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase">
                    {currentLine?.speaker || 'NEWS ANCHOR'}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-zinc-400">
                  {currentLine?.emotion ? `[${currentLine.emotion.toUpperCase()}]` : 'LIVE ON AIR'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: FIELD LIVE CAM / CCTV TELEMETRY */}
        {newsMode === 'field_live_cam' && (
          <div className="w-full max-w-[340px] aspect-[4/3] bg-black/90 rounded-2xl border-3 border-zinc-700 shadow-[6px_6px_0px_0px_#000] relative overflow-hidden flex flex-col justify-between p-3">
            {/* Custom CCTV Background Feed */}
            {layout?.customMediaUrl && (
              <img
                src={layout.customMediaUrl}
                alt={layout.customMediaLabel || 'CCTV Feed'}
                className="absolute inset-0 w-full h-full object-cover opacity-60 z-0"
              />
            )}

            {/* Top Cam Overlay */}
            <div className="flex items-center justify-between text-[10px] font-mono text-white/90 z-20">
              <div className="flex items-center gap-1.5 bg-red-600/90 text-white font-bold px-2 py-0.5 rounded-sm shadow-md animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white" />
                <span>REC ● 4K LIVE</span>
              </div>
              <div className="flex items-center gap-1 bg-black/70 px-2 py-0.5 rounded border border-white/20">
                <MapPin className="w-3 h-3 text-red-400" />
                <span className="truncate max-w-[120px]">{storyboard.locationName || 'JAKARTA'}</span>
              </div>
            </div>

            {/* Central Crosshair & HUD Grid */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
              <div className="w-24 h-24 border border-cyan-400/60 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 border-t-2 border-l-2 border-cyan-300" />
                <div className="w-4 h-4 border-b-2 border-r-2 border-cyan-300" />
              </div>
              <div className="absolute inset-x-8 h-px bg-cyan-400/20" />
              <div className="absolute inset-y-8 w-px bg-cyan-400/20" />
            </div>

            {/* Active Dialogue Callout inside Field Cam */}
            <div className="relative z-20 bg-black/80 backdrop-blur-md border border-zinc-700 p-2.5 rounded-xl">
              <div className="flex items-center justify-between pb-1 border-b border-zinc-800 text-[10px] font-mono">
                <span className="text-yellow-400 font-bold uppercase">
                  LAPORAN LAPANGAN: {currentLine?.speaker || 'REPORTER'}
                </span>
                <span className="text-emerald-400">SIGNAL: 98%</span>
              </div>
              <p className="text-xs font-bold text-white mt-1 leading-snug line-clamp-2">
                "{currentLine?.text || 'Situasi di lokasi dilaporkan semakin padat oleh warga...'}"
              </p>
            </div>
          </div>
        )}
      </div>

      {/* LOWER THIRD: BROADCAST NEWS HEADLINE CRAWL (ZERO-COLLISION ZONE) */}
      <div className="relative z-30 flex flex-col w-full shadow-2xl">
        {/* Urgent Red Main Headline Box */}
        <div className="bg-red-600 px-4 py-2 sm:py-2.5 border-y-3 border-black shadow-[0_4px_0px_0px_#000] flex items-center gap-2.5">
          <div className="bg-white text-red-600 font-black px-2 py-0.5 text-[11px] sm:text-xs tracking-tight uppercase shrink-0 border border-black shadow-[1px_1px_0px_0px_#000]">
            BREAKING
          </div>
          <h2 className="font-black text-xs sm:text-sm md:text-base text-white tracking-wide truncate flex-1 uppercase">
            {storyboard.title}
          </h2>
        </div>

        {/* Yellow Sub-Headline & Location Strip */}
        <div className="bg-yellow-400 text-black px-4 py-1.5 border-b-2 border-black font-extrabold text-[11px] flex justify-between items-center">
          <div className="flex items-center gap-1.5 truncate">
            <span className="bg-black text-yellow-400 px-1 py-0.5 rounded-sm font-mono text-[9px]">LOKASI</span>
            <span className="truncate uppercase font-black">{storyboard.locationName || 'JAKARTA SELATAN'}</span>
          </div>
          <span className="text-[9px] bg-red-600 text-white font-mono font-bold px-1.5 py-0.5 rounded-sm shrink-0 uppercase">
            {currentLine ? currentLine.speaker : 'EKSKLUSIF'}
          </span>
        </div>

        {/* BOTTOM RUNNING TICKER MARQUEE TAPE */}
        <div className="h-8 bg-black border-t border-zinc-800 flex items-center overflow-hidden px-2 relative">
          <div className="bg-red-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-sm shrink-0 mr-2 z-10 border border-zinc-700">
            UPDATE
          </div>
          <div className="whitespace-nowrap font-mono text-[10px] sm:text-[11px] font-bold text-yellow-400 animate-[marquee_14s_linear_infinite] flex items-center">
            {runningTickerText}
          </div>
        </div>
      </div>
    </div>
  );
};
