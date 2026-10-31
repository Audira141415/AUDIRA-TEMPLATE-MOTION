'use client';

import React from 'react';
import { Storyboard, StoryboardLine, SpeakerEmotion } from '@/types/motion';
import { Edit3, MessageSquare, Clock, Plus, Trash2, ArrowUpDown, ChevronUp, ChevronDown, User, Bot } from 'lucide-react';

interface Props {
  storyboard: Storyboard;
  onUpdateLine: (lineIndex: number, newText: string, newEmotion?: SpeakerEmotion) => void;
  onAddLine?: () => void;
  onDeleteLine?: (lineIndex: number) => void;
  onSwapSpeaker?: (lineIndex: number) => void;
  onMoveLine?: (lineIndex: number, direction: 'up' | 'down') => void;
  onUpdateHook: (newHook: string) => void;
}

const EMOTIONS: SpeakerEmotion[] = ['neutral', 'hyped', 'angry', 'shocked', 'smug', 'thoughtful', 'sarcastic'];

export const ScriptEditorPanel: React.FC<Props> = ({
  storyboard,
  onUpdateLine,
  onAddLine,
  onDeleteLine,
  onSwapSpeaker,
  onMoveLine,
  onUpdateHook,
}) => {
  const charA = storyboard.characters.characterA.name;
  const charB = storyboard.characters.characterB.name;

  return (
    <div className="bg-zinc-900/90 p-5 rounded-3xl border-2 border-zinc-800 shadow-brutal flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-orange-500" />
          <span>Editor Naskah & Beat Waktu</span>
        </label>
        <span className="text-[11px] text-zinc-400 font-mono">
          {storyboard.lines.length} Baris Dialog • {storyboard.durationSec.toFixed(1)}s Total
        </span>
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
