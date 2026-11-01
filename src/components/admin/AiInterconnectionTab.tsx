'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Cpu, Key, CheckCircle2, AlertTriangle, XCircle, RefreshCw, 
  Eye, EyeOff, Save, Zap, Play, Globe, Sliders, ShieldCheck, Video, ExternalLink
} from 'lucide-react';
import { AIProviderId, SystemAIConfig, PROVIDER_MODELS, VideoAIConfig } from '@/types/ai-config';

interface ModelOption {
  id: string;
  label: string;
  desc: string;
}

interface TestStatus {
  testing: boolean;
  ok?: boolean;
  latencyMs?: number;
  message?: string;
}

const PROVIDER_METADATA: Record<AIProviderId, {
  name: string;
  badge: string;
  color: string;
  keyHelpUrl: string;
  keyPlaceholder: string;
  defaultBaseUrl?: string;
}> = {
  audira_route: {
    name: 'Audira Route (9Router Gateway)',
    badge: 'Gateway Multi-Model Resmi (46+ Model)',
    color: 'border-orange-500/50 bg-gradient-to-r from-orange-950/40 via-zinc-900 to-amber-950/20 text-orange-400',
    keyHelpUrl: 'http://localhost:20128/dashboard',
    keyPlaceholder: 'sk-84766c18f4f56bc9-1jvuko-e537f0f2',
    defaultBaseUrl: 'http://localhost:20128/v1',
  },
  ollama: {
    name: 'Ollama Local AI',
    badge: '100% Offline & Gratis (VRAM GPU)',
    color: 'border-emerald-500/50 bg-emerald-950/30 text-emerald-400',
    keyHelpUrl: 'http://localhost:11434',
    keyPlaceholder: 'Tidak butuh API key (Otomatis lokal)',
    defaultBaseUrl: 'http://localhost:11434/v1',
  },
  gemini: {
    name: 'Google Gemini',
    badge: 'Rekomendasi Cepat & Gratis',
    color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-400',
    keyHelpUrl: 'https://aistudio.google.com/app/apikey',
    keyPlaceholder: 'AIzaSy...',
  },
  claude: {
    name: 'Anthropic Claude',
    badge: 'Format Paling Presisi',
    color: 'border-amber-500/40 bg-amber-950/20 text-amber-400',
    keyHelpUrl: 'https://console.anthropic.com/settings/keys',
    keyPlaceholder: 'sk-ant-api03-...',
  },
  openai: {
    name: 'OpenAI ChatGPT',
    badge: 'Universal GPT-4o',
    color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400',
    keyHelpUrl: 'https://platform.openai.com/api-keys',
    keyPlaceholder: 'sk-proj-...',
    defaultBaseUrl: 'https://api.openai.com/v1',
  },
  deepseek: {
    name: 'DeepSeek AI',
    badge: 'Reasoning R1 & V3 Ekonomis',
    color: 'border-blue-500/40 bg-blue-950/20 text-blue-400',
    keyHelpUrl: 'https://platform.deepseek.com/api_keys',
    keyPlaceholder: 'sk-...',
    defaultBaseUrl: 'https://api.deepseek.com/v1',
  },
  groq: {
    name: 'Groq Cloud',
    badge: 'Ultra Fast (300+ tok/s)',
    color: 'border-orange-500/40 bg-orange-950/20 text-orange-400',
    keyHelpUrl: 'https://console.groq.com/keys',
    keyPlaceholder: 'gsk_...',
    defaultBaseUrl: 'https://api.groq.com/openai/v1',
  },
  custom: {
    name: 'Custom / Ollama Local',
    badge: 'Self-Hosted / Proxy',
    color: 'border-purple-500/40 bg-purple-950/20 text-purple-400',
    keyHelpUrl: 'https://ollama.com/',
    keyPlaceholder: 'sk-... atau kosongkan jika Ollama lokal',
    defaultBaseUrl: 'http://localhost:11434/v1',
  },
};

export const AiInterconnectionTab: React.FC = () => {
  const [config, setConfig] = useState<SystemAIConfig | null>(null);
  const [models, setModels] = useState<Record<AIProviderId, ModelOption[]> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, TestStatus>>({});

  const loadConfig = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/ai-config');
      if (res.ok) {
        const data = await res.json();
        setConfig(data.config);
        setModels(data.models || PROVIDER_MODELS);
      }
    } catch (err) {
      console.error('Failed to load AI config:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUpdateProvider = (
    providerId: AIProviderId,
    field: string,
    value: unknown,
  ) => {
    if (!config) return;
    setConfig((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        providers: {
          ...prev.providers,
          [providerId]: {
            ...prev.providers[providerId],
            [field]: value,
          },
        },
      };
    });
  };

  const handleUpdateVideoAi = (field: keyof VideoAIConfig, value: string) => {
    if (!config) return;
    setConfig((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        videoAi: {
          ...prev.videoAi,
          [field]: value,
        },
      };
    });
  };

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    setSaveToast(null);
    try {
      const res = await fetch('/api/admin/ai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (res.ok) {
        setConfig(data.config);
        setSaveToast({ tone: 'ok', text: 'Konfigurasi Interkoneksi AI berhasil disimpan & langsung aktif!' });
      } else {
        setSaveToast({ tone: 'error', text: data.error || 'Gagal menyimpan konfigurasi.' });
      }
    } catch {
      setSaveToast({ tone: 'error', text: 'Koneksi ke server gagal saat menyimpan.' });
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async (providerId: AIProviderId) => {
    if (!config) return;
    const provider = config.providers[providerId];
    setTestResults((prev) => ({
      ...prev,
      [providerId]: { testing: true, message: 'Mengirimkan payload ping...' },
    }));

    try {
      const res = await fetch('/api/admin/ai-config/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId,
          apiKey: provider.apiKey,
          model: provider.model,
          baseUrl: provider.baseUrl,
        }),
      });

      const data = await res.json();
      setTestResults((prev) => ({
        ...prev,
        [providerId]: {
          testing: false,
          ok: data.ok,
          latencyMs: data.latencyMs,
          message: data.message,
        },
      }));
    } catch (err) {
      setTestResults((prev) => ({
        ...prev,
        [providerId]: {
          testing: false,
          ok: false,
          message: `Koneksi gagal: ${err instanceof Error ? err.message : String(err)}`,
        },
      }));
    }
  };

  if (loading || !config) {
    return (
      <div className="flex flex-col items-center justify-center p-16 gap-3 text-zinc-400">
        <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
        <p className="font-mono text-sm">Memuat konfigurasi interkoneksi AI...</p>
      </div>
    );
  }

  const providersList = Object.keys(config.providers) as AIProviderId[];

  return (
    <div className="flex flex-col gap-8">
      {/* Toast Feedback */}
      {saveToast && (
        <div
          role="status"
          className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-sm font-semibold transition-all ${
            saveToast.tone === 'ok'
              ? 'border-emerald-800 bg-emerald-950/50 text-emerald-200'
              : 'border-red-800 bg-red-950/50 text-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {saveToast.tone === 'ok' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-400" />
            )}
            <span>{saveToast.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveToast(null)}
            className="text-xs opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Banner & Global Orchestrator Controls */}
      <div className="rounded-3xl border-2 border-zinc-800 bg-[#1c1c1a] p-6 sm:p-8 flex flex-col gap-6 shadow-brutal">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-3 py-1 rounded-full bg-orange-600/20 text-orange-400 border border-orange-500/30 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                Multi-LLM Interconnection Gateway
              </span>
              <span className="text-zinc-500">•</span>
              <span className="text-xs text-zinc-400 font-mono">
                Sinkron dengan Studio & Prompt Compiler
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Pusat Manajemen Kunci API & Model AI
            </h2>
            <p className="mt-1 text-sm text-zinc-400 max-w-2xl">
              Hubungkan sistem naskah AUDIRA Motion ke model AI pilihan Anda (Google Gemini, Claude, ChatGPT, DeepSeek, atau Groq). Kunci disimpan aman di server dan otomatis dimasking.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-sm uppercase tracking-wider shadow-brutal flex items-center justify-center gap-2 border-2 border-black transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan</span>
              </>
            )}
          </button>
        </div>

        {/* Global Settings Grid: Active Provider & Fallback */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Active Provider Selector */}
          <div className="bg-[#141413] p-5 rounded-2xl border border-zinc-800 flex flex-col gap-3">
            <label className="text-xs font-black uppercase tracking-wider text-orange-400 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Provider Utama Naskah (Default Active Engine)</span>
            </label>
            <p className="text-xs text-zinc-400 -mt-1">
              Model ini yang akan dipanggil saat pengguna menekan &quot;Generate Video Reel&quot; di Studio.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
              {providersList.map((pId) => {
                const p = config.providers[pId];
                const isSelected = config.activeProvider === pId;
                const hasKey = Boolean(p.apiKey);

                return (
                  <button
                    key={pId}
                    type="button"
                    onClick={() => setConfig((prev) => (prev ? { ...prev, activeProvider: pId } : prev))}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                      isSelected
                        ? 'border-orange-500 bg-orange-600/15 text-white shadow-sm ring-1 ring-orange-500'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs">{p.name.split(' ')[0]}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />}
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400 truncate">{p.model}</span>
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${hasKey ? 'text-emerald-400' : 'text-zinc-500'}`}>
                      {hasKey ? '● Siap' : '○ Belum Diisi'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Auto-Fallback Guardrail */}
          <div className="bg-[#141413] p-5 rounded-2xl border border-zinc-800 flex flex-col justify-between gap-4">
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Multi-Model Auto-Fallback System</span>
              </label>
              <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
                Jika provider utama mengalami <strong>Rate Limit (429)</strong> atau <strong>Server Down (503)</strong>, sistem secara otomatis mengalihkan naskah ke provider cadangan lain yang aktif tanpa membuat pengguna gagal generate.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
              <span className="text-xs font-bold text-zinc-200">
                Aktifkan Failover Otomatis
              </span>
              <button
                type="button"
                onClick={() => setConfig((prev) => (prev ? { ...prev, fallbackEnabled: !prev.fallbackEnabled } : prev))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.fallbackEnabled ? 'bg-orange-600' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.fallbackEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of All AI Providers */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-black uppercase tracking-wider text-zinc-300 flex items-center gap-2">
            <Key className="w-4 h-4 text-orange-500" />
            <span>Konfigurasi Masing-Masing Provider LLM</span>
          </h3>
          <span className="text-xs text-zinc-500 font-mono">
            Tersimpan di data/ai-config.json
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {providersList.map((pId) => {
            const provider = config.providers[pId];
            const meta = PROVIDER_METADATA[pId];
            const modelOptions = models?.[pId] || PROVIDER_MODELS[pId] || [];
            const isVisible = visibleKeys[pId];
            const test = testResults[pId];
            const isDefault = config.activeProvider === pId;

            return (
              <div
                key={pId}
                className={`rounded-3xl border-2 bg-[#1c1c1a] p-6 flex flex-col justify-between gap-5 transition-all ${
                  isDefault ? 'border-orange-500/80 shadow-brutal-sm' : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {/* Provider Header */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-black text-white">{meta.name}</h4>
                      {isDefault && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-orange-600 text-white">
                          DEFAULT
                        </span>
                      )}
                    </div>

                    {/* Enable Switch */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-zinc-400 font-medium">
                        {provider.enabled ? 'Aktif' : 'Mati'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateProvider(pId, 'enabled', !provider.enabled)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          provider.enabled ? 'bg-emerald-600' : 'bg-zinc-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                            provider.enabled ? 'translate-x-4.5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold ${meta.color}`}>
                      {meta.badge}
                    </span>
                    <a
                      href={meta.keyHelpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 underline underline-offset-2 transition-colors ml-auto"
                    >
                      <span>Ambil API Key</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* API Key Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                    <span>API Key {meta.name}</span>
                    <span className="font-mono text-[10px] text-zinc-500">
                      {provider.apiKey ? 'Terisi' : 'Kosong'}
                    </span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={isVisible ? 'text' : 'password'}
                      value={provider.apiKey || ''}
                      onChange={(e) => handleUpdateProvider(pId, 'apiKey', e.target.value)}
                      placeholder={meta.keyPlaceholder}
                      className="w-full bg-[#141413] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-orange-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => toggleKeyVisibility(pId)}
                      className="absolute right-3 text-zinc-400 hover:text-white transition-colors"
                      title={isVisible ? 'Sembunyikan Kunci' : 'Tampilkan Kunci'}
                    >
                      {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Model Selector & BaseURL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                      Model ID
                    </label>
                    <select
                      value={provider.model}
                      onChange={(e) => handleUpdateProvider(pId, 'model', e.target.value)}
                      className="bg-[#141413] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 font-bold focus:outline-none focus:border-orange-500"
                    >
                      {modelOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {(provider.baseUrl !== undefined || meta.defaultBaseUrl) && (
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-cyan-400" />
                        <span>Base URL Endpoint</span>
                      </label>
                      <input
                        type="text"
                        value={provider.baseUrl || ''}
                        onChange={(e) => handleUpdateProvider(pId, 'baseUrl', e.target.value)}
                        placeholder={meta.defaultBaseUrl || 'https://...'}
                        className="bg-[#141413] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  )}
                </div>

                {/* Hyperparameters: Temperature & Max Tokens */}
                <div className="grid grid-cols-2 gap-3 bg-[#141413] p-3 rounded-2xl border border-zinc-800/80">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-zinc-400">
                      <span>Creativity / Temp</span>
                      <span className="font-mono text-orange-400">{provider.temperature ?? 0.7}</span>
                    </div>
                    <input
                      type="range"
                      min={0.1}
                      max={1.0}
                      step={0.1}
                      value={provider.temperature ?? 0.7}
                      onChange={(e) => handleUpdateProvider(pId, 'temperature', parseFloat(e.target.value))}
                      className="w-full accent-orange-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-zinc-400">
                      <span>Max Output Tokens</span>
                      <span className="font-mono text-cyan-400">{provider.maxTokens ?? 4096}</span>
                    </div>
                    <select
                      value={provider.maxTokens ?? 4096}
                      onChange={(e) => handleUpdateProvider(pId, 'maxTokens', parseInt(e.target.value))}
                      className="bg-zinc-900 border border-zinc-700/80 rounded-lg px-2 py-1 text-[11px] text-zinc-200 font-mono focus:outline-none"
                    >
                      <option value={2048}>2048 (Cepat)</option>
                      <option value={4096}>4096 (Standar)</option>
                      <option value={8192}>8192 (Panjang)</option>
                      <option value={16384}>16384 (Ekstra)</option>
                    </select>
                  </div>
                </div>

                {/* Ping Test Button & Result Box */}
                <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      disabled={test?.testing}
                      onClick={() => handleTestConnection(pId)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-700 hover:border-orange-500 bg-zinc-900 text-xs font-bold text-zinc-200 hover:text-white transition-all disabled:opacity-50"
                    >
                      {test?.testing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-orange-500" />
                          <span>Menguji...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                          <span>Uji Koneksi (Ping)</span>
                        </>
                      )}
                    </button>

                    {test?.latencyMs !== undefined && (
                      <span className="font-mono text-[11px] text-zinc-400">
                        Latency: <strong className="text-emerald-400">{test.latencyMs}ms</strong>
                      </span>
                    )}
                  </div>

                  {test?.message && (
                    <div
                      className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-start gap-2 ${
                        test.ok
                          ? 'border-emerald-800 bg-emerald-950/40 text-emerald-300'
                          : 'border-red-800 bg-red-950/40 text-red-300'
                      }`}
                    >
                      {test.ok ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                      )}
                      <p className="leading-snug">{test.message}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video AI Generation Keys Section (Pass 2) */}
      <div className="rounded-3xl border-2 border-zinc-800 bg-[#1c1c1a] p-6 sm:p-8 flex flex-col gap-6 shadow-brutal">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-0.5 rounded-full bg-purple-600/20 text-purple-400 border border-purple-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <Video className="w-3 h-3" />
                Pass 2: Video AI Motion Engine
              </span>
            </div>
            <h3 className="text-xl font-black text-white">
              Integrasi Video AI Generative (Latar Belakang & Aset 9:16)
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Hubungkan kunci API untuk Kling AI, Runway Gen-3, Midjourney, atau OpenAI Sora agar studio dapat langsung merender video latar sinematik.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Kling AI */}
          <div className="bg-[#141413] p-4 rounded-2xl border border-zinc-800 flex flex-col gap-2">
            <span className="text-xs font-black text-white uppercase tracking-wider">Kling 1.5 API</span>
            <input
              type="password"
              value={config.videoAi.klingApiKey || ''}
              onChange={(e) => handleUpdateVideoAi('klingApiKey', e.target.value)}
              placeholder="kling_api_key_..."
              className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
            />
            <span className="text-[10px] text-zinc-500">60 FPS realistic motion vertical</span>
          </div>

          {/* Runway Gen-3 */}
          <div className="bg-[#141413] p-4 rounded-2xl border border-zinc-800 flex flex-col gap-2">
            <span className="text-xs font-black text-white uppercase tracking-wider">Runway Gen-3 Alpha</span>
            <input
              type="password"
              value={config.videoAi.runwayApiKey || ''}
              onChange={(e) => handleUpdateVideoAi('runwayApiKey', e.target.value)}
              placeholder="runway_api_key_..."
              className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
            />
            <span className="text-[10px] text-zinc-500">Cinematic camera control passes</span>
          </div>

          {/* Midjourney ImagineAPI */}
          <div className="bg-[#141413] p-4 rounded-2xl border border-zinc-800 flex flex-col gap-2">
            <span className="text-xs font-black text-white uppercase tracking-wider">Midjourney API</span>
            <input
              type="password"
              value={config.videoAi.midjourneyApiKey || ''}
              onChange={(e) => handleUpdateVideoAi('midjourneyApiKey', e.target.value)}
              placeholder="mj_imagine_key_..."
              className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
            />
            <span className="text-[10px] text-zinc-500">V6.1 9:16 high-contrast raw</span>
          </div>

          {/* OpenAI Sora */}
          <div className="bg-[#141413] p-4 rounded-2xl border border-zinc-800 flex flex-col gap-2">
            <span className="text-xs font-black text-white uppercase tracking-wider">OpenAI Sora API</span>
            <input
              type="password"
              value={config.videoAi.soraApiKey || ''}
              onChange={(e) => handleUpdateVideoAi('soraApiKey', e.target.value)}
              placeholder="sora_api_key_..."
              className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
            />
            <span className="text-[10px] text-zinc-500">Temporal coherence video rendering</span>
          </div>
        </div>

        {/* Bottom Save Action Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
          <span className="text-xs text-zinc-500 font-mono">
            Terakhir disimpan: {new Date(config.updatedAt).toLocaleString('id-ID')}
          </span>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-brutal transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Semua Kunci & Konfigurasi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
