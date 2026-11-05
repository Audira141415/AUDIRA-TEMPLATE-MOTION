'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  MessageCircle, 
  CreditCard, 
  Sparkles, 
  Tag, 
  DollarSign, 
  Check, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { SiteConfig } from '@/lib/site-config';

export const SiteSettingsTab: React.FC = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/site-config');
      const data = await res.json();
      if (res.ok && data.config) {
        setConfig(data.config);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch('/api/admin/site-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      const data = await res.json();
      if (res.ok) {
        setToast({ tone: 'ok', text: 'Pengaturan website berhasil disimpan dan diperbarui!' });
      } else {
        setToast({ tone: 'error', text: data.error || 'Gagal menyimpan pengaturan.' });
      }
    } catch {
      setToast({ tone: 'error', text: 'Terjadi kesalahan koneksi ke server.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !config) {
    return (
      <div className="p-12 text-center text-muted text-xs">
        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-accent" />
        <span>Memuat pengaturan website...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header with Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h3 className="text-xl font-bold text-paper">Pengaturan Website &amp; Konfigurasi Harga</h3>
          <p className="text-xs text-muted">
            Ubah nomor WhatsApp, rekening BCA, harga paket lisensi, dan banner promosi tanpa mengedit source code.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-primary py-2.5 px-5 text-xs font-bold inline-flex items-center gap-2 shadow-md shrink-0 active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Menyimpan...' : 'Simpan Semua Perubahan'}</span>
        </button>
      </div>

      {toast && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
            toast.tone === 'ok'
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
              : 'bg-red-950/40 border-red-800 text-red-300'
          }`}
        >
          {toast.tone === 'ok' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Grid Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Contact & Payment Info Card */}
        <div className="rounded-2xl border border-line bg-card p-5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-line pb-3">
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <h4 className="font-bold text-sm text-paper">Kontak CS &amp; Rekening Pembayaran</h4>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-muted mb-1">Nomor WhatsApp Resmi (CS Mas Agus)</label>
              <input
                type="text"
                value={config.whatsappNumber}
                onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                placeholder="6285709666240"
                className="w-full rounded-xl border border-line bg-tile px-3.5 py-2 text-paper focus:border-accent focus:outline-none font-mono"
              />
              <span className="text-[10px] text-dim">*Gunakan awalan 62 tanpa tanda + atau spasi.</span>
            </div>

            <div>
              <label className="block text-muted mb-1">Nama Pemilik / Atas Nama Rekening</label>
              <input
                type="text"
                value={config.ownerName}
                onChange={(e) => setConfig({ ...config, ownerName: e.target.value })}
                placeholder="Agus Dwi Rianto"
                className="w-full rounded-xl border border-line bg-tile px-3.5 py-2 text-paper focus:border-accent focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-muted mb-1">Nomor Rekening BCA</label>
                <input
                  type="text"
                  value={config.bcaAccountNumber}
                  onChange={(e) => setConfig({ ...config, bcaAccountNumber: e.target.value })}
                  placeholder="8691888291"
                  className="w-full rounded-xl border border-line bg-tile px-3.5 py-2 text-paper focus:border-accent focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-muted mb-1">Nama Rekening BCA</label>
                <input
                  type="text"
                  value={config.bcaAccountName}
                  onChange={(e) => setConfig({ ...config, bcaAccountName: e.target.value })}
                  placeholder="Agus Dwi Rianto"
                  className="w-full rounded-xl border border-line bg-tile px-3.5 py-2 text-paper focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Promo Banner Card */}
        <div className="rounded-2xl border border-line bg-card p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <h4 className="font-bold text-sm text-paper">Banner Pengumuman &amp; Promo</h4>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <span className="text-dim">Status Banner:</span>
              <input
                type="checkbox"
                checked={config.promoBanner.enabled}
                onChange={(e) => setConfig({
                  ...config,
                  promoBanner: { ...config.promoBanner, enabled: e.target.checked }
                })}
                className="size-4 rounded border-line bg-ink text-accent focus:ring-accent accent-[#ff6a2a]"
              />
              <span className={config.promoBanner.enabled ? 'text-emerald-400 font-bold' : 'text-dim'}>
                {config.promoBanner.enabled ? 'Aktif' : 'Nonaktif'}
              </span>
            </label>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-muted mb-1">Badge Teks Promo</label>
              <input
                type="text"
                value={config.promoBanner.badge}
                onChange={(e) => setConfig({
                  ...config,
                  promoBanner: { ...config.promoBanner, badge: e.target.value }
                })}
                placeholder="PROMO SPESIAL MARET 2026"
                className="w-full rounded-xl border border-line bg-tile px-3.5 py-2 text-paper focus:border-accent focus:outline-none font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-muted mb-1">Pesan Pengumuman Promo</label>
              <textarea
                value={config.promoBanner.text}
                onChange={(e) => setConfig({
                  ...config,
                  promoBanner: { ...config.promoBanner, text: e.target.value }
                })}
                rows={2}
                placeholder="Gratis Bundling AUDIRA Skill Mesh (MCP Server)..."
                className="w-full rounded-xl border border-line bg-tile px-3.5 py-2 text-paper focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-muted mb-1">Link Tujuan Banner</label>
              <input
                type="text"
                value={config.promoBanner.link}
                onChange={(e) => setConfig({
                  ...config,
                  promoBanner: { ...config.promoBanner, link: e.target.value }
                })}
                placeholder="#produk atau /panduan"
                className="w-full rounded-xl border border-line bg-tile px-3.5 py-2 text-paper focus:border-accent focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Pricing Matrix Management Card */}
      <div className="rounded-2xl border border-line bg-card p-5 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 border-b border-line pb-3">
          <DollarSign className="w-4 h-4 text-accent" />
          <h4 className="font-bold text-sm text-paper">Konfigurasi Harga Paket Lisensi &amp; Jasa Terima Beres</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          {/* Kolom Paket Lisensi Komersial */}
          <div className="space-y-3.5">
            <span className="font-mono text-[11px] font-bold text-accent uppercase block border-b border-line-soft pb-1.5">
              1. PAKET LISENSI SOURCE CODE
            </span>

            {/* Starter */}
            <div className="p-3 rounded-xl bg-tile border border-line space-y-2">
              <span className="font-bold text-paper block">Starter 3D Pack (5 Gaya)</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-dim block mb-0.5">Harga Diskon (Rp)</span>
                  <input
                    type="text"
                    value={config.pricing.starter}
                    onChange={(e) => setConfig({
                      ...config,
                      pricing: { ...config.pricing, starter: e.target.value }
                    })}
                    className="w-full rounded-lg border border-line bg-ink px-2.5 py-1.5 text-accent font-bold font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-dim block mb-0.5">Harga Coret (Rp)</span>
                  <input
                    type="text"
                    value={config.pricing.starterOriginal}
                    onChange={(e) => setConfig({
                      ...config,
                      pricing: { ...config.pricing, starterOriginal: e.target.value }
                    })}
                    className="w-full rounded-lg border border-line bg-ink px-2.5 py-1.5 text-dim line-through font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Master */}
            <div className="p-3 rounded-xl bg-tile border border-line space-y-2">
              <span className="font-bold text-cyan-300 block">Master Director Pack (29 Gaya)</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-dim block mb-0.5">Harga Diskon (Rp)</span>
                  <input
                    type="text"
                    value={config.pricing.master}
                    onChange={(e) => setConfig({
                      ...config,
                      pricing: { ...config.pricing, master: e.target.value }
                    })}
                    className="w-full rounded-lg border border-line bg-ink px-2.5 py-1.5 text-cyan-400 font-bold font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-dim block mb-0.5">Harga Coret (Rp)</span>
                  <input
                    type="text"
                    value={config.pricing.masterOriginal}
                    onChange={(e) => setConfig({
                      ...config,
                      pricing: { ...config.pricing, masterOriginal: e.target.value }
                    })}
                    className="w-full rounded-lg border border-line bg-ink px-2.5 py-1.5 text-dim line-through font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Lab */}
            <div className="p-3 rounded-xl bg-tile border border-line space-y-2">
              <span className="font-bold text-amber-300 block">Creator Lab Ultimate (Full Suite)</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-dim block mb-0.5">Harga Diskon (Rp)</span>
                  <input
                    type="text"
                    value={config.pricing.lab}
                    onChange={(e) => setConfig({
                      ...config,
                      pricing: { ...config.pricing, lab: e.target.value }
                    })}
                    className="w-full rounded-lg border border-line bg-ink px-2.5 py-1.5 text-amber-400 font-bold font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-dim block mb-0.5">Harga Coret (Rp)</span>
                  <input
                    type="text"
                    value={config.pricing.labOriginal}
                    onChange={(e) => setConfig({
                      ...config,
                      pricing: { ...config.pricing, labOriginal: e.target.value }
                    })}
                    className="w-full rounded-lg border border-line bg-ink px-2.5 py-1.5 text-dim line-through font-mono"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Kolom Jasa Terima Beres (DFY) */}
          <div className="space-y-3.5">
            <span className="font-mono text-[11px] font-bold text-emerald-400 uppercase block border-b border-line-soft pb-1.5">
              2. JASA TERIMA BERES (DFY AGENCY)
            </span>

            {/* DFY Single */}
            <div className="p-3 rounded-xl bg-tile border border-line space-y-2">
              <span className="font-bold text-paper block">Paket Satuan (1 Video 24 Jam)</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-dim block mb-0.5">Harga Diskon (Rp)</span>
                  <input
                    type="text"
                    value={config.pricing.dfySingle}
                    onChange={(e) => setConfig({
                      ...config,
                      pricing: { ...config.pricing, dfySingle: e.target.value }
                    })}
                    className="w-full rounded-lg border border-line bg-ink px-2.5 py-1.5 text-emerald-400 font-bold font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-dim block mb-0.5">Harga Coret (Rp)</span>
                  <input
                    type="text"
                    value={config.pricing.dfySingleOriginal}
                    onChange={(e) => setConfig({
                      ...config,
                      pricing: { ...config.pricing, dfySingleOriginal: e.target.value }
                    })}
                    className="w-full rounded-lg border border-line bg-ink px-2.5 py-1.5 text-dim line-through font-mono"
                  />
                </div>
              </div>
            </div>

            {/* DFY 5 Videos */}
            <div className="p-3 rounded-xl bg-tile border border-line space-y-2">
              <span className="font-bold text-paper block">Paket 5 Video Reels (Paling Laris)</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-dim block mb-0.5">Harga Diskon (Rp)</span>
                  <input
                    type="text"
                    value={config.pricing.dfyBundle}
                    onChange={(e) => setConfig({
                      ...config,
                      pricing: { ...config.pricing, dfyBundle: e.target.value }
                    })}
                    className="w-full rounded-lg border border-line bg-ink px-2.5 py-1.5 text-emerald-400 font-bold font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-dim block mb-0.5">Harga Coret (Rp)</span>
                  <input
                    type="text"
                    value={config.pricing.dfyBundleOriginal}
                    onChange={(e) => setConfig({
                      ...config,
                      pricing: { ...config.pricing, dfyBundleOriginal: e.target.value }
                    })}
                    className="w-full rounded-lg border border-line bg-ink px-2.5 py-1.5 text-dim line-through font-mono"
                  />
                </div>
              </div>
            </div>

            {/* DFY Monthly Retainer */}
            <div className="p-3 rounded-xl bg-tile border border-line space-y-2">
              <span className="font-bold text-purple-300 block">Monthly Retainer (15 Video / Bulan)</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-dim block mb-0.5">Harga Diskon (Rp)</span>
                  <input
                    type="text"
                    value={config.pricing.dfyRetainer}
                    onChange={(e) => setConfig({
                      ...config,
                      pricing: { ...config.pricing, dfyRetainer: e.target.value }
                    })}
                    className="w-full rounded-lg border border-line bg-ink px-2.5 py-1.5 text-purple-400 font-bold font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-dim block mb-0.5">Harga Coret (Rp)</span>
                  <input
                    type="text"
                    value={config.pricing.dfyRetainerOriginal}
                    onChange={(e) => setConfig({
                      ...config,
                      pricing: { ...config.pricing, dfyRetainerOriginal: e.target.value }
                    })}
                    className="w-full rounded-lg border border-line bg-ink px-2.5 py-1.5 text-dim line-through font-mono"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </form>
  );
};
