'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  FileCode2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Trash2,
  Video,
  Wrench,
  XCircle,
} from 'lucide-react';
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

export interface PasteCheckerProps {
  selectedFormat: MotionFormat;
  externalRaw?: string;
  onRawChange?: (raw: string) => void;
}

export const PasteChecker: React.FC<PasteCheckerProps> = ({ selectedFormat, externalRaw, onRawChange }) => {
  const router = useRouter();
  const [raw, setRaw] = useState(externalRaw || '');
  const [result, setResult] = useState<CheckResult | null>(null);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [prettifyNotice, setPrettifyNotice] = useState<string | null>(null);
  const last = useRef<number | null>(null);

  const sb = result?.storyboard ?? null;

  // Sync when external raw changes (e.g. from Instant Test button)
  useEffect(() => {
    if (externalRaw !== undefined && externalRaw !== raw) {
      setRaw(externalRaw);
      if (externalRaw.trim()) {
        const checked = checkStoryboard(externalRaw, selectedFormat);
        setResult(checked);
        setTime(0);
        setPlaying(true);
      }
    }
  }, [externalRaw, selectedFormat]);

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

  const handleTextChange = (val: string) => {
    setRaw(val);
    onRawChange?.(val);
  };

  const check = () => {
    setResult(checkStoryboard(raw, selectedFormat));
    setTime(0);
    setPlaying(true);
  };

  const handlePrettify = () => {
    try {
      const cleaned = raw.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
      const parsed = JSON.parse(cleaned);
      const formatted = JSON.stringify(parsed, null, 2);
      setRaw(formatted);
      onRawChange?.(formatted);
      setPrettifyNotice('JSON berhasil dirapikan!');
      setTimeout(() => setPrettifyNotice(null), 2000);
    } catch {
      setPrettifyNotice('Format JSON belum valid untuk dirapikan.');
      setTimeout(() => setPrettifyNotice(null), 2500);
    }
  };

  const handleClear = () => {
    setRaw('');
    setResult(null);
    onRawChange?.('');
  };

  const handleOpenInStudio = () => {
    if (!sb) return;
    try {
      sessionStorage.setItem('audira_imported_storyboard', JSON.stringify(sb));
      router.push(`/studio?import=latest&format=${sb.format}`);
    } catch (e) {
      console.error('Failed to save to sessionStorage:', e);
      router.push(`/studio?format=${sb.format}`);
    }
  };

  return (
    <section id="paste-checker-section" className="mt-12 rounded-3xl border-2 border-[#2c2b28] bg-[#1c1c1a] p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2c2b28]">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Verifikasi & Player 9:16
            </span>
            <span className="text-xs text-[#8a8780]">• Live Engine Validator</span>
          </div>
          <h2 className="mt-2 text-[24px] font-extrabold tracking-[-0.02em] text-[#f4f3f0]">
            5. Tempel & Uji Jawaban AI di Sini
          </h2>
          <p className="mt-1 max-w-[680px] text-[14px] leading-relaxed text-[#b9b6ae]">
            Tempel seluruh balasan AI apa adanya (termasuk markdown <code className="font-mono text-xs text-[#ea580c]">```json</code>). Mesin akan mengekstrak JSON, memperbaiki durasi otomatis, dan langsung memutar video vertikal 9:16 di layar samping.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            type="button"
            onClick={handlePrettify}
            disabled={!raw.trim()}
            title="Rapikan indentasi JSON"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#2c2b28] bg-[#141413] px-3.5 py-2 text-xs font-semibold text-[#d6d3cc] transition-colors hover:border-[#4a4843] hover:text-white disabled:opacity-40"
          >
            <FileCode2 className="h-3.5 w-3.5" /> Rapikan JSON
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={!raw.trim()}
            title="Hapus semua teks"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#2c2b28] bg-[#141413] px-3.5 py-2 text-xs font-semibold text-red-400/80 transition-colors hover:border-red-800 hover:text-red-300 disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" /> Bersihkan
          </button>
        </div>
      </div>

      {prettifyNotice && (
        <div className="mt-3 inline-block rounded-xl bg-orange-600/20 border border-orange-500/40 px-3 py-1.5 text-xs font-medium text-orange-300">
          {prettifyNotice}
        </div>
      )}

      <textarea
        value={raw}
        onChange={(e) => handleTextChange(e.target.value)}
        rows={9}
        spellCheck={false}
        aria-label="Jawaban AI"
        placeholder='Tempel balasan Claude / ChatGPT / Gemini / DeepSeek di sini... Contoh:
{
  "id": "reel-1",
  "title": "Ash Ingin Resign Jadi Streamer",
  "format": "character_banter",
  "lines": [ ... ]
}'
        className="mt-4 w-full rounded-2xl border-2 border-[#2c2b28] bg-[#0f0f0e] p-4 font-mono text-[13px] leading-relaxed text-[#d6d3cc] placeholder:text-[#5f5c56] focus:border-[#ea580c] focus:outline-none transition-colors"
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={check}
            disabled={!raw.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#ea580c] px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#f06a1f] active:scale-95 disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" /> Periksa & Putar
          </button>
          {result && (
            <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${
              sb 
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' 
                : 'bg-red-950/60 border-red-800 text-red-300'
            }`}>
              {sb
                ? `✓ Siap dirender: ${sb.lines.length} baris dialog, format ${sb.format}, total ${sb.durationSec.toFixed(1)}s.`
                : '⚠ Belum bisa dirender. Periksa koreksi di bawah lalu klik tombol Periksa lagi.'}
            </span>
          )}
        </div>

        {sb && (
          <button
            type="button"
            onClick={handleOpenInStudio}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-brutal border-2 border-black transition-transform active:translate-y-0.5"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Buka & Edit di Studio
          </button>
        )}
      </div>

      {result && (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-4">
            <List items={result.errors} tone="error" />
            <List items={result.warnings} tone="warn" />
            <List items={result.fixes} tone="fix" />
            {sb && !result.warnings.length && !result.fixes.length && (
              <div className="rounded-2xl border border-emerald-800 bg-emerald-950/40 p-4 text-[14px] text-emerald-200">
                <p className="font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  JSON 100% Valid & Presisi
                </p>
                <p className="mt-1 text-xs text-emerald-300/80">
                  Semua timing dialog, ID karakter, avatar, visual theme, dan komentar magnetik siap diproses ke frame video.
                </p>
              </div>
            )}

            {sb && (
              <div className="rounded-2xl border border-[#2c2b28] bg-[#141413] p-5">
                <h4 className="text-xs font-black uppercase tracking-wider text-orange-400 mb-3">
                  Metadata Storyboard Terdeteksi
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#1c1c1a] p-2.5 rounded-xl border border-[#2c2b28]">
                    <span className="text-[#8a8780] block text-[11px]">Format:</span>
                    <span className="font-mono font-bold text-white uppercase">{sb.format}</span>
                  </div>
                  <div className="bg-[#1c1c1a] p-2.5 rounded-xl border border-[#2c2b28]">
                    <span className="text-[#8a8780] block text-[11px]">Durasi:</span>
                    <span className="font-mono font-bold text-white">{sb.durationSec.toFixed(1)} Detik</span>
                  </div>
                  <div className="bg-[#1c1c1a] p-2.5 rounded-xl border border-[#2c2b28]">
                    <span className="text-[#8a8780] block text-[11px]">Karakter:</span>
                    <span className="font-bold text-white truncate block">
                      {sb.characters.characterA.name} & {sb.characters.characterB.name}
                    </span>
                  </div>
                  <div className="bg-[#1c1c1a] p-2.5 rounded-xl border border-[#2c2b28]">
                    <span className="text-[#8a8780] block text-[11px]">Hook Akhir:</span>
                    <span className="font-medium text-[#d6d3cc] line-clamp-1 block" title={sb.commentMagnetHook}>
                      {sb.commentMagnetHook || '-'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {sb && (
            <div className="flex flex-col gap-3">
              <div className="relative mx-auto aspect-[9/16] w-full max-w-[320px] overflow-hidden rounded-2xl border-2 border-zinc-700 bg-black shadow-2xl">
                <EnginePreview storyboard={sb} currentTime={time} />
              </div>
              <div className="flex items-center justify-between gap-3 bg-[#141413] p-2.5 rounded-xl border border-[#2c2b28]">
                <button
                  type="button"
                  onClick={() => setPlaying((p) => !p)}
                  aria-label={playing ? 'Jeda preview' : 'Putar preview'}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2c2b28] bg-[#1c1c1a] hover:border-[#4a4843] transition-colors"
                >
                  {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setTime(0)}
                  title="Ulangi dari awal"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2c2b28] bg-[#1c1c1a] hover:border-[#4a4843] transition-colors text-zinc-400 hover:text-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <span className="font-mono text-[11px] text-[#8a8780]">
                  {time.toFixed(1)}s / {sb.durationSec.toFixed(1)}s
                </span>
              </div>
              {loggedIn ? (
                <button
                  type="button"
                  onClick={() => setExportOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#f4f3f0] px-5 py-3 text-sm font-bold text-[#141413] hover:bg-white transition-all shadow-md active:scale-98"
                >
                  <Video className="h-4 w-4" /> Render MP4 Lengkap
                </button>
              ) : (
                <Link
                  href="/login?next=/prompts"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#2c2b28] bg-[#141413] px-5 py-2.5 text-xs font-semibold text-zinc-300 hover:border-[#4a4843] hover:text-white transition-colors"
                >
                  Masuk dulu untuk render MP4 Full HD
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
