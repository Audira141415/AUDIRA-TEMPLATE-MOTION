'use client';

import React from 'react';
import { StudioWorkflowStep, WORKFLOW_STEPS } from './WorkflowStepper';
import { ChevronLeft, ChevronRight, Sparkles, Video } from 'lucide-react';

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
    <div className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-[#141413] border-2 border-zinc-800 shadow-brutal mt-2">
      {/* Previous Step Button */}
      {!isFirst ? (
        <button
          type="button"
          onClick={onPrev}
          className="px-3 sm:px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-zinc-400" />
          <span className="hidden sm:inline">Kembali:</span>
          <span className="truncate max-w-[120px]">{prevMeta?.label || 'Kembali'}</span>
        </button>
      ) : (
        <div className="text-[10px] font-mono text-zinc-500 uppercase px-2">
          • Mulai Langkah 1 •
        </div>
      )}

      {/* Step Indicator */}
      <div className="text-center font-mono text-xs text-zinc-400 hidden xs:block">
        <span className="font-bold text-orange-400">{currentMeta.stepNum}</span> / {WORKFLOW_STEPS.length}
      </div>

      {/* Next Step Button */}
      {!isLast ? (
        <button
          type="button"
          onClick={onNext}
          className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-black uppercase tracking-wider shadow-brutal flex items-center gap-2 border border-black transition-transform active:translate-y-0.5 ml-auto"
        >
          <span>{currentMeta.nextText}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onOpenExport}
          className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black uppercase tracking-wider shadow-brutal flex items-center gap-2 border border-black transition-transform active:translate-y-0.5 ml-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Buka Studio Render MP4 🎬</span>
        </button>
      )}
    </div>
  );
};

