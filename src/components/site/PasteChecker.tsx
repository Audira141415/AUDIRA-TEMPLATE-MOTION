'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, CheckCircle2, Pause, Play, Video, Wrench, XCircle } from 'lucide-react';
import { MotionFormat } from '@/types/motion';
import { checkStoryboard, CheckResult } from '@/lib/storyboard-check';
import { EnginePreview } from '@/components/video-engine/EnginePreview';
import { ExportModal } from '@/components/studio/ExportModal';

const List: React.FC<{ items: string[]; tone: 'error' | 'warn' | 'fix' }> = ({ items, tone }) => {
  if (!items.length) return null;
  const style = {
    error: { box: 'border-red-900 bg-red-950/50 text-red-200', icon: <XCircle className="h-4 w-4 shrink-0" />, title: 'Harus diperbaiki' },
    warn: { box: 'border-amber-900 bg-amber-950/40 text-amber-200', icon: <AlertTriangle className="h-4 w-4 shrink-0" />, title: 'Perlu dicek' },
    fix: { box: 'border-[#2c2b28] bg-[#141413] text-[#b9b6ae]', icon: <Wrench className="h-4 w-4 shrink-0" />, title: 'Diperbaiki otomatis' },
  }[tone];
  return (
    <div className={`rounded-2xl border p-4 ${style.box}`}>
      <p className="mb-2 flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.08em]">
        {style.icon} {style.title} ({items.length})
      </p>
      <ul className="list-disc space-y-1 pl-5 text-[14px] leading-relaxed">
        {items.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
};

export const PasteChecker: React.FC<{ selectedFormat: MotionFormat }> = ({ selectedFormat }) => {
  const [raw, setRaw] = useState('');
  const [result, setResult] = useState<CheckResult | null>(null);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const last = useRef<number | null>(null);

  const sb = result?.storyboard ?? null;

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setLoggedIn(!!d.user))
      .catch(() => setLoggedIn(false));
  }, []);

  useEffect(() => {
    if (!sb || !playing) {
      last.current = null;
      return;
    }
    let raf = 0;
    const step = (ts: number) => {
      const dt = last.current === null ? 0 : (ts - last.current) / 1000;
      last.current = ts;
      setTime((t) => (t + dt >= sb.durationSec ? 0 : t + dt));
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [sb, playing]);

  const check = () => {
    setResult(checkStoryboard(raw, selectedFormat));
    setTime(0);
    setPlaying(true);
  };

  return (
    <section className="mt-10 rounded-3xl border border-[#2c2b28] bg-[#1c1c1a] p-6">
      <h2 className="text-[22px] font-extrabold tracking-[-0.02em]">5. Tempel jawaban AI di sini</h2>
      <p className="mt-2 max-w-[640px] text-[15px] text-[#b9b6ae]">
        Tempel seluruh balasan AI apa adanya, termasuk teks pembuka atau blok kode. Pemeriksa mengambil JSON-nya, memperbaiki yang
        bisa diperbaiki, dan memberi tahu apa yang perlu kamu cek sebelum render.
      </p>
      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        rows={8}
        spellCheck={false}
        aria-label="Jawaban AI"
        placeholder='{ "title": "…", "format": "…", "lines": [ … ] }'
        className="mt-4 w-full rounded-2xl border border-[#2c2b28] bg-[#0f0f0e] p-4 font-mono text-[13px] leading-relaxed text-[#d6d3cc] placeholder:text-[#6f6c66] focus:border-[#ea580c] focus:outline-none"
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={check}
          disabled={!raw.trim()}
          className="inline-flex items-center gap-2 rounded-xl bg-[#ea580c] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#f06a1f] disabled:opacity-50"
        >
          <CheckCircle2 className="h-4 w-4" /> Periksa
        </button>
        {result && (
          <span className={`text-sm font-semibold ${sb ? 'text-emerald-300' : 'text-red-300'}`}>
            {sb
              ? `Siap dirender: ${sb.lines.length} baris, format ${sb.format}.`
              : 'Belum bisa dirender. Perbaiki error di bawah, lalu periksa lagi.'}
          </span>
        )}
      </div>

      {result && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="flex flex-col gap-3">
            <List items={result.errors} tone="error" />
            <List items={result.warnings} tone="warn" />
            <List items={result.fixes} tone="fix" />
            {sb && !result.warnings.length && !result.fixes.length && (
              <p className="rounded-2xl border border-emerald-900 bg-emerald-950/40 p-4 text-[14px] text-emerald-200">
                JSON rapi, tidak ada yang perlu diubah.
              </p>
            )}
          </div>

          {sb && (
            <div className="flex flex-col gap-3">
              <div className="relative mx-auto aspect-[9/16] w-full max-w-[300px] overflow-hidden rounded-2xl border border-[#2c2b28] bg-black">
                <EnginePreview storyboard={sb} currentTime={time} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setPlaying((p) => !p)}
                  aria-label={playing ? 'Jeda preview' : 'Putar preview'}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2c2b28] hover:border-[#4a4843]"
                >
                  {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <span className="font-mono text-[12px] text-[#8a8780]">
                  {time.toFixed(1)}s / {sb.durationSec.toFixed(1)}s · tanpa suara
                </span>
              </div>
              {loggedIn ? (
                <button
                  type="button"
                  onClick={() => setExportOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#f4f3f0] px-5 py-3 text-sm font-bold text-[#141413] hover:bg-white"
                >
                  <Video className="h-4 w-4" /> Render MP4 dengan suara
                </button>
              ) : (
                <Link
                  href="/login?next=/prompts"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#2c2b28] px-5 py-3 text-sm font-semibold hover:border-[#4a4843]"
                >
                  Masuk dulu untuk render MP4
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {sb && <ExportModal isOpen={exportOpen} onClose={() => setExportOpen(false)} storyboard={sb} />}
    </section>
  );
};
