'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  ShieldCheck, 
  Copy, 
  Check, 
  Search, 
  Sparkles, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Lock,
  ArrowRight,
  MessageCircle,
  BookOpen,
  FileText
} from 'lucide-react';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';

interface OrderItem {
  id: string;
  customerName: string;
  tierName: string;
  amount: string;
  status: string;
  licenseKey: string;
  createdAt: string;
}

export default function PesananPage() {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null | undefined>(undefined);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  // 1. Fetch current logged-in user
  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => {
        setUser(d.user || null);
      })
      .catch(() => setUser(null));
  }, []);

  // 2. Fetch user's orders
  const fetchMyOrders = async (query?: string) => {
    setLoading(true);
    try {
      const url = query ? `/api/orders/my-orders?query=${encodeURIComponent(query)}` : '/api/orders/my-orders';
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && data.orders) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setTrackingLoading(false);
    }
  };

  useEffect(() => {
    if (user !== undefined) {
      fetchMyOrders();
    }
  }, [user]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchMyOrders();
      return;
    }
    setTrackingLoading(true);
    fetchMyOrders(searchQuery.trim());
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(text);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      // fallback
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'completed':
      case 'verified':
      case 'sent':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/60 border border-emerald-500/50 px-2.5 py-0.5 text-[11px] font-mono font-bold text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            <span>Aktif / Lunas</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-950/60 border border-red-500/50 px-2.5 py-0.5 text-[11px] font-mono font-bold text-red-400">
            <AlertCircle className="w-3 h-3" />
            <span>Dibatalkan</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-950/60 border border-amber-500/50 px-2.5 py-0.5 text-[11px] font-mono font-bold text-amber-400">
            <Clock className="w-3 h-3 animate-pulse" />
            <span>Menunggu Pembayaran</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-ink font-display text-paper antialiased selection:bg-accent selection:text-ink flex flex-col justify-between">
      <SiteHeader />

      <main className="mx-auto max-w-[1140px] w-full px-4 py-12 md:px-8 space-y-8">
        {/* Top Header & Role Information Banner */}
        <div className="rounded-3xl border border-line bg-gradient-to-br from-card via-[#161514] to-ink p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2">
                <span className="flex size-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold">
                  PORTAL PELANGGAN RESMI
                </span>
                <span className="rounded-full bg-tile border border-emerald-800/40 px-2.5 py-0.5 text-[10px] font-mono text-emerald-300 font-bold">
                  ROLE: {user?.role ? user.role.toUpperCase() : 'CUSTOMER / PEMBELI'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-paper">
                Pesanan &amp; Lisensi Digital Saya
              </h1>
              <p className="text-xs sm:text-sm text-muted">
                {user 
                  ? `Masuk sebagai ${user.name} (${user.email}). Pantau lisensi aktif dan status pengerjaan video Anda.`
                  : 'Lacak status pembelian lisensi atau paket video AUDIRA Anda dengan memasukkan No. Pesanan atau WhatsApp.'}
              </p>
            </div>

            {user?.role === 'superadmin' && (
              <Link
                href="/admin"
                className="btn-primary py-2.5 px-4 text-xs font-bold inline-flex items-center gap-1.5 self-start shrink-0 shadow-lg shadow-orange-950/40"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Buka Panel Superadmin</span>
              </Link>
            )}
          </div>

          {/* Role System Clarification Callout */}
          <div className="p-4 rounded-2xl bg-tile border border-line-soft flex items-start gap-3 text-xs text-muted">
            <Lock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-paper text-[13px]">
                Kebijakan Keamanan &amp; Batasan Role Pengguna
              </p>
              <p className="leading-relaxed">
                Seluruh pelanggan dan kreator terdaftar memiliki role <strong>Customer / User Biasa</strong>. 
                Anda memiliki hak akses penuh untuk mengunduh kode lisensi pribadi, membuka panduan instalasi, dan mengunduh seluruh template Remotion 3D. 
                Pengelolaan panel admin, perubahan harga, pengaturan CMS, dan database website dibatasi secara ketat hanya untuk <strong>Superadmin Resmi AUDIRA</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Search & Tracker Bar */}
        <div className="rounded-2xl border border-line bg-card p-4 sm:p-5 shadow-xl">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-dim" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berdasarkan No. Pesanan (ORD-2026-...) atau Nomor WhatsApp..."
                className="w-full rounded-xl border border-line bg-ink pl-10 pr-4 py-2.5 text-xs sm:text-sm text-paper placeholder:text-dim focus:border-accent focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={trackingLoading}
              className="btn-primary py-2.5 px-5 text-xs font-bold inline-flex items-center justify-center gap-1.5 shrink-0"
            >
              <span>{trackingLoading ? 'Mencari...' : 'Lacak Pesanan'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Orders List Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-sm sm:text-base text-paper flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-accent" />
              <span>Daftar Lisensi &amp; Pesanan ({orders.length})</span>
            </h3>
            <span className="font-mono text-xs text-dim">
              Diperbarui otomatis
            </span>
          </div>

          {loading ? (
            <div className="p-16 rounded-3xl border border-line bg-card text-center text-muted text-xs">
              <div className="size-6 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <span>Memuat data lisensi Anda...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 rounded-3xl border border-line bg-card text-center space-y-4 shadow-xl">
              <div className="size-12 rounded-2xl bg-tile border border-line flex items-center justify-center mx-auto text-muted">
                <ShoppingBag className="w-6 h-6 text-dim" />
              </div>
              <div>
                <h4 className="font-bold text-base text-paper">Belum Ada Pesanan Ditemukan</h4>
                <p className="text-xs text-muted max-w-md mx-auto mt-1">
                  {searchQuery 
                    ? `Tidak ada pesanan yang cocok dengan pencarian "${searchQuery}". Pastikan nomor pesanan atau nomor WhatsApp sudah benar.`
                    : 'Anda belum memiliki lisensi aktif. Dapatkan lisensi komersial seumur hidup bebas royalti mulai Rp149.000.'}
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/#produk"
                  className="btn-primary py-2.5 px-6 text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-orange-950/40"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Pilih Lisensi 3D Sekarang</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="rounded-3xl border border-line bg-card p-5 sm:p-6 shadow-xl space-y-4 hover:border-line-strong transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-accent">
                          {ord.id}
                        </span>
                        {statusBadge(ord.status)}
                      </div>
                      <h4 className="font-bold text-lg text-paper mt-1">
                        {ord.tierName}
                      </h4>
                      <p className="text-xs text-dim">
                        Pemesanan pada {new Date(ord.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="font-mono text-xs text-dim block">Total Tagihan</span>
                      <span className="font-mono text-xl font-extrabold text-paper block">
                        {ord.amount}
                      </span>
                    </div>
                  </div>

                  {/* License Key Box */}
                  <div className="p-4 rounded-2xl bg-ink border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-mono text-[10px] uppercase font-bold text-dim block">
                        Kunci Lisensi Digital (License Key):
                      </span>
                      <span className="font-mono text-sm sm:text-base font-bold text-cyan-300 block select-all">
                        {ord.licenseKey}
                      </span>
                    </div>

                    {ord.licenseKey && !ord.licenseKey.includes('Menunggu') && (
                      <button
                        type="button"
                        onClick={() => handleCopy(ord.licenseKey)}
                        className="btn-outline py-2 px-3.5 text-xs font-bold inline-flex items-center gap-1.5 self-start sm:self-center shrink-0"
                      >
                        {copiedKey === ord.licenseKey ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-300">Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-accent" />
                            <span>Salin Kunci</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Next Step Guidance Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/invoice/${ord.id}`}
                        target="_blank"
                        className="px-3 py-2 rounded-xl bg-tile border border-line text-paper hover:border-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1.5 font-semibold transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Cetak Faktur</span>
                      </Link>

                      <Link
                        href="/panduan"
                        className="px-3 py-2 rounded-xl bg-tile border border-line text-paper hover:border-accent inline-flex items-center gap-1.5 font-semibold transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-accent" />
                        <span>Buku Panduan Instalasi</span>
                      </Link>

                      <Link
                        href="/admin"
                        className="px-3 py-2 rounded-xl bg-accent/15 border border-accent/40 text-accent hover:bg-accent/25 inline-flex items-center gap-1.5 font-bold transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-accent" />
                        <span>Buka Dashboard Pelanggan</span>
                      </Link>
                    </div>

                    <a
                      href={`https://wa.me/6282112001600?text=Halo%20Tim%20AUDIRA,%20saya%20ingin%20konfirmasi%20pesanan%20dengan%20No%20Pesanan%20*${ord.id}*%20(${ord.tierName})`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Konfirmasi Pembayaran via WhatsApp</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

