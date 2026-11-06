import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    app: 'AUDIRA Motion Template & Render Engine',
    version: '2026.1.0',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV || 'development',
    platform: process.platform,
    pid: process.pid,
  });
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}
