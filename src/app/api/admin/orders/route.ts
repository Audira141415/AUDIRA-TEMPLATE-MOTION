import { NextResponse } from 'next/server';
import { currentAdmin } from '@/lib/auth';
import { readOrders, createOrder } from '@/lib/orders';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const admin = await currentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Akses khusus superadmin.' }, { status: 403 });
  }

  const orders = readOrders();
  return NextResponse.json({ orders });
}

export async function POST(req: Request) {
  const admin = await currentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Akses khusus superadmin.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    if (!body.customerName || !body.customerWhatsApp || !body.tier) {
      return NextResponse.json({ error: 'Nama, WhatsApp, dan Paket wajib diisi.' }, { status: 400 });
    }

    const order = createOrder(body);
    return NextResponse.json({ ok: true, order });
  } catch (err) {
    return NextResponse.json(
      { error: `Gagal membuat pesanan: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    );
  }
}
