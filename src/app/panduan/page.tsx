import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { readOrders } from '@/lib/orders';
import { InteractiveGuideView } from '@/components/guide/InteractiveGuideView';
import { PanduanLockedGate } from '@/components/guide/PanduanLockedGate';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';

export const metadata: Metadata = {
  title: 'Buku Panduan & Setup 3D · Khusus Pemilik Lisensi AUDIRA Motion',
  description: 'Panduan mandiri instalasi Remotion 4.0, Claude Code Skill, aktivasi MCP mesh, dan studio prompt koleksi gaya 3D khusus pembeli resmi.',
  robots: { index: false }
};

export const dynamic = 'force-dynamic';

export default async function PanduanPage() {
  const user = await currentUser();
  if (!user) {
    redirect('/login?next=/panduan');
  }

  const isSuperadmin = user.role === 'superadmin';
  const allOrders = readOrders();
  const userOrders = allOrders.filter(
    (o) => o.customerEmail.toLowerCase() === user.email.toLowerCase() && o.status !== 'cancelled'
  );
  
  const activeOrder = isSuperadmin 
    ? userOrders[0] || null 
    : userOrders.find(o => o.isLicenseActive === true) || null;
  const pendingOrder = userOrders.find(o => !o.isLicenseActive) || null;
  const isAuthorized = isSuperadmin || Boolean(activeOrder);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-ink font-display text-paper antialiased selection:bg-accent selection:text-ink">
        <SiteHeader />
        <main>
          <PanduanLockedGate user={user} pendingOrder={pendingOrder} />
        </main>
        <SiteFooter />
      </div>
    );
  }

  const initialLicense = activeOrder?.licenseKey || (isSuperadmin ? 'AUD-MAS-2026-SUPER' : 'AUD-LAB-2026-9A82F1');

  return (
    <div className="min-h-screen bg-ink font-display text-paper antialiased selection:bg-accent selection:text-ink">
      <SiteHeader />
      <main className="mx-auto max-w-[1240px] px-4 py-8 md:px-8 md:py-12">
        <InteractiveGuideView
          user={user}
          initialLicense={initialLicense}
          isInsideDashboard={false}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
