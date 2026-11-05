'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Sparkles, Box, Cpu, Crown, Layers } from 'lucide-react';

interface Props {
  onSelectTab?: (tabKey: string) => void;
}

export const ProductPackages: React.FC<Props> = ({ onSelectTab }) => {
  return (
    <section id="produk" className="mx-auto max-w-[1240px] px-4 py-16 md:px-8 md:py-24">
      {/* Section Header */}
      <div className="mb-12 flex max-w-[760px] flex-col gap-3">
        <div className="inline-flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-accent" />
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent font-bold">
            LISENSI KOMERSIAL RESMI
          </p>
        </div>
        <h2 className="font-display text-[34px] sm:text-[46px] font-bold leading-[1.05] tracking-[-0.03em] text-paper">
          Pilih Lisensi Audira Skill Motion 3D. <br className="hidden sm:inline" />
          <span className="text-accent">Miliki Sekali, Render Tanpa Batas.</span>
        </h2>
        <p className="text-sm sm:text-base text-muted leading-relaxed">
          Karya orisinal <strong>Agus Dwi Rianto (AUDIRA MDA)</strong>. Dilindungi lisensi komersial berbayar resmi. Semua video hasil render MP4 1080×1920 60 FPS bebas royalti dan 100% hak milik Anda untuk monetisasi atau klien agensi.
        </p>
      </div>

      {/* 3 Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TIER 1: STARTER 3D PACK */}
        <article className="flex flex-col gap-6 rounded-3xl border border-line bg-card p-6 sm:p-7 shadow-card-warm transition-transform hover:-translate-y-1">
          {/* Card Video Header */}
          <div className="rounded-2xl border border-line bg-ink p-2 sm:p-2.5">
            <figure className="relative m-0 overflow-hidden border border-line aspect-[16/10] rounded-xl bg-tile-2">
              <img
                className="absolute inset-0 size-full object-cover"
                src="/3d-kits/buildforge.jpg"
                alt="Starter 3D Pack"
              />
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-accent text-ink font-mono text-[10px] font-bold uppercase">
                STARTER 5 GAYA
              </span>
            </figure>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-xs tracking-wider text-accent font-semibold uppercase">
                GAYA 3D PILIHAN
              </p>
              <span className="px-2.5 py-0.5 rounded-full border border-edge bg-tile font-mono text-[10px] text-fg-2">
                PEMULA 3D
              </span>
            </div>

            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-2xl font-bold tracking-tight text-paper">
                Starter 3D Pack
              </h3>
              <p className="font-display text-[22px] font-bold text-accent">Rp49.000</p>
            </div>

            <p className="text-[14px] leading-relaxed text-muted">
              Cocok untuk kreator yang ingin mulai membuat video 3D: pilih 5 gaya utama (BUILDFORGE, PRECISION, PIXELSTORY, VOXELVERSE, INNERWORKS).
            </p>
          </div>

          {/* Feature List */}
          <ul className="flex flex-col gap-3 text-[14px] text-fg-2">
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>5 Kit Gaya 3D Signature pilihan</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>Perintah Claude Code <code className="text-xs bg-ink px-1 rounded text-accent">/audira-motion</code></span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>Ekspor MP4 1080×1920 60 FPS bebas watermark</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>Akses Web Studio browser runner</span>
            </li>
          </ul>

          <div className="mt-auto flex flex-col gap-3 pt-2">
            <a
              href="#hasil"
              onClick={() => onSelectTab && onSelectTab('arsitektur')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-accent transition-colors"
            >
              Lihat contoh gaya 3D ➔
            </a>
            <Link
              href="/studio?kit=buildforge"
              className="btn-outline w-full py-3 text-sm font-bold justify-center"
            >
              Coba Starter di Studio <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </article>

        {/* TIER 2: MASTER DIRECTOR PACK (RECOMMENDED) */}
        <article className="flex flex-col gap-6 rounded-3xl border-2 border-accent bg-card p-6 sm:p-7 shadow-card-warm relative transition-transform hover:-translate-y-1">
          <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-accent text-ink font-mono text-[10px] font-black uppercase tracking-wider shadow">
            PALING POPULER
          </span>

          {/* Card Video Header */}
          <div className="rounded-2xl border border-line bg-ink p-2 sm:p-2.5">
            <figure className="relative m-0 overflow-hidden border border-line aspect-[16/10] rounded-xl bg-tile-2">
              <img
                className="absolute inset-0 size-full object-cover"
                src="/3d-kits/cyberforge.jpg"
                alt="Master Director Pack"
              />
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-cyan-400 text-black font-mono text-[10px] font-bold uppercase">
                SEMUA 20 GAYA 3D
              </span>
            </figure>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-xs tracking-wider text-cyan-400 font-semibold uppercase">
                LENGKAP 5 PILAR INDUSTRI
              </p>
              <span className="px-2.5 py-0.5 rounded-full border border-edge bg-tile font-mono text-[10px] text-fg-2">
                UNRESTRICTED
              </span>
            </div>

            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-2xl font-bold tracking-tight text-paper">
                Master Director Pack
              </h3>
              <p className="font-display text-[22px] font-bold text-cyan-400">Rp79.000</p>
            </div>

            <p className="text-[14px] leading-relaxed text-muted">
              Seluruh 20 gaya 3D mandiri: Arsitektur, Taktil, Origami, Claymation, Voxel, Low-Poly, Mikroskop Cryo-EM, Kaligrafi Ink, hingga Sirkuit PCB.
            </p>
          </div>

          {/* Feature List */}
          <ul className="flex flex-col gap-3 text-[14px] text-fg-2">
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>Akses penuh 20 Kit Gaya 3D Signature</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>Autonomous Director Claude Code (pilih gaya otomatis)</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>Audio Sync presisi & normalisasi EBU R128 (-14 LUFS)</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>Multi-resolution render: smoke preview & final 60 FPS</span>
            </li>
          </ul>

          <div className="mt-auto flex flex-col gap-3 pt-2">
            <a
              href="#hasil"
              onClick={() => onSelectTab && onSelectTab('all')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-cyan-400 transition-colors"
            >
              Jelajahi seluruh 20 gaya 3D ➔
            </a>
            <Link
              href="/studio?kit=cyberforge"
              className="btn-primary w-full py-3 text-sm font-bold justify-center"
            >
              Buka Master Pack di Studio <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </article>

        {/* TIER 3: CREATOR LAB ULTIMATE */}
        <article className="flex flex-col gap-6 rounded-3xl border border-line bg-card p-6 sm:p-7 shadow-card-warm transition-transform hover:-translate-y-1">
          {/* Card Video Header */}
          <div className="rounded-2xl border border-line bg-ink p-2 sm:p-2.5">
            <figure className="relative m-0 overflow-hidden border border-line aspect-[16/10] rounded-xl bg-tile-2">
              <img
                className="absolute inset-0 size-full object-cover"
                src="/3d-kits/precision.jpg"
                alt="Creator Lab Ultimate"
              />
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-amber-500 text-black font-mono text-[10px] font-bold uppercase">
                COMPLETE BUNDLE
              </span>
            </figure>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-xs tracking-wider text-amber-400 font-semibold uppercase">
                SUITE PROFESIONAL
              </p>
              <span className="px-2.5 py-0.5 rounded-full border border-edge bg-tile font-mono text-[10px] text-fg-2">
                FULL ECOSYSTEM
              </span>
            </div>

            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-2xl font-bold tracking-tight text-paper">
                Creator Lab Ultimate
              </h3>
              <p className="font-display text-[22px] font-bold text-amber-400">Rp109.000</p>
            </div>

            <p className="text-[14px] leading-relaxed text-muted">
              Seluruh 20 Gaya 3D + Starter Repo Codebase + Brand Kit (`audira-brand.json`) + Integrasi AI Lokal Bebas Kuota + VIP Support 1-on-1.
            </p>
          </div>

          {/* Feature List */}
          <ul className="flex flex-col gap-3 text-[14px] text-fg-2">
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Semua 20 Gaya 3D + Full Source Codebase Remotion</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Brand Kit Configurator (`audira-brand.json`)</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>AI Lokal Offline Gateway (Ollama 4B 3D-Coder)</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>VIP 1-on-1 WhatsApp Support langsung dari creator</span>
            </li>
          </ul>

          <div className="mt-auto flex flex-col gap-3 pt-2">
            <a
              href="#bundle"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-amber-400 transition-colors"
            >
              Lihat detail Creator Lab ➔
            </a>
            <Link
              href="/studio"
              className="btn-outline w-full py-3 text-sm font-bold justify-center"
            >
              Buka Creator Lab di Studio <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </article>
      </div>

      {/* Upgrade Callout Banner */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-line-strong bg-card px-6 py-5 sm:px-8">
        <div className="max-w-[680px]">
          <p className="text-[16px] sm:text-[17px] leading-normal text-fg-2 font-medium">
            Mau semua 20 gaya sinematik 3D, starter codebase Remotion, dan AI lokal tanpa batas?
          </p>
          <p className="text-xs text-muted mt-1">
            Ambil <span className="text-accent font-bold">AUDIRA Creator Lab Ultimate</span> cuma tambah Rp30.000 dari Master Director Pack!
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

      {/* Done-For-You Agency Service Callout */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-tile px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <p className="text-xs sm:text-sm text-fg-2 font-medium">
            <strong>Tidak mau repot install atau butuh hasil video cepat?</strong> Serahkan ke tim studio AUDIRA. Terima video 3D 1080p beres dalam 24 jam.
          </p>
        </div>
        <a
          href="#jasa"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-orange-400 transition-colors"
        >
          <span>Pilih Jasa Terima Beres (Mulai Rp199k)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
};
