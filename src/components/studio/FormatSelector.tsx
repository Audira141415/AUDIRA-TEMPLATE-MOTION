'use client';

import React, { useMemo, useState } from 'react';
import { FORMAT_CATALOG } from '@/lib/templates';
import { MotionFormat } from '@/types/motion';
import { 
  Users, PenTool, Gamepad2, Radio, Layers, Film, Type, MessageCircle, 
  ListOrdered, HelpCircle, Mic, BookOpen, Terminal, Swords, Map, 
  ChefHat, AtSign, Receipt, Tv, StickyNote, Box, Search, Sparkles
} from 'lucide-react';
import { browserAudio } from '@/lib/browser-audio';

interface Props {
  selectedFormat: MotionFormat;
  onSelect: (format: MotionFormat) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Users: <Users className="w-4 h-4" />,
  PenTool: <PenTool className="w-4 h-4" />,
  Gamepad2: <Gamepad2 className="w-4 h-4" />,
  Radio: <Radio className="w-4 h-4" />,
  Layers: <Layers className="w-4 h-4" />,
  Film: <Film className="w-4 h-4" />,
  Type: <Type className="w-4 h-4" />,
  MessageCircle: <MessageCircle className="w-4 h-4" />,
  ListOrdered: <ListOrdered className="w-4 h-4" />,
  HelpCircle: <HelpCircle className="w-4 h-4" />,
  Mic: <Mic className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />,
  Terminal: <Terminal className="w-4 h-4" />,
  Swords: <Swords className="w-4 h-4" />,
  Map: <Map className="w-4 h-4" />,
  ChefHat: <ChefHat className="w-4 h-4" />,
  AtSign: <AtSign className="w-4 h-4" />,
  Receipt: <Receipt className="w-4 h-4" />,
  Tv: <Tv className="w-4 h-4" />,
  StickyNote: <StickyNote className="w-4 h-4" />,
  Box: <Box className="w-4 h-4 text-cyan-400" />,
};

type CategoryFilter = 'all' | 'gaming' | 'banter' | 'explainer' | 'story';

const CATEGORY_TABS: Array<{ id: CategoryFilter; label: string; count: number }> = [
  { id: 'all', label: 'Semua', count: 21 },
  { id: 'gaming', label: 'Gaming & Roblox', count: 4 },
  { id: 'banter', label: 'Banter & Debat', count: 4 },
  { id: 'explainer', label: 'Edukasi & Data', count: 5 },
  { id: 'story', label: 'Story & Drama', count: 8 },
];

const FORMAT_CATEGORY_MAP: Record<MotionFormat, CategoryFilter> = {
  roblox_story: 'gaming',
  pixel_rpg: 'gaming',
  terminal_hack: 'gaming',
  comic_strip: 'gaming',

  character_banter: 'banter',
  versus: 'banter',
  chat_story: 'banter',
  podcast_clip: 'banter',

  clean_explainer: 'explainer',
  whiteboard: 'explainer',
  top_list: 'explainer',
  quiz: 'explainer',
  sticky_notes: 'explainer',

  breaking_news: 'story',
  docu_story: 'story',
  social_post: 'story',
  kinetic_type: 'story',
  receipt: 'story',
  retro_vhs: 'story',
  map_journey: 'story',
  recipe_steps: 'story',
};

export const FormatSelector: React.FC<Props> = ({ selectedFormat, onSelect }) => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCatalog = useMemo(() => {
    return FORMAT_CATALOG.filter((f) => {
      const matchCat = activeCategory === 'all' || FORMAT_CATEGORY_MAP[f.id] === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.tagline.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.badge.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="flex flex-col gap-3.5 bg-card p-4 sm:p-5 rounded-3xl border border-line shadow-card">
      {/* Header with Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line">
        <label className="text-xs font-black uppercase tracking-wider text-paper flex items-center gap-2 font-display">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>Pilih Desain & Format Video</span>
          <span className="text-accent font-mono font-normal">({FORMAT_CATALOG.length} Format)</span>
        </label>

        {/* Quick Search */}
        <div className="relative min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari format..."
            className="w-full pl-8 pr-2.5 py-1.5 rounded-xl border border-line bg-tile text-xs text-paper placeholder:text-muted/60 focus:border-accent focus-visible:ring-1 focus-visible:ring-accent focus:outline-none"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {CATEGORY_TABS.map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                browserAudio.playClick('soft');
                setActiveCategory(tab.id);
              }}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-accent ${
                isActive
                  ? 'bg-accent text-ink font-black shadow-md'
                  : 'bg-tile border border-line text-muted hover:text-paper hover:border-edge'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-black/30 text-ink font-bold' : 'bg-ink text-muted'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid of Format Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
        {filteredCatalog.map((f) => {
          const isSelected = selectedFormat === f.id;
          const isRoblox = f.id === 'roblox_story';
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                browserAudio.playClick('normal');
                onSelect(f.id);
              }}
              className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between gap-2.5 relative active:scale-98 focus-visible:ring-2 focus-visible:ring-accent ${
                isSelected
                  ? 'bg-tile-2 border-accent ring-2 ring-accent/40 shadow-[0_0_20px_rgba(255,106,42,0.18)] translate-y-[-2px]'
                  : 'bg-tile hover:bg-tile-2 border-line hover:border-edge text-paper'
              }`}
            >
              {isRoblox && (
                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-amber-400 text-ink text-[9px] font-black uppercase tracking-wider">
                  NEW
                </span>
              )}

              <div className="flex items-start justify-between">
                <div
                  className={`p-2 rounded-xl transition-colors ${
                    isSelected ? 'bg-accent text-ink' : 'bg-ink text-muted border border-line'
                  }`}
                >
                  {iconMap[f.iconName] || <Users className="w-4 h-4" />}
                </div>
                {!isRoblox && (
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-ink text-muted border border-line truncate max-w-[90px] font-mono">
                    {f.badge}
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-black text-xs text-paper tracking-tight leading-tight font-display">
                  {f.name}
                </h4>
                <p className="text-[10px] text-muted mt-1 line-clamp-1 leading-relaxed">
                  {f.tagline}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {filteredCatalog.length === 0 && (
        <div className="p-6 text-center text-xs text-muted border border-dashed border-line rounded-2xl">
          Format tidak ditemukan dengan kata kunci &quot;{searchQuery}&quot;.
        </div>
      )}
    </div>
  );
};
