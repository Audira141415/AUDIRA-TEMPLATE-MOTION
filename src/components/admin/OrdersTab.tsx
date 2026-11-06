'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Send, 
  MessageCircle, 
  Key, 
  Trash2, 
  Copy, 
  Check, 
  ExternalLink,
  Filter,
  X,
  FileText,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Lock,
  Unlock,
  AlertTriangle
} from 'lucide-react';
import { OrderRecord, OrderStatus, LicenseStatus } from '@/lib/orders';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Menunggu Bayar', color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-800' },
  verified: { label: 'Lunas / Terverifikasi', color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-800' },
  sent: { label: 'Akses Terkirim', color: 'text-cyan-400', bg: 'bg-cyan-950/40 border-cyan-800' },
  completed: { label: 'Selesai', color: 'text-purple-400', bg: 'bg-purple-950/40 border-purple-800' },
  cancelled: { label: 'Dibatalkan', color: 'text-red-400', bg: 'bg-red-950/40 border-red-800' },
};

interface OrdersTabProps {
  orders: OrderRecord[];
  onRefresh: () => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({ orders, onRefresh }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);

  // Form states for creating manual order
  const [newName, setNewName] = useState('');
  const [newWA, setNewWA] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newTier, setNewTier] = useState('lab');
  const [newTierName, setNewTierName] = useState('Creator Lab Ultimate');
  const [newAmount, setNewAmount] = useState('Rp499.000');
  const [newPayment, setNewPayment] = useState('QRIS');
  const [newNotes, setNewNotes] = useState('');
  const [autoActivate, setAutoActivate] = useState(true);

  const pendingActivationCount = orders.filter(o => !o.isLicenseActive && o.status !== 'cancelled').length;
  const activeLicenseCount = orders.filter(o => o.isLicenseActive).length;

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(id);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleLicense = async (orderId: string, currentActive: boolean) => {
    const action = currentActive ? 'suspend' : 'activate';
    const confirmPrompt = currentActive
      ? `Nonaktifkan lisensi untuk pesanan ${orderId}? Pelanggan tidak akan bisa membuka panduan & tools.`
      : `Aktifkan lisensi untuk pesanan ${orderId}? Akses Buku Panduan dan Engine 3D pelanggan akan langsung terbuka.`;

    if (!window.confirm(confirmPrompt)) return;

    setActionBusyId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/license`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        onRefresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal mengubah status lisensi.');
      }
    } catch (e) {
      console.error(e);
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setActionBusyId(null);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!window.confirm(`Hapus data pesanan ${orderId}? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE'
      });
      if (res.ok) onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newWA) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: newName,
          customerWhatsApp: newWA,
          customerEmail: newEmail || '-',
          tier: newTier,
          tierName: newTierName,
          amount: newAmount,
          paymentMethod: newPayment,
          status: autoActivate ? 'verified' : 'pending',
          isLicenseActive: autoActivate,
          licenseStatus: autoActivate ? 'active' : 'pending_activation',
          notes: newNotes
        })
      });
      if (res.ok) {
        setIsAddModalOpen(false);
        setNewName('');
        setNewWA('');
        setNewEmail('');
        setNewNotes('');
        setAutoActivate(true);
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendWhatsAppAccess = (order: OrderRecord) => {
    const waNumber = order.customerWhatsApp.startsWith('0') 
      ? `62${order.customerWhatsApp.slice(1)}` 
      : order.customerWhatsApp;

    const isActivated = order.isLicenseActive;

    const message = isActivated
      ? `Halo Kak ${order.customerName},\n\n` +
        `Kabar baik! Lisensi resmi AUDIRA Motion Anda telah RESMI DIAKTIFKAN oleh Superadmin AUDIRA:\n\n` +
        `📦 Paket: *${order.tierName}*\n` +
        `🔑 Kode Lisensi: *${order.licenseKey}*\n` +
        `⚡ Status: *AKTIF & SIAP DIGUNAKAN*\n` +
        `💰 Total: *${order.amount}* (${order.paymentMethod})\n\n` +
        `📖 Akses Buku Panduan & Setup 3D Remotion (Khusus Pembeli):\n` +
        `http://localhost:3788/admin\n\n` +
        `📁 Link Download File Template Master (.ZIP):\n` +
        `https://github.com/Audira141415/AUDIRA-TEMPLATE-MOTION/archive/refs/heads/master.zip\n\n` +
        `Jika Anda butuh panduan setup atau integrasi Claude Code, reply pesan ini. Tim AUDIRA siap mendampingi 1-on-1!`
      : `Halo Kak ${order.customerName},\n\n` +
        `Pesanan Anda (*${order.tierName}* - ${order.amount}) dengan No: *${order.id}* telah kami terima.\n\n` +
        `🔑 Kode Lisensi: *${order.licenseKey}*\n` +
        `⚠️ Status: *MENUNGGU PEMBAYARAN & AKTIVASI SUPERADMIN*\n\n` +
        `Harap selesaikan pembayaran dan kirim bukti transfer ke nomor WhatsApp ini. Superadmin AUDIRA akan langsung mengaktifkan lisensi Anda dalam hitungan menit agar dapat mengakses buku panduan teknis.\n\n` +
        `Terima kasih!`;

    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    // Automatically mark as sent if verified
    if (order.status === 'verified') {
      handleUpdateStatus(order.id, 'sent');
    }
  };

  const filteredOrders = orders.filter((o) => {
    let matchStatus = true;
    if (filterStatus === 'needs_activation') {
      matchStatus = !o.isLicenseActive && o.status !== 'cancelled';
    } else if (filterStatus === 'license_active') {
      matchStatus = Boolean(o.isLicenseActive);
    } else if (filterStatus !== 'all') {
      matchStatus = o.status === filterStatus;
    }

    const q = search.toLowerCase();
    const matchSearch = 
      o.customerName.toLowerCase().includes(q) ||
      o.customerWhatsApp.includes(q) ||
      o.licenseKey.toLowerCase().includes(q) ||
      o.tierName.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="font-mono text-[11px] font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-accent" />
              SISTEM LISENSI &amp; OTORISASI SUPERADMIN
            </span>
          </div>
          <h3 className="text-xl font-bold text-paper">Manajemen Pesanan &amp; Otorisasi Lisensi</h3>
          <p className="text-xs text-muted">
            Setiap pesanan otomatis dibuatkan lisensi, namun <strong>hanya dapat digunakan setelah diaktifkan oleh Superadmin</strong>.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary py-2.5 px-4 text-xs font-bold inline-flex items-center gap-2 shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pesanan Manual</span>
        </button>
      </div>

      {/* License Status Highlights KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-card border border-line shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-dim uppercase flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-paper" />
            Total Transaksi
          </span>
          <p className="text-2xl font-black font-mono text-paper">{orders.length}</p>
          <p className="text-[11px] text-muted">Semua pesanan masuk web &amp; manual</p>
        </div>

        <div className={`p-4 rounded-2xl border shadow-sm space-y-1 transition-all ${
          pendingActivationCount > 0 
            ? 'bg-amber-950/30 border-amber-500/50 text-amber-300 ring-1 ring-amber-500/40' 
            : 'bg-card border border-line text-paper'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase font-bold flex items-center gap-1.5 text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Menunggu Aktivasi
            </span>
            {pendingActivationCount > 0 && (
              <span className="flex size-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </div>
          <p className="text-2xl font-black font-mono text-amber-400">{pendingActivationCount}</p>
          <p className="text-[11px] text-amber-300/80">
            {pendingActivationCount > 0 ? 'Perlu tindakan 1-klik Superadmin' : 'Semua lisensi telah diproses'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-line shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-dim uppercase flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Lisensi Aktif
          </span>
          <p className="text-2xl font-black font-mono text-emerald-400">{activeLicenseCount}</p>
          <p className="text-[11px] text-muted">Akses buku panduan terbuka penuh</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-line bg-card">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'needs_activation', label: `⚠️ Menunggu Aktivasi (${pendingActivationCount})` },
            { id: 'license_active', label: `🟢 Lisensi Aktif (${activeLicenseCount})` },
            { id: 'verified', label: 'Lunas' },
            { id: 'sent', label: 'Terkirim' },
            { id: 'pending', label: 'Pending Bayar' },
          ].map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setFilterStatus(st.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === st.id
                  ? 'bg-accent text-ink shadow-sm'
                  : 'text-muted hover:text-paper hover:bg-tile'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dim" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, WA, atau lisensi..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-line bg-tile text-xs text-paper placeholder:text-dim focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-2xl border border-line bg-card shadow-xl">
        <table className="w-full min-w-[940px] text-left text-xs">
          <thead className="bg-tile border-b border-line font-mono text-[11px] uppercase tracking-wider text-dim">
            <tr>
              <th className="px-4 py-3">ID &amp; Tanggal</th>
              <th className="px-4 py-3">Pelanggan</th>
              <th className="px-4 py-3">Paket &amp; Nilai</th>
              <th className="px-4 py-3">Kode Lisensi</th>
              <th className="px-4 py-3">Status Otorisasi Lisensi</th>
              <th className="px-4 py-3">Status Transaksi</th>
              <th className="px-4 py-3 text-right">Aksi &amp; WhatsApp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {filteredOrders.map((order) => {
              const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const isLicenseActive = Boolean(order.isLicenseActive);
              const isBusy = actionBusyId === order.id;

              return (
                <tr key={order.id} className="hover:bg-tile/40 transition-colors">
                  <td className="px-4 py-3 font-mono">
                    <span className="font-bold text-paper block">{order.id}</span>
                    <span className="text-[10px] text-dim">
                      {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span className="font-bold text-paper block text-sm">{order.customerName}</span>
                    <span className="text-dim text-[11px]">{order.customerWhatsApp} • {order.customerEmail}</span>
                  </td>

                  <td className="px-4 py-3">
                    <span className="font-semibold text-paper block">{order.tierName}</span>
                    <span className="text-accent font-bold font-mono">{order.amount}</span>
                    <span className="text-dim text-[10px] ml-1">({order.paymentMethod})</span>
                  </td>

                  <td className="px-4 py-3 font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-bold px-2 py-0.5 rounded border text-[11px] ${
                        isLicenseActive 
                          ? 'text-cyan-400 bg-cyan-950/60 border-cyan-800/80' 
                          : 'text-amber-400 bg-amber-950/60 border-amber-800/80'
                      }`}>
                        {order.licenseKey}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(order.licenseKey, order.id)}
                        className="text-dim hover:text-paper"
                        title="Salin Lisensi"
                      >
                        {copiedKey === order.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>

                  {/* Superadmin License Authorization Status & 1-Click Toggle */}
                  <td className="px-4 py-3">
                    {isLicenseActive ? (
                      <div className="flex flex-col gap-1 items-start">
                        <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/50 bg-emerald-950/50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400 uppercase">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>AKTIF &amp; RESMI</span>
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-dim">
                          <span>{order.activatedAt ? new Date(order.activatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'Superadmin'}</span>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleToggleLicense(order.id, true)}
                            className="text-red-400 hover:underline ml-1"
                            title="Cabut akses lisensi"
                          >
                            [Cabut]
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/50 bg-amber-950/50 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-400 uppercase animate-pulse">
                          <Lock className="w-3 h-3 text-amber-400" />
                          <span>BELUM AKTIF</span>
                        </span>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleToggleLicense(order.id, false)}
                          className="inline-flex items-center gap-1 rounded-xl bg-accent px-2.5 py-1 font-bold text-ink hover:bg-orange-400 transition-all text-[11px] shadow-sm disabled:opacity-50"
                        >
                          <Zap className="w-3 h-3 fill-ink" />
                          <span>{isBusy ? 'Memproses...' : '⚡ Aktifkan Lisensi'}</span>
                        </button>
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                      className={`text-[11px] font-bold px-2 py-1 rounded-lg border bg-tile ${statusCfg.color} ${statusCfg.bg} focus:outline-none`}
                    >
                      <option value="pending">Menunggu Bayar</option>
                      <option value="verified">Lunas</option>
                      <option value="sent">Terkirim</option>
                      <option value="completed">Selesai</option>
                      <option value="cancelled">Batal</option>
                    </select>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/invoice/${order.id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 rounded-xl border border-line bg-tile px-2.5 py-1.5 font-bold text-paper hover:border-accent hover:text-accent transition-all text-[11px]"
                        title="Lihat & Cetak Faktur (Invoice)"
                      >
                        <FileText className="w-3.5 h-3.5 text-dim" />
                        <span>Faktur</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleSendWhatsAppAccess(order)}
                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-bold text-[11px] transition-all ${
                          isLicenseActive
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500 hover:text-black'
                            : 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-black'
                        }`}
                        title={isLicenseActive ? 'Kirim Notifikasi Lisensi Aktif via WhatsApp' : 'Kirim Tagihan & Info Belum Aktif via WhatsApp'}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{isLicenseActive ? 'Kirim WA Aktif' : 'Follow-up WA'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(order.id)}
                        className="rounded-xl border border-line bg-tile p-1.5 text-muted hover:border-red-800 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                        title="Hapus Pesanan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-dim text-xs">
                  Tidak ditemukan pesanan dengan filter saat ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah Pesanan Manual */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-display">
          <div className="relative w-full max-w-[520px] rounded-3xl border-2 border-line bg-card p-6 shadow-2xl text-paper">
            <div className="flex items-center justify-between border-b border-line pb-4 mb-4">
              <h4 className="font-bold text-lg text-paper">Tambah Pesanan Manual</h4>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1.5 text-dim hover:text-paper"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-muted mb-1">Nama Lengkap Pembeli / Brand *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: Rian Prakoso"
                  className="w-full rounded-xl border border-line bg-tile px-3.5 py-2 text-paper focus:border-accent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted mb-1">WhatsApp Aktif *</label>
                  <input
                    type="text"
                    required
                    value={newWA}
                    onChange={(e) => setNewWA(e.target.value)}
                    placeholder="0812xxxxxxxx"
                    className="w-full rounded-xl border border-line bg-tile px-3.5 py-2 text-paper focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-muted mb-1">Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="email@pembeli.com"
                    className="w-full rounded-xl border border-line bg-tile px-3.5 py-2 text-paper focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted mb-1">Pilihan Paket *</label>
                <select
                  value={newTier}
                  onChange={(e) => {
                    setNewTier(e.target.value);
                    if (e.target.value === 'starter') {
                      setNewTierName('Starter 3D Pack');
                      setNewAmount('Rp149.000');
                    } else if (e.target.value === 'master') {
                      setNewTierName('Master Director Pack');
                      setNewAmount('Rp299.000');
                    } else if (e.target.value === 'lab') {
                      setNewTierName('Creator Lab Ultimate');
                      setNewAmount('Rp499.000');
                    } else if (e.target.value === 'dfy_single') {
                      setNewTierName('Jasa DFY : Paket Satuan');
                      setNewAmount('Rp349.000');
                    } else if (e.target.value === 'dfy_bundle') {
                      setNewTierName('Jasa DFY : Paket 5 Video');
                      setNewAmount('Rp1.399.000');
                    } else if (e.target.value === 'dfy_retainer') {
                      setNewTierName('Jasa DFY : Monthly Retainer');
                      setNewAmount('Rp3.490.000');
                    }
                  }}
                  className="w-full rounded-xl border border-line bg-tile px-3.5 py-2 text-paper focus:border-accent focus:outline-none"
                >
                  <option value="starter">Starter 3D Pack (Rp149.000)</option>
                  <option value="master">Master Director Pack (Rp299.000)</option>
                  <option value="lab">Creator Lab Ultimate (Rp499.000)</option>
                  <option value="dfy_single">Jasa DFY Satuan (Rp349.000)</option>
                  <option value="dfy_bundle">Jasa DFY Paket 5 Video (Rp1.399.000)</option>
                  <option value="dfy_retainer">Jasa DFY Retainer Bulanan (Rp3.490.000)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted mb-1">Nominal (Rp)</label>
                  <input
                    type="text"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full rounded-xl border border-line bg-tile px-3.5 py-2 text-paper focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-muted mb-1">Jalur Bayar</label>
                  <select
                    value={newPayment}
                    onChange={(e) => setNewPayment(e.target.value)}
                    className="w-full rounded-xl border border-line bg-tile px-3.5 py-2 text-paper focus:border-accent focus:outline-none"
                  >
                    <option value="QRIS">QRIS Instan</option>
                    <option value="BCA Transfer">BCA Transfer</option>
                    <option value="WA Direct">WA Direct Chat</option>
                  </select>
                </div>
              </div>

              {/* Auto Activate Checkbox */}
              <div className="p-3 rounded-xl bg-tile border border-line flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="autoActivate"
                  checked={autoActivate}
                  onChange={(e) => setAutoActivate(e.target.checked)}
                  className="mt-0.5 rounded border-line text-accent focus:ring-accent"
                />
                <label htmlFor="autoActivate" className="cursor-pointer">
                  <span className="font-bold text-paper block">Langsung Aktifkan Lisensi Digital</span>
                  <span className="text-[11px] text-muted">
                    Centang jika pembeli sudah transfer atau diorder internal. Jika tidak dicentang, lisensi berstatus Menunggu Aktivasi Superadmin.
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-muted mb-1">Catatan Tambahan (Opsional)</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Keterangan permintaan klien atau detail khusus"
                  className="w-full rounded-xl border border-line bg-tile px-3.5 py-2 text-paper focus:border-accent focus:outline-none"
                  rows={2}
                />
              </div>

              <div className="pt-3 border-t border-line flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-outline py-2 px-4 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary py-2 px-5 text-xs font-bold"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Pesanan & Buat Lisensi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

