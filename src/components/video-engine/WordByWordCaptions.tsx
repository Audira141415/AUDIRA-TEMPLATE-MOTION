'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StoryboardLine, SubtitleConfig, MotionFormat } from '@/types/motion';
import { MoveVertical, Sparkles, Check, ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface Props {
  currentLine: StoryboardLine | null;
  currentTime: number;
  highlightColor?: string;
  topPercent?: string;
  config?: SubtitleConfig;
  format?: MotionFormat;
  onUpdatePosition?: (newY: number) => void;
  phoneContainerRef?: React.RefObject<HTMLDivElement | null>;
}

const POSITION_MAP: Record<string, string> = {
  top: '14%',
  upper_mid: '26%',
  center: '48%',
  lower_mid: '68%',
  bottom: '82%',
};

export const WordByWordCaptions: React.FC<Props> = ({
  currentLine,
  currentTime,
  highlightColor = '#facc15',
  topPercent,
  config,
  format,
  onUpdatePosition,
  phoneContainerRef,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [dragY, setDragY] = useState<number | null>(null);

  // If subtitles are explicitly disabled, don't render
  if (config && config.enabled === false) return null;
  if (!currentLine) return null;

  // Determine vertical positioning
  let topNumeric = 68; // Default standard vertical Reels safe zone
  if (config?.customY !== undefined) {
    topNumeric = config.customY;
  } else if (config?.position && POSITION_MAP[config.position]) {
    topNumeric = parseInt(POSITION_MAP[config.position]);
  } else if (topPercent) {
    topNumeric = parseInt(topPercent.replace('top-[', '').replace('%]', '')) || 68;
  } else if (format === 'clean_explainer') {
    topNumeric = 68;
  } else if (format === 'breaking_news') {
    topNumeric = 54; // Safe float right above lower-third news crawl
  } else if (format === 'whiteboard') {
    topNumeric = 72;
  }

  const currentY = dragY !== null ? dragY : topNumeric;
  const topStyle = `${currentY}%`;

  // Dragging Handlers
  const handleStartDrag = (clientY: number) => {
    if (!onUpdatePosition) return;
    setIsDragging(true);
    setDragY(currentY);

    const container = phoneContainerRef?.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const pageY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const relativeY = pageY - rect.top;
      const percentY = Math.round((relativeY / rect.height) * 100);
      const clampedY = Math.max(12, Math.min(85, percentY));
      setDragY(clampedY);
      onUpdatePosition(clampedY);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      setDragY(null);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);
  };

  // Subtitle size classes (calibrated for 9:16 vertical smartphone screen)
  const sizeClass = config?.size === 'sm'
    ? 'text-xs sm:text-sm font-bold'
    : config?.size === 'lg'
    ? 'text-lg sm:text-xl font-black'
    : 'text-sm sm:text-base font-extrabold';

  const animStyle = config?.animationStyle || 'pop_bounce';
  const fontFamily = config?.fontFamily || 'montserrat';

  // Font family classes
  const fontClass = fontFamily === 'montserrat'
    ? 'font-sans font-black tracking-tight'
    : fontFamily === 'impact'
    ? 'font-sans font-black tracking-wide uppercase'
    : fontFamily === 'the_bold_font'
    ? 'font-sans font-extrabold tracking-tighter uppercase'
    : fontFamily === 'komika'
    ? 'font-mono font-black tracking-tight'
    : 'font-sans font-extrabold';

  // Subtitle container box style with anti-collision contrast shield
  let boxStyleClass = 'bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/20 shadow-xl';
  if (config?.boxStyle === 'glass') {
    boxStyleClass = 'bg-black/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/25 shadow-2xl';
  } else if (config?.boxStyle === 'solid') {
    boxStyleClass = 'bg-black px-3.5 py-1.5 rounded-xl border-2 border-white shadow-[3px_3px_0_#ea580c]';
  } else if (config?.boxStyle === 'neon') {
    boxStyleClass = 'bg-black/90 px-3.5 py-2 rounded-2xl border-2 border-orange-500/80 shadow-[0_0_20px_rgba(234,88,12,0.45)]';
  } else if (config?.boxStyle === 'shadow') {
    boxStyleClass = 'bg-black/60 backdrop-blur-sm px-3 py-1 rounded-2xl border border-white/15 shadow-xl';
  }

  const activeHighlight = config?.highlightColor || highlightColor;
  const showSpeaker = config?.showSpeakerTag !== false;

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
    <>
      {/* Live guideline during drag */}
      {isDragging && (
        <div 
          className="absolute inset-x-0 z-50 pointer-events-none flex items-center transition-none"
          style={{ top: topStyle }}
        >
          <div className="w-full border-t-2 border-dashed border-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)]" />
          <div className="absolute right-3 -translate-y-1/2 px-2 py-0.5 rounded-md bg-yellow-400 text-black text-[10px] font-mono font-black shadow-lg">
            Y: {currentY}% • {currentY < 32 ? 'Atas' : currentY < 60 ? 'Tengah' : currentY <= 75 ? 'Reels Safe' : 'Bawah'}
          </div>
        </div>
      )}

      {/* Main Subtitle Container */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="absolute inset-x-3 sm:inset-x-4 z-40 flex flex-col items-center justify-center select-none transition-all duration-150 -translate-y-1/2 pointer-events-auto group"
        style={{ top: topStyle }}
      >
        {/* Quick Position Jump Bar on Hover or Drag */}
        {(isHovered || isDragging) && onUpdatePosition && (
          <div className="mb-1.5 flex items-center gap-1 bg-black/90 px-2 py-1 rounded-full border border-orange-500/60 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
            <span className="text-[9px] font-mono text-orange-400 font-bold px-1 flex items-center gap-1">
              <MoveVertical className="w-2.5 h-2.5" />
              Y: {currentY}%
            </span>
            <div className="h-3 w-px bg-zinc-700 mx-0.5" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUpdatePosition(14);
              }}
              className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                currentY === 14 ? 'bg-orange-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
              title="Pindah ke Atas (14%)"
            >
              Atas
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUpdatePosition(48);
              }}
              className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                currentY === 48 ? 'bg-orange-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
              title="Pindah ke Tengah (48%)"
            >
              Tengah
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUpdatePosition(68);
              }}
              className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                currentY === 68 ? 'bg-orange-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
              title="Pindah ke Safe Zone Reels (68%)"
            >
              Safe 68%
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUpdatePosition(82);
              }}
              className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                currentY === 82 ? 'bg-orange-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
              title="Pindah ke Bawah (82%)"
            >
              Bawah
            </button>
          </div>
        )}

        {/* Optional Speaker Tag Pill */}
        {showSpeaker && currentLine.speaker && (
          <div className="mb-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-black/90 text-white border border-white/25 shadow-md backdrop-blur-md">
            {currentLine.speaker}
          </div>
        )}

        {/* Kinetic Words Box (With Drag Handle on Left or Double Click) */}
        <div 
          onMouseDown={(e) => {
            if (onUpdatePosition) {
              handleStartDrag(e.clientY);
            }
          }}
          onTouchStart={(e) => {
            if (onUpdatePosition && e.touches.length > 0) {
              handleStartDrag(e.touches[0].clientY);
            }
          }}
          className={`max-w-[92%] text-center leading-[1.3] flex flex-wrap justify-center items-center gap-x-1.5 gap-y-1 relative cursor-grab active:cursor-grabbing ${boxStyleClass} ${
            isDragging ? 'ring-2 ring-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.6)]' : ''
          }`}
          title="Klik & Geser Vertikal (Drag) untuk memindahkan subtitle"
        >
          {/* Subtle Drag Handle Dot Indicator */}
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-60 transition-opacity">
            <MoveVertical className="w-3 h-3 text-orange-400" />
          </div>

          {words.map((item, idx) => {
            const isActive = currentTime >= item.start && currentTime <= item.end;
            const isPassed = currentTime > item.end;

            let effectClass = 'scale-110 z-10';
            if (animStyle === 'pop_bounce') {
              effectClass = isActive ? 'scale-125 -translate-y-1 z-20 font-black' : isPassed ? 'opacity-90 scale-100' : 'opacity-40 scale-95';
            } else if (animStyle === 'karaoke') {
              effectClass = isActive ? 'scale-115 z-10 brightness-125' : isPassed ? 'opacity-95' : 'opacity-35';
            } else if (animStyle === 'flash_word') {
              effectClass = isActive ? 'scale-130 font-black text-xl z-20' : isPassed ? 'opacity-60 scale-95' : 'opacity-20 scale-90';
            } else if (animStyle === 'hormozi_box') {
              effectClass = isActive ? 'scale-115 px-1.5 py-0.5 rounded bg-yellow-400 text-black font-black shadow-lg z-20' : isPassed ? 'opacity-90' : 'opacity-40';
            } else {
              effectClass = isActive ? 'scale-110 z-10' : isPassed ? 'opacity-90 scale-100' : 'opacity-35 scale-95';
            }

            const textColor = (animStyle === 'hormozi_box' && isActive) ? '#000000' : isActive ? activeHighlight : '#ffffff';
            const textShadow = (animStyle === 'hormozi_box' && isActive)
              ? 'none'
              : isActive
              ? `0 0 16px ${activeHighlight}, 0 2px 4px #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000`
              : '0 2px 4px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000';

            return (
              <span
                key={`${currentLine.id}-${idx}`}
                className={`inline-block transition-all duration-100 ${sizeClass} ${fontClass} ${effectClass}`}
                style={{
                  color: textColor,
                  textShadow: textShadow,
                }}
              >
                {item.word}
              </span>
            );
          })}
        </div>
      </div>
    </>
  );
};
