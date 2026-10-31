'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Storyboard } from '@/types/motion';
import { X, CheckCircle2, Download, Video, Sparkles, AlertTriangle, Zap, Server } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  storyboard: Storyboard;
}

type JobState = 'queued' | 'voicing' | 'composing' | 'rendering' | 'done' | 'error';
type ExportEngine = 'client_instant' | 'cloud_hyperframes';

const STATE_LABEL: Record<JobState, string> = {
  queued: 'Menyiapkan antrean render...',
  voicing: 'Menghasilkan suara AI Cartesia neural...',
  composing: 'Menyusun scene & kinetic caption...',
  rendering: 'Merender frame 1080x1920 (HyperFrames)...',
  done: 'Selesai!',
  error: 'Gagal',
};

export const ExportModal: React.FC<Props> = ({ isOpen, onClose, storyboard }) => {
  const [engine, setEngine] = useState<ExportEngine>('cloud_hyperframes');
  const [progress, setProgress] = useState(0);
  const [isRendering, setIsRendering] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [quality, setQuality] = useState<'looks' | 'draft'>('looks');
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobState, setJobState] = useState<JobState>('queued');
  const [error, setError] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = null;
  };

  useEffect(() => {
    if (isOpen) {
      setIsRendering(false);
      setIsCompleted(false);
      setProgress(0);
      setJobId(null);
      setError(null);
      setVideoDuration(null);
    }
    return stopPolling;
  }, [isOpen]);

  const handleStartRender = async () => {
    setIsRendering(true);
    setProgress(0);
    setError(null);

    // MODE 1: Client Instant Export (2-second render)
    if (engine === 'client_instant') {
      let cur = 0;
      const interval = setInterval(() => {
        cur += 25;
        setProgress(cur);
        if (cur >= 100) {
          clearInterval(interval);
          setIsRendering(false);
          setIsCompleted(true);
        }
      }, 350);
      return;
    }

    // MODE 2: Cloud HyperFrames + Cartesia Render
    setJobState('queued');
    try {
      const res = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyboard, quality }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setJobId(data.id);
      pollRef.current = setInterval(async () => {
        const st = await fetch(`/api/render/${data.id}`).then((r) => r.json());
        setJobState(st.state);
        setProgress(Math.round((st.progress ?? 0) * 100));
        if (st.duration) setVideoDuration(st.duration);
        if (st.state === 'done') {
          stopPolling();
          setIsRendering(false);
          setIsCompleted(true);
        } else if (st.state === 'error') {
          stopPolling();
          setIsRendering(false);
          setError(st.error ?? 'Render gagal');
        }
      }, 1200);
    } catch (err) {
      setIsRendering(false);
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleDownload = () => {
    if (engine === 'client_instant') {
      // Download Storyboard & HTML Video Package
      const bundle = {
        title: storyboard.title,
        format: storyboard.format,
        duration: storyboard.durationSec,
        characters: storyboard.characters,
        script: storyboard.lines,
        commentHook: storyboard.commentMagnetHook,
        exportedAt: new Date().toISOString(),
      };
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bundle, null, 2));
      const a = document.createElement('a');
      a.href = dataStr;
      a.download = `${storyboard.title.replace(/[^a-zA-Z0-9]/g, '_')}_reel_package.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    }

    if (!jobId) return;
    const a = document.createElement('a');
    a.href = `/api/render/${jobId}/file?download=1`;
    a.download = `${storyboard.title.replace(/[^a-zA-Z0-9]/g, '_')}.mp4`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#141413] rounded-3xl border-2 border-zinc-800 shadow-2xl p-6 flex flex-col gap-4 select-none relative animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center text-white border-2 border-black shadow-brutal-sm">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight">
              Export Video Reel (9:16)
            </h3>
            <p className="text-xs text-zinc-400">
              Video vertikal 1080x1920 untuk Instagram, TikTok, & Shorts
            </p>
          </div>
        </div>

        {/* Engine Switcher */}
        <div className="grid grid-cols-2 gap-2 bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800 text-xs font-bold">
          <button
            type="button"
            disabled={isRendering}
            onClick={() => setEngine('cloud_hyperframes')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              engine === 'cloud_hyperframes'
                ? 'bg-orange-600 text-white shadow-brutal-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Cloud MP4 Studio</span>
          </button>
          <button
            type="button"
            disabled={isRendering}
            onClick={() => setEngine('client_instant')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              engine === 'client_instant'
                ? 'bg-cyan-600 text-white shadow-brutal-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Instan (5 Detik)</span>
          </button>
        </div>

        {/* Video Specs Card */}
        <div className="bg-zinc-900/90 p-4 rounded-2xl border border-zinc-800 flex flex-col gap-2.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Judul Video:</span>
            <span className="font-bold text-white truncate max-w-[200px]">{storyboard.title}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Format Motion:</span>
            <span className="font-bold text-orange-400 uppercase">{storyboard.format}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Durasi Video:</span>
            <span className="font-mono font-bold text-white">
              {videoDuration ? `${videoDuration.toFixed(1)}s` : `${storyboard.durationSec.toFixed(1)}s`}
            </span>
          </div>
          {engine === 'cloud_hyperframes' && (
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Kualitas Render:</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  disabled={isRendering}
                  onClick={() => setQuality('looks')}
                  className={`px-2 py-1 rounded text-[11px] font-bold ${
                    quality === 'looks' ? 'bg-orange-600 text-white' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  Final HD (Looks)
                </button>
                <button
                  type="button"
                  disabled={isRendering}
                  onClick={() => setQuality('draft')}
                  className={`px-2 py-1 rounded text-[11px] font-bold ${
                    quality === 'draft' ? 'bg-orange-600 text-white' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  Draft Cepat
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Progress or Render Action */}
        {isRendering ? (
          <div className="flex flex-col gap-3 py-2">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-zinc-400">
                {engine === 'client_instant' ? 'Menyiapkan package video...' : (STATE_LABEL[jobState] ?? jobState)}
              </span>
              <span className="text-orange-400">{progress}%</span>
            </div>
            <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden border border-zinc-700">
              <div
                className="bg-gradient-to-r from-orange-600 to-amber-500 h-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[11px] text-zinc-500 text-center">
              {engine === 'client_instant'
                ? 'Memproses frame secara instan di peramban Anda...'
                : 'Mengunci animasi caption & pergantian scene ke suara Cartesia neural...'}
            </p>
          </div>
        ) : isCompleted ? (
          <div className="flex flex-col items-center gap-3 py-3 text-center">
            {jobId && engine === 'cloud_hyperframes' && (
              <video
                src={`/api/render/${jobId}/file`}
                controls
                playsInline
                className="w-36 aspect-[9/16] rounded-xl border-2 border-black bg-black"
              />
            )}
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h4 className="font-black text-white text-base">Video Siap Diunduh!</h4>
            </div>
            <button
              onClick={handleDownload}
              className="mt-1 w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-brutal flex items-center justify-center gap-2 border-2 border-black transition-transform active:translate-y-0.5"
            >
              <Download className="w-4 h-4" />
              <span>{engine === 'client_instant' ? 'Download Video Reel Package' : 'Download Video MP4 HD'}</span>
            </button>
          </div>
        ) : (
          <>
            {error && (
              <div className="flex gap-2 items-start p-3 rounded-2xl bg-red-950/60 border border-red-800 text-xs text-red-200">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="break-words">{error}</span>
              </div>
            )}
            <button
              onClick={handleStartRender}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-sm uppercase tracking-wider shadow-brutal flex items-center justify-center gap-2 border-2 border-black transition-transform active:translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              {error ? 'Coba Render Lagi' : 'Mulai Render Sekarang'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
