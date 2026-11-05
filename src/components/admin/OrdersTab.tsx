'use client';

import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import { OrderRecord, OrderStatus } from '@/lib/orders';

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

  // Form states for creating manual order
  const [newName, setNewName] = useState('');
  const [newWA, setNewWA] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newTier, setNewTier] = useState('lab');
  const [newTierName, setNewTierName] = useState('Creator Lab Ultimate');
  const [newAmount, setNewAmount] = useState('Rp499.000');
  const [newPayment, setNewPayment] = useState('QRIS');
  const [newNotes, setNewNotes] = useState('');

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(id);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (e) {
      console.error(e);
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
          status: 'verified',
          notes: newNotes
        })
      });
      if (res.ok) {
        setIsAddModalOpen(false);
        setNewName('');
        setNewWA('');
        setNewEmail('');
        setNewNotes('');
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

    const message = `Halo Kak ${order.customerName},\n\n` +
      `Terima kasih telah memesan lisensi resmi AUDIRA Motion!\n` +
      `Berikut adalah rincian aktivasi digital Anda:\n\n` +
      `📦 Paket: *${order.tierName}*\n` +
      `🔑 Kode Lisensi Resmi: *${order.licenseKey}*\n` +
      `💰 Total: *${order.amount}* (${order.paymentMethod})\n\n` +
      `📁 Link Download File ZIP Engine 3D:\n` +
      `https://github.com/Audira141415/AUDIRA-TEMPLATE-MOTION/archive/refs/heads/master.zip\n\n` +
      `📖 Buku Panduan Instalasi & Aktivasi MCP Mesh:\n` +
      `http://localhost:3788/panduan\n\n` +
      `Jika ada kendala instalasi di komputer Anda, silakan reply pesan ini. Tim Mas Agus siap mendampingi 1-on-1 sampai video pertama Anda berhasil dirender!`;

    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    // Automatically mark as sent
    if (order.status === 'verified') {
      handleUpdateStatus(order.id, 'sent');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
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
          <h3 className="text-xl font-bold text-paper">Manajemen Pesanan &amp; Lisensi Pembeli</h3>
          <p className="text-xs text-muted">
            Kelola transaksi masuk, generate lisensi resmi, dan kirim link download ZIP + panduan via WhatsApp.
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

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-line bg-card">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'verified', label: 'Lunas' },
            { id: 'sent', label: 'Terkirim' },
            { id: 'pending', label: 'Pending' },
            { id: 'completed', label: 'Selesai' },
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
        <table className="w-full min-w-[840px] text-left text-xs">
          <thead className="bg-tile border-b border-line font-mono text-[11px] uppercase tracking-wider text-dim">
            <tr>
              <th className="px-4 py-3">ID &amp; Tanggal</th>
              <th className="px-4 py-3">Pelanggan</th>
              <th className="px-4 py-3">Paket &amp; Nilai</th>
              <th className="px-4 py-3">Kode Lisensi</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aksi &amp; WhatsApp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {filteredOrders.map((order) => {
              const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
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
                      <span className="text-cyan-400 font-bold bg-cyan-950/60 border border-cyan-800/80 px-2 py-0.5 rounded">
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
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleSendWhatsAppAccess(order)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 font-bold text-emerald-300 hover:bg-emerald-500 hover:text-black transition-all"
                        title="Buka WhatsApp & Kirim Akses"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Kirim WA</span>
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
                <td colSpan={6} className="px-4 py-8 text-center text-dim text-xs">
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
