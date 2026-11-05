'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export const WhatsAppFloatingWidget: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);
  const WHATSAPP_URL = 'https://wa.me/6285709666240?text=Halo%20Mas%20Agus%20AUDIRA,%20saya%20mau%20tanya-tanya%20seputar%20Lisensi%20Audira%20Motion%203D.';

  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end gap-2 font-display pointer-events-auto">
      {/* Pop-up bubble helper */}
      {showTooltip && (
        <div className="relative flex items-center gap-2 rounded-2xl border border-line bg-card/95 px-3.5 py-2.5 shadow-2xl backdrop-blur-md text-paper text-xs max-w-[240px] animate-fade-in">
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-accent text-[11px] flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Tanya Mas Agus
            </span>
            <p className="text-[11px] text-muted leading-tight">
              Butuh bantuan pilih lisensi atau ada kendala render?
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowTooltip(false)}
            className="text-dim hover:text-paper p-1 -mr-1"
            aria-label="Tutup pesan bantuan"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Floating Button */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Konsultasi WhatsApp Mas Agus"
        className="group flex size-13 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-950/40 hover:bg-emerald-400 hover:scale-110 transition-all duration-200"
      >
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="sr-only">Chat WhatsApp</span>
      </a>
    </div>
  );
};

