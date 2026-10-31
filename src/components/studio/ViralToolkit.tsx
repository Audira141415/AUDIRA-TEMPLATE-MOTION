'use client';

import React, { useState } from 'react';
import { Storyboard } from '@/types/motion';
import { Share2, Copy, Check, Hash, Sparkles, Flame } from 'lucide-react';

interface Props {
  storyboard: Storyboard;
}

export const ViralToolkit: React.FC<Props> = ({ storyboard }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Generate dynamic caption
  const viralHeadline = `🔥 ${storyboard.title.toUpperCase()}`;
  const generatedCaption = `${viralHeadline}

Pernah gak sih lo ngalamin hal kayak gini? 

${storyboard.lines.map((l) => `${l.speaker}: "${l.text}"`).join('\n')}

👉 ${storyboard.commentMagnetHook}
Tulis pendapat lo di bawah ya! 👇

#audiramotion #banterreels #motiongraphics #reelsindonesia #fyp #viral #shorts #kreatorindonesia #aiart`;

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="bg-zinc-900/90 p-5 rounded-3xl border-2 border-zinc-800 shadow-brutal flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500" />
          <span>Viral Social Toolkit (Siap Posting)</span>
        </label>
        <span className="text-[10px] font-mono font-bold text-orange-400 bg-orange-950/60 px-2 py-0.5 rounded border border-orange-800">
          Instagram & TikTok Ready
        </span>
      </div>

      {/* 1-Click Copy Full Caption */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400 font-bold">Caption & Hashtag Otomatis:</span>
          <button
            type="button"
            onClick={() => copyToClipboard(generatedCaption, 'caption')}
            className="px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95 shadow-brutal-sm"
          >
            {copiedSection === 'caption' ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Semua</span>
              </>
            )}
          </button>
        </div>

        <textarea
          rows={5}
          readOnly
          value={generatedCaption}
          className="w-full bg-[#141413] text-xs text-zinc-300 p-3 rounded-2xl border border-zinc-800 font-mono focus:outline-none resize-none leading-relaxed"
        />
      </div>

      {/* Quick Hashtag Chips */}
      <div className="flex flex-col gap-1.5 pt-2 border-t border-zinc-800">
        <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1">
          <Hash className="w-3 h-3 text-cyan-400" />
          Hashtags Rekomendasi Algoritma:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {['#reels', '#banterreels', '#motiongraphic', '#fyp', '#viral', '#indonesia', '#shortsvideo'].map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 select-all"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

