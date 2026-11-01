'use client';

import React from 'react';
import { 
  Storyboard, 
  SubtitleConfig, 
  VisualLayoutConfig, 
  SubtitlePositionPreset, 
  SubtitleSize, 
  SubtitleBoxStyle 
} from '@/types/motion';
import { 
  Sliders, AlignVerticalJustifyCenter, Eye, EyeOff, Type, 
  Sparkles, Palette, Layers, Box, CheckCircle2, LayoutTemplate, 
  BarChart3, Heading, MessageSquareQuote, Lightbulb, Radio, Tv,
  Smartphone, Mic, Video, AlertTriangle, Flame, ShieldAlert, MapPin
} from 'lucide-react';

interface Props {
  storyboard: Storyboard;
  onUpdateSubtitleConfig: (config: SubtitleConfig) => void;
  onUpdateVisualLayout: (layout: VisualLayoutConfig) => void;
}

const POSITION_PRESETS: { id: SubtitlePositionPreset; label: string; desc: string; val: number }[] = [
  { id: 'top', label: 'Atas (12%)', desc: 'Di bawah safe area header', val: 12 },
  { id: 'upper_mid', label: 'Atas-Tengah (24%)', desc: 'Di atas grafik utama', val: 24 },
  { id: 'center', label: 'Tengah (48%)', desc: 'Fokus tengah layar', val: 48 },
  { id: 'lower_mid', label: 'Bawah-Tengah (68%)', desc: 'Standar Reels & Bebas Tabrakan', val: 68 },
  { id: 'bottom', label: 'Bawah (80%)', desc: 'Di atas action safe area', val: 80 },
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
  { id: 'default', label: 'Obsidian Slate', desc: 'Dark minimalis modern', bg: '#09090b', accent: '#6366f1' },
  { id: 'cyber_grid', label: 'Cyber Matrix', desc: 'Tech grid bernuansa cyan', bg: '#030914', accent: '#06b6d4' },
  { id: 'indigo_glow', label: 'Indigo Bloom', desc: 'Radial glow ungu-indigo', bg: '#0c071b', accent: '#a855f7' },
  { id: 'amber_studio', label: 'Amber Studio', desc: 'Hangat bernuansa creator', bg: '#120b05', accent: '#f59e0b' },
  { id: 'neon_bloom', label: 'Neon Cyber', desc: 'Vibrant neon ultra pop', bg: '#14051d', accent: '#ec4899' },
];

export const VisualSubtitlePanel: React.FC<Props> = ({
  storyboard,
  onUpdateSubtitleConfig,
  onUpdateVisualLayout,
}) => {
  const currentSubConfig: SubtitleConfig = storyboard.subtitleConfig || {
    enabled: true,
    position: 'lower_mid',
    customY: 68,
    size: 'md',
    boxStyle: 'shadow',
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

  const handleToggleSubtitles = () => {
    onUpdateSubtitleConfig({
      ...currentSubConfig,
      enabled: !currentSubConfig.enabled,
    });
  };

  const handlePositionPreset = (preset: SubtitlePositionPreset) => {
    const found = POSITION_PRESETS.find((p) => p.id === preset);
    onUpdateSubtitleConfig({
      ...currentSubConfig,
      position: preset,
      customY: found ? found.val : 68,
    });
  };

  const handleSliderY = (val: number) => {
    onUpdateSubtitleConfig({
      ...currentSubConfig,
      customY: val,
      position: undefined,
    });
  };

  const handleSizeChange = (size: SubtitleSize) => {
    onUpdateSubtitleConfig({
      ...currentSubConfig,
      size,
    });
  };

  const handleBoxStyleChange = (boxStyle: SubtitleBoxStyle) => {
    onUpdateSubtitleConfig({
      ...currentSubConfig,
      boxStyle,
    });
  };

  const handleHighlightColorChange = (hex: string) => {
    onUpdateSubtitleConfig({
      ...currentSubConfig,
      highlightColor: hex,
    });
  };

  const handleToggleSpeakerTag = () => {
    onUpdateSubtitleConfig({
      ...currentSubConfig,
      showSpeakerTag: !currentSubConfig.showSpeakerTag,
    });
  };

  // Visual layout handlers
  const handleToggleHeader = () => {
    onUpdateVisualLayout({
      ...currentLayout,
      showHeader: !currentLayout.showHeader,
    });
  };

  const handleToggleGraphic = () => {
    onUpdateVisualLayout({
      ...currentLayout,
      showGraphic: !currentLayout.showGraphic,
    });
  };

  const handleToggleCallout = () => {
    onUpdateVisualLayout({
      ...currentLayout,
      showCallout: !currentLayout.showCallout,
    });
  };

  const handleGraphicScale = (scale: 'compact' | 'normal' | 'large') => {
    onUpdateVisualLayout({
      ...currentLayout,
      graphicScale: scale,
    });
  };

  const handleThemeChange = (themeId: string) => {
    onUpdateVisualLayout({
      ...currentLayout,
      canvasTheme: themeId,
    });
  };

  // News Broadcast handlers
  const handleNewsModeChange = (mode: 'forensic_leak' | 'anchor_studio' | 'field_live_cam') => {
    onUpdateVisualLayout({
      ...currentLayout,
      newsMode: mode,
    });
  };

  const handleNewsUrgencyChange = (urgency: 'breaking' | 'flash' | 'investigasi' | 'special') => {
    onUpdateVisualLayout({
      ...currentLayout,
      newsUrgency: urgency,
    });
  };

  const handleCustomTickerChange = (text: string) => {
    onUpdateVisualLayout({
      ...currentLayout,
      customTicker: text,
    });
  };

  const currentY = currentSubConfig.customY !== undefined 
    ? currentSubConfig.customY 
    : POSITION_PRESETS.find((p) => p.id === currentSubConfig.position)?.val || 68;

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-200">
      {/* SECTION KHUSUS: PRO TV NEWS BROADCAST CONTROLS (ONLY FOR BREAKING NEWS) */}
      {storyboard.format === 'breaking_news' && (
        <div className="bg-[#141413] p-5 rounded-3xl border-2 border-red-800/80 shadow-[4px_4px_0px_0px_#ef4444] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-black shadow-md">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span>Kontrol Siaran Breaking News TV</span>
                  <span className="px-1.5 py-0.5 rounded bg-red-600/30 text-red-400 border border-red-500/40 text-[9px]">LIVE PRO</span>
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Pilih scene visual siaran, tingkat urgensi alert, dan isi running ticker bawah
                </p>
              </div>
            </div>
          </div>

          {/* 1. Mode Visual Berita (3 Kamera/Scene) */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-red-400" />
              Tipe Scene Visual Siaran TV
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                {
                  id: 'forensic_leak',
                  title: 'Chat Forensik',
                  desc: 'Pesan WA bocor disinkronkan ke naskah',
                  icon: <Smartphone className="w-4 h-4 text-emerald-400" />,
                },
                {
                  id: 'anchor_studio',
                  title: 'Studio Anchor',
                  desc: 'Presenter TV dengan TV Wall & audio equalizer',
                  icon: <Mic className="w-4 h-4 text-cyan-400" />,
                },
                {
                  id: 'field_live_cam',
                  title: 'Field Live Cam',
                  desc: 'Kamera CCTV 4K lapangan dengan telemetri GPS',
                  icon: <Video className="w-4 h-4 text-yellow-400" />,
                },
              ].map((mode) => {
                const isSelected = (currentLayout.newsMode || 'forensic_leak') === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => handleNewsModeChange(mode.id as any)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-red-950/40 border-red-500 text-white shadow-[2px_2px_0px_0px_#ef4444]'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {mode.icon}
                      <span className="text-xs font-black">{mode.title}</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 leading-snug">{mode.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Tingkat Urgensi Alert */}
          <div className="flex flex-col gap-2 pt-1 border-t border-zinc-800">
            <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-yellow-400" />
              Level Urgensi Headline Alert
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'breaking', label: 'BREAKING NEWS', color: 'bg-red-600 text-white' },
                { id: 'flash', label: 'FLASH ALERT', color: 'bg-yellow-400 text-black font-black' },
                { id: 'investigasi', label: 'INVESTIGASI A1', color: 'bg-indigo-600 text-white' },
                { id: 'special', label: 'LAPORAN KHUSUS', color: 'bg-orange-600 text-white' },
              ].map((urg) => {
                const isSelected = (currentLayout.newsUrgency || 'breaking') === urg.id;
                return (
                  <button
                    key={urg.id}
                    type="button"
                    onClick={() => handleNewsUrgencyChange(urg.id as any)}
                    className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      isSelected
                        ? `${urg.color} border-white shadow-md scale-102`
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {urg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Teks Running Ticker Marquee Bawah */}
          <div className="flex flex-col gap-1.5 pt-1 border-t border-zinc-800">
            <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                Kustom Teks Running Ticker (Teks Berjalan Bawah)
              </span>
              <span className="text-[10px] font-mono text-zinc-500">Live Marquee</span>
            </label>
            <input
              type="text"
              placeholder="Kosongkan untuk auto-generate dari naskah & hook..."
              value={currentLayout.customTicker || ''}
              onChange={(e) => handleCustomTickerChange(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-yellow-400 font-mono placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400"
            />
            <p className="text-[10px] text-zinc-500">
              Biarkan kosong jika ingin ticker otomatis merangkum judul, dialog naskah, dan ajakan komentar.
            </p>
          </div>
        </div>
      )}

      {/* SECTION 1: KINETIC SUBTITLE ENGINE CONTROLLER */}
      <div className="bg-[#141413] p-5 rounded-3xl border-2 border-zinc-800 shadow-brutal flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <MessageSquareQuote className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Pengaturan Posisi & Teks Subtitle
              </h3>
              <p className="text-[11px] text-zinc-400">
                Atur letak subtitle vertikal agar bebas tabrakan dengan judul atau visual
              </p>
            </div>
          </div>

          {/* Master Toggle Subtitle */}
          <button
            type="button"
            onClick={handleToggleSubtitles}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              currentSubConfig.enabled
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
            }`}
          >
            {currentSubConfig.enabled ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Subtitle Aktif</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Disembunyikan</span>
              </>
            )}
          </button>
        </div>

        {currentSubConfig.enabled && (
          <div className="flex flex-col gap-4">
            {/* Vertical Placement Presets */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <AlignVerticalJustifyCenter className="w-3.5 h-3.5 text-orange-400" />
                  Preset Posisi Vertikal
                </span>
                <span className="text-[10px] font-mono text-orange-400 bg-orange-950/60 px-2 py-0.5 rounded border border-orange-800/80">
                  Koordinat Y: {currentY}%
                </span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {POSITION_PRESETS.map((p) => {
                  const isSelected = currentY === p.val;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handlePositionPreset(p.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-orange-600/20 border-orange-500 text-white shadow-sm'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                      }`}
                    >
                      <span className="text-[11px] font-black">{p.label}</span>
                      <span className="text-[9px] text-zinc-500 line-clamp-1 mt-0.5">
                        {p.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Precision Slider Y */}
            <div className="flex flex-col gap-1.5 bg-zinc-900/60 p-3 rounded-2xl border border-zinc-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400 font-medium flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  Slider Presisi Ketinggian Subtitle (Y-Axis)
                </span>
                <span className="text-cyan-400 font-mono font-bold">{currentY}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={85}
                step={1}
                value={currentY}
                onChange={(e) => handleSliderY(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
              <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
                <span>10% (Atas)</span>
                <span>48% (Tengah)</span>
                <span>85% (Bawah)</span>
              </div>
            </div>

            {/* Typography & Box Styling */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Font Size Selection */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-yellow-400" />
                  Ukuran Teks Kata
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'sm', label: 'Kecil', desc: 'Ringkas' },
                    { id: 'md', label: 'Sedang', desc: 'Standar Reels' },
                    { id: 'lg', label: 'Besar', desc: 'Kinetic Pop' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSizeChange(s.id as SubtitleSize)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        currentSubConfig.size === s.id
                          ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300 font-black'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold">{s.label}</div>
                      <div className="text-[9px] text-zinc-500">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Box Style Selection */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5 text-cyan-400" />
                  Gaya Kotak Wadah (Box Style)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'shadow', label: 'Shadow Minimal' },
                    { id: 'glass', label: 'Glassmorphism' },
                    { id: 'solid', label: 'Solid Brutal' },
                    { id: 'neon', label: 'Cyber Glow' },
                  ].map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => handleBoxStyleChange(b.id as SubtitleBoxStyle)}
                      className={`px-2.5 py-1.5 rounded-xl border text-xs text-left transition-all ${
                        currentSubConfig.boxStyle === b.id
                          ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300 font-bold'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Highlight Pop Color & Speaker Tag Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Highlight Color Picker */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-pink-400" />
                  Warna Highlight Kata Aktif
                </label>
                <div className="flex items-center gap-2">
                  {HIGHLIGHT_COLORS.map((c) => {
                    const isSelected = currentSubConfig.highlightColor === c.hex;
                    return (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => handleHighlightColorChange(c.hex)}
                        className={`w-7 h-7 rounded-full border-2 transition-transform flex items-center justify-center ${
                          isSelected ? 'scale-115 border-white shadow-lg' : 'border-black hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.label}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Speaker Tag Toggle */}
              <div className="flex flex-col justify-end">
                <button
                  type="button"
                  onClick={handleToggleSpeakerTag}
                  className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-between transition-colors ${
                    currentSubConfig.showSpeakerTag
                      ? 'bg-zinc-900 border-zinc-700 text-zinc-200'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-orange-400" />
                    Badge Pembicara ([ANALYST] / Nama)
                  </span>
                  <span className="text-[10px] font-mono uppercase">
                    {currentSubConfig.showSpeakerTag ? 'Tampil' : 'Sembunyi'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: CANVAS VISUAL LAYERS INSPECTOR ("Visualnya Apa Saja") */}
      <div className="bg-[#141413] p-5 rounded-3xl border-2 border-zinc-800 shadow-brutal flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Inspector Elemen Visual Canvas
              </h3>
              <p className="text-[11px] text-zinc-400">
                Pilih elemen visual mana saja yang tampil di canvas tanpa saling tumpang tindih
              </p>
            </div>
          </div>
        </div>

        {/* List of 4 Active Visual Layers */}
        <div className="flex flex-col gap-2.5">
          {/* Layer 1: Header / Title */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Heading className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Layer 1: Header & Judul Video</span>
                <span className="text-[10px] text-zinc-400">Pill kategori, sumber data, dan teks H1 headline</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleHeader}
              className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                currentLayout.showHeader
                  ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-500'
              }`}
            >
              {currentLayout.showHeader ? 'Tampil' : 'Sembunyi'}
            </button>
          </div>

          {/* Layer 2: Graphic Utama */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <BarChart3 className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Layer 2: Visual Graphic & Chart</span>
                <span className="text-[10px] text-zinc-400">Card animasi grafik retensi atau karakter scene</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {currentLayout.showGraphic && (
                <div className="hidden sm:flex items-center gap-1 mr-2">
                  {(['compact', 'normal', 'large'] as const).map((scale) => (
                    <button
                      key={scale}
                      type="button"
                      onClick={() => handleGraphicScale(scale)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase ${
                        currentLayout.graphicScale === scale
                          ? 'bg-cyan-600 text-white font-bold'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {scale === 'compact' ? 'S' : scale === 'normal' ? 'M' : 'L'}
                    </button>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={handleToggleGraphic}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                  currentLayout.showGraphic
                    ? 'bg-cyan-600/20 border-cyan-500/40 text-cyan-300'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                }`}
              >
                {currentLayout.showGraphic ? 'Tampil' : 'Sembunyi'}
              </button>
            </div>
          </div>

          {/* Layer 3: Subtitle Zone */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
                <MessageSquareQuote className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Layer 3: Kinetic Subtitle Zone</span>
                <span className="text-[10px] text-zinc-400">
                  {currentSubConfig.enabled ? `Aktif di Y: ${currentY}%` : 'Dimatikan'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-orange-400 bg-orange-950/60 px-2 py-0.5 rounded border border-orange-800">
              {currentSubConfig.enabled ? 'Live Overlay' : 'Nonaktif'}
            </span>
          </div>

          {/* Layer 4: Action Callout / Tip */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-yellow-500/20 text-yellow-400 flex items-center justify-center">
                <Lightbulb className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Layer 4: Actionable Tip & Outro Hook</span>
                <span className="text-[10px] text-zinc-400">Card tips bawah / ajakan komentar pemicu algoritma</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleCallout}
              className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                currentLayout.showCallout
                  ? 'bg-yellow-600/20 border-yellow-500/40 text-yellow-300'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-500'
              }`}
            >
              {currentLayout.showCallout ? 'Tampil' : 'Sembunyi'}
            </button>
          </div>
        </div>

        {/* SECTION 3: CANVAS VISUAL THEME SELECTOR */}
        <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800">
          <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
            <LayoutTemplate className="w-3.5 h-3.5 text-purple-400" />
            Tema Estetika Visual Background Canvas
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {THEME_OPTIONS.map((t) => {
              const isSelected = currentLayout.canvasTheme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleThemeChange(t.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-purple-600/20 border-purple-500 text-white shadow-sm'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span 
                      className="w-2.5 h-2.5 rounded-full border border-white/40"
                      style={{ backgroundColor: t.accent }}
                    />
                    <span className="text-[11px] font-black">{t.label}</span>
                  </div>
                  <span className="text-[9px] text-zinc-500 line-clamp-1">{t.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

