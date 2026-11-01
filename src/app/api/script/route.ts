import { NextResponse } from 'next/server';
import { MoodType, MotionFormat } from '@/types/motion';
import { MOODS } from '@/lib/moods';
import { DEMO_STORYBOARDS } from '@/lib/templates';
import { currentUser } from '@/lib/auth';
import { generateUniversalScript } from '@/lib/ai-universal';
import { AIProviderId } from '@/lib/ai-config';

export const runtime = 'nodejs';
export const maxDuration = 120;

export async function POST(req: Request) {
  const user = await currentUser();
  // Allow authenticated users OR allow local development mode
  if (!user && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Silakan masuk dulu untuk menggunakan AI.' }, { status: 401 });
  }

  const { idea, format, mood, provider } = (await req.json().catch(() => ({}))) as {
    idea?: string;
    format?: MotionFormat;
    mood?: MoodType;
    provider?: AIProviderId;
  };

  if (!idea?.trim() || idea.length > 600) {
    return NextResponse.json({ error: 'Ide wajib diisi (maksimal 600 karakter)' }, { status: 400 });
  }
  if (!format || !(format in DEMO_STORYBOARDS) || !MOODS.some((m) => m.id === mood)) {
    return NextResponse.json({ error: 'Format atau mood tidak dikenal' }, { status: 400 });
  }

  try {
    const result = await generateUniversalScript(idea.trim(), format, mood!, provider);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
