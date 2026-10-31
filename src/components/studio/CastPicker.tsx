'use client';

import React from 'react';
import { HUMAN_CAST, AI_CAST, SCENE_LOCATIONS, CastMember, LocationScene } from '@/lib/cast-catalog';
import { Users, Sparkles, Shuffle, MapPin, Bot, User } from 'lucide-react';

interface Props {
  selectedHuman: string;
  selectedAi: string;
  selectedLocation: string;
  onSelectHuman: (char: CastMember) => void;
  onSelectAi: (char: CastMember) => void;
  onSelectLocation: (loc: LocationScene) => void;
  onShuffle: () => void;
}

export const CastPicker: React.FC<Props> = ({
  selectedHuman,
  selectedAi,
  selectedLocation,
  onSelectHuman,
  onSelectAi,
  onSelectLocation,
  onShuffle,
}) => {
  return (
    <div className="bg-zinc-900/90 p-5 rounded-3xl border-2 border-zinc-800 shadow-brutal flex flex-col gap-4">
      {/* Title & Shuffle Button */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center gap-2">
          <Users className="w-4 h-4 text-orange-500" />
          <span>Karakter & Latar Tempat</span>
        </label>
        <button
          type="button"
          onClick={onShuffle}
          className="px-2.5 py-1 rounded-xl bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 border border-orange-500/40 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Shuffle Cast 🎲</span>
        </button>
      </div>

      {/* Cast Row: Human vs AI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Human Character Picker */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1">
            <User className="w-3 h-3 text-orange-400" />
            Karakter Manusia (A):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {HUMAN_CAST.map((c) => {
              const isSelected = selectedHuman.toLowerCase() === c.name.toLowerCase();
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onSelectHuman(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-orange-600 text-white border-black shadow-brutal-sm scale-105'
                      : 'bg-zinc-800/80 text-zinc-300 border-zinc-700 hover:bg-zinc-800'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.hoodieColor }} />
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Character Picker */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1">
            <Bot className="w-3 h-3 text-cyan-400" />
            Karakter AI Bot (B):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {AI_CAST.map((c) => {
              const isSelected = selectedAi.toLowerCase() === c.name.toLowerCase();
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onSelectAi(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-cyan-600 text-white border-black shadow-brutal-sm scale-105'
                      : 'bg-zinc-800/80 text-zinc-300 border-zinc-700 hover:bg-zinc-800'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.botAccentColor }} />
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Location Picker */}
      <div className="flex flex-col gap-1.5 pt-2 border-t border-zinc-800">
        <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-red-400" />
          Lokasi Latar (Scene Backdrop):
        </span>
        <div className="flex flex-wrap gap-1.5">
          {SCENE_LOCATIONS.map((loc) => {
            const isSelected = selectedLocation.toLowerCase().includes(loc.name.toLowerCase()) || selectedLocation.toLowerCase().includes(loc.id);
            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => onSelectLocation(loc)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-zinc-100 text-black border-black shadow-brutal-sm font-extrabold'
                    : 'bg-zinc-800/80 text-zinc-300 border-zinc-700 hover:bg-zinc-800'
                }`}
              >
                <span>{loc.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

