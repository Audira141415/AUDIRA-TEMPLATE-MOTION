'use client';

import React from 'react';
import Link from 'next/link';
import { MoodType, MotionFormat } from '@/types/motion';
import { Sparkles, Wand2, ArrowRight, Cpu, Settings } from 'lucide-react';
import { MOODS, moodById } from '@/lib/moods';

interface Props {
  idea: string;
  onChangeIdea: (idea: string) => void;
  selectedMood: MoodType;
  onChangeMood: (mood: MoodType) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  selectedFormat: MotionFormat;
  selectedProvider?: string;
  onChangeProvider?: (provider: string) => void;
}

const STARTER_PROMPTS = [
  'Ash mau resign jadi streamer padahal baru punya 40 followers',
  'Kenapa kita suka menunda pekerjaan padahal deadline besok pagi',
  'Meeting mendadak jam 16:58 padahal tas sudah dirapikan',
  'Kasus penipuan OTW padahal pelaku terbukti masih pakai handuk',
  '3 rumus retensi algoritma video pendek agar tembus 1 juta views',
  'Kisah penemu teknologi 4G dan WiFi asal Kediri yang mendunia',
];

const PROVIDER_OPTIONS = [
  { id: 'auto', label: '🤖 Auto (Sesuai Konfigurasi Admin)' },
  { id: 'audira_route', label: '🚀 Audira Route (9Router Gateway)' },
  { id: 'ollama', label: '🏠 Ollama Local (100% Offline & Gratis)' },
  { id: 'gemini', label: '⚡ Google Gemini (3.8 Flash)' },
  { id: 'claude', label: '🧠 Anthropic Claude (3.5 Sonnet)' },
  { id: 'openai', label: '🌐 OpenAI (GPT-4o / Omni)' },
  { id: 'deepseek', label: '🔥 DeepSeek (V3 / R1)' },
  { id: 'groq', label: '⚡ Groq (Llama 3.3 Ultra Fast)' },
];

export const IdeaInputPanel: React.FC<Props> = ({
  idea,
  onChangeIdea,
  selectedMood,
  onChangeMood,
  onGenerate,
  isGenerating,
  selectedFormat,
  selectedProvider = 'auto',
  onChangeProvider,
}) => {
  return (
    <div className="bg-zinc-900/90 p-5 rounded-3xl border-2 border-zinc-800 shadow-brutal flex flex-col gap-4">
      {/* Title & Engine Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
        <label className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span>Ketik Ide Cerita Kamu</span>
        </label>

        {/* AI Model Badge / Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#141413] px-2.5 py-1 rounded-xl border border-zinc-700/80">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={selectedProvider}
              onChange={(e) => onChangeProvider && onChangeProvider(e.target.value)}
              className="bg-transparent text-[11px] font-bold text-zinc-200 focus:outline-none cursor-pointer"
            >
              {PROVIDER_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id} className="bg-zinc-900 text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <Link
            href="/admin"
            title="Buka Pengaturan API Key di Admin"
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700 transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          rows={3}
          value={idea}
          onChange={(e) => onChangeIdea(e.target.value)}
          placeholder="Contoh: Ash mau resign dari kantor buat streaming game, tapi AI-nya kasih fakta menohok..."
          className="w-full bg-[#141413] text-white p-4 rounded-2xl border-2 border-zinc-800 focus:border-orange-500 focus:outline-none text-sm placeholder:text-zinc-600 resize-none font-medium transition-colors"
        />
      </div>

      {/* Quick Starters Pills */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          Atau pilih ide cepat:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {STARTER_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChangeIdea(prompt)}
              className="text-left text-[11px] px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/60 hover:text-white transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Mood Selector Chips */}
      <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800">
        <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
          Pilih Emosi Karakter (7 Mood)
        </label>
        <p className="text-[11px] text-zinc-500 -mt-1">
          Ide sama, mood beda: kata-kata, ekspresi, suara, dan tempo ikut berubah.
        </p>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => {
            const isSelected = selectedMood === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onChangeMood(m.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-orange-600 text-white border-black shadow-brutal-sm'
                    : 'bg-zinc-800/70 text-zinc-300 border-zinc-700/80 hover:bg-zinc-800'
                }`}
              >
                <span>{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-orange-300/90 font-semibold">
          {moodById(selectedMood).emoji} {moodById(selectedMood).label}: {moodById(selectedMood).tagline}
        </p>
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className="mt-2 w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-sm uppercase tracking-wider shadow-brutal flex items-center justify-center gap-2 border-2 border-black transition-transform active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Sedang Meracik Naskah & Motion...</span>
          </>
        ) : (
          <>
            <Wand2 className="w-5 h-5" />
            <span>Generate Video Reel Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
};
