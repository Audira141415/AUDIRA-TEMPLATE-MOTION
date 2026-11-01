import { NextRequest, NextResponse } from 'next/server';
import { existsSync, mkdirSync, readdirSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

export const dynamic = 'force-dynamic';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function ensureUploadsDir() {
  if (!existsSync(UPLOADS_DIR)) {
    mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

// GET /api/upload - List recently uploaded files
export async function GET() {
  try {
    ensureUploadsDir();
    const files = readdirSync(UPLOADS_DIR);
    const uploads = files
      .filter((file) => !file.startsWith('.'))
      .map((file) => {
        const filePath = path.join(UPLOADS_DIR, file);
        const stats = statSync(filePath);
        return {
          filename: file,
          url: `/uploads/${encodeURIComponent(file)}`,
          size: stats.size,
          createdAt: stats.birthtime.toISOString(),
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ ok: true, uploads });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: 'Gagal membaca direktori uploads: ' + (err instanceof Error ? err.message : String(err)) },
      { status: 500 }
    );
  }
}

// POST /api/upload - Upload single or multiple images
export async function POST(req: NextRequest) {
  try {
    ensureUploadsDir();
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const label = (formData.get('label') as string) || '';

    if (!file) {
      return NextResponse.json(
        { ok: false, error: 'Tidak ada file yang dilampirkan.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { ok: false, error: `Format file tidak didukung (${file.type}). Gunakan PNG, JPG, WebP, GIF, atau SVG.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { ok: false, error: `Ukuran file terlalu besar (${(file.size / 1024 / 1024).toFixed(1)}MB). Maksimal 10MB.` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const ext = path.extname(sanitizedName) || '.png';
    const baseName = path.basename(sanitizedName, ext).slice(0, 32);
    const uniqueFileName = `${Date.now()}-${randomUUID().slice(0, 8)}-${baseName}${ext}`;
    const destinationPath = path.join(UPLOADS_DIR, uniqueFileName);

    writeFileSync(destinationPath, buffer);

    const publicUrl = `/uploads/${encodeURIComponent(uniqueFileName)}`;

    return NextResponse.json({
      ok: true,
      url: publicUrl,
      filename: uniqueFileName,
      originalName: file.name,
      label: label || file.name,
      size: file.size,
      mime: file.type,
      uploadedAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: 'Gagal mengunggah file: ' + (err instanceof Error ? err.message : String(err)) },
      { status: 500 }
    );
  }
}

// DELETE /api/upload - Delete uploaded file
export async function DELETE(req: NextRequest) {
  try {
    const { filename } = await req.json();
    if (!filename || typeof filename !== 'string') {
      return NextResponse.json({ ok: false, error: 'Nama file tidak valid.' }, { status: 400 });
    }

    const safeFilename = path.basename(filename);
    const targetPath = path.join(UPLOADS_DIR, safeFilename);

    if (existsSync(targetPath)) {
      unlinkSync(targetPath);
      return NextResponse.json({ ok: true, message: `File ${safeFilename} berhasil dihapus.` });
    }

    return NextResponse.json({ ok: false, error: 'File tidak ditemukan.' }, { status: 404 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: 'Gagal menghapus file: ' + (err instanceof Error ? err.message : String(err)) },
      { status: 500 }
    );
  }
}
