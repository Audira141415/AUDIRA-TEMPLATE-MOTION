'use client';

import React from 'react';
import { 
  Check, 
  MessageCircle, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  Award, 
  Layers, 
  Video,
  Star
} from 'lucide-react';

export const DoneForYouSection: React.FC = () => {
  const WHATSAPP_BASE = 'https://wa.me/6285709666240';

  return (
    <section id="jasa" className="mx-auto max-w-[1240px] scroll-mt-8 px-4 py-16 md:px-8 md:py-24">
      {/* Section Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-line pb-8">
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

      {/* 3 Pricing & Service Tiers */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* TIER 1: SINGLE VIDEO TESTER */}
        <div className="flex flex-col justify-between rounded-3xl border border-line bg-card p-6 sm:p-7 shadow-card-warm transition-transform hover:-translate-y-1">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="font-mono text-xs font-semibold text-accent uppercase tracking-wider">
                UJI COBA
              </span>
              <span className="rounded-full border border-edge bg-tile px-2.5 py-0.5 font-mono text-[10px] text-fg-2">
                1 Video
              </span>
            </div>

            <h3 className="font-display text-2xl font-bold tracking-tight text-paper mb-1">
              Paket Satuan
            </h3>
            <p className="text-xs text-muted mb-4">
              Pilihan ideal untuk menguji kualitas video AUDIRA atau promo kilat campaign produk Anda.
            </p>

            <div className="mb-6 flex items-baseline gap-2">
              <span className="font-display text-3xl font-extrabold text-paper">Rp199.000</span>
              <span className="text-xs text-muted">/ video reel</span>
            </div>

            {/* Deliverables */}
            <ul className="flex flex-col gap-3 text-xs sm:text-[13px] text-fg-2 mb-6 border-t border-line-soft pt-5">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span><strong>1 Video Reel/Shorts 9:16</strong> (durasi 30–60 detik)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>Naskah diracik tim AUDIRA dengan formula viral hook</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>Suara narator jernih Cartesia AI (Citra / Galang)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>Kinetic subtitle (MrBeast / Ali Abdaal style)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>Bebas pilih gaya (Explainer, Roblox, Banter, atau 3D)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>1x garansi revisi minor naskah & visual</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="text-cyan-300 font-semibold">Pengerjaan kilat 24 jam</span>
              </li>
            </ul>
          </div>

          <a
            href={`${WHATSAPP_BASE}?text=${encodeURIComponent('Halo Mas Agus AUDIRA, saya ingin order Paket Satuan Video Motion Terima Beres (Rp199.000). Mohon info langkah selanjutnya.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-edge bg-tile px-4 py-3 text-sm font-bold text-fg-2 hover:bg-tile-2 hover:border-line-strong hover:text-paper transition-all"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Order Video Satuan</span>
          </a>
        </div>

        {/* TIER 2: 5 VIDEOS STARTER PACK (RECOMMENDED) */}
        <div className="relative flex flex-col justify-between rounded-3xl border-2 border-accent bg-card p-6 sm:p-7 shadow-card-warm transition-transform hover:-translate-y-1">
          <span className="absolute -top-3.5 right-6 rounded-full bg-accent px-3 py-1 font-mono text-[10px] font-black uppercase tracking-wider text-ink shadow-md flex items-center gap-1">
            <Star className="w-3 h-3 fill-ink" />
            PALING LARIS • HEMAT 20%
          </span>

          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="font-mono text-xs font-semibold text-accent uppercase tracking-wider">
                STARTER CREATOR
              </span>
              <span className="rounded-full border border-accent/40 bg-accent/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-accent">
                5 Video Reels
              </span>
            </div>

            <h3 className="font-display text-2xl font-bold tracking-tight text-paper mb-1">
              Paket 5 Video
            </h3>
            <p className="text-xs text-muted mb-4">
              Sempurna untuk mengisi feed selama 1–2 minggu penuh. Menguji variasi angle dan format konten berbeda.
            </p>

            <div className="mb-6 flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-extrabold text-accent">Rp799.000</span>
                <span className="text-xs text-muted line-through font-mono">Rp995.000</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono font-semibold mt-0.5">
                Hanya ~Rp159.000 per video (Hemat Rp196.000)
              </span>
            </div>

            {/* Deliverables */}
            <ul className="flex flex-col gap-3 text-xs sm:text-[13px] text-fg-2 mb-6 border-t border-line-soft pt-5">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span><strong>5 Video Reels/Shorts 9:16</strong> siap tayang</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>Bebas campur format (contoh: 2 Explainer + 2 Skits + 1 3D)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>Riset angle & hook kontroversial untuk menaikkan watch-time</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>Sound effect (SFX) & BGM berlisensi komersial aman</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>Termasuk caption teks & rekomendasi hashtag postingan</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>2x garansi revisi per video</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="text-cyan-300 font-semibold">Penyelesaian bertahap 2–4 hari kerja</span>
              </li>
            </ul>
          </div>

          <a
            href={`${WHATSAPP_BASE}?text=${encodeURIComponent('Halo Mas Agus AUDIRA, saya ingin order Paket Starter 5 Video Reels (Rp799.000). Saya mau diskusi konsep untuk akun sosmed/bisnis saya.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-bold text-ink shadow-lg shadow-orange-950/40 hover:bg-orange-500 transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-ink" />
            <span>Pesan Paket 5 Video Sekarang</span>
          </a>
        </div>

        {/* TIER 3: MONTHLY GROWTH RETAINER */}
        <div className="flex flex-col justify-between rounded-3xl border border-line bg-card p-6 sm:p-7 shadow-card-warm transition-transform hover:-translate-y-1">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="font-mono text-xs font-semibold text-purple-400 uppercase tracking-wider">
                DOMINASI BULANAN
              </span>
              <span className="rounded-full border border-purple-500/30 bg-purple-950/60 px-2.5 py-0.5 font-mono text-[10px] font-bold text-purple-300">
                15 Video / Bulan
              </span>
            </div>

            <h3 className="font-display text-2xl font-bold tracking-tight text-paper mb-1">
              Monthly Retainer
            </h3>
            <p className="text-xs text-muted mb-4">
              Untuk bisnis, agency, atau personal brand yang ingin konsisten upload 1 video tiap 2 hari tanpa repot punya karyawan video editor.
            </p>

            <div className="mb-6 flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-extrabold text-paper">Rp1.999.000</span>
                <span className="text-xs text-muted">/ bulan</span>
              </div>
              <span className="text-[11px] text-purple-300 font-mono font-semibold mt-0.5">
                Hanya ~Rp133.000 per video (Hemat Rp986.000)
              </span>
            </div>

            {/* Deliverables */}
            <ul className="flex flex-col gap-3 text-xs sm:text-[13px] text-fg-2 mb-6 border-t border-line-soft pt-5">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span><strong>15 Video Reels/Shorts 9:16</strong> terdistribusi sebulan</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Jadwal konten rapi (3–4 video per minggu)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Bedah materi kompetitor & adaptasi tren viral</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Custom watermark logo & warna brand Anda</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Prioritas antrean pengerjaan kilat VIP</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Revisi bebas sampai cocok dengan visi Anda</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <span className="text-yellow-300 font-semibold">Direct line konsultasi WhatsApp pribadi Mas Agus</span>
              </li>
            </ul>
          </div>

          <a
            href={`${WHATSAPP_BASE}?text=${encodeURIComponent('Halo Mas Agus AUDIRA, saya tertarik berlangganan Monthly Retainer 15 Video (Rp1.999.000/bln) untuk brand saya. Bisa kita jadwalkan konsultasi brief?')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-purple-500/50 bg-purple-950/40 px-4 py-3 text-sm font-bold text-purple-200 hover:bg-purple-900/50 hover:border-purple-400 transition-all"
          >
            <MessageCircle className="w-4 h-4 text-purple-300" />
            <span>Konsultasi Retainer Bulanan</span>
          </a>
        </div>
      </div>

      {/* 4 Steps How DFY Works */}
      <div className="mt-12 rounded-3xl border border-line bg-card p-6 sm:p-8">
        <h4 className="font-display text-lg sm:text-xl font-bold text-paper mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5 text-accent" />
          <span>Cara Kerja Pemesanan Jasa Terima Beres:</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs font-bold text-accent">01. CHAT WHATSAPP</span>
            <p className="text-xs text-muted leading-relaxed">
              Klik tombol di atas, kirimkan tema, materi produk, atau akun sosmed yang ingin dibuatkan videonya.
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
