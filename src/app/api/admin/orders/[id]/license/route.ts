import { NextResponse } from 'next/server';
import { currentAdmin } from '@/lib/auth';
import { activateLicense, suspendLicense, updateOrder } from '@/lib/orders';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
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
    const action = body.action || (body.active ? 'activate' : 'suspend');

    let updated;
    if (action === 'activate') {
      updated = activateLicense(id, admin.email);
    } else {
      updated = suspendLicense(id, admin.email);
    }

    if (!updated) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      message: action === 'activate' 
        ? `Lisensi ${updated.licenseKey} berhasil diaktifkan oleh Superadmin.` 
        : `Lisensi ${updated.licenseKey} telah dinonaktifkan.`,
      order: updated
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Gagal memperbarui status lisensi: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    );
  }
}
