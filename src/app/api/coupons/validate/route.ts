import { NextResponse } from 'next/server';
import { validateCoupon } from '@/lib/coupons';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const code = String(body.code || '').trim();
    const amount = Number(body.amount || 0);

    if (!code) {
      return NextResponse.json({ error: 'Kode kupon wajib diisi' }, { status: 400 });
    }

    const result = validateCoupon(code, amount);
    if (!result.valid) {
      return NextResponse.json({ error: result.error || 'Kupon tidak valid' }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      code: result.coupon?.code,
      description: result.coupon?.description,
      discountType: result.coupon?.discountType,
      value: result.coupon?.value,
      discount: result.discount,
      finalAmount: result.finalAmount,
      formattedDiscount: `Rp${result.discount.toLocaleString('id-ID')}`,
      formattedFinalAmount: `Rp${result.finalAmount.toLocaleString('id-ID')}`
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Gagal memvalidasi kupon' }, { status: 500 });
  }
}

