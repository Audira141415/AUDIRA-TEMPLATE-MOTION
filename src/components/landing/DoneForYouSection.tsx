'use client';

import React, { useState } from 'react';
import { 
  Check, 
  MessageCircle, 
  Clock, 
  Zap, 
  Star,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle
} from 'lucide-react';

export type DfyPlanId = 'single' | 'bundle' | 'retainer';

export interface DoneForYouSectionProps {
  onBuyPlan?: (planId: DfyPlanId) => void;
}

interface DfyPlan {
  id: DfyPlanId;
  name: string;
  badge: string;
  countBadge: string;
  price: string;
  originalPrice?: string;
  priceSubtitle: string;
  savingsNote?: string;
  desc: string;
  deliverables: Array<{ text: React.ReactNode; isCyan?: boolean; isYellow?: boolean }>;
  buttonText: string;
  waMessage: string;
  popular?: boolean;
}

const DFY_PLANS: DfyPlan[] = [
  {
    id: 'single',
    name: 'Paket Satuan',
    badge: 'UJI COBA',
    countBadge: '1 Video',
    price: 'Rp349.000',
    originalPrice: '',
    priceSubtitle: '/ video reel',
    desc: 'Pilihan ideal untuk menguji kualitas video AUDIRA atau promo kilat campaign produk Anda.',
    buttonText: 'Order Video Satuan',
    deliverables: [
      { text: <span><strong>1 Video Reel/Shorts 9:16</strong> (durasi 30–60 detik)</span> },
      { text: <span>Naskah diracik tim AUDIRA dengan formula viral hook</span> },
      { text: <span>Suara narator jernih Cartesia AI (Citra / Galang)</span> },
      { text: <span>Kinetic subtitle (MrBeast / Ali Abdaal style)</span> },
      { text: <span>Bebas pilih gaya (Explainer, Roblox, Banter, atau 3D)</span> },
      { text: <span>1x garansi revisi minor naskah & visual</span> },
      { text: <span className="text-[#38bdf8] font-semibold">Pengerjaan kilat 24 jam</span>, isCyan: true },
    ],
    waMessage: 'Halo Mas Agus AUDIRA, saya ingin order Paket Satuan Video Motion Terima Beres (Rp349.000). Mohon info langkah selanjutnya.',
  },
  {
    id: 'bundle',
    name: 'Paket 5 Video',
    badge: 'STARTER CREATOR',
    countBadge: '5 Video Reels',
    price: 'Rp1.399.000',
    originalPrice: 'Rp1.745.000',
    priceSubtitle: '',
    savingsNote: 'Hanya ~Rp279.000 per video (Hemat Rp346.000)',
    desc: 'Sempurna untuk mengisi feed selama 1–2 minggu penuh. Menguji variasi angle dan format konten berbeda.',
    popular: true,
    buttonText: 'Pesan Paket 5 Video Sekarang',
    deliverables: [
      { text: <span><strong>5 Video Reels/Shorts 9:16</strong> siap tayang</span> },
      { text: <span>Bebas campur format (contoh: 2 Explainer + 2 Skits + 1 3D)</span> },
      { text: <span>Riset angle & hook kontroversial untuk menaikkan watch-time</span> },
      { text: <span>Sound effect (SFX) & BGM berlisensi komersial aman</span> },
      { text: <span>Termasuk caption teks & rekomendasi hashtag postingan</span> },
      { text: <span>2x garansi revisi per video</span> },
      { text: <span className="text-[#38bdf8] font-semibold">Penyelesaian bertahap 2–4 hari kerja</span>, isCyan: true },
    ],
    waMessage: 'Halo Mas Agus AUDIRA, saya ingin order Paket Starter 5 Video Reels (Rp1.399.000). Saya mau diskusi konsep untuk akun sosmed/bisnis saya.',
  },
  {
    id: 'retainer',
    name: 'Monthly Retainer',
    badge: 'DOMINASI BULANAN',
    countBadge: '15 Video / Bulan',
    price: 'Rp3.490.000',
    originalPrice: '',
    priceSubtitle: '/ bulan',
    savingsNote: 'Hanya ~Rp232.000 per video (Hemat Rp1.745.000)',
    desc: 'Untuk bisnis, agency, atau personal brand yang ingin konsisten upload 1 video tiap 2 hari tanpa repot punya karyawan video editor.',
    buttonText: 'Konsultasi Retainer Bulanan',
    deliverables: [
      { text: <span><strong>15 Video Reels/Shorts 9:16</strong> terdistribusi sebulan</span> },
      { text: <span>Jadwal konten rapi (3–4 video per minggu)</span> },
      { text: <span>Bedah materi kompetitor & adaptasi tren viral</span> },
      { text: <span>Custom watermark logo & warna brand Anda</span> },
      { text: <span>Prioritas antrean pengerjaan kilat VIP</span> },
      { text: <span>Revisi bebas sampai cocok dengan visi Anda</span> },
      { text: <span className="text-[#facc15] font-semibold">Direct line konsultasi WhatsApp pribadi Mas Agus</span>, isYellow: true },
    ],
    waMessage: 'Halo Mas Agus AUDIRA, saya tertarik berlangganan Monthly Retainer 15 Video (Rp3.490.000/bln) untuk brand saya. Bisa kita jadwalkan konsultasi brief?',
  }
];

export const DoneForYouSection: React.FC<DoneForYouSectionProps> = ({ onBuyPlan }) => {
  const [selectedPlan, setSelectedPlan] = useState<DfyPlanId>('bundle');
  const WHATSAPP_BASE = 'https://wa.me/6285709666240';

  const planOrder: DfyPlanId[] = ['single', 'bundle', 'retainer'];

  const handlePrevPlan = () => {
    const currentIndex = planOrder.indexOf(selectedPlan);
    const prevIndex = (currentIndex - 1 + planOrder.length) % planOrder.length;
    setSelectedPlan(planOrder[prevIndex]);
  };

  const handleNextPlan = () => {
    const currentIndex = planOrder.indexOf(selectedPlan);
    const nextIndex = (currentIndex + 1) % planOrder.length;
    setSelectedPlan(planOrder[nextIndex]);
  };

  const handleOrder = (plan: DfyPlan) => {
    if (onBuyPlan) {
      onBuyPlan(plan.id);
    } else {
      const url = `${WHATSAPP_BASE}?text=${encodeURIComponent(plan.waMessage)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section id="jasa" className="mx-auto max-w-[1240px] scroll-mt-8 px-4 py-16 md:px-8 md:py-24">
      {/* Section Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-line pb-8">
        <div className="flex max-w-[760px] flex-col gap-3">
          <div className="inline-flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-emerald-400 font-bold">
              VIP DONE-FOR-YOU AGENCY SERVICE
            </p>
          </div>
          <h2 className="font-display text-[32px] sm:text-[46px] font-bold leading-[1.06] tracking-[-0.03em] text-paper">
            Nggak Punya Waktu Bikin Sendiri? <br className="hidden sm:inline" />
            <span className="text-accent">Biar Tim AUDIRA yang Kerjakan (Terima Beres).</span>
          </h2>
          <p className="text-sm sm:text-base text-muted leading-relaxed">
            Kirimkan topik, materi jualan, atau link produk Anda di WhatsApp. Kami yang meriset hook retensi, menulis naskah persuasif, mengisi suara AI jernih bahasa Indonesia, menganimasikan visual 3D atau skits, hingga video 1080p siap upload masuk ke HP Anda dalam 24 jam.
          </p>
        </div>

        {/* SLA Trust Badge */}
        <div className="flex flex-col gap-2 rounded-2xl border border-line bg-card p-4 shrink-0 min-w-[240px]">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-accent">
            <Clock className="w-4 h-4" />
            <span>SLA 24 JAM SELESAI</span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Pengerjaan kilat untuk video satuan. Anda tinggal review, beri masukan, dan langsung posting ke sosmed.
          </p>
        </div>
      </div>

      {/* Interactive Plan Selector Bar */}
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-line bg-card p-3 sm:p-4 shadow-card-warm">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 rounded-full bg-accent animate-ping" />
          <span className="font-mono text-xs uppercase tracking-wider text-paper font-bold">
            Pilih Paket: <span className="text-accent">{selectedPlan === 'single' ? 'Kiri (Paket Satuan)' : selectedPlan === 'bundle' ? 'Tengah (Paket 5 Video)' : 'Kanan (Monthly Retainer)'}</span>
          </span>
        </div>

        {/* Segmented Control with Left and Right Arrows */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
          <button
            type="button"
            onClick={handlePrevPlan}
            aria-label="Pilih paket sebelumnya (geser ke kiri)"
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl border border-edge bg-tile text-xs font-bold text-muted hover:text-paper hover:border-line-strong transition-colors"
            title="Pilih paket sebelah kiri"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden md:inline font-mono text-[11px]">Kiri</span>
          </button>

          <div className="grid grid-cols-3 gap-1 bg-ink p-1 rounded-xl border border-line text-xs font-bold">
            <button
              type="button"
              onClick={() => setSelectedPlan('single')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedPlan === 'single'
                  ? 'bg-accent text-ink shadow-md font-black'
                  : 'text-muted hover:text-paper hover:bg-tile/50'
              }`}
            >
              1. Satuan (349k)
            </button>
            <button
              type="button"
              onClick={() => setSelectedPlan('bundle')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedPlan === 'bundle'
                  ? 'bg-accent text-ink shadow-md font-black'
                  : 'text-muted hover:text-paper hover:bg-tile/50'
              }`}
            >
              2. 5 Video (1.399k)
            </button>
            <button
              type="button"
              onClick={() => setSelectedPlan('retainer')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedPlan === 'retainer'
                  ? 'bg-purple-400 text-black shadow-md font-black'
                  : 'text-muted hover:text-paper hover:bg-tile/50'
              }`}
            >
              3. Retainer (3.490k)
            </button>
          </div>

          <button
            type="button"
            onClick={handleNextPlan}
            aria-label="Pilih paket berikutnya (geser ke kanan)"
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl border border-edge bg-tile text-xs font-bold text-muted hover:text-paper hover:border-line-strong transition-colors"
            title="Pilih paket sebelah kanan"
          >
            <span className="hidden md:inline font-mono text-[11px]">Kanan</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3 Pricing & Service Tiers Grid matching Screenshot */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-stretch">
        {DFY_PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const isSingle = plan.id === 'single';
          const isBundle = plan.id === 'bundle';
          const isRetainer = plan.id === 'retainer';

          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-7 transition-all cursor-pointer ${
                isBundle
                  ? 'border-2 border-[#ff6a2a] bg-[#161514] shadow-2xl shadow-orange-950/20'
                  : isRetainer
                  ? 'border border-[#2a2636] bg-[#151419] shadow-xl hover:border-purple-800/60'
                  : 'border border-[#272624] bg-[#161514] shadow-xl hover:border-neutral-700'
              } ${isSelected ? 'ring-2 ring-accent/40 scale-[1.01]' : ''}`}
            >
              {/* Top Center Floating Badge for Bundle (Paling Laris • Hemat 20%) */}
              {isBundle && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#ff6a2a] px-3.5 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider text-black shadow flex items-center gap-1.5 whitespace-nowrap">
                  <span>★</span>
                  <span>PALING LARIS</span>
                  <span>•</span>
                  <span>HEMAT 20%</span>
                </div>
              )}

              <div>
                {/* Header row with badges and Radio Selector */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-xs font-bold uppercase tracking-wider ${
                      isRetainer ? 'text-[#c084fc]' : 'text-[#ff6a2a]'
                    }`}>
                      {plan.badge}
                    </span>
                  </div>

                  <span className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] ${
                    isRetainer
                      ? 'bg-[#3b1754] text-[#d8b4fe] border border-purple-800/50'
                      : isBundle
                      ? 'bg-[#29160d] text-[#ff8e54] border border-[#ff6a2a]/40'
                      : 'border border-neutral-800 bg-[#21201d] text-neutral-300'
                  }`}>
                    {plan.countBadge}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold tracking-tight text-white mb-1.5">
                  {plan.name}
                </h3>
                <p className="text-xs text-[#9d9990] mb-5 leading-relaxed min-h-[38px]">
                  {plan.desc}
                </p>

                {/* Price Display */}
                <div className="mb-6 flex flex-col">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className={`font-display text-[32px] sm:text-[34px] font-extrabold tracking-tight ${
                      isBundle ? 'text-[#ff6a2a]' : 'text-white'
                    }`}>
                      {plan.price}
                    </span>
                    {plan.originalPrice && (
                      <span className="text-xs text-neutral-500 line-through font-mono">
                        {plan.originalPrice}
                      </span>
                    )}
                    {plan.priceSubtitle && (
                      <span className="text-xs text-neutral-400">
                        {plan.priceSubtitle}
                      </span>
                    )}
                  </div>
                  {plan.savingsNote && (
                    <span className={`text-[11px] font-mono font-semibold mt-1 ${
                      isRetainer ? 'text-[#c084fc]' : 'text-[#34d399]'
                    }`}>
                      {plan.savingsNote}
                    </span>
                  )}
                </div>

                {/* Deliverables List */}
                <ul className="flex flex-col gap-3 text-xs sm:text-[13px] text-[#d4d1c9] mb-8 border-t border-neutral-800/80 pt-5">
                  {plan.deliverables.map((d, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-2.5">
                      {d.isCyan ? (
                        <Clock className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
                      ) : d.isYellow ? (
                        <Zap className="w-4 h-4 text-[#facc15] shrink-0 mt-0.5" />
                      ) : (
                        <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#ff6a2a]" />
                      )}
                      <span>{d.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button matching screenshot */}
              <div className="mt-auto flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOrder(plan);
                  }}
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold transition-all active:scale-[0.99] ${
                    isBundle
                      ? 'bg-[#ff6a2a] text-black hover:bg-[#ff7d42] shadow-lg shadow-orange-950/40 font-black'
                      : isRetainer
                      ? 'border border-[#581c87] bg-transparent text-[#e9d5ff] hover:bg-[#3b1754]/30 hover:border-[#7e22ce]'
                      : 'border border-neutral-800 bg-transparent text-neutral-200 hover:bg-neutral-800/40 hover:border-neutral-700'
                  }`}
                >
                  <MessageCircle className={`w-4 h-4 ${
                    isBundle 
                      ? 'fill-black text-black' 
                      : isRetainer 
                      ? 'text-[#c084fc]' 
                      : 'text-[#34d399]'
                  }`} />
                  <span>{plan.buttonText}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4 Steps How DFY Works */}
      <div className="mt-12 rounded-3xl border border-line bg-card p-6 sm:p-8">
        <h4 className="font-display text-lg sm:text-xl font-bold text-paper mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5 text-accent" />
          <span>Cara Kerja Pemesanan Jasa Terima Beres:</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs font-bold text-accent">01. CHAT WHATSAPP / ORDER</span>
            <p className="text-xs text-muted leading-relaxed">
              Pilih paket di atas, klik tombol order atau kirimkan tema, materi produk, atau akun sosmed Anda di WhatsApp.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs font-bold text-accent">02. RACIK NASKAH & AUDIO</span>
            <p className="text-xs text-muted leading-relaxed">
              Tim kami meracik naskah berhook tajam dan menghasilkan audio suara jernih untuk persetujuan Anda.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs font-bold text-accent">03. ANIMASI & RENDER 1080P</span>
            <p className="text-xs text-muted leading-relaxed">
              Video dianimasikan menggunakan engine AUDIRA dengan subtitle kinetik, efek suara, dan 3D presisi.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs font-bold text-accent">04. TERIMA FILE MP4</span>
            <p className="text-xs text-muted leading-relaxed">
              File video MP4 1080p full quality dikirim langsung ke WhatsApp/Google Drive Anda, siap upload!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
