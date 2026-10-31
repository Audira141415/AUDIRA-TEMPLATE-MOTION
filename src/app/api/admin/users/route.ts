import { NextResponse } from 'next/server';
import { currentAdmin, listUsers } from '@/lib/auth';
import { listJobs } from '@/lib/render-jobs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await currentAdmin())) return NextResponse.json({ error: 'Khusus superadmin.' }, { status: 403 });
  const jobs = listJobs();
  const users = listUsers().map((u) => ({ ...u, renders: jobs.filter((j) => j.ownerId === u.id).length }));
  return NextResponse.json({ users });
}
