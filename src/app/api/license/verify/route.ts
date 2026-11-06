import { NextResponse } from 'next/server';
import { findOrderByLicense } from '@/lib/orders';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key') || searchParams.get('license') || '';
  return verifyLicense(key);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const key = body.key || body.license || body.licenseKey || '';
    return verifyLicense(key);
  } catch {
    return NextResponse.json(
      { valid: false, active: false, message: 'Format data tidak valid.' },
      { status: 400 }
    );
  }
}

function verifyLicense(key: string) {
  if (!key || !key.trim()) {
    return NextResponse.json(
      { valid: false, active: false, error: 'Parameter kode lisensi (key) wajib disertakan.' },
      { status: 400 }
    );
  }

  const order = findOrderByLicense(key);
  if (!order) {
    return NextResponse.json(
      {
        valid: false,
        active: false,
        status: 'not_found',
        message: 'Kode lisensi tidak terdaftar di sistem AUDIRA Motion.'
      },
      { status: 404 }
    );
  }

  if (!order.isLicenseActive) {
    return NextResponse.json(
      {
        valid: false,
        active: false,
        status: order.licenseStatus || 'pending_activation',
        orderId: order.id,
        tierName: order.tierName,
        message: 'Lisensi ini belum diaktifkan oleh Superadmin AUDIRA. Harap tunggu verifikasi atau hubungi WhatsApp kami.'
      },
      { status: 403 }
    );
  }

  return NextResponse.json({
    valid: true,
    active: true,
    status: 'active',
    orderId: order.id,
    licenseKey: order.licenseKey,
    tier: order.tier,
    tierName: order.tierName,
    customerName: order.customerName,
    activatedAt: order.activatedAt,
    activatedBy: order.activatedBy
  });
}
