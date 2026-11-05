'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, MessageCircle, X, ShoppingBag } from 'lucide-react';
import { ProductTier } from './OrderModal';

interface StickyCtaBarProps {
  onOpenOrderModal: (tier?: ProductTier) => void;
}

export const StickyCtaBar: React.FC<StickyCtaBarProps> = ({ onOpenOrderModal }) => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (dismissed) return;
      if (window.scrollY > 500) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dismissed]);

  if (!visible || dismissed) return null;

  return (
    <aside
      aria-label="Penawaran Lisensi Cepat"
      className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-[960px] animate-slide-up font-display"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 rounded-2xl border-2 border-accent/80 bg-ink/95 px-4 py-3 sm:px-6 sm:py-3.5 shadow-2xl backdrop-blur-xl text-paper">
        {/* Left Information */}
        <div className="flex items-center gap-3 text-center sm:text-left">
          <span className="hidden sm:flex size-9 items-center justify-center rounded-xl bg-accent text-ink shrink-0 font-bold">
            <ShoppingBag className="w-5 h-5 fill-ink" />
          </span>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="font-display text-xs sm:text-sm font-extrabold text-paper">
                Audira Skill Motion 3D
              </span>
              <span className="rounded bg-accent/20 border border-accent/40 px-2 py-0.2 font-mono text-[9px] font-bold text-accent">
                29 GAYA 60 FPS
              </span>
            </div>
            <p className="text-[11px] text-muted">
              Mulai <strong>Rp149.000</strong> · Sekali bayar seumur hidup · Bebas royalti komersial.
            </p>
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
          <button
            type="button"
            onClick={() => onOpenOrderModal('lab')}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs sm:text-[13px] font-bold text-ink shadow-md hover:bg-orange-500 transition-all active:scale-95"
          >
            <span>Beli Lisensi Sekarang</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <a
            href="https://wa.me/6285709666240?text=Halo%20Mas%20Agus%20AUDIRA,%20saya%20tertarik%20dengan%20Lisensi%20Motion%203D.%20Bisa%20info%20detailnya?"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 rounded-xl border border-line bg-tile px-3 py-2 text-xs font-semibold text-emerald-400 hover:border-emerald-500/60 hover:text-white transition-colors"
            title="Tanya AUDIRA di WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="rounded-lg p-1.5 text-dim hover:text-paper hover:bg-tile transition-colors"
            aria-label="Tutup bar promo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

