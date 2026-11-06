'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { 
  Key, 
  Download, 
  ShoppingBag, 
  Video, 
  HelpCircle, 
  FileText, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink,
  MessageCircle,
  Play,
  Terminal,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Clock,
  Layers
} from 'lucide-react';
import { OrderRecord } from '@/lib/orders';
import { PublicUser } from '@/lib/auth';
import { InteractiveGuideView } from '@/components/guide/InteractiveGuideView';
import { PanduanLockedGate } from '@/components/guide/PanduanLockedGate';
import { Lock, AlertTriangle, ShieldAlert } from 'lucide-react';

interface CustomerDashboardProps {
  user: PublicUser;
}

type CustomerTab = 'overview' | 'guide' | 'license' | 'orders' | 'renders' | 'downloads' | 'support';

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ user }) => {
  const [tab, setTab] = useState<CustomerTab>('overview');
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [renders, setRenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [ordRes, rndRes] = await Promise.all([
        fetch('/api/orders/my-orders').then(r => r.json()).catch(() => ({ orders: [] })),
        fetch('/api/renders').then(r => r.json()).catch(() => ({ renders: [] }))
      ]);
      setOrders(ordRes.orders || []);
      setRenders(rndRes.renders || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCopy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const primaryOrder = orders[0];
  const isLicenseActive = Boolean(primaryOrder?.isLicenseActive);
  const activeLicense = primaryOrder?.licenseKey || (isLicenseActive ? 'AUD-MAS-2026-DEMO' : 'MENUNGGU-AKTIVASI');
  const activeTier = primaryOrder?.tierName || 'Lisensi Komersial AUDIRA Motion';

  const claudePrompt = `Saya telah membeli lisensi resmi AUDIRA Motion 3D (Kode: ${activeLicense}).
Tolong bantu saya setup proyek ini dengan Remotion 4.0:
1. Hubungkan ke MCP Remotion di folder template
2. Cek ketersediaan 29 gaya visual 3D
3. Pandu saya membuat video motion pertama saya berdurasi 30 detik format 1080x1920 (9:16).`;

  return (
    <div className="flex flex-col gap-8 font-display">
      
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="inline-flex items-center gap-2 mb-1.5">
            <span className={`rounded-md border px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
              isLicenseActive
                ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-400'
                : 'border-amber-500/50 bg-amber-950/40 text-amber-400'
            }`}>
              ROLE: PELANGGAN RESMI (CUSTOMER)
            </span>
            <span className="text-xs text-dim">• ID Akun: {user.id.slice(0, 8)}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-paper">
            Area Pelanggan &amp; Lisensi Anda
          </h2>
          <p className="text-xs sm:text-sm text-muted">
            Selamat datang, <strong className="text-paper">{user.name}</strong> ({user.email}). Kelola lisensi, file template 3D, faktur resmi, dan render video Anda di sini.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setTab('guide')}
            className={`btn-outline py-2 px-3.5 text-xs font-semibold inline-flex items-center gap-1.5 ${
              tab === 'guide' ? 'border-accent text-accent bg-accent/10' : ''
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-accent" />
            <span>Buku Panduan &amp; Setup</span>
          </button>

          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-tile px-3.5 py-2 text-xs font-bold text-paper hover:border-accent hover:text-accent transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-accent' : ''}`} />
            <span>Segarkan</span>
          </button>
        </div>
      </div>

      {/* PENDING LICENSE ACTIVATION BANNER */}
      {!isLicenseActive && !loading && (
        <div className="rounded-3xl border-2 border-amber-500/60 bg-gradient-to-r from-amber-950/50 via-card to-amber-950/40 p-5 sm:p-6 text-paper shadow-2xl space-y-3 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0">
                <Lock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-md border border-amber-500/40">
                    STATUS: MENUNGGU AKTIVASI SUPERADMIN
                  </span>
                  {primaryOrder?.id && (
                    <span className="text-xs font-mono text-dim">• {primaryOrder.id}</span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-black text-paper mt-1">
                  Lisensi Anda Sedang Menunggu Otorisasi Superadmin
                </h3>
              </div>
            </div>

            <a
              href={`https://wa.me/6285709666240?text=${encodeURIComponent(`Halo Tim AUDIRA, saya ingin mengonfirmasi aktivasi lisensi pesanan ${primaryOrder?.id || '-'} (${activeTier}) dengan kode lisensi ${activeLicense}. Bukti transfer sudah saya kirimkan.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary py-2.5 px-4 text-xs font-bold inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shrink-0"
            >
              <MessageCircle className="w-4 h-4 fill-black" />
              <span>Konfirmasi ke WhatsApp Superadmin ➔</span>
            </a>
          </div>

          <p className="text-xs text-amber-200/90 leading-relaxed border-t border-amber-800/40 pt-3">
            Pesanan paket <strong className="text-paper">{activeTier}</strong> Anda telah tercatat dengan kode lisensi <strong className="font-mono text-cyan-300">{activeLicense}</strong>. Demi keamanan dan verifikasi pembayaran, seluruh materi teknis (Buku Panduan 3D, Interkoneksi Claude Code, dan Unduhan ZIP Master) akan aktif segera setelah Superadmin AUDIRA mengaktifkan lisensi Anda di Admin Panel.
          </p>
        </div>
      )}

      {/* Quick Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-line bg-card p-5 space-y-1 shadow-md">
          <p className="font-mono text-[11px] uppercase tracking-wider text-dim flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-accent" />
            Lisensi Digital
          </p>
          <p className="text-xl sm:text-2xl font-extrabold text-paper font-mono truncate">{activeLicense}</p>
          <p className={`text-[11px] font-semibold ${isLicenseActive ? 'text-emerald-400' : 'text-amber-400'}`}>
            {isLicenseActive ? 'Terverifikasi & Aktif' : 'Menunggu Aktivasi Superadmin'}
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-card p-5 space-y-1 shadow-md">
          <p className="font-mono text-[11px] uppercase tracking-wider text-dim flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
            Pesanan Saya
          </p>
          <p className="text-xl sm:text-2xl font-extrabold text-paper font-mono">{orders.length}</p>
          <p className="text-[11px] text-muted">Faktur &amp; Kuitansi Tersedia</p>
        </div>

        <div className="rounded-2xl border border-line bg-card p-5 space-y-1 shadow-md">
          <p className="font-mono text-[11px] uppercase tracking-wider text-dim flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-cyan-400" />
            Video Dirender
          </p>
          <p className="text-xl sm:text-2xl font-extrabold text-paper font-mono">{renders.length}</p>
          <p className="text-[11px] text-cyan-300">Format MP4 60 FPS</p>
        </div>

        <div className="rounded-2xl border border-line bg-card p-5 space-y-1 shadow-md">
          <p className="font-mono text-[11px] uppercase tracking-wider text-dim flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            Hak Komersial
          </p>
          <p className="text-xl sm:text-2xl font-extrabold text-accent font-mono">100% Milik Anda</p>
          <p className="text-[11px] text-muted">Bebas Royalti Seumur Hidup</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 rounded-2xl border border-line bg-card p-1.5 shadow-xl overflow-x-auto">
        {[
          { id: 'overview' as const, label: 'Overview', icon: <Sparkles className="w-4 h-4" /> },
          { id: 'guide' as const, label: 'Buku Panduan & Setup 3D', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'license' as const, label: 'Lisensi & Claude Code', icon: <Key className="w-4 h-4" /> },
          { id: 'orders' as const, label: 'Pesanan & Faktur (Invoice)', icon: <FileText className="w-4 h-4" /> },
          { id: 'downloads' as const, label: 'Download Asset 3D', icon: <Download className="w-4 h-4" /> },
          { id: 'renders' as const, label: 'Vault Render MP4', icon: <Video className="w-4 h-4" /> },
          { id: 'support' as const, label: 'Bantuan VIP', icon: <HelpCircle className="w-4 h-4" /> },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shrink-0 ${
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

      {/* TAB: OVERVIEW */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Card: Active License Highlight (7 cols) */}
            <div className="lg:col-span-7 rounded-3xl border border-line bg-card p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <span className="font-mono text-xs text-accent uppercase font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  LISENSI DIGITAL RESMI ANDA
                </span>
                <span className={`font-mono text-[10px] px-2 py-0.5 rounded border font-bold ${
                  isLicenseActive 
                    ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800' 
                    : 'text-amber-400 bg-amber-950/60 border-amber-800 animate-pulse'
                }`}>
                  {isLicenseActive ? 'LIFETIME • AKTIF' : 'MENUNGGU AKTIVASI SUPERADMIN'}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-paper">{activeTier}</h3>
                <p className="text-xs text-muted mt-1">
                  {isLicenseActive 
                    ? 'Lisensi ini memberikan hak penuh untuk monetisasi video reels, iklan klien, YouTube Shorts, & TikTok.' 
                    : 'Lisensi ini sedang menunggu otorisasi oleh Superadmin AUDIRA sebelum dapat digunakan secara resmi.'}
                </p>
              </div>

              {/* License Key Box */}
              <div className={`p-4 rounded-2xl border space-y-2 ${
                isLicenseActive 
                  ? 'border-cyan-500/30 bg-cyan-950/20' 
                  : 'border-amber-500/30 bg-amber-950/20'
              }`}>
                <span className={`text-[10px] font-mono uppercase font-bold block ${
                  isLicenseActive ? 'text-cyan-300' : 'text-amber-300'
                }`}>
                  {isLicenseActive ? 'KODE LISENSI RESMI (SIMPAN BAIK-BAIK)' : 'KODE LISENSI TERDAFTAR (MENUNGGU AKTIVASI)'}
                </span>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-base sm:text-lg font-black text-white tracking-wider">
                    {activeLicense}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(activeLicense, 'license')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                      isLicenseActive 
                        ? 'bg-cyan-500 text-black hover:bg-cyan-400' 
                        : 'bg-amber-500 text-black hover:bg-amber-400'
                    }`}
                  >
                    {copiedText === 'license' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText === 'license' ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                {isLicenseActive ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setTab('license')}
                      className="btn-primary py-2 px-4 text-xs font-bold inline-flex items-center gap-1.5"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Setup di Claude Code</span>
                    </button>

                    <a
                      href="https://github.com/Audira141415/AUDIRA-TEMPLATE-MOTION/archive/refs/heads/master.zip"
                      className="btn-outline py-2 px-4 text-xs font-semibold inline-flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh File Template (.ZIP)</span>
                    </a>
                  </>
                ) : (
                  <>
                    <a
                      href={`https://wa.me/6285709666240?text=${encodeURIComponent(`Halo Tim AUDIRA, saya ingin aktivasi lisensi ${activeLicense} atas nama ${user.name}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary py-2 px-4 text-xs font-bold inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-black shadow-md"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-black" />
                      <span>Minta Aktivasi via WhatsApp</span>
                    </a>

                    <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-tile border border-line text-dim text-xs font-mono">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>File Master Terkunci</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right Card: Quick Actions & Guides (5 cols) */}
            <div className="lg:col-span-5 rounded-3xl border border-line bg-card p-6 space-y-4 shadow-xl">
              <h4 className="font-bold text-sm text-paper flex items-center gap-2 border-b border-line pb-3">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Jalan Pintas Pelanggan</span>
              </h4>

              <div className="space-y-2 text-xs">
                <button
                  type="button"
                  onClick={() => setTab('guide')}
                  className="w-full p-3 rounded-xl bg-accent/10 border border-accent/40 hover:bg-accent/20 flex items-center justify-between text-left group transition-all"
                >
                  <div>
                    <span className="font-bold text-accent block group-hover:underline">Buku Panduan Instalasi &amp; Prompt 29 Gaya</span>
                    <span className="text-[11px] text-muted">Langkah install Remotion, MCP Mesh &amp; Claude Code</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => setTab('orders')}
                  className="w-full p-3 rounded-xl bg-tile border border-line hover:border-accent flex items-center justify-between text-left group transition-all"
                >
                  <div>
                    <span className="font-bold text-paper block group-hover:text-accent">Lihat &amp; Cetak Faktur (Invoice)</span>
                    <span className="text-[11px] text-dim">Bukti pembayaran resmi bertanda tangan digital</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-dim group-hover:text-accent group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => setTab('support')}
                  className="w-full p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 hover:border-emerald-500/60 flex items-center justify-between text-left group transition-all"
                >
                  <div>
                    <span className="font-bold text-emerald-300 block">Konsultasi WhatsApp Tim AUDIRA</span>
                    <span className="text-[11px] text-emerald-400/70">Dukungan teknis 1-on-1 sampai render berhasil</span>
                  </div>
                  <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB: GUIDE & 29 STYLES (EXCLUSIVE TO PURCHASERS WITH ACTIVE LICENSE) */}
      {tab === 'guide' && (
        <div className="space-y-6">
          {!isLicenseActive ? (
            <PanduanLockedGate user={user} pendingOrder={primaryOrder} />
          ) : (
            <InteractiveGuideView
              user={user}
              initialLicense={activeLicense}
              isInsideDashboard={true}
            />
          )}
        </div>
      )}

      {/* TAB: LICENSE & CLAUDE CODE */}
      {tab === 'license' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-line bg-card p-6 space-y-5 shadow-xl">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xl font-bold text-paper flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-accent" />
                  <span>Panduan Aktivasi Lisensi di Claude Code &amp; 29 Gaya 3D</span>
                </h3>
                {isLicenseActive ? (
                  <button
                    type="button"
                    onClick={() => setTab('guide')}
                    className="btn-primary py-1.5 px-3.5 text-xs font-bold inline-flex items-center gap-1.5 shadow-md"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Buka Panduan &amp; Prompt Studio ➔</span>
                  </button>
                ) : (
                  <span className="font-mono text-[10px] text-amber-400 bg-amber-950/60 border border-amber-800 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-400" /> Menunggu Aktivasi Superadmin
                  </span>
                )}
              </div>
              <p className="text-xs text-muted mt-1">
                Gunakan kode lisensi ini langsung saat berinteraksi dengan asisten coding Claude Anda untuk mengotomasi pembuatan video 3D.
              </p>
            </div>

            {/* Inactive License Warning Alert */}
            {!isLicenseActive && (
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-amber-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Prompt Claude Code terkunci. Harap tunggu Superadmin mengaktifkan lisensi Anda atau kirim bukti transfer ke WhatsApp.</span>
                </div>
                <a
                  href={`https://wa.me/6285709666240?text=${encodeURIComponent(`Halo Tim AUDIRA, saya ingin aktivasi lisensi ${activeLicense} atas nama ${user.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-400 hover:underline shrink-0 flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Minta Aktivasi WA ➔</span>
                </a>
              </div>
            )}

            {/* Prompt Helper */}
            <div className={`space-y-2 ${!isLicenseActive ? 'opacity-60 pointer-events-none' : ''}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-paper">Salin Prompt Siap Pakai untuk Claude Code:</span>
                <button
                  type="button"
                  disabled={!isLicenseActive}
                  onClick={() => handleCopy(claudePrompt, 'prompt')}
                  className="btn-outline py-1 px-3 text-[11px] font-semibold inline-flex items-center gap-1.5 disabled:opacity-40"
                >
                  {copiedText === 'prompt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText === 'prompt' ? 'Tersalin' : 'Salin Prompt'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-black/80 border border-line text-xs font-mono text-paper/90 whitespace-pre-wrap leading-relaxed">
                {claudePrompt}
              </pre>
            </div>

            {/* Step By Step Checklist */}
            <div className="pt-4 border-t border-line space-y-3 text-xs">
              <h4 className="font-bold text-paper">Langkah Setup Cepat (3 Menit):</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-tile border border-line space-y-1">
                  <span className="font-mono text-accent font-bold">01. Extract ZIP</span>
                  <p className="text-muted text-[11px]">Buka folder proyek template di terminal pilihan Anda (VS Code / Cursor / Windsurf).</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-tile border border-line space-y-1">
                  <span className="font-mono text-cyan-400 font-bold">02. Install Dependency</span>
                  <p className="text-muted text-[11px]">Jalankan perintah <code className="text-white bg-black/50 px-1 rounded">pnpm install</code> untuk mengunduh modul Remotion &amp; Three.js.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-tile border border-line space-y-1">
                  <span className="font-mono text-emerald-400 font-bold">03. Jalankan Studio</span>
                  <p className="text-muted text-[11px]">Ketik <code className="text-white bg-black/50 px-1 rounded">pnpm dev</code> lalu buka browser di <code className="text-white bg-black/50 px-1 rounded">localhost:3788</code>.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: ORDERS & INVOICES */}
      {tab === 'orders' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-line bg-card p-6 space-y-4 shadow-xl">
            <div>
              <h3 className="text-xl font-bold text-paper flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" />
                <span>Riwayat Pesanan &amp; Faktur Pembelian (Invoice)</span>
              </h3>
              <p className="text-xs text-muted">
                Semua faktur resmi dilengkapi nomor registrasi digital, rincian paket lisensi, dan dapat dicetak sebagai bukti transaksi perusahaan.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-line bg-tile">
              <table className="w-full min-w-[700px] text-left text-xs">
                <thead className="bg-card border-b border-line font-mono text-[11px] uppercase tracking-wider text-dim">
                  <tr>
                    <th className="px-4 py-3">No. Faktur</th>
                    <th className="px-4 py-3">Paket Lisensi</th>
                    <th className="px-4 py-3">Nominal</th>
                    <th className="px-4 py-3">Status Otorisasi</th>
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3 text-right">Faktur Resmi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-soft">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-card/40 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-paper">{o.id}</td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-paper block">{o.tierName}</span>
                        <span className="text-[10px] font-mono text-cyan-400">{o.licenseKey}</span>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-accent">{o.amount}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                          o.isLicenseActive
                            ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-400'
                            : 'border-amber-500/40 bg-amber-950/40 text-amber-400'
                        }`}>
                          {o.isLicenseActive ? 'Aktif' : 'Menunggu Superadmin'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-dim font-mono text-[11px]">
                        {new Date(o.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/invoice/${o.id}`}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-card px-3 py-1.5 font-bold text-paper hover:border-accent hover:text-accent transition-all text-xs"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Cetak Faktur</span>
                        </Link>
                      </td>
                    </tr>
                  ))}

                  {orders.length === 0 && !loading && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-dim text-xs">
                        Belum ada riwayat pesanan tercatat di akun ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: DOWNLOADS */}
      {tab === 'downloads' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-line bg-card p-6 space-y-4 shadow-xl">
            <div>
              <h3 className="text-xl font-bold text-paper flex items-center gap-2">
                <Download className="w-5 h-5 text-accent" />
                <span>Pusat Unduhan Asset &amp; Template 3D</span>
              </h3>
              <p className="text-xs text-muted">
                Unduh file proyek lengkap, paket 29 gaya visual 3D Remotion, dan modul interkoneksi AI.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-5 rounded-2xl bg-tile border border-line space-y-3">
                <span className="font-mono text-[10px] text-accent font-bold uppercase block">FILE PROYEK LENGKAP (.ZIP)</span>
                <h4 className="font-bold text-paper text-sm">AUDIRA Template Motion Master Bundle</h4>
                <p className="text-muted text-[11px]">
                  Berisi 29 komponen gaya 3D Remotion, script render CLI, konfigurasi Next.js, dan aset visual 60 FPS.
                </p>
                {isLicenseActive ? (
                  <a
                    href="https://github.com/Audira141415/AUDIRA-TEMPLATE-MOTION/archive/refs/heads/master.zip"
                    className="btn-primary py-2 px-4 text-xs font-bold inline-flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh ZIP Master (Terbaru)</span>
                  </a>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-xl bg-amber-950/30 border border-amber-500/40 px-3.5 py-2 text-xs font-bold text-amber-300">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Unduhan Terkunci (Menunggu Aktivasi Lisensi)</span>
                  </div>
                )}
              </div>

              <div className="p-5 rounded-2xl bg-tile border border-line space-y-3">
                <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase block">SKILL &amp; MCP REPOSITORY</span>
                <h4 className="font-bold text-paper text-sm">Claude Code Skills &amp; MCP Mesh</h4>
                <p className="text-muted text-[11px]">
                  Paket skill otomatisasi AI untuk menyusun storyboard, script voiceover, dan scene Three.js secara mandiri.
                </p>
                {isLicenseActive ? (
                  <Link
                    href="/panduan"
                    className="btn-outline py-2 px-4 text-xs font-semibold inline-flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Buka Petunjuk Skill MCP</span>
                  </Link>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-xl bg-amber-950/30 border border-amber-500/40 px-3.5 py-2 text-xs font-bold text-amber-300">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Petunjuk Terkunci (Menunggu Aktivasi)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: RENDERS */}
      {tab === 'renders' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-line bg-card p-6 space-y-4 shadow-xl">
            <div>
              <h3 className="text-xl font-bold text-paper flex items-center gap-2">
                <Video className="w-5 h-5 text-accent" />
                <span>Vault Video Render Akun Anda</span>
              </h3>
              <p className="text-xs text-muted">
                Daftar video yang telah diproses menggunakan engine Remotion dari akun Anda.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-line bg-tile">
              <table className="w-full min-w-[640px] text-left text-xs">
                <thead className="bg-card border-b border-line font-mono text-[11px] uppercase tracking-wider text-dim">
                  <tr>
                    <th className="px-4 py-3">Video Title</th>
                    <th className="px-4 py-3">Format</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Waktu Render</th>
                    <th className="px-4 py-3 text-right">Unduh MP4</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-soft">
                  {renders.map((r: any) => (
                    <tr key={r.id} className="hover:bg-card/40 transition-colors">
                      <td className="px-4 py-3 font-semibold text-paper">{r.title}</td>
                      <td className="px-4 py-3 font-mono text-dim">{r.format}</td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-2 py-0.5 rounded font-bold uppercase">
                          {r.state}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-dim font-mono text-[11px]">
                        {new Date(r.createdAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {r.hasFile ? (
                          <a
                            href={`/api/render/${r.id}/file?download=1`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-card px-2.5 py-1 text-accent font-bold hover:border-accent"
                          >
                            <Download className="w-3.5 h-3.5" /> Unduh
                          </a>
                        ) : (
                          <span className="text-dim">–</span>
                        )}
                      </td>
                    </tr>
                  ))}

                  {renders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-dim text-xs">
                        Belum ada riwayat video dirender. Jalankan render pertama Anda melalui Studio atau CLI Remotion.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: SUPPORT */}
      {tab === 'support' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-line bg-card p-6 space-y-4 shadow-xl">
            <div>
              <h3 className="text-xl font-bold text-paper flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-accent" />
                <span>Layanan Bantuan Prioritas Tim AUDIRA</span>
              </h3>
              <p className="text-xs text-muted">
                Sebagai pemilik lisensi resmi, Anda berhak mendapatkan pendampingan instalasi dan troubleshooting langsung 1-on-1.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-2xl bg-emerald-500 text-black">
                  <MessageCircle className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="font-bold text-paper text-sm">WhatsApp Priority Support</h4>
                  <p className="text-xs text-emerald-300">Respon cepat hari kerja 09.00 - 21.00 WIB</p>
                </div>
              </div>

              <p className="text-xs text-muted leading-relaxed">
                Hubungi kami untuk kendala compile Remotion, bug shader Three.js, integrasi suara Cartesia, atau pesanan jasa render terima beres (DFY).
              </p>

              <a
                href={`https://wa.me/6285709666240?text=${encodeURIComponent(`Halo Tim AUDIRA, saya pemilik lisensi resmi ${activeLicense} atas nama ${user.name}. Saya butuh bantuan teknis terkait template Remotion 3D.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary py-2.5 px-5 text-xs font-bold inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat WhatsApp Tim AUDIRA Sekarang</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

