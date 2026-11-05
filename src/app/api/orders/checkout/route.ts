import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/orders';
import { createUser, normalizeEmail } from '@/lib/auth';
import { incrementCouponUsage } from '@/lib/coupons';
import { randomBytes } from 'node:crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const customerName = (body.customerName || '').trim();
    const customerWhatsApp = (body.customerWhatsApp || '').trim();
    const customerEmail = normalizeEmail(body.customerEmail || '');
    const tier = (body.tier || 'starter').trim();
    const tierName = (body.tierName || 'Starter 3D Pack').trim();
    const amount = (body.amount || 'Rp149.000').trim();
    const paymentMethod = (body.paymentMethod || 'QRIS').trim();
    const couponCode = (body.couponCode || '').trim().toUpperCase();
    const discountAmount = (body.discountAmount || '').trim();

    if (!customerName || !customerWhatsApp) {
      return NextResponse.json(
        { error: 'Nama dan nomor WhatsApp wajib diisi untuk konfirmasi pemesanan.' },
        { status: 400 }
      );
    }

    let notes = `Order via web checkout. Pembayaran: ${paymentMethod}`;
    if (couponCode) {
      notes += ` | Kupon diskon: ${couponCode} (${discountAmount})`;
      incrementCouponUsage(couponCode);
    }

    // 1. Record customer order with pending status
    const order = createOrder({
      customerName,
      customerWhatsApp,
      customerEmail: customerEmail || `${customerWhatsApp.replace(/\D/g, '')}@customer.audira.my.id`,
      tier,
      tierName,
      amount,
      paymentMethod,
      status: 'pending',
      notes
    });

    // 2. If valid customer email provided, ensure customer account exists with role 'customer'
    if (customerEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      try {
        // Auto-provision customer account with random secure password if new
        const tempPassword = `Audira-${randomBytes(4).toString('hex')}!`;
        await createUser(customerName, customerEmail, tempPassword, 'customer');
      } catch {
        // User already exists or error ignored
      }
    }

    return NextResponse.json({
      ok: true,
      message: 'Pesanan berhasil dicatat dengan status menunggu konfirmasi.',
      order: {
        id: order.id,
        licenseKey: order.licenseKey,
        customerName: order.customerName,
        tierName: order.tierName,
        amount: order.amount,
        status: order.status
      }
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Gagal memproses checkout pesanan: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    );
  }
}
