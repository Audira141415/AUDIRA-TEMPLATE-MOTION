'use client';

import React from 'react';
import { 
  Palette, Wand2, FileText, Sliders, Share2, 
  CheckCircle2, ChevronRight, ChevronLeft, Sparkles, Layers, Award
} from 'lucide-react';

export type StudioWorkflowStep = 'format' | 'idea' | 'script' | 'visual' | 'social';

export interface StepMeta {
  id: StudioWorkflowStep;
  stepNum: number;
  label: string;
  shortLabel: string;
  desc: string;
  badge: string;
  nextText: string;
  icon: React.ReactNode;
}

export const WORKFLOW_STEPS: StepMeta[] = [
  {
    id: 'format',
    stepNum: 1,
    label: 'Format & Cast',
    shortLabel: '1. Format',
    badge: 'Desain & Karakter',
    desc: 'Tentukan gaya template video (25 Archetypes) dan karakter pemeran / pembicara.',
    nextText: 'Lanjut: Tulis Ide & Prompt AI',
    icon: <Palette className="w-3.5 h-3.5" />,
  },
  {
    id: 'idea',
    stepNum: 2,
    label: 'Ide & AI Prompt',
    shortLabel: '2. Ide AI',
    badge: 'Generator Naskah',
    desc: 'Ketik topik atau masalah konten, pilih emosi mood, dan racik naskah dengan AI.',
    nextText: 'Lanjut: Edit Dialog & Suara AI',
    icon: <Wand2 className="w-3.5 h-3.5" />,
  },
  {
    id: 'script',
    stepNum: 3,
    label: 'Naskah & Suara AI',
    shortLabel: '3. Naskah',
    badge: 'Voiceover & Beat',
    desc: 'Edit dialog, 1-klik Sync Suara Cartesia AI Indonesia, Auto-Emoji, dan upload screenshot bukti.',
    nextText: 'Lanjut: Styling Visual & Mixer',
    icon: <FileText className="w-3.5 h-3.5" />,
  },
  {
    id: 'visual',
    stepNum: 4,
    label: 'Visual & Audio Mixer',
    shortLabel: '4. Visual',
    badge: 'Animasi & Musik',
    desc: 'Pilih 5 gaya kinetik subtitle (MrBeast/Ali Abdaal), font kreator, tema warna, & mixer audio BGM.',
    nextText: 'Lanjut: Review & Render MP4',
    icon: <Sliders className="w-3.5 h-3.5" />,
  },
  {
    id: 'social',
    stepNum: 5,
    label: 'Render & Viral Kit',
    shortLabel: '5. Render MP4',
    badge: 'Export Video Final',
    desc: 'Render video MP4 1080x1920 HD, download file video, dan salin judul + caption medsos.',
    nextText: 'Mulai Render Video MP4 Sekarang 🎬',
    icon: <Share2 className="w-3.5 h-3.5" />,
  },
];

interface Props {
  currentStep: StudioWorkflowStep;
  onSelectStep: (step: StudioWorkflowStep) => void;
  expandAllPanels: boolean;
  onToggleExpandAll: () => void;
}

export const WorkflowStepper: React.FC<Props> = ({
  currentStep,
  onSelectStep,
  expandAllPanels,
  onToggleExpandAll,
}) => {
  const currentMeta = WORKFLOW_STEPS.find((s) => s.id === currentStep) || WORKFLOW_STEPS[0];
  const progressPercent = Math.round((currentMeta.stepNum / WORKFLOW_STEPS.length) * 100);

  return (
    <div className="flex flex-col gap-3 bg-[#141413] p-3 sm:p-4 rounded-3xl border-2 border-zinc-800 shadow-brutal">
      {/* Top Stepper Timeline Bar */}
      <div className="flex items-center justify-between gap-1 sm:gap-2 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-1 sm:gap-1.5 flex-1 overflow-x-auto py-1 scrollbar-none">
          {WORKFLOW_STEPS.map((step, idx) => {
            const isActive = currentStep === step.id && !expandAllPanels;
            const isCompleted = step.stepNum < currentMeta.stepNum;

            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => onSelectStep(step.id)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-brutal-orange scale-102 ring-2 ring-orange-500/50'
                      : isCompleted
                      ? 'bg-zinc-900 border border-emerald-600/40 text-emerald-400 hover:text-white hover:bg-zinc-800'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                  title={`${step.label}: ${step.desc}`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                    isActive
                      ? 'bg-black text-orange-400'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {isCompleted ? '✓' : step.stepNum}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                  <span className="sm:hidden">{step.shortLabel}</span>
                </button>

                {/* Connector Arrow */}
                {idx < WORKFLOW_STEPS.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-700 shrink-0 hidden md:inline" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* View Mode Toggle: Stepper Mode vs Expand All */}
        <button
          type="button"
          onClick={onToggleExpandAll}
          className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-bold border transition-colors ${
            expandAllPanels
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'text-zinc-500 border-zinc-800 hover:text-zinc-300'
          }`}
          title="Buka semua modul sekaligus tanpa alur step"
        >
          <Layers className="w-3 h-3" />
          <span className="hidden lg:inline">{expandAllPanels ? 'Alur Step' : 'Lihat Semua'}</span>
        </button>
      </div>

      {/* Step Context Banner & Progress Bar */}
      {!expandAllPanels && (
        <div className="flex flex-col gap-2 pt-0.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-orange-600/20 text-orange-400 border border-orange-500/30 text-[10px] font-black uppercase font-mono tracking-wider">
                Langkah {currentMeta.stepNum} dari 5
              </span>
              <span className="font-extrabold text-white text-xs sm:text-sm">
                {currentMeta.label}
              </span>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">
              Progres: <strong className="text-orange-400">{progressPercent}%</strong>
            </span>
          </div>

          {/* Micro Progress Bar */}
          <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
            <div
              className="bg-gradient-to-r from-orange-600 via-amber-500 to-emerald-400 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Actionable Micro-Guidance */}
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            💡 {currentMeta.desc}
          </p>
        </div>
      )}
    </div>
  );
};

