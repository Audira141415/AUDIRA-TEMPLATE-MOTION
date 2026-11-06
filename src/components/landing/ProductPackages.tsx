'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Check, 
  Sparkles, 
  Box, 
  Cpu, 
  Crown, 
  Layers, 
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Star
} from 'lucide-react';
import { ProductTier } from './OrderModal';
import { LandingConfig } from '@/types/landing';

interface Props {
  onSelectTab?: (tabKey: string) => void;
  onBuyTier?: (tier: ProductTier) => void;
  pricingConfig?: LandingConfig['pricingTiers'];
}

export const ProductPackages: React.FC<Props> = ({ onSelectTab, onBuyTier, pricingConfig }) => {
  const [selectedTier, setSelectedTier] = useState<ProductTier>('master');

  const tierOrder: ProductTier[] = ['starter', 'master', 'lab'];

  const handlePrevTier = () => {
    const idx = tierOrder.indexOf(selectedTier);
    const prev = (idx - 1 + tierOrder.length) % tierOrder.length;
    setSelectedTier(tierOrder[prev]);
  };

  const handleNextTier = () => {
    const idx = tierOrder.indexOf(selectedTier);
    const next = (idx + 1) % tierOrder.length;
    setSelectedTier(tierOrder[next]);
  };

  const handleBuy = (tier: ProductTier) => {
    setSelectedTier(tier);
    if (onBuyTier) onBuyTier(tier);
  };

  return (
    <section id="produk" className="mx-auto max-w-[1240px] px-4 py-16 md:px-8 md:py-24">
      {/* Section Header */}
      <div className="mb-10 flex max-w-[760px] flex-col gap-3">
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

      {/* Interactive Plan Selector Bar (Pilih Kiri, Tengah, atau Kanan) */}
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-line bg-card p-3 sm:p-4 shadow-card-warm">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 rounded-full bg-accent animate-ping" />
          <span className="font-mono text-xs uppercase tracking-wider text-paper font-bold">
            Pilih Lisensi: <span className="text-accent">
              {selectedTier === 'starter' ? 'Kiri (Starter 149k)' : selectedTier === 'master' ? 'Tengah (Master 299k)' : 'Kanan (Creator Lab 499k)'}
            </span>
          </span>
        </div>

        {/* Segmented Control with Left and Right Arrows */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
          <button
            type="button"
            onClick={handlePrevTier}
            aria-label="Pilih lisensi sebelumnya (geser ke kiri)"
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl border border-edge bg-tile text-xs font-bold text-muted hover:text-paper hover:border-line-strong transition-colors"
            title="Pilih lisensi sebelah kiri"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden md:inline font-mono text-[11px]">Kiri</span>
          </button>

          <div className="grid grid-cols-3 gap-1 bg-ink p-1 rounded-xl border border-line text-xs font-bold">
            <button
              type="button"
              onClick={() => setSelectedTier('starter')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedTier === 'starter'
                  ? 'bg-accent text-ink shadow-md font-black'
                  : 'text-muted hover:text-paper hover:bg-tile/50'
              }`}
            >
              1. Starter ({pricingConfig?.starter.price ?? '149k'})
            </button>
            <button
              type="button"
              onClick={() => setSelectedTier('master')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedTier === 'master'
                  ? 'bg-cyan-400 text-black shadow-md font-black'
                  : 'text-muted hover:text-paper hover:bg-tile/50'
              }`}
            >
              2. Master ({pricingConfig?.master.price ?? '299k'})
            </button>
            <button
              type="button"
              onClick={() => setSelectedTier('lab')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedTier === 'lab'
                  ? 'bg-amber-400 text-black shadow-md font-black'
                  : 'text-muted hover:text-paper hover:bg-tile/50'
              }`}
            >
              3. Lab ({pricingConfig?.lab.price ?? '499k'})
            </button>
          </div>

          <button
            type="button"
            onClick={handleNextTier}
            aria-label="Pilih lisensi berikutnya (geser ke kanan)"
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl border border-edge bg-tile text-xs font-bold text-muted hover:text-paper hover:border-line-strong transition-colors"
            title="Pilih lisensi sebelah kanan"
          >
            <span className="hidden md:inline font-mono text-[11px]">Kanan</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3 Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TIER 1: STARTER 3D PACK (KIRI) */}
        <article 
          onClick={() => setSelectedTier('starter')}
          className={`flex flex-col gap-6 rounded-3xl p-6 sm:p-7 transition-all cursor-pointer relative ${
            selectedTier === 'starter'
              ? 'border-2 border-accent bg-card shadow-2xl ring-2 ring-accent/50 scale-[1.02] z-10'
              : 'border border-line bg-card shadow-card-warm hover:border-line-strong hover:bg-tile/20'
          }`}
        >
          {selectedTier === 'starter' && (
            <span className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-accent text-ink font-mono text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
              <Star className="w-3 h-3 fill-ink" />
              PAKET TERPILIH (KIRI)
            </span>
          )}

          {/* Card Video Header */}
          <div className="rounded-2xl border border-line bg-ink p-2 sm:p-2.5">
            <figure className="relative m-0 overflow-hidden border border-line aspect-[16/10] rounded-xl bg-tile-2">
              <video
                className="absolute inset-0 size-full object-cover"
                src="/3d-kits/buildforge.mp4"
                poster="/3d-kits/buildforge.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Starter 3D Pack Preview: Buildforge"
              />
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-accent text-ink font-mono text-[10px] font-bold uppercase z-10">
                STARTER 5 GAYA
              </span>
            </figure>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-xs tracking-wider text-accent font-semibold uppercase">
                GAYA 3D PILIHAN
              </p>
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full border border-edge bg-tile font-mono text-[10px] text-fg-2">
                  PEMULA 3D
                </span>
                {selectedTier === 'starter' ? (
                  <span className="text-accent font-bold text-[11px] font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 fill-accent text-ink" /> Terpilih
                  </span>
                ) : (
                  <span className="text-dim text-[11px] font-mono flex items-center gap-1">
                    <Circle className="w-3.5 h-3.5" /> Pilih
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-2xl font-bold tracking-tight text-paper">
                {pricingConfig?.starter.name ?? 'Starter 3D Pack'}
              </h3>
              <div className="flex items-baseline gap-2">
                {pricingConfig?.starter.originalPrice && (
                  <span className="text-xs text-dim line-through font-mono">
                    {pricingConfig.starter.originalPrice}
                  </span>
                )}
                <p className="font-display text-[22px] font-bold text-accent">
                  {pricingConfig?.starter.price ?? 'Rp149.000'}
                </p>
              </div>
            </div>

            <p className="text-[14px] leading-relaxed text-muted">
              {pricingConfig?.starter.tagline ?? 'Cocok untuk kreator yang ingin mulai membuat video 3D: pilih 5 gaya utama (BUILDFORGE, PRECISION, PIXELSTORY, VOXELVERSE, INNERWORKS).'}
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
              <span>Buku Panduan Instalasi Lengkap &amp; CLI Runner</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>Lisensi komersial seumur hidup bebas royalti</span>
            </li>
          </ul>

          <div className="mt-auto flex flex-col gap-2.5 pt-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleBuy('starter');
              }}
              className={`w-full py-3.5 text-sm font-bold justify-center rounded-2xl transition-all ${
                selectedTier === 'starter'
                  ? 'btn-primary shadow-lg shadow-orange-950/40'
                  : 'border border-edge bg-tile text-paper hover:bg-tile-2 hover:border-line-strong'
              }`}
            >
              {selectedTier === 'starter' ? `Beli Starter (${pricingConfig?.starter.price ?? 'Rp149.000'}) ➔` : 'Pilih Starter 3D Pack'}
            </button>
            <div className="flex items-center justify-between px-1">
              <a
                href="#hasil"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTab && onSelectTab('arsitektur');
                }}
                className="text-xs font-semibold text-muted hover:text-accent transition-colors"
              >
                Lihat contoh ➔
              </a>
              <a
                href="https://wa.me/6282112001600?text=Halo%20Tim%20AUDIRA,%20saya%20tertarik%20dengan%20Paket%20Starter%203D%20(Rp149.000)"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-semibold text-muted hover:text-paper transition-colors"
              >
                Tanya via WA
              </a>
            </div>
          </div>
        </article>

        {/* TIER 2: MASTER DIRECTOR PACK (TENGAH - RECOMMENDED) */}
        <article 
          onClick={() => setSelectedTier('master')}
          className={`flex flex-col gap-6 rounded-3xl p-6 sm:p-7 transition-all cursor-pointer relative ${
            selectedTier === 'master'
              ? 'border-2 border-cyan-400 bg-card shadow-2xl ring-2 ring-cyan-500/50 scale-[1.02] z-10'
              : 'border border-line bg-card shadow-card-warm hover:border-line-strong hover:bg-tile/20'
          }`}
        >
          <span className={`absolute -top-3.5 right-6 px-3 py-1 rounded-full font-mono text-[10px] font-black uppercase tracking-wider shadow flex items-center gap-1 ${
            selectedTier === 'master'
              ? 'bg-cyan-400 text-black shadow-md'
              : 'bg-cyan-400/80 text-black'
          }`}>
            <Star className="w-3 h-3 fill-black" />
            {selectedTier === 'master' ? 'PALING POPULER • TERPILIH' : 'PALING POPULER'}
          </span>

          {/* Card Video Header */}
          <div className="rounded-2xl border border-line bg-ink p-2 sm:p-2.5">
            <figure className="relative m-0 overflow-hidden border border-line aspect-[16/10] rounded-xl bg-tile-2">
              <video
                className="absolute inset-0 size-full object-cover"
                src="/3d-kits/cyberforge.mp4"
                poster="/3d-kits/cyberforge.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Master Director Pack Preview: Cyberforge"
              />
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-cyan-400 text-black font-mono text-[10px] font-bold uppercase z-10">
                SELURUH KOLEKSI GAYA 3D
              </span>
            </figure>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-xs tracking-wider text-cyan-400 font-semibold uppercase">
                LENGKAP 5 PILAR INDUSTRI
              </p>
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full border border-edge bg-tile font-mono text-[10px] text-fg-2">
                  UNRESTRICTED
                </span>
                {selectedTier === 'master' ? (
                  <span className="text-cyan-400 font-bold text-[11px] font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 fill-cyan-400 text-black" /> Terpilih
                  </span>
                ) : (
                  <span className="text-dim text-[11px] font-mono flex items-center gap-1">
                    <Circle className="w-3.5 h-3.5" /> Pilih
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-2xl font-bold tracking-tight text-paper">
                {pricingConfig?.master.name ?? 'Master Director Pack'}
              </h3>
              <div className="flex items-baseline gap-2">
                {pricingConfig?.master.originalPrice && (
                  <span className="text-xs text-dim line-through font-mono">
                    {pricingConfig.master.originalPrice}
                  </span>
                )}
                <p className="font-display text-[22px] font-bold text-cyan-400">
                  {pricingConfig?.master.price ?? 'Rp299.000'}
                </p>
              </div>
            </div>

            <p className="text-[14px] leading-relaxed text-muted">
              {pricingConfig?.master.tagline ?? 'Seluruh koleksi gaya 3D mandiri & update berkala: Arsitektur, Taktil, Origami, Claymation, Voxel, Low-Poly, Mikroskop Cryo-EM, Kaligrafi Ink, hingga Sirkuit PCB.'}
            </p>
          </div>

          {/* Feature List */}
          <ul className="flex flex-col gap-3 text-[14px] text-fg-2">
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>Akses penuh seluruh Kit Gaya 3D Signature &amp; Update Mendatang</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>Termasuk AUDIRA Skill Mesh (MCP Config)</strong> untuk Claude Code &amp; Cursor</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>Audio Sync presisi &amp; normalisasi siaran (-14 LUFS)</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>Buku Panduan Instalasi &amp; Auto-Installer (di Portal Pelanggan)</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>Multi-resolution render: smoke test &amp; final 60 FPS</span>
            </li>
          </ul>

          <div className="mt-auto flex flex-col gap-2.5 pt-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleBuy('master');
              }}
              className={`w-full inline-flex items-center justify-center gap-1.5 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all active:scale-[0.99] ${
                selectedTier === 'master'
                  ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-950/40 hover:bg-cyan-300'
                  : 'border border-edge bg-tile text-paper hover:bg-tile-2 hover:border-line-strong'
              }`}
            >
              {selectedTier === 'master' ? `Beli Master Pack (${pricingConfig?.master.price ?? 'Rp299.000'}) ➔` : 'Pilih Master Director Pack'}
            </button>
            <div className="flex items-center justify-between px-1">
              <a
                href="#hasil"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTab && onSelectTab('all');
                }}
                className="text-xs font-semibold text-muted hover:text-cyan-400 transition-colors"
              >
                Jelajahi seluruh gaya ➔
              </a>
              <a
                href="https://wa.me/6282112001600?text=Halo%20Tim%20AUDIRA,%20saya%20tertarik%20dengan%20Paket%20Master%20Director%20(Rp299.000)"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-semibold text-muted hover:text-cyan-400 transition-colors"
              >
                Tanya via WA
              </a>
            </div>
          </div>
        </article>

        {/* TIER 3: CREATOR LAB ULTIMATE (KANAN) */}
        <article 
          onClick={() => setSelectedTier('lab')}
          className={`flex flex-col gap-6 rounded-3xl p-6 sm:p-7 transition-all cursor-pointer relative ${
            selectedTier === 'lab'
              ? 'border-2 border-amber-400 bg-card shadow-2xl ring-2 ring-amber-500/50 scale-[1.02] z-10'
              : 'border border-line bg-card shadow-card-warm hover:border-line-strong hover:bg-tile/20'
          }`}
        >
          {selectedTier === 'lab' && (
            <span className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-amber-400 text-black font-mono text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
              <Star className="w-3 h-3 fill-black" />
              PAKET TERPILIH (KANAN)
            </span>
          )}

          {/* Card Video Header */}
          <div className="rounded-2xl border border-line bg-ink p-2 sm:p-2.5">
            <figure className="relative m-0 overflow-hidden border border-line aspect-[16/10] rounded-xl bg-tile-2">
              <video
                className="absolute inset-0 size-full object-cover"
                src="/3d-kits/precision.mp4"
                poster="/3d-kits/precision.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Creator Lab Ultimate Preview: Precision"
              />
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-amber-500 text-black font-mono text-[10px] font-bold uppercase z-10">
                COMPLETE BUNDLE
              </span>
            </figure>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-xs tracking-wider text-amber-400 font-semibold uppercase">
                SUITE PROFESIONAL
              </p>
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full border border-edge bg-tile font-mono text-[10px] text-fg-2">
                  FULL ECOSYSTEM
                </span>
                {selectedTier === 'lab' ? (
                  <span className="text-amber-400 font-bold text-[11px] font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 fill-amber-400 text-black" /> Terpilih
                  </span>
                ) : (
                  <span className="text-dim text-[11px] font-mono flex items-center gap-1">
                    <Circle className="w-3.5 h-3.5" /> Pilih
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-2xl font-bold tracking-tight text-paper">
                {pricingConfig?.lab.name ?? 'Creator Lab Ultimate'}
              </h3>
              <div className="flex items-baseline gap-2">
                {pricingConfig?.lab.originalPrice && (
                  <span className="text-xs text-dim line-through font-mono">
                    {pricingConfig.lab.originalPrice}
                  </span>
                )}
                <p className="font-display text-[22px] font-bold text-amber-400">
                  {pricingConfig?.lab.price ?? 'Rp499.000'}
                </p>
              </div>
            </div>

            <p className="text-[14px] leading-relaxed text-muted">
              {pricingConfig?.lab.tagline ?? 'Seluruh Koleksi Gaya 3D + Starter Repo Codebase + Brand Kit (`audira-brand.json`) + Integrasi AI Lokal Bebas Kuota + VIP Support 1-on-1.'}
            </p>
          </div>

          {/* Feature List */}
          <ul className="flex flex-col gap-3 text-[14px] text-fg-2">
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Seluruh Koleksi Gaya 3D + Full Source Codebase Remotion</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>FULL ACTIVE AUDIRA SKILL MESH (MCP Suite)</strong>: Auto-Orchestrate, Voiceover &amp; Social Captions</span>
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
              <span><strong>Buku Panduan + Garansi Setup 1-on-1 Tim AUDIRA</strong> sampai jalan di PC Anda</span>
            </li>
          </ul>

          <div className="mt-auto flex flex-col gap-2.5 pt-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleBuy('lab');
              }}
              className={`w-full inline-flex items-center justify-center gap-1.5 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all active:scale-[0.99] ${
                selectedTier === 'lab'
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-950/40 hover:bg-amber-300'
                  : 'border border-edge bg-tile text-paper hover:bg-tile-2 hover:border-line-strong'
              }`}
            >
              {selectedTier === 'lab' ? `Beli Creator Lab (${pricingConfig?.lab.price ?? 'Rp499.000'}) ➔` : 'Pilih Creator Lab Ultimate'}
            </button>
            <div className="flex items-center justify-between px-1">
              <a
                href="#bundle"
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-semibold text-muted hover:text-amber-400 transition-colors"
              >
                Detail ekosistem ➔
              </a>
              <a
                href="https://wa.me/6282112001600?text=Halo%20Tim%20AUDIRA,%20saya%20tertarik%20dengan%20Paket%20Creator%20Lab%20Ultimate%20(Rp499.000)"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-semibold text-muted hover:text-amber-400 transition-colors"
              >
                Tanya via WA
              </a>
            </div>
          </div>
        </article>
      </div>

      {/* Upgrade Callout Banner */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-line-strong bg-card px-6 py-5 sm:px-8">
        <div className="max-w-[680px]">
          <p className="text-[16px] sm:text-[17px] leading-normal text-fg-2 font-medium">
            Mau seluruh koleksi gaya sinematik 3D, starter codebase Remotion, dan AI lokal tanpa batas?
          </p>
          <p className="text-xs text-muted mt-1">
            Ambil <span className="text-accent font-bold">AUDIRA Creator Lab Ultimate</span> cuma tambah Rp200.000 dari Master Director Pack!
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
          <span>Pilih Jasa Terima Beres (Mulai Rp349k)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
};
