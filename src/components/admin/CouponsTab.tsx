'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { 
  Tag, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Percent, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  X,
  Sparkles,
  RefreshCw,
  Clock
} from 'lucide-react';
import { Coupon } from '@/lib/coupons';

export const CouponsTab: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'nominal'>('percent');
  const [value, setValue] = useState(20);
  const [minAmount, setMinAmount] = useState<number | ''>('');
  const [maxUses, setMaxUses] = useState<number | ''>('');
  const [expiryDate, setExpiryDate] = useState('');

  const loadCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/coupons');
      const data = await res.json();
      setCoupons(data.coupons || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  const handleCopy = async (c: string) => {
    await navigator.clipboard.writeText(c);
    setCopiedCode(c);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...coupon,
          isActive: !coupon.isActive
        })
      });
      if (res.ok) loadCoupons();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (codeToDelete: string) => {
    if (!window.confirm(`Hapus kupon diskon ${codeToDelete}?`)) return;
    try {
      const res = await fetch(`/api/admin/coupons?code=${encodeURIComponent(codeToDelete)}`, {
        method: 'DELETE'
      });
      if (res.ok) loadCoupons();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !value) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          description,
          discountType,
          value: Number(value),
          minAmount: minAmount ? Number(minAmount) : undefined,
          maxUses: maxUses ? Number(maxUses) : undefined,
          expiryDate: expiryDate ? new Date(expiryDate).toISOString() : undefined,
          isActive: true
        })
      });
      if (res.ok) {
        setIsAddOpen(false);
        setCode('');
        setDescription('');
        setValue(20);
        setMinAmount('');
        setMaxUses('');
        setExpiryDate('');
        loadCoupons();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Metrics
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter(c => c.isActive).length;
  const totalUsed = coupons.reduce((acc, c) => acc + (c.usedCount || 0), 0);

  return (
    <div className="space-y-6 font-display">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-paper flex items-center gap-2">
            <Tag className="w-5 h-5 text-accent" />
            <span>Kupon &amp; Voucher Diskon Promo</span>
          </h3>
          <p className="text-xs text-muted">
            Kelola kode promo diskon yang bisa dimasukkan customer saat checkout lisensi atau jasa DFY.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="btn-primary py-2.5 px-4 text-xs font-bold inline-flex items-center gap-2 shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Kupon Baru</span>
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl border border-line bg-card shadow-md">
          <p className="font-mono text-[11px] uppercase text-dim">Total Kupon</p>
          <p className="text-2xl font-extrabold text-paper font-mono mt-1">{totalCoupons}</p>
          <p className="text-[11px] text-emerald-400 font-semibold">{activeCoupons} aktif dapat dipakai</p>
        </div>

        <div className="p-4 rounded-2xl border border-line bg-card shadow-md">
          <p className="font-mono text-[11px] uppercase text-dim">Total Pemakaian</p>
          <p className="text-2xl font-extrabold text-accent font-mono mt-1">{totalUsed}</p>
          <p className="text-[11px] text-muted">Oleh pembeli lisensi</p>
        </div>

        <div className="p-4 rounded-2xl border border-line bg-card shadow-md">
          <p className="font-mono text-[11px] uppercase text-dim">Efektivitas Promo</p>
          <p className="text-2xl font-extrabold text-cyan-400 font-mono mt-1">High Conversion</p>
          <p className="text-[11px] text-cyan-300">Mendorong closing penjualan</p>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="overflow-x-auto rounded-2xl border border-line bg-card shadow-xl">
        <table className="w-full min-w-[760px] text-left text-xs">
          <thead className="bg-tile border-b border-line font-mono text-[11px] uppercase tracking-wider text-dim">
            <tr>
              <th className="px-4 py-3">Kode Kupon</th>
              <th className="px-4 py-3">Diskon</th>
              <th className="px-4 py-3">Deskripsi</th>
              <th className="px-4 py-3">Pemakaian</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {coupons.map((c) => (
              <tr key={c.code} className="hover:bg-tile/40 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-accent bg-accent/15 border border-accent/30 px-2.5 py-1 rounded-lg text-xs">
                      {c.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(c.code)}
                      className="text-dim hover:text-paper"
                      title="Salin Kode Kupon"
                    >
                      {copiedCode === c.code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span className="font-extrabold text-paper text-sm">
                    {c.discountType === 'percent' ? `${c.value}%` : `Rp${c.value.toLocaleString('id-ID')}`}
                  </span>
                  {c.minAmount && (
                    <span className="block text-[10px] text-dim">
                      Min: Rp{c.minAmount.toLocaleString('id-ID')}
                    </span>
                  )}
                </td>

                <td className="px-4 py-3">
                  <p className="text-paper font-semibold">{c.description || '-'}</p>
                  {c.expiryDate && (
                    <p className="text-[10px] text-amber-400 font-mono flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      Exp: {new Date(c.expiryDate).toLocaleDateString('id-ID')}
                    </p>
                  )}
                </td>

                <td className="px-4 py-3 font-mono">
                  <span className="text-paper font-bold">{c.usedCount || 0}</span>
                  <span className="text-dim text-[11px]">{c.maxUses ? ` / ${c.maxUses} kuota` : ' (Tanpa batas)'}</span>
                </td>

                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(c)}
                    className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border ${
                      c.isActive
                        ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/60'
                        : 'border-line bg-tile text-muted hover:text-paper'
                    }`}
                  >
                    {c.isActive ? 'Aktif' : 'Nonaktif'}
                  </button>
                </td>

                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => handleDelete(c.code)}
                    className="p-1.5 rounded-lg border border-line bg-tile text-dim hover:text-red-400 hover:border-red-800 transition-colors"
                    title="Hapus Kupon"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}

            {coupons.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-dim text-xs">
                  Belum ada kupon promo dibuat. Klik tombol Buat Kupon Baru di atas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Buat Kupon Baru */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-[500px] rounded-3xl border-2 border-line bg-card p-6 shadow-2xl text-paper">
            <div className="flex items-center justify-between border-b border-line pb-4 mb-4">
              <h4 className="font-bold text-lg text-paper flex items-center gap-2">
                <Tag className="w-5 h-5 text-accent" />
                <span>Buat Kupon Diskon Baru</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="rounded-lg p-1.5 text-dim hover:text-paper"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-muted mb-1 font-semibold">Kode Kupon (Huruf Kapital) *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Contoh: FLASH50, RAMADHAN100K"
                  className="w-full rounded-xl border border-line bg-tile px-3.5 py-2 font-mono uppercase text-paper focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-muted mb-1 font-semibold">Deskripsi / Keterangan Promosi</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Contoh: Diskon spesial peluncuran versi Remotion 4.0"
                  className="w-full rounded-xl border border-line bg-tile px-3.5 py-2 text-paper focus:border-accent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted mb-1 font-semibold">Tipe Diskon *</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full rounded-xl border border-line bg-tile px-3.5 py-2 text-paper focus:border-accent focus:outline-none"
                  >
                    <option value="percent">Persentase (%)</option>
                    <option value="nominal">Nominal Tunai (Rp)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-muted mb-1 font-semibold">
                    {discountType === 'percent' ? 'Besar Diskon (%)' : 'Potongan (Rp)'} *
                  </label>
                  <input
                    type="number"
                    required
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    min={1}
                    className="w-full rounded-xl border border-line bg-tile px-3.5 py-2 text-paper focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted mb-1 font-semibold">Minimal Belanja (Rp, opsional)</label>
                  <input
                    type="number"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value ? Number(e.target.value) : '')}
                    placeholder="Contoh: 200000"
                    className="w-full rounded-xl border border-line bg-tile px-3.5 py-2 text-paper focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-muted mb-1 font-semibold">Batas Kuota Pemakaian (opsional)</label>
                  <input
                    type="number"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value ? Number(e.target.value) : '')}
                    placeholder="Kosongkan jika tak terbatas"
                    className="w-full rounded-xl border border-line bg-tile px-3.5 py-2 text-paper focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted mb-1 font-semibold">Tanggal Kedaluwarsa (opsional)</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full rounded-xl border border-line bg-tile px-3.5 py-2 text-paper focus:border-accent focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-line flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="btn-outline py-2 px-4 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary py-2 px-5 text-xs font-bold"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Kupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
