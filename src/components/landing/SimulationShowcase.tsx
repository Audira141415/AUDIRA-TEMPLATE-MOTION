'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Play, Sparkles } from 'lucide-react';
import { WhatIf3DTemplate } from '@/components/video-engine/WhatIf3DTemplate';
import { ZombieSurvivalTemplate } from '@/components/video-engine/ZombieSurvivalTemplate';
import { HowItsBuiltTemplate } from '@/components/video-engine/HowItsBuiltTemplate';
import { CosmicVoyageTemplate } from '@/components/video-engine/CosmicVoyageTemplate';
import { DEMO_STORYBOARDS } from '@/lib/templates';

const SIMULATION_CARDS = [
  {
    format: 'what_if_3d' as const,
    categoryTag: 'WHAT IF 3D',
    metric: '3.1M',
    platform: 'views on TikTok',
    description: 'One impossible question, played out in 3D: "What if every human farted at once?"',
    color: '#38bdf8',
  },
  {
    format: 'zombie_survival' as const,
    categoryTag: 'ZOMBIE SURVIVAL',
    metric: '260.2K',
    platform: 'views on TikTok',
    description: 'Surviving an outbreak in one place, day by day: "Zombie Farm".',
    color: '#84cc16',
  },
  {
    format: 'how_its_built' as const,
    categoryTag: 'HOW IT\'S BUILT',
    metric: '300K',
    platform: 'views',
    description: 'A real build, cut open and shown step by step: the underground greenhouse.',
    color: '#f59e0b',
  },
  {
    format: 'cosmic_voyage' as const,
    categoryTag: 'LONG-FORM 3D FILMS',
    metric: '1.58M',
    platform: 'YouTube views in 28 days',
    description: 'The same kind of question, told as a journey in a long 3D film.',
    color: '#60a5fa',
  },
];

export const SimulationShowcase: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const renderMiniTemplate = (fmt: string) => {
    switch (fmt) {
      case 'what_if_3d':
        return (
          <WhatIf3DTemplate
            storyboard={DEMO_STORYBOARDS.what_if_3d}
            currentTime={4.2}
            currentLine={DEMO_STORYBOARDS.what_if_3d.lines[0]}
          />
        );
      case 'zombie_survival':
        return (
          <ZombieSurvivalTemplate
            storyboard={DEMO_STORYBOARDS.zombie_survival}
            currentTime={5.0}
            currentLine={DEMO_STORYBOARDS.zombie_survival.lines[1]}
          />
        );
      case 'how_its_built':
        return (
          <HowItsBuiltTemplate
            storyboard={DEMO_STORYBOARDS.how_its_built}
            currentTime={3.8}
            currentLine={DEMO_STORYBOARDS.how_its_built.lines[2]}
          />
        );
      case 'cosmic_voyage':
        return (
          <CosmicVoyageTemplate
            storyboard={DEMO_STORYBOARDS.cosmic_voyage}
            currentTime={6.0}
            currentLine={DEMO_STORYBOARDS.cosmic_voyage.lines[1]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <section className="border-t border-[#2c2b28] bg-black py-20 px-4 md:px-8 text-white">
      <div className="mx-auto max-w-[1300px]">
        {/* Header matching user reference */}
        <div className="mb-12">
          <p className="font-mono text-[11px] font-black uppercase tracking-[0.18em] text-[#facc15]">
            EVERY FORMAT
          </p>
          <h2 className="mt-3 text-[42px] sm:text-[68px] font-black tracking-[-0.04em] leading-[0.98]">
            One membership. Every format.
          </h2>
          <p className="mt-4 max-w-[620px] text-[16px] sm:text-[18px] text-zinc-400 leading-relaxed">
            Format simulasi 3D viral dengan jutaan penayangan di TikTok & YouTube. Dibuat otomatis dalam hitungan detik.
          </p>
        </div>

        {/* 4 Cards Grid - Responsive from 1 col to 4 cols */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SIMULATION_CARDS.map((card) => {
            const isHovered = hoveredCard === card.format;
            return (
              <div 
                key={card.format}
                onMouseEnter={() => setHoveredCard(card.format)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group flex flex-col justify-between"
              >
                {/* 9:16 Vertical Video Preview Container */}
                <Link
                  href={`/studio?format=${card.format}`}
                  className="relative aspect-[9/16] w-full rounded-[28px] overflow-hidden border-2 border-zinc-800 bg-[#09090b] shadow-2xl transition-all duration-300 group-hover:border-zinc-500 group-hover:shadow-[0_15px_40px_rgba(0,0,0,0.8)] block cursor-pointer"
                >
                  {/* Active Simulation Preview */}
                  {renderMiniTemplate(card.format)}

                  {/* Play & Hover Overlay */}
                  <div className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-200 flex flex-col items-center justify-center p-4 text-center ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="w-14 h-14 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-xl transform scale-100 group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                    <span className="mt-3 px-3 py-1 rounded-full bg-white text-black font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow-lg">
                      <span>Buka di Studio</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>

                {/* Metrics & Copy Info Below Card (Exact match with reference image) */}
                <div className="mt-5 flex flex-col gap-1.5">
                  {/* Category Tag */}
                  <span className="font-mono text-[11px] font-black uppercase tracking-[0.14em] text-[#facc15]">
                    {card.categoryTag}
                  </span>

                  {/* Big Bold Views Metric */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      {card.metric}
                    </span>
                  </div>

                  {/* Platform Label */}
                  <span className="text-xs text-zinc-400 font-semibold -mt-1">
                    {card.platform}
                  </span>

                  {/* Pitch Hook Text */}
                  <p className="mt-2 text-xs text-zinc-300 leading-relaxed line-clamp-3">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
