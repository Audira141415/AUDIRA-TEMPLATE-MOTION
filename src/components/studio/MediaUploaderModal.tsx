'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, UploadCloud, Image as ImageIcon, Trash2, CheckCircle2, 
  Sparkles, Layers, AlertCircle, RefreshCw, Eye, ArrowRight 
} from 'lucide-react';
import { VisualLayoutConfig } from '@/types/motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  visualLayout?: VisualLayoutConfig;
  onUpdateVisualLayout: (layout: VisualLayoutConfig) => void;
}

interface UploadedItem {
  filename: string;
  url: string;
  size: number;
  createdAt: string;
}

const STOCK_PRESETS = [
  {
    label: 'BUKTI CHAT WA',
    url: '/reels/chat_story.jpg',
    desc: 'Tangkapan layar percakapan forensik',
  },
  {
    label: 'GRAFIK ANALITIK',
    url: '/reels/clean_explainer.jpg',
    desc: 'Diagram statistik & metrik viral',
  },
  {
    label: 'CCTV FORENSIK',
    url: '/reels/breaking_news.jpg',
    desc: 'Laporan kamera lokasi live',
  },
  {
    label: 'ARSIP HISTORIS',
    url: '/reels/docu_story.jpg',
    desc: 'Dokumen retro dekalsifikasi',
  },
];

export const MediaUploaderModal: React.FC<Props> = ({
  isOpen,
  onClose,
  visualLayout,
  onUpdateVisualLayout,
}) => {
  const [uploads, setUploads] = useState<UploadedItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [customLabel, setCustomLabel] = useState<string>(visualLayout?.customMediaLabel || 'BUKTI A1');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchUploads = async () => {
    try {
      const res = await fetch('/api/upload');
      if (res.ok) {
        const data = await res.json();
        if (data.uploads) setUploads(data.uploads);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUploads();
      setCustomLabel(visualLayout?.customMediaLabel || 'BUKTI A1');
      setErrorNotice(null);
    }
  }, [isOpen, visualLayout]);

  const handleUploadFile = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setErrorNotice('Ukuran file maksimal 10MB.');
      return;
    }

    setIsUploading(true);
    setErrorNotice(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('label', customLabel || file.name);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        onUpdateVisualLayout({
          ...(visualLayout || {}),
          customMediaUrl: data.url,
          customMediaLabel: customLabel || file.name,
        });
        fetchUploads();
      } else {
        setErrorNotice(data.error || 'Gagal mengunggah file.');
      }
    } catch (err) {
      setErrorNotice('Terjadi kesalahan jaringan saat upload: ' + String(err));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleDeleteFile = async (filename: string) => {
    try {
      const res = await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename }),
      });
      if (res.ok) {
        setUploads((prev) => prev.filter((u) => u.filename !== filename));
        if (visualLayout?.customMediaUrl?.includes(filename)) {
          onUpdateVisualLayout({
            ...(visualLayout || {}),
            customMediaUrl: undefined,
            customMediaLabel: undefined,
          });
        }
      }
    } catch {
      // ignore
    }
  };

  const handleSelectMedia = (url: string, label: string) => {
    onUpdateVisualLayout({
      ...(visualLayout || {}),
      customMediaUrl: url,
      customMediaLabel: label,
    });
  };

  const handleRemoveActiveMedia = () => {
    onUpdateVisualLayout({
      ...(visualLayout || {}),
      customMediaUrl: undefined,
      customMediaLabel: undefined,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#141413] rounded-3xl border-2 border-zinc-800 shadow-2xl p-6 flex flex-col gap-5 select-none relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                <span>Manajemen Media & Bukti Visual (B-Roll)</span>
              </h3>
              <p className="text-xs text-zinc-400">
                Upload screenshot chat, foto produk, logo, atau grafik untuk ditampilkan di canvas
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ACTIVE MEDIA PREVIEW BAR */}
        {visualLayout?.customMediaUrl && (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-cyan-950/40 border border-cyan-800/80">
            <div className="flex items-center gap-3 truncate">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-black border border-cyan-700/60 shrink-0">
                <img
                  src={visualLayout.customMediaUrl}
                  alt="Active"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Media Aktif di Video</span>
                </div>
                <div className="text-[11px] font-mono text-cyan-300 truncate">
                  Label: [{visualLayout.customMediaLabel || 'BUKTI A1'}]
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemoveActiveMedia}
              className="px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-bold transition-colors shrink-0 ml-3"
            >
              Lepas dari Video
            </button>
          </div>
        )}

        {/* UPLOAD FORM & DRAG-AND-DROP ZONE */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              placeholder="Label Dokumen (contoh: BUKTI CHAT A1, HASIL RISET)"
              className="w-full sm:flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white font-bold focus:outline-none focus:border-cyan-500"
            />
            <span className="text-[10px] font-mono text-zinc-500">Maksimal 10MB (PNG, JPG, WebP)</span>
          </div>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-cyan-400 bg-cyan-950/30'
                : 'border-zinc-700 hover:border-cyan-500 bg-zinc-900/50 hover:bg-zinc-900'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              onChange={(e) => e.target.files?.[0] && handleUploadFile(e.target.files[0])}
              className="hidden"
            />

            {isUploading ? (
              <>
                <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                <p className="text-xs font-bold text-white">Sedang mengunggah dan memproses file...</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-cyan-400 border border-zinc-700">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-black text-white">
                    Tarik & Lepas gambar bukti ke sini, atau <span className="text-cyan-400 underline">Klik untuk Telusuri</span>
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Mendukung format PNG, JPG, WebP, GIF, dan SVG
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {errorNotice && (
          <div className="p-3 rounded-2xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorNotice}</span>
          </div>
        )}

        {/* QUICK STOCK PRESET EVIDENCE */}
        <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800">
          <label className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Preset Media Cepat (Stock B-Roll)</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {STOCK_PRESETS.map((p) => {
              const isCurrent = visualLayout?.customMediaUrl === p.url;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handleSelectMedia(p.url, p.label)}
                  className={`p-2.5 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                    isCurrent
                      ? 'bg-cyan-950/50 border-cyan-400 text-white ring-2 ring-cyan-500/40'
                      : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                  }`}
                >
                  <span className="font-mono font-bold text-[10px] text-cyan-400 truncate">
                    {p.label}
                  </span>
                  <span className="text-[10px] text-zinc-400 leading-tight line-clamp-1">
                    {p.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RECENT UPLOADS GALLERY */}
        <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Galeri File Yang Pernah Diunggah</span>
              <span className="text-[10px] font-mono text-zinc-500">({uploads.length} File)</span>
            </label>
            <button
              type="button"
              onClick={fetchUploads}
              className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-1 font-mono"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Segarkan</span>
            </button>
          </div>

          {uploads.length === 0 ? (
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center text-xs text-zinc-500 font-mono">
              Belum ada file yang diunggah. Unggah gambar bukti di atas untuk memulai!
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
              {uploads.map((item) => {
                const isSelected = visualLayout?.customMediaUrl === item.url;
                return (
                  <div
                    key={item.filename}
                    className={`p-2 rounded-2xl border transition-all flex flex-col gap-1.5 relative group ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 ring-2 ring-cyan-500/30'
                        : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="w-full aspect-video rounded-xl overflow-hidden bg-black relative">
                      <img
                        src={item.url}
                        alt={item.filename}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteFile(item.filename)}
                        className="absolute top-1 right-1 p-1 rounded-lg bg-black/75 hover:bg-red-600 text-zinc-300 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                        title="Hapus file"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-1 text-[10px]">
                      <span className="font-mono text-zinc-400 truncate max-w-[100px]">
                        {(item.size / 1024).toFixed(0)} KB
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSelectMedia(item.url, customLabel || 'BUKTI A1')}
                        className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase transition-colors ${
                          isSelected
                            ? 'bg-cyan-500 text-black font-black'
                            : 'bg-zinc-800 hover:bg-cyan-600 hover:text-white text-zinc-300'
                        }`}
                      >
                        {isSelected ? 'Aktif ✓' : 'Pakai'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-zinc-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-wider shadow-brutal transition-all"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
