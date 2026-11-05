'use client';

import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Sparkles, 
  DollarSign, 
  Video, 
  MessageSquare, 
  HelpCircle, 
  Megaphone, 
  Eye, 
  EyeOff, 
  Save, 
  RefreshCw, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Check, 
  AlertCircle, 
  Download, 
  RotateCcw,
  Star,
  Zap,
  Clock,
  Layers,
  Phone,
  CreditCard,
  Sliders
} from 'lucide-react';
import { LandingConfig, TestimonialItem, FaqItem, DEFAULT_LANDING_CONFIG } from '@/types/landing';

type SubTab = 'hero' | 'pricing' | 'dfy' | 'testimonials' | 'faq' | 'contact' | 'visibility';

export const LandingPageManagerTab: React.FC = () => {
  const [config, setConfig] = useState<LandingConfig | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/landing-config');
      const data = await res.json();
      if (res.ok && data.config) {
        setConfig(data.config);
      }
    } catch (e) {
      console.error('Error fetching landing config:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!config) return;
    setSaving(true);
    setToast(null);

    try {
      const res = await fetch('/api/admin/landing-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      const data = await res.json();
      if (res.ok) {
        setToast({ tone: 'ok', text: data.message || 'Perubahan landing page berhasil disimpan dan langsung aktif!' });
      } else {
        setToast({ tone: 'error', text: data.error || 'Gagal menyimpan perubahan.' });
      }
    } catch {
      setToast({ tone: 'error', text: 'Koneksi ke server gagal. Coba lagi.' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset seluruh konten landing page ke pengaturan default pabrik AUDIRA? Semua perubahan teks kustom akan dikembalikan.')) {
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/landing-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' })
      });
      const data = await res.json();
      if (res.ok && data.config) {
        setConfig(data.config);
        setToast({ tone: 'ok', text: 'Landing page berhasil direset ke pengaturan default!' });
      }
    } catch {
      setToast({ tone: 'error', text: 'Gagal mereset ke default.' });
    } finally {
      setSaving(false);
    }
  };

  const handleExportJson = () => {
    if (!config) return;
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audira-landing-config-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Testimonial helpers
  const handleAddTestimonial = () => {
    if (!config) return;
    const newItem: TestimonialItem = {
      id: `testi-${Date.now()}`,
      name: 'Nama Klien Baru',
      role: 'Content Creator / Agency, Kota',
      avatarText: 'NK',
      metric: '10x Faster',
      metricLabel: 'Hasil nyata',
      kitUsed: 'BUILDFORGE & PRECISION',
      quote: 'Tuliskan kutipan pengalaman puas klien di sini.'
    };
    setConfig({
      ...config,
      testimonials: [...config.testimonials, newItem]
    });
  };

  const handleRemoveTestimonial = (id: string) => {
    if (!config) return;
    setConfig({
      ...config,
      testimonials: config.testimonials.filter(t => t.id !== id)
    });
  };

  // FAQ helpers
  const handleAddFaq = () => {
    if (!config) return;
    const newFaq: FaqItem = {
      id: `faq-${Date.now()}`,
      question: 'Pertanyaan baru seputar AUDIRA Motion?',
      answer: 'Jawaban detail dan solutif untuk pertanyaan calon pembeli lisensi.'
    };
    setConfig({
      ...config,
      faqs: [...config.faqs, newFaq]
    });
  };

  const handleRemoveFaq = (id: string) => {
    if (!config) return;
    setConfig({
      ...config,
      faqs: config.faqs.filter(f => f.id !== id)
    });
  };

  if (loading || !config) {
    return (
      <div className="p-16 text-center text-muted text-xs">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-accent" />
        <span className="font-bold text-paper">Memuat konfigurasi CMS Landing Page...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-display">
      {/* Top Banner Control & Save Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl border border-line bg-card shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="flex size-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold">
              AUDIRA LANDING PAGE CMS
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-paper">
            Pusat Kendali Landing Page &amp; Tampilan Publik
          </h3>
          <p className="text-xs text-muted">
            Kelola teks hero, paket harga, jasa terima beres, testimoni pembeli, FAQ, hingga saklar visibilitas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline py-2.5 px-3.5 text-xs font-semibold inline-flex items-center gap-1.5"
            title="Buka Landing Page di Tab Baru"
          >
            <span>Buka Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-dim" />
          </a>

          <button
            type="button"
            onClick={handleExportJson}
            className="px-3 py-2.5 rounded-xl border border-line bg-tile text-xs font-semibold text-muted hover:text-paper hover:border-line-strong transition-colors inline-flex items-center gap-1.5"
            title="Download Backup JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Backup</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={saving}
            className="px-3 py-2.5 rounded-xl border border-red-950/80 bg-red-950/30 text-xs font-semibold text-red-300 hover:bg-red-950/60 transition-colors inline-flex items-center gap-1.5"
            title="Reset ke Default Pabrik"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="btn-primary py-2.5 px-5 text-xs font-black inline-flex items-center gap-2 shadow-lg shadow-orange-950/50 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>
      </div>

      {toast && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between gap-2 shadow-lg ${
            toast.tone === 'ok'
              ? 'bg-emerald-950/50 border-emerald-800 text-emerald-300'
              : 'bg-red-950/50 border-red-800 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.tone === 'ok' ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
            <span>{toast.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-dim hover:text-paper text-xs"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-ink p-1.5 rounded-2xl border border-line text-xs font-bold">
        {[
          { id: 'hero' as const, label: 'Hero & Headline', icon: <Sparkles className="w-3.5 h-3.5" /> },
          { id: 'pricing' as const, label: 'Paket Lisensi 3D', icon: <DollarSign className="w-3.5 h-3.5" /> },
          { id: 'dfy' as const, label: 'Jasa Terima Beres (DFY)', icon: <Video className="w-3.5 h-3.5" /> },
          { id: 'testimonials' as const, label: 'Testimoni & Review', icon: <Star className="w-3.5 h-3.5" /> },
          { id: 'faq' as const, label: 'FAQ Accordion', icon: <HelpCircle className="w-3.5 h-3.5" /> },
          { id: 'contact' as const, label: 'Kontak & Banner Promo', icon: <Megaphone className="w-3.5 h-3.5" /> },
          { id: 'visibility' as const, label: 'Visibilitas Section', icon: <Sliders className="w-3.5 h-3.5" /> },
        ].map((st) => (
          <button
            key={st.id}
            type="button"
            onClick={() => setActiveSubTab(st.id)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeSubTab === st.id
                ? 'bg-accent text-ink shadow-md font-black'
                : 'text-muted hover:text-paper hover:bg-tile'
            }`}
          >
            {st.icon}
            <span>{st.label}</span>
          </button>
        ))}
      </div>

      {/* SUB-TAB 1: HERO & HEADLINE */}
      {activeSubTab === 'hero' && (
        <div className="rounded-3xl border border-line bg-card p-6 sm:p-7 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div>
              <h4 className="font-bold text-base text-paper flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Pengaturan Bagian Atas (Hero Section)</span>
              </h4>
              <p className="text-xs text-muted">
                Atur headline utama, kalimat pemanis, tombol aksi utama, dan kotak generator ide.
              </p>
            </div>
            
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <span className="text-dim">Generator Ide Cepat:</span>
              <input
                type="checkbox"
                checked={config.hero.showIdeaForm}
                onChange={(e) => setConfig({
                  ...config,
                  hero: { ...config.hero, showIdeaForm: e.target.checked }
                })}
                className="size-4 rounded border-line bg-ink text-accent accent-[#ff6a2a]"
              />
              <span className={config.hero.showIdeaForm ? 'text-emerald-400 font-bold' : 'text-dim'}>
                {config.hero.showIdeaForm ? 'Aktif' : 'Sembunyikan'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="space-y-4">
              <div>
                <label className="block text-muted mb-1 font-semibold">Badge Teks Atas</label>
                <input
                  type="text"
                  value={config.hero.badge}
                  onChange={(e) => setConfig({
                    ...config,
                    hero: { ...config.hero, badge: e.target.value }
                  })}
                  className="w-full rounded-xl border border-line bg-tile px-3.5 py-2.5 text-paper font-mono focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-muted mb-1 font-semibold">Headline Baris 1 (Teks Putih)</label>
                <input
                  type="text"
                  value={config.hero.titleLine1}
                  onChange={(e) => setConfig({
                    ...config,
                    hero: { ...config.hero, titleLine1: e.target.value }
                  })}
                  className="w-full rounded-xl border border-line bg-tile px-3.5 py-2.5 text-paper font-bold focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-muted mb-1 font-semibold">Headline Sorotan (Teks Oranye)</label>
                <input
                  type="text"
                  value={config.hero.titleHighlight}
                  onChange={(e) => setConfig({
                    ...config,
                    hero: { ...config.hero, titleHighlight: e.target.value }
                  })}
                  className="w-full rounded-xl border border-line bg-tile px-3.5 py-2.5 text-accent font-bold focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-muted mb-1 font-semibold">Deskripsi Paragraf Pendukung</label>
                <textarea
                  rows={4}
                  value={config.hero.description}
                  onChange={(e) => setConfig({
                    ...config,
                    hero: { ...config.hero, description: e.target.value }
                  })}
                  className="w-full rounded-xl border border-line bg-tile px-3.5 py-2.5 text-paper leading-relaxed focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted mb-1 font-semibold">Teks Tombol Utama</label>
                  <input
                    type="text"
                    value={config.hero.primaryCtaText}
                    onChange={(e) => setConfig({
                      ...config,
                      hero: { ...config.hero, primaryCtaText: e.target.value }
                    })}
                    className="w-full rounded-xl border border-line bg-tile px-3 py-2 text-paper focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-muted mb-1 font-semibold">Link Tombol Utama</label>
                  <input
                    type="text"
                    value={config.hero.primaryCtaLink}
                    onChange={(e) => setConfig({
                      ...config,
                      hero: { ...config.hero, primaryCtaLink: e.target.value }
                    })}
                    className="w-full rounded-xl border border-line bg-tile px-3 py-2 text-paper font-mono focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted mb-1 font-semibold">Teks Tombol Kedua</label>
                  <input
                    type="text"
                    value={config.hero.secondaryCtaText}
                    onChange={(e) => setConfig({
                      ...config,
                      hero: { ...config.hero, secondaryCtaText: e.target.value }
                    })}
                    className="w-full rounded-xl border border-line bg-tile px-3 py-2 text-paper focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-muted mb-1 font-semibold">Link Tombol Kedua</label>
                  <input
                    type="text"
                    value={config.hero.secondaryCtaLink}
                    onChange={(e) => setConfig({
                      ...config,
                      hero: { ...config.hero, secondaryCtaLink: e.target.value }
                    })}
                    className="w-full rounded-xl border border-line bg-tile px-3 py-2 text-paper font-mono focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted mb-1 font-semibold">3 Badge Trust Bawah Hero (Pills)</label>
                <div className="space-y-2">
                  {config.hero.statPills.map((pill, pIdx) => (
                    <input
                      key={pIdx}
                      type="text"
                      value={pill}
                      onChange={(e) => {
                        const newPills = [...config.hero.statPills];
                        newPills[pIdx] = e.target.value;
                        setConfig({
                          ...config,
                          hero: { ...config.hero, statPills: newPills }
                        });
                      }}
                      className="w-full rounded-xl border border-line bg-tile px-3 py-2 text-paper font-mono text-[11px] focus:border-accent focus:outline-none"
                    />
                  ))}
                </div>
              </div>

              {/* Preview Box */}
              <div className="p-4 rounded-2xl bg-ink border border-line-soft">
                <span className="font-mono text-[10px] text-accent uppercase font-bold block mb-1">
                  Preview Headline:
                </span>
                <p className="text-sm font-bold text-white leading-snug">
                  {config.hero.titleLine1}{' '}
                  <span className="text-accent">{config.hero.titleHighlight}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PRICING TIERS (SOURCE CODE) */}
      {activeSubTab === 'pricing' && (
        <div className="rounded-3xl border border-line bg-card p-6 sm:p-7 space-y-6 shadow-xl">
          <div className="border-b border-line pb-4">
            <h4 className="font-bold text-base text-paper flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-accent" />
              <span>Manajemen Harga Lisensi Source Code (#produk)</span>
            </h4>
            <p className="text-xs text-muted">
              Ubah harga diskon, harga coret, nama paket, dan badge untuk 3 tingkatan lisensi komersial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            {/* 1. Starter */}
            <div className="p-4 rounded-2xl bg-tile border border-line space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-dim uppercase">Tier 1</span>
                <span className="text-[10px] text-accent font-bold">{config.pricingTiers.starter.badge}</span>
              </div>
              <div>
                <label className="block text-muted mb-1 font-semibold">Nama Paket</label>
                <input
                  type="text"
                  value={config.pricingTiers.starter.name}
                  onChange={(e) => setConfig({
                    ...config,
                    pricingTiers: {
                      ...config.pricingTiers,
                      starter: { ...config.pricingTiers.starter, name: e.target.value }
                    }
                  })}
                  className="w-full rounded-xl border border-line bg-ink px-3 py-1.5 text-paper font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-muted mb-1 text-[10px]">Harga (Rp)</label>
                  <input
                    type="text"
                    value={config.pricingTiers.starter.price}
                    onChange={(e) => setConfig({
                      ...config,
                      pricingTiers: {
                        ...config.pricingTiers,
                        starter: { ...config.pricingTiers.starter, price: e.target.value }
                      }
                    })}
                    className="w-full rounded-xl border border-line bg-ink px-2.5 py-1.5 text-accent font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-muted mb-1 text-[10px]">Harga Coret</label>
                  <input
                    type="text"
                    value={config.pricingTiers.starter.originalPrice}
                    onChange={(e) => setConfig({
                      ...config,
                      pricingTiers: {
                        ...config.pricingTiers,
                        starter: { ...config.pricingTiers.starter, originalPrice: e.target.value }
                      }
                    })}
                    className="w-full rounded-xl border border-line bg-ink px-2.5 py-1.5 text-dim line-through font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-muted mb-1 font-semibold">Tagline / Deskripsi Singkat</label>
                <input
                  type="text"
                  value={config.pricingTiers.starter.tagline}
                  onChange={(e) => setConfig({
                    ...config,
                    pricingTiers: {
                      ...config.pricingTiers,
                      starter: { ...config.pricingTiers.starter, tagline: e.target.value }
                    }
                  })}
                  className="w-full rounded-xl border border-line bg-ink px-3 py-1.5 text-paper text-[11px]"
                />
              </div>
            </div>

            {/* 2. Master */}
            <div className="p-4 rounded-2xl bg-tile border border-cyan-800/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-cyan-400 uppercase">Tier 2</span>
                <span className="text-[10px] text-cyan-400 font-bold">{config.pricingTiers.master.badge}</span>
              </div>
              <div>
                <label className="block text-muted mb-1 font-semibold">Nama Paket</label>
                <input
                  type="text"
                  value={config.pricingTiers.master.name}
                  onChange={(e) => setConfig({
                    ...config,
                    pricingTiers: {
                      ...config.pricingTiers,
                      master: { ...config.pricingTiers.master, name: e.target.value }
                    }
                  })}
                  className="w-full rounded-xl border border-line bg-ink px-3 py-1.5 text-cyan-300 font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-muted mb-1 text-[10px]">Harga (Rp)</label>
                  <input
                    type="text"
                    value={config.pricingTiers.master.price}
                    onChange={(e) => setConfig({
                      ...config,
                      pricingTiers: {
                        ...config.pricingTiers,
                        master: { ...config.pricingTiers.master, price: e.target.value }
                      }
                    })}
                    className="w-full rounded-xl border border-line bg-ink px-2.5 py-1.5 text-cyan-400 font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-muted mb-1 text-[10px]">Harga Coret</label>
                  <input
                    type="text"
                    value={config.pricingTiers.master.originalPrice}
                    onChange={(e) => setConfig({
                      ...config,
                      pricingTiers: {
                        ...config.pricingTiers,
                        master: { ...config.pricingTiers.master, originalPrice: e.target.value }
                      }
                    })}
                    className="w-full rounded-xl border border-line bg-ink px-2.5 py-1.5 text-dim line-through font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-muted mb-1 font-semibold">Tagline / Deskripsi Singkat</label>
                <input
                  type="text"
                  value={config.pricingTiers.master.tagline}
                  onChange={(e) => setConfig({
                    ...config,
                    pricingTiers: {
                      ...config.pricingTiers,
                      master: { ...config.pricingTiers.master, tagline: e.target.value }
                    }
                  })}
                  className="w-full rounded-xl border border-line bg-ink px-3 py-1.5 text-paper text-[11px]"
                />
              </div>
            </div>

            {/* 3. Creator Lab */}
            <div className="p-4 rounded-2xl bg-tile border border-accent/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-accent uppercase">Tier 3 (Ultimate)</span>
                <span className="text-[10px] text-accent font-bold">{config.pricingTiers.lab.badge}</span>
              </div>
              <div>
                <label className="block text-muted mb-1 font-semibold">Nama Paket</label>
                <input
                  type="text"
                  value={config.pricingTiers.lab.name}
                  onChange={(e) => setConfig({
                    ...config,
                    pricingTiers: {
                      ...config.pricingTiers,
                      lab: { ...config.pricingTiers.lab, name: e.target.value }
                    }
                  })}
                  className="w-full rounded-xl border border-line bg-ink px-3 py-1.5 text-accent font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-muted mb-1 text-[10px]">Harga (Rp)</label>
                  <input
                    type="text"
                    value={config.pricingTiers.lab.price}
                    onChange={(e) => setConfig({
                      ...config,
                      pricingTiers: {
                        ...config.pricingTiers,
                        lab: { ...config.pricingTiers.lab, price: e.target.value }
                      }
                    })}
                    className="w-full rounded-xl border border-line bg-ink px-2.5 py-1.5 text-accent font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-muted mb-1 text-[10px]">Harga Coret</label>
                  <input
                    type="text"
                    value={config.pricingTiers.lab.originalPrice}
                    onChange={(e) => setConfig({
                      ...config,
                      pricingTiers: {
                        ...config.pricingTiers,
                        lab: { ...config.pricingTiers.lab, originalPrice: e.target.value }
                      }
                    })}
                    className="w-full rounded-xl border border-line bg-ink px-2.5 py-1.5 text-dim line-through font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-muted mb-1 font-semibold">Tagline / Deskripsi Singkat</label>
                <input
                  type="text"
                  value={config.pricingTiers.lab.tagline}
                  onChange={(e) => setConfig({
                    ...config,
                    pricingTiers: {
                      ...config.pricingTiers,
                      lab: { ...config.pricingTiers.lab, tagline: e.target.value }
                    }
                  })}
                  className="w-full rounded-xl border border-line bg-ink px-3 py-1.5 text-paper text-[11px]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: JASA TERIMA BERES (DFY) */}
      {activeSubTab === 'dfy' && (
        <div className="rounded-3xl border border-line bg-card p-6 sm:p-7 space-y-6 shadow-xl">
          <div className="border-b border-line pb-4">
            <h4 className="font-bold text-base text-paper flex items-center gap-2">
              <Video className="w-4 h-4 text-emerald-400" />
              <span>Manajemen Jasa Terima Beres (#jasa)</span>
            </h4>
            <p className="text-xs text-muted">
              Sesuaikan harga, teks tombol, SLA, dan keterangan hemat untuk 3 kartu penawaran DFY Agency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            {/* Single */}
            <div className="p-4 rounded-2xl bg-tile border border-line space-y-3">
              <span className="font-mono text-[10px] text-accent uppercase font-bold block">1. Paket Satuan</span>
              <div>
                <label className="block text-muted mb-1 font-semibold">Harga Jual</label>
                <input
                  type="text"
                  value={config.dfyPlans.single.price}
                  onChange={(e) => setConfig({
                    ...config,
                    dfyPlans: {
                      ...config.dfyPlans,
                      single: { ...config.dfyPlans.single, price: e.target.value }
                    }
                  })}
                  className="w-full rounded-xl border border-line bg-ink px-3 py-1.5 text-emerald-400 font-bold font-mono"
                />
              </div>
              <div>
                <label className="block text-muted mb-1 font-semibold">SLA Pengerjaan</label>
                <input
                  type="text"
                  value={config.dfyPlans.single.slaText}
                  onChange={(e) => setConfig({
                    ...config,
                    dfyPlans: {
                      ...config.dfyPlans,
                      single: { ...config.dfyPlans.single, slaText: e.target.value }
                    }
                  })}
                  className="w-full rounded-xl border border-line bg-ink px-3 py-1.5 text-cyan-300"
                />
              </div>
              <div>
                <label className="block text-muted mb-1 font-semibold">Teks Tombol Aksi</label>
                <input
                  type="text"
                  value={config.dfyPlans.single.buttonText}
                  onChange={(e) => setConfig({
                    ...config,
                    dfyPlans: {
                      ...config.dfyPlans,
                      single: { ...config.dfyPlans.single, buttonText: e.target.value }
                    }
                  })}
                  className="w-full rounded-xl border border-line bg-ink px-3 py-1.5 text-paper font-semibold"
                />
              </div>
            </div>

            {/* Bundle 5 */}
            <div className="p-4 rounded-2xl bg-tile border border-[#ff6a2a] space-y-3">
              <span className="font-mono text-[10px] text-[#ff6a2a] uppercase font-bold block">2. Paket 5 Video (Best Seller)</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-muted mb-1 font-semibold">Harga Diskon</label>
                  <input
                    type="text"
                    value={config.dfyPlans.bundle.price}
                    onChange={(e) => setConfig({
                      ...config,
                      dfyPlans: {
                        ...config.dfyPlans,
                        bundle: { ...config.dfyPlans.bundle, price: e.target.value }
                      }
                    })}
                    className="w-full rounded-xl border border-line bg-ink px-2.5 py-1.5 text-[#ff6a2a] font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-muted mb-1 font-semibold">Harga Coret</label>
                  <input
                    type="text"
                    value={config.dfyPlans.bundle.originalPrice}
                    onChange={(e) => setConfig({
                      ...config,
                      dfyPlans: {
                        ...config.dfyPlans,
                        bundle: { ...config.dfyPlans.bundle, originalPrice: e.target.value }
                      }
                    })}
                    className="w-full rounded-xl border border-line bg-ink px-2.5 py-1.5 text-dim line-through font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-muted mb-1 font-semibold">Teks Keterangan Hemat</label>
                <input
                  type="text"
                  value={config.dfyPlans.bundle.savingsNote}
                  onChange={(e) => setConfig({
                    ...config,
                    dfyPlans: {
                      ...config.dfyPlans,
                      bundle: { ...config.dfyPlans.bundle, savingsNote: e.target.value }
                    }
                  })}
                  className="w-full rounded-xl border border-line bg-ink px-3 py-1.5 text-emerald-400 text-[11px]"
                />
              </div>
              <div>
                <label className="block text-muted mb-1 font-semibold">Teks Tombol Aksi</label>
                <input
                  type="text"
                  value={config.dfyPlans.bundle.buttonText}
                  onChange={(e) => setConfig({
                    ...config,
                    dfyPlans: {
                      ...config.dfyPlans,
                      bundle: { ...config.dfyPlans.bundle, buttonText: e.target.value }
                    }
                  })}
                  className="w-full rounded-xl border border-line bg-ink px-3 py-1.5 text-[#ff6a2a] font-bold"
                />
              </div>
            </div>

            {/* Retainer */}
            <div className="p-4 rounded-2xl bg-tile border border-purple-800/60 space-y-3">
              <span className="font-mono text-[10px] text-purple-400 uppercase font-bold block">3. Monthly Retainer</span>
              <div>
                <label className="block text-muted mb-1 font-semibold">Harga / Bulan</label>
                <input
                  type="text"
                  value={config.dfyPlans.retainer.price}
                  onChange={(e) => setConfig({
                    ...config,
                    dfyPlans: {
                      ...config.dfyPlans,
                      retainer: { ...config.dfyPlans.retainer, price: e.target.value }
                    }
                  })}
                  className="w-full rounded-xl border border-line bg-ink px-3 py-1.5 text-purple-300 font-bold font-mono"
                />
              </div>
              <div>
                <label className="block text-muted mb-1 font-semibold">Teks Keterangan Hemat</label>
                <input
                  type="text"
                  value={config.dfyPlans.retainer.savingsNote}
                  onChange={(e) => setConfig({
                    ...config,
                    dfyPlans: {
                      ...config.dfyPlans,
                      retainer: { ...config.dfyPlans.retainer, savingsNote: e.target.value }
                    }
                  })}
                  className="w-full rounded-xl border border-line bg-ink px-3 py-1.5 text-purple-300 text-[11px]"
                />
              </div>
              <div>
                <label className="block text-muted mb-1 font-semibold">Teks Tombol Aksi</label>
                <input
                  type="text"
                  value={config.dfyPlans.retainer.buttonText}
                  onChange={(e) => setConfig({
                    ...config,
                    dfyPlans: {
                      ...config.dfyPlans,
                      retainer: { ...config.dfyPlans.retainer, buttonText: e.target.value }
                    }
                  })}
                  className="w-full rounded-xl border border-line bg-ink px-3 py-1.5 text-purple-300 font-semibold"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: TESTIMONIALS & TRUST STATS */}
      {activeSubTab === 'testimonials' && (
        <div className="rounded-3xl border border-line bg-card p-6 sm:p-7 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
            <div>
              <h4 className="font-bold text-base text-paper flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                <span>Testimoni Klien &amp; 4 Angka Statistik Trust (#testimoni)</span>
              </h4>
              <p className="text-xs text-muted">
                Tambahkan review asli pembeli lisensi dan sesuaikan angka pembuktian kualitas.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddTestimonial}
              className="btn-outline py-2 px-3.5 text-xs font-bold inline-flex items-center gap-1.5 self-start"
            >
              <Plus className="w-3.5 h-3.5 text-accent" />
              <span>Tambah Testimoni Baru</span>
            </button>
          </div>

          {/* 4 Trust Stats Matrix */}
          <div>
            <span className="font-mono text-xs uppercase font-bold text-accent block mb-3">
              4 Angka Statistik Trust:
            </span>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {config.trustStats.map((stat, sIdx) => (
                <div key={sIdx} className="p-3.5 rounded-2xl bg-tile border border-line space-y-2">
                  <div>
                    <label className="block text-[10px] text-dim font-mono">Nilai Angka</label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => {
                        const nextStats = [...config.trustStats];
                        nextStats[sIdx].value = e.target.value;
                        setConfig({ ...config, trustStats: nextStats });
                      }}
                      className="w-full rounded-lg border border-line bg-ink px-2.5 py-1 text-accent font-bold font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-dim font-mono">Label Judul</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const nextStats = [...config.trustStats];
                        nextStats[sIdx].label = e.target.value;
                        setConfig({ ...config, trustStats: nextStats });
                      }}
                      className="w-full rounded-lg border border-line bg-ink px-2.5 py-1 text-paper font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-dim font-mono">Subteks</label>
                    <input
                      type="text"
                      value={stat.desc}
                      onChange={(e) => {
                        const nextStats = [...config.trustStats];
                        nextStats[sIdx].desc = e.target.value;
                        setConfig({ ...config, trustStats: nextStats });
                      }}
                      className="w-full rounded-lg border border-line bg-ink px-2.5 py-1 text-muted text-[11px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial Cards Editor */}
          <div className="space-y-4 pt-2">
            <span className="font-mono text-xs uppercase font-bold text-paper block">
              Daftar Testimoni ({config.testimonials.length} Review):
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {config.testimonials.map((t, idx) => (
                <div key={t.id} className="p-4 rounded-2xl bg-tile border border-line space-y-3 relative group text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-dim font-bold">Review #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTestimonial(t.id)}
                      className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-950/40"
                      title="Hapus testimoni ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-dim text-[10px]">Nama Klien &amp; Role</label>
                    <input
                      type="text"
                      value={t.name}
                      onChange={(e) => {
                        const next = [...config.testimonials];
                        next[idx].name = e.target.value;
                        setConfig({ ...config, testimonials: next });
                      }}
                      placeholder="Nama Klien"
                      className="w-full rounded-lg border border-line bg-ink px-2.5 py-1 text-paper font-bold mb-1"
                    />
                    <input
                      type="text"
                      value={t.role}
                      onChange={(e) => {
                        const next = [...config.testimonials];
                        next[idx].role = e.target.value;
                        setConfig({ ...config, testimonials: next });
                      }}
                      placeholder="Profesi & Kota"
                      className="w-full rounded-lg border border-line bg-ink px-2.5 py-1 text-muted text-[11px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-dim text-[10px]">Highlight Metrik</label>
                      <input
                        type="text"
                        value={t.metric}
                        onChange={(e) => {
                          const next = [...config.testimonials];
                          next[idx].metric = e.target.value;
                          setConfig({ ...config, testimonials: next });
                        }}
                        className="w-full rounded-lg border border-line bg-ink px-2.5 py-1 text-accent font-bold font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-dim text-[10px]">Label Metrik</label>
                      <input
                        type="text"
                        value={t.metricLabel}
                        onChange={(e) => {
                          const next = [...config.testimonials];
                          next[idx].metricLabel = e.target.value;
                          setConfig({ ...config, testimonials: next });
                        }}
                        className="w-full rounded-lg border border-line bg-ink px-2.5 py-1 text-muted text-[10px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-dim text-[10px]">Kit Yang Dipakai</label>
                    <input
                      type="text"
                      value={t.kitUsed}
                      onChange={(e) => {
                        const next = [...config.testimonials];
                        next[idx].kitUsed = e.target.value;
                        setConfig({ ...config, testimonials: next });
                      }}
                      className="w-full rounded-lg border border-line bg-ink px-2.5 py-1 text-dim font-mono text-[10px]"
                    />
                  </div>

                  <div>
                    <label className="block text-dim text-[10px]">Kutipan Testimoni</label>
                    <textarea
                      rows={3}
                      value={t.quote}
                      onChange={(e) => {
                        const next = [...config.testimonials];
                        next[idx].quote = e.target.value;
                        setConfig({ ...config, testimonials: next });
                      }}
                      className="w-full rounded-lg border border-line bg-ink px-2.5 py-1.5 text-paper leading-relaxed text-[11px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: FAQ ACCORDION */}
      {activeSubTab === 'faq' && (
        <div className="rounded-3xl border border-line bg-card p-6 sm:p-7 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
            <div>
              <h4 className="font-bold text-base text-paper flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>Manajemen Pertanyaan Umum (FAQ Accordion)</span>
              </h4>
              <p className="text-xs text-muted">
                Tambahkan pertanyaan baru atau perjelas jawaban teknis agar closing pembeli makin tinggi.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddFaq}
              className="btn-outline py-2 px-3.5 text-xs font-bold inline-flex items-center gap-1.5 self-start"
            >
              <Plus className="w-3.5 h-3.5 text-accent" />
              <span>Tambah FAQ Baru</span>
            </button>
          </div>

          <div className="space-y-4">
            {config.faqs.map((faq, idx) => (
              <div key={faq.id} className="p-4 rounded-2xl bg-tile border border-line space-y-2 text-xs">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-accent font-bold text-[11px]">
                    0{idx + 1}. Pertanyaan
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFaq(faq.id)}
                    className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-950/40 inline-flex items-center gap-1 text-[11px]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>

                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => {
                    const next = [...config.faqs];
                    next[idx].question = e.target.value;
                    setConfig({ ...config, faqs: next });
                  }}
                  className="w-full rounded-xl border border-line bg-ink px-3 py-2 text-paper font-bold focus:border-accent focus:outline-none"
                  placeholder="Ketik pertanyaan..."
                />

                <textarea
                  rows={3}
                  value={faq.answer}
                  onChange={(e) => {
                    const next = [...config.faqs];
                    next[idx].answer = e.target.value;
                    setConfig({ ...config, faqs: next });
                  }}
                  className="w-full rounded-xl border border-line bg-ink px-3 py-2 text-muted leading-relaxed focus:border-accent focus:outline-none"
                  placeholder="Ketik jawaban lengkap..."
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 6: CONTACT & PROMO BANNER */}
      {activeSubTab === 'contact' && (
        <div className="rounded-3xl border border-line bg-card p-6 sm:p-7 space-y-6 shadow-xl">
          <div className="border-b border-line pb-4">
            <h4 className="font-bold text-base text-paper flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-accent" />
              <span>Kontak Resmi WhatsApp, Rekening BCA &amp; Banner Promo</span>
            </h4>
            <p className="text-xs text-muted">
              Pastikan nomor kontak bantuan mengarah ke tim AUDIRA resmi dan rekening pembayaran valid.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Promo Banner Card */}
            <div className="p-4 rounded-2xl bg-tile border border-line space-y-3">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <span className="font-bold text-paper flex items-center gap-1.5">
                  <Megaphone className="w-3.5 h-3.5 text-accent" />
                  Banner Pengumuman Paling Atas
                </span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.promoBanner.enabled}
                    onChange={(e) => setConfig({
                      ...config,
                      promoBanner: { ...config.promoBanner, enabled: e.target.checked }
                    })}
                    className="size-4 rounded border-line bg-ink text-accent accent-[#ff6a2a]"
                  />
                  <span className={config.promoBanner.enabled ? 'text-emerald-400 font-bold' : 'text-dim'}>
                    {config.promoBanner.enabled ? 'Aktif' : 'Nonaktif'}
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-muted mb-1 font-semibold">Teks Badge Promo</label>
                <input
                  type="text"
                  value={config.promoBanner.badge}
                  onChange={(e) => setConfig({
                    ...config,
                    promoBanner: { ...config.promoBanner, badge: e.target.value }
                  })}
                  className="w-full rounded-xl border border-line bg-ink px-3 py-2 text-paper font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-muted mb-1 font-semibold">Isi Pesan Promo</label>
                <textarea
                  rows={3}
                  value={config.promoBanner.text}
                  onChange={(e) => setConfig({
                    ...config,
                    promoBanner: { ...config.promoBanner, text: e.target.value }
                  })}
                  className="w-full rounded-xl border border-line bg-ink px-3 py-2 text-paper leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-muted mb-1 font-semibold">Link Target Tombol / Banner</label>
                <input
                  type="text"
                  value={config.promoBanner.link}
                  onChange={(e) => setConfig({
                    ...config,
                    promoBanner: { ...config.promoBanner, link: e.target.value }
                  })}
                  className="w-full rounded-xl border border-line bg-ink px-3 py-2 text-paper font-mono"
                />
              </div>
            </div>

            {/* WhatsApp & Bank BCA Card */}
            <div className="p-4 rounded-2xl bg-tile border border-line space-y-3">
              <span className="font-bold text-paper block border-b border-line pb-2 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                Kontak CS Tanya AUDIRA &amp; Rekening BCA
              </span>

              <div>
                <label className="block text-muted mb-1 font-semibold">Nomor WhatsApp Resmi (Tanya AUDIRA)</label>
                <input
                  type="text"
                  value={config.contact.whatsappNumber}
                  onChange={(e) => setConfig({
                    ...config,
                    contact: { ...config.contact, whatsappNumber: e.target.value }
                  })}
                  placeholder="6285709666240"
                  className="w-full rounded-xl border border-line bg-ink px-3 py-2 text-paper font-mono font-bold"
                />
                <span className="text-[10px] text-dim">*Gunakan format 62 tanpa tanda + atau spasi.</span>
              </div>

              <div>
                <label className="block text-muted mb-1 font-semibold">Label CS / Support</label>
                <input
                  type="text"
                  value={config.contact.csLabel}
                  onChange={(e) => setConfig({
                    ...config,
                    contact: { ...config.contact, csLabel: e.target.value }
                  })}
                  className="w-full rounded-xl border border-line bg-ink px-3 py-2 text-paper font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-muted mb-1 font-semibold">No. Rekening BCA</label>
                  <input
                    type="text"
                    value={config.contact.bcaAccountNumber}
                    onChange={(e) => setConfig({
                      ...config,
                      contact: { ...config.contact, bcaAccountNumber: e.target.value }
                    })}
                    className="w-full rounded-xl border border-line bg-ink px-3 py-2 text-paper font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-muted mb-1 font-semibold">Atas Nama BCA</label>
                  <input
                    type="text"
                    value={config.contact.bcaAccountName}
                    onChange={(e) => setConfig({
                      ...config,
                      contact: { ...config.contact, bcaAccountName: e.target.value }
                    })}
                    className="w-full rounded-xl border border-line bg-ink px-3 py-2 text-paper"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 7: SECTION VISIBILITY TOGGLES */}
      {activeSubTab === 'visibility' && (
        <div className="rounded-3xl border border-line bg-card p-6 sm:p-7 space-y-6 shadow-xl">
          <div className="border-b border-line pb-4">
            <h4 className="font-bold text-base text-paper flex items-center gap-2">
              <Sliders className="w-4 h-4 text-accent" />
              <span>Saklar Visibilitas Section Landing Page</span>
            </h4>
            <p className="text-xs text-muted">
              Nyalakan atau sembunyikan section tertentu di landing page secara instan tanpa menyentuh kode.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {[
              { key: 'hero' as const, label: 'Hero Section (#top)', desc: 'Headline, video reels, dan form ide awal' },
              { key: 'pricing' as const, label: 'Paket Lisensi (#produk)', desc: '3 kartu lisensi Starter, Master, Creator Lab' },
              { key: 'showcase3D' as const, label: 'Remotion 3D Showcase (#remotion-3d)', desc: 'Showcase visual procedural Three.js' },
              { key: 'gallery' as const, label: 'Galeri Video (#hasil)', desc: 'Katalog 29 video reel interaktif' },
              { key: 'dfyService' as const, label: 'Jasa Terima Beres (#jasa)', desc: '3 paket DFY 24 jam & Monthly Retainer' },
              { key: 'testimonials' as const, label: 'Testimoni Pembeli (#testimoni)', desc: 'Review kepuasan kreator & 4 angka trust' },
              { key: 'howItWorks' as const, label: 'Cara Kerja (#cara-kerja)', desc: 'Langkah alur kerja 3 step & live demo' },
              { key: 'bundleComparison' as const, label: 'Tabel Komparasi (#bundle)', desc: 'Tabel perbandingan fitur lengkap 3 paket' },
              { key: 'faq' as const, label: 'FAQ Accordion (#faq)', desc: 'Tanya jawab seputar spek hardware & lisensi' },
              { key: 'stickyCta' as const, label: 'Sticky Floating CTA Bar', desc: 'Bar konversi bawah yang melayang saat scroll' },
            ].map((item) => {
              const isVisible = config.sectionVisibility[item.key];
              return (
                <div
                  key={item.key}
                  onClick={() => setConfig({
                    ...config,
                    sectionVisibility: {
                      ...config.sectionVisibility,
                      [item.key]: !isVisible
                    }
                  })}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isVisible
                      ? 'border-emerald-800/80 bg-emerald-950/20 shadow-md'
                      : 'border-line bg-tile opacity-60'
                  }`}
                >
                  <div>
                    <span className="font-bold text-paper block text-sm mb-0.5">{item.label}</span>
                    <span className="text-[11px] text-muted leading-tight block">{item.desc}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase shrink-0 ${
                    isVisible ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-600/40' : 'bg-tile text-dim border border-line'
                  }`}>
                    {isVisible ? 'Aktif' : 'Off'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
