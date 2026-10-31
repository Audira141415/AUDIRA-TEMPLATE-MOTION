import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { currentUser } from '@/lib/auth';
import { jobDir, ownedJobDir } from '@/lib/render-jobs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return new Response('Unauthorized', { status: 401 });
  const { id } = await params;
  const dir = user.role === 'superadmin' ? jobDir(id) : ownedJobDir(id, user.id);
  const file = dir && path.join(dir, 'reel.mp4');
  if (!file || !existsSync(file)) return new Response('Not found', { status: 404 });
  const download = new URL(req.url).searchParams.has('download');
  return new Response(readFileSync(file), {
    headers: {
      'Content-Type': 'video/mp4',
      'Cache-Control': 'no-store',
      ...(download ? { 'Content-Disposition': `attachment; filename="${id}.mp4"` } : {}),
    },
  });
}
