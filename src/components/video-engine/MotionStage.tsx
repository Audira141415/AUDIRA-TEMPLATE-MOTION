'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Storyboard, MotionFormat } from '@/types/motion';
import { WordByWordCaptions } from './WordByWordCaptions';
import { CharacterBanterTemplate } from './CharacterBanterTemplate';
import { WhiteboardTemplate } from './WhiteboardTemplate';
import { PixelRpgTemplate } from './PixelRpgTemplate';
import { BreakingNewsTemplate } from './BreakingNewsTemplate';
import { CleanExplainerTemplate } from './CleanExplainerTemplate';
import { DocuStoryTemplate } from './DocuStoryTemplate';
import { RobloxTemplate } from './RobloxTemplate';
import { EnginePreview } from './EnginePreview';
import { 
  Play, Pause, RotateCcw, ShieldCheck, Download, Volume2, VolumeX, 
  Gauge, Music, Smartphone, MonitorPlay, Sparkles, Heart, MessageCircle, 
  Bookmark, Share2 
} from 'lucide-react';
import { browserAudio, isAudioInteractionAllowed } from '@/lib/browser-audio';
import { bgmEngine, BGMTrack } from '@/lib/bgm-engine';

interface Props {
  storyboard: Storyboard;
  onExportClick?: () => void;
}

const NATIVE_TEMPLATES: MotionFormat[] = [
  'character_banter',
  'roblox_story',
  'whiteboard',
  'pixel_rpg',
  'breaking_news',
  'clean_explainer',
  'docu_story',
];

export const MotionStage: React.FC<Props> = ({ storyboard, onExportClick }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [showSafeZone, setShowSafeZone] = useState(false);
  const [showSocialOverlay, setShowSocialOverlay] = useState(false);
  const [frameMode, setFrameMode] = useState<'phone' | 'minimal'>('phone');
  const [engineMode, setEngineMode] = useState<'interactive' | 'gsap'>('interactive');
  const [isMuted, setIsMuted] = useState(false);
  const [bgmTrack, setBgmTrack] = useState<BGMTrack>('lofi_chill');
  const [showBgmMenu, setShowBgmMenu] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const duration = storyboard.durationSec || 13;
  const animRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const lastLineIdRef = useRef<string | null>(null);

  const hasNativeTemplate = NATIVE_TEMPLATES.includes(storyboard.format);

  // Sync BGM according to format default
  useEffect(() => {
    let defaultTrack: BGMTrack = 'lofi_chill';
    if (storyboard.format === 'pixel_rpg' || storyboard.format === 'roblox_story') defaultTrack = 'retro_arcade';
    else if (storyboard.format === 'breaking_news') defaultTrack = 'news_pulse';
    else if (storyboard.format === 'clean_explainer') defaultTrack = 'cyber_synth';

    setBgmTrack(defaultTrack);
    bgmEngine.setTrack(defaultTrack);
  }, [storyboard.format]);

  const handleUnlockAudio = async () => {
    const ok = await browserAudio.unlock();
    await bgmEngine.unlock();
    setAudioUnlocked(ok || isAudioInteractionAllowed());
    if (!isMuted && isPlaying && (ok || isAudioInteractionAllowed())) {
      bgmEngine.start();
    }
  };

  // Keyboard Shortcuts (Space, R, M, S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      handleUnlockAudio();
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        setCurrentTime(0);
        browserAudio.stopSpeech();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        setIsMuted((m) => {
          const next = !m;
          browserAudio.setMuted(next);
          bgmEngine.setMuted(next);
          return next;
        });
      } else if (e.code === 'KeyS') {
        e.preventDefault();
        setShowSafeZone((s) => !s);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleMute = async () => {
    await handleUnlockAudio();
    setIsMuted((prev) => {
      const next = !prev;
      browserAudio.setMuted(next);
      bgmEngine.setMuted(next);
      return next;
    });
  };

  const handleSelectBgm = async (t: BGMTrack) => {
    await handleUnlockAudio();
    setBgmTrack(t);
    bgmEngine.setTrack(t);
    setShowBgmMenu(false);
  };

  // Find active line based on current time
  const currentLine = storyboard.lines.find(
    (l) => currentTime >= l.startSec && currentTime < l.startSec + l.durationSec
  ) || null;

  // Audio Voiceover & SFX & BGM Auto-Ducking (Only triggers when user has allowed audio)
  useEffect(() => {
    if (!isPlaying || isMuted || !isAudioInteractionAllowed()) {
      browserAudio.stopSpeech();
      bgmEngine.stop();
      return;
    }

    // Start BGM if not already playing
    bgmEngine.start();

    if (currentLine && currentLine.id !== lastLineIdRef.current) {
      lastLineIdRef.current = currentLine.id;

      // Auto-duck BGM down during spoken line
      bgmEngine.duck();

      // Format-specific sound effects
      if (storyboard.format === 'pixel_rpg') {
        browserAudio.playChiptuneBlip();
      } else if (storyboard.format === 'roblox_story') {
        if (currentLine.emotion === 'shocked' || currentLine.emotion === 'angry') {
          browserAudio.playOofSound();
        } else {
          browserAudio.playRobloxChime();
        }
      } else if (storyboard.format === 'breaking_news') {
        browserAudio.playNewsAlert();
      } else if (storyboard.format === 'whiteboard') {
        browserAudio.playMarkerSqueak();
      } else {
        browserAudio.playPop();
      }

      // Voiceover Speech synthesis
      browserAudio.speakLine(currentLine.id, currentLine.text, currentLine.speakerRole);
    } else if (!currentLine) {
      // Restore BGM during pauses between dialogue
      bgmEngine.unduck();
    }
  }, [currentLine, isPlaying, isMuted, storyboard.format]);

  // Playback Loop
  useEffect(() => {
    if (!isPlaying) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      lastTimestampRef.current = null;
      browserAudio.stopSpeech();
      bgmEngine.stop();
      return;
    }

    const step = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }
      const deltaSec = ((timestamp - lastTimestampRef.current) / 1000) * speed;
      lastTimestampRef.current = timestamp;

      setCurrentTime((prev) => {
        const next = prev + deltaSec;
        if (next >= duration) {
          lastLineIdRef.current = null;
          return 0; // Loop seamlessly
        }
        return next;
      });

      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, duration, speed]);

  const renderActiveCanvas = () => {
    // If user explicitly chose GSAP mode or format doesn't have a custom React component,
    // render the exact 1080x1920 GSAP timeline iframe
    if (!hasNativeTemplate || engineMode === 'gsap') {
      return <EnginePreview storyboard={storyboard} currentTime={currentTime} />;
    }

    switch (storyboard.format) {
      case 'character_banter':
        return <CharacterBanterTemplate storyboard={storyboard} currentTime={currentTime} currentLine={currentLine} />;
      case 'roblox_story':
        return <RobloxTemplate storyboard={storyboard} currentTime={currentTime} currentLine={currentLine} />;
      case 'whiteboard':
        return <WhiteboardTemplate storyboard={storyboard} currentTime={currentTime} currentLine={currentLine} />;
      case 'pixel_rpg':
        return <PixelRpgTemplate storyboard={storyboard} currentTime={currentTime} currentLine={currentLine} />;
      case 'breaking_news':
        return <BreakingNewsTemplate storyboard={storyboard} currentTime={currentTime} currentLine={currentLine} />;
      case 'clean_explainer':
        return <CleanExplainerTemplate storyboard={storyboard} currentTime={currentTime} currentLine={currentLine} />;
      case 'docu_story':
        return <DocuStoryTemplate storyboard={storyboard} currentTime={currentTime} currentLine={currentLine} />;
      default:
        return <EnginePreview storyboard={storyboard} currentTime={currentTime} />;
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[390px] mx-auto select-none">
      {/* TOP CANVAS CONTROL BAR */}
      <div className="w-full flex items-center justify-between pb-3 text-xs">
        <div className="flex items-center gap-1.5">
          {/* Mode Switcher: Interactive vs GSAP Engine */}
          <div className="flex items-center p-1 rounded-xl bg-zinc-900 border border-zinc-800">
            <button
              type="button"
              onClick={() => {
                handleUnlockAudio();
                setEngineMode('interactive');
              }}
              className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all flex items-center gap-1 ${
                engineMode === 'interactive' && hasNativeTemplate
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Mode Interaktif (DOM, Blinking & Voiceover)"
            >
              <Sparkles className="w-3 h-3" />
              <span>Studio</span>
            </button>
            <button
              type="button"
              onClick={() => {
                handleUnlockAudio();
                setEngineMode('gsap');
              }}
              className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all flex items-center gap-1 ${
                engineMode === 'gsap' || !hasNativeTemplate
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Mode Mesin Render GSAP (Output Persis MP4)"
            >
              <MonitorPlay className="w-3 h-3" />
              <span>GSAP 1080p</span>
            </button>
          </div>
        </div>

        {/* Viewport & Overlay Toggles */}
        <div className="flex items-center gap-1">
          {/* Phone Frame vs Minimal Frame */}
          <button
            type="button"
            onClick={() => setFrameMode(frameMode === 'phone' ? 'minimal' : 'phone')}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              frameMode === 'phone'
                ? 'bg-zinc-800 border-zinc-600 text-white'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
            title={frameMode === 'phone' ? 'Beralih ke Borderless' : 'Beralih ke Mockup HP'}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>

          {/* Social Mockup (TikTok/Reels UI) */}
          <button
            type="button"
            onClick={() => setShowSocialOverlay(!showSocialOverlay)}
            className={`px-2 py-1 rounded-lg border text-[10px] font-bold transition-colors ${
              showSocialOverlay
                ? 'bg-cyan-600 text-white border-cyan-500'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
            title="Simulasi UI TikTok/Reels"
          >
            TikTok UI
          </button>

          {/* Safe Area Guide */}
          <button
            type="button"
            onClick={() => setShowSafeZone(!showSafeZone)}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              showSafeZone
                ? 'bg-red-600 text-white border-red-500'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
            title="Safe Zone 9:16 (S)"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 9:16 VERTICAL VIDEO PLAYER CONTAINER */}
      <div 
        onClick={handleUnlockAudio}
        className={`relative w-full aspect-[9/16] bg-black overflow-hidden transition-all duration-300 cursor-pointer ${
          frameMode === 'phone'
            ? 'rounded-[44px] border-[10px] border-[#202022] ring-1 ring-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.95)]'
            : 'rounded-3xl border-4 border-zinc-800 shadow-2xl'
        }`}
      >
        {/* Phone Dynamic Island Notch */}
        {frameMode === 'phone' && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-50 flex items-center justify-between px-2.5 pointer-events-none shadow-md">
            <div className="w-2 h-2 rounded-full bg-[#111] ring-1 ring-white/10" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
          </div>
        )}

        {/* Rendered Motion Template */}
        {renderActiveCanvas()}

        {/* Word-By-Word Subtitles Overlay (for native interactive templates) */}
        {engineMode === 'interactive' && hasNativeTemplate && storyboard.format !== 'roblox_story' && (
          <WordByWordCaptions
            currentLine={currentLine}
            currentTime={currentTime}
            highlightColor={
              storyboard.format === 'pixel_rpg'
                ? '#10b981'
                : storyboard.format === 'breaking_news'
                ? '#facc15'
                : '#ff7849'
            }
          />
        )}

        {/* Social Media 9:16 Safe Zone Overlay (Toggleable) */}
        {showSafeZone && (
          <div className="absolute inset-0 pointer-events-none z-50 border-2 border-dashed border-red-500/60 flex flex-col justify-between p-6">
            <div className="bg-red-500/25 text-red-200 text-[9px] font-mono px-2 py-0.5 rounded self-center backdrop-blur-sm border border-red-500/40">
              TOP SAFE ZONE (HEADER / SEARCH)
            </div>
            <div className="border border-green-500/40 h-[65%] w-full flex items-center justify-center">
              <span className="text-green-400/40 text-[10px] font-mono">ACTION SAFE AREA 90%</span>
            </div>
            <div className="bg-red-500/25 text-red-200 text-[9px] font-mono px-2 py-0.5 rounded self-center backdrop-blur-sm border border-red-500/40">
              BOTTOM SAFE ZONE (CAPTION / LIKE / TABS)
            </div>
          </div>
        )}

        {/* Social Media UI Mockup (TikTok/Instagram Reels Mock) */}
        {showSocialOverlay && (
          <div className="absolute inset-0 pointer-events-none z-40 flex flex-col justify-between p-4 bg-gradient-to-b from-black/30 via-transparent to-black/60">
            {/* Top Tabs */}
            <div className="flex justify-center items-center gap-3 pt-4 text-xs font-bold text-white drop-shadow">
              <span className="text-white/60 text-[11px]">Mengikuti</span>
              <span className="border-b-2 border-white pb-0.5 text-xs">Untuk Anda</span>
            </div>

            {/* Right Action Icons Bar */}
            <div className="flex justify-between items-end pb-3">
              <div className="max-w-[70%] text-white text-xs drop-shadow flex flex-col gap-1">
                <span className="font-extrabold text-[12px]">@audira.motion</span>
                <p className="text-[11px] text-white/90 line-clamp-2 leading-snug">
                  {storyboard.title} #motion #reels #ai
                </p>
                <span className="text-[10px] text-white/70 font-mono">♫ Suara Asli - AUDIRA Studio</span>
              </div>

              <div className="flex flex-col items-center gap-3 text-white">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 border-2 border-white flex items-center justify-center font-black text-xs text-black">
                  A
                </div>
                <div className="flex flex-col items-center">
                  <Heart className="w-6 h-6 fill-red-500 text-red-500 drop-shadow" />
                  <span className="text-[9px] font-bold">248K</span>
                </div>
                <div className="flex flex-col items-center">
                  <MessageCircle className="w-6 h-6 fill-white text-white drop-shadow" />
                  <span className="text-[9px] font-bold">1.4K</span>
                </div>
                <div className="flex flex-col items-center">
                  <Bookmark className="w-6 h-6 fill-yellow-400 text-yellow-400 drop-shadow" />
                  <span className="text-[9px] font-bold">38K</span>
                </div>
                <div className="flex flex-col items-center">
                  <Share2 className="w-6 h-6 text-white drop-shadow" />
                  <span className="text-[9px] font-bold">12K</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Phone Bottom Home Indicator */}
        {frameMode === 'phone' && (
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/40 rounded-full z-50 pointer-events-none" />
        )}
      </div>

      {/* TIMELINE SCRUBBER & DOCK CONTROLS */}
      <div className="w-full mt-4 bg-zinc-900/90 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl border-2 border-zinc-800 shadow-brutal flex flex-col gap-2.5">
        {/* Progress Bar Scrubber */}
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-mono font-bold text-zinc-400 w-10 text-right">
            {currentTime.toFixed(1)}s
          </span>
          <input
            type="range"
            min={0}
            max={duration}
            step={0.05}
            value={currentTime}
            onChange={(e) => {
              handleUnlockAudio();
              setCurrentTime(parseFloat(e.target.value));
              if (isPlaying) setIsPlaying(false);
              browserAudio.stopSpeech();
            }}
            className="flex-1 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-600 focus:outline-none"
          />
          <span className="text-[11px] font-mono font-bold text-zinc-400 w-10">
            {duration.toFixed(1)}s
          </span>
        </div>

        {/* Control Buttons & Audio Visualizer */}
        <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            {/* Play/Pause */}
            <button
              onClick={() => {
                handleUnlockAudio();
                setIsPlaying(!isPlaying);
              }}
              className="p-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black shadow-brutal-sm transition-transform active:translate-y-0.5"
              title="Play/Pause (Space)"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            {/* Replay */}
            <button
              onClick={() => {
                handleUnlockAudio();
                setCurrentTime(0);
                lastLineIdRef.current = null;
                browserAudio.stopSpeech();
              }}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
              title="Replay dari awal (R)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Audio Voiceover Toggle */}
            <button
              onClick={toggleMute}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-colors ${
                !isMuted
                  ? 'bg-orange-600/20 border-orange-500/50 text-orange-400'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-500'
              }`}
              title="Suara Voiceover & SFX (M)"
            >
              {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-orange-400" />}
              <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Audio'}</span>
            </button>

            {/* BGM Track Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  handleUnlockAudio();
                  setShowBgmMenu(!showBgmMenu);
                }}
                className="px-2 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-[11px] font-bold flex items-center gap-1 transition-colors"
                title="Pilih Musik Latar (BGM)"
              >
                <Music className="w-3 h-3 text-cyan-400" />
                <span className="text-cyan-400 uppercase text-[9px] font-mono truncate max-w-[50px]">
                  {bgmTrack === 'none' ? 'OFF' : bgmTrack.split('_')[0]}
                </span>
              </button>

              {showBgmMenu && (
                <div className="absolute bottom-full mb-2 left-0 w-44 bg-[#141413] border-2 border-zinc-800 rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1 text-xs">
                  <div className="text-[10px] font-black uppercase text-zinc-500 px-2 py-1">
                    Pilih Musik Latar:
                  </div>
                  {[
                    { id: 'retro_arcade', label: '👾 Roblox 8-bit Beat' },
                    { id: 'lofi_chill', label: '☕ Lofi Chill Beat' },
                    { id: 'news_pulse', label: '🚨 News Pulse' },
                    { id: 'cyber_synth', label: '⚡ Cyber Synth' },
                    { id: 'none', label: '🔇 Tanpa BGM' },
                  ].map((track) => (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => handleSelectBgm(track.id as BGMTrack)}
                      className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        bgmTrack === track.id ? 'bg-cyan-600 text-white font-bold' : 'text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      {track.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Speed Toggle */}
            <button
              onClick={() => setSpeed(speed === 1 ? 1.25 : speed === 1.25 ? 1.5 : 1)}
              className="px-2 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-[10px] font-mono font-bold flex items-center gap-1"
              title="Kecepatan Video"
            >
              <Gauge className="w-3 h-3" />
              {speed}x
            </button>
          </div>

          {/* Export MP4 Button */}
          <button
            onClick={onExportClick}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs shadow-brutal-sm flex items-center gap-1.5 border border-black transition-transform active:translate-y-0.5 ml-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>

        {/* Shortcuts & Auto-Ducking Indicator */}
        <div className="flex items-center justify-between text-[9px] text-zinc-500 font-mono pt-1 border-t border-zinc-800/80">
          <span>[Space] Play • [R] Reset • [M] Mute</span>
          {!isMuted && isPlaying && (
            <span className="text-orange-400 flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
              Auto-Ducking Active
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
