import { NextResponse } from 'next/server';
import { requireSuperadmin } from '@/lib/auth';
import { gatherServerTelemetry } from '@/lib/server-telemetry';
import { readServerConfig } from '@/lib/server-config';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireSuperadmin();
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Akses ditolak.' }, { status: 403 });
  }

  try {
    const telemetry = await gatherServerTelemetry();
    const config = readServerConfig();

    return NextResponse.json({
      telemetry,
      config
    });
  } catch (err: any) {
    console.error('Server telemetry error:', err);
    return NextResponse.json(
      { error: 'Gagal mengumpulkan data telemetri server: ' + (err?.message || String(err)) },
      { status: 500 }
    );
  }
}
