'use client';

import React, { useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { 
  Play, 
  ArrowRight, 
  Building2, 
  Sparkles, 
  Box, 
  Activity, 
  Cpu, 
  Layers, 
  Check, 
  Copy,
  Target,
  Search,
  X,
  Maximize2,
  Film,
  Zap,
  MessageCircle
} from 'lucide-react';
import { REELS, GalleryCategory, ReelSample } from './reels';

interface CategoryItem {
  id: GalleryCategory;
  label: string;
  count: number;
  icon: React.ReactNode;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'all',
    label: 'Semua Gaya 3D',
    count: REELS.length,
    icon: <Layers className="w-4 h-4" />,
  },
  {
    id: 'arsitektur',
    label: 'Edukasi & Arsitektur',
    count: REELS.filter((r) => r.category === 'arsitektur').length,
    icon: <Building2 className="w-4 h-4" />,
  },
  {
    id: 'taktil',
    label: 'Karakter & Taktil',
    count: REELS.filter((r) => r.category === 'taktil').length,
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    id: 'geometris',
    label: 'Dunia Geometris',
    count: REELS.filter((r) => r.category === 'geometris').length,
    icon: <Box className="w-4 h-4" />,
  },
  {
    id: 'sains',
    label: 'Sains & Medis',
    count: REELS.filter((r) => r.category === 'sains').length,
    icon: <Activity className="w-4 h-4" />,
  },
  {
    id: 'komersial',
    label: 'Teknologi & Komersial',
    count: REELS.filter((r) => r.category === 'komersial').length,
    icon: <Cpu className="w-4 h-4" />,
  },
];

const SEARCH_SUGGESTIONS = [
  'Gadget', 'Fintech', 'Roblox', 'Properti', 'Anime', 'Minimalis', 'Medis', 'Vintage', 'Cyberpunk'
];

export const GallerySection: React.FC<{ activeTab?: GalleryCategory }> = ({ activeTab = 'all' }) => {
  const [currentTab, setCurrentTab] = useState<GalleryCategory>(activeTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideoFile, setActiveVideoFile] = useState<string | null>(null);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [modalReel, setModalReel] = useState<ReelSample | null>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  // Single active video playback in inline cards
  const handlePlayVideo = (file: string) => {
    setActiveVideoFile(file);
    videoRefs.current.forEach((videoEl, key) => {
      if (key !== file && !videoEl.paused) {
        videoEl.pause();
      }
    });
  };

  const handleCopyPrompt = async (text: string, file: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFile(file);
      setTimeout(() => setCopiedFile(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // Filtered items based on active tab and search query
  const items = useMemo(() => {
    return REELS.filter((r) => {
      const matchCategory = currentTab === 'all' || r.category === currentTab;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchCategory;
      const matchText = 
        r.title.toLowerCase().includes(q) ||
        r.kind.toLowerCase().includes(q) ||
        r.quote.toLowerCase().includes(q) ||
        r.suitableFor.toLowerCase().includes(q) ||
        r.tags.some(t => t.toLowerCase().includes(q));
      return matchCategory && matchText;
    });
  }, [currentTab, searchQuery]);

  return (
    <section id="hasil" className="mx-auto max-w-[1240px] scroll-mt-8 px-4 py-16 md:px-8 md:py-24 font-display">
      {/* Header */}
      <div className="mb-10 flex flex-wrap items-end justify-between gap-5 border-b border-line pb-8">
        <div className="flex max-w-[740px] flex-col gap-3">
          <div className="inline-flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-ping" />
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent font-bold">
              GALERI GAYA 3D SINEMATIK
            </p>
          </div>
          <h2 className="font-display text-[32px] sm:text-[44px] font-bold leading-[1.08] tracking-[-0.03em] text-paper">
            Hasil Video Nyata. Dirender Langsung Pakai Mesin 3D Ini.
          </h2>
          <p className="text-sm sm:text-base text-muted leading-relaxed">
            Digerakkan oleh Three.js, React Three Fiber, dan Remotion 4.0 di folder <code className="text-xs bg-tile px-2 py-0.5 rounded border border-line text-accent">audira-skill-motion/</code>. Bukan video animasi murahan, setiap frame memiliki pencahayaan fisik PBR, depth of field, dan simulasi gerak terarah 60 FPS.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="#jasa"
            className="inline-flex items-center gap-2 rounded-xl border border-edge bg-tile px-4 py-2.5 text-sm font-semibold text-fg-2 hover:bg-tile-2 hover:border-line-strong hover:text-paper transition-all"
          >
            <span>Pesan Jasa Terima Beres</span>
            <ArrowRight className="h-4 w-4 text-accent" />
          </a>
        </div>
      </div>

      {/* Interactive Search Bar & Filter Controls */}
      <div className="mb-8 rounded-2xl border border-line bg-card p-4 sm:p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dim" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari gaya... misal: Roblox, Gadget, Fintech, Properti, Medis, Minimalis"
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-line bg-tile text-xs sm:text-sm text-paper placeholder:text-dim focus:border-accent focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dim hover:text-paper"
                aria-label="Bersihkan pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Results Count Badge */}
          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
            <span className="font-mono text-xs text-dim">
              Menampilkan <strong className="text-accent font-bold">{items.length}</strong> Koleksi Gaya 3D
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setCurrentTab('all'); }}
                className="text-xs text-accent hover:underline font-semibold"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-mono text-dim mr-1">Rekomendasi Niche:</span>
          {SEARCH_SUGGESTIONS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSearchQuery(tag)}
              className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-all ${
                searchQuery.toLowerCase() === tag.toLowerCase()
                  ? 'border-accent bg-accent/20 text-accent font-bold'
                  : 'border-line bg-tile text-muted hover:border-line-strong hover:text-paper'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs (5 Industrial Pillars + All) */}
      <div className="mb-10 flex flex-wrap gap-2.5">
        {CATEGORIES.map((cat) => {
          const isSelected = currentTab === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setCurrentTab(cat.id);
                setActiveVideoFile(null);
              }}
              className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                isSelected
                  ? 'border-paper bg-paper text-ink shadow-lg shadow-black/40 scale-[1.02]'
                  : 'border-edge bg-card text-fg-2 hover:bg-tile-2 hover:border-line-strong'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
              <span
                className={`font-mono text-[11px] rounded-full px-2 py-0.5 ${
                  isSelected ? 'bg-black/20 text-ink' : 'bg-ink border border-line text-dim'
                }`}
              >
                {cat.count} gaya
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid of 3D Video Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((reel) => {
          const isPlaying = activeVideoFile === reel.file;
          const isCopied = copiedFile === reel.file;

          return (
            <div
              key={reel.file}
              className="flex flex-col justify-between rounded-2xl border border-line bg-card p-3.5 sm:p-4 shadow-card-warm transition-transform hover:-translate-y-1 hover:border-line-strong"
            >
              {/* Top Prompt Quote Snippet */}
              <div className="mb-2.5 min-h-[42px]">
                <p className="text-xs italic leading-relaxed text-muted/90 line-clamp-2">
                  &ldquo;{reel.quote}&rdquo;
                </p>
              </div>

              {/* Vertical 9:16 Video Container */}
              <div className="relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-ink border border-line-soft group">
                {isPlaying ? (
                  <video
                    ref={(el) => {
                      if (el) videoRefs.current.set(reel.file, el);
                      else videoRefs.current.delete(reel.file);
                    }}
                    src={`/3d-kits/${reel.file}.mp4`}
                    poster={`/3d-kits/${reel.file}.jpg`}
                    controls
                    autoPlay
                    playsInline
                    className="absolute inset-0 size-full object-cover"
                    onPlay={() => handlePlayVideo(reel.file)}
                  />
                ) : (
                  <>
                    <img
                      src={`/3d-kits/${reel.file}.jpg`}
                      alt={reel.title}
                      loading="lazy"
                      className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/3d-kits/buildforge.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/35" />

                    {/* Click-to-Play Overlay Button */}
                    <button
                      type="button"
                      onClick={() => handlePlayVideo(reel.file)}
                      aria-label={`Putar video preview 3D: ${reel.title}`}
                      className="absolute inset-0 flex items-center justify-center cursor-pointer group/btn"
                    >
                      <span className="inline-flex size-14 items-center justify-center rounded-full bg-accent text-ink shadow-xl shadow-orange-950/50 transition-all duration-200 group-hover/btn:scale-110 group-hover/btn:bg-orange-500">
                        <Play className="w-6 h-6 fill-ink translate-x-0.5" />
                      </span>
                    </button>
                  </>
                )}

                {/* Top Badge Pill */}
                <span className="pointer-events-none absolute top-3 left-3 z-10 rounded-md bg-ink/90 border border-line/80 px-2.5 py-0.5 font-mono text-[10px] font-bold text-fg-2 uppercase tracking-wide">
                  {reel.kind}
                </span>

                {/* Lightbox Trigger Button */}
                <button
                  type="button"
                  onClick={() => setModalReel(reel)}
                  title="Lihat Pratinjau Penuh"
                  className="absolute top-3 right-3 z-10 rounded-md bg-black/70 border border-line/80 p-1.5 text-muted hover:text-paper hover:bg-black/90 transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>

                {/* Bottom Engine Badge */}
                <span className="pointer-events-none absolute bottom-3 right-3 z-10 rounded bg-black/80 px-2 py-0.5 font-mono text-[9px] text-accent border border-accent/40 font-bold uppercase">
                  {reel.format.toUpperCase()}
                </span>
              </div>

              {/* Card Meta & 3 Tag Pills */}
              <div className="mt-3.5 flex flex-col flex-1 justify-between">
                {/* 3 Tag Pills */}
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {reel.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-[#2e2922] bg-[#201d18] px-2 py-0.5 font-mono text-[10px] sm:text-[11px] font-medium text-[#c5b8a5]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Card Title */}
                <h4 className="font-display text-[15px] sm:text-[16px] font-bold leading-tight text-paper line-clamp-1">
                  {reel.title}
                </h4>

                {/* Cocok Untuk Box */}
                <div className="mt-2.5 rounded-xl border border-line bg-tile/70 p-2.5 text-left">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-accent">
                    <Target className="w-3 h-3 text-accent shrink-0" />
                    <span>Cocok Untuk:</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-muted leading-relaxed mt-1">
                    {reel.suitableFor}
                  </p>
                </div>

                {/* Action Row: Link + Copy Prompt */}
                <div className="mt-3 flex items-center justify-between border-t border-line-soft pt-3">
                  <button
                    type="button"
                    onClick={() => setModalReel(reel)}
                    className="group/link inline-flex items-center gap-1 text-xs sm:text-[13px] font-semibold text-fg-2 hover:text-accent transition-colors"
                  >
                    <span>Detail &amp; Player</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyPrompt(reel.prompt, reel.file)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-muted hover:text-accent transition-colors"
                    title="Salin prompt 3D"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-dim hover:text-accent" />}
                    <span className="hidden sm:inline">{isCopied ? 'Tersalin' : 'Prompt'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="rounded-3xl border border-line bg-card p-12 text-center space-y-3">
          <p className="font-bold text-lg text-paper">Tidak ada gaya yang cocok dengan pencarian &quot;{searchQuery}&quot;</p>
          <p className="text-xs text-muted">Coba gunakan kata kunci umum seperti &quot;Roblox&quot;, &quot;Fintech&quot;, &quot;Arsitektur&quot;, atau klik reset filter.</p>
          <button
            type="button"
            onClick={() => { setSearchQuery(''); setCurrentTab('all'); }}
            className="btn-primary py-2 px-5 text-xs font-bold"
          >
            Tampilkan Semua Gaya 3D
          </button>
        </div>
      )}

      {/* Video Lightbox Modal */}
      {modalReel && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setModalReel(null)}
        >
          <div 
            className="relative w-full max-w-[820px] max-h-[92vh] overflow-y-auto rounded-3xl border-2 border-line-strong bg-card p-5 sm:p-7 shadow-2xl z-10 text-paper"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-line pb-4 mb-5">
              <div>
                <div className="inline-flex items-center gap-2 mb-1">
                  <span className="rounded bg-accent/20 border border-accent/40 px-2.5 py-0.5 font-mono text-[10px] font-bold text-accent uppercase">
                    {modalReel.kind}
                  </span>
                  <span className="text-xs font-mono text-dim">• {modalReel.engine}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-paper">
                  {modalReel.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setModalReel(null)}
                className="rounded-xl border border-line bg-tile p-2 text-muted hover:border-line-strong hover:text-paper transition-colors"
                aria-label="Tutup modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: 2 Columns on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
              
              {/* Video Player Column (5 cols) */}
              <div className="sm:col-span-5">
                <div className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden bg-ink border border-line shadow-2xl">
                  <video
                    src={`/3d-kits/${modalReel.file}.mp4`}
                    poster={`/3d-kits/${modalReel.file}.jpg`}
                    controls
                    autoPlay
                    playsInline
                    className="size-full object-cover"
                  />
                </div>
              </div>

              {/* Details & Actions Column (7 cols) */}
              <div className="sm:col-span-7 space-y-4">
                
                {/* Quote description */}
                <div className="rounded-2xl border border-line bg-tile p-4">
                  <span className="text-[10px] font-mono uppercase text-dim font-bold block mb-1">
                    DESKRIPSI VISUAL 3D:
                  </span>
                  <p className="text-xs sm:text-sm text-paper italic leading-relaxed">
                    &ldquo;{modalReel.quote}&rdquo;
                  </p>
                </div>

                {/* Cocok Untuk Box */}
                <div className="rounded-2xl border border-accent/30 bg-accent/10 p-4 space-y-1.5">
                  <span className="text-xs font-mono uppercase font-bold text-accent flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    COCOK UNTUK KEBUTUHAN:
                  </span>
                  <p className="text-xs text-paper leading-relaxed">
                    {modalReel.suitableFor}
                  </p>
                </div>

                {/* Prompt Example with Copy */}
                <div className="rounded-2xl border border-line bg-ink p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-dim uppercase">
                      Perintah Claude Code / Cursor:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyPrompt(modalReel.prompt, modalReel.file)}
                      className="inline-flex items-center gap-1 text-xs text-accent hover:underline font-bold"
                    >
                      {copiedFile === modalReel.file ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedFile === modalReel.file ? 'Tersalin' : 'Salin Perintah'}</span>
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap break-all leading-relaxed max-h-24 overflow-y-auto">
                    {modalReel.prompt}
                  </pre>
                </div>

                {/* Tag Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {modalReel.tags.map(t => (
                    <span key={t} className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-tile border border-line text-muted">
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Action CTA Buttons */}
                <div className="pt-3 border-t border-line flex flex-col sm:flex-row gap-2.5">
                  <a
                    href="#jasa"
                    onClick={() => setModalReel(null)}
                    className="flex-1 btn-primary py-3 px-4 text-xs font-bold text-center shadow-md"
                  >
                    <span>Pesan Jasa Terima Beres ➔</span>
                  </a>
                  <a
                    href="#produk"
                    onClick={() => setModalReel(null)}
                    className="btn-outline py-3 px-4 text-xs font-bold text-center"
                  >
                    <span>Beli Lisensi Paket 3D</span>
                  </a>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
};
