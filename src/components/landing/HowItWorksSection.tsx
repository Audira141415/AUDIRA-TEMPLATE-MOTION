'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Terminal, Cpu, Video, Sparkles, CheckCircle2 } from 'lucide-react';

const PIPELINE_LOGS = [
  { role: 'SYSTEM', text: 'Mengurai ide cerita & naskah: "Perakitan rumah modern bertahap"' },
  { role: 'DIRECTOR', text: 'Otomatis memilih Gaya 08: BUILDFORGE (3D Architecture Modular)' },
  { role: 'AUDIO SYNC', text: 'Panjang VO terukur 8.00 detik (480 frames @ 60 FPS). EBU R128: -14.0 LUFS' },
  { role: 'RENDERER', text: 'Remotion 4.0 + Three.js WebGL Web Worker render selesai dalam 4.2 detik' },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="cara-kerja" className="mx-auto max-w-[1240px] scroll-mt-6 px-4 py-16 md:px-8 md:py-24">
      {/* Header */}
      <div className="mb-12 flex max-w-[720px] flex-col gap-3">
        <div className="inline-flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-accent" />
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent font-bold">
            ALUR KERJA SUTRADARA AI
          </p>
        </div>
        <h2 className="font-display text-[34px] sm:text-[46px] font-bold leading-[1.05] tracking-[-0.03em] text-paper">
          Dari Satu Baris Perintah Sampai Render 60 FPS.
        </h2>
        <p className="text-[16px] text-muted leading-relaxed">
          Tidak perlu coding shader Three.js manual atau keyframe kamera berjam-jam. Claude Code dan mesin Remotion mengurus seluruh tahapan matematika gerak 3D untuk Anda.
        </p>
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Step 1 */}
        <div className="flex flex-col gap-4 rounded-3xl border border-line bg-card p-7 shadow-card-warm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm font-black text-accent">01</span>
            <Terminal className="w-5 h-5 text-accent" />
          </div>
          <h3 className="font-display text-xl font-bold text-paper">
            Pasang Skill ke Claude Code
          </h3>
          <p className="text-[14px] leading-relaxed text-muted">
            Salin folder <code className="text-xs bg-ink px-1 rounded text-accent">audira-skill-motion/</code> ke direktori skill agen Claude Code Anda, atau jalankan Remotion Studio langsung via file <code className="text-xs bg-ink px-1 rounded text-accent">start_remotion.bat</code>.
          </p>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col gap-4 rounded-3xl border border-line bg-card p-7 shadow-card-warm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm font-black text-accent">02</span>
            <Cpu className="w-5 h-5 text-cyan-400" />
          </div>
          <h3 className="font-display text-xl font-bold text-paper">
            Ketik Perintah /audira-motion
          </h3>
          <p className="text-[14px] leading-relaxed text-muted">
            Ketik ide cerita atau lampirkan file narasi suara (MP3). Agen otomatis menganalisis tempo dan memilih gaya 3D paling tepat dari 29 Signature Styles.
          </p>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col gap-4 rounded-3xl border border-line bg-card p-7 shadow-card-warm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm font-black text-accent">03</span>
            <Video className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="font-display text-xl font-bold text-paper">
            Review Smoke &amp; Render 60 FPS
          </h3>
          <p className="text-[14px] leading-relaxed text-muted">
            Tinjau pratinjau kilat (540×960 @ 30 FPS) untuk revisi visual seketika, lalu render video final 1080×1920 @ 60 FPS berkualitas bioskop media sosial.
          </p>
        </div>
      </div>

      {/* Live Interactive Script-to-Reel Demonstration */}
      <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_1.3fr_0.9fr] rounded-3xl border border-line bg-card p-6 sm:p-8">
        {/* Step 1 Visual */}
        <div className="flex flex-col justify-between gap-6 rounded-2xl border border-line bg-ink p-5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-accent font-bold">
            01 · Perintah Instan Claude Code
          </span>
          <div className="font-mono text-xs sm:text-[13px] text-paper space-y-2 bg-tile p-3.5 rounded-xl border border-line">
            <p className="text-accent font-bold">/audira-motion</p>
            <p className="text-fg-2 leading-relaxed">
              &quot;Rumah dua lantai dibangun dari tanah kosong, pondasi semen, rangka baja, dinding bata, hingga taman asri modern.&quot;
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-dim">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Mode: Autonomous Motion Director</span>
          </div>
        </div>

        {/* Step 2 Visual */}
        <div className="flex flex-col justify-between gap-3 rounded-2xl border border-line bg-ink p-5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-accent font-bold">
            02 · AI Orchestrator Telemetri
          </span>
          <div className="flex flex-col gap-2 overflow-hidden">
            {PIPELINE_LOGS.map((m, i) => (
              <div
                key={i}
                className="rounded-xl border border-line bg-tile p-3 text-xs leading-snug"
              >
                <span className="mb-0.5 block font-mono text-[9px] uppercase tracking-wider text-accent font-bold">
                  {m.role}
                </span>
                <p className="text-fg-2">{m.text}</p>
              </div>
            ))}
          </div>
          <p className="font-mono text-[10px] text-dim">
            Normalisasi siaran: EBU R128 (-14.0 LUFS / -1.0 dBTP)
          </p>
        </div>

        {/* Step 3 Visual */}
        <div className="flex flex-col gap-3 rounded-2xl border border-line bg-ink p-5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-accent font-bold">
            03 · Video Hasil 3D
          </span>
          <div className="relative mx-auto w-full max-w-[210px] overflow-hidden rounded-xl border border-line bg-black aspect-[9/16] shadow-xl">
            <video
              src="/3d-kits/buildforge.mp4"
              poster="/3d-kits/buildforge.jpg"
              controls
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
          </div>
          <p className="text-center font-mono text-[11px] text-dim">
            BUILDFORGE 3D · 1080×1920 60 FPS
          </p>
        </div>
      </div>
    </section>
  );
};
