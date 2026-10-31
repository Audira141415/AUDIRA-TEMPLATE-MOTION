import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import { z } from 'zod';
import { MoodType, MotionFormat, SpeakerEmotion, Storyboard, StoryboardLine } from '@/types/motion';
import { DEMO_STORYBOARDS } from '@/lib/templates';
import { moodById } from '@/lib/moods';
import { FORMAT_BRIEF, SYSTEM } from '@/lib/script-prompts';

const EMOTIONS = ['neutral', 'hyped', 'angry', 'shocked', 'smug', 'thoughtful', 'sarcastic'] as const;

const ScriptSchema = z.object({
  title: z.string().describe('Judul reel, maksimal 8 kata, bikin penasaran'),
  locationName: z.string().describe('Nama tempat/latar yang tampil di layar, maksimal 4 kata'),
  characterA: z.object({ name: z.string(), title: z.string().describe('Label 2-3 kata di bawah nama') }),
  characterB: z.object({ name: z.string(), title: z.string().describe('Label 2-3 kata di bawah nama') }),
  lines: z.array(
    z.object({
      speaker: z.enum(['A', 'B']),
      text: z.string().describe('Satu baris dialog/narasi, maksimal 16 kata'),
      emotion: z.enum(EMOTIONS),
    }),
  ),
  commentMagnetHook: z.string().describe('Pertanyaan penutup yang memancing debat di komentar, maksimal 12 kata'),
});

type Script = z.infer<typeof ScriptSchema>;

export class ScriptWriterUnavailable extends Error {}

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

function toStoryboard(script: Script, idea: string, format: MotionFormat, mood: MoodType): Storyboard {
  const brief = FORMAT_BRIEF[format];
  let cursor = 0;
  const lines: StoryboardLine[] = script.lines
    .filter((l) => l.text.trim())
    .map((l, i) => {
      const owner = l.speaker === 'A' ? script.characterA : script.characterB;
      const words = estimateWords(l.text, cursor);
      const end = words.length ? words[words.length - 1].end : cursor + 1;
      const line: StoryboardLine = {
        id: `ai-${i + 1}`,
        speaker: owner.name,
        speakerRole: brief.roles[l.speaker === 'A' ? 0 : 1],
        text: l.text.trim(),
        startSec: +cursor.toFixed(2),
        durationSec: +(end - cursor).toFixed(2),
        emotion: l.emotion as SpeakerEmotion,
        words,
      };
      cursor = end + 0.15;
      return line;
    });

  return {
    id: `story-${Date.now().toString(36)}`,
    title: script.title,
    concept: idea,
    format,
    mood,
    durationSec: +cursor.toFixed(1),
    fps: 30,
    locationName: script.locationName,
    characters: {
      characterA: { ...script.characterA, avatar: 'character-a' },
      characterB: { ...script.characterB, avatar: 'character-b' },
    },
    lines,
    commentMagnetHook: script.commentMagnetHook,
    visualTheme: DEMO_STORYBOARDS[format].visualTheme,
  };
}

export async function writeScript(idea: string, format: MotionFormat, mood: MoodType): Promise<Storyboard> {
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    throw new ScriptWriterUnavailable('ANTHROPIC_API_KEY belum diset di .env.local');
  }
  const client = new Anthropic();
  const m = moodById(mood);

  const response = await client.beta.messages.parse({
    model: 'claude-opus-5-5',
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'medium', format: betaZodOutputFormat(ScriptSchema) },
    system: SYSTEM,
    messages: [
      {
        role: 'user',
        content: `Format: ${FORMAT_BRIEF[format].cast}

Mood: ${m.label}. ${m.direction}

Ide pengguna: ${idea}`,
      },
    ],
  });

  if (response.stop_reason === 'refusal') {
    throw new Error('Ide ini ditolak oleh model. Coba ubah idenya.');
  }
  if (!response.parsed_output) {
    throw new Error(`Naskah tidak bisa dibaca (stop_reason: ${response.stop_reason})`);
  }
  return toStoryboard(response.parsed_output, idea, format, mood);
}
