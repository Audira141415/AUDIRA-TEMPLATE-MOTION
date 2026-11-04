'use client';

import React from 'react';
import { StudioWorkflowStep, WORKFLOW_STEPS } from './WorkflowStepper';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { browserAudio } from '@/lib/browser-audio';

interface Props {
  currentStep: StudioWorkflowStep;
  onNext: () => void;
  onPrev: () => void;
  onOpenExport?: () => void;
}

export const StepNavigationBar: React.FC<Props> = ({
  currentStep,
  onNext,
  onPrev,
  onOpenExport,
}) => {
  const currentIndex = WORKFLOW_STEPS.findIndex((s) => s.id === currentStep);
  const currentMeta = WORKFLOW_STEPS[currentIndex] || WORKFLOW_STEPS[0];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === WORKFLOW_STEPS.length - 1;

  const nextMeta = !isLast ? WORKFLOW_STEPS[currentIndex + 1] : null;
  const prevMeta = !isFirst ? WORKFLOW_STEPS[currentIndex - 1] : null;

  return (
    <div className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-card border border-line shadow-card mt-2">
      {/* Previous Step Button */}
      {!isFirst ? (
        <button
          type="button"
          onClick={() => {
            browserAudio.playClick('soft');
            onPrev();
          }}
          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-tile hover:bg-tile-2 text-muted hover:text-paper border border-edge text-xs font-bold flex items-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-accent"
        >
          <ChevronLeft className="w-4 h-4 text-muted" />
          <span className="hidden sm:inline">Kembali:</span>
          <span className="truncate max-w-[120px]">{prevMeta?.label || 'Kembali'}</span>
        </button>
      ) : (
        <div className="text-[10px] font-mono text-dim uppercase px-2">
          • Mulai Langkah 1 •
        </div>
      )}

      {/* Step Indicator */}
      <div className="text-center font-mono text-xs text-muted hidden xs:block">
        <span className="font-bold text-accent">{currentMeta.stepNum}</span> / {WORKFLOW_STEPS.length}
      </div>

      {/* Next Step Button */}
      {!isLast ? (
        <button
          type="button"
          onClick={() => {
            browserAudio.playClick('normal');
            onNext();
          }}
          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent via-amber-500 to-accent hover:opacity-95 text-ink text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-2 border border-accent/40 transition-transform active:translate-y-0.5 ml-auto focus-visible:ring-2 focus-visible:ring-accent"
        >
          <span>{currentMeta.nextText}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            browserAudio.playClick('sharp');
            onOpenExport && onOpenExport();
          }}
          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-2 border border-black transition-transform active:translate-y-0.5 ml-auto focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Sparkles className="w-4 h-4" />
          <span>Buka Studio Render MP4 🎬</span>
        </button>
      )}
    </div>
  );
};
