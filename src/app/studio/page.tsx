'use client';

import React, { useEffect, useState } from 'react';
import { SiteHeader } from '@/components/site/SiteHeader';
import { FormatSelector } from '@/components/studio/FormatSelector';
import { IdeaInputPanel } from '@/components/studio/IdeaInputPanel';
import { ScriptEditorPanel } from '@/components/studio/ScriptEditorPanel';
import { CastPicker } from '@/components/studio/CastPicker';
import { ViralToolkit } from '@/components/studio/ViralToolkit';
import { ExportModal } from '@/components/studio/ExportModal';
import { MotionStage } from '@/components/video-engine/MotionStage';
import { DEMO_STORYBOARDS } from '@/lib/templates';
import { generateStoryboardFromIdea } from '@/lib/script-generator';
import { rebalanceLines } from '@/lib/storyboard-utils';
import { HUMAN_CAST, AI_CAST, SCENE_LOCATIONS, CastMember, LocationScene } from '@/lib/cast-catalog';
import { MotionFormat, MoodType, Storyboard, SpeakerEmotion, StoryboardLine } from '@/types/motion';
import { Sparkles, Zap, Award } from 'lucide-react';

export default function StudioPage() {
  const [selectedFormat, setSelectedFormat] = useState<MotionFormat>('character_banter');
  const [selectedMood, setSelectedMood] = useState<MoodType>('hyped');
  const [ideaInput, setIdeaInput] = useState<string>('Ash mau resign jadi streamer padahal baru punya 40 followers');

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
            return;
          }
        }
      } catch (err) {
        console.error('Failed to load imported storyboard:', err);
      }
    }

    if (idea) setIdeaInput(idea.slice(0, 600));
    if (mood && ['hyped', 'warm', 'calm', 'motivational', 'frustrated', 'angry', 'rude'].includes(mood)) {
      setSelectedMood(mood);
    }
    if (format && format in DEMO_STORYBOARDS) {
      setSelectedFormat(format);
      setStoryboard(DEMO_STORYBOARDS[format]);
    }
  }, []);

  const [storyboard, setStoryboard] = useState<Storyboard>(DEMO_STORYBOARDS['character_banter']);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [scriptNotice, setScriptNotice] = useState<{ tone: 'info' | 'error'; text: string } | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Switch format
  const handleSelectFormat = (format: MotionFormat) => {
    setSelectedFormat(format);
    setStoryboard(DEMO_STORYBOARDS[format]);
  };

  // Generate new script from prompt (with seamless local fallback for guests)
  const handleGenerate = async () => {
    setIsGenerating(true);
    setScriptNotice(null);
    try {
      const res = await fetch('/api/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: ideaInput, format: selectedFormat, mood: selectedMood }),
      });
      const data = await res.json();
      if (res.ok) {
        setStoryboard(data.storyboard);
        return;
      }
      const fallbackStoryboard = await generateStoryboardFromIdea(ideaInput, selectedFormat, selectedMood);
      setStoryboard(fallbackStoryboard);
      if (res.status === 401) {
        setScriptNotice({ tone: 'info', text: 'Mode Tamu: Naskah otomatis diracik di browser. Masuk untuk akses Claude API.' });
      } else {
        setScriptNotice({ tone: 'info', text: `Naskah cerdas dipakai: ${data.error ?? 'Lokal generator'}` });
      }
    } catch {
      const fallback = await generateStoryboardFromIdea(ideaInput, selectedFormat, selectedMood);
      setStoryboard(fallback);
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
    setStoryboard((prev) => {
      const updatedLines = [...prev.lines];
      const target = { ...updatedLines[lineIndex], text: newText };
      if (newEmotion) target.emotion = newEmotion;
      updatedLines[lineIndex] = target;

      const { lines: rebalanced, totalDuration } = rebalanceLines(updatedLines);
      return { ...prev, lines: rebalanced, durationSec: totalDuration };
    });
  };

  // Add new line
  const handleAddLine = () => {
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
    setStoryboard((prev) => {
      if (prev.lines.length <= 2) return prev;
      const remaining = prev.lines.filter((_, idx) => idx !== lineIndex);
      const { lines: rebalanced, totalDuration } = rebalanceLines(remaining);
      return { ...prev, lines: rebalanced, durationSec: totalDuration };
    });
  };

  // Swap speaker
  const handleSwapSpeaker = (lineIndex: number) => {
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

  return (
    <div className="min-h-screen bg-[#0e0e11] text-[#f4f3f0] flex flex-col font-sans">
      {/* Header */}
      <SiteHeader />

      {/* Main Studio Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Top Hero Banner */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-orange-600/20 text-orange-400 border border-orange-500/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Formula Viral BanterReels
              </span>
              <span className="text-zinc-500 text-xs">•</span>
              <span className="text-xs font-medium text-zinc-400">9:16 Vertical Video Suite</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Satu Ide. Satu Reel Motion Jadi.
            </h1>
            <p className="text-sm text-zinc-400 mt-1.5 max-w-2xl leading-relaxed">
              Karakter berdebat, papan tulis spidol, game retro 16-bit, berita darurat, explainer modern, hingga kisah sejarah dokumenter. Semua otomatis dengan naskah dan animasi teks per kata.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:self-center shrink-0">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs uppercase tracking-wider shadow-brutal flex items-center gap-2 border-2 border-black transition-transform active:translate-y-0.5"
            >
              <Award className="w-4 h-4" />
              <span>Export Video MP4</span>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Controls, Formats, Cast, Script Editor & Viral Toolkit (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6 order-2 lg:order-1">
            {/* 1. Format Archetypes Selector */}
            <FormatSelector
              selectedFormat={selectedFormat}
              onSelect={handleSelectFormat}
            />

            {/* 2. Cast & Location Picker (For Character Banter) */}
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

            {/* 3. Idea Input & Mood Selector */}
            <IdeaInputPanel
              idea={ideaInput}
              onChangeIdea={setIdeaInput}
              selectedMood={selectedMood}
              onChangeMood={setSelectedMood}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              selectedFormat={selectedFormat}
            />
            {scriptNotice && (
              <div
                className={`-mt-3 px-4 py-3 rounded-2xl border text-xs font-semibold ${
                  scriptNotice.tone === 'error'
                    ? 'bg-red-950/60 border-red-800 text-red-200'
                    : 'bg-amber-950/50 border-amber-800 text-amber-200'
                }`}
              >
                {scriptNotice.text}
              </div>
            )}

            {/* 4. Interactive Script Editor */}
            <ScriptEditorPanel
              storyboard={storyboard}
              onUpdateLine={handleUpdateLine}
              onAddLine={handleAddLine}
              onDeleteLine={handleDeleteLine}
              onSwapSpeaker={handleSwapSpeaker}
              onMoveLine={handleMoveLine}
              onUpdateHook={handleUpdateHook}
            />

            {/* 5. Viral Social Toolkit (Siap Posting) */}
            <ViralToolkit storyboard={storyboard} />

            {/* Banter Secret Formula Insights */}
            <div className="bg-[#141413] p-5 rounded-3xl border-2 border-zinc-800 flex flex-col gap-3">
              <h4 className="text-xs font-black uppercase text-orange-400 tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Rahasia Retensi BanterReels (Under The Hood)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-zinc-300">
                <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                  <span className="font-mono font-bold text-orange-400 block mb-1">00:00.4 Detik</span>
                  <p className="text-[11px] text-zinc-400">
                    Hook audio pembuka meledak dalam 0.4s pertama untuk mengunci jempol penonton.
                  </p>
                </div>
                <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                  <span className="font-mono font-bold text-yellow-400 block mb-1">Word Pop Captions</span>
                  <p className="text-[11px] text-zinc-400">
                    Teks menyala per kata tepat saat diucapkan untuk menjaga fokus mata penonton.
                  </p>
                </div>
                <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                  <span className="font-mono font-bold text-cyan-400 block mb-1">Comment Magnet</span>
                  <p className="text-[11px] text-zinc-400">
                    Outro diakhiri pertanyaan pemicu debat agar algoritma melipatgandakan views.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 9:16 Vertical Live Preview Stage (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center order-1 lg:order-2 sticky top-24">
            <MotionStage
              storyboard={storyboard}
              onExportClick={() => setIsExportModalOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        storyboard={storyboard}
      />
    </div>
  );
}
