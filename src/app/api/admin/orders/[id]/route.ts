import { NextResponse } from 'next/server';
import { currentAdmin } from '@/lib/auth';
import { updateOrder, deleteOrder } from '@/lib/orders';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await currentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Akses khusus superadmin.' }, { status: 403 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const updated = updateOrder(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, order: updated });
  } catch (err) {
    return NextResponse.json(
      { error: `Gagal memperbarui pesanan: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await currentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Akses khusus superadmin.' }, { status: 403 });
  }

  const { id } = await params;
  const ok = deleteOrder(id);
  if (!ok) {
    return NextResponse.json({ error: 'Pesanan tidak ditemukan.' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
