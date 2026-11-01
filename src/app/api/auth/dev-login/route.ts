import { NextResponse } from 'next/server';
import { listUsers, startSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Dev login dinonaktifkan di production.' }, { status: 403 });
  }

  const users = listUsers();
  const superadmin = users.find((u) => u.role === 'superadmin' && !u.disabled);

  if (!superadmin) {
    return NextResponse.json({ error: 'Superadmin tidak ditemukan di database.' }, { status: 404 });
  }

  await startSession(superadmin.id);
  return NextResponse.json({ ok: true, user: superadmin });
}

