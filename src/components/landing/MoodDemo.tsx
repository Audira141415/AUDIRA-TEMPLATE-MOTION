'use client';

import React, { useState } from 'react';
import { MoodType } from '@/types/motion';
import { MOODS } from '@/lib/moods';
import { MOOD_SAMPLES } from './reels';

export const MoodDemo: React.FC = () => {
  const [mood, setMood] = useState<MoodType>('hyped');
  const sample = MOOD_SAMPLES[mood];

  return (
    <div className="grid items-center gap-10 md:grid-cols-[1fr_minmax(0,360px)]">
      <div className="flex flex-col gap-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8a8780]">Ide sama · 7 mood</p>
        <h2 className="font-display text-[44px] font-extrabold leading-[0.98] tracking-[-0.04em] sm:text-[64px]">
          Atur cara Audira <span className="text-[#ea580c]">bereaksi.</span>
        </h2>
        <p className="max-w-[460px] text-[17px] leading-relaxed text-[#b9b6ae]">
          Ash mau resign demi jadi streamer. Followers-nya empat puluh. Idenya selalu sama, yang berubah hanya Audira: kata-katanya,
          ekspresinya, suaranya, dan temponya.
        </p>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Pilih mood">
          {MOODS.map((m) => (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={mood === m.id}
              onClick={() => setMood(m.id)}
              className={`rounded-lg border px-3.5 py-2 text-sm font-semibold transition-colors ${
                mood === m.id
                  ? 'border-[#ea580c] bg-[#ea580c] text-white'
                  : 'border-[#2c2b28] bg-[#1c1c1a] text-[#d6d3cc] hover:border-[#4a4843]'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="font-display text-[22px] font-bold tracking-[-0.02em]" aria-live="polite">
          {sample.verdict.split('.')[0]}.<span className="text-[#8a8780]">{sample.verdict.split('.').slice(1).join('.')}</span>
        </p>
      </div>

      <div className="relative mx-auto w-full max-w-[340px] overflow-hidden rounded-[28px] border border-[#2c2b28] bg-black aspect-[9/16]">
        <video
          src="/reels/banter.mp4"
          poster="/reels/banter.jpg"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-x-4 bottom-6 rounded-2xl border-2 border-black bg-[#f4f3f0] p-4 text-[#141413] shadow-[6px_6px_0_#ea580c]">
          <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[#ea580c]">Audira · {MOODS.find((m) => m.id === mood)?.label}</p>
          <p key={mood} className="text-[17px] font-bold leading-snug">
            {sample.line}
          </p>
        </div>
      </div>
    </div>
  );
};
