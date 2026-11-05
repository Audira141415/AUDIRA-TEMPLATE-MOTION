'use client';

import React from 'react';
import { Star, ShieldCheck, TrendingUp, Award, Quote, CheckCircle2 } from 'lucide-react';

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  avatarText: string;
  metric: string;
  metricLabel: string;
  kitUsed: string;
  quote: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: '1',
    name: 'Budi Santoso',
    role: 'Principal Architect & 3D Visualizer, Surabaya',
    avatarText: 'BS',
    metric: '15 Menit',
    metricLabel: 'Dari biasanya 3 hari render',
    kitUsed: 'BUILDFORGE & DRAFTFORGE',
    quote: 'Format BUILDFORGE dan DRAFTFORGE benar-benar memangkas waktu bikin video animasi presentasi arsitektur. Klien properti saya kagum melihat perakitan struktur baja bertahap 60 FPS yang mulus tanpa perlu render berjam-jam di software 3D berat.'
  },
  {
    id: '2',
    name: 'Rian Pratama',
    role: 'Tech Creator & Gadget Reviewer, Jakarta',
    avatarText: 'RP',
    metric: '480k Views',
    metricLabel: 'Dalam 2 minggu penayangan',
    kitUsed: 'PRECISION & CYBERFORGE',
    quote: 'Exploded view jam tangan titanium di kit PRECISION membuat video komersial brand gadget saya tampak sekelas iklan Apple. Ditambah normalisasi vokal Cartesia Indonesia, retensi penonton di Reels naik drastis.'
  },
  {
    id: '3',
    name: 'Sarah Melati',
    role: 'Managing Director Agensi Kreatif, Bandung',
    avatarText: 'SM',
    metric: '5 Klien UMKM',
    metricLabel: 'Balik modal di hari pertama',
    kitUsed: 'CREATOR LAB ULTIMATE',
    quote: 'Paket Creator Lab seharga Rp499.000 adalah investasi digital terbaik tahun ini. Sekali bayar, kami punya 29 variasi gaya 3D dan full codebase Remotion untuk melayani video reels puluhan klien tanpa bayar royalti bulanan.'
  }
];

const TRUST_STATS = [
  { value: '29', label: 'Gaya 3D Sinematik', desc: 'Arsitektur, Taktil, Sains & Komersial' },
  { value: '60 FPS', label: 'Fluid Motion', desc: '1080×1920 Vertikal Ultra-Smooth' },
  { value: '100%', label: 'Bebas Royalti', desc: 'Hak Cipta Penuh untuk Klien & Iklan' },
  { value: '< 24 Jam', label: 'SLA Terima Beres', desc: 'Pengerjaan Kilat Studio AUDIRA' }
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimoni" className="mx-auto max-w-[1240px] px-4 py-16 md:px-8 md:py-24 border-t border-line">
      {/* Header */}
      <div className="mb-12 flex flex-col items-center text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-card px-3.5 py-1.5 font-mono text-[11px] font-semibold tracking-wider text-accent uppercase mb-3">
          <Award className="w-3.5 h-3.5" />
          <span>BUKTI KEPUASAN KREATOR &amp; STUDIO</span>
        </div>

        <h2 className="font-display text-[32px] sm:text-[46px] font-bold leading-[1.08] tracking-[-0.03em] text-paper">
          Dipercaya Kreator &amp; Agensi. <br className="hidden sm:inline" />
          <span className="text-accent">Hasil Nyata, Bukan Halusinasi AI.</span>
        </h2>

        <p className="mt-4 text-sm sm:text-base text-muted leading-relaxed">
          Lihat bagaimana para profesional arsitektur, reviewer gadget, dan pemilik agensi memanfaatkan 29 kit 3D Remotion untuk mendongkrak omset dan visual brand mereka.
        </p>
      </div>

      {/* 4 Stat Badges Grid */}
      <div className="mb-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {TRUST_STATS.map((stat, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center p-5 rounded-2xl border border-line bg-card shadow-card-warm"
          >
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-accent">
              {stat.value}
            </span>
            <span className="text-xs sm:text-sm font-bold text-paper mt-1">
              {stat.label}
            </span>
            <span className="text-[11px] text-muted mt-0.5">
              {stat.desc}
            </span>
          </div>
        ))}
      </div>

      {/* 3 Testimonials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.id}
            className="flex flex-col justify-between rounded-3xl border border-line bg-card p-6 sm:p-7 shadow-card-warm transition-transform hover:-translate-y-1 hover:border-line-strong"
          >
            <div>
              {/* Star Rating & Verified Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Buyer
                </span>
              </div>

              {/* Highlight Metric Pill */}
              <div className="mb-4 rounded-xl border border-line-soft bg-ink p-3 flex items-baseline justify-between gap-2">
                <span className="font-display font-black text-lg text-accent">
                  {t.metric}
                </span>
                <span className="text-[11px] text-muted truncate">
                  {t.metricLabel}
                </span>
              </div>

              {/* Quote Body */}
              <p className="text-xs sm:text-[13px] leading-relaxed text-fg-2 italic mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            {/* Author Footer */}
            <div className="pt-4 border-t border-line-soft flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-tile border border-line flex items-center justify-center font-bold text-xs text-accent">
                  {t.avatarText}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-paper line-clamp-1">
                    {t.name}
                  </h4>
                  <p className="text-[10px] text-muted line-clamp-1">
                    {t.role}
                  </p>
                </div>
              </div>

              <span className="font-mono text-[9px] text-dim bg-tile px-2 py-0.5 rounded border border-line shrink-0">
                {t.kitUsed}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

