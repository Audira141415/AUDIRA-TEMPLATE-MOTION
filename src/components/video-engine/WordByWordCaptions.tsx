'use client';

import React from 'react';
import { StoryboardLine } from '@/types/motion';

interface Props {
  currentLine: StoryboardLine | null;
  currentTime: number;
  highlightColor?: string;
  topPercent?: string;
}

export const WordByWordCaptions: React.FC<Props> = ({
  currentLine,
  currentTime,
  highlightColor = '#facc15',
  topPercent = 'top-[25%]',
}) => {
  if (!currentLine) return null;

  const words = currentLine.words && currentLine.words.length > 0
    ? currentLine.words
    : currentLine.text.split(' ').map((w, i, arr) => {
      const step = currentLine.durationSec / Math.max(arr.length, 1);
      return {
        word: w,
        start: currentLine.startSec + i * step,
        end: currentLine.startSec + (i + 1) * step,
      };
    });

  return (
    <div className={`absolute ${topPercent} inset-x-4 z-40 flex flex-col items-center justify-center pointer-events-none select-none`}>
      {/* Speaker Tag Pill */}
      <div className="mb-2 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-black/80 text-white border border-white/20 shadow-md backdrop-blur-md">
        {currentLine.speaker}
      </div>

      {/* Kinetic Words Container */}
      <div className="max-w-[88%] text-center leading-[1.25] flex flex-wrap justify-center items-center gap-x-1.5 gap-y-1">
        {words.map((item, idx) => {
          const isActive = currentTime >= item.start && currentTime <= item.end;
          const isPassed = currentTime > item.end;

          return (
            <span
              key={`${currentLine.id}-${idx}`}
              className={`inline-block transition-transform duration-75 font-black text-xl sm:text-2xl tracking-tight ${isActive
                  ? 'scale-115 z-10'
                  : isPassed
                    ? 'opacity-90 scale-100'
                    : 'opacity-35 scale-95'
                }`}
              style={{
                color: isActive ? highlightColor : '#ffffff',
                textShadow: isActive
                  ? `0 0 16px ${highlightColor}, 0 2px 4px #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000`
                  : '0 2px 4px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
              }}
            >
              {item.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
