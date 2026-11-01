'use client';

import React from 'react';
import { Storyboard, StoryboardLine } from '@/types/motion';
import { HUMAN_CAST, AI_CAST, SCENE_LOCATIONS } from '@/lib/cast-catalog';
import { ModularCharacter } from './ModularCharacter';

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
    ? 'origin-bottom-left scale-[1.03]' 
    : isSpeakerB 
    ? 'origin-bottom-right scale-[1.03]' 
    : 'scale-100';

  return (
    <div className={`relative w-full h-full bg-[#141413] text-white overflow-hidden transition-transform duration-300 ${zoomClass}`}>
      {/* Background Vector Graphic */}
      <div className="absolute inset-0 z-0">
        <svg viewBox="0 0 1080 1920" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={location.wallColor || '#1e1b4b'} />
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
          <g transform="translate(340, 160)" filter="url(#glow)">
            <rect x="0" y="0" width="400" height="85" rx="42" fill="none" stroke={location.accentColor || '#ea580c'} strokeWidth="4" />
            <text x="200" y="55" fill="#ffe9df" textAnchor="middle" fontSize="30" fontWeight="900" letterSpacing="3">
              {location.neonText || 'WARUNG KOPI 24 JAM'}
            </text>
          </g>

          {/* Window & Neon City Skyline */}
          <rect x="140" y="280" width="800" height="520" rx="16" fill="#080a14" stroke="#27272a" strokeWidth="6" />
          <rect x="180" y="520" width="70" height="280" fill="#18181b" />
          <rect x="270" y="440" width="90" height="360" fill="#27272a" />
          <rect x="380" y="560" width="80" height="240" fill="#18181b" />
          <rect x="480" y="400" width="100" height="400" fill="#27272a" />
          <rect x="600" y="520" width="90" height="280" fill="#18181b" />
          <rect x="710" y="460" width="110" height="340" fill="#27272a" />

          {/* Table Surface */}
          <path d="M 0 1480 L 1080 1480 L 1080 1920 L 0 1920 Z" fill="#18181b" stroke="#3f3f46" strokeWidth="8" />
          <ellipse cx="540" cy="1560" rx="90" ry="24" fill="#09090b" opacity="0.6" />
          <rect x="490" y="1500" width="100" height="70" rx="12" fill="#f4f3f0" />
          <path d="M 590 1515 C 615 1515 615 1545 590 1545" fill="none" stroke="#f4f3f0" strokeWidth="8" />
        </svg>
      </div>

      {/* Location Badge Top */}
      <div className="absolute top-12 inset-x-0 flex justify-center z-20 pointer-events-none">
        <div className="px-3.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[11px] font-semibold tracking-wider text-zinc-300 flex items-center gap-1.5 shadow-lg">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: location.accentColor || '#ea580c' }}></span>
          <span className="truncate max-w-[200px]">{storyboard.locationName || 'Studio'}</span>
        </div>
      </div>

      {/* Floating Custom Evidence / B-Roll Screen if attached */}
      {storyboard.visualLayout?.customMediaUrl && (
        <div className="absolute top-24 inset-x-6 z-20 flex flex-col items-center animate-in fade-in zoom-in-95 pointer-events-none">
          <div className="w-full max-w-[280px] rounded-2xl overflow-hidden border-2 border-cyan-400 bg-black/90 shadow-[4px_4px_0px_0px_#06b6d4]">
            <div className="bg-cyan-950/90 px-3 py-1 text-[9px] font-mono text-cyan-300 font-black border-b border-cyan-800 flex items-center justify-between">
              <span>BUKTI: {storyboard.visualLayout.customMediaLabel || 'DOKUMEN A1'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <img
              src={storyboard.visualLayout.customMediaUrl}
              alt="Bukti Visual"
              className="w-full max-h-[140px] object-cover"
            />
          </div>
        </div>
      )}

      {/* CHARACTER A (Left Side - Modular Multi-Archetype) */}
      <div className="absolute bottom-20 left-2 sm:left-4 w-[46%] max-w-[190px]">
        <ModularCharacter
          archetype={humanMember.archetype || 'vector_expressive'}
          name={charAName}
          title={humanMember.title}
          isSpeaking={isSpeakerA}
          isMouthOpen={isMouthOpen}
          isBlinking={isBlinking}
          emotion={currentLine?.emotion}
          primaryColor={humanMember.hoodieColor || '#c2410c'}
          accentColor={humanMember.avatarColor || '#ffe4e6'}
          side="left"
        />
      </div>

      {/* CHARACTER B (Right Side - Modular Multi-Archetype) */}
      <div className="absolute bottom-20 right-2 sm:right-4 w-[46%] max-w-[190px]">
        <ModularCharacter
          archetype={aiMember.archetype || 'cyber_hologram'}
          name={charBName}
          title={aiMember.title}
          isSpeaking={isSpeakerB}
          isMouthOpen={isMouthOpen}
          isBlinking={isBlinking}
          emotion={currentLine?.emotion}
          primaryColor={aiMember.botAccentColor || '#0891b2'}
          accentColor={aiMember.avatarColor || '#f4f3f0'}
          side="right"
        />
      </div>

      {/* Floating Comment Magnet Outro at End of Reel */}
      {currentTime > (storyboard.durationSec || 13) - 2.8 && (
        <div className="absolute bottom-6 inset-x-3 sm:inset-x-6 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-3 rounded-2xl shadow-brutal text-center border-2 border-black">
            <span className="text-[10px] uppercase font-black tracking-widest block mb-0.5 opacity-90">
              Pertanyaan Viral
            </span>
            <p className="font-extrabold text-xs sm:text-sm line-clamp-2">
              {storyboard.commentMagnetHook}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
