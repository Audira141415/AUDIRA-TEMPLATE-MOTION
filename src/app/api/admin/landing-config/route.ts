import { NextResponse } from 'next/server';
import { currentAdmin } from '@/lib/auth';
import { readLandingConfig, writeLandingConfig, DEFAULT_LANDING_CONFIG } from '@/lib/landing-config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const admin = await currentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Akses khusus superadmin.' }, { status: 403 });
  }

  const config = readLandingConfig();
  return NextResponse.json({ config });
}

export async function POST(req: Request) {
  const admin = await currentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Akses khusus superadmin.' }, { status: 403 });
  }

  try {
    const body = await req.json();

    // Check if reset action
    if (body.action === 'reset') {
      const resetConfig = writeLandingConfig(DEFAULT_LANDING_CONFIG);
      return NextResponse.json({
        ok: true,
        config: resetConfig,
        message: 'Konfigurasi landing page berhasil direset ke pengaturan default pabrik.'
      });
    }

    const updated = writeLandingConfig(body);
    return NextResponse.json({
      ok: true,
      config: updated,
      message: 'Perubahan landing page berhasil disimpan & langsung aktif!'
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Gagal menyimpan konfigurasi landing page: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    );
  }
}

