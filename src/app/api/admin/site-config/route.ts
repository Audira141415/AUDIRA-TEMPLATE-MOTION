import { NextResponse } from 'next/server';
import { currentAdmin } from '@/lib/auth';
import { readSiteConfig, writeSiteConfig } from '@/lib/site-config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const admin = await currentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Akses khusus superadmin.' }, { status: 403 });
  }

  const config = readSiteConfig();
  return NextResponse.json({ config });
}

export async function POST(req: Request) {
  const admin = await currentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Akses khusus superadmin.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const updated = writeSiteConfig(body);
    return NextResponse.json({ ok: true, config: updated, message: 'Pengaturan website berhasil disimpan.' });
  } catch (err) {
    return NextResponse.json(
      { error: `Gagal menyimpan pengaturan: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    );
  }
}

