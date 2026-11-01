'use client';

import React, { useState, useEffect } from 'react';
import { X, Video, Download, RefreshCw, Sparkles, CheckCircle2, AlertCircle, Copy, Check, Clock, Play } from 'lucide-react';

interface RenderJob {
  id: string;
  title: string;
  format: string;
  state: string;
  createdAt: string;
  hasFile: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const RenderHistoryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [renders, setRenders] = useState<RenderJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activePreviewId, setActivePreviewId] = useState<string | null>(null);

  const fetchRenders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/render');
      const data = await res.json();
      if (res.ok && Array.isArray(data.renders)) {
        setRenders(data.renders);
      }
    } catch (err) {
      console.error('Failed to fetch render history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRenders();
    }
  }, [isOpen]);

  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/api/render/${id}/file`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#121215] border-2 border-zinc-800 rounded-3xl shadow-brutal flex flex-col max-h-[85vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span>Vault Riwayat Render MP4</span>
                <span className="px-2 py-0.5 rounded-full bg-orange-600/20 text-orange-400 text-[10px] font-mono border border-orange-500/30">
                  {renders.length} Video
                </span>
              </h2>
              <p className="text-[11px] text-zinc-400">
                Arsip hasil render video motion berkualitas 1080x1920 siap tayang
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={fetchRenders}
              disabled={isLoading}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors border border-zinc-700"
              title="Segarkan daftar"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-orange-400' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors border border-zinc-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: List of Rendered Videos */}
        <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-3">
          {isLoading && renders.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-zinc-500 text-xs">
              <RefreshCw className="w-6 h-6 animate-spin text-orange-500 mb-2" />
              <span>Memuat daftar riwayat ekspor...</span>
            </div>
          ) : renders.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-950/40">
              <Video className="w-8 h-8 text-zinc-600 mb-2" />
              <span className="text-xs font-bold text-zinc-300">Belum Ada Video yang Dirender</span>
              <p className="text-[11px] text-zinc-500 max-w-xs mt-1">
                Klik tombol "Export MP4" di pojok kanan atas studio untuk mulai merender video motion pertama Anda.
              </p>
            </div>
          ) : (
            renders.map((job) => {
              const isReady = job.hasFile && (job.state === 'done' || job.state === 'finished' || job.state === 'unknown');
              const isPlaying = activePreviewId === job.id;

              return (
                <div
                  key={job.id}
                  className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col gap-2.5 transition-all hover:border-zinc-700"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-white truncate max-w-[320px]">
                          {job.title || job.id}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                          {job.format}
                        </span>
                        {isReady ? (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            MP4 Ready
                          </span>
                        ) : job.state === 'error' ? (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-950/80 text-red-300 border border-red-800 flex items-center gap-1">
                            <AlertCircle className="w-2.5 h-2.5" />
                            Gagal
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-orange-950/80 text-orange-300 border border-orange-800 flex items-center gap-1 animate-pulse">
                            <Clock className="w-2.5 h-2.5" />
                            {job.state}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                        <span>ID: {job.id}</span>
                        <span>•</span>
                        <span>{new Date(job.createdAt).toLocaleString('id-ID')}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {isReady && (
                        <>
                          <button
                            type="button"
                            onClick={() => setActivePreviewId(isPlaying ? null : job.id)}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1 ${
                              isPlaying
                                ? 'bg-orange-600 text-white border-orange-500'
                                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                            }`}
                            title={isPlaying ? 'Tutup Preview' : 'Putar Video'}
                          >
                            <Play className="w-3 h-3" />
                            <span>{isPlaying ? 'Tutup' : 'Putar'}</span>
                          </button>

                          <a
                            href={`/api/render/${job.id}/file`}
                            download={`${job.title || job.id}.mp4`}
                            className="px-2.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-black border border-orange-400 shadow-sm flex items-center gap-1 transition-colors"
                            title="Unduh file MP4 ke komputer"
                          >
                            <Download className="w-3 h-3" />
                            <span>Unduh</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => handleCopyLink(job.id)}
                            className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700 transition-colors"
                            title="Salin tautan video publik"
                          >
                            {copiedId === job.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Inline Video Player Preview */}
                  {isPlaying && isReady && (
                    <div className="mt-2 rounded-2xl overflow-hidden border-2 border-orange-500/80 bg-black flex justify-center animate-in zoom-in-95 duration-150">
                      <video
                        src={`/api/render/${job.id}/file`}
                        controls
                        autoPlay
                        className="max-h-[360px] w-auto aspect-[9/16] object-contain"
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

