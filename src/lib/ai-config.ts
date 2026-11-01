import 'server-only';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import {
  AIProviderId,
  AIProviderConfig,
  VideoAIConfig,
  VoiceAIConfig,
  SystemAIConfig,
  PROVIDER_MODELS,
} from '@/types/ai-config';

export * from '@/types/ai-config';

const DATA_DIR = path.join(process.cwd(), 'data');
const CONFIG_FILE = path.join(DATA_DIR, 'ai-config.json');

export const DEFAULT_AI_CONFIG: SystemAIConfig = {
  activeProvider: 'audira_route',
  fallbackEnabled: true,
  providers: {
    audira_route: {
      id: 'audira_route',
      name: 'Audira Route (9Router Gateway)',
      enabled: true,
      apiKey: 'sk-84766c18f4f56bc9-1jvuko-e537f0f2',
      model: 'ag/gemini-3.8-flash',
      baseUrl: 'http://localhost:20128/v1',
      temperature: 0.7,
      maxTokens: 4096,
    },
    ollama: {
      id: 'ollama',
      name: 'Ollama (Local AI)',
      enabled: true,
      apiKey: 'ollama-local',
      model: 'deepseek-r1:8b',
      baseUrl: 'http://localhost:11434/v1',
      temperature: 0.7,
      maxTokens: 4096,
    },
    gemini: {
      id: 'gemini',
      name: 'Google Gemini',
      enabled: true,
      apiKey: '',
      model: 'gemini-3.8-flash',
      temperature: 0.7,
      maxTokens: 4096,
    },
    claude: {
      id: 'claude',
      name: 'Anthropic Claude',
      enabled: false,
      apiKey: '',
      model: 'claude-3-5-sonnet-20241022',
      temperature: 0.7,
      maxTokens: 4096,
    },
    openai: {
      id: 'openai',
      name: 'OpenAI ChatGPT',
      enabled: false,
      apiKey: '',
      model: 'gpt-4o',
      baseUrl: 'https://api.openai.com/v1',
      temperature: 0.7,
      maxTokens: 4096,
    },
    deepseek: {
      id: 'deepseek',
      name: 'DeepSeek AI',
      enabled: false,
      apiKey: '',
      model: 'deepseek-chat',
      baseUrl: 'https://api.deepseek.com/v1',
      temperature: 0.7,
      maxTokens: 4096,
    },
    groq: {
      id: 'groq',
      name: 'Groq (Ultra-Fast)',
      enabled: false,
      apiKey: '',
      model: 'llama-3.3-70b-versatile',
      baseUrl: 'https://api.groq.com/openai/v1',
      temperature: 0.7,
      maxTokens: 4096,
    },
    custom: {
      id: 'custom',
      name: 'Custom OpenAI-Compatible',
      enabled: false,
      apiKey: '',
      model: 'custom-model',
      baseUrl: 'http://localhost:11434/v1',
      temperature: 0.7,
      maxTokens: 4096,
    },
  },
  videoAi: {
    klingApiKey: '',
    runwayApiKey: '',
    midjourneyApiKey: '',
    soraApiKey: '',
  },
  voiceAi: {
    cartesiaApiKey: 'sk_car_Zj8Wg7x9TENtmHsMw9Rpzo',
    elevenlabsApiKey: '',
    openaiTtsApiKey: '',
    defaultProvider: 'cartesia',
    defaultVoice: 'a053f6bc-7df4-40de-96d4-de026bc47ce8',
    speed: 1.0,
  },
  updatedAt: new Date().toISOString(),
};

function maskKey(key: string): string {
  if (!key || key.length < 8) return '';
  const start = key.slice(0, 4);
  const end = key.slice(-4);
  return `${start}••••••••${end}`;
}

export function getInternalAiConfig(): SystemAIConfig {
  let stored: Partial<SystemAIConfig> = {};
  if (existsSync(CONFIG_FILE)) {
    try {
      stored = JSON.parse(readFileSync(CONFIG_FILE, 'utf8'));
    } catch (err) {
      console.error('Failed reading ai-config.json, using defaults:', err);
    }
  }

  // Merge with defaults
  const config: SystemAIConfig = {
    ...DEFAULT_AI_CONFIG,
    ...stored,
    providers: {
      ...DEFAULT_AI_CONFIG.providers,
      ...(stored.providers || {}),
    },
    videoAi: {
      ...DEFAULT_AI_CONFIG.videoAi,
      ...(stored.videoAi || {}),
    },
    voiceAi: {
      ...DEFAULT_AI_CONFIG.voiceAi,
      ...(stored.voiceAi || {}),
    } as VoiceAIConfig,
    updatedAt: stored.updatedAt || new Date().toISOString(),
  };

  // Environment fallback for Cartesia Voice API key
  if (config.voiceAi && !config.voiceAi.cartesiaApiKey && process.env.CARTESIA_API_KEY) {
    config.voiceAi.cartesiaApiKey = process.env.CARTESIA_API_KEY;
  }

  // Ensure audira_route exists in providers
  if (!config.providers.audira_route) {
    config.providers.audira_route = { ...DEFAULT_AI_CONFIG.providers.audira_route };
  }
  if (!config.providers.audira_route.apiKey && (process.env.AUDIRA_ROUTE_KEY || process.env.NINEROUTER_KEY)) {
    config.providers.audira_route.apiKey = (process.env.AUDIRA_ROUTE_KEY || process.env.NINEROUTER_KEY) as string;
    config.providers.audira_route.enabled = true;
  }

  // Auto-upgrade deprecated Gemini models
  if (
    config.providers.gemini.model === 'gemini-2.0-flash' || 
    config.providers.gemini.model === 'gemini-1.5-flash' ||
    config.providers.gemini.model === 'gemini-1.5-pro'
  ) {
    config.providers.gemini.model = 'gemini-3.8-flash';
  }

  // Environment fallback for API keys if empty in config
  if (!config.providers.gemini.apiKey && process.env.GEMINI_API_KEY) {
    config.providers.gemini.apiKey = process.env.GEMINI_API_KEY;
    config.providers.gemini.enabled = true;
  }
  if (!config.providers.claude.apiKey && (process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN)) {
    config.providers.claude.apiKey = (process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN) as string;
    config.providers.claude.enabled = true;
  }
  if (!config.providers.openai.apiKey && process.env.OPENAI_API_KEY) {
    config.providers.openai.apiKey = process.env.OPENAI_API_KEY;
    config.providers.openai.enabled = true;
  }
  if (!config.providers.deepseek.apiKey && process.env.DEEPSEEK_API_KEY) {
    config.providers.deepseek.apiKey = process.env.DEEPSEEK_API_KEY;
    config.providers.deepseek.enabled = true;
  }
  if (!config.providers.groq.apiKey && process.env.GROQ_API_KEY) {
    config.providers.groq.apiKey = process.env.GROQ_API_KEY;
    config.providers.groq.enabled = true;
  }

  return config;
}

export function getSanitizedAiConfig(): SystemAIConfig {
  const internal = getInternalAiConfig();
  const sanitized: SystemAIConfig = JSON.parse(JSON.stringify(internal));

  // Mask API Keys for safe client delivery
  for (const pId of Object.keys(sanitized.providers) as AIProviderId[]) {
    const p = sanitized.providers[pId];
    if (p.apiKey) {
      p.apiKey = maskKey(p.apiKey);
    }
  }

  // Mask Video AI Keys
  sanitized.videoAi.klingApiKey = maskKey(sanitized.videoAi.klingApiKey);
  sanitized.videoAi.runwayApiKey = maskKey(sanitized.videoAi.runwayApiKey);
  sanitized.videoAi.midjourneyApiKey = maskKey(sanitized.videoAi.midjourneyApiKey);
  sanitized.videoAi.soraApiKey = maskKey(sanitized.videoAi.soraApiKey);

  // Mask Voice AI Keys
  if (sanitized.voiceAi) {
    sanitized.voiceAi.cartesiaApiKey = maskKey(sanitized.voiceAi.cartesiaApiKey);
    sanitized.voiceAi.elevenlabsApiKey = maskKey(sanitized.voiceAi.elevenlabsApiKey);
    sanitized.voiceAi.openaiTtsApiKey = maskKey(sanitized.voiceAi.openaiTtsApiKey);
  }

  return sanitized;
}

export function saveAiConfig(incoming: Partial<SystemAIConfig>): SystemAIConfig {
  const current = getInternalAiConfig();

  // If incoming keys contain mask bullets, keep current raw key!
  const updatedProviders = { ...current.providers };
  if (incoming.providers) {
    for (const pId of Object.keys(incoming.providers) as AIProviderId[]) {
      const inc = incoming.providers[pId];
      if (inc) {
        const existingKey = current.providers[pId]?.apiKey || '';
        const isMasked = inc.apiKey && inc.apiKey.includes('••••••••');
        const finalApiKey = isMasked ? existingKey : (inc.apiKey ?? existingKey);

        updatedProviders[pId] = {
          ...current.providers[pId],
          ...inc,
          apiKey: finalApiKey.trim(),
        };
      }
    }
  }

  // Handle Video AI keys masking
  const updatedVideoAi = { ...current.videoAi };
  if (incoming.videoAi) {
    for (const vKey of Object.keys(incoming.videoAi) as (keyof VideoAIConfig)[]) {
      const incomingVal = incoming.videoAi[vKey];
      const existingVal = current.videoAi[vKey] || '';
      const isMasked = incomingVal && incomingVal.includes('••••••••');
      updatedVideoAi[vKey] = isMasked ? existingVal : (incomingVal || existingVal).trim();
    }
  }

  // Handle Voice AI keys masking
  const updatedVoiceAi: VoiceAIConfig = {
    cartesiaApiKey: current.voiceAi?.cartesiaApiKey || '',
    elevenlabsApiKey: current.voiceAi?.elevenlabsApiKey || '',
    openaiTtsApiKey: current.voiceAi?.openaiTtsApiKey || '',
    defaultProvider: current.voiceAi?.defaultProvider || 'cartesia',
    defaultVoice: current.voiceAi?.defaultVoice || 'a053f6bc-7df4-40de-96d4-de026bc47ce8',
    speed: current.voiceAi?.speed || 1.0,
    ...(incoming.voiceAi || {}),
  };
  if (incoming.voiceAi) {
    const existingCartesia = current.voiceAi?.cartesiaApiKey || '';
    const incomingCartesia = incoming.voiceAi.cartesiaApiKey;
    updatedVoiceAi.cartesiaApiKey = (incomingCartesia && incomingCartesia.includes('••••••••')) ? existingCartesia : (incomingCartesia ?? existingCartesia).trim();

    const existingEleven = current.voiceAi?.elevenlabsApiKey || '';
    const incomingEleven = incoming.voiceAi.elevenlabsApiKey;
    updatedVoiceAi.elevenlabsApiKey = (incomingEleven && incomingEleven.includes('••••••••')) ? existingEleven : (incomingEleven ?? existingEleven).trim();

    const existingOpenAi = current.voiceAi?.openaiTtsApiKey || '';
    const incomingOpenAi = incoming.voiceAi.openaiTtsApiKey;
    updatedVoiceAi.openaiTtsApiKey = (incomingOpenAi && incomingOpenAi.includes('••••••••')) ? existingOpenAi : (incomingOpenAi ?? existingOpenAi).trim();
  }

  const newConfig: SystemAIConfig = {
    activeProvider: incoming.activeProvider || current.activeProvider,
    fallbackEnabled: incoming.fallbackEnabled ?? current.fallbackEnabled,
    providers: updatedProviders,
    videoAi: updatedVideoAi,
    voiceAi: updatedVoiceAi,
    updatedAt: new Date().toISOString(),
  };

  mkdirSync(DATA_DIR, { recursive: true });
  const tmp = `${CONFIG_FILE}.tmp`;
  writeFileSync(tmp, JSON.stringify(newConfig, null, 2), 'utf8');
  renameSync(tmp, CONFIG_FILE);

  return newConfig;
}

export async function testAiConnection(
  providerId: AIProviderId,
  overrideKey?: string,
  overrideModel?: string,
  overrideBaseUrl?: string,
): Promise<{ ok: boolean; latencyMs: number; message: string; model: string }> {
  const config = getInternalAiConfig();
  const provider = config.providers[providerId];
  const apiKey = (overrideKey && !overrideKey.includes('••••••••') ? overrideKey : provider.apiKey).trim();
  const model = overrideModel || provider.model;
  const baseUrl = overrideBaseUrl || provider.baseUrl;

  if (!apiKey) {
    return {
      ok: false,
      latencyMs: 0,
      model,
      message: `API Key untuk ${provider.name} belum diisi.`,
    };
  }

  const startTime = Date.now();

  try {
    if (providerId === 'gemini') {
      const activeModel = model === 'gemini-2.0-flash' || model === 'gemini-1.5-flash' || model === 'gemini-1.5-pro' ? 'gemini-3.8-flash' : model;
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent?key=${apiKey}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: 'Ping test! Respond with only the word OK.' }],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 10,
          },
        }),
      });

      const latencyMs = Date.now() - startTime;
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const errMsg = errData.error?.message || `HTTP ${res.status} ${res.statusText}`;
        return { ok: false, latencyMs, model, message: `Gemini Error: ${errMsg}` };
      }

      return { ok: true, latencyMs, model, message: `Berhasil terhubung ke Google Gemini (${latencyMs}ms)` };
    }

    if (providerId === 'claude') {
      const endpoint = 'https://api.anthropic.com/v1/messages';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: 10,
          messages: [{ role: 'user', content: 'Ping! Respond with OK.' }],
        }),
      });

      const latencyMs = Date.now() - startTime;
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const errMsg = errData.error?.message || `HTTP ${res.status}`;
        return { ok: false, latencyMs, model, message: `Claude Error: ${errMsg}` };
      }

      return { ok: true, latencyMs, model, message: `Berhasil terhubung ke Claude Anthropic (${latencyMs}ms)` };
    }

    if (providerId === 'audira_route' || providerId === 'ollama' || providerId === 'openai' || providerId === 'deepseek' || providerId === 'groq' || providerId === 'custom') {
      const finalBase = (baseUrl || (providerId === 'ollama' ? 'http://localhost:11434/v1' : providerId === 'audira_route' ? 'http://localhost:20128/v1' : providerId === 'deepseek' ? 'https://api.deepseek.com/v1' : 'https://api.openai.com/v1')).replace(/\/+$/, '');
      const endpoint = `${finalBase}/chat/completions`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: 'Ping! Respond with OK.' }],
          max_tokens: 10,
          temperature: 0.1,
        }),
      });

      const latencyMs = Date.now() - startTime;
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const errMsg = errData.error?.message || `HTTP ${res.status}`;
        return { ok: false, latencyMs, model, message: `${provider.name} Error: ${errMsg}` };
      }

      return { ok: true, latencyMs, model, message: `Berhasil terhubung ke ${provider.name} (${latencyMs}ms)` };
    }

    return { ok: false, latencyMs: 0, model, message: 'Provider tidak dikenal.' };
  } catch (err) {
    const latencyMs = Date.now() - startTime;
    return {
      ok: false,
      latencyMs,
      model,
      message: `Koneksi gagal: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}
