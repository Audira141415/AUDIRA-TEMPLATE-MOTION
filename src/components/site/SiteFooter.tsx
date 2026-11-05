import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, MessageCircle } from 'lucide-react';

const COLUMNS = [
  {
    title: 'Produk & Layanan',
    links: [
      { href: '/#produk', label: 'Paket Lisensi 3D' },
      { href: '/#jasa', label: 'Jasa Terima Beres (DFY)' },
      { href: '/#bundle', label: 'Creator Lab Ultimate' },
      { href: '/#hasil', label: 'Galeri 29 Gaya 3D' },
    ],
  },
  {
    title: 'Panduan & Bantuan',
    links: [
      { href: '/panduan', label: 'Panduan Instalasi & Setup' },
      { href: '/#cara-kerja', label: 'Cara Kerja 3 Langkah' },
      { href: '/#faq', label: 'FAQ & Spek Hardware' },
      { href: 'https://wa.me/6285709666240', label: 'WhatsApp Support (+62 857-0966-6240)' },
    ],
  },
  {
    title: 'Ekosistem AUDIRA',
    links: [
      { href: 'https://audira.my.id', label: 'audira.my.id' },
      { href: 'mailto:official@audira.my.id', label: 'official@audira.my.id' },
      { href: 'https://github.com/Audira141415/AUDIRA-TEMPLATE-MOTION', label: 'GitHub Repository' },
    ],
  },
];

export const SiteFooter: React.FC = () => (
  <footer className="border-t border-line bg-ink font-display text-paper">
    {/* Voynan-style Heroic Closing Banner */}
    <div className="border-b border-line">
      <div className="mx-auto max-w-[1240px] px-4 py-16 sm:py-20 md:px-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1 font-mono text-xs uppercase tracking-[0.14em] text-accent">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Siap Produksi Konten Viral?</span>
        </div>

        <h2 className="mt-4 font-display text-[32px] sm:text-[48px] font-bold tracking-[-0.03em] text-paper max-w-3xl mx-auto leading-[1.08]">
          Video berikutnya, biar <span className="text-accent">AUDIRA</span> yang ngerjain.
        </h2>

        <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-muted leading-relaxed">
          Ketik ide cerita atau naskah Anda, biarkan AI menyuarakan dalam vokal bahasa Indonesia yang luwes, dan render video 1080p 60 FPS secara lokal lewat Remotion 4.0 atau offline lewat Ollama.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/#bundle"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm sm:text-base font-bold text-ink shadow-lg shadow-orange-950/50 hover:bg-orange-500 transition-all"
          >
            <span>Ambil Creator Lab : Rp499.000</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://wa.me/6285709666240"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-edge bg-tile px-6 py-3.5 text-sm sm:text-base font-semibold text-paper hover:bg-tile-2 hover:border-line-strong transition-all"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Konsultasi WhatsApp</span>
          </a>
        </div>
      </div>
    </div>

    {/* Navigation Links Columns */}
    <div className="mx-auto grid max-w-[1240px] gap-10 px-4 py-14 sm:py-16 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:px-8">
      <div>
        <p className="text-[18px] font-extrabold tracking-[-0.02em] text-paper">
          AUDIRA <span className="text-accent">Motion</span>
        </p>
        <p className="mt-3 max-w-[280px] text-[14px] leading-relaxed text-muted">
          Ketik satu ide, dapat reel vertikal 9:16 yang sudah ditulis, disuarakan vokal Indonesia, dan dirender 1080p.
        </p>
        <div className="mt-4">
          <a
            href="https://wa.me/6285709666240"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:underline"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Support: +62 857-0966-6240</span>
          </a>
        </div>
      </div>

      {COLUMNS.map((col) => (
        <div key={col.title}>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-dim">{col.title}</p>
          <ul className="mt-4 space-y-2.5 text-[14px]">
            {col.links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-fg-2 transition-colors hover:text-paper"
                  target={l.href.startsWith('http') ? '_blank' : undefined}
                  rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    {/* Copyright Bar */}
    <div className="border-t border-line-soft">
      <div className="mx-auto flex max-w-[1240px] flex-col sm:flex-row items-center justify-between gap-4 px-4 py-6 text-xs text-dim md:px-8">
        <p>© 2026 AUDIRA Multimedia Digital (Agus Dwi Rianto). Hak cipta dilindungi.</p>
        <p className="font-mono">Engine: Next.js 16 + Remotion + Cartesia + Ollama</p>
      </div>
    </div>
  </footer>
);
