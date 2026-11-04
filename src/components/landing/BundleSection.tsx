'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Sparkles, X } from 'lucide-react';

const COMPARISON_ROWS = [
  { feature: 'Format Video Motion', single: 'Sesuai paket (7 gaya)', bundle: 'Semua 21 Format Aktif' },
  { feature: 'Web Studio Browser Interaktif', single: 'Format Terpilih Saja', bundle: 'Akses Penuh Tanpa Batas' },
  { feature: 'Suara AI Indonesia (Cartesia)', single: 'Maksimal 3 render / hari', bundle: '1-Klik Batch Voice Sync' },
  { feature: 'Integrasi AI Lokal Bebas Kuota (Ollama)', single: '-', bundle: 'Termasuk (Offline Gateway)' },
  { feature: 'Kustomisasi Subtitle & Safe Zone', single: 'Standar', bundle: 'Lengkap 5 Gaya Kinetik & 5 Font' },
  { feature: 'B-Roll & Screenshot Evidence Upload', single: '-', bundle: 'Termasuk (Ken Burns & Chat Leaks)' },
  { feature: 'Download Prompt Pack (Claude/Cursor)', single: '-', bundle: 'Semua 21 Template Prompt' },
  { feature: 'Ekspor MP4 1080×1920 Tanpa Watermark', single: 'Termasuk', bundle: 'Termasuk' },
  { feature: 'Bantuan Prioritas via WhatsApp', single: '-', bundle: 'Dukungan Langsung 1-on-1' },
];

export const BundleSection: React.FC = () => {
  return (
    <section id="bundle" className="mx-auto max-w-[1200px] scroll-mt-6 px-4 py-16 md:px-8 md:py-24">
      <div className="flex flex-col items-center gap-6 rounded-[28px] border-2 border-line-strong bg-card px-6 py-12 sm:px-12 sm:py-16 text-center shadow-card-warm">
        {/* Best Value Badge */}
        <span className="rounded-full bg-accent px-3.5 py-1.5 font-mono text-xs font-bold tracking-widest text-ink uppercase shadow">
          BEST VALUE · CREATOR LAB
        </span>

        {/* Heading */}
        <h2 className="max-w-[760px] font-display text-[32px] sm:text-[48px] font-extrabold leading-[1.05] tracking-tight text-paper">
          Tiga paket. 21 Archetypes. Satu creative workflow.
        </h2>

        <p className="max-w-[560px] text-[16px] sm:text-[17px] leading-relaxed text-muted">
          AUDIRA Creator Lab: gabungan seluruh format motion, akses Web Studio Pro, integrasi AI lokal Ollama, plus template prompt eksklusif.
        </p>

        {/* Included Items Pills */}
        <ul className="flex flex-wrap justify-center gap-2 pt-1">
          <li className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-ink px-4 py-2 text-xs font-semibold text-fg-2">
            <Check className="w-3.5 h-3.5 text-accent" />
            Explainer &amp; Data · Rp29.000
          </li>
          <li className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-ink px-4 py-2 text-xs font-semibold text-fg-2">
            <Check className="w-3.5 h-3.5 text-cyan-400" />
            Skits &amp; Gaming · Rp49.000
          </li>
          <li className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-ink px-4 py-2 text-xs font-semibold text-fg-2">
            <Check className="w-3.5 h-3.5 text-amber-400" />
            Story &amp; Docu · Rp69.000
          </li>
          <li className="inline-flex items-center gap-2 rounded-full border border-accent/60 bg-accent/10 px-4 py-2 text-xs font-bold text-paper">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            BONUS: Web Studio Pro + Offline Ollama AI Gateway
          </li>
        </ul>

        {/* Pricing Anchor */}
        <div className="mt-2 flex flex-wrap items-baseline justify-center gap-3">
          <p className="font-display text-[44px] sm:text-[54px] font-black text-paper tracking-tight">
            Rp109.000
          </p>
          <p className="text-xl sm:text-2xl text-dim line-through">
            Rp147.000
          </p>
        </div>

        <p className="text-[14px] font-semibold text-accent -mt-2">
          Hemat Rp38.000 (26%), atau cuma tambah Rp40.000 dari harga Skits.
        </p>

        {/* Primary CTA */}
        <Link
          href="/studio"
          className="btn-primary min-h-14 px-8 text-[16px] font-bold shadow-xl shadow-orange-950/30"
        >
          Buka Akses Creator Lab di Studio
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>

        <p className="font-mono text-xs text-dim">
          Sekali bayar · Akses langsung ke seluruh 21 archetype motion
        </p>

        {/* Feature Comparison Table (Voynan Style) */}
        <div className="mt-8 w-full max-w-[700px] overflow-hidden rounded-2xl border border-line text-left bg-ink">
          <table className="w-full table-fixed border-collapse text-xs sm:text-sm">
            <caption className="border-b border-line bg-tile px-4 py-3 text-left font-bold text-fg-2">
              Perbedaan Paket Satuan vs AUDIRA Creator Lab
            </caption>
            <colgroup>
              <col className="w-[50%]" />
              <col className="w-[25%]" />
              <col className="w-[25%]" />
            </colgroup>
            <thead>
              <tr className="bg-tile-2 text-xs text-muted border-b border-line">
                <th scope="col" className="px-4 py-3 font-semibold">Fitur</th>
                <th scope="col" className="px-3 py-3 text-center font-normal">Satuan</th>
                <th scope="col" className="px-3 py-3 text-center font-bold text-accent">Creator Lab</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, idx) => (
                <tr key={idx} className="border-t border-line-soft hover:bg-tile/50 transition-colors">
                  <th scope="row" className="px-4 py-3 font-normal text-fg-2 text-left">
                    {row.feature}
                  </th>
                  <td className="px-3 py-3 text-center text-muted">
                    {row.single === 'Termasuk' ? (
                      <Check className="w-4 h-4 text-accent mx-auto" />
                    ) : row.single === '-' ? (
                      <span className="text-dim">-</span>
                    ) : (
                      row.single
                    )}
                  </td>
                  <td className="px-3 py-3 text-center text-paper font-semibold">
                    {row.bundle === 'Termasuk' ? (
                      <Check className="w-4 h-4 text-accent mx-auto" />
                    ) : (
                      row.bundle
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

