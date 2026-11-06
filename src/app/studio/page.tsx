'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { SiteHeader } from '@/components/site/SiteHeader';
import { FormatSelector } from '@/components/studio/FormatSelector';
import { IdeaInputPanel } from '@/components/studio/IdeaInputPanel';
import { ScriptEditorPanel } from '@/components/studio/ScriptEditorPanel';
import { VisualSubtitlePanel } from '@/components/studio/VisualSubtitlePanel';
import { CastPicker } from '@/components/studio/CastPicker';
import { ExportModal } from '@/components/studio/ExportModal';
import { RenderHistoryModal } from '@/components/studio/RenderHistoryModal';
import { WorkflowStepper, StudioWorkflowStep, WORKFLOW_STEPS } from '@/components/studio/WorkflowStepper';
import { StepNavigationBar } from '@/components/studio/StepNavigationBar';
import { RenderLaunchpad } from '@/components/studio/RenderLaunchpad';
import { MotionStage } from '@/components/video-engine/MotionStage';
import { DEMO_STORYBOARDS } from '@/lib/templates';
import { generateStoryboardFromIdea } from '@/lib/script-generator';
import { rebalanceLines } from '@/lib/storyboard-utils';
import { HUMAN_CAST, AI_CAST, SCENE_LOCATIONS, CastMember, LocationScene } from '@/lib/cast-catalog';
import { MotionFormat, MoodType, Storyboard, SpeakerEmotion, StoryboardLine, SubtitleConfig, VisualLayoutConfig } from '@/types/motion';
import { 
  Sparkles, Award, Clock, MessageSquare, ArrowUpRight, FolderOpen 
} from 'lucide-react';

export default function StudioPage() {
  const [selectedFormat, setSelectedFormat] = useState<MotionFormat>('character_banter');
  const [selectedMood, setSelectedMood] = useState<MoodType>('hyped');
  const [ideaInput, setIdeaInput] = useState<string>('Ash mau resign jadi streamer padahal baru punya 40 followers');
  const [selectedProvider, setSelectedProvider] = useState<string>('auto');
  const [activeStep, setActiveStep] = useState<StudioWorkflowStep>('format');
  const [expandAllPanels, setExpandAllPanels] = useState<boolean>(false);
  const [isVaultOpen, setIsVaultOpen] = useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idea = params.get('idea');
    const format = params.get('format') as MotionFormat | null;
    const mood = params.get('mood') as MoodType | null;
    const isImport = params.get('import') === 'latest';

    if (isImport) {
      try {
        const stored = sessionStorage.getItem('audira_imported_storyboard');
        if (stored) {
          const parsed = JSON.parse(stored) as Storyboard;
          if (parsed && Array.isArray(parsed.lines) && parsed.format) {
            setStoryboard(parsed);
            setSelectedFormat(parsed.format);
            if (parsed.mood) setSelectedMood(parsed.mood);
            if (parsed.concept) setIdeaInput(parsed.concept);
            setActiveStep('script');
            return;
          }
        }
      } catch (err) {
        console.error('Failed to load imported storyboard:', err);
      }
    }

    if (idea) {
      setIdeaInput(idea.slice(0, 600));
      setActiveStep('idea');
    }
    if (mood && ['hyped', 'warm', 'calm', 'motivational', 'frustrated', 'angry', 'rude'].includes(mood)) {
      setSelectedMood(mood);
    }
    if (format && format in DEMO_STORYBOARDS) {
      setSelectedFormat(format);
      setStoryboard(DEMO_STORYBOARDS[format]);
    }
  }, []);

  const [storyboard, setStoryboard] = useState<Storyboard>(DEMO_STORYBOARDS['character_banter']);
  const [history, setHistory] = useState<Storyboard[]>([]);
  const [future, setFuture] = useState<Storyboard[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [scriptNotice, setScriptNotice] = useState<{ tone: 'info' | 'error'; text: string } | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Stepper forward/backward navigation
  const handleNextStep = () => {
    const curIdx = WORKFLOW_STEPS.findIndex((s) => s.id === activeStep);
    if (curIdx < WORKFLOW_STEPS.length - 1) {
      setActiveStep(WORKFLOW_STEPS[curIdx + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsExportModalOpen(true);
    }
  };

  const handlePrevStep = () => {
    const curIdx = WORKFLOW_STEPS.findIndex((s) => s.id === activeStep);
    if (curIdx > 0) {
      setActiveStep(WORKFLOW_STEPS[curIdx - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Record history snapshot before mutations
  const recordHistory = () => {
    setHistory((prev) => [...prev.slice(-25), storyboard]);
    setFuture([]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setFuture((f) => [storyboard, ...f]);
    setStoryboard(prev);
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture((f) => f.slice(1));
    setHistory((h) => [...h, storyboard]);
    setStoryboard(next);
  };

  // Switch format
  const handleSelectFormat = (format: MotionFormat) => {
    recordHistory();
    setSelectedFormat(format);
    setStoryboard(DEMO_STORYBOARDS[format]);
  };

  // Generate new script from prompt (progresses to step 3 on success)
  const handleGenerate = async () => {
    setIsGenerating(true);
    setScriptNotice(null);
    try {
      const res = await fetch('/api/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: ideaInput,
          format: selectedFormat,
          mood: selectedMood,
          provider: selectedProvider !== 'auto' ? selectedProvider : undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStoryboard(data.storyboard);
        setActiveStep('script');
        setScriptNotice({
          tone: 'info',
          text: `Naskah cerdas berhasil diracik oleh ${data.providerUsed || 'AI Engine'} (${data.modelUsed || 'Universal'}).`,
        });
        return;
      }
      const fallbackStoryboard = await generateStoryboardFromIdea(ideaInput, selectedFormat, selectedMood);
      setStoryboard(fallbackStoryboard);
      setActiveStep('script');
      if (res.status === 401) {
        setScriptNotice({ tone: 'info', text: 'Mode Tamu: Naskah otomatis diracik di browser. Masuk untuk akses API penuh.' });
      } else {
        setScriptNotice({ tone: 'info', text: `Naskah lokal dipakai: ${data.error ?? 'Lokal generator'}` });
      }
    } catch {
      const fallback = await generateStoryboardFromIdea(ideaInput, selectedFormat, selectedMood);
      setStoryboard(fallback);
      setActiveStep('script');
      setScriptNotice({ tone: 'info', text: 'Naskah lokal aktif (Offline fallback).' });
    } finally {
      setIsGenerating(false);
    }
  };

  // Cast & Location Pickers
  const handleSelectHuman = (char: CastMember) => {
    setStoryboard((prev) => {
      const oldName = prev.characters.characterA.name;
      const updatedLines = prev.lines.map((l) => ({
        ...l,
        speaker: l.speaker === oldName ? char.name : l.speaker,
      }));
      return {
        ...prev,
        characters: {
          ...prev.characters,
          characterA: { name: char.name, title: char.title, avatar: char.id },
        },
        lines: updatedLines,
      };
    });
  };

  const handleSelectAi = (char: CastMember) => {
    setStoryboard((prev) => {
      const oldName = prev.characters.characterB.name;
      const updatedLines = prev.lines.map((l) => ({
        ...l,
        speaker: l.speaker === oldName ? char.name : l.speaker,
      }));
      return {
        ...prev,
        characters: {
          ...prev.characters,
          characterB: { name: char.name, title: char.title, avatar: char.id },
        },
        lines: updatedLines,
      };
    });
  };

  const handleSelectLocation = (loc: LocationScene) => {
    setStoryboard((prev) => ({
      ...prev,
      locationName: loc.name,
    }));
  };

  const handleShuffleCast = () => {
    const randomHuman = HUMAN_CAST[Math.floor(Math.random() * HUMAN_CAST.length)];
    const randomAi = AI_CAST[Math.floor(Math.random() * AI_CAST.length)];
    const randomLoc = SCENE_LOCATIONS[Math.floor(Math.random() * SCENE_LOCATIONS.length)];

    handleSelectHuman(randomHuman);
    handleSelectAi(randomAi);
    handleSelectLocation(randomLoc);
  };

  // Update line text or emotion
  const handleUpdateLine = (lineIndex: number, newText: string, newEmotion?: SpeakerEmotion) => {
    recordHistory();
    setStoryboard((prev) => {
      const updatedLines = [...prev.lines];
      const target = { ...updatedLines[lineIndex], text: newText };
      if (newEmotion) target.emotion = newEmotion;
      updatedLines[lineIndex] = target;

      const { lines: rebalanced, totalDuration } = rebalanceLines(updatedLines);
      return { ...prev, lines: rebalanced, durationSec: totalDuration };
    });
  };

  // Batch update lines from voice sync or auto-emoji
  const handleBatchUpdateLines = (newLines: StoryboardLine[], totalDuration: number) => {
    recordHistory();
    setStoryboard((prev) => ({
      ...prev,
      lines: newLines,
      durationSec: totalDuration,
    }));
  };

  // Add new line
  const handleAddLine = () => {
    recordHistory();
    setStoryboard((prev) => {
      const lastLine = prev.lines[prev.lines.length - 1];
      const charA = prev.characters.characterA.name;
      const charB = prev.characters.characterB.name;
      const nextSpeaker = lastLine?.speaker === charA ? charB : charA;
      const nextRole = nextSpeaker === charA ? 'human' : 'ai';

      const newLine: StoryboardLine = {
        id: `line-${Date.now()}`,
        speaker: nextSpeaker,
        speakerRole: nextRole,
        text: nextRole === 'ai' ? 'Tapi menurut riset terbaru, langkah itu punya risiko tinggi.' : 'Gimana kalo kita coba eksperimen dulu selama seminggu?',
        startSec: prev.durationSec,
        durationSec: 3.2,
        emotion: 'thoughtful',
        words: [],
      };

      const { lines: rebalanced, totalDuration } = rebalanceLines([...prev.lines, newLine]);
      return { ...prev, lines: rebalanced, durationSec: totalDuration };
    });
  };

  // Delete line
  const handleDeleteLine = (lineIndex: number) => {
    recordHistory();
    setStoryboard((prev) => {
      if (prev.lines.length <= 2) return prev;
      const remaining = prev.lines.filter((_, idx) => idx !== lineIndex);
      const { lines: rebalanced, totalDuration } = rebalanceLines(remaining);
      return { ...prev, lines: rebalanced, durationSec: totalDuration };
    });
  };

  // Swap speaker
  const handleSwapSpeaker = (lineIndex: number) => {
    recordHistory();
    setStoryboard((prev) => {
      const updatedLines = [...prev.lines];
      const line = updatedLines[lineIndex];
      const charA = prev.characters.characterA.name;
      const charB = prev.characters.characterB.name;
      const isA = line.speaker === charA;

      updatedLines[lineIndex] = {
        ...line,
        speaker: isA ? charB : charA,
        speakerRole: isA ? 'ai' : 'human',
      };
      return { ...prev, lines: updatedLines };
    });
  };

  // Move line up/down
  const handleMoveLine = (lineIndex: number, direction: 'up' | 'down') => {
    recordHistory();
    setStoryboard((prev) => {
      const targetIndex = direction === 'up' ? lineIndex - 1 : lineIndex + 1;
      if (targetIndex < 0 || targetIndex >= prev.lines.length) return prev;

      const updatedLines = [...prev.lines];
      const [moved] = updatedLines.splice(lineIndex, 1);
      updatedLines.splice(targetIndex, 0, moved);

      const { lines: rebalanced, totalDuration } = rebalanceLines(updatedLines);
      return { ...prev, lines: rebalanced, durationSec: totalDuration };
    });
  };

  // Update hook outro
  const handleUpdateHook = (newHook: string) => {
    setStoryboard((prev) => ({ ...prev, commentMagnetHook: newHook }));
  };

  // Update title & location
  const handleUpdateTitle = (newTitle: string) => {
    setStoryboard((prev) => ({ ...prev, title: newTitle }));
  };

  const handleUpdateLocation = (newLocation: string) => {
    setStoryboard((prev) => ({ ...prev, locationName: newLocation }));
  };

  // Subtitle & Visual Layout Handlers
  const handleUpdateSubtitleConfig = (config: SubtitleConfig) => {
    setStoryboard((prev) => ({
      ...prev,
      subtitleConfig: config,
    }));
  };

  const handleUpdateVisualLayout = (layout: VisualLayoutConfig) => {
    setStoryboard((prev) => ({
      ...prev,
      visualLayout: layout,
    }));
  };

  return (
    <div className="min-h-screen bg-ink text-paper flex flex-col font-sans antialiased selection:bg-accent selection:text-ink">
      {/* Header */}
      <SiteHeader />

      {/* Main Studio Workspace */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Done-For-You VIP Agency Callout Banner */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-gradient-to-r from-card via-tile to-ink px-4 py-2.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-fg-2">
              Malas ngetik atau butuh video custom kelas agensi tanpa repot edit sendiri?
            </span>
          </div>
          <a
            href="https://wa.me/6282112001600?text=Halo%20Tim%20AUDIRA%2C%20saya%20tertarik%20dengan%20Jasa%20Terima%20Beres%20Pembuatan%20Video%20Motion%20untuk%20kebutuhan%20saya."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 px-3 py-1 font-bold text-emerald-300 hover:bg-emerald-500 hover:text-black transition-all"
          >
            <span>Serahkan ke Tim AUDIRA (Terima Beres 24 Jam)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Top Control Bar with Quick Metadata */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 font-mono">
                <Sparkles className="w-3 h-3" />
                AUDIRA Studio Pro
              </span>
              <span className="text-dim text-xs">•</span>
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/80 uppercase">
                {selectedFormat}
              </span>
              <span className="text-xs font-mono text-muted flex items-center gap-1">
                <Clock className="w-3 h-3 text-accent" />
                {storyboard.durationSec.toFixed(1)}s
              </span>
              <span className="text-xs font-mono text-muted flex items-center gap-1">
                <MessageSquare className="w-3 h-3 text-yellow-400" />
                {storyboard.lines.length} Baris
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-paper tracking-tight font-display">
              {storyboard.title || 'Studio Motion Reel'}
            </h1>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsVaultOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-tile hover:bg-tile-2 border border-edge text-xs font-bold text-fg-2 flex items-center gap-1.5 transition-colors active:scale-95"
              title="Buka daftar video yang pernah dirender"
            >
              <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Riwayat Vault</span>
            </button>

            <Link
              href={`/prompts?format=${selectedFormat}`}
              className="px-3.5 py-2 rounded-xl bg-tile hover:bg-tile-2 border border-edge text-xs font-bold text-fg-2 flex items-center gap-1.5 transition-colors active:scale-95"
            >
              <span>Hub Prompt</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-dim" />
            </Link>

            <button
              onClick={() => setIsExportModalOpen(true)}
              className="btn-primary px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-2 transition-transform active:translate-y-0.5"
            >
              <Award className="w-4 h-4" />
              <span>Export MP4</span>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* LEFT COLUMN: GUIDED 5-STEP WORKFLOW PANELS (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4 order-2 lg:order-1">
            {/* Guided Stepper Progress Header */}
            <WorkflowStepper
              currentStep={activeStep}
              onSelectStep={(step) => setActiveStep(step)}
              expandAllPanels={expandAllPanels}
              onToggleExpandAll={() => setExpandAllPanels(!expandAllPanels)}
            />

            {/* LANGKAH 1: FORMAT & PEMERAN */}
            {(activeStep === 'format' || expandAllPanels) && (
              <div className="flex flex-col gap-3 animate-in fade-in duration-200">
                <FormatSelector
                  selectedFormat={selectedFormat}
                  onSelect={handleSelectFormat}
                />

                {selectedFormat === 'character_banter' && (
                  <CastPicker
                    selectedHuman={storyboard.characters.characterA.name}
                    selectedAi={storyboard.characters.characterB.name}
                    selectedLocation={storyboard.locationName}
                    onSelectHuman={handleSelectHuman}
                    onSelectAi={handleSelectAi}
                    onSelectLocation={handleSelectLocation}
                    onShuffle={handleShuffleCast}
                  />
                )}

                {!expandAllPanels && (
                  <StepNavigationBar
                    currentStep="format"
                    onNext={handleNextStep}
                    onPrev={handlePrevStep}
                  />
                )}
              </div>
            )}

            {/* LANGKAH 2: IDE & AI PROMPT SCRIPT GENERATOR */}
            {(activeStep === 'idea' || expandAllPanels) && (
              <div className="flex flex-col gap-3 animate-in fade-in duration-200">
                <IdeaInputPanel
                  idea={ideaInput}
                  onChangeIdea={setIdeaInput}
                  selectedMood={selectedMood}
                  onChangeMood={setSelectedMood}
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                  selectedFormat={selectedFormat}
                  selectedProvider={selectedProvider}
                  onChangeProvider={setSelectedProvider}
                />
                {scriptNotice && (
                  <div
                    className={`px-4 py-2.5 rounded-2xl border text-xs font-semibold ${
                      scriptNotice.tone === 'error'
                        ? 'bg-red-950/60 border-red-800 text-red-200'
                        : 'bg-amber-950/50 border-amber-800 text-amber-200'
                    }`}
                  >
                    {scriptNotice.text}
                  </div>
                )}

                {!expandAllPanels && (
                  <StepNavigationBar
                    currentStep="idea"
                    onNext={handleNextStep}
                    onPrev={handlePrevStep}
                  />
                )}
              </div>
            )}

            {/* LANGKAH 3: INTERACTIVE SCRIPT & CARTEISA VOICE SYNC */}
            {(activeStep === 'script' || expandAllPanels) && (
              <div className="flex flex-col gap-3 animate-in fade-in duration-200">
                <ScriptEditorPanel
                  storyboard={storyboard}
                  onUpdateLine={handleUpdateLine}
                  onAddLine={handleAddLine}
                  onDeleteLine={handleDeleteLine}
                  onSwapSpeaker={handleSwapSpeaker}
                  onMoveLine={handleMoveLine}
                  onUpdateHook={handleUpdateHook}
                  onUpdateTitle={handleUpdateTitle}
                  onUpdateLocation={handleUpdateLocation}
                  onBatchUpdateLines={handleBatchUpdateLines}
                  onUpdateVisualLayout={handleUpdateVisualLayout}
                  onUndo={handleUndo}
                  onRedo={handleRedo}
                  canUndo={history.length > 0}
                  canRedo={future.length > 0}
                />

                {!expandAllPanels && (
                  <StepNavigationBar
                    currentStep="script"
                    onNext={handleNextStep}
                    onPrev={handlePrevStep}
                  />
                )}
              </div>
            )}

            {/* LANGKAH 4: VISUAL STYLING, KINETIC SUBTITLE & AUDIO MIXER */}
            {(activeStep === 'visual' || expandAllPanels) && (
              <div className="flex flex-col gap-3 animate-in fade-in duration-200">
                <VisualSubtitlePanel
                  storyboard={storyboard}
                  onUpdateSubtitleConfig={handleUpdateSubtitleConfig}
                  onUpdateVisualLayout={handleUpdateVisualLayout}
                />

                {!expandAllPanels && (
                  <StepNavigationBar
                    currentStep="visual"
                    onNext={handleNextStep}
                    onPrev={handlePrevStep}
                  />
                )}
              </div>
            )}

            {/* LANGKAH 5: RENDER LAUNCHPAD, VIRAL TOOLKIT & EXPORT */}
            {(activeStep === 'social' || expandAllPanels) && (
              <div className="flex flex-col gap-3 animate-in fade-in duration-200">
                <RenderLaunchpad
                  storyboard={storyboard}
                  onOpenExport={() => setIsExportModalOpen(true)}
                  onOpenVault={() => setIsVaultOpen(true)}
                />

                {!expandAllPanels && (
                  <StepNavigationBar
                    currentStep="social"
                    onNext={handleNextStep}
                    onPrev={handlePrevStep}
                    onOpenExport={() => setIsExportModalOpen(true)}
                  />
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Realtime Live Preview Stage (5 Cols - Sticky & Centered) */}
          <div className="lg:col-span-5 flex flex-col items-center order-1 lg:order-2 sticky top-20 z-30">
            <MotionStage
              storyboard={storyboard}
              onExportClick={() => setIsExportModalOpen(true)}
              onUpdateSubtitleConfig={handleUpdateSubtitleConfig}
              onUpdateVisualLayout={handleUpdateVisualLayout}
            />
          </div>
        </div>
      </main>

      {/* Export Render Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        storyboard={storyboard}
      />

      {/* Render History Vault Modal */}
      <RenderHistoryModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
      />
    </div>
  );
}
