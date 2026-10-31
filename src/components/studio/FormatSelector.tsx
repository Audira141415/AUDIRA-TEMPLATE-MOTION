'use client';

import React from 'react';
import { FORMAT_CATALOG } from '@/lib/templates';
import { MotionFormat } from '@/types/motion';
import { Users, PenTool, Gamepad2, Radio, Layers, Film, Type, MessageCircle, ListOrdered, HelpCircle, Mic, BookOpen, Terminal, Swords, Map, ChefHat, AtSign, Receipt, Tv, StickyNote } from 'lucide-react';

interface Props {
  selectedFormat: MotionFormat;
  onSelect: (format: MotionFormat) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Users: <Users className="w-5 h-5" />,
  PenTool: <PenTool className="w-5 h-5" />,
  Gamepad2: <Gamepad2 className="w-5 h-5" />,
  Radio: <Radio className="w-5 h-5" />,
  Layers: <Layers className="w-5 h-5" />,
  Film: <Film className="w-5 h-5" />,
  Type: <Type className="w-5 h-5" />,
  MessageCircle: <MessageCircle className="w-5 h-5" />,
  ListOrdered: <ListOrdered className="w-5 h-5" />,
  HelpCircle: <HelpCircle className="w-5 h-5" />,
  Mic: <Mic className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  Terminal: <Terminal className="w-5 h-5" />,
  Swords: <Swords className="w-5 h-5" />,
  Map: <Map className="w-5 h-5" />,
  ChefHat: <ChefHat className="w-5 h-5" />,
  AtSign: <AtSign className="w-5 h-5" />,
  Receipt: <Receipt className="w-5 h-5" />,
  Tv: <Tv className="w-5 h-5" />,
  StickyNote: <StickyNote className="w-5 h-5" />,
};

export const FormatSelector: React.FC<Props> = ({ selectedFormat, onSelect }) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
          <span>Pilih Desain & Format Video</span>
          <span className="text-orange-500 font-mono">({FORMAT_CATALOG.length} Archetypes)</span>
        </label>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {FORMAT_CATALOG.map((f) => {
          const isSelected = selectedFormat === f.id;
          return (
            <button
              key={f.id}
              onClick={() => onSelect(f.id)}
              className={`p-3 rounded-2xl text-left border-2 transition-all flex flex-col justify-between gap-2 ${
                isSelected
                  ? 'bg-zinc-900 border-orange-500 shadow-brutal-orange translate-y-[-2px]'
                  : 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`p-2 rounded-xl text-white ${
                    isSelected ? 'bg-orange-600' : 'bg-zinc-800 text-zinc-300'
                  }`}
                >
                  {iconMap[f.iconName] || <Users className="w-5 h-5" />}
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                  {f.badge}
                </span>
              </div>

              <div>
                <h4 className="font-black text-sm text-white tracking-tight leading-tight">
                  {f.name}
                </h4>
                <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {f.tagline}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

