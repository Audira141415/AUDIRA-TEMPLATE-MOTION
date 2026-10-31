'use client';

import React from 'react';
import { StoryboardLine } from '@/types/motion';

interface Props {
  currentLine: StoryboardLine | null;
  currentTime: number;
  highlightColor?: string;
}

export const WordByWordCaptions: React.FC<Props> = ({
  currentLine,
  currentTime,
  highlightColor = '#facc15', // Gold yellow pop
}) => {
  if (!currentLine) return null;

  const words = currentLine.words;

  return (
    <div className="absolute top-[32%] inset-x-4 z-40 flex flex-col items-center justify-center pointer-events-none select-none">
      {/* Speaker Tag Pill */}
      <div className="mb-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-black/80 text-white border border-white/20 shadow-lg backdrop-blur-md">
        {currentLine.speaker}
      </div>

      {/* Kinetic Words Container */}
      <div className="max-w-[85%] text-center leading-[1.3] flex flex-wrap justify-center items-center gap-x-2 gap-y-1">
        {words.map((item, idx) => {
          const isActive = currentTime >= item.start && currentTime <= item.end;
          const isPassed = currentTime > item.end;

          return (
            <span
              key={`${currentLine.id}-${idx}`}
              className={`inline-block transition-all duration-100 font-black text-2xl md:text-3xl tracking-tight ${
                isActive
                  ? 'scale-125 z-10'
                  : isPassed
                  ? 'opacity-90 scale-100'
                  : 'opacity-40 scale-95'
              }`}
              style={{
                color: isActive ? highlightColor : '#ffffff',
                textShadow: isActive
                  ? `0 0 20px ${highlightColor}, 0 2px 4px #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000`
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

