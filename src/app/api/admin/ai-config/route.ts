import { NextResponse } from 'next/server';
import { currentAdmin } from '@/lib/auth';
import { getSanitizedAiConfig, saveAiConfig, PROVIDER_MODELS } from '@/lib/ai-config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const admin = await currentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Akses khusus superadmin.' }, { status: 403 });
  }

  const config = getSanitizedAiConfig();
  return NextResponse.json({
    config,
    models: PROVIDER_MODELS,
  });
}

export async function POST(req: Request) {
  const admin = await currentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Akses khusus superadmin.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const updated = saveAiConfig(body);
    return NextResponse.json({
      ok: true,
      config: getSanitizedAiConfig(),
      message: 'Konfigurasi AI dan API Key berhasil disimpan.',
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Gagal menyimpan konfigurasi: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 },
    );
  }
}

