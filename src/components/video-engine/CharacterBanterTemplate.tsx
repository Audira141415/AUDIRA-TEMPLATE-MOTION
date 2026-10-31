'use client';

import React from 'react';
import { Storyboard, StoryboardLine } from '@/types/motion';
import { HUMAN_CAST, AI_CAST, SCENE_LOCATIONS } from '@/lib/cast-catalog';

interface Props {
  storyboard: Storyboard;
  currentTime: number;
  currentLine: StoryboardLine | null;
}

export const CharacterBanterTemplate: React.FC<Props> = ({
  storyboard,
  currentTime,
  currentLine,
}) => {
  const charAName = storyboard.characters.characterA.name;
  const charBName = storyboard.characters.characterB.name;
  const isSpeakerA = currentLine?.speaker === charAName;
  const isSpeakerB = currentLine?.speaker === charBName;

  // Mouth animation frequency when talking
  const mouthMovement = Math.sin(currentTime * 18);
  const isMouthOpen = mouthMovement > 0;

  // Eye blink every 3.5 seconds
  const isBlinking = (currentTime % 3.5) < 0.2;

  // Find Cast Details for dynamic colors
  const humanMember = HUMAN_CAST.find((h) => h.name.toLowerCase() === charAName.toLowerCase()) || HUMAN_CAST[0];
  const aiMember = AI_CAST.find((a) => a.name.toLowerCase() === charBName.toLowerCase()) || AI_CAST[0];
  const location = SCENE_LOCATIONS.find((l) => storyboard.locationName.toLowerCase().includes(l.name.toLowerCase()) || storyboard.locationName.toLowerCase().includes(l.id)) || SCENE_LOCATIONS[0];

  // Dynamic camera slight zoom toward active speaker
  const zoomClass = isSpeakerA 
    ? 'origin-bottom-left scale-105' 
    : isSpeakerB 
    ? 'origin-bottom-right scale-105' 
    : 'scale-100';

  return (
    <div className={`relative w-full h-full bg-[#141413] text-white overflow-hidden transition-transform duration-300 ${zoomClass}`}>
      {/* Background Vector Graphic */}
      <div className="absolute inset-0 z-0">
        <svg viewBox="0 0 1080 1920" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={location.wallColor} />
              <stop offset="60%" stopColor="#0f0e17" />
              <stop offset="100%" stopColor="#08080c" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Wall & Ceiling */}
          <rect width="1080" height="1920" fill="url(#wallGrad)" />

          {/* Dynamic Neon Sign */}
          <g transform="translate(340, 180)" filter="url(#glow)">
            <rect x="0" y="0" width="400" height="90" rx="45" fill="none" stroke={location.accentColor} strokeWidth="4" />
            <text x="200" y="58" fill="#ffe9df" textAnchor="middle" fontSize="32" fontWeight="900" letterSpacing="3">
              {location.neonText}
            </text>
          </g>

          {/* Window & Neon City Skyline */}
          <rect x="140" y="320" width="800" height="500" rx="16" fill="#080a14" stroke="#27272a" strokeWidth="6" />
          <rect x="180" y="520" width="70" height="300" fill="#18181b" />
          <rect x="270" y="460" width="90" height="360" fill="#27272a" />
          <rect x="380" y="580" width="80" height="240" fill="#18181b" />
          <rect x="480" y="420" width="100" height="400" fill="#27272a" />
          <rect x="600" y="540" width="90" height="280" fill="#18181b" />
          <rect x="710" y="480" width="110" height="340" fill="#27272a" />

          {/* Table Surface */}
          <path d="M 0 1500 L 1080 1500 L 1080 1920 L 0 1920 Z" fill="#18181b" stroke="#3f3f46" strokeWidth="8" />
          <ellipse cx="540" cy="1580" rx="90" ry="24" fill="#09090b" opacity="0.6" />
          <rect x="490" y="1520" width="100" height="70" rx="12" fill="#f4f3f0" />
          <path d="M 590 1535 C 615 1535 615 1565 590 1565" fill="none" stroke="#f4f3f0" strokeWidth="8" />
        </svg>
      </div>

      {/* Location Badge Top */}
      <div className="absolute top-16 inset-x-0 flex justify-center z-20">
        <div className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-semibold tracking-wider text-zinc-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: location.accentColor }}></span>
          {storyboard.locationName}
        </div>
      </div>

      {/* CHARACTER A: Human (Left Side) */}
      <div
        className={`absolute bottom-32 left-4 md:left-8 w-[340px] md:w-[420px] transition-all duration-200 z-10 ${
          isSpeakerA ? 'scale-105 brightness-110 drop-shadow-[0_10px_25px_rgba(194,65,12,0.4)]' : 'scale-95 opacity-70'
        }`}
      >
        <svg viewBox="0 0 400 500" className="w-full h-auto">
          {/* Body / Hoodie */}
          <path d="M 80 500 C 80 340 120 300 200 300 C 280 300 320 340 320 500 Z" fill={humanMember.hoodieColor || '#c2410c'} />
          {/* Head & Neck */}
          <rect x="180" y="270" width="40" height="40" fill="#fbcfe8" rx="8" />
          <ellipse cx="200" cy="190" rx="90" ry="100" fill={humanMember.avatarColor || '#ffe4e6'} />
          
          {/* Hair */}
          <path d="M 100 170 C 100 80 300 80 300 170 C 280 140 240 130 200 130 C 160 130 120 140 100 170 Z" fill="#18181b" />
          <path d="M 120 120 Q 200 70 280 120" stroke="#18181b" strokeWidth="20" fill="none" strokeLinecap="round" />

          {/* Eyes */}
          {isBlinking ? (
            <>
              <line x1="150" y1="185" x2="180" y2="185" stroke="#18181b" strokeWidth="5" strokeLinecap="round" />
              <line x1="220" y1="185" x2="250" y2="185" stroke="#18181b" strokeWidth="5" strokeLinecap="round" />
            </>
          ) : (
            <>
              <ellipse cx="165" cy="185" rx="12" ry="14" fill="#18181b" />
              <ellipse cx="235" cy="185" rx="12" ry="14" fill="#18181b" />
              <circle cx="168" cy="182" r="4" fill="#ffffff" />
              <circle cx="238" cy="182" r="4" fill="#ffffff" />
            </>
          )}

          {/* Eyebrows */}
          <path d="M 145 160 Q 165 152 185 160" stroke="#18181b" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M 215 160 Q 235 152 255 160" stroke="#18181b" strokeWidth="5" fill="none" strokeLinecap="round" />

          {/* Mouth (Reactive to speaking) */}
          {isSpeakerA && isMouthOpen ? (
            <ellipse cx="200" cy="235" rx="18" ry="14" fill="#881337" stroke="#18181b" strokeWidth="4" />
          ) : (
            <path d="M 185 235 Q 200 245 215 235" stroke="#18181b" strokeWidth="5" fill="none" strokeLinecap="round" />
          )}
        </svg>

        {/* Name Tag Pill */}
        <div className="text-center mt-2">
          <span className="px-3 py-1 rounded-full text-white font-extrabold text-xs shadow-md" style={{ backgroundColor: humanMember.hoodieColor || '#ea580c' }}>
            {charAName}
          </span>
        </div>
      </div>

      {/* CHARACTER B: AI Avatar / Claude Bubble (Right Side) */}
      <div
        className={`absolute bottom-32 right-4 md:right-8 w-[340px] md:w-[420px] transition-all duration-200 z-10 ${
          isSpeakerB ? 'scale-105 brightness-110 drop-shadow-[0_10px_25px_rgba(6,182,212,0.4)]' : 'scale-95 opacity-70'
        }`}
      >
        <svg viewBox="0 0 400 500" className="w-full h-auto">
          {/* Hologram Base */}
          <ellipse cx="200" cy="460" rx="120" ry="25" fill="#083344" />
          <ellipse cx="200" cy="455" rx="100" ry="18" fill={aiMember.botAccentColor || '#06b6d4'} opacity="0.8" />

          {/* Glowing AI Bot Body */}
          <rect x="90" y="140" width="220" height="280" rx="110" fill={aiMember.avatarColor || '#f4f3f0'} stroke={aiMember.botAccentColor || '#06b6d4'} strokeWidth="8" />
          
          {/* Glass Face Shield */}
          <rect x="115" y="170" width="170" height="150" rx="75" fill="#18181b" />

          {/* Digital Eyes */}
          {isBlinking ? (
            <>
              <line x1="150" y1="230" x2="180" y2="230" stroke={aiMember.botAccentColor || '#06b6d4'} strokeWidth="6" strokeLinecap="round" />
              <line x1="220" y1="230" x2="250" y2="230" stroke={aiMember.botAccentColor || '#06b6d4'} strokeWidth="6" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="165" cy="230" r="16" fill={aiMember.botAccentColor || '#06b6d4'} />
              <circle cx="235" cy="230" r="16" fill={aiMember.botAccentColor || '#06b6d4'} />
              <circle cx="165" cy="230" r="8" fill="#ffffff" />
              <circle cx="235" cy="230" r="8" fill="#ffffff" />
            </>
          )}

          {/* Digital Mouth Display */}
          {isSpeakerB && isMouthOpen ? (
            <rect x="180" y="270" width="40" height="18" rx="9" fill={aiMember.botAccentColor || '#06b6d4'} />
          ) : (
            <line x1="185" y1="275" x2="215" y2="275" stroke={aiMember.botAccentColor || '#06b6d4'} strokeWidth="5" strokeLinecap="round" />
          )}

          {/* Antenna / AI Beacon */}
          <line x1="200" y1="140" x2="200" y2="90" stroke={aiMember.botAccentColor || '#06b6d4'} strokeWidth="8" strokeLinecap="round" />
          <circle cx="200" cy="80" r="16" fill="#f97316" className="animate-ping origin-center" />
          <circle cx="200" cy="80" r="14" fill="#f97316" />
        </svg>

        {/* Name Tag Pill */}
        <div className="text-center mt-2">
          <span className="px-3 py-1 rounded-full text-white font-extrabold text-xs shadow-md" style={{ backgroundColor: aiMember.botAccentColor || '#0891b2' }}>
            {charBName} (AI)
          </span>
        </div>
      </div>

      {/* Floating Comment Magnet Outro at End of Reel */}
      {currentTime > storyboard.durationSec - 2.5 && (
        <div className="absolute bottom-6 inset-x-4 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-3 rounded-2xl shadow-brutal text-center border-2 border-black">
            <span className="text-xs uppercase font-black tracking-widest block mb-0.5 opacity-90">
              Pertanyaan Viral
            </span>
            <p className="font-extrabold text-sm md:text-base">
              {storyboard.commentMagnetHook}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
