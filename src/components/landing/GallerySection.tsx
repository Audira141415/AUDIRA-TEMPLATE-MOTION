'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Play, ArrowRight, Sparkles, Gamepad2, FileText, Film, Box } from 'lucide-react';
import { REELS, ReelSample, GalleryCategory } from './reels';

interface CategoryItem {
  id: GalleryCategory;
  label: string;
  count: number;
  icon: React.ReactNode;
  badge?: string;
  sectionTitle?: string;
  sectionDesc?: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: '3d',
    label: 'Motion 3D & Simulasi',
    count: 4,
    icon: <Box className="w-4 h-4" />,
    badge: 'LONG-FORM 3D FILMS',
    sectionTitle: 'Long-Form 3D Films & Simulation',
    sectionDesc: 'Perjalanan 3D kosmis sinematik, arsitektur cross-section presisi, dan simulasi partikel absurd dengan skala astronomi.',
  },
  {
    id: 'gaming',
    label: 'Gaming & Skits',
    count: 7,
    icon: <Gamepad2 className="w-4 h-4" />,
    badge: 'CREATOR & SKITS',
    sectionTitle: 'Roblox Obby, RPG & Host Banter',
    sectionDesc: 'Karakter 3D berkicau, obby lava parkour Roblox, breaking news heboh, dan pixel battle 16-bit.',
  },
  {
    id: 'explainer',
    label: 'Edukasi & Data',
    count: 7,
    icon: <FileText className="w-4 h-4" />,
    badge: 'MOTION GRAPHICS & DATA',
    sectionTitle: 'Explainer, Whiteboard & Typography',
    sectionDesc: 'Data metrik algoritma bergerak, whiteboard tangan menggambar live, dan kinetic typography berenergi tinggi.',
  },
  {
    id: 'story',
    label: 'Story & Drama',
    count: 7,
    icon: <Film className="w-4 h-4" />,
    badge: 'NARRATIVE & DOCUMENTARY',
    sectionTitle: 'Dokumenter Arsip, Chat & Podcast',
    sectionDesc: 'Kisah nyata bernada emosional, drama chat WhatsApp seru, rute GPS liburan, dan rekaman nostalgia retro VHS.',
  },
];

export const GallerySection: React.FC<{ activeTab?: GalleryCategory }> = ({ activeTab = '3d' }) => {
  const [currentTab, setCurrentTab] = useState<GalleryCategory>(activeTab);
  const [activeVideoFile, setActiveVideoFile] = useState<string | null>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  // Voynan safety lock: single active video playback at any time
  const handlePlayVideo = (file: string) => {
    setActiveVideoFile(file);
    videoRefs.current.forEach((videoEl, key) => {
      if (key !== file && !videoEl.paused) {
        videoEl.pause();
      }
    });
  };

  const currentCategory = CATEGORIES.find((c) => c.id === currentTab) || CATEGORIES[0];
  const items = REELS.filter((r) => r.category === currentTab);

  return (
    <section id="hasil" className="mx-auto max-w-[1240px] scroll-mt-8 px-4 py-16 md:px-8 md:py-24">
      {/* Header */}
      <div className="mb-10 flex flex-wrap items-end justify-between gap-5 border-b border-line pb-8">
        <div className="flex max-w-[680px] flex-col gap-3">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">Hasil Video</p>
          <h2 className="font-display text-[32px] sm:text-[44px] font-bold leading-[1.08] tracking-[-0.03em] text-paper">
            Semua gaya, dirender langsung pakai engine ini.
          </h2>
          <p className="text-sm sm:text-base text-muted">
            Pilih kategori gaya di bawah untuk melihat preview reel vertikal 9:16 hasil generate otomatis.
          </p>
        </div>

        <Link
          href="/prompts"
          className="inline-flex items-center gap-2 rounded-xl border border-edge bg-tile px-4 py-2.5 text-sm font-semibold text-fg-2 hover:bg-tile-2 hover:border-line-strong hover:text-paper transition-all"
        >
          <span>Katalog Prompt AI</span>
          <ArrowRight className="h-4 w-4 text-accent" />
        </Link>
      </div>

      {/* Category Tabs (Voynan Style ARIA Tabs) */}
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
              className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all ${
                isSelected
                  ? 'border-paper bg-paper text-ink shadow-lg shadow-black/40 scale-[1.02]'
                  : 'border-edge bg-card text-fg-2 hover:bg-tile-2 hover:border-line-strong'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
              <span
                className={`font-mono text-xs rounded-full px-2 py-0.5 ${
                  isSelected ? 'bg-black/20 text-ink' : 'bg-ink border border-line text-dim'
                }`}
              >
                {cat.count} gaya
              </span>
            </button>
          );
        })}
      </div>

      {/* Featured Section Header for Current Category */}
      {currentCategory.badge && (
        <div className="mb-8 rounded-2xl border border-line/60 bg-gradient-to-r from-card to-tile p-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-accent">
            <Sparkles className="w-3 h-3" />
            <span>{currentCategory.badge}</span>
          </div>
          <h3 className="mt-3 font-display text-2xl sm:text-3xl font-bold tracking-tight text-paper">
            {currentCategory.sectionTitle}
          </h3>
          <p className="mt-1.5 max-w-3xl text-sm sm:text-base leading-relaxed text-muted">
            {currentCategory.sectionDesc}
          </p>
        </div>
      )}

      {/* Grid of Video Cards (Voynan Exact Layout) */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((reel) => {
          const isPlaying = activeVideoFile === reel.file;

          return (
            <div
              key={reel.file}
              className="flex flex-col justify-between rounded-2xl border border-line bg-card p-3.5 sm:p-4 shadow-card-warm transition-transform hover:-translate-y-1 hover:border-line-strong"
            >
              {/* Top Prompt Quote Snippet */}
              <div className="mb-2.5 min-h-[38px]">
                <p className="text-xs italic leading-relaxed text-muted/90 line-clamp-2">
                  &ldquo;{reel.quote}&rdquo;
                </p>
              </div>

              {/* Vertical 9:16 Video Container */}
              <div className="relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-ink border border-line-soft">
                {isPlaying ? (
                  <video
                    ref={(el) => {
                      if (el) videoRefs.current.set(reel.file, el);
                      else videoRefs.current.delete(reel.file);
                    }}
                    src={`/reels/${reel.file}.mp4`}
                    poster={`/reels/${reel.file}.jpg`}
                    controls
                    autoPlay
                    playsInline
                    className="absolute inset-0 size-full object-cover"
                    onPlay={() => handlePlayVideo(reel.file)}
                  />
                ) : (
                  <>
                    <img
                      src={`/reels/${reel.file}.jpg`}
                      alt={reel.title}
                      loading="lazy"
                      className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/reels/banter.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30" />

                    {/* Click-to-Play Overlay Button */}
                    <button
                      type="button"
                      onClick={() => handlePlayVideo(reel.file)}
                      aria-label={`Putar video preview: ${reel.title}`}
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

                {/* Action Link: "Buat yang seperti ini ->" */}
                <Link
                  href={`/studio?format=${reel.format}&prompt=${encodeURIComponent(reel.quote)}`}
                  className="group/link mt-3 inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-fg-2 hover:text-accent transition-colors"
                >
                  <span>Buat yang seperti ini</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
