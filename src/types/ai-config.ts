export type AIProviderId = 'audira_route' | 'ollama' | 'gemini' | 'claude' | 'openai' | 'deepseek' | 'groq' | 'custom';

export interface AIProviderConfig {
  id: AIProviderId;
  name: string;
  enabled: boolean;
  apiKey: string;
  model: string;
  baseUrl?: string;
  temperature: number;
  maxTokens: number;
  lastTestedAt?: string;
  lastTestStatus?: 'success' | 'error';
  lastTestMessage?: string;
  lastLatencyMs?: number;
}

export interface VideoAIConfig {
  klingApiKey: string;
  runwayApiKey: string;
  midjourneyApiKey: string;
  soraApiKey: string;
}

export interface VoiceAIConfig {
  cartesiaApiKey: string;
  elevenlabsApiKey: string;
  openaiTtsApiKey: string;
  defaultProvider: 'cartesia' | 'elevenlabs' | 'openai';
  defaultVoice: string;
  speed: number;
}

export interface VoiceCatalogItem {
  id: string;
  key: string;
  name: string;
  role: string;
  gender: 'Laki-laki' | 'Perempuan';
  desc: string;
  provider: 'cartesia' | 'elevenlabs' | 'openai';
  sampleText: string;
}

export const VOICE_CATALOG: VoiceCatalogItem[] = [
  {
    id: 'a053f6bc-7df4-40de-96d4-de026bc47ce8',
    key: 'andi',
    name: 'Andi',
    role: 'Human / Hero',
    gender: 'Laki-laki',
    desc: 'Hangat, energetik, gaya santai kreator muda Indonesia',
    provider: 'cartesia',
    sampleText: 'Gue mau resign besok, bro! Mau fokus streaming game!',
  },
  {
    id: '9076f14a-5602-48a7-bfd1-67ef9b40dd6d',
    key: 'safira',
    name: 'Safira',
    role: 'AI Assistant',
    gender: 'Perempuan',
    desc: 'Jernih, presisi, pintar ala asisten cerdas masa depan',
    provider: 'cartesia',
    sampleText: 'Pertanyaan cepat: followers lo sekarang udah berapa orang?',
  },
  {
    id: '04b567df-2923-4b0c-896b-4b7df0a07e1a',
    key: 'galang',
    name: 'Galang',
    role: 'Narrator / Explainer',
    gender: 'Laki-laki',
    desc: 'Bariton dalam, wibawa edukasi dan dokumenter sains',
    provider: 'cartesia',
    sampleText: 'Tahun 1993, sebuah paten transmisi sinyal cepat didaftarkan di Tokyo.',
  },
  {
    id: 'b441c4fd-4910-4c55-ae56-f0291057e2cc',
    key: 'siti',
    name: 'Siti',
    role: 'News Anchor',
    gender: 'Perempuan',
    desc: 'Tegas, artikulatif siaran berita Breaking News TV',
    provider: 'cartesia',
    sampleText: 'Breaking news: kasus penipuan persahabatan kembali memakan korban.',
  },
  {
    id: '74546efd-3ac5-4c41-ba59-4756227f429a',
    key: 'citra',
    name: 'Citra',
    role: 'Boss / Corporate',
    gender: 'Perempuan',
    desc: 'Tegas, autoritatif, karakter bos turn-based RPG dan manajer',
    provider: 'cartesia',
    sampleText: 'Wild boss appears: guys, sync sebentar lima menit yuk!',
  },
];

export interface SystemAIConfig {
  activeProvider: AIProviderId;
  fallbackEnabled: boolean;
  providers: Record<AIProviderId, AIProviderConfig>;
  videoAi: VideoAIConfig;
  voiceAi?: VoiceAIConfig;
  updatedAt: string;
}

export const PROVIDER_MODELS: Record<AIProviderId, { id: string; label: string; desc: string }[]> = {
  audira_route: [
    { id: 'ag/gemini-3.8-flash', label: 'Gemini 3.8 Flash (Rekomendasi Cepat)', desc: 'Eksekusi naskah secepat kilat & stabil' },
    { id: 'ag/claude-sonnet-5-5-high', label: 'Claude Sonnet High (Penalaran Tajam)', desc: 'Reasoning naskah terbaik & humor terstruktur' },
    { id: 'ag/gemini-4-argon-high', label: 'Gemini 4 Argon High (Context 1M)', desc: 'Kapasitas context raksasa untuk naskah riset' },
    { id: 'ag/gemini-3.1-pro-high', label: 'Gemini 3.1 Pro High', desc: 'Penalaran logis tanpa halusinasi' },
    { id: 'audira-combo', label: 'Audira Multi-Combo', desc: 'Rute multi-model auto-fallback' },
  ],
  ollama: [
    { id: 'deepseek-r1:8b', label: 'DeepSeek R1 8B (Cepat & Reasoning)', desc: 'Reasoning lokal super cepat, hemat VRAM' },
    { id: 'qwen3:8b', label: 'Qwen 3 8B (Multitask & Gaul)', desc: 'Naskah luwes gaya bahasa Indonesia' },
    { id: 'deepseek-r1:32b', label: 'DeepSeek R1 32B (Flagship)', desc: 'Penalaran setara OpenAI o3-mini' },
    { id: 'qwen2.5:32b', label: 'Qwen 2.5 32B', desc: 'Model 32B cerdas untuk naskah mendalam' },
    { id: 'qwen2.5-coder:32b', label: 'Qwen 2.5 Coder 32B', desc: 'Spesialis tech/coding banter' },
    { id: 'gemma2:27b', label: 'Gemma 2 27B', desc: 'Model Google open-weights berbobot tinggi' },
  ],
  gemini: [
    { id: 'gemini-3.8-flash', label: 'Gemini 3.8 Flash (Rekomendasi Resmi)', desc: 'Model mutakhir Google, ultra-cepat & stabil' },
    { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', desc: 'Generasi cepat sebelumnya' },
    { id: 'gemini-3.1-pro', label: 'Gemini 3.1 Pro', desc: 'Penalaran kompleks, naskah mendalam' },
  ],
  claude: [
    { id: 'claude-3-7-sonnet-20250219', label: 'Claude 3.7 Sonnet', desc: 'State-of-the-art reasoning Anthropic' },
    { id: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet (Rekomendasi)', desc: 'Paling presisi dalam format naskah JSON' },
    { id: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku', desc: 'Ringan, hemat biaya, instan' },
  ],
  openai: [
    { id: 'gpt-4o', label: 'GPT-4o (Omni)', desc: 'Model multimodal flagship OpenAI' },
    { id: 'gpt-4o-mini', label: 'GPT-4o Mini', desc: 'Cepat & murah untuk naskah reel harian' },
    { id: 'o3-mini', label: 'o3-mini (Reasoning)', desc: 'Reasoning logis tanpa halusinasi' },
  ],
  deepseek: [
    { id: 'deepseek-chat', label: 'DeepSeek V3 (Chat)', desc: 'Model umum super cerdas setara GPT-4o' },
    { id: 'deepseek-reasoner', label: 'DeepSeek R1 (Reasoner)', desc: 'Deep reasoning khusus analisis mendalam' },
  ],
  groq: [
    { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B', desc: 'Inference kecepatan tinggi 300+ tok/detik' },
    { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B', desc: 'MoE arsitektur cepat' },
  ],
  custom: [
    { id: 'custom-model', label: 'Custom Model ID', desc: 'Tentukan model manual dari endpoint OpenAI-kompatibel' },
  ],
};

