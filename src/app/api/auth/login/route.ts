import { NextResponse } from 'next/server';
import { authenticate, normalizeEmail, startSession, tooManyAttempts } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const { email = '', password = '' } = (await req.json().catch(() => ({}))) as { email?: string; password?: string };
  if (!email || !password) return NextResponse.json({ error: 'Email dan kata sandi wajib diisi.' }, { status: 400 });

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (tooManyAttempts(`login:${ip}:${normalizeEmail(email)}`)) {
    return NextResponse.json({ error: 'Terlalu banyak percobaan. Coba lagi dalam 10 menit.' }, { status: 429 });
  }

  const user = await authenticate(email, password);
  if (!user) return NextResponse.json({ error: 'Email atau kata sandi salah.' }, { status: 401 });

  await startSession(user.id);
  return NextResponse.json({ user });
}
