'use client';

import React, { useState } from 'react';
import { Sparkles, Copy, Check, ArrowRight } from 'lucide-react';

const PLACEHOLDERS = [
  'Rumah villa 2 lantai dirakit bertahap dari pondasi baja ringan hingga finishing kaca modern',
  'Exploded view jam tangan kronograf titanium mewah terurai memperlihatkan roda gigi mekanik',
  'Hologram 3D inti reaktor AI kuantum melayang di ruang gelap dengan cincin telemetri HUD',
  'Kota mini voxel saat malam hujan, robot pengantar membawa lentera bersinar di jalanan basah',
];

export const IdeaForm: React.FC<{ variant?: number }> = ({ variant = 0 }) => {
  const [idea, setIdea] = useState('');
  const [copied, setCopied] = useState(false);
  const placeholder = PLACEHOLDERS[variant % PLACEHOLDERS.length];

  const handleCopyCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const promptText = idea.trim() || placeholder;
    const command = `/audira-motion ${promptText}`;

    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <form onSubmit={handleCopyCommand} className="w-full max-w-[560px] flex flex-col gap-2.5">
      <div className="rounded-2xl border border-line bg-card p-2 sm:p-2.5 shadow-card-warm">
        <div className="flex items-center justify-between px-3 pt-1.5 pb-1">
          <label htmlFor={`idea-${variant}`} className="font-mono text-[11px] uppercase tracking-wider text-accent font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Ketik Ide Animasi 3D Anda</span>
          </label>
          <span className="font-mono text-[10px] text-dim">Claude Code CLI</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id={`idea-${variant}`}
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder={placeholder}
            maxLength={600}
            className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-xs sm:text-[14px] text-paper placeholder:text-dim focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-xs sm:text-sm font-bold text-ink shadow-md hover:bg-orange-500 transition-all active:scale-95"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-ink" />
                <span>Prompt Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Salin Perintah AI</span>
              </>
            )}
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-muted">
        <span>Otomatis menambahkan format <code className="text-accent bg-ink px-1.5 py-0.5 rounded border border-line font-mono text-[10px]">/audira-motion</code></span>
        <a href="#produk" className="text-accent hover:underline font-semibold flex items-center gap-1">
          <span>Pilih lisensi untuk render 60 FPS</span>
          <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </form>
  );
};
