'use client';

import React, { useEffect, useState, useRef } from 'react';
import { 
  Mic, Volume2, Play, Square, Loader2, Sparkles, CheckCircle2, 
  AlertCircle, Sliders, Shield, Key, RefreshCw, AudioLines, Flame
} from 'lucide-react';
import { VOICE_CATALOG, VoiceCatalogItem, VoiceAIConfig } from '@/types/ai-config';

export const VoiceOverTab: React.FC = () => {
  const [config, setConfig] = useState<VoiceAIConfig>({
    cartesiaApiKey: '',
    elevenlabsApiKey: '',
    openaiTtsApiKey: '',
    defaultProvider: 'cartesia',
    defaultVoice: 'a053f6bc-7df4-40de-96d4-de026bc47ce8',
    speed: 1.0,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null);

  // Live Test states
  const [selectedVoice, setSelectedVoice] = useState<string>('a053f6bc-7df4-40de-96d4-de026bc47ce8');
  const [testText, setTestText] = useState<string>('Halo kreator, ini adalah uji coba suara resmi Cartesia AI dari AUDIRA Motion!');
  const [testSpeed, setTestSpeed] = useState<number>(1.0);
  const [testEmotion, setTestEmotion] = useState<string>('hyped');
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const [audioLatency, setAudioLatency] = useState<number | null>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch('/api/admin/ai-config')
      .then((res) => res.json())
      .then((data) => {
        if (data.config?.voiceAi) {
          setConfig((prev) => ({
            ...prev,
            ...data.config.voiceAi,
          }));
        }
      })
      .catch((err) => console.error('Failed to load voice config:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const res = await fetch('/api/admin/ai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voiceAi: config,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSaveStatus({ tone: 'ok', text: 'Konfigurasi Voice Over & TTS berhasil disimpan!' });
      } else {
        setSaveStatus({ tone: 'error', text: data.error || 'Gagal menyimpan konfigurasi.' });
      }
    } catch (err) {
      setSaveStatus({ tone: 'error', text: 'Koneksi server gagal.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSynthesizeTest = async (overrideText?: string, overrideVoiceId?: string) => {
    const textToSpeak = overrideText || testText;
    const voiceToUse = overrideVoiceId || selectedVoice;

    if (!textToSpeak.trim()) {
      setTestError('Ketik kalimat uji coba terlebih dahulu.');
      return;
    }

    setIsSynthesizing(true);
    setTestError(null);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }

    try {
      const res = await fetch('/api/voiceover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSpeak,
          voiceId: voiceToUse,
          speed: testSpeed,
          emotion: testEmotion,
        }),
      });

      const data = await res.json();
      if (res.ok && data.audioBase64) {
        setAudioUrl(data.audioBase64);
        setAudioDuration(data.durationSec);
        setAudioLatency(data.latencyMs);

        // Auto play generated audio
        const audio = new Audio(data.audioBase64);
        audioRef.current = audio;
        audio.onended = () => setIsPlayingAudio(false);
        audio.play().then(() => setIsPlayingAudio(true)).catch(() => {});
      } else {
        setTestError(data.error || 'Gagal menghasilkan suara dari Cartesia AI.');
      }
    } catch (err) {
      setTestError(`Koneksi API gagal: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-zinc-500 flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
        <span className="text-xs font-mono">Memuat konfigurasi Voice Over...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* HEADER SECTION */}
      <div className="bg-[#1c1c1a] p-5 rounded-3xl border border-[#2c2b28] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                API Voice Over & TTS (Cartesia Sonic-3)
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                AKTIF (974ms)
              </span>
            </div>
            <p className="text-xs text-[#8a8780] mt-0.5">
              Sintesis suara multi-karakter Bahasa Indonesia dengan ekspresi emosi & word timestamps real-time
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-wider shadow-sm flex items-center gap-2 transition-transform active:translate-y-0.5 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>{isSaving ? 'Menyimpan...' : 'Simpan Kunci API'}</span>
        </button>
      </div>

      {saveStatus && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-bold ${
            saveStatus.tone === 'ok'
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
              : 'bg-red-950/40 border-red-800 text-red-300'
          }`}
        >
          {saveStatus.text}
        </div>
      )}

      {/* 2-COLUMN LAYOUT: CONFIG & LIVE AUDITION BOX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: API KEYS & VOICE PRESETS (7 COLS) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* 1. API Keys Settings */}
          <div className="bg-[#1c1c1a] p-5 rounded-3xl border border-[#2c2b28] flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#2c2b28]">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-orange-400" />
                Kunci Akses API Provider Voice Over
              </span>
              <span className="text-[10px] font-mono text-zinc-500">Cartesia / ElevenLabs</span>
            </div>

            <div className="flex flex-col gap-3">
              {/* Cartesia API Key */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-white flex items-center gap-1.5">
                    <span>Cartesia AI API Key (Rekomendasi Utama)</span>
                    <span className="px-1.5 py-0.2 rounded bg-orange-600/30 text-orange-300 text-[9px] font-mono">
                      Sonic-3 ID
                    </span>
                  </label>
                  <span className="text-[10px] text-zinc-400 font-mono">sk_car_...</span>
                </div>
                <input
                  type="password"
                  placeholder="sk_car_..."
                  value={config.cartesiaApiKey}
                  onChange={(e) => setConfig({ ...config, cartesiaApiKey: e.target.value })}
                  className="w-full bg-[#141413] border border-[#2c2b28] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-orange-500"
                />
                <p className="text-[10px] text-zinc-500">
                  Digunakan otomatis saat render video GSAP 1080p dan live audition per dialog.
                </p>
              </div>

              {/* ElevenLabs API Key (Optional) */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-[#2c2b28]">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-zinc-300">
                    ElevenLabs API Key (Opsional Fallback)
                  </label>
                  <span className="text-[10px] text-zinc-500 font-mono">Multilingual V2</span>
                </div>
                <input
                  type="password"
                  placeholder="xi-..."
                  value={config.elevenlabsApiKey}
                  onChange={(e) => setConfig({ ...config, elevenlabsApiKey: e.target.value })}
                  className="w-full bg-[#141413] border border-[#2c2b28] rounded-xl px-3.5 py-2 text-xs text-zinc-300 font-mono placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* OpenAI TTS API Key (Optional) */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-[#2c2b28]">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-zinc-300">
                    OpenAI TTS API Key (Opsional)
                  </label>
                  <span className="text-[10px] text-zinc-500 font-mono">tts-1 / tts-1-hd</span>
                </div>
                <input
                  type="password"
                  placeholder="sk-proj-..."
                  value={config.openaiTtsApiKey}
                  onChange={(e) => setConfig({ ...config, openaiTtsApiKey: e.target.value })}
                  className="w-full bg-[#141413] border border-[#2c2b28] rounded-xl px-3.5 py-2 text-xs text-zinc-300 font-mono placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* 2. Indonesian Voice Catalog Cards */}
          <div className="bg-[#1c1c1a] p-5 rounded-3xl border border-[#2c2b28] flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#2c2b28]">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                Daftar Suara Karakter (Indonesian Voice Models)
              </span>
              <span className="text-[10px] font-mono text-zinc-500">5 Karakter Siap Pakai</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {VOICE_CATALOG.map((v) => {
                const isSelected = selectedVoice === v.id;
                return (
                  <div
                    key={v.id}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-orange-600/10 border-orange-500/80 shadow-sm'
                        : 'bg-[#141413] border-[#2c2b28] hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                        isSelected ? 'bg-orange-600 text-white' : 'bg-zinc-800 text-zinc-300'
                      }`}>
                        {v.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white">{v.name}</span>
                          <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 text-[9px] font-mono uppercase">
                            {v.role}
                          </span>
                          <span className="text-[9px] text-zinc-500">
                            • {v.gender}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">
                          {v.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedVoice(v.id);
                          setTestText(v.sampleText);
                          handleSynthesizeTest(v.sampleText, v.id);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-orange-600 text-white text-[10px] font-bold flex items-center gap-1 transition-colors"
                        title="Dengarkan sampel suara"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>Sampel</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedVoice(v.id)}
                        className={`px-2 py-1.5 rounded-xl border text-[10px] font-bold ${
                          isSelected
                            ? 'bg-orange-600 text-white border-orange-400'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {isSelected ? 'Terpilih' : 'Pilih'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE LIVE VOICE SYNTHESIS TESTER (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="bg-[#1c1c1a] p-5 rounded-3xl border-2 border-orange-500/80 shadow-brutal flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#2c2b28]">
              <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                <AudioLines className="w-4 h-4 text-orange-400" />
                Live Voice Synthesizer Tester
              </span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Realtime SSE
              </span>
            </div>

            {/* Target Character Voice Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-400">
                Karakter Suara yang Diuji:
              </label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full bg-[#141413] border border-[#2c2b28] rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-orange-500"
              >
                {VOICE_CATALOG.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.role} • {v.gender})
                  </option>
                ))}
              </select>
            </div>

            {/* Text Input Box */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <label className="font-black uppercase text-zinc-400">
                  Kalimat Uji Coba:
                </label>
                <span className="text-zinc-500 font-mono">{testText.length} karakter</span>
              </div>
              <textarea
                rows={3}
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                placeholder="Ketik kalimat apapun dalam Bahasa Indonesia..."
                className="w-full bg-[#141413] border border-[#2c2b28] rounded-2xl p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 leading-relaxed resize-none"
              />
            </div>

            {/* Speed & Emotion Controls */}
            <div className="grid grid-cols-2 gap-3 bg-[#141413] p-3 rounded-2xl border border-[#2c2b28]">
              {/* Speed Slider */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-zinc-400">Kecepatan:</span>
                  <span className="font-mono font-bold text-orange-400">{testSpeed.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min={0.8}
                  max={1.4}
                  step={0.05}
                  value={testSpeed}
                  onChange={(e) => setTestSpeed(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>

              {/* Emotion Selector */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-zinc-400">Emosi Gaya:</span>
                <select
                  value={testEmotion}
                  onChange={(e) => setTestEmotion(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-[11px] font-bold text-white focus:outline-none"
                >
                  <option value="hyped">🔥 Hyped / Excited</option>
                  <option value="calm">☕ Calm / Tenang</option>
                  <option value="smug">😏 Smug / Percaya Diri</option>
                  <option value="sarcastic">🙄 Sarcastic / Sarkas</option>
                  <option value="angry">😡 Angry / Kesal</option>
                </select>
              </div>
            </div>

            {/* Action Button: Generate Live Voice */}
            <button
              type="button"
              onClick={() => handleSynthesizeTest()}
              disabled={isSynthesizing}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 border-2 border-black transition-transform active:translate-y-0.5 disabled:opacity-50"
            >
              {isSynthesizing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sintesis Cartesia Sedang Berjalan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>▶ Uji Suara Live (Cartesia AI)</span>
                </>
              )}
            </button>

            {/* Error Notice */}
            {testError && (
              <div className="p-3 bg-red-950/40 border border-red-800 rounded-xl text-xs text-red-300">
                {testError}
              </div>
            )}

            {/* Audio Result & Player */}
            {audioUrl && (
              <div className="bg-[#141413] p-3.5 rounded-2xl border border-orange-500/40 flex flex-col gap-2.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Audio Siap Diputar</span>
                  </span>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                    <span>Durasi: {audioDuration}s</span>
                    <span>•</span>
                    <span className="text-orange-400 font-bold">{audioLatency}ms</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={togglePlayAudio}
                    className="w-10 h-10 rounded-xl bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center shadow-md transition-all shrink-0"
                  >
                    {isPlayingAudio ? (
                      <Square className="w-4 h-4 fill-white" />
                    ) : (
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    )}
                  </button>

                  <div className="flex-1 flex flex-col justify-center">
                    <span className="text-xs font-bold text-white truncate">
                      Hasil Suara: {VOICE_CATALOG.find((v) => v.id === selectedVoice)?.name || 'Karakter'}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      PCM S16LE • 44.1kHz • Mono
                    </span>
                  </div>

                  <a
                    href={audioUrl}
                    download="cartesia-voice-test.wav"
                    className="px-2.5 py-1.5 rounded-xl border border-zinc-700 hover:border-white text-[10px] font-bold text-zinc-300 hover:text-white transition-colors"
                  >
                    Unduh WAV
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

