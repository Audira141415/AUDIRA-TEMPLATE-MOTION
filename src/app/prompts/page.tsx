'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  Box,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Cpu,
  Dices,
  Download,
  FileCode,
  Film,
  Flame,
  Globe,
  Layers,
  MessageSquare,
  Search,
  Shield,
  Sliders,
  Sparkles,
  Terminal,
  User,
  Video,
  Wand2,
  Zap,
} from 'lucide-react';
import { MoodType, MotionFormat } from '@/types/motion';
import { MOODS, moodById } from '@/lib/moods';
import {
  buildAdvancedPrompt,
  buildVisualPrompt,
  CameraMovement,
  DurationTarget,
  IDEA_STARTERS,
  SlangStyle,
  TargetAIModel,
  VideoAIPlatform,
  VisualAesthetic,
} from '@/lib/script-prompts';
import { generateStoryboardFromIdea } from '@/lib/script-generator';
import { FORMAT_CARDS } from '@/components/landing/reels';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import { PasteChecker } from '@/components/site/PasteChecker';

// Category filtering groups
type CategoryFilter = 'all' | 'gaming' | 'banter' | 'explainer' | 'story';

const CATEGORIES: Array<{ id: CategoryFilter; label: string; count: number; icon: React.ReactNode }> = [
  { id: 'all', label: 'Semua Format', count: 21, icon: <Layers className="w-3.5 h-3.5" /> },
  { id: 'gaming', label: 'Gaming & Roblox', count: 4, icon: <Box className="w-3.5 h-3.5" /> },
  { id: 'banter', label: 'Banter & Debat', count: 4, icon: <Flame className="w-3.5 h-3.5" /> },
  { id: 'explainer', label: 'Edukasi & Data', count: 5, icon: <FileCode className="w-3.5 h-3.5" /> },
  { id: 'story', label: 'Story & Drama', count: 8, icon: <MessageSquare className="w-3.5 h-3.5" /> },
];

const FORMAT_CATEGORY_MAP: Record<MotionFormat, CategoryFilter> = {
  roblox_story: 'gaming',
  pixel_rpg: 'gaming',
  terminal_hack: 'gaming',
  comic_strip: 'gaming',

  character_banter: 'banter',
  versus: 'banter',
  chat_story: 'banter',
  podcast_clip: 'banter',

  clean_explainer: 'explainer',
  whiteboard: 'explainer',
  top_list: 'explainer',
  quiz: 'explainer',
  sticky_notes: 'explainer',

  breaking_news: 'story',
  docu_story: 'story',
  social_post: 'story',
  kinetic_type: 'story',
  receipt: 'story',
  retro_vhs: 'story',
  map_journey: 'story',
  recipe_steps: 'story',
};

const VIRAL_INDONESIAN_IDEAS = [
  'Noob minta 1000 Robux ke Pro demi beli gamepass di Obby tersulit',
  'Drama kepleset lava di stage 99 Tower of Hell padahal dikit lagi tamat',
  'Tipe-tipe player Roblox saat ketemu hacker terbang di server publik',
  'Ash mau resign jadi streamer padahal followers-nya baru 40 orang',
  'Dita mau liburan ke Bali cuma modal 1,5 juta dan nol rencana cadangan',
  'Bima beli kopi 45 ribu tiap hari tapi curhat tabungan rumah nggak pernah cukup',
  'Fenomena "aku OTW" padahal baru selesai mandi dan masih pakai handuk',
  'Boss fight RPG: Meeting dadakan jam 4.58 sore saat tas sudah rapi di punggung',
  'Kenapa cicilan paylater nol persen tetap bikin boncos di akhir bulan',
  'Debat panas: Tim bubur diaduk vs tim bubur rapi di depan gerobak mang ujang',
  'Teman lama tiba-tiba chat "P" jam 2 pagi, ternyata mau pinjam seratus ribu',
  'Hari pertama diet ketat tapi jam 11 malam tercium aroma martabak manis tetangga',
  'Mencari file skripsi yang benar-benar final di antara 14 varian revisi dosen',
  'Struk belanja bulanan yang membengkak gara-gara barang diskon yang sebenarnya nggak butuh',
  '3 angka algoritma reels yang menentukan video lo tembus 1 juta views',
  'Kisah penemu WiFi asal Kediri yang patennya dipakai seluruh smartphone dunia',
  '6 cara tetap fokus kerja dari rumah tanpa tergoda rebahan di kasur',
  'Interview kerja yang berakhir canggung gara-gara salah sebut nama pimpinan perusahaan',
  'Road trip Jakarta ke Jogja lewat jalur darat modal nekat dan playlist galau',
  'Resep mie goreng telur 10 menit penyelamat anak kos di tanggal tua',
];

export default function PromptsPage() {
  // Format, category & search
  const [format, setFormat] = useState<MotionFormat>('character_banter');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Prompt configuration parameters
  const [model, setModel] = useState<TargetAIModel>('claude');
  const [duration, setDuration] = useState<DurationTarget>('30s');
  const [slang, setSlang] = useState<SlangStyle>('jakarta_gaul');
  const [mood, setMood] = useState<MoodType>('hyped');
  const [idea, setIdea] = useState(IDEA_STARTERS.character_banter[0]);

  // Optional custom characters
  const [showCustomChars, setShowCustomChars] = useState(false);
  const [charA, setCharA] = useState('');
  const [charB, setCharB] = useState('');

  // Instant testing / paste checker sync
  const [pastedJson, setPastedJson] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  // Dual-Pass Engine: 'script' (LLM Storyboard) vs 'visual' (Video AI Prompt for Kling/Runway/Midjourney/Sora)
  const [promptTab, setPromptTab] = useState<'script' | 'visual'>('script');
  const [visualPlatform, setVisualPlatform] = useState<VideoAIPlatform>('kling');
  const [cameraMovement, setCameraMovement] = useState<CameraMovement>('drone_orbit');
  const [visualAesthetic, setVisualAesthetic] = useState<VisualAesthetic>('octane_3d_render');
  const [copyVisualStatus, setCopyVisualStatus] = useState<string | null>(null);
  const [copyNegativeStatus, setCopyNegativeStatus] = useState<string | null>(null);

  // Filtered formats
  const filteredCards = useMemo(() => {
    return FORMAT_CARDS.filter((card) => {
      const cardCat = FORMAT_CATEGORY_MAP[card.reel.format];
      const matchCat = category === 'all' || cardCat === category;
      const query = searchQuery.toLowerCase().trim();
      const matchQuery =
        !query ||
        card.name.toLowerCase().includes(query) ||
        card.pitch.toLowerCase().includes(query) ||
        card.reel.format.toLowerCase().includes(query) ||
        card.topics.some((t) => t.toLowerCase().includes(query));
      return matchCat && matchQuery;
    });
  }, [category, searchQuery]);

  // Selected format card metadata
  const currentCard = useMemo(() => {
    return FORMAT_CARDS.find((c) => c.reel.format === format) || FORMAT_CARDS[0];
  }, [format]);

  // Build the specialized AI prompt
  const prompt = useMemo(() => {
    return buildAdvancedPrompt({
      format,
      mood: moodById(mood),
      idea,
      targetModel: model,
      duration,
      slang,
      charAName: charA.trim() || undefined,
      charBName: charB.trim() || undefined,
    });
  }, [format, mood, idea, model, duration, slang, charA, charB]);

  // Build the specialized Visual Video AI prompt (Kling / Runway / Midjourney / Sora)
  const visualPromptData = useMemo(() => {
    return buildVisualPrompt({
      format,
      idea,
      platform: visualPlatform,
      camera: cameraMovement,
      aesthetic: visualAesthetic,
    });
  }, [format, idea, visualPlatform, cameraMovement, visualAesthetic]);

  const handleCopyVisualPrompt = async () => {
    await navigator.clipboard.writeText(visualPromptData.prompt);
    setCopyVisualStatus('Prompt Visual Tersalin!');
    setTimeout(() => setCopyVisualStatus(null), 1800);
  };

  const handleCopyNegativePrompt = async () => {
    await navigator.clipboard.writeText(visualPromptData.negativePrompt);
    setCopyNegativeStatus('Negative Prompt Tersalin!');
    setTimeout(() => setCopyNegativeStatus(null), 1800);
  };

  const command = 'node engine/build-reel.mjs reel.json --out renders/reel-saya';

  const pickFormat = (f: MotionFormat) => {
    setFormat(f);
    const starters = IDEA_STARTERS[f] || IDEA_STARTERS.character_banter;
    setIdea(starters[0] || 'Ide konten viral');
    if (f === 'roblox_story') {
      setCharA('Noob Blox');
      setCharB('Pro Bacon');
    } else if (f === 'pixel_rpg') {
      setCharA('Player 1');
      setCharB('Reality Boss');
    } else {
      setCharA('');
      setCharB('');
    }
  };

  const handleRandomizeViralIdea = () => {
    const randomPick = VIRAL_INDONESIAN_IDEAS[Math.floor(Math.random() * VIRAL_INDONESIAN_IDEAS.length)];
    setIdea(randomPick);
  };

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopyStatus('Prompt Tersalin!');
    setTimeout(() => setCopyStatus(null), 1800);
  };

  const handleDownloadPrompt = () => {
    const blob = new Blob([prompt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audira-prompt-${format}-${model}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleInstantSynthesisTest = async () => {
    setIsSynthesizing(true);
    try {
      const generatedSb = await generateStoryboardFromIdea(idea, format, mood);
      const formattedJson = JSON.stringify(generatedSb, null, 2);
      setPastedJson(formattedJson);

      // Smooth scroll to PasteChecker section
      setTimeout(() => {
        const el = document.getElementById('paste-checker-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141413] font-display text-[#f4f3f0] antialiased">
      <SiteHeader />

      <main className="mx-auto max-w-[1240px] px-4 py-12 md:px-8">
        {/* Top Header & Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-[0.12em] text-[#8a8780]">
          <span className="px-2.5 py-0.5 rounded-full bg-orange-600/20 text-[#ea580c] border border-orange-500/30 font-bold">
            21 Format Aktif
          </span>
          <span>•</span>
          <span>Multi-LLM Prompt Engineering Hub</span>
          <span>•</span>
          <span className="text-emerald-400">Instant Storyboard Synthesizer</span>
        </div>

        <h1 className="mt-4 max-w-[900px] text-[38px] font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-[62px]">
          Pilih Format. Sesuaikan AI. <span className="text-[#ea580c]">Render Naskah Viral.</span>
        </h1>
        <p className="mt-4 max-w-[700px] text-[16px] leading-relaxed text-[#b9b6ae]">
          Rancang prompt presisi tinggi yang dioptimalkan untuk Claude 3.5, ChatGPT 4o, Gemini 1.5, dan DeepSeek R1.
          Hasilkan storyboard JSON berstruktur ketat yang langsung dipahami mesin AUDIRA MOTION.
        </p>

        {/* 1. Category Filter Tabs & Search Bar */}
        <section className="mt-12 rounded-3xl border-2 border-[#2c2b28] bg-[#1c1c1a] p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2c2b28]">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ea580c] text-white font-bold text-xs">
                1
              </span>
              <h2 className="text-[20px] font-black tracking-[-0.02em] text-[#f4f3f0]">
                Pilih Format Video ({FORMAT_CARDS.length} Pilihan)
              </h2>
            </div>

            {/* Instant Search Bar */}
            <div className="relative min-w-[240px] sm:w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8780]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari format (Roblox, Kuis...)"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#2c2b28] bg-[#141413] text-xs text-[#f4f3f0] placeholder:text-[#6f6c66] focus:border-[#ea580c] focus:outline-none"
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    active
                      ? 'bg-[#ea580c] text-white shadow-md'
                      : 'bg-[#141413] border border-[#2c2b28] text-[#b9b6ae] hover:border-[#4a4843] hover:text-white'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${active ? 'bg-black/30' : 'bg-[#2c2b28]'}`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Format Cards Grid */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
            {filteredCards.map((c) => {
              const active = c.reel.format === format;
              const isRoblox = c.reel.format === 'roblox_story';
              return (
                <button
                  key={c.reel.format}
                  type="button"
                  onClick={() => pickFormat(c.reel.format)}
                  aria-pressed={active}
                  className={`group relative overflow-hidden rounded-2xl border-2 text-left transition-all ${
                    active
                      ? 'border-[#ea580c] ring-2 ring-[#ea580c]/50 scale-[1.02] shadow-lg shadow-orange-950/30'
                      : 'border-[#2c2b28] hover:border-[#4a4843] hover:scale-[1.01]'
                  }`}
                >
                  {isRoblox && (
                    <span className="absolute top-1.5 left-1.5 z-10 px-2 py-0.5 rounded-md bg-yellow-400 text-black text-[9px] font-black tracking-wider uppercase shadow">
                      BARU
                    </span>
                  )}
                  <div className="relative aspect-[9/12] w-full overflow-hidden bg-[#0f0f0e]">
                    <img
                      src={`/reels/${c.reel.file}.jpg`}
                      alt={c.name}
                      className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        // Fallback image if file not yet on disk
                        (e.target as HTMLImageElement).src = '/reels/banter.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  </div>
                  <div className={`p-2.5 transition-colors ${active ? 'bg-[#ea580c] text-white' : 'bg-[#141413]'}`}>
                    <span className="block text-[12px] font-extrabold truncate">{c.name}</span>
                    <span className={`block text-[10px] truncate ${active ? 'text-white/80' : 'text-[#8a8780]'}`}>
                      {c.pitch}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {filteredCards.length === 0 && (
            <div className="mt-6 p-8 text-center border border-dashed border-[#2c2b28] rounded-2xl text-xs text-[#8a8780]">
              Format tidak ditemukan dengan kata kunci &quot;{searchQuery}&quot;. Coba ganti kata pencarian atau pilih tab &quot;Semua Format&quot;.
            </div>
          )}

          {/* Current Selection Summary */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#141413] p-4 border border-[#2c2b28]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase text-[#ea580c] font-bold">Terpilih:</span>
              <span className="text-sm font-extrabold text-white">{currentCard.name}</span>
              <span className="hidden sm:inline text-xs text-[#8a8780]">— {currentCard.pitch}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8a8780]">Topik populer:</span>
              {currentCard.topics.map((t) => (
                <span key={t} className="rounded-lg bg-[#1c1c1a] border border-[#2c2b28] px-2 py-0.5 text-[11px] text-[#d6d3cc]">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 2. Interactive AI & Parameter Tuning Matrix */}
        <section className="mt-8 rounded-3xl border-2 border-[#2c2b28] bg-[#1c1c1a] p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-2 pb-4 border-b border-[#2c2b28]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ea580c] text-white font-bold text-xs">
              2
            </span>
            <h2 className="text-[20px] font-black tracking-[-0.02em] text-[#f4f3f0]">
              Konfigurasi Model AI & Parameter Naskah
            </h2>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Target AI Model */}
            <div className="rounded-2xl border border-[#2c2b28] bg-[#141413] p-4">
              <label className="flex items-center gap-2 text-xs font-mono uppercase text-[#ea580c] font-bold">
                <Bot className="w-3.5 h-3.5" /> Target Mesin AI
              </label>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {[
                  { id: 'claude', name: 'Claude 3.5', badge: 'Anthropic XML' },
                  { id: 'chatgpt', name: 'ChatGPT 4o', badge: 'OpenAI JSON' },
                  { id: 'gemini', name: 'Gemini 1.5', badge: 'Google Direct' },
                  { id: 'deepseek', name: 'DeepSeek R1', badge: 'No-Think Raw' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setModel(item.id as TargetAIModel)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      model === item.id
                        ? 'border-[#ea580c] bg-[#ea580c]/15 text-white'
                        : 'border-[#2c2b28] bg-[#1c1c1a] text-[#b9b6ae] hover:border-[#4a4843]'
                    }`}
                  >
                    <span className="block text-xs font-bold text-white">{item.name}</span>
                    <span className="block text-[10px] text-[#8a8780]">{item.badge}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Video Duration */}
            <div className="rounded-2xl border border-[#2c2b28] bg-[#141413] p-4">
              <label className="flex items-center gap-2 text-xs font-mono uppercase text-[#ea580c] font-bold">
                <Clock className="w-3.5 h-3.5" /> Target Durasi & Pacing
              </label>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { id: '15s', label: '15s', desc: 'Ultra Hook' },
                  { id: '30s', label: '30s', desc: 'Standard Viral' },
                  { id: '45s', label: '45s', desc: 'Deep Narrative' },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDuration(d.id as DurationTarget)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      duration === d.id
                        ? 'border-[#ea580c] bg-[#ea580c]/15 text-white'
                        : 'border-[#2c2b28] bg-[#1c1c1a] text-[#b9b6ae] hover:border-[#4a4843]'
                    }`}
                  >
                    <span className="block text-xs font-black">{d.label}</span>
                    <span className="block text-[10px] text-[#8a8780] truncate">{d.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Slang & Language Tone */}
            <div className="rounded-2xl border border-[#2c2b28] bg-[#141413] p-4">
              <label className="flex items-center gap-2 text-xs font-mono uppercase text-[#ea580c] font-bold">
                <Globe className="w-3.5 h-3.5" /> Gaya Bahasa & Slang
              </label>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {[
                  { id: 'jakarta_gaul', label: 'Jakarta Gaul', desc: 'Lo/Gue Natural' },
                  { id: 'profesional', label: 'Profesional', desc: 'Formal B2B / Edukasi' },
                  { id: 'genz_slang', label: 'Gen-Z Internet', desc: 'Spill, Rizz, OOF' },
                  { id: 'english_viral', label: 'English Viral', desc: 'TikTok / Global' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSlang(s.id as SlangStyle)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      slang === s.id
                        ? 'border-[#ea580c] bg-[#ea580c]/15 text-white'
                        : 'border-[#2c2b28] bg-[#1c1c1a] text-[#b9b6ae] hover:border-[#4a4843]'
                    }`}
                  >
                    <span className="block text-xs font-bold text-white">{s.label}</span>
                    <span className="block text-[10px] text-[#8a8780]">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mood Selector (7 Archetypes) */}
          <div className="mt-6 pt-5 border-t border-[#2c2b28]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-mono uppercase text-[#ea580c] font-bold">
                Pilih Emosi / Mood Utama ({MOODS.length} Mood)
              </label>
              <span className="text-xs text-[#8a8780] italic">{moodById(mood).tagline}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {MOODS.map((m) => {
                const active = mood === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMood(m.id)}
                    className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                      active
                        ? 'border-[#ea580c] bg-[#ea580c] text-white shadow-md'
                        : 'border-[#2c2b28] bg-[#141413] text-[#d6d3cc] hover:border-[#4a4843]'
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Collapsible Custom Character Names */}
          <div className="mt-5">
            <button
              type="button"
              onClick={() => setShowCustomChars((v) => !v)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#8a8780] hover:text-[#d6d3cc] transition-colors"
            >
              {showCustomChars ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              <span>Kustomisasi Nama Karakter (Opsional)</span>
            </button>
            {showCustomChars && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-[#141413] p-4 border border-[#2c2b28]">
                <div>
                  <label className="block text-xs text-[#8a8780] mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-orange-400" />
                    Karakter A (Inisiator / Pembuka)
                  </label>
                  <input
                    type="text"
                    value={charA}
                    onChange={(e) => setCharA(e.target.value)}
                    placeholder={format === 'roblox_story' ? 'Noob Blox' : 'Ash'}
                    className="w-full rounded-xl border border-[#2c2b28] bg-[#1c1c1a] px-3 py-2 text-xs text-[#f4f3f0] placeholder:text-[#5f5c56] focus:border-[#ea580c] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#8a8780] mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    Karakter B (Counterpart / Penanggap)
                  </label>
                  <input
                    type="text"
                    value={charB}
                    onChange={(e) => setCharB(e.target.value)}
                    placeholder={format === 'roblox_story' ? 'Pro Bacon' : 'Audira'}
                    className="w-full rounded-xl border border-[#2c2b28] bg-[#1c1c1a] px-3 py-2 text-xs text-[#f4f3f0] placeholder:text-[#5f5c56] focus:border-[#ea580c] focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 3. Viral Idea Input & Indonesian Randomizer */}
        <section className="mt-8 rounded-3xl border-2 border-[#2c2b28] bg-[#1c1c1a] p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2c2b28]">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ea580c] text-white font-bold text-xs">
                3
              </span>
              <h2 className="text-[20px] font-black tracking-[-0.02em] text-[#f4f3f0]">
                Tulis atau Acak Ide Naskah
              </h2>
            </div>

            <button
              type="button"
              onClick={handleRandomizeViralIdea}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-brutal border-2 border-black transition-transform active:translate-y-0.5"
            >
              <Dices className="h-4 w-4" /> Acak Ide Viral 🇮🇩
            </button>
          </div>

          <div className="mt-4">
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              maxLength={600}
              rows={3}
              placeholder="Tulis ide premis reels lo di sini... Contoh: Noob minta 1000 Robux ke Pro demi beli gamepass obby"
              className="w-full rounded-2xl border-2 border-[#2c2b28] bg-[#0f0f0e] p-4 text-[14px] leading-relaxed text-[#f4f3f0] placeholder:text-[#5f5c56] focus:border-[#ea580c] focus:outline-none transition-colors"
            />
            <div className="mt-2 flex items-center justify-between text-xs text-[#8a8780]">
              <span>Karakter: {idea.length}/600</span>
              <span className="text-orange-400/80">Tips: Buat premis dengan konflik tajam dan eskalasi lucu.</span>
            </div>
          </div>

          {/* Quick starter chips for this format */}
          <div className="mt-4">
            <p className="text-xs font-mono uppercase text-[#8a8780] font-bold mb-2">
              Ide Bawaan Format {currentCard.name}:
            </p>
            <div className="flex flex-wrap gap-2">
              {(IDEA_STARTERS[format] || []).map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => setIdea(starter)}
                  className="rounded-xl border border-[#2c2b28] bg-[#141413] px-3.5 py-2 text-left text-xs text-[#b9b6ae] hover:border-[#ea580c] hover:text-white transition-colors"
                >
                  &ldquo;{starter}&rdquo;
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Generated Prompt Console & Action Bar (Dual-Pass Engine) */}
        <section className="mt-8 rounded-3xl border-2 border-[#2c2b28] bg-[#1c1c1a] p-6 sm:p-8 shadow-xl">
          {/* Dual-Pass Tab Switcher */}
          <div className="flex border-b border-[#2c2b28] pb-4 mb-6 gap-3">
            <button
              type="button"
              onClick={() => setPromptTab('script')}
              className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm tracking-tight flex items-center gap-2 transition-all ${
                promptTab === 'script'
                  ? 'bg-[#ea580c] text-white shadow-md'
                  : 'bg-[#141413] border border-[#2c2b28] text-[#8a8780] hover:text-[#d6d3cc]'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>1. Naskah & Storyboard JSON ({model.toUpperCase()})</span>
            </button>
            <button
              type="button"
              onClick={() => setPromptTab('visual')}
              className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm tracking-tight flex items-center gap-2 transition-all ${
                promptTab === 'visual'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                  : 'bg-[#141413] border border-[#2c2b28] text-[#8a8780] hover:text-[#d6d3cc]'
              }`}
            >
              <Film className="w-4 h-4 text-cyan-300" />
              <span>2. Visual Video Prompt (AI Video 9:16)</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-200 text-[10px] uppercase font-mono hidden sm:inline">
                Kling / Runway / Sora
              </span>
            </button>
          </div>

          {promptTab === 'script' ? (
            /* TAB 1: SCRIPT & STORYBOARD JSON PROMPT */
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2c2b28]">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ea580c] text-white font-bold text-xs">
                    4
                  </span>
                  <div>
                    <h2 className="text-[20px] font-black tracking-[-0.02em] text-[#f4f3f0]">
                      Prompt Naskah untuk {model.toUpperCase()}
                    </h2>
                    <p className="text-xs text-[#8a8780]">
                      Format terspesifikasi · Schema JSON terikat · Bebas basa-basi AI
                    </p>
                  </div>
                </div>

                {/* Quick Action Bar */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#ea580c] px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#f06a1f] active:scale-95"
                  >
                    {copyStatus ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copyStatus ? copyStatus : 'Salin Prompt'}
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadPrompt}
                    title="Unduh file teks prompt"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#2c2b28] bg-[#141413] px-3.5 py-2.5 text-xs font-semibold text-[#d6d3cc] hover:border-[#4a4843] hover:text-white transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" /> Unduh .txt
                  </button>

                  <Link
                    href={`/studio?format=${format}&mood=${mood}&idea=${encodeURIComponent(idea)}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-orange-500/40 bg-orange-950/20 px-3.5 py-2.5 text-xs font-bold text-orange-300 hover:bg-orange-900/40 hover:text-white transition-colors"
                  >
                    <Zap className="h-3.5 w-3.5" /> Buka di Studio
                  </Link>

                  <Link
                    href="/admin"
                    title="Kelola Kunci API di Admin"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/20 px-3 py-2.5 text-xs font-bold text-cyan-300 hover:bg-cyan-900/40 hover:text-white transition-colors"
                  >
                    <Cpu className="h-3.5 w-3.5" /> Kunci API Admin
                  </Link>

                  <button
                    type="button"
                    onClick={handleInstantSynthesisTest}
                    disabled={isSynthesizing}
                    title="Jalankan generator storyboard simulasi langsung di browser"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md border-2 border-black transition-transform active:translate-y-0.5 disabled:opacity-50"
                  >
                    <Wand2 className="h-3.5 w-3.5" />
                    {isSynthesizing ? 'Menyusun...' : '🤖 Uji Naskah Instan'}
                  </button>
                </div>
              </div>

              <div className="relative mt-4">
                <pre className="max-h-[440px] overflow-auto whitespace-pre-wrap rounded-2xl border-2 border-[#2c2b28] bg-[#0c0c0b] p-5 font-mono text-[12px] leading-relaxed text-[#d6d3cc] selection:bg-[#ea580c] selection:text-white">
                  {prompt}
                </pre>
              </div>
            </div>
          ) : (
            /* TAB 2: VISUAL VIDEO AI PROMPT (KLING, RUNWAY, MIDJOURNEY, SORA) */
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2c2b28]">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-600 text-white font-bold text-xs">
                    4B
                  </span>
                  <div>
                    <h2 className="text-[20px] font-black tracking-[-0.02em] text-[#f4f3f0]">
                      Prompt Video Sinematik untuk {visualPlatform.toUpperCase()}
                    </h2>
                    <p className="text-xs text-[#8a8780]">
                      Dioptimalkan untuk video backdrop vertikal 9:16 · Fisika simulasi realistis · Kontrol kamera presisi
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyVisualPrompt}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-4 py-2.5 text-xs font-black text-white shadow-md border border-cyan-400/40 transition-transform active:translate-y-0.5"
                  >
                    {copyVisualStatus ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span>{copyVisualStatus ? copyVisualStatus : 'Salin Visual Prompt'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyNegativePrompt}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#2c2b28] bg-[#141413] px-3.5 py-2.5 text-xs font-semibold text-[#d6d3cc] hover:border-cyan-500 hover:text-white transition-colors"
                  >
                    {copyNegativeStatus ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Shield className="h-3.5 w-3.5 text-zinc-400" />}
                    <span>{copyNegativeStatus ? copyNegativeStatus : 'Salin Negative'}</span>
                  </button>
                </div>
              </div>

              {/* Sub-parameters for Visual AI */}
              <div className="grid gap-4 sm:grid-cols-3">
                {/* 1. Target Video AI Platform */}
                <div className="rounded-2xl border border-[#2c2b28] bg-[#141413] p-3.5">
                  <label className="flex items-center gap-1.5 text-xs font-mono uppercase text-cyan-400 font-bold mb-2.5">
                    <Video className="w-3.5 h-3.5" /> Target Platform AI
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'kling', name: 'Kling 1.5', badge: 'High Physics' },
                      { id: 'runway', name: 'Runway Gen-3', badge: 'Director Mode' },
                      { id: 'midjourney', name: 'Midjourney', badge: 'Photoreal 9:16' },
                      { id: 'sora', name: 'OpenAI Sora', badge: 'Complex 3D' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setVisualPlatform(item.id as VideoAIPlatform)}
                        className={`p-2 rounded-xl border text-left transition-all ${
                          visualPlatform === item.id
                            ? 'border-cyan-500 bg-cyan-950/30 text-white shadow-sm'
                            : 'border-[#2c2b28] bg-[#1c1c1a] text-[#8a8780] hover:text-white'
                        }`}
                      >
                        <span className="block text-xs font-bold text-white">{item.name}</span>
                        <span className="block text-[9px] text-zinc-400">{item.badge}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Camera Movement Directive */}
                <div className="rounded-2xl border border-[#2c2b28] bg-[#141413] p-3.5">
                  <label className="flex items-center gap-1.5 text-xs font-mono uppercase text-cyan-400 font-bold mb-2.5">
                    <Sliders className="w-3.5 h-3.5" /> Gerakan Kamera
                  </label>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { id: 'drone_orbit', label: 'Drone Orbit 360°', desc: 'Melingkari panggung utama' },
                      { id: 'dolly_in', label: 'Cinematic Dolly-In', desc: 'Maju perlahan ke objek' },
                      { id: 'pan_right', label: 'Pan Tracking Right', desc: 'Geser horizontal sinematik' },
                      { id: 'top_down_crane', label: 'Top-Down Aerial Crane', desc: 'Pandangan mata elang' },
                      { id: 'static_tripod', label: 'Static Locked Tripod', desc: 'Kamera diam fokus gerak' },
                    ].map((cam) => (
                      <button
                        key={cam.id}
                        type="button"
                        onClick={() => setCameraMovement(cam.id as CameraMovement)}
                        className={`px-2.5 py-1.5 rounded-lg border text-left flex items-center justify-between text-xs transition-all ${
                          cameraMovement === cam.id
                            ? 'border-cyan-500 bg-cyan-950/30 text-white font-bold'
                            : 'border-[#2c2b28] bg-[#1c1c1a] text-[#8a8780] hover:text-white'
                        }`}
                      >
                        <span>{cam.label}</span>
                        <span className="text-[9px] text-zinc-500">{cam.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Visual Aesthetic Render Engine */}
                <div className="rounded-2xl border border-[#2c2b28] bg-[#141413] p-3.5">
                  <label className="flex items-center gap-1.5 text-xs font-mono uppercase text-cyan-400 font-bold mb-2.5">
                    <Sparkles className="w-3.5 h-3.5" /> Gaya & Render Engine
                  </label>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { id: 'octane_3d_render', label: 'Octane 3D Ray-Traced', desc: 'C4D hyper-clean' },
                      { id: 'unreal_engine_5', label: 'Unreal Engine 5.4 Lumen', desc: 'Nanite 8k lighting' },
                      { id: 'cyberpunk_neon', label: 'Cyberpunk Neo-Brutalist', desc: 'Volumetrik & flare' },
                      { id: 'documentary_35mm', label: '35mm Arri Film', desc: 'Cinematic documentary' },
                      { id: 'roblox_gameplay', label: 'Roblox Physics Voxel', desc: 'Plastic studs saturated' },
                    ].map((aes) => (
                      <button
                        key={aes.id}
                        type="button"
                        onClick={() => setVisualAesthetic(aes.id as VisualAesthetic)}
                        className={`px-2.5 py-1.5 rounded-lg border text-left flex items-center justify-between text-xs transition-all ${
                          visualAesthetic === aes.id
                            ? 'border-cyan-500 bg-cyan-950/30 text-white font-bold'
                            : 'border-[#2c2b28] bg-[#1c1c1a] text-[#8a8780] hover:text-white'
                        }`}
                      >
                        <span>{aes.label}</span>
                        <span className="text-[9px] text-zinc-500">{aes.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Generation Settings Pills */}
              <div className="flex flex-wrap items-center gap-2 bg-[#0c0c0b] p-3 rounded-2xl border border-[#2c2b28] text-xs font-mono text-zinc-300">
                <span className="text-cyan-400 font-bold uppercase text-[10px]">Parameter Rekomendasi:</span>
                <span className="bg-[#1c1c1a] px-2.5 py-1 rounded-lg border border-[#2c2b28]">
                  Rasio: <strong className="text-white">{visualPromptData.recommendedSettings.aspectRatio}</strong>
                </span>
                <span className="bg-[#1c1c1a] px-2.5 py-1 rounded-lg border border-[#2c2b28]">
                  Durasi: <strong className="text-white">{visualPromptData.recommendedSettings.duration}</strong>
                </span>
                <span className="bg-[#1c1c1a] px-2.5 py-1 rounded-lg border border-[#2c2b28]">
                  FPS: <strong className="text-white">{visualPromptData.recommendedSettings.fps}</strong>
                </span>
                <span className="bg-[#1c1c1a] px-2.5 py-1 rounded-lg border border-[#2c2b28]">
                  Motion Strength: <strong className="text-white">{visualPromptData.recommendedSettings.motionStrength}</strong>
                </span>
              </div>

              {/* Main Positive Prompt Output */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase text-cyan-400 font-bold">
                    Prompt Positif (Salin ke {visualPlatform.toUpperCase()}):
                  </span>
                  <span className="text-xs text-zinc-500">Rasio 9:16 Vertikal</span>
                </div>
                <pre className="max-h-[220px] overflow-auto whitespace-pre-wrap rounded-2xl border-2 border-cyan-900/50 bg-[#070b14] p-4 font-mono text-[13px] leading-relaxed text-cyan-100 selection:bg-cyan-500 selection:text-black">
                  {visualPromptData.prompt}
                </pre>
              </div>

              {/* Negative Prompt Output */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase text-red-400 font-bold">
                    Negative Prompt (Anti-Artifacts & Anti-Deformity):
                  </span>
                  <span className="text-xs text-zinc-500">Otomatis menyaring cacat anatomi</span>
                </div>
                <div className="p-3 bg-[#110808] border border-red-950/60 rounded-xl font-mono text-xs text-red-200">
                  {visualPromptData.negativePrompt}
                </div>
              </div>

              {/* Pro-Tip: Seamless AUDIRA MOTION Integration */}
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="font-black text-cyan-400 uppercase tracking-wide flex items-center gap-1.5">
                    💡 Cara Pasang Video AI ke Mesin AUDIRA MOTION:
                  </span>
                  <p className="text-cyan-100/80 leading-relaxed">
                    Render prompt di atas di Kling / Runway, unduh video 9:16 berdurasi 5s-10s, lalu letakkan di folder <code className="bg-black/40 px-1 py-0.5 rounded text-white font-mono">public/reels/{format}.mp4</code>. Mesin template akan otomatis memutar video tersebut sebagai background, lengkap dengan live HUD, simulasi, dan voiceover TTS!
                  </p>
                </div>
                <Link
                  href={`/studio?format=${format}&mood=${mood}&idea=${encodeURIComponent(idea)}`}
                  className="shrink-0 px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Buka Studio Live
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* 5. Live Paste, Check & 9:16 Preview Engine */}
        <PasteChecker
          selectedFormat={format}
          externalRaw={pastedJson}
          onRawChange={setPastedJson}
        />

        {/* 6. CLI Terminal Instructions */}
        <details className="mt-8 rounded-3xl border border-[#2c2b28] bg-[#141413] p-6 text-[14px] text-[#b9b6ae] transition-colors">
          <summary className="cursor-pointer font-bold text-[#f4f3f0] flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-orange-400" />
              Render Batch Video via Terminal (Opsional / Headless Mode)
            </span>
            <span className="text-xs text-[#8a8780] font-normal">Klik untuk buka panduan CLI</span>
          </summary>
          <div className="mt-4 pt-4 border-t border-[#2c2b28] space-y-3">
            <p>
              Simpan naskah JSON dari AI sebagai file <code className="font-mono text-xs text-[#ea580c] bg-black/40 px-1.5 py-0.5 rounded">reel.json</code> di root proyek ini, lalu jalankan mesin render:
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <code className="flex-1 overflow-x-auto rounded-xl bg-[#0a0a09] px-4 py-3 font-mono text-xs text-emerald-400 border border-[#2c2b28]">
                {command}
              </code>
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(command);
                  alert('Perintah terminal tersalin!');
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-[#2c2b28] bg-[#1c1c1a] px-4 py-3 text-xs font-bold text-white hover:border-[#4a4843]"
              >
                <Copy className="h-3.5 w-3.5" /> Salin Perintah
              </button>
            </div>
            <p className="text-xs text-[#8a8780]">
              File MP4 final Full HD 1080x1920 akan otomatis dihasilkan di folder <code className="font-mono text-zinc-300">renders/reel-saya/reel.mp4</code> lengkap dengan timing audio TTS.
            </p>
          </div>
        </details>

        {/* Footer Navigation Link */}
        <div className="mt-8 flex items-center justify-between rounded-2xl bg-[#1c1c1a] p-4 border border-[#2c2b28] text-xs text-[#8a8780]">
          <span>Ingin edit naskah langsung tanpa salin-tempel?</span>
          <Link
            href="/studio"
            className="inline-flex items-center gap-1 font-bold text-orange-400 hover:text-orange-300 transition-colors"
          >
            <span>Buka AUDIRA Studio Editor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
