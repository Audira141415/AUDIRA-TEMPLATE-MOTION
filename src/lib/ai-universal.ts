import 'server-only';
import { MoodType, MotionFormat, SpeakerEmotion, Storyboard, StoryboardLine } from '@/types/motion';
import { DEMO_STORYBOARDS } from '@/lib/templates';
import { moodById } from '@/lib/moods';
import { FORMAT_BRIEF, SYSTEM, buildAdvancedPrompt } from '@/lib/script-prompts';
import { getInternalAiConfig, AIProviderId, AIProviderConfig } from '@/lib/ai-config';
import { rebalanceLines } from '@/lib/storyboard-utils';
import { generateStoryboardFromIdea } from '@/lib/script-generator';

interface RawScriptOutput {
  title?: string;
  locationName?: string;
  characterA?: { name: string; title: string };
  characterB?: { name: string; title: string };
  lines?: Array<{
    speaker?: 'A' | 'B' | string;
    text?: string;
    emotion?: string;
  }>;
  commentMagnetHook?: string;
}

function cleanExtractJson(raw: string): string {
  let text = raw.trim();
  // Strip out DeepSeek-R1 / Qwen thinking tags (<think>...</think>)
  text = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) text = fence[1];
  const first = text.indexOf('{');
  const last = text.lastIndexOf('}');
  if (first >= 0 && last > first) {
    text = text.slice(first, last + 1);
  }
  return text.replace(/[“”]/g, '"').replace(/,\s*([}\]])/g, '$1');
}

function estimateWords(text: string, start: number) {
  let t = start;
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const d = 0.12 + word.replace(/[^\p{L}\p{N}]/gu, '').length * 0.055;
      const w = { word, start: +t.toFixed(2), end: +(t + d).toFixed(2) };
      t += d + 0.03;
      return w;
    });
}

const VALID_EMOTIONS: SpeakerEmotion[] = ['neutral', 'hyped', 'angry', 'shocked', 'smug', 'thoughtful', 'sarcastic'];

function normalizeEmotion(val?: string): SpeakerEmotion {
  if (val && VALID_EMOTIONS.includes(val.toLowerCase() as SpeakerEmotion)) {
    return val.toLowerCase() as SpeakerEmotion;
  }
  return 'hyped';
}

function scriptToStoryboard(script: RawScriptOutput, idea: string, format: MotionFormat, mood: MoodType): Storyboard {
  const brief = FORMAT_BRIEF[format];
  const charA = script.characterA || { name: 'Karakter A', title: 'Host' };
  const charB = script.characterB || { name: 'Karakter B', title: 'Partner' };
  const rawLines = Array.isArray(script.lines) && script.lines.length >= 2 ? script.lines : [];

  let cursor = 0;
  const lines: StoryboardLine[] = rawLines
    .filter((l) => l.text && l.text.trim())
    .map((l, i) => {
      const isA = l.speaker === 'A' || l.speaker === charA.name || i % 2 === 0;
      const owner = isA ? charA : charB;
      const text = (l.text || '').trim();
      const words = estimateWords(text, cursor);
      const end = words.length ? words[words.length - 1].end : cursor + 2.5;
      const durationSec = +(end - cursor).toFixed(2);

      const line: StoryboardLine = {
        id: `ai-${i + 1}`,
        speaker: owner.name,
        speakerRole: brief.roles[isA ? 0 : 1],
        text,
        startSec: +cursor.toFixed(2),
        durationSec: durationSec > 0 ? durationSec : 2.5,
        emotion: normalizeEmotion(l.emotion),
        words,
      };
      cursor = end + 0.15;
      return line;
    });

  const { lines: rebalancedLines, totalDuration } = rebalanceLines(lines);

  return {
    id: `story-${Date.now().toString(36)}`,
    title: script.title || 'Video Reel Diskusi Menohok',
    concept: idea,
    format,
    mood,
    durationSec: totalDuration > 0 ? totalDuration : 15,
    fps: 30,
    locationName: script.locationName || 'Studio Live',
    characters: {
      characterA: { ...charA, avatar: 'character-a' },
      characterB: { ...charB, avatar: 'character-b' },
    },
    lines: rebalancedLines,
    commentMagnetHook: script.commentMagnetHook || 'Menurut lo bener gak nih? Tulis argumen lo di kolom komentar!',
    visualTheme: DEMO_STORYBOARDS[format]?.visualTheme || 'bold_split',
  };
}

async function callGemini(provider: AIProviderConfig, idea: string, format: MotionFormat, mood: MoodType): Promise<string> {
  const prompt = buildAdvancedPrompt({
    format,
    mood: moodById(mood),
    idea,
    targetModel: 'gemini',
    duration: '30s',
    slang: 'jakarta_gaul',
  });
  const activeModel = provider.model === 'gemini-2.0-flash' || provider.model === 'gemini-1.5-flash' || provider.model === 'gemini-1.5-pro' ? 'gemini-3.8-flash' : provider.model;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent?key=${provider.apiKey}`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: provider.temperature ?? 0.7,
        maxOutputTokens: provider.maxTokens ?? 4096,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Gemini API ${res.status}: ${err.error?.message || res.statusText}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini tidak memberikan naskah respons.');
  return text;
}

async function callClaude(provider: AIProviderConfig, idea: string, format: MotionFormat, mood: MoodType): Promise<string> {
  const prompt = buildAdvancedPrompt({
    format,
    mood: moodById(mood),
    idea,
    targetModel: 'claude',
    duration: '30s',
    slang: 'jakarta_gaul',
  });
  const endpoint = 'https://api.anthropic.com/v1/messages';

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': provider.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: provider.model,
      max_tokens: provider.maxTokens ?? 4096,
      temperature: provider.temperature ?? 0.7,
      system: SYSTEM,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Claude API ${res.status}: ${err.error?.message || res.statusText}`);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text;
  if (!text) throw new Error('Claude tidak memberikan naskah respons.');
  return text;
}

async function callOpenAiCompatible(provider: AIProviderConfig, idea: string, format: MotionFormat, mood: MoodType): Promise<string> {
  const targetModel = provider.id === 'deepseek' ? 'deepseek' : 'chatgpt';
  const prompt = buildAdvancedPrompt({
    format,
    mood: moodById(mood),
    idea,
    targetModel,
    duration: '30s',
    slang: 'jakarta_gaul',
  });

  const base = (provider.baseUrl || (provider.id === 'ollama' ? 'http://localhost:11434/v1' : provider.id === 'audira_route' ? 'http://localhost:20128/v1' : provider.id === 'deepseek' ? 'https://api.deepseek.com/v1' : 'https://api.openai.com/v1')).replace(/\/+$/, '');
  const endpoint = `${base}/chat/completions`;

  const isDeepSeekReasoner = provider.model.includes('reasoner');

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${provider.apiKey || 'ollama-local'}`,
    },
    body: JSON.stringify({
      model: provider.model,
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: prompt },
      ],
      stream: false,
      temperature: isDeepSeekReasoner ? undefined : (provider.temperature ?? 0.7),
      max_tokens: provider.maxTokens ?? 4096,
      response_format: (!isDeepSeekReasoner && provider.id !== 'audira_route' && provider.id !== 'ollama') ? { type: 'json_object' } : undefined,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`${provider.name} API ${res.status}: ${err.error?.message || res.statusText}`);
  }

  const rawText = await res.text();
  let text = '';
  try {
    const data = JSON.parse(rawText);
    text = data.choices?.[0]?.message?.content || '';
  } catch {
    // If response was SSE stream chunks (data: {...})
    if (rawText.includes('data:')) {
      const sseLines = rawText.split('\n');
      for (const line of sseLines) {
        if (line.startsWith('data:') && !line.includes('[DONE]')) {
          try {
            const chunk = JSON.parse(line.slice(5).trim());
            text += chunk.choices?.[0]?.delta?.content || chunk.choices?.[0]?.message?.content || '';
          } catch {
            // ignore malformed chunk
          }
        }
      }
    }
  }

  if (!text) throw new Error(`${provider.name} tidak memberikan naskah respons.`);
  return text;
}

export async function generateUniversalScript(
  idea: string,
  format: MotionFormat,
  mood: MoodType,
  preferredProvider?: AIProviderId,
): Promise<{ storyboard: Storyboard; providerUsed: string; modelUsed: string }> {
  const config = getInternalAiConfig();
  const activeId = preferredProvider || config.activeProvider || 'gemini';

  // Build priority order: preferred first, then other enabled ones with keys
  const providerOrder: AIProviderId[] = [activeId];
  if (config.fallbackEnabled) {
    const others = (Object.keys(config.providers) as AIProviderId[]).filter(
      (id) => id !== activeId && config.providers[id].enabled && config.providers[id].apiKey.trim(),
    );
    providerOrder.push(...others);
  }

  let lastError: Error | null = null;

  for (const pId of providerOrder) {
    const provider = config.providers[pId];
    if (!provider || !provider.apiKey.trim()) continue;

    try {
      let rawResponseText = '';
      if (pId === 'gemini') {
        rawResponseText = await callGemini(provider, idea, format, mood);
      } else if (pId === 'claude') {
        rawResponseText = await callClaude(provider, idea, format, mood);
      } else {
        rawResponseText = await callOpenAiCompatible(provider, idea, format, mood);
      }

      // Self-healing parsing
      const jsonStr = cleanExtractJson(rawResponseText);
      const parsed = JSON.parse(jsonStr) as RawScriptOutput;

      if (parsed && Array.isArray(parsed.lines) && parsed.lines.length >= 2) {
        const storyboard = scriptToStoryboard(parsed, idea, format, mood);
        return {
          storyboard,
          providerUsed: provider.name,
          modelUsed: provider.model,
        };
      }
    } catch (err) {
      console.warn(`Provider ${provider.name} failed, checking fallback:`, err);
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  // If all external AI providers failed or no keys configured, fall back to high-grade local script generator
  console.info('Falling back to local high-grade script generator');
  const localStoryboard = await generateStoryboardFromIdea(idea, format, mood);
  return {
    storyboard: localStoryboard,
    providerUsed: lastError ? `Local Fallback (${lastError.message.slice(0, 40)}...)` : 'AUDIRA Local Engine',
    modelUsed: 'audira-heuristic-v2',
  };
}
