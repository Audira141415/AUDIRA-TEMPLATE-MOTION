import { NextResponse } from 'next/server';
import { currentAdmin } from '@/lib/auth';
import { testAiConnection, AIProviderId } from '@/lib/ai-config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const admin = await currentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Akses khusus superadmin.' }, { status: 403 });
  }

  try {
    const { providerId, apiKey, model, baseUrl } = (await req.json()) as {
      providerId?: AIProviderId;
      apiKey?: string;
      model?: string;
      baseUrl?: string;
    };

    if (!providerId) {
      return NextResponse.json({ error: 'providerId wajib disertakan.' }, { status: 400 });
    }

    const result = await testAiConnection(providerId, apiKey, model, baseUrl);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        latencyMs: 0,
        message: `Uji koneksi gagal: ${err instanceof Error ? err.message : String(err)}`,
      },
      { status: 500 },
    );
  }
}

