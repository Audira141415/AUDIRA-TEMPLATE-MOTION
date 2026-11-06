import type { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { AuthForm } from '@/components/site/AuthForm';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import { currentUser } from '@/lib/auth';

export const metadata: Metadata = { title: 'Daftar · AUDIRA Motion' };
export const dynamic = 'force-dynamic';

export default async function Page() {
  if (await currentUser()) redirect('/admin');
  return (
    <div className="flex min-h-screen flex-col bg-[#141413] font-display text-[#f4f3f0]">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <Suspense>
          <AuthForm mode="register" />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
