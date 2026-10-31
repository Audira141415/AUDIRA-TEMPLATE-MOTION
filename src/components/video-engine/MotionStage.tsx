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
import { Play, Pause, RotateCcw, ShieldCheck, Download, Volume2, VolumeX, Gauge, Music } from 'lucide-react';
import { browserAudio } from '@/lib/browser-audio';
import { bgmEngine, BGMTrack } from '@/lib/bgm-engine';

interface Props {
  storyboard: Storyboard;
  onExportClick?: () => void;
}

export const MotionStage: React.FC<Props> = ({ storyboard, onExportClick }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [showSafeZone, setShowSafeZone] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [bgmTrack, setBgmTrack] = useState<BGMTrack>('lofi_chill');
  const [showBgmMenu, setShowBgmMenu] = useState(false);

  const duration = storyboard.durationSec || 13;
  const animRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const lastLineIdRef = useRef<string | null>(null);

  // Sync BGM according to format default
  useEffect(() => {
    let defaultTrack: BGMTrack = 'lofi_chill';
    if (storyboard.format === 'pixel_rpg' || storyboard.format === 'roblox_story') defaultTrack = 'retro_arcade';
    else if (storyboard.format === 'breaking_news') defaultTrack = 'news_pulse';
    else if (storyboard.format === 'clean_explainer') defaultTrack = 'cyber_synth';

    setBgmTrack(defaultTrack);
    bgmEngine.setTrack(defaultTrack);
  }, [storyboard.format]);

  // Keyboard Shortcuts (Space, R, M, S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
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

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      browserAudio.setMuted(next);
      bgmEngine.setMuted(next);
      return next;
    });
  };

  const handleSelectBgm = (t: BGMTrack) => {
    setBgmTrack(t);
    bgmEngine.setTrack(t);
    setShowBgmMenu(false);
  };

  // Find active line based on current time
  const currentLine = storyboard.lines.find(
    (l) => currentTime >= l.startSec && currentTime < l.startSec + l.durationSec
  ) || null;

  // Audio Voiceover & SFX & BGM Auto-Ducking
  useEffect(() => {
    if (!isPlaying || isMuted) {
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

  const renderTemplate = () => {
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
        return <RobloxTemplate storyboard={storyboard} currentTime={currentTime} currentLine={currentLine} />;
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* 9:16 VERTICAL VIDEO PLAYER CONTAINER */}
      <div className="relative w-full aspect-[9/16] bg-black rounded-3xl overflow-hidden border-4 border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)] select-none group">
        {/* Rendered Motion Template */}
        {renderTemplate()}

        {/* Word-By-Word Subtitles Overlay */}
        <WordByWordCaptions
          currentLine={currentLine}
          currentTime={currentTime}
          highlightColor={
            storyboard.format === 'pixel_rpg'
              ? '#10b981'
              : storyboard.format === 'roblox_story'
              ? '#00a2ff'
              : storyboard.format === 'breaking_news'
              ? '#facc15'
              : '#ff7849'
          }
        />

        {/* Social Media 9:16 Safe Zone Overlay (Toggleable) */}
        {showSafeZone && (
          <div className="absolute inset-0 pointer-events-none z-50 border-2 border-dashed border-red-500/60 flex flex-col justify-between p-6">
            <div className="bg-red-500/20 text-red-300 text-[10px] font-mono px-2 py-0.5 rounded self-center">
              TOP SAFE ZONE (NO SEARCH/ICONS)
            </div>
            <div className="border border-green-500/40 h-[65%] w-full flex items-center justify-center">
              <span className="text-green-400/40 text-xs font-mono">ACTION SAFE AREA 90%</span>
            </div>
            <div className="bg-red-500/20 text-red-300 text-[10px] font-mono px-2 py-0.5 rounded self-center">
              BOTTOM SAFE ZONE (CAPTION/LIKE ICONS)
            </div>
          </div>
        )}

        {/* Quick Overlay Controls on Top Bar */}
        <div className="absolute top-4 right-4 z-40 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
          {/* Mute/Sound Toggle on Video */}
          <button
            onClick={toggleMute}
            className={`p-2 rounded-full backdrop-blur-md border text-xs font-bold transition-colors ${
              !isMuted ? 'bg-orange-600 text-white border-orange-500' : 'bg-black/60 text-zinc-400 border-white/10 hover:bg-black/80'
            }`}
            title={isMuted ? 'Nyalakan Suara (M)' : 'Bisukan Suara (M)'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
          </button>

          {/* Safe Zone Toggle */}
          <button
            onClick={() => setShowSafeZone(!showSafeZone)}
            className={`p-2 rounded-full backdrop-blur-md border text-xs font-bold transition-colors ${
              showSafeZone ? 'bg-red-600 text-white border-red-500' : 'bg-black/60 text-zinc-300 border-white/10 hover:bg-black/80'
            }`}
            title="Toggle 9:16 Reels Safe Zone (S)"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TIMELINE SCRUBBER & DOCK CONTROLS */}
      <div className="w-full mt-4 bg-zinc-900/90 backdrop-blur-md p-4 rounded-2xl border-2 border-zinc-800 shadow-brutal flex flex-col gap-3">
        {/* Progress Bar Scrubber */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-zinc-400 w-12 text-right">
            {currentTime.toFixed(1)}s
          </span>
          <input
            type="range"
            min={0}
            max={duration}
            step={0.05}
            value={currentTime}
            onChange={(e) => {
              setCurrentTime(parseFloat(e.target.value));
              if (isPlaying) setIsPlaying(false);
              browserAudio.stopSpeech();
            }}
            className="flex-1 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-600 focus:outline-none"
          />
          <span className="text-xs font-mono font-bold text-zinc-400 w-12">
            {duration.toFixed(1)}s
          </span>
        </div>

        {/* Control Buttons & Audio Visualizer */}
        <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black shadow-brutal-sm transition-transform active:translate-y-0.5"
              title="Play/Pause (Space)"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            {/* Replay */}
            <button
              onClick={() => {
                setCurrentTime(0);
                lastLineIdRef.current = null;
                browserAudio.stopSpeech();
              }}
              className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
              title="Replay dari awal (R)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Audio Voiceover Toggle */}
            <button
              onClick={toggleMute}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                !isMuted
                  ? 'bg-orange-600/20 border-orange-500/50 text-orange-400'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-500'
              }`}
              title="Suara Voiceover & SFX (M)"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-orange-400" />}
              <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Audio ON'}</span>
            </button>

            {/* BGM Track Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowBgmMenu(!showBgmMenu)}
                className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="Pilih Musik Latar (BGM)"
              >
                <Music className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline">BGM:</span>
                <span className="text-cyan-400 uppercase text-[10px] font-mono">
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
              className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs font-mono font-bold flex items-center gap-1"
              title="Kecepatan Video"
            >
              <Gauge className="w-3.5 h-3.5" />
              {speed}x
            </button>
          </div>

          {/* Export MP4 Button */}
          <button
            onClick={onExportClick}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs shadow-brutal-sm flex items-center gap-2 border border-black transition-transform active:translate-y-0.5 ml-auto"
          >
            <Download className="w-4 h-4" />
            Export MP4
          </button>
        </div>

        {/* Shortcuts & Auto-Ducking Indicator */}
        <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-1 border-t border-zinc-800/80">
          <span>Shortcuts: [Space] Play • [R] Replay • [M] Mute • [S] Safe Area</span>
          {!isMuted && isPlaying && (
            <span className="text-orange-400 animate-pulse flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
              Auto-Ducking BGM Active
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
