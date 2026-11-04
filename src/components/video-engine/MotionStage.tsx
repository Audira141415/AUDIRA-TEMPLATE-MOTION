'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Storyboard, 
  MotionFormat, 
  SubtitleConfig, 
  VisualLayoutConfig, 
  SubtitlePositionPreset, 
  SubtitleSize, 
  SubtitleBoxStyle,
  SubtitleAnimationStyle,
  SubtitleFontFamily 
} from '@/types/motion';
import { WordByWordCaptions } from './WordByWordCaptions';
import { CharacterBanterTemplate } from './CharacterBanterTemplate';
import { WhiteboardTemplate } from './WhiteboardTemplate';
import { PixelRpgTemplate } from './PixelRpgTemplate';
import { BreakingNewsTemplate } from './BreakingNewsTemplate';
import { CleanExplainerTemplate } from './CleanExplainerTemplate';
import { DocuStoryTemplate } from './DocuStoryTemplate';
import { RobloxTemplate } from './RobloxTemplate';
import { EnginePreview } from './EnginePreview';
import { RenderHistoryModal } from '@/components/studio/RenderHistoryModal';
import { 
  Play, Pause, RotateCcw, ShieldCheck, Download, Volume2, VolumeX, 
  Gauge, Music, Smartphone, MonitorPlay, Sparkles, Heart, MessageCircle, 
  Bookmark, Share2, Sliders, Layers, Eye, EyeOff, Type, Palette, 
  CheckCircle2, X, ChevronUp, ChevronDown, AlignVerticalJustifyCenter, 
  Radio, Tv, BarChart3, Heading, AlertTriangle, Shield, Check,
  FolderOpen, Upload, Wand2
} from 'lucide-react';
import { browserAudio, isAudioInteractionAllowed } from '@/lib/browser-audio';
import { bgmEngine, BGMTrack } from '@/lib/bgm-engine';

const ANIMATION_PRESETS: { id: SubtitleAnimationStyle; label: string; desc: string }[] = [
  { id: 'pop_bounce', label: 'Bounce Pop', desc: 'Gaya MrBeast melonjak dinamis' },
  { id: 'karaoke', label: 'Karaoke Sweep', desc: 'Gaya Ali Abdaal menyapu halus' },
  { id: 'flash_word', label: 'Single Flash', desc: '1-2 kata cepat pemicu retensi' },
  { id: 'hormozi_box', label: 'Hormozi Box', desc: 'Blok kuning solid Alex Hormozi' },
  { id: 'highlight', label: 'Highlight Standar', desc: 'Warna menyala kata aktif' },
];

const FONT_PRESETS: { id: SubtitleFontFamily; label: string; desc: string }[] = [
  { id: 'montserrat', label: 'Montserrat', desc: 'Tebal modern edukasi & bisnis' },
  { id: 'impact', label: 'Impact', desc: 'Huruf tebal klasik video viral' },
  { id: 'the_bold_font', label: 'The Bold', desc: 'Heavy podcast & motivasi' },
  { id: 'komika', label: 'Komika', desc: 'Gaya gaming & komedi santai' },
  { id: 'inter', label: 'Inter', desc: 'Minimalis bersih tech SaaS' },
];

interface Props {
  storyboard: Storyboard;
  onExportClick?: () => void;
  onUpdateSubtitleConfig?: (config: SubtitleConfig) => void;
  onUpdateVisualLayout?: (layout: VisualLayoutConfig) => void;
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

const POSITION_PRESETS: { id: SubtitlePositionPreset; label: string; desc: string; val: number }[] = [
  { id: 'top', label: 'Atas (14%)', desc: 'Di bawah notch', val: 14 },
  { id: 'upper_mid', label: 'Atas-Tengah (26%)', desc: 'Di atas grafik', val: 26 },
  { id: 'center', label: 'Tengah (48%)', desc: 'Tengah layar', val: 48 },
  { id: 'lower_mid', label: 'Bawah-Tengah (68%)', desc: 'Safe Reels Bebas Tabrakan', val: 68 },
  { id: 'bottom', label: 'Bawah (82%)', desc: 'Di atas tombol', val: 82 },
];

const HIGHLIGHT_COLORS = [
  { hex: '#facc15', label: 'Emas' },
  { hex: '#ea580c', label: 'Oranye' },
  { hex: '#10b981', label: 'Emerald' },
  { hex: '#06b6d4', label: 'Cyan' },
  { hex: '#a855f7', label: 'Ungu' },
  { hex: '#ffffff', label: 'Putih' },
];

const THEME_OPTIONS = [
  { id: 'default', label: 'Obsidian Slate', bg: '#09090b', accent: '#6366f1' },
  { id: 'cyber_grid', label: 'Cyber Matrix', bg: '#030914', accent: '#06b6d4' },
  { id: 'indigo_glow', label: 'Indigo Bloom', bg: '#0c071b', accent: '#a855f7' },
  { id: 'amber_studio', label: 'Amber Studio', bg: '#120b05', accent: '#f59e0b' },
  { id: 'neon_bloom', label: 'Neon Cyber', bg: '#14051d', accent: '#ec4899' },
];

export const MotionStage: React.FC<Props> = ({ 
  storyboard, 
  onExportClick,
  onUpdateSubtitleConfig,
  onUpdateVisualLayout
}) => {
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
  const [voiceVol, setVoiceVol] = useState<number>(1.0);
  const [bgmVol, setBgmVol] = useState<number>(0.35);
  const [sfxVol, setSfxVol] = useState<number>(0.6);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const phoneContainerRef = useRef<HTMLDivElement>(null);
  const customBgmInputRef = useRef<HTMLInputElement | null>(null);

  // Active HUD Panel: 'none' | 'subtitle' | 'layers' | 'audio' (Default 'subtitle')
  const [activeHudTab, setActiveHudTab] = useState<'none' | 'subtitle' | 'layers' | 'audio'>('subtitle');

  const handleVoiceVolChange = (v: number) => {
    setVoiceVol(v);
    browserAudio.setVoiceVolume(v);
  };

  const handleBgmVolChange = (v: number) => {
    setBgmVol(v);
    bgmEngine.setVolume(v);
  };

  const handleSfxVolChange = (v: number) => {
    setSfxVol(v);
    browserAudio.setSfxVolume(v);
  };

  const handleCustomBgmUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    bgmEngine.loadCustomTrack(url, file.name);
    setBgmTrack('none');
  };

  const currentSubConfig: SubtitleConfig = storyboard.subtitleConfig || {
    enabled: true,
    position: 'lower_mid',
    customY: 68,
    size: 'md',
    boxStyle: 'glass',
    highlightColor: '#facc15',
    showSpeakerTag: true,
  };

  const currentLayout: VisualLayoutConfig = storyboard.visualLayout || {
    showHeader: true,
    showGraphic: true,
    showCallout: true,
    graphicScale: 'normal',
    canvasTheme: 'default',
  };

  const updateSubtitle = (patch: Partial<SubtitleConfig>) => {
    if (onUpdateSubtitleConfig) {
      onUpdateSubtitleConfig({
        ...currentSubConfig,
        ...patch,
      });
    }
  };

  const updateLayout = (patch: Partial<VisualLayoutConfig>) => {
    if (onUpdateVisualLayout) {
      onUpdateVisualLayout({
        ...currentLayout,
        ...patch,
      });
    }
  };

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

  // Prefetch natural Indonesian Cartesia voiceover for all storyboard lines
  useEffect(() => {
    if (storyboard?.lines?.length) {
      browserAudio.prefetchLines(storyboard.lines);
    }
  }, [storyboard?.lines]);

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

      // Voiceover Speech synthesis (Authentic Indonesian Cartesia AI)
      browserAudio.speakLine(currentLine.id, currentLine.text, currentLine.speakerRole, currentLine.emotion);
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

  const isSimulationOrCustomHud = [
    'roblox_story',
  ].includes(storyboard.format);

  const currentRatio = currentLayout.aspectRatio || '9:16';
  const maxWidthClass = currentRatio === '16:9' ? 'max-w-[500px]' : currentRatio === '1:1' ? 'max-w-[420px]' : 'max-w-[390px]';
  const aspectClass = currentRatio === '1:1' ? 'aspect-square' : currentRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16]';

  return (
    <div className={`flex flex-col items-center w-full ${maxWidthClass} mx-auto select-none transition-all duration-300`}>
      {/* TOP CANVAS CONTROL BAR */}
      <div className="w-full flex items-center justify-between pb-3 text-xs flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
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

          {/* Aspek Rasio Switcher */}
          <div className="flex items-center p-0.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[10px] font-mono">
            {(['9:16', '1:1', '16:9'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => updateLayout({ aspectRatio: r })}
                className={`px-1.5 py-0.5 rounded-lg font-bold transition-all ${
                  currentRatio === r
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title={`Ubah Aspek Rasio Kanvas ke ${r}`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Vault Riwayat Render Button */}
          <button
            type="button"
            onClick={() => setIsHistoryOpen(true)}
            className="px-2 py-1 rounded-xl border text-[10px] font-bold bg-zinc-900 hover:bg-zinc-800 text-amber-300 border-amber-500/40 hover:border-amber-400 transition-all flex items-center gap-1 shadow-sm"
            title="Buka Vault Arsip Hasil Render MP4"
          >
            <FolderOpen className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Vault</span>
          </button>
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
        ref={phoneContainerRef}
        onClick={handleUnlockAudio}
        className={`relative w-full ${aspectClass} bg-black overflow-hidden transition-all duration-300 cursor-pointer ${
          frameMode === 'phone' && currentRatio === '9:16'
            ? 'rounded-[44px] border-[10px] border-[#202022] ring-1 ring-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.95)]'
            : 'rounded-3xl border-4 border-zinc-800 shadow-2xl'
        }`}
      >
        {/* Phone Dynamic Island Notch */}
        {frameMode === 'phone' && currentRatio === '9:16' && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-50 flex items-center justify-between px-2.5 pointer-events-none shadow-md">
            <div className="w-2 h-2 rounded-full bg-[#111] ring-1 ring-white/10" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
          </div>
        )}

        {/* Live Subtitle Height Guide Line when adjusting Subtitle */}
        {activeHudTab === 'subtitle' && currentSubConfig.enabled && (
          <div
            className="absolute inset-x-0 z-50 pointer-events-none flex items-center transition-all duration-150"
            style={{ top: `${currentSubConfig.customY ?? 68}%` }}
          >
            <div className="w-full border-t border-dashed border-yellow-400/80 shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
            <span className="absolute right-2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-yellow-400 text-black text-[9px] font-mono font-black shadow">
              Y: {currentSubConfig.customY ?? 68}%
            </span>
          </div>
        )}

        {/* Rendered Motion Template */}
        {renderActiveCanvas()}

        {/* Word-By-Word Subtitles Overlay (for native interactive templates) */}
        {engineMode === 'interactive' && hasNativeTemplate && !isSimulationOrCustomHud && (
          <WordByWordCaptions
            currentLine={currentLine}
            currentTime={currentTime}
            format={storyboard.format}
            config={currentSubConfig}
            phoneContainerRef={phoneContainerRef}
            onUpdatePosition={(newY) => updateSubtitle({ customY: newY, position: undefined })}
            highlightColor={
              currentSubConfig?.highlightColor ||
              (storyboard.format === 'pixel_rpg'
                ? '#10b981'
                : storyboard.format === 'breaking_news'
                ? '#facc15'
                : '#ff7849')
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

      {/* CANVAS DOCK SELECTOR BAR (PROMINENT RIGHT UNDER PHONE) */}
      <div className="w-full mt-3 flex items-center justify-between p-1.5 rounded-2xl bg-[#141417] border-2 border-zinc-800 shadow-md">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveHudTab(activeHudTab === 'subtitle' ? 'none' : 'subtitle')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
              activeHudTab === 'subtitle'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-orange-400" />
            <span>Subtitle & Font</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/50 text-orange-300">
              {currentSubConfig.enabled ? `${currentSubConfig.customY ?? 68}%` : 'OFF'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveHudTab(activeHudTab === 'layers' ? 'none' : 'layers')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
              activeHudTab === 'layers'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Lapisan Visual</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveHudTab(activeHudTab === 'audio' ? 'none' : 'audio')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
              activeHudTab === 'audio'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mixer Audio</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setActiveHudTab(activeHudTab === 'none' ? 'subtitle' : 'none')}
          className="text-zinc-500 hover:text-zinc-300 p-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1"
          title={activeHudTab === 'none' ? 'Buka Pengaturan Canvas' : 'Tutup Pengaturan Canvas'}
        >
          <span>{activeHudTab === 'none' ? 'Buka' : 'Tutup'}</span>
          {activeHudTab !== 'none' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* INTERACTIVE HUD PANEL: SUBTITLE DOCK OR VISUAL LAYERS INSPECTOR */}
      {activeHudTab === 'subtitle' && (
        <div className="w-full mt-3 bg-[#121215] p-3.5 sm:p-4 rounded-3xl border-2 border-orange-500/80 shadow-[4px_4px_0px_#000] flex flex-col gap-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-black uppercase tracking-wider text-white">
                Atur Posisi & Tampilan Subtitle
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveHudTab('none')}
              className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 1. Posisi Cepat (Presets) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-400">
              Posisi Vertikal di Layar:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {POSITION_PRESETS.map((p) => {
                const isSelected = currentSubConfig.position === p.id || currentSubConfig.customY === p.val;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => updateSubtitle({ position: p.id, customY: p.val })}
                    className={`px-2 py-1.5 rounded-xl text-left border text-[11px] font-bold transition-all flex flex-col ${
                      isSelected
                        ? 'bg-orange-600 text-white border-orange-400 shadow-sm'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <span>{p.label}</span>
                    <span className="text-[9px] opacity-75 font-normal truncate">{p.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Slider Ketinggian Y Bebas */}
          <div className="flex flex-col gap-1.5 bg-zinc-900/80 p-2.5 rounded-2xl border border-zinc-800">
            <div className="flex justify-between items-center text-[10px]">
              <span className="font-bold text-zinc-300">Presisi Ketinggian (Y Axis):</span>
              <span className="font-mono font-bold text-orange-400">{currentSubConfig.customY ?? 68}%</span>
            </div>
            <input
              type="range"
              min={12}
              max={86}
              value={currentSubConfig.customY ?? 68}
              onChange={(e) => updateSubtitle({ customY: Number(e.target.value), position: undefined })}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500 focus:outline-none"
            />
          </div>

          {/* 3. Ukuran & Box Backdrop Style */}
          <div className="grid grid-cols-2 gap-2">
            {/* Ukuran Subtitle */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase text-zinc-400">Ukuran Font:</span>
              <div className="flex items-center gap-1">
                {(['sm', 'md', 'lg'] as SubtitleSize[]).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => updateSubtitle({ size: sz })}
                    className={`flex-1 py-1 rounded-xl text-xs font-black uppercase border transition-all ${
                      currentSubConfig.size === sz
                        ? 'bg-orange-600 text-white border-orange-400'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {sz.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Gaya Box Anti-Tabrakan */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase text-zinc-400">Backdrop Box:</span>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { id: 'glass', label: 'Pill Gelap' },
                  { id: 'solid', label: 'Solid Box' },
                  { id: 'neon', label: 'Neon' },
                  { id: 'shadow', label: 'Shadow' },
                ].map((bx) => (
                  <button
                    key={bx.id}
                    type="button"
                    onClick={() => updateSubtitle({ boxStyle: bx.id as SubtitleBoxStyle })}
                    className={`py-1 px-1 rounded-xl text-[10px] font-bold border truncate transition-all ${
                      currentSubConfig.boxStyle === bx.id
                        ? 'bg-orange-600 text-white border-orange-400'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {bx.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Warna Kata Aktif (Highlight) & Toggles */}
          <div className="flex items-center justify-between pt-1 border-t border-zinc-800 flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-zinc-400 mr-1">Highlight:</span>
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => updateSubtitle({ highlightColor: c.hex })}
                  style={{ backgroundColor: c.hex }}
                  className={`w-5 h-5 rounded-full border-2 transition-transform ${
                    currentSubConfig.highlightColor === c.hex
                      ? 'border-white scale-125 shadow-md'
                      : 'border-black hover:scale-110'
                  }`}
                  title={c.label}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              {/* Toggle Subtitle */}
              <button
                type="button"
                onClick={() => updateSubtitle({ enabled: !currentSubConfig.enabled })}
                className={`px-2 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 ${
                  currentSubConfig.enabled
                    ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/50'
                    : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                }`}
              >
                {currentSubConfig.enabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                <span>{currentSubConfig.enabled ? 'Aktif' : 'Mati'}</span>
              </button>

              {/* Toggle Speaker Tag */}
              <button
                type="button"
                onClick={() => updateSubtitle({ showSpeakerTag: !currentSubConfig.showSpeakerTag })}
                className={`px-2 py-1 rounded-lg border text-[10px] font-bold ${
                  currentSubConfig.showSpeakerTag !== false
                    ? 'bg-zinc-800 text-zinc-200 border-zinc-700'
                    : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                }`}
              >
                Tag: {currentSubConfig.showSpeakerTag !== false ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* 5. Gaya Animasi Teks Kinetik */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-zinc-800">
            <span className="text-[10px] font-black uppercase text-zinc-400 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-yellow-400" />
              <span>Gaya Animasi Teks Kinetik:</span>
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {ANIMATION_PRESETS.map((an) => {
                const isSelected = (currentSubConfig.animationStyle || 'pop_bounce') === an.id;
                return (
                  <button
                    key={an.id}
                    type="button"
                    onClick={() => updateSubtitle({ animationStyle: an.id })}
                    className={`p-2 rounded-xl border text-left text-xs transition-all flex flex-col ${
                      isSelected
                        ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500 shadow-sm font-bold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>{an.label}</span>
                    <span className="text-[9px] opacity-75 font-normal truncate mt-0.5">{an.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Pilihan Font Kreator */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-zinc-800">
            <span className="text-[10px] font-black uppercase text-zinc-400 flex items-center gap-1.5">
              <Type className="w-3 h-3 text-cyan-400" />
              <span>Font Kreator Populer:</span>
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {FONT_PRESETS.map((fn) => {
                const isSelected = (currentSubConfig.fontFamily || 'montserrat') === fn.id;
                return (
                  <button
                    key={fn.id}
                    type="button"
                    onClick={() => updateSubtitle({ fontFamily: fn.id })}
                    className={`p-2 rounded-xl border text-left text-xs transition-all flex flex-col ${
                      isSelected
                        ? 'bg-cyan-600/20 text-cyan-300 border-cyan-500 shadow-sm font-bold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>{fn.label}</span>
                    <span className="text-[9px] opacity-75 font-normal truncate mt-0.5">{fn.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE HUD PANEL: VISUAL LAYERS INSPECTOR ("visualnya apa saja dll") */}
      {activeHudTab === 'layers' && (
        <div className="w-full mt-3 bg-[#121215] p-3.5 sm:p-4 rounded-3xl border-2 border-cyan-500/80 shadow-[4px_4px_0px_#000] flex flex-col gap-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-white block">
                  Daftar Lapisan Visual (Scene Layers)
                </span>
                <span className="text-[10px] text-zinc-400">
                  Format: {storyboard.format} • Bebas atur setiap elemen
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveHudTab('none')}
              className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Layer List */}
          <div className="flex flex-col gap-2">
            {/* Layer 1: Tema Background */}
            <div className="p-2.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Layer 1: Tema Latar Kanvas</span>
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {currentLayout.canvasTheme || 'default'}
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 pt-1">
                {THEME_OPTIONS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => updateLayout({ canvasTheme: t.id })}
                    className={`px-2 py-1 rounded-xl text-[10px] font-bold border truncate transition-all ${
                      (currentLayout.canvasTheme || 'default') === t.id
                        ? 'bg-cyan-600 text-white border-cyan-400 shadow-sm'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {t.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Layer 2: Header & Judul Topik */}
            <div className="p-2.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-white flex items-center gap-1.5">
                  <Heading className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Layer 2: Header & Topik Video</span>
                </div>
                <div className="text-[10px] text-zinc-400">
                  {currentLayout.showHeader !== false ? 'Menampilkan judul & label referensi' : 'Disembunyikan (Mode Fokus)'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => updateLayout({ showHeader: currentLayout.showHeader === false })}
                className={`px-2.5 py-1 rounded-xl border text-[11px] font-bold ${
                  currentLayout.showHeader !== false
                    ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/50'
                    : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                }`}
              >
                {currentLayout.showHeader !== false ? 'Tampil' : 'Sembunyi'}
              </button>
            </div>

            {/* Layer 3: Visual Utama & Grafik */}
            <div className="p-2.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-white flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Layer 3: Visual Utama / Chart / 3D</span>
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    Kartu visual interaktif atau animasi diagram
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => updateLayout({ showGraphic: currentLayout.showGraphic === false })}
                  className={`px-2.5 py-1 rounded-xl border text-[11px] font-bold ${
                    currentLayout.showGraphic !== false
                      ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/50'
                      : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                  }`}
                >
                  {currentLayout.showGraphic !== false ? 'Tampil' : 'Sembunyi'}
                </button>
              </div>

              {currentLayout.showGraphic !== false && (
                <div className="flex items-center justify-between pt-1 border-t border-zinc-800 text-[10px]">
                  <span className="text-zinc-400 font-bold">Skala Ukuran Visual:</span>
                  <div className="flex items-center gap-1">
                    {[
                      { id: 'compact', label: 'Kompak (90%)' },
                      { id: 'normal', label: 'Normal' },
                      { id: 'large', label: 'Besar (105%)' },
                    ].map((sc) => (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => updateLayout({ graphicScale: sc.id as any })}
                        className={`px-2 py-0.5 rounded-lg border text-[9px] font-bold ${
                          (currentLayout.graphicScale || 'normal') === sc.id
                            ? 'bg-cyan-600 text-white border-cyan-400'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {sc.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Layer 4: Subtitle Layer */}
            <div className="p-2.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-white flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-orange-400" />
                  <span>Layer 4: Subtitle Teks Kinetik</span>
                </div>
                <div className="text-[10px] text-zinc-400">
                  Posisi: {currentSubConfig.customY ?? 68}% • Ukuran: {currentSubConfig.size}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveHudTab('subtitle')}
                className="px-2.5 py-1 rounded-xl bg-orange-600 text-white text-[10px] font-bold shadow-sm hover:bg-orange-500"
              >
                Atur Subtitle
              </button>
            </div>

            {/* Layer 5: Actionable Tip / Outro Callout */}
            <div className="p-2.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Layer 5: Outro Callout & Hook Magnet</span>
                </div>
                <div className="text-[10px] text-zinc-400">
                  Kartu tips pemicu share atau debat komentar di akhir
                </div>
              </div>
              <button
                type="button"
                onClick={() => updateLayout({ showCallout: currentLayout.showCallout === false })}
                className={`px-2.5 py-1 rounded-xl border text-[11px] font-bold ${
                  currentLayout.showCallout !== false
                    ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/50'
                    : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                }`}
              >
                {currentLayout.showCallout !== false ? 'Tampil' : 'Sembunyi'}
              </button>
            </div>

            {/* Breaking News Special Customizer */}
            {storyboard.format === 'breaking_news' && (
              <div className="p-2.5 rounded-2xl bg-red-950/30 border border-red-900/50 flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-red-400 flex items-center gap-1">
                  <Radio className="w-3 h-3 animate-pulse" />
                  <span>Pengaturan Siaran Breaking News TV</span>
                </span>
                
                {/* Urgency Badge */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
                  {[
                    { id: 'breaking', label: 'BREAKING' },
                    { id: 'flash', label: 'FLASH' },
                    { id: 'investigasi', label: 'INVESTIGASI' },
                    { id: 'special', label: 'KHUSUS' },
                  ].map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => updateLayout({ newsUrgency: u.id as any })}
                      className={`py-1 rounded-lg text-[9px] font-black uppercase border ${
                        (currentLayout.newsUrgency || 'breaking') === u.id
                          ? 'bg-red-600 text-white border-red-400'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>

                {/* News Mode */}
                <div className="grid grid-cols-3 gap-1 pt-1">
                  {[
                    { id: 'forensic_leak', label: 'Chat Leak' },
                    { id: 'anchor_studio', label: 'Studio 3D' },
                    { id: 'field_live_cam', label: 'Field Cam' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => updateLayout({ newsMode: m.id as any })}
                      className={`py-1 rounded-lg text-[9px] font-bold border ${
                        (currentLayout.newsMode || 'forensic_leak') === m.id
                          ? 'bg-orange-600 text-white border-orange-400'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* INTERACTIVE HUD PANEL: AUDIO MIXER STUDIO */}
      {activeHudTab === 'audio' && (
        <div className="w-full mt-3 bg-[#121215] p-3.5 sm:p-4 rounded-3xl border-2 border-emerald-500/80 shadow-[4px_4px_0px_#000] flex flex-col gap-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-white block">
                  Mixer Volume & Musik Latar (BGM)
                </span>
                <span className="text-[10px] text-zinc-400">
                  Atur keseimbangan suara AI, musik latar, efek suara, atau upload lagu
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveHudTab('none')}
              className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 1. Volume Sliders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Voice Volume */}
            <div className="bg-zinc-900 p-2.5 rounded-2xl border border-zinc-800 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-orange-400 flex items-center gap-1">
                  <span>🎙️ Suara AI</span>
                </span>
                <span className="font-mono text-[10px] text-zinc-400">{Math.round(voiceVol * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={voiceVol}
                onChange={(e) => handleVoiceVolChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            {/* BGM Volume */}
            <div className="bg-zinc-900 p-2.5 rounded-2xl border border-zinc-800 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-cyan-400 flex items-center gap-1">
                  <span>🎵 Musik BGM</span>
                </span>
                <span className="font-mono text-[10px] text-zinc-400">{Math.round(bgmVol * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={bgmVol}
                onChange={(e) => handleBgmVolChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* SFX Volume */}
            <div className="bg-zinc-900 p-2.5 rounded-2xl border border-zinc-800 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-yellow-400 flex items-center gap-1">
                  <span>💥 Efek SFX</span>
                </span>
                <span className="font-mono text-[10px] text-zinc-400">{Math.round(sfxVol * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={sfxVol}
                onChange={(e) => handleSfxVolChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
              />
            </div>
          </div>

          {/* 2. Track BGM Selection */}
          <div className="flex flex-col gap-1.5 pt-1 border-t border-zinc-800">
            <span className="text-[10px] font-black uppercase text-zinc-400">Pilih Trek Musik Latar (BGM):</span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {[
                { id: 'lofi_chill', label: 'Lofi Chill' },
                { id: 'news_pulse', label: 'News Pulse' },
                { id: 'retro_arcade', label: 'Retro 8-Bit' },
                { id: 'cyber_synth', label: 'Cyber Synth' },
                { id: 'none', label: 'Mute BGM' },
              ].map((trk) => (
                <button
                  key={trk.id}
                  type="button"
                  onClick={() => handleSelectBgm(trk.id as BGMTrack)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-colors truncate ${
                    bgmTrack === trk.id
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {trk.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Custom BGM Upload & SFX Audition */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800 flex-wrap gap-2">
            <div>
              <input
                ref={customBgmInputRef}
                type="file"
                accept="audio/*"
                onChange={handleCustomBgmUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => customBgmInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl border border-dashed border-emerald-500/60 bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {bgmEngine.getCustomTrackName() ? `Lagu: ${bgmEngine.getCustomTrackName()}` : 'Upload Lagu Sendiri (.mp3 / .wav)'}
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                handleUnlockAudio();
                browserAudio.playPop();
              }}
              className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold border border-zinc-700 flex items-center gap-1"
            >
              <span>🔊 Tes SFX Pop</span>
            </button>
          </div>
        </div>
      )}

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

      {/* Vault Riwayat Render Modal */}
      <RenderHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
};
