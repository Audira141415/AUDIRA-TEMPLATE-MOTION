import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { readOrders } from '@/lib/orders';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = (searchParams.get('query') || '').trim().toLowerCase();
  const user = await currentUser();

  const allOrders = readOrders();

  // 1. If superadmin, return all or filtered
  if (user?.role === 'superadmin') {
    if (!query) {
      return NextResponse.json({ orders: allOrders, role: 'superadmin' });
    }
    const filtered = allOrders.filter(o => 
      o.id.toLowerCase().includes(query) ||
      o.customerName.toLowerCase().includes(query) ||
      o.customerEmail.toLowerCase().includes(query) ||
      o.customerWhatsApp.includes(query) ||
      o.licenseKey.toLowerCase().includes(query)
    );
    return NextResponse.json({ orders: filtered, role: 'superadmin' });
  }

  // 2. If logged in as customer/user, return only their own orders
  if (user) {
    const userOrders = allOrders.filter(o => 
      o.customerEmail.toLowerCase() === user.email.toLowerCase()
    );
    return NextResponse.json({ 
      orders: userOrders, 
      role: user.role, 
      user: { name: user.name, email: user.email } 
    });
  }

  // 3. If unauthenticated, allow tracking by exact order ID or WhatsApp
  if (query) {
    const cleanQuery = query.replace(/\D/g, '');
    const found = allOrders.filter(o => 
      o.id.toLowerCase() === query ||
      (cleanQuery.length >= 8 && o.customerWhatsApp.includes(cleanQuery)) ||
      (query.includes('@') && o.customerEmail.toLowerCase() === query)
    );

    // Sanitize sensitive info for public tracking
    const sanitized = found.map(o => ({
      id: o.id,
      customerName: o.customerName.slice(0, 3) + '***',
      tierName: o.tierName,
      amount: o.amount,
      status: o.status,
      // Only show full licenseKey if status is verified, sent, or completed
      licenseKey: (o.status === 'verified' || o.status === 'sent' || o.status === 'completed')
        ? o.licenseKey
        : 'Menunggu Verifikasi Pembayaran',
      createdAt: o.createdAt
    }));

    return NextResponse.json({ orders: sanitized, role: 'guest' });
  }

  return NextResponse.json({ orders: [], role: 'guest' });
}

