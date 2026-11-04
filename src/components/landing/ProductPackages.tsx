'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Sparkles, Video, Play, Gamepad2, Layers, BookOpen } from 'lucide-react';

interface Props {
  onSelectTab?: (tabKey: string) => void;
}

export const ProductPackages: React.FC<Props> = ({ onSelectTab }) => {
  return (
    <section id="produk" className="mx-auto max-w-[1200px] px-4 py-16 md:px-8 md:py-24">
      {/* Section Header */}
      <div className="mb-12 flex max-w-[720px] flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">Paketnya</p>
        <h2 className="font-display text-[34px] sm:text-[46px] font-bold leading-[1.05] tracking-[-0.03em] text-paper">
          Ambil yang kamu butuh, atau ketiganya sekaligus dalam Creator Lab.
        </h2>
      </div>

      {/* 3 Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PACKAGE 1: MOTION GRAPHICS & EXPLAINER */}
        <article className="flex flex-col gap-6 rounded-3xl border border-line bg-card p-6 sm:p-7 shadow-card-warm transition-transform hover:-translate-y-1">
          {/* Card Video Header */}
          <div className="rounded-2xl border border-line bg-ink p-2 sm:p-2.5">
            <figure className="relative m-0 overflow-hidden border border-line aspect-[16/10] rounded-xl bg-tile-2">
              <video
                className="absolute inset-0 size-full object-cover"
                src="/reels/clean_explainer.mp4"
                poster="/reels/clean_explainer.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-accent text-ink font-mono text-[10px] font-bold uppercase">
                EXPLAINER
              </span>
            </figure>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-xs tracking-wider text-accent font-semibold uppercase">
                EDUKASI & DATA
              </p>
              <span className="px-2.5 py-0.5 rounded-full border border-edge bg-tile font-mono text-[10px] text-fg-2">
                HEMAT & RAPI
              </span>
            </div>

            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-2xl font-bold tracking-tight text-paper">
                AUDIRA Explainer
              </h3>
              <p className="font-display text-[22px] font-bold text-accent">Rp29.000</p>
            </div>

            <p className="text-[14px] leading-relaxed text-muted">
              Cara paling hemat untuk edukasi, fintech, dan presentasi bisnis. Teks, diagram, dan angka teranimasi presisi mengikuti tempo narasi suara.
            </p>
          </div>

          {/* Feature List */}
          <ul className="flex flex-col gap-3 text-[14px] text-fg-2">
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>Whiteboard spidol live drawing & kartu diagram</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>Kinetic typography & visualisasi data angka</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>Kuis countdown interaktif & struk belanja</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>Timing naskah terkunci pas ke voiceover per frame</span>
            </li>
          </ul>

          <div className="mt-auto flex flex-col gap-3 pt-2">
            <a
              href="#hasil"
              onClick={() => onSelectTab && onSelectTab('explainer')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-accent transition-colors"
            >
              Lihat 7 gaya explainer & data ➔
            </a>
            <Link
              href="/studio?format=clean_explainer"
              className="btn-outline w-full py-3 text-sm font-bold justify-center"
            >
              Coba di Studio <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </article>

        {/* PACKAGE 2: CREATOR SKITS & GAMING */}
        <article className="flex flex-col gap-6 rounded-3xl border-2 border-line-strong bg-card p-6 sm:p-7 shadow-card-warm relative transition-transform hover:-translate-y-1">
          <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-yellow-400 text-black font-mono text-[10px] font-black uppercase tracking-wider shadow">
            PALING VIRAL
          </span>

          {/* Card Video Header */}
          <div className="rounded-2xl border border-line bg-ink p-2 sm:p-2.5">
            <figure className="relative m-0 overflow-hidden border border-line aspect-[16/10] rounded-xl bg-tile-2">
              <video
                className="absolute inset-0 size-full object-cover"
                src="/reels/roblox_story.mp4"
                poster="/reels/roblox_story.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-cyan-400 text-black font-mono text-[10px] font-bold uppercase">
                ROBLOX & SKITS
              </span>
            </figure>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-xs tracking-wider text-cyan-400 font-semibold uppercase">
                VIRAL GAMING
              </p>
              <span className="px-2.5 py-0.5 rounded-full border border-edge bg-tile font-mono text-[10px] text-fg-2">
                GEN-Z HOOK
              </span>
            </div>

            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-2xl font-bold tracking-tight text-paper">
                AUDIRA Skits & Gaming
              </h3>
              <p className="font-display text-[22px] font-bold text-cyan-400">Rp49.000</p>
            </div>

            <p className="text-[14px] leading-relaxed text-muted">
              Cocok untuk kreator komedi dan gaming: debat 2D avatar kocak, Roblox Noob vs Pro di Obby parkour, dan Boss Fight RPG 16-bit.
            </p>
          </div>

          {/* Feature List */}
          <ul className="flex flex-col gap-3 text-[14px] text-fg-2">
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>Roblox Obby Parkour dengan bubble chat & Robux R$</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>2D Avatar Skits berdebat dengan zoom ekspresif</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>Boss Fight RPG 16-bit dengan bar HP & serangan</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>Breaking News TV investigasi dengan screenshot chat</span>
            </li>
          </ul>

          <div className="mt-auto flex flex-col gap-3 pt-2">
            <a
              href="#hasil"
              onClick={() => onSelectTab && onSelectTab('gaming')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-cyan-400 transition-colors"
            >
              Lihat 7 gaya skits & gaming ➔
            </a>
            <Link
              href="/studio?format=roblox_story"
              className="btn-primary w-full py-3 text-sm font-bold justify-center"
            >
              Coba Skits di Studio <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </article>

        {/* PACKAGE 3: STORY & DOCUMENTARY */}
        <article className="flex flex-col gap-6 rounded-3xl border border-line bg-card p-6 sm:p-7 shadow-card-warm transition-transform hover:-translate-y-1">
          {/* Card Video Header */}
          <div className="rounded-2xl border border-line bg-ink p-2 sm:p-2.5">
            <figure className="relative m-0 overflow-hidden border border-line aspect-[16/10] rounded-xl bg-tile-2">
              <video
                className="absolute inset-0 size-full object-cover"
                src="/reels/docu_story.mp4"
                poster="/reels/docu_story.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-amber-500 text-black font-mono text-[10px] font-bold uppercase">
                DOKUMENTER
              </span>
            </figure>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-xs tracking-wider text-amber-400 font-semibold uppercase">
                STORYTELLING
              </p>
              <span className="px-2.5 py-0.5 rounded-full border border-edge bg-tile font-mono text-[10px] text-fg-2">
                HIGH RETENTION
              </span>
            </div>

            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-2xl font-bold tracking-tight text-paper">
                AUDIRA Story & Docu
              </h3>
              <p className="font-display text-[22px] font-bold text-amber-400">Rp69.000</p>
            </div>

            <p className="text-[14px] leading-relaxed text-muted">
              Format pencerita emosional: foto arsip sejarah bergaya Ken Burns, drama chat smartphone berbalas, podcast clip, dan nostalgia retro VHS 90-an.
            </p>
          </div>

          {/* Feature List */}
          <ul className="flex flex-col gap-3 text-[14px] text-fg-2">
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Dokumenter sejarah Ken Burns foto arsip zoom</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Drama Chat Story dengan status sedang mengetik</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Podcast clip dua mikrofon & waveform audio</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Peta perjalanan GPS rute & nostalgia retro VHS</span>
            </li>
          </ul>

          <div className="mt-auto flex flex-col gap-3 pt-2">
            <a
              href="#hasil"
              onClick={() => onSelectTab && onSelectTab('story')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-amber-400 transition-colors"
            >
              Lihat 7 gaya story & docu ➔
            </a>
            <Link
              href="/studio?format=docu_story"
              className="btn-outline w-full py-3 text-sm font-bold justify-center"
            >
              Coba Story di Studio <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </article>
      </div>

      {/* Upgrade Callout Banner (Voynan Style) */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-line-strong bg-card px-6 py-5 sm:px-8">
        <div className="max-w-[680px]">
          <p className="text-[16px] sm:text-[17px] leading-normal text-fg-2 font-medium">
            Mau semua 21 format motion, akses Web Studio pro, dan AI lokal tanpa batas?
          </p>
          <p className="text-xs text-muted mt-1">
            Ambil <span className="text-accent font-bold">AUDIRA Creator Lab</span> cuma tambah Rp40.000 dari harga Skits!
          </p>
        </div>
        <a
          href="#bundle"
          className="btn-primary min-h-11 px-5 text-sm font-bold"
        >
          Lihat Creator Lab
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </div>
    </section>
  );
};
