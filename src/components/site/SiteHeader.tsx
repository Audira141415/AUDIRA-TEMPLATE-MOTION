'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Menu, ShieldCheck, X } from 'lucide-react';

export const NAV_LINKS = [
  { href: '/#format', label: 'Format' },
  { href: '/#mood', label: 'Mood' },
  { href: '/#cara-kerja', label: 'Cara kerja' },
  { href: '/prompts', label: 'Prompt' },
  { href: '/#faq', label: 'FAQ' },
];

export const SiteHeader: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null | undefined>(undefined);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => setUser(null));
  }, [pathname]);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setOpen(false);
    router.push('/');
    router.refresh();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const isActive = (href: string) => !href.includes('#') && pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-[#2c2b28] bg-[#141413]/90 font-display text-[#f4f3f0] backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label="AUDIRA Motion, beranda">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-[#ea580c] text-sm font-extrabold text-white">
            A
          </span>
          <span className="whitespace-nowrap text-[17px] font-extrabold tracking-[-0.02em]">
            AUDIRA <span className="text-[#ea580c]">Motion</span>
          </span>
        </Link>

        <nav aria-label="Navigasi utama" className="hidden items-center gap-7 text-sm md:flex">
          {NAV_LINKS.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`transition-colors hover:text-white ${isActive(n.href) ? 'text-white' : 'text-[#b9b6ae]'}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user === null && (
            <Link href="/login" className="hidden px-2 text-sm font-semibold text-[#d6d3cc] hover:text-white md:inline">
              Masuk
            </Link>
          )}
          {user && (
            <div className="hidden items-center gap-2 md:flex">
              {user.role === 'superadmin' && (
                <Link
                  href="/admin"
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-[#2c2b28] ${
                    pathname.startsWith('/admin') ? 'text-white' : 'text-[#d6d3cc]'
                  }`}
                >
                  <ShieldCheck className="h-4 w-4" /> Admin
                </Link>
              )}
              <span
                title={user.email}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2c2b28] text-sm font-bold uppercase"
              >
                {user.name.charAt(0)}
              </span>
              <button
                type="button"
                onClick={logout}
                aria-label="Keluar"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-[#b9b6ae] hover:bg-[#2c2b28] hover:text-white"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
          <Link
            href="/studio"
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
              pathname.startsWith('/studio') ? 'bg-[#ea580c] text-white' : 'bg-[#f4f3f0] text-[#141413] hover:bg-white'
            }`}
          >
            <span className="sm:hidden">Studio</span>
            <span className="hidden sm:inline">Buka studio</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2c2b28] text-[#f4f3f0] md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Navigasi utama" className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-[#2c2b28] bg-[#141413] px-4 pb-6 pt-2 md:hidden">
          {NAV_LINKS.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between border-b border-[#2c2b28] py-4 text-[17px] font-semibold"
            >
              {n.label}
            </Link>
          ))}
          {user === null && (
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Link href="/login" className="rounded-xl border border-[#2c2b28] py-3 text-center font-semibold">
                Masuk
              </Link>
              <Link href="/register" className="rounded-xl bg-[#ea580c] py-3 text-center font-bold text-white">
                Daftar
              </Link>
            </div>
          )}
          {user?.role === 'superadmin' && (
            <Link href="/admin" className="flex items-center gap-2 border-b border-[#2c2b28] py-4 text-[17px] font-semibold">
              <ShieldCheck className="h-5 w-5 text-[#ea580c]" /> Panel admin
            </Link>
          )}
          {user && (
            <div className="mt-5 flex items-center justify-between gap-3">
              <span className="min-w-0 truncate text-[15px] text-[#b9b6ae]">
                Masuk sebagai <span className="font-semibold text-white">{user.name}</span>
              </span>
              <button type="button" onClick={logout} className="shrink-0 rounded-xl border border-[#2c2b28] px-4 py-2.5 font-semibold">
                Keluar
              </button>
            </div>
          )}
        </nav>
      )}
    </header>
  );
};
