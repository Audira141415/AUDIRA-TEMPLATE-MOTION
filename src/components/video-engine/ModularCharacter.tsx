'use client';

import React from 'react';
import { CharacterArchetype, SpeakerEmotion } from '@/types/motion';

interface ModularCharacterProps {
  archetype?: CharacterArchetype;
  name: string;
  title?: string;
  isSpeaking: boolean;
  isMouthOpen: boolean;
  isBlinking: boolean;
  emotion?: SpeakerEmotion;
  primaryColor?: string;
  accentColor?: string;
  side?: 'left' | 'right' | 'center';
  levelBadge?: string;
}

export const ModularCharacter: React.FC<ModularCharacterProps> = ({
  archetype = 'vector_expressive',
  name,
  title,
  isSpeaking,
  isMouthOpen,
  isBlinking,
  emotion = 'neutral',
  primaryColor,
  accentColor,
  side = 'left',
  levelBadge,
}) => {
  const isLeft = side === 'left';
  const defaultPrimary = primaryColor || (isLeft ? '#ea580c' : '#0891b2');
  const defaultAccent = accentColor || (isLeft ? '#ffedd5' : '#cffafe');

  // Reactivity to speaking
  const activeTransform = isSpeaking
    ? 'scale-105 brightness-110 drop-shadow-[0_12px_28px_rgba(0,0,0,0.6)] z-20'
    : 'scale-95 opacity-70 z-10';

  // 1. ROBLOX BLOCKY ARCHETYPE
  if (archetype === 'roblox_blocky') {
    const isPro = name.toLowerCase().includes('pro') || name.toLowerCase().includes('bacon');
    const headColor = isPro ? '#f5d0a9' : '#ffd900';
    const shirtColor = isPro ? '#111827' : '#0055bf';
    const pantsColor = isPro ? '#374151' : '#00a850';

    return (
      <div className={`flex flex-col items-center transition-all duration-200 ${activeTransform}`}>
        <svg viewBox="0 0 300 400" className="w-full h-auto drop-shadow-[0_6px_12px_rgba(0,0,0,0.4)]">
          {/* Pro Bacon Hair */}
          {isPro && (
            <g transform="translate(110, 32)">
              <rect x="0" y="0" width="80" height="24" rx="6" fill="#633b1e" stroke="#000" strokeWidth="4" />
              <rect x="10" y="-8" width="20" height="18" rx="4" fill="#824f2b" stroke="#000" strokeWidth="3" />
              <rect x="35" y="-12" width="25" height="22" rx="4" fill="#9c5f34" stroke="#000" strokeWidth="3" />
              <rect x="65" y="-8" width="16" height="18" rx="4" fill="#824f2b" stroke="#000" strokeWidth="3" />
            </g>
          )}

          {/* Blocky Head */}
          <rect
            x="110"
            y={isPro ? "50" : "40"}
            width="80"
            height="80"
            rx="12"
            fill={headColor}
            stroke="#000"
            strokeWidth="6"
          />

          {/* Eyes & Shades */}
          {isPro ? (
            <g transform="translate(122, 75)">
              <rect x="0" y="0" width="56" height="18" rx="4" fill="#000" stroke="#475569" strokeWidth="2" />
              <rect x="6" y="4" width="10" height="4" fill="#06b6d4" rx="2" />
              <rect x="40" y="4" width="10" height="4" fill="#06b6d4" rx="2" />
            </g>
          ) : (
            <g transform="translate(126, 70)">
              {isBlinking ? (
                <>
                  <line x1="4" y1="12" x2="18" y2="12" stroke="#000" strokeWidth="4" strokeLinecap="round" />
                  <line x1="30" y1="12" x2="44" y2="12" stroke="#000" strokeWidth="4" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <circle cx="10" cy="10" r="6" fill="#000" />
                  <circle cx="38" cy="10" r="6" fill="#000" />
                  <circle cx="12" cy="8" r="2" fill="#fff" />
                  <circle cx="40" cy="8" r="2" fill="#fff" />
                </>
              )}
            </g>
          )}

          {/* Blocky Mouth */}
          {isSpeaking && isMouthOpen ? (
            <ellipse cx="150" cy="104" rx="10" ry="7" fill="#7a1212" stroke="#000" strokeWidth="3" />
          ) : (
            <line x1="140" y1="104" x2="160" y2="104" stroke="#000" strokeWidth="4" strokeLinecap="round" />
          )}

          {/* Blocky Torso & Arms */}
          <g transform="translate(75, 120)">
            {/* Left Arm */}
            <rect
              x="0"
              y="6"
              width="30"
              height="100"
              rx="4"
              fill={headColor}
              stroke="#000"
              strokeWidth="5"
              transform={isSpeaking ? "rotate(12 15 10)" : "rotate(0)"}
            />
            {/* Torso */}
            <rect x="35" y="0" width="80" height="110" rx="4" fill={shirtColor} stroke="#000" strokeWidth="6" />
            {isPro ? (
              <g transform="translate(63, 30)">
                <circle cx="12" cy="12" r="14" fill="#dc2626" stroke="#000" strokeWidth="2" />
                <text x="12" y="17" fill="#fff" fontSize="14" fontWeight="900" textAnchor="middle">★</text>
              </g>
            ) : (
              <text x="75" y="65" fill="#fff" fontSize="36" fontWeight="900" textAnchor="middle" stroke="#000" strokeWidth="2">
                R
              </text>
            )}
            {/* Right Arm */}
            <rect
              x="120"
              y="6"
              width="30"
              height="100"
              rx="4"
              fill={headColor}
              stroke="#000"
              strokeWidth="5"
              transform={isSpeaking ? "rotate(-12 135 10)" : "rotate(0)"}
            />
          </g>

          {/* Blocky Legs */}
          <g transform="translate(110, 230)">
            <rect x="0" y="0" width="38" height="120" rx="2" fill={pantsColor} stroke="#000" strokeWidth="6" />
            <rect x="42" y="0" width="38" height="120" rx="2" fill={pantsColor} stroke="#000" strokeWidth="6" />
          </g>
        </svg>

        {/* Name Tag Pill */}
        <div className="mt-1 text-center">
          <span
            className="px-2.5 py-0.5 rounded-full text-white font-extrabold text-[10px] shadow-md border border-black/40 inline-flex items-center gap-1"
            style={{ backgroundColor: shirtColor }}
          >
            <span>{name}</span>
            <span className="text-yellow-300 font-mono text-[9px]">{levelBadge || (isPro ? '[PRO]' : '[LV.1]')}</span>
          </span>
        </div>
      </div>
    );
  }

  // 2. LOW-POLY HUMANOID ARCHETYPE (What-If / Scientific simulation)
  if (archetype === 'lowpoly_humanoid') {
    return (
      <div className={`flex flex-col items-center transition-all duration-200 ${activeTransform}`}>
        <svg viewBox="0 0 300 400" className="w-full h-auto">
          {/* Shaded Low-Poly Body */}
          <polygon points="100,380 90,200 150,180 150,380" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
          <polygon points="150,380 150,180 210,200 200,380" fill="#0369a1" stroke="#075985" strokeWidth="2" />

          {/* Arms with faceted angle */}
          <polygon points="90,200 50,280 70,300 100,220" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
          <polygon points="210,200 250,280 230,300 200,220" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />

          {/* Neck */}
          <polygon points="135,185 165,185 160,150 140,150" fill="#fed7aa" />

          {/* Faceted Geometric Head */}
          <polygon points="110,90 150,50 190,90 175,150 125,150" fill="#fed7aa" stroke="#fba76a" strokeWidth="2" />
          <polygon points="150,50 190,90 175,150 150,150" fill="#fba76a" opacity="0.4" />

          {/* Stylized Geometric Glasses / Scientific Visor */}
          <polygon points="115,95 145,95 145,115 120,115" fill="#14b8a6" stroke="#0f766e" strokeWidth="3" />
          <polygon points="155,95 185,95 180,115 155,115" fill="#14b8a6" stroke="#0f766e" strokeWidth="3" />
          <line x1="145" y1="105" x2="155" y2="105" stroke="#0f766e" strokeWidth="3" />

          {/* Scientific Lab Stethoscope / ID Card */}
          <rect x="135" y="220" width="30" height="42" rx="4" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
          <rect x="140" y="225" width="20" height="6" fill="#0284c7" />

          {/* Low-Poly Speaking Mouth */}
          {isSpeaking && isMouthOpen ? (
            <polygon points="140,130 160,130 155,142 145,142" fill="#78350f" />
          ) : (
            <line x1="142" y1="134" x2="158" y2="134" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
          )}
        </svg>

        {/* Badge */}
        <div className="mt-1 text-center">
          <span className="px-2.5 py-0.5 rounded-full text-white font-extrabold text-[10px] shadow-md border border-sky-400/50 bg-sky-900/90 inline-flex items-center gap-1">
            <span>{name}</span>
            <span className="text-teal-300 font-mono text-[9px]">{levelBadge || '[SIM-3D]'}</span>
          </span>
        </div>
      </div>
    );
  }

  // 3. CYBERNETIC HOLOGRAM / AI BOT ARCHETYPE
  if (archetype === 'cyber_hologram') {
    return (
      <div className={`flex flex-col items-center transition-all duration-200 ${activeTransform}`}>
        <svg viewBox="0 0 300 400" className="w-full h-auto">
          {/* Hologram Base Beam */}
          <ellipse cx="150" cy="370" rx="90" ry="18" fill="#083344" />
          <ellipse cx="150" cy="365" rx="75" ry="12" fill={defaultAccent} opacity="0.8" />
          <polygon points="90,365 210,365 180,240 120,240" fill={defaultAccent} opacity="0.1" />

          {/* Floating AI Robot Body */}
          <rect
            x="75"
            y="110"
            width="150"
            height="180"
            rx="75"
            fill="#090d16"
            stroke={defaultAccent}
            strokeWidth="6"
          />

          {/* Visor Display Screen */}
          <rect x="90" y="130" width="120" height="95" rx="48" fill="#04060a" stroke="#1e293b" strokeWidth="3" />

          {/* Digital LED Eyes */}
          {isBlinking ? (
            <g>
              <line x1="110" y1="170" x2="135" y2="170" stroke={defaultAccent} strokeWidth="5" strokeLinecap="round" />
              <line x1="165" y1="170" x2="190" y2="170" stroke={defaultAccent} strokeWidth="5" strokeLinecap="round" />
            </g>
          ) : (
            <g>
              <circle cx="122" cy="170" r="12" fill={defaultAccent} />
              <circle cx="178" cy="170" r="12" fill={defaultAccent} />
              <circle cx="122" cy="170" r="6" fill="#fff" />
              <circle cx="178" cy="170" r="6" fill="#fff" />
            </g>
          )}

          {/* Digital Soundwave Mouth Equalizer */}
          {isSpeaking && isMouthOpen ? (
            <g transform="translate(125, 195)">
              <rect x="0" y="2" width="6" height="14" rx="3" fill={defaultAccent} />
              <rect x="10" y="0" width="6" height="18" rx="3" fill={defaultAccent} />
              <rect x="20" y="0" width="6" height="18" rx="3" fill={defaultAccent} />
              <rect x="30" y="2" width="6" height="14" rx="3" fill={defaultAccent} />
              <rect x="40" y="5" width="6" height="8" rx="3" fill={defaultAccent} />
            </g>
          ) : (
            <line x1="130" y1="202" x2="170" y2="202" stroke={defaultAccent} strokeWidth="4" strokeLinecap="round" />
          )}

          {/* Antenna Beacon */}
          <line x1="150" y1="110" x2="150" y2="65" stroke={defaultAccent} strokeWidth="6" strokeLinecap="round" />
          <circle cx="150" cy="55" r="12" fill="#ea580c" className="animate-ping origin-center" />
          <circle cx="150" cy="55" r="10" fill="#ea580c" />
        </svg>

        {/* Badge */}
        <div className="mt-1 text-center">
          <span
            className="px-2.5 py-0.5 rounded-full text-white font-extrabold text-[10px] shadow-md border border-cyan-400/50 inline-flex items-center gap-1"
            style={{ backgroundColor: defaultPrimary }}
          >
            <span>{name}</span>
            <span className="text-cyan-300 font-mono text-[9px]">{levelBadge || '[AI]'}</span>
          </span>
        </div>
      </div>
    );
  }

  // 4. TACTICAL SURVIVOR ARCHETYPE (Zombie Survival / Military Operator)
  if (archetype === 'tactical_survivor') {
    return (
      <div className={`flex flex-col items-center transition-all duration-200 ${activeTransform}`}>
        <svg viewBox="0 0 300 400" className="w-full h-auto">
          {/* Tactical Radar Ring Underfoot */}
          <ellipse cx="150" cy="370" rx="80" ry="18" fill="#14532d" opacity="0.7" />
          <ellipse cx="150" cy="370" rx="65" ry="12" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="6 4" />

          {/* Tactical Armor Body */}
          <path d="M 70 380 L 60 220 L 150 190 L 240 220 L 230 380 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="5" />
          {/* Tactical Vest Pouches */}
          <rect x="95" y="240" width="45" height="35" rx="4" fill="#334155" stroke="#0f172a" strokeWidth="3" />
          <rect x="160" y="240" width="45" height="35" rx="4" fill="#334155" stroke="#0f172a" strokeWidth="3" />
          <rect x="120" y="290" width="60" height="35" rx="4" fill="#334155" stroke="#0f172a" strokeWidth="3" />

          {/* Neck & Balaclava */}
          <rect x="135" y="160" width="30" height="35" rx="4" fill="#0f172a" />

          {/* Ballistic Helmet & Face */}
          <ellipse cx="150" cy="120" rx="60" ry="55" fill="#15803d" stroke="#0f172a" strokeWidth="5" />
          <rect x="100" y="105" width="100" height="35" rx="8" fill="#0f172a" />

          {/* Night Vision Goggles / Visor Lens */}
          <rect x="110" y="112" width="36" height="20" rx="4" fill="#22c55e" stroke="#14532d" strokeWidth="3" />
          <rect x="154" y="112" width="36" height="20" rx="4" fill="#22c55e" stroke="#14532d" strokeWidth="3" />
          <circle cx="128" cy="122" r="4" fill="#fff" />
          <circle cx="172" cy="122" r="4" fill="#fff" />

          {/* Comm Radio Antenna */}
          <line x1="190" y1="100" x2="215" y2="40" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />
          <circle cx="215" cy="40" r="5" fill="#ef4444" />

          {/* Mouth / Filter Mask */}
          {isSpeaking && isMouthOpen ? (
            <ellipse cx="150" cy="155" rx="14" ry="8" fill="#ef4444" opacity="0.8" />
          ) : (
            <line x1="140" y1="155" x2="160" y2="155" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
          )}
        </svg>

        {/* Badge */}
        <div className="mt-1 text-center">
          <span className="px-2.5 py-0.5 rounded-full text-white font-extrabold text-[10px] shadow-md border border-emerald-500/50 bg-emerald-950 inline-flex items-center gap-1">
            <span>{name}</span>
            <span className="text-emerald-400 font-mono text-[9px]">{levelBadge || '[GUARD]'}</span>
          </span>
        </div>
      </div>
    );
  }

  // 5. VECTOR EXPRESSIVE ARCHETYPE (Default Neo-Brutalist cartoon human)
  return (
    <div className={`flex flex-col items-center transition-all duration-200 ${activeTransform}`}>
      <svg viewBox="0 0 300 400" className="w-full h-auto">
        {/* Hoodie / Body */}
        <path
          d="M 60 400 C 60 260 90 220 150 220 C 210 220 240 260 240 400 Z"
          fill={defaultPrimary}
          stroke="#000"
          strokeWidth="6"
        />

        {/* Neck */}
        <rect x="135" y="195" width="30" height="30" fill="#fed7aa" rx="6" />

        {/* Head */}
        <ellipse cx="150" cy="135" rx="65" ry="70" fill={defaultAccent} stroke="#000" strokeWidth="5" />

        {/* Hair Style */}
        <path
          d="M 75 120 C 75 50 225 50 225 120 C 210 95 180 90 150 90 C 120 90 90 95 75 120 Z"
          fill="#18181b"
          stroke="#000"
          strokeWidth="5"
        />

        {/* Eyebrows based on emotion */}
        <g stroke="#18181b" strokeWidth="4" strokeLinecap="round">
          {emotion === 'angry' ? (
            <>
              <line x1="110" y1="108" x2="135" y2="116" />
              <line x1="165" y1="116" x2="190" y2="108" />
            </>
          ) : emotion === 'shocked' ? (
            <>
              <line x1="110" y1="104" x2="135" y2="102" />
              <line x1="165" y1="102" x2="190" y2="104" />
            </>
          ) : (
            <>
              <line x1="110" y1="110" x2="135" y2="108" />
              <line x1="165" y1="108" x2="190" y2="110" />
            </>
          )}
        </g>

        {/* Animated Eyes */}
        {isBlinking ? (
          <g stroke="#18181b" strokeWidth="4" strokeLinecap="round">
            <line x1="112" y1="130" x2="136" y2="130" />
            <line x1="164" y1="130" x2="188" y2="130" />
          </g>
        ) : (
          <g>
            <ellipse cx="124" cy="130" rx="9" ry="11" fill="#18181b" />
            <ellipse cx="176" cy="130" rx="9" ry="11" fill="#18181b" />
            <circle cx="126" cy="127" r="3.5" fill="#ffffff" />
            <circle cx="178" cy="127" r="3.5" fill="#ffffff" />
          </g>
        )}

        {/* Animated Talking Mouth */}
        {isSpeaking && isMouthOpen ? (
          <ellipse cx="150" cy="168" rx="14" ry="11" fill="#881337" stroke="#18181b" strokeWidth="3" />
        ) : (
          <path d="M 138 168 Q 150 176 162 168" stroke="#18181b" strokeWidth="4" fill="none" strokeLinecap="round" />
        )}
      </svg>

      {/* Name Tag Pill */}
      <div className="mt-1 text-center">
        <span
          className="px-2.5 py-0.5 rounded-full text-white font-extrabold text-[10px] shadow-md border border-black/30 inline-flex items-center gap-1"
          style={{ backgroundColor: defaultPrimary }}
        >
          <span>{name}</span>
          {title && <span className="opacity-80 text-[8px] font-normal truncate max-w-[80px]">({title})</span>}
        </span>
      </div>
    </div>
  );
};

