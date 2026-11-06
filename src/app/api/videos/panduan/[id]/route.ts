import { NextResponse } from 'next/server';
import { createReadStream, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EPISODE_MAP: Record<string, { filename: string; fallbackOrig: string }> = {
  '01': {
    filename: '01-pasang-skill.mp4',
    fallbackOrig: 'F:\\AUDIRA-VIDEO-MOTION\\AUDIRA_PASANG_MOTION_2026\\01 pasang skill.mp4'
  },
  '02': {
    filename: '02-sambung-mesh.mp4',
    fallbackOrig: 'F:\\AUDIRA-VIDEO-MOTION\\AUDIRA_PASANG_MOTION_2026\\02 smabung ke mesh.mp4'
  },
  '03': {
    filename: '03-studio-motion.mp4',
    fallbackOrig: 'F:\\AUDIRA-VIDEO-MOTION\\AUDIRA_PASANG_MOTION_2026\\03 studio.mp4'
  }
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cleanId = id.replace(/\.mp4$/i, '').padStart(2, '0');
  const ep = EPISODE_MAP[cleanId];

  if (!ep) {
    return NextResponse.json({ error: 'Video tutorial tidak ditemukan.' }, { status: 404 });
  }

  // 1. Check in public/panduan-videos/
  const publicPath = path.join(process.cwd(), 'public', 'panduan-videos', ep.filename);
  let targetPath = publicPath;

  if (!existsSync(targetPath)) {
    // 2. Check original directory in F:\
    if (existsSync(ep.fallbackOrig)) {
      targetPath = ep.fallbackOrig;
    } else {
      return NextResponse.json({ error: 'Berkas video tidak ditemukan di server.' }, { status: 404 });
    }
  }

  const stat = statSync(targetPath);
  const fileSize = stat.size;
  const range = req.headers.get('range');

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize || end >= fileSize) {
      return new NextResponse(null, {
        status: 416,
        headers: { 'Content-Range': `bytes */${fileSize}` }
      });
    }

    const chunksize = end - start + 1;
    const fileStream = createReadStream(targetPath, { start, end });
    const stream = Readable.toWeb(fileStream) as ReadableStream<Uint8Array>;

    return new NextResponse(stream, {
      status: 206,
      headers: {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize.toString(),
        'Content-Type': 'video/mp4',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }

  const fileStream = createReadStream(targetPath);
  const stream = Readable.toWeb(fileStream) as ReadableStream<Uint8Array>;

  return new NextResponse(stream, {
    status: 200,
    headers: {
      'Content-Length': fileSize.toString(),
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}

