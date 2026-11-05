'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <aside
      aria-label="Bantuan Langsung WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex items-end gap-3 font-display"
    >
      {/* Tooltip speech bubble */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-ink/95 px-3.5 py-2.5 shadow-2xl backdrop-blur-md animate-fade-in text-paper text-xs">
          <span className="flex size-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <div className="flex flex-col">
            <span className="font-bold text-white">Butuh bantuan pilih gaya 3D?</span>
            <span className="text-[11px] text-muted">Konsultasi langsung ke Mas Agus</span>
          </div>
          <button
            type="button"
            onClick={() => setShowTooltip(false)}
            className="ml-2 text-dim hover:text-paper p-0.5 rounded-lg hover:bg-tile"
            aria-label="Tutup notifikasi"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href="https://wa.me/6285709666240?text=Halo%20Mas%20Agus%20(AUDIRA),%20saya%20tertarik%20dengan%20layanan%20video%20dan%20lisensi%203D%20Anda.%20Bisa%20konsultasi%20sebentar?"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex size-13 sm:size-14 items-center justify-center rounded-2xl bg-emerald-500 text-black shadow-2xl shadow-emerald-950/60 hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all"
        title="Chat Mas Agus di WhatsApp (+62 857-0966-6240)"
        aria-label="Hubungi WhatsApp Mas Agus"
      >
        <span className="absolute -top-1 -right-1 flex size-3.5 items-center justify-center rounded-full bg-accent ring-2 ring-ink">
          <span className="size-1.5 rounded-full bg-white animate-ping" />
        </span>
        <MessageCircle className="w-7 h-7 fill-black group-hover:scale-110 transition-transform" />
      </a>
    </aside>
  );
};

