'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Box, Play } from 'lucide-react';
import { IdeaForm } from './IdeaForm';

export const HeroSection: React.FC = () => {
  return (
    <section id="top" className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-10 md:gap-14 px-4 pt-10 pb-16 md:px-8 md:pt-16 md:pb-24">
      {/* Left Column: Copy & Form */}
      <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-6">
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-line-strong bg-card px-3.5 py-1.5 font-mono text-[11px] font-semibold tracking-wider text-accent uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Audira Skill Motion 3D · Commercial Release</span>
        </div>

        <h1 className="font-display text-[42px] font-extrabold leading-[1.02] tracking-[-0.04em] text-paper sm:text-[64px]">
          Video animasi 3D sinematik 60 FPS. <br className="hidden sm:inline" />
          <span className="text-accent">Diarahkan otomatis oleh AI.</span>
        </h1>

        <p className="max-w-[560px] text-[16px] sm:text-[17px] leading-[1.65] text-muted">
          Platform sutradara gerak 3D otonom berbasis <strong>Claude Code</strong>, <strong>Remotion</strong>, dan <strong>React Three Fiber</strong>. 
          Pilih dari <strong>29 Signature 3D Styles</strong>: arsitektur CAD, exploded view titanium, miniatur voxel, hingga origami kertas. Render MP4 vertikal 1080×1920 @ 60 FPS bebas watermark.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-1">
          <a
            href="#produk"
            className="btn-primary min-h-12 px-6 text-[15px] font-bold shadow-lg shadow-orange-950/20"
          >
            Pilih Lisensi 3D (Mulai Rp149k)
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
          <a
            href="#hasil"
            className="btn-outline min-h-12 px-5 text-[15px] font-medium"
          >
            Lihat 29 Gaya Sinematik
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
            29 Gaya 3D Sinematik 60 FPS
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            Remotion 4.0 + Three.js PBR
          </span>
          <span>•</span>
          <span>1080×1920 60 FPS</span>
        </div>
      </div>

      {/* Right Column: Dual Asymmetrical 9:16 Real 3D Video Reels */}
      <div className="flex min-w-0 flex-[1_1_380px] items-end justify-center gap-4 sm:gap-6">
        {/* Card 1: BUILDFORGE 3D Architecture */}
        <figure className="relative m-0 overflow-hidden border border-line aspect-[9/16] flex-[0_1_220px] rounded-[22px] bg-tile shadow-2xl transition-transform hover:-translate-y-1">
          <video
            className="absolute inset-0 size-full object-cover"
            src="/3d-kits/buildforge.mp4"
            poster="/3d-kits/buildforge.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Contoh format AUDIRA Motion: BUILDFORGE 3D Architecture"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-ink/90 border border-line font-mono text-[10px] font-bold tracking-wider text-cyan-400">
            BUILDFORGE 3D
          </span>
          <div className="absolute bottom-3 left-3 right-3 text-left">
            <p className="text-[12px] font-bold text-white line-clamp-1">Perakitan Bangunan Bertahap</p>
            <p className="text-[10px] text-zinc-400">Struktur Baja &amp; Finishing Kaca</p>
          </div>
        </figure>

        {/* Card 2: PRECISION 3D Product CMF (Offset Downwards) */}
        <figure className="relative m-0 overflow-hidden border border-line mb-8 sm:mb-12 aspect-[9/16] flex-[0_1_220px] rounded-[22px] bg-tile shadow-2xl transition-transform hover:-translate-y-1">
          <video
            className="absolute inset-0 size-full object-cover"
            src="/3d-kits/precision.mp4"
            poster="/3d-kits/precision.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Contoh format AUDIRA Motion: PRECISION Exploded View"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-ink/90 border border-line font-mono text-[10px] font-bold tracking-wider text-accent">
            PRECISION CMF
          </span>
          <div className="absolute bottom-3 left-3 right-3 text-left">
            <p className="text-[12px] font-bold text-white line-clamp-1">Exploded View Titanium</p>
            <p className="text-[10px] text-zinc-400">Roda Gigi &amp; Mesin Presisi</p>
          </div>
        </figure>
      </div>
    </section>
  );
};
