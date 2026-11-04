'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { IdeaForm } from './IdeaForm';

export const HeroSection: React.FC = () => {
  return (
    <section id="top" className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-10 md:gap-14 px-4 pt-10 pb-16 md:px-8 md:pt-16 md:pb-24">
      {/* Left Column: Copy & Form */}
      <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-6">
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-line-strong bg-card px-3.5 py-1.5 font-mono text-[11px] font-semibold tracking-wider text-accent uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Motion Pack & Cloud Web Studio</span>
        </div>

        <h1 className="font-display text-[44px] font-extrabold leading-[1] tracking-[-0.045em] text-paper sm:text-[68px]">
          Edit video, motion graphic, sampai naskah viral. <span className="text-accent">Cukup lewat satu ide.</span>
        </h1>

        <p className="max-w-[540px] text-[17px] leading-[1.65] text-muted">
          21 format motion siap pakai. Tulis satu ide di Web Studio kami atau gunakan skill Claude / Cursor. 
          AUDIRA menulis naskah, mengisi suara bahasa Indonesia, dan merender video vertikal 1080×1920 60fps siap upload.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-1">
          <Link
            href="/studio"
            className="btn-primary min-h-12 px-6 text-[15px] font-bold shadow-lg shadow-orange-950/20"
          >
            Buka Web Studio Gratis
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <a
            href="#produk"
            className="btn-outline min-h-12 px-5 text-[15px] font-medium"
          >
            Lihat Tiap Paket & Gaya
          </a>
        </div>

        {/* Quick Idea Generator Box */}
        <div className="pt-2">
          <IdeaForm variant={0} />
        </div>

        {/* Microcopy Trust Badges */}
        <div className="flex flex-wrap items-center gap-4 pt-2 font-mono text-xs text-dim">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Gratis Coba di Browser
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            AI Lokal Bebas Kuota (Ollama)
          </span>
          <span>•</span>
          <span>1080×1920 60fps MP4</span>
        </div>
      </div>

      {/* Right Column: Dual Asymmetrical 9:16 Video Reels (Voynan Signature) */}
      <div className="flex min-w-0 flex-[1_1_380px] items-end justify-center gap-4 sm:gap-6">
        {/* Card 1: Roblox Obby Skits */}
        <figure className="relative m-0 overflow-hidden border border-line aspect-[9/16] flex-[0_1_220px] rounded-[22px] bg-tile shadow-2xl transition-transform hover:-translate-y-1">
          <video
            className="absolute inset-0 size-full object-cover"
            src="/reels/roblox_story.mp4"
            poster="/reels/roblox_story.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Contoh format AUDIRA Motion: Roblox Obby & Skits"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-ink/90 border border-line font-mono text-[10px] font-bold tracking-wider text-cyan-400">
            ROBLOX OBBY
          </span>
          <div className="absolute bottom-3 left-3 right-3 text-left">
            <p className="text-[12px] font-bold text-white line-clamp-1">Noob Minta 1000 Robux</p>
            <p className="text-[10px] text-zinc-400">Suara OOF! & Bubble Chat</p>
          </div>
        </figure>

        {/* Card 2: Character Banter / Explainer (Offset Downwards) */}
        <figure className="relative m-0 overflow-hidden border border-line mb-8 sm:mb-12 aspect-[9/16] flex-[0_1_220px] rounded-[22px] bg-tile shadow-2xl transition-transform hover:-translate-y-1">
          <video
            className="absolute inset-0 size-full object-cover"
            src="/reels/banter.mp4"
            poster="/reels/banter.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Contoh format AUDIRA Motion: 2D Character Skits"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-ink/90 border border-line font-mono text-[10px] font-bold tracking-wider text-accent">
            CHARACTER SKITS
          </span>
          <div className="absolute bottom-3 left-3 right-3 text-left">
            <p className="text-[12px] font-bold text-white line-clamp-1">Ash Mau Resign Jadi Streamer</p>
            <p className="text-[10px] text-zinc-400">Debat 2D Avatar Kinetik</p>
          </div>
        </figure>
      </div>
    </section>
  );
};

