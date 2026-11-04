'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, FileEdit, Mic, Video, Sparkles, CheckCircle2 } from 'lucide-react';

const SCRIPT_PREVIEW = [
  { who: 'Ash', me: false, text: 'Audira, gue mau resign besok. Gue mau full-time streaming game!' },
  { who: 'Audira', me: true, text: 'Pertanyaan cepat: followers lo sekarang berapa?' },
  { who: 'Ash', me: false, text: 'Empat puluh orang. Tapi mereka loyal banget!' },
  { who: 'Audira', me: true, text: 'Tiga puluh sembilan itu akun bot. Satunya lagi nyokap lo.' },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="cara-kerja" className="mx-auto max-w-[1200px] scroll-mt-6 px-4 py-16 md:px-8 md:py-24">
      {/* Header */}
      <div className="mb-12 flex max-w-[680px] flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">Cara kerja</p>
        <h2 className="font-display text-[34px] sm:text-[46px] font-bold leading-[1.05] tracking-[-0.03em] text-paper">
          Dari satu ide sampai reel siap upload.
        </h2>
        <p className="text-[16px] text-muted leading-relaxed">
          Kamu ketik satu premis atau upload footage. AI kami menulis naskah, mengisi suara per karakter, dan merender video 1080×1920.
        </p>
      </div>

      {/* 3 Step Cards (Voynan Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Step 1 */}
        <div className="flex flex-col gap-4 rounded-3xl border border-line bg-card p-7 shadow-card-warm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm font-black text-accent">01</span>
            <FileEdit className="w-5 h-5 text-fg-3" />
          </div>
          <h3 className="font-display text-xl font-bold text-paper">
            Ketik Ide atau Prompt AI
          </h3>
          <p className="text-[14px] leading-relaxed text-muted">
            Tulis satu kalimat di web studio kami, atau gunakan prompt generator untuk Claude, ChatGPT, Gemini, dan Ollama lokal. Naskah berstruktur hook, eskalasi, dan punchline tersusun otomatis.
          </p>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col gap-4 rounded-3xl border border-line bg-card p-7 shadow-card-warm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm font-black text-accent">02</span>
            <Mic className="w-5 h-5 text-fg-3" />
          </div>
          <h3 className="font-display text-xl font-bold text-paper">
            Suarakan &amp; Kustomisasi
          </h3>
          <p className="text-[14px] leading-relaxed text-muted">
            1-klik Sync Suara Cartesia AI Bahasa Indonesia. Pilih gaya caption kinetik (Bounce Pop MrBeast, Karaoke Sweep Ali Abdaal), dan atur letak teks bebas tabrakan safe zone.
          </p>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col gap-4 rounded-3xl border border-line bg-card p-7 shadow-card-warm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm font-black text-accent">03</span>
            <Video className="w-5 h-5 text-fg-3" />
          </div>
          <h3 className="font-display text-xl font-bold text-paper">
            Render 1080p &amp; Upload
          </h3>
          <p className="text-[14px] leading-relaxed text-muted">
            Preview di browser secara interaktif, lalu ekspor video MP4 vertikal 1080×1920 60fps kualitas studio. Download instan, bebas watermark, siap viral di TikTok, Reels, dan Shorts.
          </p>
        </div>
      </div>

      {/* Live Interactive Script-to-Reel Demonstration */}
      <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_1.3fr_0.9fr] rounded-3xl border border-line bg-card p-6 sm:p-8">
        {/* Step 1 Visual */}
        <div className="flex flex-col justify-between gap-6 rounded-2xl border border-line bg-ink p-5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-accent font-bold">
            01 · Input Ide
          </span>
          <p className="text-[20px] sm:text-[24px] font-extrabold leading-snug tracking-tight text-paper">
            Ash mau resign jadi streamer padahal followers-nya baru 40
            <span className="ml-1 inline-block h-[1em] w-[2.5px] translate-y-1 bg-accent animate-pulse" />
          </p>
          <span className="font-mono text-[11px] text-dim">
            Mood · Nyolot &amp; Roasting
          </span>
        </div>

        {/* Step 2 Visual */}
        <div className="flex flex-col gap-3 rounded-2xl border border-line bg-ink p-5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-accent font-bold">
            02 · Naskah &amp; Voiceover Sync
          </span>
          <div className="flex flex-col gap-2.5 overflow-hidden">
            {SCRIPT_PREVIEW.map((m, i) => (
              <div
                key={i}
                className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-[13px] leading-snug ${
                  m.me
                    ? 'self-end bg-accent text-ink font-semibold'
                    : 'bg-card border border-line text-paper'
                }`}
              >
                <span className="mb-0.5 block font-mono text-[9px] uppercase tracking-wider opacity-70">
                  {m.who}
                </span>
                {m.text}
              </div>
            ))}
          </div>
          <p className="font-mono text-[10px] text-dim">
            + Hook penutup: &quot;Ketik di komentar: apakah 40 followers cukup buat resign?&quot;
          </p>
        </div>

        {/* Step 3 Visual */}
        <div className="flex flex-col gap-3 rounded-2xl border border-line bg-ink p-5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-accent font-bold">
            03 · Video Jadi
          </span>
          <div className="relative mx-auto w-full max-w-[210px] overflow-hidden rounded-xl border border-line bg-black aspect-[9/16] shadow-xl">
            <video
              src="/reels/banter-voice.mp4"
              poster="/reels/banter.jpg"
              controls
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
          </div>
          <p className="text-center font-mono text-[11px] text-dim">
            Putar dengan audio · 14 detik MP4
          </p>
        </div>
      </div>
    </section>
  );
};
