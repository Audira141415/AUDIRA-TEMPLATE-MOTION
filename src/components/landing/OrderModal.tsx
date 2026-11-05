'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  MessageCircle, 
  CreditCard, 
  QrCode, 
  Copy, 
  ArrowRight,
  Lock,
  Zap,
  CheckCircle2,
  Star
} from 'lucide-react';
import { DfyPlanId } from './DoneForYouSection';

export type ProductTier = 'starter' | 'master' | 'lab' | 'dfy';

export interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTier?: ProductTier;
  defaultDfyPlan?: DfyPlanId;
  initialCoupon?: string;
  onTierChange?: (tier: ProductTier, dfyPlan?: DfyPlanId) => void;
  standalone?: boolean;
}

interface TierInfo {
  id: ProductTier;
  name: string;
  price: string;
  originalPrice?: string;
  badge: string;
  accentColor: string;
  highlights: string[];
}

const TIERS: Record<ProductTier, TierInfo> = {
  starter: {
    id: 'starter',
    name: 'Starter 3D Pack',
    price: 'Rp149.000',
    originalPrice: 'Rp299.000',
    badge: '5 GAYA PILIHAN',
    accentColor: 'text-accent border-accent',
    highlights: [
      '5 Kit Gaya 3D Signature Pilihan',
      'Perintah Claude Code /audira-motion',
      'Buku Panduan Instalasi Lengkap (/panduan)',
      'Lisensi Komersial Seumur Hidup (Bebas Royalti)'
    ]
  },
  master: {
    id: 'master',
    name: 'Master Director Pack',
    price: 'Rp299.000',
    originalPrice: 'Rp599.000',
    badge: 'SEMUA 29 GAYA 3D',
    accentColor: 'text-cyan-400 border-cyan-400',
    highlights: [
      'Semua 29 Gaya 3D Sinematik Lengkap',
      'Bundling AUDIRA Skill Mesh (MCP Server)',
      'Autonomous Director Claude Code (Pilih Gaya Otomatis)',
      'Buku Panduan Lengkap (/panduan) + Audio Sync Presisi'
    ]
  },
  lab: {
    id: 'lab',
    name: 'Creator Lab Ultimate',
    price: 'Rp499.000',
    originalPrice: 'Rp999.000',
    badge: 'PALING LARIS • FULL SUITE',
    accentColor: 'text-amber-400 border-amber-400',
    highlights: [
      'Semua 29 Gaya 3D + Full Source Codebase Remotion',
      'AUDIRA Skill Mesh (Full Agentic Director Engine)',
      'Buku Panduan Lengkap (/panduan) + Video Walkthrough',
      'Garansi Setup 1-on-1 WhatsApp Tim AUDIRA'
    ]
  },
  dfy: {
    id: 'dfy',
    name: 'Jasa Terima Beres (DFY)',
    price: 'Mulai Rp349.000',
    originalPrice: 'Rp550.000',
    badge: 'SLA 24 JAM SELESAI',
    accentColor: 'text-emerald-400 border-emerald-400',
    highlights: [
      'Naskah, Riset Hook & Audio Suara Jernih oleh AUDIRA',
      'Animasi 3D Sinematik 1080p 60 FPS Masuk HP Anda',
      'Garansi Revisi Naskah & Visual Sampai Cocok',
      'File MP4 Siap Posting di TikTok, Reels & YouTube'
    ]
  }
};

const DFY_SUB_PLANS: Record<DfyPlanId, {
  name: string;
  price: string;
  originalPrice: string;
  badge: string;
  highlights: string[];
}> = {
  single: {
    name: 'Jasa DFY : Paket Satuan (1 Video)',
    price: 'Rp349.000',
    originalPrice: 'Rp550.000',
    badge: '1 VIDEO REEL (24 JAM)',
    highlights: [
      '1 Video 9:16 Durasi 30-60 Detik Beres 24 Jam',
      'Naskah Hook Viral & Suara Jernih Cartesia AI',
      'Animasi 3D Sinematik / Kinetic Subtitle',
      'Garansi 1x Revisi Minor Naskah & Visual'
    ]
  },
  bundle: {
    name: 'Jasa DFY : Paket 5 Video Reels',
    price: 'Rp1.399.000',
    originalPrice: 'Rp1.745.000',
    badge: '5 VIDEO REELS (HEMAT 20%)',
    highlights: [
      '5 Video Reels/Shorts 9:16 Siap Tayang',
      'Bebas Campur Format (3D, Explainer, Skit)',
      'Termasuk SFX, BGM & Rekomendasi Caption',
      'Garansi 2x Revisi per Video'
    ]
  },
  retainer: {
    name: 'Jasa DFY : Monthly Retainer (15 Video)',
    price: 'Rp3.490.000',
    originalPrice: 'Rp5.500.000',
    badge: '15 VIDEO / BULAN (DOMINASI)',
    highlights: [
      '15 Video Reels/Shorts Distribusi 1 Bulan',
      'Jadwal Konten Rapi 3-4 Video per Minggu',
      'Custom Watermark Logo & Brand Kit',
      'Direct Line Konsultasi WhatsApp Tim AUDIRA'
    ]
  }
};

const WHATSAPP_NUMBER = '6285709666240';

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  defaultTier = 'lab',
  defaultDfyPlan = 'bundle',
  initialCoupon,
  onTierChange,
  standalone = false
}) => {
  const [selectedTier, setSelectedTier] = useState<ProductTier>(defaultTier);
  const [selectedDfyPlan, setSelectedDfyPlan] = useState<DfyPlanId>(defaultDfyPlan);
  const [buyerName, setBuyerName] = useState('');
  const [buyerWhatsApp, setBuyerWhatsApp] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bca' | 'wa'>('qris');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Coupon promo states
  const [couponInput, setCouponInput] = useState(initialCoupon ? initialCoupon.toUpperCase() : '');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    formattedDiscount: string;
    finalAmount: number;
    formattedFinalAmount: string;
    description: string;
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Submission state (moved to top to obey React Rules of Hooks)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedTier(defaultTier);
  }, [defaultTier]);

  useEffect(() => {
    if (defaultDfyPlan) {
      setSelectedDfyPlan(defaultDfyPlan);
    }
  }, [defaultDfyPlan]);

  useEffect(() => {
    if (initialCoupon) {
      setCouponInput(initialCoupon.toUpperCase());
    }
  }, [initialCoupon]);

  useEffect(() => {
    if (!standalone && !isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, standalone, onClose]);

  const shouldRender = standalone || isOpen;
  if (!shouldRender) return null;

  const handleSelectTier = (tierKey: ProductTier) => {
    setSelectedTier(tierKey);
    onTierChange?.(tierKey, selectedDfyPlan);
  };

  const handleSelectDfyPlan = (planKey: DfyPlanId) => {
    setSelectedDfyPlan(planKey);
    onTierChange?.('dfy', planKey);
  };

  // Active display calculation (specialized for DFY sub-plans)
  const isDfy = selectedTier === 'dfy';
  const currentPlan = isDfy ? DFY_SUB_PLANS[selectedDfyPlan] : TIERS[selectedTier];

  const displayName = currentPlan.name;
  const displayPrice = currentPlan.price;
  const displayOriginalPrice = currentPlan.originalPrice;
  const displayBadge = currentPlan.badge;
  const displayHighlights = currentPlan.highlights;

  const rawAmountNum = parseInt(displayPrice.replace(/\D/g, ''), 10) || 0;
  const effectivePrice = appliedCoupon ? appliedCoupon.formattedFinalAmount : displayPrice;

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError(null);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponInput.trim(),
          amount: rawAmountNum
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error || 'Kupon tidak dapat digunakan.');
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon(data);
        setCouponError(null);
      }
    } catch {
      setCouponError('Gagal memvalidasi kupon. Cek koneksi Anda.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError(null);
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleWhatsAppCheckout = async () => {
    const name = buyerName.trim() || 'Kreator';
    const wa = buyerWhatsApp.trim() || '-';
    const email = buyerEmail.trim() || '-';

    setIsSubmitting(true);
    let orderId = '';
    try {
      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerWhatsApp: wa,
          customerEmail: email,
          tier: selectedTier,
          tierName: displayName,
          amount: effectivePrice,
          paymentMethod: paymentMethod.toUpperCase(),
          couponCode: appliedCoupon?.code,
          discountAmount: appliedCoupon?.formattedDiscount,
        })
      });
      const data = await res.json();
      if (res.ok && data.order?.id) {
        orderId = data.order.id;
        setSubmittedOrderId(orderId);
      }
    } catch (e) {
      console.error('Gagal mencatat pesanan checkout:', e);
    } finally {
      setIsSubmitting(false);
    }

    const msg = `Halo Tim AUDIRA, saya ingin memesan Lisensi Resmi / Jasa:\n\n` +
      `📦 Paket: *${displayName}*\n` +
      `💰 Total Bayar: *${effectivePrice}*` + (appliedCoupon ? ` (Diskon Kupon ${appliedCoupon.code} : -${appliedCoupon.formattedDiscount})` : '') + `\n` +
      (orderId ? `🆔 No. Pesanan: *${orderId}*\n` : '') +
      `👤 Nama: ${name}\n` +
      `📱 WhatsApp: ${wa}\n` +
      `📧 Email: ${email}\n` +
      `💳 Metode Bayar: ${paymentMethod.toUpperCase()}\n\n` +
      `Mohon info pengiriman file, konfigurasi AUDIRA Skill Mesh (MCP), dan akses buku panduan instalasi (/panduan). Terima kasih!`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={standalone 
      ? "w-full max-w-[760px] mx-auto animate-fade-in font-display" 
      : "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in font-display"
    }>
      {/* Backdrop click to close (only in modal mode) */}
      {!standalone && (
        <div 
          className="absolute inset-0" 
          onClick={onClose} 
          aria-hidden="true" 
        />
      )}

      <div className={`relative w-full ${standalone ? 'max-w-[760px]' : 'max-w-[720px] max-h-[92vh] overflow-y-auto'} rounded-3xl border-2 border-line-strong bg-card p-5 sm:p-7 shadow-2xl z-10 text-paper`}>
        {/* Standalone navigation breadcrumbs bar */}
        {standalone && (
          <div className="flex items-center justify-between border-b border-line pb-3 mb-4 text-xs">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-accent hover:underline font-bold"
            >
              <span>← Kembali ke Katalog Utama</span>
            </button>
            <span className="text-[11px] font-mono text-dim flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" /> Checkout Resmi Terenkripsi
            </span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between border-b border-line pb-4 mb-5">
          <div className="flex flex-col gap-1">
            <div className="inline-flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-ping" />
              <p className="font-mono text-[11px] uppercase tracking-wider text-accent font-bold">
                FORMULIR PEMESANAN RESMI
              </p>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-paper">
              {isDfy ? 'Pesan Jasa Terima Beres AUDIRA' : 'Beli Lisensi AUDIRA Skill Motion 3D'}
            </h3>
            <p className="text-xs text-muted">
              {isDfy 
                ? 'Pengerjaan kilat 24 jam · Video 1080p 60 FPS bebas watermark siap posting.' 
                : 'Sekali bayar · Lisensi seumur hidup · Bebas royalti untuk klien dan monetisasi.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-line bg-tile p-2 text-muted hover:border-line-strong hover:text-paper transition-colors"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tier Selector Chips */}
        <div className="mb-4">
          <label className="block text-xs font-mono uppercase text-dim font-bold mb-2">
            Pilih Kategori:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(TIERS) as ProductTier[]).map((tierKey) => {
              const t = TIERS[tierKey];
              const isSelected = selectedTier === tierKey;
              return (
                <button
                  key={tierKey}
                  type="button"
                  onClick={() => handleSelectTier(tierKey)}
                  className={`flex flex-col p-2.5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-accent bg-accent/15 ring-2 ring-accent/60 scale-[1.02] shadow-md'
                      : 'border-line bg-tile hover:border-line-strong'
                  }`}
                >
                  <span className="font-mono text-[10px] font-bold text-accent uppercase truncate">
                    {t.badge}
                  </span>
                  <span className="text-xs sm:text-[13px] font-extrabold text-paper truncate mt-0.5">
                    {t.name}
                  </span>
                  <span className="text-sm font-black text-white mt-1">
                    {t.price}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* DFY Sub-Plan Selector (Pilih Kiri, Tengah, atau Kanan) */}
        {isDfy && (
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">
                <Star className="w-3 h-3 fill-emerald-400" />
                Pilih Opsi Paket Terima Beres:
              </label>
              <span className="text-[10px] font-mono text-emerald-300">Pilih Kiri, Tengah, atau Kanan</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['single', 'bundle', 'retainer'] as DfyPlanId[]).map((planKey) => {
                const sub = DFY_SUB_PLANS[planKey];
                const active = selectedDfyPlan === planKey;
                const labelPos = planKey === 'single' ? 'Kiri' : planKey === 'bundle' ? 'Tengah' : 'Kanan';

                return (
                  <button
                    key={planKey}
                    type="button"
                    onClick={() => handleSelectDfyPlan(planKey)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      active
                        ? 'border-emerald-400 bg-emerald-500/25 text-white ring-2 ring-emerald-400/50 shadow-md font-bold'
                        : 'border-line bg-tile text-muted hover:border-line-strong hover:text-paper'
                    }`}
                  >
                    <span className="block text-[10px] font-mono text-dim">{labelPos}:</span>
                    <span className="block text-xs font-bold text-paper truncate">{sub.name.replace('Jasa DFY : ', '')}</span>
                    <span className="block text-[12px] font-black text-emerald-400 mt-0.5">{sub.price}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Tier Summary Box */}
        <div className="mb-6 rounded-2xl border border-line bg-ink p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg text-paper">
                {displayName}
              </span>
              <span className="rounded bg-accent/20 border border-accent/40 px-2 py-0.5 font-mono text-[10px] font-bold text-accent">
                {displayBadge}
              </span>
            </div>
            <ul className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-muted">
              {displayHighlights.map((h, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-start sm:items-end shrink-0 border-t sm:border-t-0 sm:border-l border-line sm:pl-4 pt-3 sm:pt-0">
            <span className="text-[11px] text-dim">Total Investasi:</span>
            {appliedCoupon ? (
              <div className="text-right">
                <span className="text-xs text-dim line-through block">{displayPrice}</span>
                <span className="text-2xl font-black text-emerald-400">{effectivePrice}</span>
                <span className="text-[10px] font-mono text-emerald-300 font-bold block">
                  Hemat {appliedCoupon.formattedDiscount}!
                </span>
              </div>
            ) : (
              <div>
                <span className="text-2xl font-black text-accent">{displayPrice}</span>
                {displayOriginalPrice && (
                  <span className="text-xs text-dim line-through block">{displayOriginalPrice}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Coupon Code Section */}
        <div className="mb-5 p-3.5 rounded-2xl border border-line bg-tile/70 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase text-dim font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              Punya Kode Promo / Kupon Diskon?
            </label>
            {appliedCoupon && (
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="text-[11px] text-red-400 hover:underline"
              >
                Hapus Kupon
              </button>
            )}
          </div>

          {appliedCoupon ? (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700">
                  {appliedCoupon.code}
                </span>
                <span className="text-emerald-200 text-[11px]">{appliedCoupon.description}</span>
              </div>
              <span className="font-bold text-emerald-400 font-mono">
                -{appliedCoupon.formattedDiscount}
              </span>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Masukkan kode promo (cth: AUDIRABARU, PROMO3D)"
                className="flex-1 rounded-xl border border-line bg-card px-3 py-1.5 font-mono text-xs uppercase text-paper placeholder:text-dim placeholder:normal-case focus:border-accent focus:outline-none"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={couponLoading || !couponInput.trim()}
                className="rounded-xl bg-accent px-4 py-1.5 text-xs font-bold text-ink hover:bg-orange-500 transition-all disabled:opacity-50"
              >
                {couponLoading ? 'Memeriksa...' : 'Terapkan'}
              </button>
            </div>
          )}

          {couponError && (
            <p className="text-[11px] text-red-400 font-medium">{couponError}</p>
          )}
        </div>

        {/* Guide & Skill Mesh Info Pill for License Packages */}
        {!isDfy && (
          <div className="mb-5 -mt-3 flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-accent/10 border border-accent/25 text-xs">
            <span className="text-muted flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
              <span>Termasuk <strong>AUDIRA Skill Mesh (MCP)</strong> &amp; Panduan 5 Langkah</span>
            </span>
            <a 
              href="/panduan" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent font-bold hover:underline inline-flex items-center gap-1 text-[11px] shrink-0"
            >
              Buka Panduan ➔
            </a>
          </div>
        )}

        {/* Buyer Information Inputs */}
        <div className="mb-6 space-y-3">
          <label className="block text-xs font-mono uppercase text-accent font-bold">
            Data Penerima {isDfy ? 'Layanan Video' : 'Lisensi Digital'}:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-muted mb-1">Nama Lengkap / Brand *</label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className="w-full rounded-xl border border-line bg-tile px-3.5 py-2.5 text-xs sm:text-sm text-paper placeholder:text-dim focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] text-muted mb-1">Nomor WhatsApp Aktif *</label>
              <input
                type="tel"
                value={buyerWhatsApp}
                onChange={(e) => setBuyerWhatsApp(e.target.value)}
                placeholder="0812xxxxxxxx"
                className="w-full rounded-xl border border-line bg-tile px-3.5 py-2.5 text-xs sm:text-sm text-paper placeholder:text-dim focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] text-muted mb-1">Alamat Email *</label>
              <input
                type="email"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                placeholder="email@anda.com"
                className="w-full rounded-xl border border-line bg-tile px-3.5 py-2.5 text-xs sm:text-sm text-paper placeholder:text-dim focus:border-accent focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="mb-6">
          <label className="block text-xs font-mono uppercase text-dim font-bold mb-2">
            Pilih Jalur Pembayaran:
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('qris')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                paymentMethod === 'qris'
                  ? 'border-accent bg-accent/15 text-paper font-bold'
                  : 'border-line bg-tile text-muted hover:border-line-strong'
              }`}
            >
              <QrCode className="w-5 h-5 text-accent" />
              <span className="text-xs">QRIS Instan</span>
              <span className="text-[10px] text-dim font-mono">Semua Bank/E-Wallet</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('bca')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                paymentMethod === 'bca'
                  ? 'border-accent bg-accent/15 text-paper font-bold'
                  : 'border-line bg-tile text-muted hover:border-line-strong'
              }`}
            >
              <CreditCard className="w-5 h-5 text-cyan-400" />
              <span className="text-xs">Transfer Bank</span>
              <span className="text-[10px] text-dim font-mono">BCA / Mandiri</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('wa')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                paymentMethod === 'wa'
                  ? 'border-accent bg-accent/15 text-paper font-bold'
                  : 'border-line bg-tile text-muted hover:border-line-strong'
              }`}
            >
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-xs">WhatsApp Direct</span>
              <span className="text-[10px] text-dim font-mono">Tanya AUDIRA</span>
            </button>
          </div>
        </div>

        {/* Payment Detail Details Accordion */}
        {paymentMethod === 'qris' && (
          <div className="mb-6 rounded-2xl border border-line bg-ink p-4 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="p-3 bg-white rounded-xl shrink-0 shadow-md">
              <div className="size-28 flex flex-col items-center justify-center border-2 border-dashed border-zinc-400 text-zinc-800">
                <QrCode className="w-12 h-12 text-zinc-900" />
                <span className="font-mono text-[9px] font-black uppercase tracking-wider text-black mt-1">
                  QRIS RESMI
                </span>
                <span className="text-[8px] text-zinc-600">AUDIRA MDA</span>
              </div>
            </div>
            <div className="flex-1 space-y-1.5 text-xs text-muted">
              <p className="font-bold text-sm text-paper">Scan QRIS Lewat Semua Aplikasi:</p>
              <p>Mendukung BCA Mobile, Livin Mandiri, BRImo, GoPay, OVO, ShopeePay, DANA, dan LinkAja.</p>
              <p className="text-[11px] text-accent font-mono">
                Atas Nama: <strong>Agus Dwi Rianto / Audira</strong>
              </p>
              <p className="text-[10px] text-dim">
                Setelah scan berhasil, klik tombol di bawah untuk konfirmasi otomatis dan menerima link akses digital.
              </p>
            </div>
          </div>
        )}

        {paymentMethod === 'bca' && (
          <div className="mb-6 rounded-2xl border border-line bg-ink p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="font-bold text-paper">Bank Central Asia (BCA)</span>
              <button
                type="button"
                onClick={() => handleCopy('8691888291', 'BCA')}
                className="inline-flex items-center gap-1 text-[11px] text-accent hover:underline font-mono"
              >
                {copiedText === 'BCA' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedText === 'BCA' ? 'Tersalin' : 'Salin Rekening'}</span>
              </button>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-2 font-mono">
              <span className="text-dim">Nomor Rekening:</span>
              <span className="text-paper font-bold text-sm">8691 888 291</span>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-dim">Atas Nama:</span>
              <span className="text-paper font-semibold">Agus Dwi Rianto</span>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-2 pt-1 border-t border-line-soft">
              <span className="text-dim">Nominal Transfer:</span>
              <span className="text-accent font-bold text-sm">{effectivePrice}</span>
            </div>
          </div>
        )}

        {paymentMethod === 'wa' && (
          <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-xs text-muted flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-paper mb-0.5">Pemesanan Langsung ke WhatsApp AUDIRA</p>
              <p className="leading-relaxed">
                Format naskah pemesanan akan otomatis tersusun rapi. Tim AUDIRA akan langsung membalas dalam hitungan menit untuk konfirmasi file dan aktivasi lisensi.
              </p>
            </div>
          </div>
        )}

        {/* Primary Action Button */}
        <div className="flex flex-col gap-3">
          {submittedOrderId ? (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Pesanan Berhasil Dicatat!
                </span>
                <span className="font-mono text-[11px] font-bold bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700">
                  {submittedOrderId}
                </span>
              </div>
              <p className="text-muted leading-relaxed">
                WhatsApp Tim AUDIRA telah dibuka untuk konfirmasi. Anda dapat memantau status aktivasi lisensi di portal pelanggan.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <a
                  href={`/pesanan?query=${submittedOrderId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-accent hover:underline inline-flex items-center gap-1"
                >
                  <span>Pantau di Portal Pesanan Saya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleWhatsAppCheckout}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-4 text-sm sm:text-base font-bold text-ink shadow-xl shadow-orange-950/40 hover:bg-orange-500 transition-all active:scale-[0.99] disabled:opacity-50"
            >
              <MessageCircle className="w-5 h-5 fill-ink" />
              <span>{isSubmitting ? 'Mencatat Pesanan...' : `Konfirmasi ${displayName} via WhatsApp ➔`}</span>
            </button>
          )}

          {/* Guarantee Microcopy */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-dim font-mono pt-1">
            <span className="inline-flex items-center gap-1">
              <Lock className="w-3 h-3 text-accent" />
              Enkripsi Aman &amp; Bebas Biaya Admin
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Garansi Setup 1-on-1 Sampai Beres
            </span>
            <span>•</span>
            <span>{isDfy ? 'Garansi SLA 24 Jam' : 'Lisensi Seumur Hidup'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
