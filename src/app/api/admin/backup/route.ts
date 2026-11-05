import { NextResponse } from 'next/server';
import { currentAdmin, listUsers } from '@/lib/auth';
import { readOrders } from '@/lib/orders';
import { readCoupons } from '@/lib/coupons';
import { readLandingConfig } from '@/lib/landing-config';
import { readSiteConfig } from '@/lib/site-config';

export const dynamic = 'force-dynamic';

export async function GET() {
  const admin = await currentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Akses khusus superadmin.' }, { status: 403 });
  }

  const orders = readOrders();
  const coupons = readCoupons();
  const landingConfig = readLandingConfig();
  const siteConfig = readSiteConfig();
  const users = listUsers().map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    disabled: u.disabled,
    createdAt: u.createdAt
  }));

  const backupData = {
    exportedAt: new Date().toISOString(),
    version: 'AUDIRA-MOTION-V4',
    metrics: {
      totalOrders: orders.length,
      totalUsers: users.length,
      totalCoupons: coupons.length
    },
    orders,
    coupons,
    landingConfig,
    siteConfig,
    users
  };

  const filename = `audira-backup-${new Date().toISOString().slice(0, 10)}.json`;

  return new NextResponse(JSON.stringify(backupData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${filename}"`
    }
  });
}
