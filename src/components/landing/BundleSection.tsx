'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Sparkles, Box, Terminal, ShoppingBag } from 'lucide-react';
import { ProductTier } from './OrderModal';

interface Props {
  onBuyTier?: (tier: ProductTier) => void;
}

const COMPARISON_ROWS = [
  { feature: 'Koleksi Gaya Sinematik 3D', starter: '5 Gaya Pilihan', master: 'Semua 29 Gaya', lab: 'Semua 29 Gaya Penuh' },
  { feature: 'Engine Remotion 4.0 & CLI Runner', starter: '5 Gaya', master: 'Semua 29 Gaya', lab: 'Semua 29 Gaya' },
  { feature: 'AUDIRA Skill Mesh (Active MCP Server)', starter: '-', master: 'Lite MCP Config', lab: 'Full MCP Suite (Auto-Orchestrate & VO)' },
  { feature: 'Buku Panduan Instalasi Lengkap (/panduan)', starter: 'Termasuk', master: 'Termasuk', lab: 'Termasuk + Video Runbook' },
  { feature: 'Perintah Claude Code (/audira-motion)', starter: 'Termasuk', master: 'Termasuk', lab: 'Termasuk' },
  { feature: 'Normalisasi Audio Siaran (-14 LUFS)', starter: 'Standar', master: 'Presisi Milidetik', lab: 'Presisi Milidetik' },
  { feature: 'Smoke Preview (540×960 @ 30 FPS)', starter: 'Termasuk', master: 'Termasuk', lab: 'Termasuk' },
  { feature: 'Final Cinema Render (1080×1920 @ 60 FPS)', starter: 'Termasuk', master: 'Termasuk', lab: 'Termasuk' },
  { feature: 'Starter Repo Codebase Remotion', starter: '-', master: '-', lab: 'Full Source Code' },
  { feature: 'Brand Kit Configurator (audira-brand.json)', starter: '-', master: '-', lab: 'Termasuk' },
  { feature: 'AI Lokal Bebas Kuota (Ollama 4B 3D-Coder)', starter: '-', master: '-', lab: 'Termasuk (Offline)' },
  { feature: 'Garansi Setup 1-on-1 Langsung Mas Agus', starter: '-', master: 'WhatsApp Chat', lab: 'Prioritas 1-on-1 Remote Desktop' },
];

export const BundleSection: React.FC<Props> = ({ onBuyTier }) => {
  return (
    <section id="bundle" className="mx-auto max-w-[1240px] scroll-mt-6 px-4 py-16 md:px-8 md:py-24">
      <div className="flex flex-col items-center gap-6 rounded-[28px] border-2 border-accent bg-card px-6 py-12 sm:px-12 sm:py-16 text-center shadow-card-warm">
        {/* Best Value Badge */}
        <span className="rounded-full bg-accent px-3.5 py-1.5 font-mono text-xs font-bold tracking-widest text-ink uppercase shadow">
          BEST VALUE · CREATOR LAB ULTIMATE
        </span>

        {/* Heading */}
        <h2 className="max-w-[780px] font-display text-[32px] sm:text-[48px] font-extrabold leading-[1.05] tracking-tight text-paper">
          29 Signature 3D Styles. <br className="hidden sm:inline" />
          Satu Ekosistem Sutradara Gerak Otonom.
        </h2>

        <p className="max-w-[580px] text-[16px] sm:text-[17px] leading-relaxed text-muted">
          <strong>AUDIRA Creator Lab Ultimate</strong> menyatukan seluruh 29 gaya 3D prosedural, starter codebase Remotion, integrasi AI lokal bebas kuota, serta template prompt eksklusif dalam satu lisensi permanen.
        </p>

        {/* Included Items Pills */}
        <ul className="flex flex-wrap justify-center gap-2 pt-1">
          <li className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-ink px-4 py-2 text-xs font-semibold text-fg-2">
            <Check className="w-3.5 h-3.5 text-accent" />
            5 Ranah Industri (Arsitektur, Taktil, Voxel, Sains, Komersial)
          </li>
          <li className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-ink px-4 py-2 text-xs font-semibold text-cyan-400">
            <Check className="w-3.5 h-3.5 text-cyan-400" />
            Remotion 4.0 + Three.js PBR Engine
          </li>
          <li className="inline-flex items-center gap-2 rounded-full border border-accent/60 bg-accent/10 px-4 py-2 text-xs font-bold text-paper">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            BONUS: Full Starter Repo + Brand Kit + Offline AI Gateway
          </li>
        </ul>

        {/* Pricing Anchor */}
        <div className="mt-2 flex flex-wrap items-baseline justify-center gap-3">
          <p className="font-display text-[44px] sm:text-[54px] font-black text-paper tracking-tight">
            Rp499.000
          </p>
          <p className="text-xl sm:text-2xl text-dim line-through">
            Rp999.000
          </p>
        </div>

        <p className="text-[14px] font-semibold text-accent -mt-2">
          Hemat Rp500.000 (50%), miliki seluruh ekosistem tanpa biaya langganan bulanan.
        </p>

        {/* Primary CTA Action Row */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onBuyTier && onBuyTier('lab')}
            className="btn-primary min-h-14 px-8 text-[16px] font-bold shadow-xl shadow-orange-950/30"
          >
            <span>Beli Creator Lab Ultimate (Rp499.000)</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
          
          <a
            href="https://wa.me/6285709666240?text=Halo%20Mas%20Agus,%20saya%20mau%20konsultasi%20Creator%20Lab%20Ultimate%20(Rp499.000)"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline min-h-14 px-6 text-[15px] font-semibold"
          >
            <span>Konsultasi via WhatsApp</span>
          </a>
        </div>

        <p className="font-mono text-xs text-dim">
          Sekali bayar · Lisensi komersial seumur hidup · Ekspor MP4 60 FPS bebas watermark
        </p>

        {/* Feature Comparison Table */}
        <div className="mt-8 w-full max-w-[760px] overflow-hidden rounded-2xl border border-line text-left bg-ink">
          <table className="w-full table-fixed border-collapse text-xs sm:text-sm">
            <caption className="border-b border-line bg-tile px-4 py-3 text-left font-bold text-fg-2">
              Perbandingan Paket Lisensi Audira Skill Motion 3D
            </caption>
            <colgroup>
              <col className="w-[43%]" />
              <col className="w-[19%]" />
              <col className="w-[19%]" />
              <col className="w-[19%]" />
            </colgroup>
            <thead>
              <tr className="bg-tile-2 text-xs text-muted border-b border-line">
                <th scope="col" className="px-4 py-3 font-semibold">Fitur &amp; Kemampuan</th>
                <th scope="col" className="px-2.5 py-3 text-center font-normal">Starter (149k)</th>
                <th scope="col" className="px-2.5 py-3 text-center font-normal text-cyan-400">Master (299k)</th>
                <th scope="col" className="px-2.5 py-3 text-center font-bold text-accent">Creator Lab (499k)</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, idx) => (
                <tr key={idx} className="border-t border-line-soft hover:bg-tile/50 transition-colors">
                  <th scope="row" className="px-4 py-3 font-normal text-fg-2 text-left">
                    {row.feature}
                  </th>
                  <td className="px-2.5 py-3 text-center text-muted">
                    {row.starter === 'Termasuk' ? (
                      <Check className="w-4 h-4 text-accent mx-auto" />
                    ) : row.starter === '-' ? (
                      <span className="text-dim">-</span>
                    ) : (
                      <span className="text-xs">{row.starter}</span>
                    )}
                  </td>
                  <td className="px-2.5 py-3 text-center text-muted">
                    {row.master === 'Termasuk' ? (
                      <Check className="w-4 h-4 text-cyan-400 mx-auto" />
                    ) : row.master === '-' ? (
                      <span className="text-dim">-</span>
                    ) : (
                      <span className="text-xs text-paper font-semibold">{row.master}</span>
                    )}
                  </td>
                  <td className="px-2.5 py-3 text-center text-paper font-semibold">
                    {row.lab === 'Termasuk' ? (
                      <Check className="w-4 h-4 text-accent mx-auto" />
                    ) : (
                      <span className="text-xs text-accent font-bold">{row.lab}</span>
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
