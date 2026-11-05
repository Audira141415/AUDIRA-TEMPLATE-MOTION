import { NextResponse } from 'next/server';
import { readLandingConfig } from '@/lib/landing-config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const config = readLandingConfig();
  return NextResponse.json({ config });
}

