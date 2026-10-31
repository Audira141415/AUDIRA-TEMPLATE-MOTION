'use client';

import React from 'react';
import { Clapperboard, Captions } from 'lucide-react';
import { CaptionStyle, MotionFormat, ReelStyle, TransitionStyle } from '@/types/motion';
import { CAPTION_STYLES, TRANSITIONS } from '../../../engine/compose.mjs';

// Formats whose words appear as separate captions; the others print text inside their own layout.
const CAPTIONED: MotionFormat[] = [
  'character_banter',
  'whiteboard',
  'clean_explainer',
  'docu_story',
  'top_list',
  'podcast_clip',
  'map_journey',
  'receipt',
  'retro_vhs',
];

interface Props {
  format: MotionFormat;
  style: ReelStyle;
  onChange: (style: ReelStyle) => void;
}

const Chips = <T extends string>({
  options,
  value,
  onPick,
  disabled,
}: {
  options: Record<string, string>;
  value: T;
  onPick: (id: T) => void;
  disabled?: boolean;
}) => (
  <div className="flex flex-wrap gap-2">
    {Object.entries(options).map(([id, label]) => (
      <button
        key={id}
        type="button"
        disabled={disabled}
        aria-pressed={value === id}
        onClick={() => onPick(id as T)}
        className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all disabled:opacity-40 ${
          value === id
            ? 'bg-orange-600 text-white border-black shadow-brutal-sm'
            : 'bg-zinc-800/70 text-zinc-300 border-zinc-700/80 hover:bg-zinc-800'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);

export const StylePicker: React.FC<Props> = ({ format, style, onChange }) => {
  const captioned = CAPTIONED.includes(format);
  const caption = style.caption ?? 'auto';
  const transition = style.transition ?? 'auto';

  return (
    <div className="bg-zinc-900/90 p-5 rounded-3xl border-2 border-zinc-800 shadow-brutal flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center gap-2">
          <Captions className="w-4 h-4 text-orange-500" /> Gaya caption
        </label>
        <Chips<CaptionStyle>
          options={CAPTION_STYLES}
          value={caption}
          disabled={!captioned}
          onPick={(c) => onChange({ ...style, caption: c })}
        />
        {!captioned && (
          <p className="text-[11px] text-zinc-500">
            Format ini menampilkan teks di dalam desainnya sendiri (chat, panel, kartu), jadi tidak memakai caption terpisah.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2 pt-4 border-t border-zinc-800">
        <label className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center gap-2">
          <Clapperboard className="w-4 h-4 text-orange-500" /> Transisi antar-baris
        </label>
        <Chips<TransitionStyle>
          options={TRANSITIONS}
          value={transition}
          onPick={(t) => onChange({ ...style, transition: t })}
        />
        <p className="text-[11px] text-zinc-500">Dipakai di setiap pergantian baris dan sebelum kartu komentar penutup.</p>
      </div>
    </div>
  );
};
