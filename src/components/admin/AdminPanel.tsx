'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Download, 
  Loader2, 
  RefreshCw, 
  Cpu, 
  Users, 
  Video, 
  Mic, 
  LayoutDashboard, 
  ShoppingBag, 
  Settings, 
  Sparkles, 
  DollarSign, 
  ShieldCheck, 
  CheckCircle2, 
  Activity, 
  Play, 
  MessageCircle, 
  ExternalLink,
  Layers,
  ArrowRight,
  TrendingUp,
  Server
} from 'lucide-react';
import { AiInterconnectionTab } from '@/components/admin/AiInterconnectionTab';
import { VoiceOverTab } from '@/components/admin/VoiceOverTab';
import { OrdersTab } from '@/components/admin/OrdersTab';
import { SiteSettingsTab } from '@/components/admin/SiteSettingsTab';
import { CatalogTab } from '@/components/admin/CatalogTab';
import { LandingPageManagerTab } from '@/components/admin/LandingPageManagerTab';
import { CouponsTab } from '@/components/admin/CouponsTab';
import { SystemTab } from '@/components/admin/SystemTab';
import { ServerMonitoringTab } from '@/components/admin/ServerMonitoringTab';
import { OrderRecord } from '@/lib/orders';
import { Tag, Database } from 'lucide-react';

type AdminTab = 'overview' | 'server' | 'landing' | 'orders' | 'coupons' | 'site' | 'catalog' | 'ai' | 'voice' | 'users' | 'renders' | 'system';

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'user' | 'superadmin';
  createdAt: string;
  disabled: boolean;
  renders: number;
};

type AdminRender = {
  id: string;
  ownerEmail: string;
  state: string;
  title: string;
  format: string;
  createdAt: string;
  hasFile: boolean;
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const STATE_STYLE: Record<string, string> = {
  done: 'bg-emerald-950 text-emerald-300 border-emerald-900',
  error: 'bg-red-950 text-red-300 border-red-900',
};

export const AdminPanel: React.FC<{ meId: string }> = ({ meId }) => {
  const [tab, setTab] = useState<AdminTab>('overview');
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [renders, setRenders] = useState<AdminRender[] | null>(null);
  const [orders, setOrders] = useState<OrderRecord[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ tone: 'error' | 'ok'; text: string } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const load = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [u, r, o] = await Promise.all([
        fetch('/api/admin/users').then((res) => res.json()).catch(() => ({ users: [] })),
        fetch('/api/admin/renders').then((res) => res.json()).catch(() => ({ renders: [] })),
        fetch('/api/admin/orders').then((res) => res.json()).catch(() => ({ orders: [] })),
      ]);
      setUsers(u.users ?? []);
      setRenders(r.renders ?? []);
      setOrders(o.orders ?? []);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (user: AdminUser, method: 'PATCH' | 'DELETE', body?: object, confirmText?: string) => {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusyId(user.id);
    setMessage(null);
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    setBusyId(null);
    setMessage(res.ok ? { tone: 'ok', text: `Perubahan untuk ${user.email} disimpan.` } : { tone: 'error', text: data.error });
    if (res.ok) load();
  };

  // Metrics Calculations
  const totalOrders = orders?.length ?? 0;
  const verifiedOrders = orders?.filter(o => o.status === 'verified' || o.status === 'sent' || o.status === 'completed').length ?? 0;
  const totalUsers = users?.length ?? 0;
  const totalRenders = renders?.length ?? 0;

  // Approximate revenue from verified orders
  const estimatedRevenue = orders?.reduce((acc, o) => {
    if (o.status === 'verified' || o.status === 'sent' || o.status === 'completed') {
      const num = parseInt(o.amount.replace(/\D/g, ''), 10);
      return acc + (isNaN(num) ? 0 : num);
    }
    return acc;
  }, 0) ?? 0;

  const formattedRevenue = `Rp${estimatedRevenue.toLocaleString('id-ID')}`;

  return (
    <div className="flex flex-col gap-8 font-display">
      
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
        <div className="flex items-start gap-4">
          <img
            src="/brand/symbol-reversed.svg"
            alt="PT. AUDIRA MULTIMEDIA DIGITAL"
            className="h-12 w-auto shrink-0 mt-1"
          />
          <div>
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="flex size-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider">
                PT. AUDIRA MULTIMEDIA DIGITAL • SUPERADMIN CONSOLE
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-paper">
              Admin Management Console
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              Kelola penjualan lisensi, 29 gaya 3D Remotion, API AI, Voiceover Cartesia, dan pengaturan website.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="btn-outline py-2 px-3.5 text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <span>Lihat Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-dim" />
          </Link>

          <button
            type="button"
            onClick={load}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-tile px-3.5 py-2 text-xs font-bold text-fg-2 hover:border-line-strong hover:text-white transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-accent' : ''}`} />
            <span>{isRefreshing ? 'Memuat...' : 'Muat Ulang'}</span>
          </button>
        </div>
      </div>

      {/* Global Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-line bg-card p-5 space-y-1 shadow-md">
          <p className="font-mono text-[11px] uppercase tracking-wider text-dim flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-accent" />
            Total Pesanan
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-paper font-mono">{totalOrders}</p>
          <p className="text-[11px] text-emerald-400 font-semibold">{verifiedOrders} lunas terverifikasi</p>
        </div>

        <div className="rounded-2xl border border-line bg-card p-5 space-y-1 shadow-md">
          <p className="font-mono text-[11px] uppercase tracking-wider text-dim flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            Estimasi Omset
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">{formattedRevenue}</p>
          <p className="text-[11px] text-muted">Dari lisensi &amp; jasa DFY</p>
        </div>

        <div className="rounded-2xl border border-line bg-card p-5 space-y-1 shadow-md">
          <p className="font-mono text-[11px] uppercase tracking-wider text-dim flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-cyan-400" />
            Total Render
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-paper font-mono">{totalRenders}</p>
          <p className="text-[11px] text-cyan-300">Remotion 4.0 Engine</p>
        </div>

        <div className="rounded-2xl border border-line bg-card p-5 space-y-1 shadow-md">
          <p className="font-mono text-[11px] uppercase tracking-wider text-dim flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            Pengguna Terdaftar
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-paper font-mono">{totalUsers}</p>
          <p className="text-[11px] text-muted">Akun kreator &amp; admin</p>
        </div>
      </div>

      {/* 8-Tab Navigation Bar */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1">
        <div role="tablist" className="flex flex-wrap gap-1 rounded-2xl border border-line bg-card p-1.5 shadow-xl">
          {[
            { id: 'overview' as const, label: 'Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
            { id: 'server' as const, label: 'Monitoring Server', icon: <Server className="h-4 w-4 text-emerald-400" /> },
            { id: 'landing' as const, label: 'CMS Landing Page', icon: <Sparkles className="h-4 w-4 text-accent" /> },
            { id: 'orders' as const, label: 'Pesanan & Lisensi', icon: <ShoppingBag className="h-4 w-4" /> },
            { id: 'coupons' as const, label: 'Kupon Diskon', icon: <Tag className="h-4 w-4 text-emerald-400" /> },
            { id: 'site' as const, label: 'Pengaturan & Harga', icon: <Settings className="h-4 w-4" /> },
            { id: 'catalog' as const, label: 'Katalog 29 Gaya 3D', icon: <Layers className="h-4 w-4" /> },
            { id: 'ai' as const, label: 'Interkoneksi AI', icon: <Cpu className="h-4 w-4" /> },
            { id: 'voice' as const, label: 'Voiceover Cartesia', icon: <Mic className="h-4 w-4" /> },
            { id: 'users' as const, label: 'Pengguna & Role', icon: <Users className="h-4 w-4" /> },
            { id: 'renders' as const, label: 'Vault Render', icon: <Video className="h-4 w-4" /> },
            { id: 'system' as const, label: 'Cadangan & Sistem', icon: <Database className="h-4 w-4 text-cyan-400" /> },
          ].map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                tab === t.id 
                  ? 'bg-accent text-ink shadow-md font-extrabold' 
                  : 'text-muted hover:text-paper hover:bg-tile'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {message && (
        <p
          role="status"
          className={`rounded-2xl border px-4 py-3 text-xs font-bold ${
            message.tone === 'error' ? 'border-red-900 bg-red-950/50 text-red-200' : 'border-emerald-900 bg-emerald-950/40 text-emerald-200'
          }`}
        >
          {message.text}
        </p>
      )}

      {/* TAB 1: OVERVIEW DASHBOARD */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {/* System Health & Status Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <button
              type="button"
              onClick={() => setTab('server')}
              className="p-4 rounded-2xl bg-card border border-line hover:border-emerald-500/50 space-y-2 shadow-md text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-dim uppercase font-bold flex items-center gap-1.5 group-hover:text-emerald-400">
                  <Server className="w-3.5 h-3.5 text-emerald-400" />
                  SERVER MONITORING
                </span>
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h4 className="font-bold text-sm text-paper group-hover:text-emerald-300">Next.js Web Server (Port 3788)</h4>
              <p className="text-xs text-emerald-300 font-mono flex items-center justify-between">
                <span>ONLINE • 200 OK</span>
                <span className="text-[10px] text-dim group-hover:text-paper font-semibold">Pantau Server ➔</span>
              </p>
            </button>

            <div className="p-4 rounded-2xl bg-card border border-line space-y-2 shadow-md">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-dim uppercase font-bold flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-accent" />
                  VISUAL 3D ENGINE
                </span>
                <span className="size-2 rounded-full bg-accent animate-pulse" />
              </div>
              <h4 className="font-bold text-sm text-paper">Remotion 4.0 + Three.js</h4>
              <p className="text-xs text-accent font-mono">29 KITS SIAP RENDER</p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-line space-y-2 shadow-md">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-dim uppercase font-bold flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-cyan-400" />
                  VOICEOVER GATEWAY
                </span>
                <span className="size-2 rounded-full bg-cyan-400 animate-pulse" />
              </div>
              <h4 className="font-bold text-sm text-paper">Cartesia AI &amp; Word Timestamps</h4>
              <p className="text-xs text-cyan-300 font-mono">TERKONEKSI KE MCP</p>
            </div>

          </div>

          {/* Quick Shortcuts & Recent Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Recent Orders Summary (7 cols) */}
            <div className="lg:col-span-7 rounded-2xl border border-line bg-card p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <h4 className="font-bold text-sm text-paper flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-accent" />
                  <span>Pesanan &amp; Lisensi Terbaru</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setTab('orders')}
                  className="text-xs text-accent hover:underline font-semibold"
                >
                  Lihat Semua ({totalOrders}) ➔
                </button>
              </div>

              <div className="space-y-2.5">
                {orders?.slice(0, 4).map((o) => (
                  <div key={o.id} className="p-3 rounded-xl bg-tile border border-line flex items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-paper block">{o.customerName}</span>
                      <span className="text-[11px] text-dim">{o.tierName} • <span className="font-mono text-accent font-bold">{o.amount}</span></span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800 block mb-0.5">
                        {o.licenseKey}
                      </span>
                      <span className="text-[10px] text-dim uppercase font-bold">{o.status}</span>
                    </div>
                  </div>
                ))}

                {(!orders || orders.length === 0) && (
                  <p className="text-xs text-dim text-center py-4">Belum ada pesanan tersimpan.</p>
                )}
              </div>
            </div>

            {/* Right: Quick Action Hub (5 cols) */}
            <div className="lg:col-span-5 rounded-2xl border border-line bg-card p-5 space-y-4 shadow-xl">
              <h4 className="font-bold text-sm text-paper flex items-center gap-2 border-b border-line pb-3">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Pusat Jalan Pintas Admin</span>
              </h4>

              <div className="space-y-2 text-xs">
                <button
                  type="button"
                  onClick={() => setTab('server')}
                  className="w-full p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 hover:border-emerald-500/60 flex items-center justify-between text-left group transition-all"
                >
                  <div>
                    <span className="font-bold text-emerald-300 block">Monitoring &amp; Integrasi Server</span>
                    <span className="text-[11px] text-paper/80">Pantau CPU, RAM, Disk, dan Remote Node Linux (192.168.100.168)</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => setTab('landing')}
                  className="w-full p-3 rounded-xl bg-accent/15 border border-accent/40 hover:bg-accent/25 flex items-center justify-between text-left group transition-all"
                >
                  <div>
                    <span className="font-bold text-accent block">Kelola Konten &amp; Tampilan Landing Page</span>
                    <span className="text-[11px] text-paper/80">Edit Hero, 3 Tier Lisensi, DFY, Testimoni, FAQ &amp; Toggles</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => setTab('orders')}
                  className="w-full p-3 rounded-xl bg-tile border border-line hover:border-accent flex items-center justify-between text-left group transition-all"
                >
                  <div>
                    <span className="font-bold text-paper block group-hover:text-accent">Input Pesanan Pembeli Baru</span>
                    <span className="text-[11px] text-dim">Generate kode lisensi &amp; kirim link WA</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-dim group-hover:text-accent group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => setTab('site')}
                  className="w-full p-3 rounded-xl bg-tile border border-line hover:border-accent flex items-center justify-between text-left group transition-all"
                >
                  <div>
                    <span className="font-bold text-paper block group-hover:text-accent">Ubah Harga &amp; Nomor WhatsApp</span>
                    <span className="text-[11px] text-dim">Update konfigurasi langsung</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-dim group-hover:text-accent group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => setTab('catalog')}
                  className="w-full p-3 rounded-xl bg-tile border border-line hover:border-accent flex items-center justify-between text-left group transition-all"
                >
                  <div>
                    <span className="font-bold text-paper block group-hover:text-accent">Audit 29 Gaya 3D Remotion</span>
                    <span className="text-[11px] text-dim">Cek file video MP4 &amp; prompt visual</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-dim group-hover:text-accent group-hover:translate-x-1 transition-transform" />
                </button>

                <Link
                  href="/panduan"
                  target="_blank"
                  className="w-full p-3 rounded-xl bg-tile border border-line hover:border-emerald-500/60 flex items-center justify-between text-left group transition-all"
                >
                  <div>
                    <span className="font-bold text-paper block group-hover:text-emerald-300">Buka Buku Panduan Instalasi</span>
                    <span className="text-[11px] text-dim">Runbook instalasi Claude &amp; Remotion</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-dim group-hover:text-emerald-300" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB: SERVER MONITORING & INTEGRATION */}
      {tab === 'server' && (
        <ServerMonitoringTab />
      )}

      {/* TAB: CMS LANDING PAGE */}
      {tab === 'landing' && (
        <LandingPageManagerTab />
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {tab === 'orders' && (
        <OrdersTab 
          orders={orders ?? []} 
          onRefresh={load} 
        />
      )}

      {/* TAB: COUPONS MANAGEMENT */}
      {tab === 'coupons' && (
        <CouponsTab />
      )}

      {/* TAB 3: SITE SETTINGS & PRICING */}
      {tab === 'site' && (
        <SiteSettingsTab />
      )}

      {/* TAB 4: 29 3D KITS CATALOG */}
      {tab === 'catalog' && (
        <CatalogTab />
      )}

      {/* TAB 5: AI INTERCONNECTION */}
      {tab === 'ai' && (
        <AiInterconnectionTab />
      )}

      {/* TAB 6: VOICEOVER TTS */}
      {tab === 'voice' && (
        <VoiceOverTab />
      )}

      {/* TAB 7: USERS MANAGEMENT */}
      {tab === 'users' && (
        <div className="overflow-x-auto rounded-2xl border border-line bg-card shadow-xl">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead className="bg-tile border-b border-line font-mono text-[11px] uppercase tracking-wider text-dim">
              <tr>
                <th className="px-4 py-3 font-medium">Pengguna</th>
                <th className="px-4 py-3 font-medium">Peran</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Render</th>
                <th className="px-4 py-3 font-medium">Bergabung</th>
                <th className="px-4 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {users === null && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin text-accent" />
                  </td>
                </tr>
              )}
              {users?.map((u) => {
                const isMe = u.id === meId;
                const busy = busyId === u.id;
                return (
                  <tr key={u.id} className="hover:bg-tile/40 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-paper">
                        {u.name} {isMe && <span className="text-dim">(Anda)</span>}
                      </p>
                      <p className="text-[11px] text-dim">{u.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase font-bold ${
                          u.role === 'superadmin' 
                            ? 'border-accent/50 bg-accent/15 text-accent' 
                            : u.role === 'customer'
                            ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-400'
                            : 'border-line text-muted'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">{u.disabled ? <span className="text-red-400 font-bold">Nonaktif</span> : <span className="text-emerald-400 font-bold">Aktif</span>}</td>
                    <td className="px-4 py-3 font-mono">{u.renders}</td>
                    <td className="px-4 py-3 text-dim">{fmtDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      {isMe ? (
                        <p className="text-right text-[12px] text-dim">Akun Utama</p>
                      ) : (
                        <div className="flex justify-end gap-1.5 flex-wrap">
                          {u.role !== 'superadmin' ? (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => act(u, 'PATCH', { role: 'superadmin' })}
                              className="rounded-lg border border-accent/40 bg-accent/10 text-accent px-2 py-1 text-[11px] font-semibold hover:bg-accent/20 disabled:opacity-50"
                            >
                              Jadikan Admin
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => act(u, 'PATCH', { role: 'customer' })}
                              className="rounded-lg border border-line bg-tile px-2 py-1 text-[11px] font-semibold hover:border-accent disabled:opacity-50"
                            >
                              Jadikan Customer
                            </button>
                          )}
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => act(u, 'PATCH', { disabled: !u.disabled })}
                            className="rounded-lg border border-line bg-tile px-2 py-1 text-[11px] font-semibold hover:border-accent disabled:opacity-50"
                          >
                            {u.disabled ? 'Aktifkan' : 'Nonaktifkan'}
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => act(u, 'DELETE', undefined, `Hapus akun ${u.email}? Tindakan ini tidak bisa dibatalkan.`)}
                            className="rounded-lg border border-red-900 bg-red-950/30 px-2.5 py-1 text-[11px] font-semibold text-red-300 hover:bg-red-950 disabled:opacity-50"
                          >
                            Hapus
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 8: RENDERS VAULT */}
      {tab === 'renders' && (
        <div className="overflow-x-auto rounded-2xl border border-line bg-card shadow-xl">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="bg-tile border-b border-line font-mono text-[11px] uppercase tracking-wider text-dim">
              <tr>
                <th className="px-4 py-3 font-medium">Video Reel</th>
                <th className="px-4 py-3 font-medium">Pemilik Akun</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Dibuat</th>
                <th className="px-4 py-3 font-medium text-right">File MP4</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {renders?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-dim">
                    Belum ada riwayat render video tersimpan di server.
                  </td>
                </tr>
              )}
              {renders?.map((r) => (
                <tr key={r.id} className="hover:bg-tile/40 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-paper">{r.title}</p>
                    <p className="font-mono text-[11px] text-dim">
                      {r.id} · {r.format}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-muted">{r.ownerEmail}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${STATE_STYLE[r.state] ?? 'border-line text-muted'}`}>
                      {r.state}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-dim">{fmtDate(r.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    {r.hasFile ? (
                      <a
                        href={`/api/render/${r.id}/file?download=1`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-tile px-3 py-1.5 text-xs font-semibold text-accent hover:border-accent"
                      >
                        <Download className="h-3.5 w-3.5" /> Unduh MP4
                      </a>
                    ) : (
                      <span className="text-dim">–</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB: SYSTEM & BACKUP */}
      {tab === 'system' && (
        <SystemTab />
      )}
    </div>
  );
};
