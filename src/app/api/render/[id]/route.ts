import { NextResponse } from 'next/server';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { currentUser } from '@/lib/auth';
import { jobDir, ownedJobDir } from '@/lib/render-jobs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'Silakan masuk dulu.' }, { status: 401 });
  const { id } = await params;
  const dir = user.role === 'superadmin' ? jobDir(id) : ownedJobDir(id, user.id);
  const file = dir && path.join(dir, 'status.json');
  if (!file || !existsSync(file)) return NextResponse.json({ error: 'Job tidak ditemukan' }, { status: 404 });
  try {
    return NextResponse.json(JSON.parse(readFileSync(file, 'utf8')));
  } catch {
    return NextResponse.json({ state: 'voicing', progress: 0 });
  }
}
