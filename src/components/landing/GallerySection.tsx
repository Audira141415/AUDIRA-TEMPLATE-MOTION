'use client';

import React, { useState, useRef } from 'react';
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
  Copy 
} from 'lucide-react';
import { REELS, GalleryCategory } from './reels';

interface CategoryItem {
  id: GalleryCategory;
  label: string;
  count: number;
  icon: React.ReactNode;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'all',
    label: 'Semua 29 Gaya',
    count: 29,
    icon: <Layers className="w-4 h-4" />,
  },
  {
    id: 'arsitektur',
    label: 'Edukasi & Arsitektur',
    count: 8,
    icon: <Building2 className="w-4 h-4" />,
  },
  {
    id: 'taktil',
    label: 'Karakter & Taktil',
    count: 7,
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    id: 'geometris',
    label: 'Dunia Geometris',
    count: 3,
    icon: <Box className="w-4 h-4" />,
  },
  {
    id: 'sains',
    label: 'Sains & Medis',
    count: 4,
    icon: <Activity className="w-4 h-4" />,
  },
  {
    id: 'komersial',
    label: 'Teknologi & Komersial',
    count: 7,
    icon: <Cpu className="w-4 h-4" />,
  },
];

export const GallerySection: React.FC<{ activeTab?: GalleryCategory }> = ({ activeTab = 'all' }) => {
  const [currentTab, setCurrentTab] = useState<GalleryCategory>(activeTab);
  const [activeVideoFile, setActiveVideoFile] = useState<string | null>(null);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  // Single active video playback
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

  const items = currentTab === 'all' 
    ? REELS 
    : REELS.filter((r) => r.category === currentTab);

  return (
    <section id="hasil" className="mx-auto max-w-[1240px] scroll-mt-8 px-4 py-16 md:px-8 md:py-24">
      {/* Header */}
      <div className="mb-10 flex flex-wrap items-end justify-between gap-5 border-b border-line pb-8">
        <div className="flex max-w-[740px] flex-col gap-3">
          <div className="inline-flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-ping" />
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent font-bold">
              GALERI 29 GAYA 3D SINEMATIK
            </p>
          </div>
          <h2 className="font-display text-[32px] sm:text-[44px] font-bold leading-[1.08] tracking-[-0.03em] text-paper">
            Hasil Video Nyata. Dirender Langsung Pakai Mesin 3D Ini.
          </h2>
          <p className="text-sm sm:text-base text-muted leading-relaxed">
            Digerakkan oleh Three.js, React Three Fiber, dan Remotion 4.0 di folder <code className="text-xs bg-tile px-2 py-0.5 rounded border border-line text-accent">audira-skill-motion/</code>. Bukan AI halusinasi murahan, setiap frame memiliki pencahayaan fisik PBR, depth of field, dan simulasi gerak terarah 60 FPS.
          </p>
        </div>

        <Link
          href="/prompts"
          className="inline-flex items-center gap-2 rounded-xl border border-edge bg-tile px-4 py-2.5 text-sm font-semibold text-fg-2 hover:bg-tile-2 hover:border-line-strong hover:text-paper transition-all"
        >
          <span>Katalog Prompt 3D</span>
          <ArrowRight className="h-4 w-4 text-accent" />
        </Link>
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

      {/* Grid of 29 3D Video Cards */}
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

                {/* Action Row: Link + Copy Prompt */}
                <div className="mt-3 flex items-center justify-between border-t border-line-soft pt-3">
                  <Link
                    href={`/studio?kit=${reel.format}&prompt=${encodeURIComponent(reel.prompt)}`}
                    className="group/link inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-fg-2 hover:text-accent transition-colors"
                  >
                    <span>Coba di Studio</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                  </Link>

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
    </section>
  );
};
