import { NextResponse } from 'next/server';
import { createUser, startSession, tooManyAttempts, validateRegistration } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (tooManyAttempts(`register:${ip}`)) {
    return NextResponse.json({ error: 'Terlalu banyak percobaan. Coba lagi dalam 10 menit.' }, { status: 429 });
  }
  const input = validateRegistration(await req.json().catch(() => ({})));
  if ('error' in input) return NextResponse.json({ error: input.error }, { status: 400 });

  const user = await createUser(input.name, input.email, input.password);
  if (!user) return NextResponse.json({ error: 'Email ini sudah terdaftar. Silakan masuk.' }, { status: 409 });

  await startSession(user.id);
  return NextResponse.json({ user }, { status: 201 });
}
