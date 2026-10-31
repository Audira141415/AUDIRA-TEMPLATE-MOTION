import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { MoodType, MotionFormat } from '@/types/motion';
import { MOODS } from '@/lib/moods';
import { DEMO_STORYBOARDS } from '@/lib/templates';
import { ScriptWriterUnavailable, writeScript } from '@/lib/ai-script';
import { currentUser } from '@/lib/auth';

export const runtime = 'nodejs';
export const maxDuration = 120;

export async function POST(req: Request) {
  if (!(await currentUser())) return NextResponse.json({ error: 'Silakan masuk dulu.' }, { status: 401 });

  const { idea, format, mood } = (await req.json()) as { idea?: string; format?: MotionFormat; mood?: MoodType };
  if (!idea?.trim() || idea.length > 600) {
    return NextResponse.json({ error: 'Ide wajib diisi (maksimal 600 karakter)' }, { status: 400 });
  }
  if (!format || !(format in DEMO_STORYBOARDS) || !MOODS.some((m) => m.id === mood)) {
    return NextResponse.json({ error: 'Format atau mood tidak dikenal' }, { status: 400 });
  }

  try {
    const storyboard = await writeScript(idea.trim(), format, mood!);
    return NextResponse.json({ storyboard });
  } catch (err) {
    if (err instanceof ScriptWriterUnavailable) {
      return NextResponse.json({ error: err.message, code: 'no_key' }, { status: 503 });
    }
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: 'Penulis naskah sedang sibuk, coba lagi sebentar.' }, { status: 429 });
    }
    if (err instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY tidak valid', code: 'no_key' }, { status: 503 });
    }
    if (err instanceof Anthropic.APIError) {
      return NextResponse.json({ error: `Claude API ${err.status}: ${err.message}` }, { status: 502 });
    }
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
