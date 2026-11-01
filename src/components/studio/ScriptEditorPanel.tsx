'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Storyboard, StoryboardLine, SpeakerEmotion, VisualLayoutConfig } from '@/types/motion';
import { 
  Edit3, MessageSquare, Clock, Plus, Trash2, ArrowUpDown, 
  ChevronUp, ChevronDown, User, Bot, Type, MapPin, Volume2, Square, 
  Loader2, Zap, Sparkles, Undo2, Redo2, Image as ImageIcon, CheckCircle2,
  Wand2, Music
} from 'lucide-react';
import { browserAudio } from '@/lib/browser-audio';

interface Props {
  storyboard: Storyboard;
  onUpdateLine: (lineIndex: number, newText: string, newEmotion?: SpeakerEmotion) => void;
  onAddLine?: () => void;
  onDeleteLine?: (lineIndex: number) => void;
  onSwapSpeaker?: (lineIndex: number) => void;
  onMoveLine?: (lineIndex: number, direction: 'up' | 'down') => void;
  onUpdateHook: (newHook: string) => void;
  onUpdateTitle?: (newTitle: string) => void;
  onUpdateLocation?: (newLocation: string) => void;
  onBatchUpdateLines?: (newLines: StoryboardLine[], totalDuration: number) => void;
  onUpdateVisualLayout?: (layout: VisualLayoutConfig) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

const EMOTIONS: SpeakerEmotion[] = ['neutral', 'hyped', 'angry', 'shocked', 'smug', 'thoughtful', 'sarcastic'];

const VIRAL_EMOJI_MAP: Record<string, string> = {
  uang: '💸',
  cuan: '💰',
  kaya: '🤑',
  dollar: '💵',
  rahasia: '🤫',
  bocor: '🚨',
  gila: '🤯',
  views: '👀',
  viral: '🔥',
  followers: '👥',
  algoritma: '🧠',
  bahaya: '⚠️',
  marah: '😡',
  roket: '🚀',
  sukses: '🏆',
  stop: '🛑',
  cepat: '⚡',
  gratis: '🎁',
  menyesal: '😭',
  terbukti: '✅',
  bohong: '❌',
  trik: '✨',
  fakta: '📌',
  chat: '💬',
  video: '🎬',
  konten: '📱',
};

export const ScriptEditorPanel: React.FC<Props> = ({
  storyboard,
  onUpdateLine,
  onAddLine,
  onDeleteLine,
  onSwapSpeaker,
  onMoveLine,
  onUpdateHook,
  onUpdateTitle,
  onUpdateLocation,
  onBatchUpdateLines,
  onUpdateVisualLayout,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}) => {
  const charA = storyboard.characters.characterA.name;
  const charB = storyboard.characters.characterB.name;

  const [playingLineId, setPlayingLineId] = useState<string | null>(null);
  const [loadingLineId, setLoadingLineId] = useState<string | null>(null);
  const [isBatchSyncing, setIsBatchSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState<{ cur: number; total: number } | null>(null);
  const [mediaNotice, setMediaNotice] = useState<string | null>(null);

  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Keyboard shortcut listeners for Ctrl+Z and Ctrl+Y
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          if (onRedo && canRedo) {
            e.preventDefault();
            onRedo();
          }
        } else {
          if (onUndo && canUndo) {
            e.preventDefault();
            onUndo();
          }
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        if (onRedo && canRedo) {
          e.preventDefault();
          onRedo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onUndo, onRedo, canUndo, canRedo]);

  const handleAuditionLine = async (line: StoryboardLine) => {
    if (playingLineId === line.id && audioPreviewRef.current) {
      audioPreviewRef.current.pause();
      setPlayingLineId(null);
      return;
    }

    setLoadingLineId(line.id);
    try {
      const res = await fetch('/api/voiceover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: line.text,
          voiceKey: line.speakerRole === 'ai' ? 'safira' : line.speakerRole === 'narrator' ? 'galang' : line.speakerRole === 'boss' ? 'citra' : 'andi',
          emotion: line.emotion,
        }),
      });
      const data = await res.json();
      setLoadingLineId(null);
      if (res.ok && data.audioBase64) {
        if (audioPreviewRef.current) audioPreviewRef.current.pause();
        const audio = new Audio(data.audioBase64);
        audioPreviewRef.current = audio;
        audio.onended = () => setPlayingLineId(null);
        audio.play().then(() => setPlayingLineId(line.id)).catch(() => setPlayingLineId(null));
      }
    } catch {
      setLoadingLineId(null);
      setPlayingLineId(null);
    }
  };

  // 1-Click Batch Voice Sync & Exact Timestamps Calibration
  const handleBatchVoiceSync = async () => {
    if (!onBatchUpdateLines || isBatchSyncing) return;
    setIsBatchSyncing(true);
    setSyncProgress({ cur: 0, total: storyboard.lines.length });

    try {
      const results = await browserAudio.batchSynthesizeLines(
        storyboard.lines,
        (cur, total) => setSyncProgress({ cur, total })
      );

      let runningTime = 0;
      const updatedLines = storyboard.lines.map((line) => {
        const speechData = results.get(line.id);
        const lineDuration = speechData ? Math.max(1.8, Number((speechData.durationSec + 0.35).toFixed(2))) : line.durationSec;
        const lineWords = speechData && speechData.words?.length > 0 ? speechData.words : line.words;
        const updated: StoryboardLine = {
          ...line,
          startSec: Number(runningTime.toFixed(2)),
          durationSec: lineDuration,
          words: lineWords,
        };
        runningTime += lineDuration;
        return updated;
      });

      onBatchUpdateLines(updatedLines, Number(runningTime.toFixed(1)));
    } catch (err) {
      console.error('Batch sync error:', err);
    } finally {
      setIsBatchSyncing(false);
      setSyncProgress(null);
    }
  };

  // 1-Click Magic Auto-Emoji Injector
  const handleAutoEmoji = () => {
    if (!onBatchUpdateLines) return;
    const updated = storyboard.lines.map((line) => {
      let text = line.text;
      Object.entries(VIRAL_EMOJI_MAP).forEach(([keyword, emoji]) => {
        const regex = new RegExp(`\\b(${keyword})\\b(?!\\s*${emoji})`, 'gi');
        text = text.replace(regex, `$1 ${emoji}`);
      });
      return { ...line, text };
    });
    onBatchUpdateLines(updated, storyboard.durationSec);
  };

  // Custom Media / Screenshot Upload
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Ukuran file maksimal 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (onUpdateVisualLayout) {
        onUpdateVisualLayout({
          ...(storyboard.visualLayout || {}),
          customMediaUrl: result,
          customMediaLabel: file.name,
        });
        setMediaNotice(`File ${file.name} berhasil disematkan ke canvas.`);
        setTimeout(() => setMediaNotice(null), 3500);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveMedia = () => {
    if (onUpdateVisualLayout) {
      onUpdateVisualLayout({
        ...(storyboard.visualLayout || {}),
        customMediaUrl: undefined,
        customMediaLabel: undefined,
      });
    }
  };

  return (
    <div className="bg-zinc-900/90 p-4 sm:p-5 rounded-3xl border-2 border-zinc-800 shadow-brutal flex flex-col gap-4">
      {/* Top Header & Fast Action Toolbar */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
            <Edit3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <span>Editor Naskah & Beat</span>
              <span className="text-[10px] text-zinc-400 font-mono font-normal">
                ({storyboard.lines.length} Baris • {storyboard.durationSec.toFixed(1)}s)
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400">
              Edit naskah, kalibrasi suara AI, dan tambahkan media visual
            </p>
          </div>
        </div>

        {/* Undo / Redo Buttons */}
        <div className="flex items-center gap-1 bg-[#141413] p-1 rounded-xl border border-zinc-800">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 ${
              canUndo ? 'text-zinc-200 hover:bg-zinc-800 hover:text-white' : 'text-zinc-600 cursor-not-allowed'
            }`}
            title="Urungkan Perubahan (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 ${
              canRedo ? 'text-zinc-200 hover:bg-zinc-800 hover:text-white' : 'text-zinc-600 cursor-not-allowed'
            }`}
            title="Ulangi Perubahan (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* QUICK POWER TOOLS: BATCH VOICE SYNC + AUTO-EMOJI + B-ROLL UPLOAD */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#141413] p-2.5 rounded-2xl border border-zinc-800">
        {/* Tool 1: Batch Voice Sync */}
        <button
          type="button"
          onClick={handleBatchVoiceSync}
          disabled={isBatchSyncing}
          className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
            isBatchSyncing
              ? 'bg-orange-600/30 text-orange-300 border-orange-500 animate-pulse'
              : 'bg-orange-600/15 hover:bg-orange-600/25 text-orange-400 border-orange-500/40 hover:border-orange-500'
          }`}
          title="Otomatis hasilkan suara Cartesia untuk semua baris dan sesuaikan durasi tepat sesuai audio"
        >
          {isBatchSyncing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Sync {syncProgress ? `${syncProgress.cur}/${syncProgress.total}` : '...'}</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 text-orange-400" />
              <span>Sync Suara AI</span>
            </>
          )}
        </button>

        {/* Tool 2: Magic Auto-Emoji */}
        <button
          type="button"
          onClick={handleAutoEmoji}
          className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 hover:border-amber-500 transition-all flex items-center justify-center gap-1.5"
          title="Otomatis tambahkan emoji kinetik viral di kata-kata penting"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Auto-Emoji</span>
        </button>

        {/* Tool 3: Upload Screenshot / B-Roll */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleMediaUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-cyan-600/15 hover:bg-cyan-600/25 text-cyan-300 border border-cyan-500/40 hover:border-cyan-500 transition-all flex items-center justify-center gap-1.5 truncate"
            title="Upload screenshot bukti chat, logo, atau foto produk kustom untuk canvas"
          >
            <ImageIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">
              {storyboard.visualLayout?.customMediaLabel ? 'Ganti Media' : 'Upload Bukti'}
            </span>
          </button>
        </div>
      </div>

      {/* Notice & Active Custom Media Pill */}
      {storyboard.visualLayout?.customMediaUrl && (
        <div className="flex items-center justify-between p-2 rounded-xl bg-cyan-950/40 border border-cyan-800 text-xs">
          <div className="flex items-center gap-2 truncate">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-cyan-200 truncate font-mono text-[11px]">
              Media aktif: {storyboard.visualLayout.customMediaLabel || 'Foto Kustom'}
            </span>
          </div>
          <button
            type="button"
            onClick={handleRemoveMedia}
            className="text-zinc-400 hover:text-red-400 text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-700 shrink-0 ml-2"
          >
            Hapus
          </button>
        </div>
      )}

      {mediaNotice && (
        <div className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-[11px] animate-in fade-in">
          {mediaNotice}
        </div>
      )}

      {/* Editable Title & Location Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#141413] p-3 rounded-2xl border border-zinc-800">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1">
            <Type className="w-3 h-3 text-orange-400" />
            <span>Judul Utama / Headline Reel</span>
          </label>
          <input
            type="text"
            value={storyboard.title}
            onChange={(e) => onUpdateTitle && onUpdateTitle(e.target.value)}
            placeholder="Masukkan judul reel..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-cyan-400" />
            <span>Lokasi Liputan / Scene</span>
          </label>
          <input
            type="text"
            value={storyboard.locationName || ''}
            onChange={(e) => onUpdateLocation && onUpdateLocation(e.target.value)}
            placeholder="Contoh: News Studio Live, Cafe Jakarta..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Script Lines List */}
      <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1">
        {storyboard.lines.map((line, idx) => {
          const isCharA = line.speaker === charA;

          return (
            <div
              key={line.id || idx}
              className={`p-3.5 rounded-2xl bg-[#141413] border-2 transition-all flex flex-col gap-2.5 ${
                isCharA ? 'border-orange-950/80 hover:border-orange-800/80' : 'border-cyan-950/80 hover:border-cyan-800/80'
              }`}
            >
              {/* Header: Speaker Toggle + Timestamp + Emotion + Actions */}
              <div className="flex items-center justify-between text-xs gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  {/* Speaker Badge & Swap Button */}
                  <button
                    type="button"
                    onClick={() => onSwapSpeaker && onSwapSpeaker(idx)}
                    title="Klik untuk ganti pembicara"
                    className={`px-2.5 py-0.5 rounded-full font-black text-[11px] border flex items-center gap-1 transition-all active:scale-95 ${
                      isCharA
                        ? 'bg-orange-600/20 text-orange-400 border-orange-500/40 hover:bg-orange-600/30'
                        : 'bg-cyan-600/20 text-cyan-400 border-cyan-500/40 hover:bg-cyan-600/30'
                    }`}
                  >
                    {isCharA ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                    <span>{line.speaker}</span>
                    <ArrowUpDown className="w-2.5 h-2.5 opacity-60" />
                  </button>

                  {/* Timing indicator */}
                  <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1 ml-1">
                    <Clock className="w-3 h-3" />
                    {line.startSec.toFixed(1)}s - {(line.startSec + line.durationSec).toFixed(1)}s
                  </span>
                </div>

                <div className="flex items-center gap-1.5 ml-auto">
                  {/* Cartesia Voice Audition Button */}
                  <button
                    type="button"
                    onClick={() => handleAuditionLine(line)}
                    disabled={loadingLineId === line.id}
                    className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition-all ${
                      playingLineId === line.id
                        ? 'bg-orange-600 text-white border-orange-400 shadow-sm animate-pulse'
                        : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:text-white hover:border-zinc-500'
                    }`}
                    title="Dengarkan suara Cartesia AI untuk baris ini"
                  >
                    {loadingLineId === line.id ? (
                      <Loader2 className="w-3 h-3 animate-spin text-orange-400" />
                    ) : playingLineId === line.id ? (
                      <Square className="w-3 h-3 fill-white" />
                    ) : (
                      <Volume2 className="w-3 h-3 text-orange-400" />
                    )}
                    <span className="hidden sm:inline">
                      {loadingLineId === line.id ? 'Memuat' : playingLineId === line.id ? 'Stop' : 'Suara'}
                    </span>
                  </button>

                  {/* Emotion Selector */}
                  <select
                    value={line.emotion}
                    onChange={(e) => onUpdateLine(idx, line.text, e.target.value as SpeakerEmotion)}
                    className="bg-zinc-800 text-zinc-300 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-zinc-700 focus:outline-none"
                  >
                    {EMOTIONS.map((em) => (
                      <option key={em} value={em}>
                        {em.toUpperCase()}
                      </option>
                    ))}
                  </select>

                  {/* Move Up/Down */}
                  {onMoveLine && (
                    <div className="flex items-center">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => onMoveLine(idx, 'up')}
                        className="p-1 rounded text-zinc-500 hover:text-zinc-200 disabled:opacity-20"
                        title="Geser ke atas"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === storyboard.lines.length - 1}
                        onClick={() => onMoveLine(idx, 'down')}
                        className="p-1 rounded text-zinc-500 hover:text-zinc-200 disabled:opacity-20"
                        title="Geser ke bawah"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Delete Line Button */}
                  {onDeleteLine && (
                    <button
                      type="button"
                      disabled={storyboard.lines.length <= 2}
                      onClick={() => onDeleteLine(idx)}
                      className="p-1 rounded text-zinc-600 hover:text-red-400 disabled:opacity-20 transition-colors"
                      title={storyboard.lines.length <= 2 ? 'Minimal 2 baris dialog' : 'Hapus baris ini'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Editable Textarea */}
              <textarea
                rows={2}
                value={line.text}
                onChange={(e) => onUpdateLine(idx, e.target.value)}
                placeholder="Ketik baris dialog di sini..."
                className="w-full bg-transparent text-sm text-zinc-200 focus:outline-none resize-none font-medium leading-relaxed border-t border-zinc-900 pt-1.5"
              />
            </div>
          );
        })}
      </div>

      {/* Add New Line Button */}
      {onAddLine && (
        <button
          type="button"
          onClick={onAddLine}
          className="w-full py-2.5 px-4 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border-2 border-dashed border-zinc-700 hover:border-orange-500 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4 text-orange-500" />
          <span>Tambah Baris Dialog Baru</span>
        </button>
      )}

      {/* Comment Magnet Hook Outro Input */}
      <div className="pt-3 border-t border-zinc-800 flex flex-col gap-1.5">
        <label className="text-xs font-black uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Kalimat Pemancing Komentar (Outro Magnet)</span>
        </label>
        <input
          type="text"
          value={storyboard.commentMagnetHook}
          onChange={(e) => onUpdateHook(e.target.value)}
          className="w-full bg-[#141413] text-sm text-white px-3.5 py-2.5 rounded-xl border border-zinc-800 focus:border-orange-500 focus:outline-none font-medium"
        />
      </div>
    </div>
  );
};
