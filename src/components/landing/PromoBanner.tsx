'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, X } from 'lucide-react';

export interface PromoBannerProps {
  badge?: string;
  text?: string;
  link?: string;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  badge = 'PROMO SPESIAL 2026',
  text = 'Gratis Bundling AUDIRA Skill Mesh (MCP Server) + Panduan Lengkap untuk Setiap Pembelian Lisensi Resmi',
  link = '#produk',
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside
      aria-label="Pengumuman Promo"
      className="relative z-50 bg-gradient-to-r from-orange-950/70 via-black to-zinc-950 border-b border-orange-500/30 px-4 py-2.5 font-display text-xs text-paper backdrop-blur-sm transition-all"
    >
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-3">
        <div className="flex flex-1 items-center justify-center gap-2.5 sm:gap-3 flex-wrap text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 border border-accent/60 px-2.5 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider text-accent shadow-sm animate-pulse">
            <Sparkles className="w-3 h-3 text-accent" />
            <span>{badge}</span>
          </span>

          <span className="text-[11px] sm:text-xs font-semibold text-paper/90 leading-tight">
            {text}
          </span>

          {link && (
            <Link
              href={link}
              className="inline-flex items-center gap-1 font-bold text-accent hover:text-orange-400 hover:underline transition-colors shrink-0 text-[11px] sm:text-xs"
            >
              <span>Klaim Promo</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Tutup promo banner"
          className="text-dim hover:text-paper p-1 rounded-lg hover:bg-tile/50 transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};

