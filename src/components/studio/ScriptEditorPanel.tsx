'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Storyboard, StoryboardLine, SpeakerEmotion, VisualLayoutConfig } from '@/types/motion';
import { 
  Edit3, MessageSquare, Clock, Plus, Trash2, ArrowUpDown, 
  ChevronUp, ChevronDown, User, Bot, Type, MapPin, Volume2, Square, 
  Loader2, Zap, Sparkles, Undo2, Redo2, Image as ImageIcon, CheckCircle2
} from 'lucide-react';
import { browserAudio } from '@/lib/browser-audio';
import { MediaUploaderModal } from './MediaUploaderModal';

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
  const charA = storyboard.characters?.characterA?.name || 'Ash';

  const [playingLineId, setPlayingLineId] = useState<string | null>(null);
  const [loadingLineId, setLoadingLineId] = useState<string | null>(null);
  const [isBatchSyncing, setIsBatchSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState<{ cur: number; total: number } | null>(null);
  const [mediaNotice, setMediaNotice] = useState<string | null>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  // Keyboard shortcut listeners for Ctrl+Z and Ctrl+Y
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          if (onRedo && canRedo) {
            e.preventDefault();
            browserAudio.playClick('soft');
            onRedo();
          }
        } else {
          if (onUndo && canUndo) {
            e.preventDefault();
            browserAudio.playClick('soft');
            onUndo();
          }
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        if (onRedo && canRedo) {
          e.preventDefault();
          browserAudio.playClick('soft');
          onRedo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onUndo, onRedo, canUndo, canRedo]);

  const handleAuditionLine = async (line: StoryboardLine) => {
    browserAudio.playClick('normal');
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
    browserAudio.playClick('sharp');
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
    browserAudio.playClick('soft');
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

  const handleRemoveMedia = () => {
    browserAudio.playClick('soft');
    if (onUpdateVisualLayout) {
      onUpdateVisualLayout({
        ...(storyboard.visualLayout || {}),
        customMediaUrl: undefined,
        customMediaLabel: undefined,
      });
    }
  };

  return (
    <div className="bg-card p-4 sm:p-5 rounded-3xl border border-line shadow-card flex flex-col gap-4">
      {/* Top Header & Fast Action Toolbar */}
      <div className="flex items-center justify-between pb-3 border-b border-line flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-accent/15 text-accent border border-accent/30 flex items-center justify-center">
            <Edit3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-paper flex items-center gap-1.5 font-display">
              <span>Editor Naskah & Beat</span>
              <span className="text-[10px] text-muted font-mono font-normal">
                ({storyboard.lines.length} Baris • {storyboard.durationSec.toFixed(1)}s)
              </span>
            </h3>
            <p className="text-[11px] text-muted">
              Edit naskah, kalibrasi suara AI, dan tambahkan media visual
            </p>
          </div>
        </div>

        {/* Undo / Redo Buttons */}
        <div className="flex items-center gap-1 bg-tile p-1 rounded-xl border border-edge">
          <button
            type="button"
            onClick={() => {
              browserAudio.playClick('soft');
              onUndo && onUndo();
            }}
            disabled={!canUndo}
            className={`p-2 rounded-lg text-xs transition-colors flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-accent ${
              canUndo ? 'text-paper hover:bg-tile-2' : 'text-dim cursor-not-allowed opacity-40'
            }`}
            title="Urungkan Perubahan (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              browserAudio.playClick('soft');
              onRedo && onRedo();
            }}
            disabled={!canRedo}
            className={`p-2 rounded-lg text-xs transition-colors flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-accent ${
              canRedo ? 'text-paper hover:bg-tile-2' : 'text-dim cursor-not-allowed opacity-40'
            }`}
            title="Ulangi Perubahan (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* QUICK POWER TOOLS: BATCH VOICE SYNC + AUTO-EMOJI + B-ROLL UPLOAD */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-tile p-2.5 rounded-2xl border border-line">
        {/* Tool 1: Batch Voice Sync */}
        <button
          type="button"
          onClick={handleBatchVoiceSync}
          disabled={isBatchSyncing}
          className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-accent ${
            isBatchSyncing
              ? 'bg-accent/25 text-accent border-accent animate-pulse'
              : 'bg-accent/15 hover:bg-accent/25 text-accent border-accent/40 hover:border-accent'
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
              <Zap className="w-3.5 h-3.5 text-accent" />
              <span>Sync Suara AI</span>
            </>
          )}
        </button>

        {/* Tool 2: Magic Auto-Emoji */}
        <button
          type="button"
          onClick={handleAutoEmoji}
          className="min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 hover:border-amber-500 transition-all flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-accent"
          title="Otomatis tambahkan emoji kinetik viral di kata-kata penting"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Auto-Emoji</span>
        </button>

        {/* Tool 3: Upload Screenshot / B-Roll */}
        <div>
          <button
            type="button"
            onClick={() => {
              browserAudio.playClick('soft');
              setIsMediaModalOpen(true);
            }}
            className="w-full min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold bg-cyan-600/15 hover:bg-cyan-600/25 text-cyan-300 border border-cyan-500/40 hover:border-cyan-500 transition-all flex items-center justify-center gap-1.5 truncate focus-visible:ring-2 focus-visible:ring-accent"
            title="Buka pengunggah bukti screenshot chat, logo, atau grafik b-roll"
          >
            <ImageIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">
              {storyboard.visualLayout?.customMediaLabel ? 'Kelola Media Bukti' : 'Upload Bukti'}
            </span>
          </button>
        </div>
      </div>

      {/* Notice & Active Custom Media Pill */}
      {storyboard.visualLayout?.customMediaUrl && (
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800 text-xs">
          <div className="flex items-center gap-2 truncate">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-cyan-200 truncate font-mono text-[11px]">
              Media aktif: {storyboard.visualLayout.customMediaLabel || 'Foto Kustom'}
            </span>
          </div>
          <button
            type="button"
            onClick={handleRemoveMedia}
            className="text-muted hover:text-red-400 text-[10px] font-bold px-2 py-1 rounded border border-line shrink-0 ml-2"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-tile p-3 rounded-2xl border border-line">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black uppercase tracking-wider text-muted flex items-center gap-1 font-mono">
            <Type className="w-3 h-3 text-accent" />
            <span>Judul Utama / Headline Reel</span>
          </label>
          <input
            type="text"
            value={storyboard.title}
            onChange={(e) => onUpdateTitle && onUpdateTitle(e.target.value)}
            placeholder="Masukkan judul reel..."
            className="w-full bg-ink border border-line rounded-xl px-3 py-2 text-xs text-paper font-bold focus:outline-none focus:border-accent focus-visible:ring-1 focus-visible:ring-accent"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black uppercase tracking-wider text-muted flex items-center gap-1 font-mono">
            <MapPin className="w-3 h-3 text-cyan-400" />
            <span>Lokasi Liputan / Scene</span>
          </label>
          <input
            type="text"
            value={storyboard.locationName || ''}
            onChange={(e) => onUpdateLocation && onUpdateLocation(e.target.value)}
            placeholder="Contoh: News Studio Live, Cafe Jakarta..."
            className="w-full bg-ink border border-line rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-400 focus-visible:ring-1 focus-visible:ring-cyan-400"
          />
        </div>
      </div>

      {/* Script Lines List */}
      <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
        {storyboard.lines.map((line, idx) => {
          const isCharA = line.speaker === charA;
          const isPlayingThisLine = playingLineId === line.id;

          return (
            <div
              key={line.id || idx}
              className={`p-3.5 rounded-2xl transition-all flex flex-col gap-2.5 border ${
                isPlayingThisLine
                  ? 'border-accent shadow-[0_0_20px_rgba(255,106,42,0.25)] ring-1 ring-accent/60 bg-tile-2'
                  : isCharA
                  ? 'bg-tile border-accent/20 hover:border-accent/40'
                  : 'bg-tile border-cyan-500/20 hover:border-cyan-500/40'
              }`}
            >
              {/* Header: Speaker Toggle + Timestamp + Emotion + Actions */}
              <div className="flex items-center justify-between text-xs gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  {/* Speaker Badge & Swap Button */}
                  <button
                    type="button"
                    onClick={() => {
                      browserAudio.playClick('soft');
                      onSwapSpeaker && onSwapSpeaker(idx);
                    }}
                    title="Klik untuk ganti pembicara"
                    className={`min-h-[28px] px-2.5 py-1 rounded-full font-black text-[11px] border flex items-center gap-1 transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-accent ${
                      isCharA
                        ? 'bg-accent/15 text-accent border-accent/40 hover:bg-accent/25'
                        : 'bg-cyan-600/15 text-cyan-400 border-cyan-500/40 hover:bg-cyan-600/25'
                    }`}
                  >
                    {isCharA ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                    <span>{line.speaker}</span>
                    <ArrowUpDown className="w-2.5 h-2.5 opacity-60" />
                  </button>

                  {/* Timing indicator */}
                  <span className="text-[10px] text-muted font-mono flex items-center gap-1 ml-1">
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
                    className={`min-h-[28px] px-2.5 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition-all focus-visible:ring-2 focus-visible:ring-accent ${
                      isPlayingThisLine
                        ? 'bg-accent text-ink border-accent font-black shadow-sm animate-pulse'
                        : 'bg-ink text-muted border-line hover:text-paper hover:border-edge'
                    }`}
                    title="Dengarkan suara Cartesia AI untuk baris ini"
                  >
                    {loadingLineId === line.id ? (
                      <Loader2 className="w-3 h-3 animate-spin text-accent" />
                    ) : isPlayingThisLine ? (
                      <Square className="w-3 h-3 fill-ink text-ink" />
                    ) : (
                      <Volume2 className="w-3 h-3 text-accent" />
                    )}
                    <span className="hidden sm:inline">
                      {loadingLineId === line.id ? 'Memuat' : isPlayingThisLine ? 'Stop' : 'Suara'}
                    </span>
                  </button>

                  {/* Emotion Selector */}
                  <select
                    value={line.emotion}
                    onChange={(e) => onUpdateLine(idx, line.text, e.target.value as SpeakerEmotion)}
                    className="min-h-[28px] bg-ink text-muted text-[10px] font-bold px-2 py-1 rounded-lg border border-line focus:outline-none focus:border-accent cursor-pointer"
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
                        onClick={() => {
                          browserAudio.playClick('soft');
                          onMoveLine(idx, 'up');
                        }}
                        className="p-1.5 rounded text-muted hover:text-paper disabled:opacity-20 transition-colors"
                        title="Geser ke atas"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === storyboard.lines.length - 1}
                        onClick={() => {
                          browserAudio.playClick('soft');
                          onMoveLine(idx, 'down');
                        }}
                        className="p-1.5 rounded text-muted hover:text-paper disabled:opacity-20 transition-colors"
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
                      onClick={() => {
                        browserAudio.playClick('soft');
                        onDeleteLine(idx);
                      }}
                      className="p-1.5 rounded text-muted hover:text-red-400 disabled:opacity-20 transition-colors"
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
                className="w-full bg-transparent text-sm text-paper placeholder:text-muted/50 focus:outline-none resize-none font-medium leading-relaxed border-t border-line/50 pt-2"
              />
            </div>
          );
        })}
      </div>

      {/* Add New Line Button */}
      {onAddLine && (
        <button
          type="button"
          onClick={() => {
            browserAudio.playClick('normal');
            onAddLine();
          }}
          className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-tile hover:bg-tile-2 text-muted hover:text-paper border border-dashed border-edge hover:border-accent text-xs font-bold flex items-center justify-center gap-1.5 transition-all focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Plus className="w-4 h-4 text-accent" />
          <span>Tambah Baris Dialog Baru</span>
        </button>
      )}

      {/* Comment Magnet Hook Outro Input */}
      <div className="pt-3 border-t border-line flex flex-col gap-1.5">
        <label className="text-xs font-black uppercase tracking-wider text-accent flex items-center gap-1.5 font-display">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Kalimat Pemancing Komentar (Outro Magnet)</span>
        </label>
        <input
          type="text"
          value={storyboard.commentMagnetHook}
          onChange={(e) => onUpdateHook(e.target.value)}
          className="w-full bg-tile text-sm text-paper px-3.5 py-2.5 rounded-xl border border-line focus:border-accent focus-visible:ring-2 focus-visible:ring-accent/40 focus:outline-none font-medium"
        />
      </div>

      {/* Media Uploader Modal */}
      <MediaUploaderModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        visualLayout={storyboard.visualLayout}
        onUpdateVisualLayout={(layout) => {
          if (onUpdateVisualLayout) onUpdateVisualLayout(layout);
        }}
      />
    </div>
  );
};
