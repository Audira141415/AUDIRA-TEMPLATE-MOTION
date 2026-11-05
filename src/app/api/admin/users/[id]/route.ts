import { NextResponse } from 'next/server';
import { currentAdmin, Role, updateUserByAdmin } from '@/lib/auth';

export const runtime = 'nodejs';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: 'Khusus superadmin.' }, { status: 403 });
  const body = (await req.json().catch(() => ({}))) as { role?: string; disabled?: unknown };

  const change: { role?: Role; disabled?: boolean } = {};
  if (body.role === 'customer' || body.role === 'user' || body.role === 'superadmin') change.role = body.role;
  if (typeof body.disabled === 'boolean') change.disabled = body.disabled;
  if (!Object.keys(change).length) return NextResponse.json({ error: 'Tidak ada perubahan.' }, { status: 400 });

  const result = updateUserByAdmin(admin.id, (await params).id, change);
  return 'error' in result ? NextResponse.json(result, { status: 400 }) : NextResponse.json(result);
}

export async function DELETE(_req: Request, { params }: Params) {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: 'Khusus superadmin.' }, { status: 403 });
  const result = updateUserByAdmin(admin.id, (await params).id, 'delete');
  return 'error' in result ? NextResponse.json(result, { status: 400 }) : NextResponse.json(result);
}
