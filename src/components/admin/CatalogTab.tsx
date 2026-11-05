'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Layers, 
  Play, 
  Search, 
  Check, 
  Copy, 
  ExternalLink, 
  Target, 
  Terminal, 
  Sparkles,
  Building2,
  Activity,
  Cpu
} from 'lucide-react';
import { REELS, GalleryCategory, ReelSample } from '@/components/landing/reels';

export const CatalogTab: React.FC = () => {
  const [category, setCategory] = useState<GalleryCategory>('all');
  const [search, setSearch] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(id);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredReels = REELS.filter((r) => {
    const matchCat = category === 'all' || r.category === category;
    const q = search.toLowerCase();
    const matchSearch = 
      r.title.toLowerCase().includes(q) ||
      r.kind.toLowerCase().includes(q) ||
      r.quote.toLowerCase().includes(q) ||
      r.suitableFor.toLowerCase().includes(q) ||
      r.file.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-paper">Katalog &amp; Manajemen 29 Gaya 3D Remotion</h3>
          <p className="text-xs text-muted">
            Pantau status file MP4, thumbnail, prompt sutradara, dan target industri untuk seluruh 29 signature kits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/80 px-3 py-1.5 rounded-xl font-bold">
            29/29 Kits Aktif &amp; Terverifikasi
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-line bg-card">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all' as GalleryCategory, label: 'Semua (29)' },
            { id: 'arsitektur' as GalleryCategory, label: 'Arsitektur (8)' },
            { id: 'taktil' as GalleryCategory, label: 'Taktil & Karakter (7)' },
            { id: 'geometris' as GalleryCategory, label: 'Geometris (3)' },
            { id: 'sains' as GalleryCategory, label: 'Sains & Medis (4)' },
            { id: 'komersial' as GalleryCategory, label: 'Komersial & Tech (7)' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                category === cat.id
                  ? 'bg-accent text-ink shadow-sm'
                  : 'text-muted hover:text-paper hover:bg-tile'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dim" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kit, judul, industri..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-line bg-tile text-xs text-paper placeholder:text-dim focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      {/* Grid of 29 Kits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReels.map((reel) => {
          const isPlaying = activeVideo === reel.file;
          return (
            <div
              key={reel.file}
              className="rounded-2xl border border-line bg-card p-4 space-y-3 shadow-lg hover:border-line-strong transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between mb-2">
                  <span className="rounded bg-accent/20 border border-accent/40 px-2 py-0.5 font-mono text-[10px] font-bold text-accent uppercase">
                    {reel.kind}
                  </span>
                  <span className="text-[11px] font-mono text-dim">
                    ID: <code>{reel.file}</code>
                  </span>
                </div>

                {/* Media Preview (9:16 Aspect Box) */}
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-ink border border-line mb-3 group">
                  {isPlaying ? (
                    <video
                      src={`/3d-kits/${reel.file}.mp4`}
                      controls
                      autoPlay
                      className="size-full object-cover"
                    />
                  ) : (
                    <>
                      <img
                        src={`/3d-kits/${reel.file}.jpg`}
                        alt={reel.title}
                        className="size-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/3d-kits/buildforge.jpg';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setActiveVideo(reel.file)}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors"
                      >
                        <span className="size-10 rounded-full bg-accent text-ink flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-ink translate-x-0.5" />
                        </span>
                      </button>
                    </>
                  )}
                </div>

                <h4 className="font-bold text-sm text-paper">{reel.title}</h4>
                <p className="text-xs text-muted italic line-clamp-2 mt-1">
                  &ldquo;{reel.quote}&rdquo;
                </p>

                {/* Cocok Untuk Box */}
                <div className="mt-2.5 p-2 rounded-lg bg-tile border border-line text-[11px] text-muted">
                  <span className="font-mono text-[10px] font-bold text-accent uppercase block mb-0.5">
                    Cocok Untuk:
                  </span>
                  <p className="line-clamp-2">{reel.suitableFor}</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-line flex items-center justify-between text-xs font-mono">
                <button
                  type="button"
                  onClick={() => handleCopy(reel.prompt, reel.file)}
                  className="inline-flex items-center gap-1 text-dim hover:text-accent transition-colors"
                >
                  {copiedKey === reel.file ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === reel.file ? 'Tersalin' : 'Salin Prompt'}</span>
                </button>

                <a
                  href={`/3d-kits/${reel.file}.mp4`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dim hover:text-paper inline-flex items-center gap-1"
                >
                  <span>Lihat MP4</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

