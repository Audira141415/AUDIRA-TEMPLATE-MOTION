'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MoodType, MotionFormat } from '@/types/motion';
import { Sparkles, Wand2, ArrowRight, Cpu, Settings, Loader2 } from 'lucide-react';
import { MOODS, moodById } from '@/lib/moods';
import { browserAudio } from '@/lib/browser-audio';

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

const GENERATION_STAGES = [
  'Menganalisis premis & sudut pandang cerita...',
  'Menyusun hook 3 detik pertama pemicu retensi...',
  'Menyelaraskan punchline & dialog karakter...',
  'Menghitung beat pacing & sinkronisasi motion...',
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
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (!isGenerating) {
      setStageIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % GENERATION_STAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleSelectStarter = (prompt: string) => {
    browserAudio.playClick('soft');
    onChangeIdea(prompt);
  };

  const handleSelectMood = (mood: MoodType) => {
    browserAudio.playClick('normal');
    onChangeMood(mood);
  };

  const handleTriggerGenerate = () => {
    browserAudio.playClick('sharp');
    onGenerate();
  };

  return (
    <div className="bg-card p-5 rounded-3xl border border-line shadow-card flex flex-col gap-4">
      {/* Title & Engine Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
        <label className="text-xs font-black uppercase tracking-wider text-paper flex items-center gap-2 font-display">
          <Sparkles className="w-4 h-4 text-accent" />
          <span>Ketik Ide Cerita Kamu</span>
        </label>

        {/* AI Model Badge / Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-tile px-2.5 py-1.5 rounded-xl border border-edge">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={selectedProvider}
              onChange={(e) => onChangeProvider && onChangeProvider(e.target.value)}
              className="bg-transparent text-[11px] font-bold text-paper focus:outline-none cursor-pointer"
            >
              {PROVIDER_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id} className="bg-ink text-paper">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <Link
            href="/admin"
            title="Buka Pengaturan API Key di Admin"
            className="p-2 rounded-xl bg-tile hover:bg-tile-2 text-muted hover:text-paper border border-edge transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-accent"
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
          className="w-full bg-tile text-paper p-4 rounded-2xl border border-line focus:border-accent focus-visible:ring-2 focus-visible:ring-accent/40 focus:outline-none text-sm placeholder:text-muted/60 resize-none font-medium transition-colors"
        />
      </div>

      {/* Quick Starters Pills */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted font-mono">
          Atau pilih ide cepat:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {STARTER_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectStarter(prompt)}
              className="text-left text-[11px] px-3 py-1.5 rounded-xl bg-tile hover:bg-tile-2 text-muted hover:text-paper border border-line hover:border-edge transition-colors active:scale-95 focus-visible:ring-2 focus-visible:ring-accent"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Mood Selector Chips */}
      <div className="flex flex-col gap-2 pt-2 border-t border-line">
        <label className="text-xs font-black uppercase tracking-wider text-paper font-display">
          Pilih Emosi Karakter (7 Mood)
        </label>
        <p className="text-[11px] text-muted -mt-1">
          Ide sama, mood beda: kata-kata, ekspresi, suara, dan tempo ikut berubah.
        </p>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => {
            const isSelected = selectedMood === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => handleSelectMood(m.id)}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-accent ${
                  isSelected
                    ? 'bg-accent text-ink border-accent shadow-[0_0_15px_rgba(255,106,42,0.3)] font-black'
                    : 'bg-tile text-muted border-line hover:border-edge hover:text-paper hover:bg-tile-2'
                }`}
              >
                <span>{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-accent font-semibold">
          {moodById(selectedMood).emoji} {moodById(selectedMood).label}: {moodById(selectedMood).tagline}
        </p>
      </div>

      {/* Live Generating Status Bar */}
      {isGenerating && (
        <div className="p-3.5 rounded-2xl bg-tile border border-accent/40 flex flex-col gap-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-accent animate-spin" />
              <span className="font-bold text-paper font-mono text-[11px]">
                {GENERATION_STAGES[stageIndex]}
              </span>
            </div>
            <span className="text-[10px] text-muted font-mono">
              Fase {stageIndex + 1}/{GENERATION_STAGES.length}
            </span>
          </div>
          <div className="w-full bg-ink h-1.5 rounded-full overflow-hidden border border-line">
            <div
              className="bg-gradient-to-r from-accent via-amber-400 to-accent h-full transition-all duration-500 animate-pulse"
              style={{ width: `${((stageIndex + 1) / GENERATION_STAGES.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleTriggerGenerate}
        disabled={isGenerating}
        className="mt-2 w-full min-h-[48px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-accent via-amber-500 to-accent hover:opacity-95 text-ink font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 border border-accent/40 transition-transform active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-accent"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
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
