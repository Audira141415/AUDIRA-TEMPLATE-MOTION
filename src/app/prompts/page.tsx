'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Check, Copy } from 'lucide-react';
import { MoodType, MotionFormat } from '@/types/motion';
import { MOODS, moodById } from '@/lib/moods';
import { buildCopyPrompt, IDEA_STARTERS } from '@/lib/script-prompts';
import { FORMAT_CARDS } from '@/components/landing/reels';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import { PasteChecker } from '@/components/site/PasteChecker';

const CopyButton: React.FC<{ text: string; label: string }> = ({ text, label }) => {
  const [done, setDone] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setDone(true);
    setTimeout(() => setDone(false), 1600);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-xl bg-[#ea580c] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#f06a1f]"
    >
      {done ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {done ? 'Tersalin' : label}
    </button>
  );
};

export default function PromptsPage() {
  const [format, setFormat] = useState<MotionFormat>('character_banter');
  const [mood, setMood] = useState<MoodType>('hyped');
  const [idea, setIdea] = useState(IDEA_STARTERS.character_banter[0]);

  const prompt = useMemo(() => buildCopyPrompt(format, moodById(mood), idea), [format, mood, idea]);
  const command = 'node engine/build-reel.mjs reel.json --out renders/reel-saya';

  const pickFormat = (f: MotionFormat) => {
    setFormat(f);
    setIdea(IDEA_STARTERS[f][0]);
  };

  return (
    <div className="min-h-screen bg-[#141413] font-display text-[#f4f3f0]">
      <SiteHeader />

      <main className="mx-auto max-w-[1200px] px-4 py-14 md:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8a8780]">Prompt siap salin · {FORMAT_CARDS.length} format · 7 mood</p>
        <h1 className="mt-4 max-w-[820px] text-[44px] font-extrabold leading-[0.98] tracking-[-0.05em] sm:text-[68px]">
          Pilih format. Salin prompt. <span className="text-[#ea580c]">Render.</span>
        </h1>
        <p className="mt-5 max-w-[620px] text-[17px] leading-relaxed text-[#b9b6ae]">
          Setiap prompt di sini menghasilkan storyboard JSON yang langsung bisa dirender mesin AUDIRA MOTION. Tempel ke Claude
          atau asisten AI lain, simpan jawabannya sebagai <code className="font-mono text-[#f4f3f0]">reel.json</code>, lalu render.
        </p>

        {/* 1. Format */}
        <section className="mt-12">
          <h2 className="text-[22px] font-extrabold tracking-[-0.02em]">1. Pilih format</h2>
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-7">
            {FORMAT_CARDS.map((c) => {
              const active = c.reel.format === format;
              return (
                <button
                  key={c.reel.format}
                  type="button"
                  onClick={() => pickFormat(c.reel.format)}
                  aria-pressed={active}
                  className={`overflow-hidden rounded-2xl border-2 text-left transition-colors ${
                    active ? 'border-[#ea580c]' : 'border-[#2c2b28] hover:border-[#4a4843]'
                  }`}
                >
                  <img src={`/reels/${c.reel.file}.jpg`} alt="" className="aspect-[9/12] w-full object-cover object-top" />
                  <span className={`block px-3 py-2 text-[13px] font-bold ${active ? 'bg-[#ea580c] text-white' : 'bg-[#1c1c1a]'}`}>
                    {c.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. Mood + idea */}
        <section className="mt-10 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-[22px] font-extrabold tracking-[-0.02em]">2. Pilih mood</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  aria-pressed={mood === m.id}
                  onClick={() => setMood(m.id)}
                  className={`rounded-lg border px-3.5 py-2 text-sm font-semibold transition-colors ${
                    mood === m.id ? 'border-[#ea580c] bg-[#ea580c] text-white' : 'border-[#2c2b28] bg-[#1c1c1a] text-[#d6d3cc] hover:border-[#4a4843]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-[14px] text-[#8a8780]">{moodById(mood).tagline}</p>
          </div>
          <div>
            <h2 className="text-[22px] font-extrabold tracking-[-0.02em]">3. Tulis idenya</h2>
            <input
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              maxLength={600}
              aria-label="Ide reel"
              className="mt-4 w-full rounded-xl border border-[#2c2b28] bg-[#1c1c1a] px-4 py-3 text-[15px] focus:border-[#ea580c] focus:outline-none"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {IDEA_STARTERS[format].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setIdea(s)}
                  className="rounded-lg border border-[#2c2b28] px-3 py-1.5 text-left text-[13px] text-[#b9b6ae] hover:border-[#4a4843] hover:text-white"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Prompt */}
        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[22px] font-extrabold tracking-[-0.02em]">4. Salin prompt ini</h2>
            <CopyButton text={prompt} label="Salin prompt" />
          </div>
          <pre className="mt-4 max-h-[460px] overflow-auto whitespace-pre-wrap rounded-2xl border border-[#2c2b28] bg-[#0f0f0e] p-5 font-mono text-[13px] leading-relaxed text-[#d6d3cc]">
            {prompt}
          </pre>
        </section>

        {/* 5. Paste, check, render */}
        <PasteChecker selectedFormat={format} />

        <details className="mt-6 rounded-2xl border border-[#2c2b28] p-5 text-[15px] text-[#b9b6ae]">
          <summary className="cursor-pointer font-semibold text-[#f4f3f0]">Render lewat terminal (opsional)</summary>
          <p className="mt-3">
            Simpan JSON jawaban AI sebagai <code className="font-mono text-[#f4f3f0]">reel.json</code> di folder proyek, lalu jalankan
            perintah ini. Hasilnya ada di <code className="font-mono text-[#f4f3f0]">renders/reel-saya/reel.mp4</code>.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <code className="flex-1 overflow-x-auto rounded-xl bg-[#0f0f0e] px-4 py-3 font-mono text-[13px]">{command}</code>
            <CopyButton text={command} label="Salin perintah" />
          </div>
        </details>
        <p className="mt-6 text-[14px] text-[#8a8780]">
          Lebih praktis? Di <Link href="/studio" className="text-white underline underline-offset-2">studio</Link>, naskah dibuat langsung dari
          ide yang sama tanpa salin-tempel.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
