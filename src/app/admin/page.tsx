import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { SiteHeader } from '@/components/site/SiteHeader';
import { currentUser } from '@/lib/auth';

export const metadata: Metadata = { title: 'Admin · AUDIRA Motion', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await currentUser();
  if (!user) redirect('/login?next=/admin');
  if (user.role !== 'superadmin') notFound();

  return (
    <div className="min-h-screen bg-[#141413] font-display text-[#f4f3f0]">
      <SiteHeader />
      <main className="mx-auto max-w-[1200px] px-4 py-12 md:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8a8780]">Superadmin</p>
        <h1 className="mt-3 text-[44px] font-extrabold leading-none tracking-[-0.045em]">Panel admin</h1>
        <p className="mt-3 text-[15px] text-[#b9b6ae]">Masuk sebagai {user.email}.</p>
        <div className="mt-10">
          <AdminPanel meId={user.id} />
        </div>
      </main>
    </div>
  );
}
