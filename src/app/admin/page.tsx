import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { CustomerDashboard } from '@/components/customer/CustomerDashboard';
import { SiteHeader } from '@/components/site/SiteHeader';
import { currentUser } from '@/lib/auth';

export const metadata: Metadata = { 
  title: 'Dashboard & Management · AUDIRA Motion', 
  robots: { index: false } 
};

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await currentUser();
  if (!user) redirect('/login?next=/admin');

  const isSuperadmin = user.role === 'superadmin';

  return (
    <div className="min-h-screen bg-[#141413] font-display text-[#f4f3f0]">
      <SiteHeader />
      <main className="mx-auto max-w-[1200px] px-4 py-8 md:py-12 md:px-8">
        {isSuperadmin ? (
          <div>
            <div className="mb-8">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-accent border border-accent/40 bg-accent/10 px-2 py-0.5 rounded">
                Superadmin Workspace
              </span>
              <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-paper">
                Pusat Kontrol Superadmin
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-muted">
                Masuk sebagai <strong className="text-paper">{user.name}</strong> ({user.email}). Memiliki hak akses penuh konfigurasi sistem.
              </p>
            </div>
            <AdminPanel meId={user.id} />
          </div>
        ) : (
          <div>
            <CustomerDashboard user={user} />
          </div>
        )}
      </main>
    </div>
  );
}
