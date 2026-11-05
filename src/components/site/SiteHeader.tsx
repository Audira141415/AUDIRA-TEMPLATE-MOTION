'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Menu, ShieldCheck, X, Sparkles } from 'lucide-react';

export const NAV_LINKS = [
  { href: '/#hasil', label: '29 Gaya 3D' },
  { href: '/#produk', label: 'Lisensi' },
  { href: '/#jasa', label: 'Jasa DFY' },
  { href: '/#testimoni', label: 'Testimoni' },
  { href: '/prompts', label: 'Prompt AI' },
  { href: '/#faq', label: 'FAQ' },
];

export const ALL_NAV_LINKS = [
  { href: '/#hasil', label: '29 Gaya 3D Sinematik' },
  { href: '/#produk', label: 'Paket Lisensi Komersial' },
  { href: '/#jasa', label: 'Jasa Terima Beres (DFY)' },
  { href: '/#testimoni', label: 'Testimoni & Studi Kasus' },
  { href: '/#cara-kerja', label: 'Cara Kerja 3 Langkah' },
  { href: '/#bundle', label: 'Creator Lab Ultimate' },
  { href: '/prompts', label: 'Katalog Prompt AI' },
  { href: '/#faq', label: 'FAQ & Spek Hardware' },
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
    <header className="sticky top-0 z-50 border-b border-line bg-ink/90 font-display text-paper backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-4 px-4 md:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="AUDIRA Motion, beranda">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/40 bg-accent text-sm font-extrabold text-ink shadow-sm">
            A
          </span>
          <span className="whitespace-nowrap text-[17px] font-extrabold tracking-[-0.02em] text-paper">
            AUDIRA <span className="text-accent">Motion</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav aria-label="Navigasi utama" className="hidden lg:flex items-center gap-1 xl:gap-2 text-[13px] xl:text-sm">
          {NAV_LINKS.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                isActive(n.href) 
                  ? 'text-paper bg-tile font-bold' 
                  : 'text-muted hover:text-paper hover:bg-tile/60'
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Right Action Area */}
        <div className="flex items-center gap-2.5 shrink-0">
          {user === null && (
            <Link
              href="/login"
              className="hidden lg:inline px-3 py-1.5 text-xs xl:text-sm font-semibold text-fg-2 hover:text-paper transition-colors whitespace-nowrap"
            >
              Masuk
            </Link>
          )}

          {user && (
            <div className="hidden lg:flex items-center gap-2">
              {user.role === 'superadmin' && (
                <Link
                  href="/admin"
                  className={`inline-flex items-center gap-1.5 rounded-xl border border-line bg-tile px-2.5 py-1.5 text-xs font-semibold hover:border-accent transition-colors whitespace-nowrap ${
                    pathname.startsWith('/admin') ? 'text-accent border-accent/40' : 'text-fg-2'
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                  <span className="hidden xl:inline">Admin</span>
                </Link>
              )}
              <span
                title={user.email}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-tile border border-line text-xs font-bold uppercase text-paper"
              >
                {user.name.charAt(0)}
              </span>
              <button
                type="button"
                onClick={logout}
                aria-label="Keluar"
                className="flex h-8 w-8 items-center justify-center rounded-xl text-muted hover:bg-tile hover:text-paper transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <Link
            href="/studio"
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-accent px-3.5 py-2 text-xs xl:text-sm font-bold text-ink shadow-md shadow-orange-950/40 hover:bg-orange-500 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 fill-ink" />
            <span>Buka Studio</span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-tile text-paper lg:hidden hover:border-line-strong transition-colors"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Navigasi utama mobile"
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-line bg-ink px-4 pb-6 pt-2 lg:hidden animate-fade-in"
        >
          <div className="flex flex-col divide-y divide-line-soft">
            {ALL_NAV_LINKS.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-3.5 text-[15px] font-semibold text-fg-2 hover:text-paper hover:pl-1 transition-all"
              >
                <span>{n.label}</span>
                <span className="text-xs text-dim font-mono">➔</span>
              </Link>
            ))}
          </div>

          {user === null && (
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Link
                href="/login"
                className="rounded-xl border border-line bg-tile py-3 text-center font-semibold text-paper"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-accent py-3 text-center font-bold text-ink"
              >
                Daftar
              </Link>
            </div>
          )}

          {user?.role === 'superadmin' && (
            <Link
              href="/admin"
              className="mt-3 flex items-center gap-2 rounded-xl border border-line bg-tile p-3 text-[14px] font-semibold text-paper"
            >
              <ShieldCheck className="h-4 w-4 text-accent" /> Panel admin
            </Link>
          )}

          {user && (
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
              <span className="min-w-0 truncate text-[14px] text-muted">
                Masuk sebagai <span className="font-semibold text-paper">{user.name}</span>
              </span>
              <button
                type="button"
                onClick={logout}
                className="shrink-0 rounded-xl border border-line bg-tile px-4 py-2 text-xs font-semibold text-paper"
              >
                Keluar
              </button>
            </div>
          )}
        </nav>
      )}
    </header>
  );
};
