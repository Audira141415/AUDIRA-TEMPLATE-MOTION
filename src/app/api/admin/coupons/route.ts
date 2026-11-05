import { NextResponse } from 'next/server';
import { currentAdmin } from '@/lib/auth';
import { readCoupons, saveCoupon, deleteCoupon, Coupon } from '@/lib/coupons';

export const dynamic = 'force-dynamic';

export async function GET() {
  const admin = await currentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Akses khusus superadmin.' }, { status: 403 });
  }

  const coupons = readCoupons();
  return NextResponse.json({ coupons });
}

export async function POST(req: Request) {
  const admin = await currentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Akses khusus superadmin.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    if (!body.code || !body.value) {
      return NextResponse.json({ error: 'Kode kupon dan nilai diskon wajib diisi' }, { status: 400 });
    }

    const coupon: Coupon = {
      code: String(body.code).trim().toUpperCase(),
      description: String(body.description || '').trim(),
      discountType: body.discountType === 'nominal' ? 'nominal' : 'percent',
      value: Number(body.value),
      minAmount: body.minAmount ? Number(body.minAmount) : undefined,
      maxUses: body.maxUses ? Number(body.maxUses) : undefined,
      usedCount: Number(body.usedCount || 0),
      expiryDate: body.expiryDate || undefined,
      isActive: body.isActive !== false,
      createdAt: body.createdAt || new Date().toISOString()
    };

    const saved = saveCoupon(coupon);
    return NextResponse.json({ ok: true, coupon: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Gagal menyimpan kupon' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const admin = await currentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Akses khusus superadmin.' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    if (!code) {
      return NextResponse.json({ error: 'Kode kupon wajib disertakan' }, { status: 400 });
    }

    const ok = deleteCoupon(code);
    return NextResponse.json({ ok });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Gagal menghapus kupon' }, { status: 500 });
  }
}
