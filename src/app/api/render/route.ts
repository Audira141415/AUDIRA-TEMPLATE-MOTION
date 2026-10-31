import { NextResponse } from 'next/server';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { Storyboard } from '@/types/motion';
import { currentUser } from '@/lib/auth';
import { RENDERS_DIR, setJobOwner } from '@/lib/render-jobs';

export const runtime = 'nodejs';

const QUALITIES = new Set(['draft', 'looks', 'delivery']);

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'Silakan masuk dulu.' }, { status: 401 });

  const body = (await req.json()) as { storyboard?: Storyboard; quality?: string };
  const storyboard = body.storyboard;
  if (!storyboard?.lines?.length || !storyboard.format) {
    return NextResponse.json({ error: 'Storyboard tidak valid' }, { status: 400 });
  }
  const quality = QUALITIES.has(body.quality ?? '') ? body.quality! : 'looks';

  const id = `reel-${Date.now().toString(36)}`;
  const outDir = path.join(RENDERS_DIR, id);
  mkdirSync(outDir, { recursive: true });
  setJobOwner(outDir, user.id);
  const input = path.join(outDir, 'input.json');
  writeFileSync(input, JSON.stringify(storyboard));
  writeFileSync(path.join(outDir, 'status.json'), JSON.stringify({ state: 'queued', progress: 0 }));

  const script = path.join(process.cwd(), 'engine', 'build-reel.mjs');
  const child = spawn(process.execPath, [script, input, '--out', outDir, '--quality', quality], {
    cwd: process.cwd(),
    detached: true,
    stdio: 'ignore',
  });
  child.unref();

  return NextResponse.json({ id });
}
