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
  CheckCircle2
} from 'lucide-react';

export type ProductTier = 'starter' | 'master' | 'lab' | 'dfy';

export interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTier?: ProductTier;
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
    price: 'Rp49.000',
    originalPrice: 'Rp79.000',
    badge: '5 GAYA PILIHAN',
    accentColor: 'text-accent border-accent',
    highlights: [
      '5 Kit Gaya 3D Signature Pilihan',
      'Perintah Claude Code /audira-motion',
      'Ekspor MP4 1080×1920 60 FPS Tanpa Watermark',
      'Akses Web Studio Browser Runner'
    ]
  },
  master: {
    id: 'master',
    name: 'Master Director Pack',
    price: 'Rp79.000',
    originalPrice: 'Rp129.000',
    badge: 'SEMUA 29 GAYA 3D',
    accentColor: 'text-cyan-400 border-cyan-400',
    highlights: [
      'Semua 29 Gaya 3D Sinematik Lengkap',
      'Autonomous Director Claude Code (Pilih Gaya Otomatis)',
      'Audio Sync Presisi & Normalisasi -14 LUFS',
      'Multi-Resolution Render: Smoke Test & Final 60 FPS'
    ]
  },
  lab: {
    id: 'lab',
    name: 'Creator Lab Ultimate',
    price: 'Rp109.000',
    originalPrice: 'Rp178.000',
    badge: 'PALING LARIS • FULL SUITE',
    accentColor: 'text-amber-400 border-amber-400',
    highlights: [
      'Semua 29 Gaya 3D + Full Source Codebase Remotion',
      'Brand Kit Configurator (audira-brand.json)',
      'AI Lokal Offline Gateway (Ollama 4B 3D-Coder)',
      'Konsultasi WhatsApp 1-on-1 Langsung Mas Agus'
    ]
  },
  dfy: {
    id: 'dfy',
    name: 'Jasa Terima Beres (DFY)',
    price: 'Mulai Rp199.000',
    originalPrice: 'Rp350.000',
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

const WHATSAPP_NUMBER = '6285709666240';

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  defaultTier = 'lab'
}) => {
  const [selectedTier, setSelectedTier] = useState<ProductTier>(defaultTier);
  const [buyerName, setBuyerName] = useState('');
  const [buyerWhatsApp, setBuyerWhatsApp] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bca' | 'wa'>('qris');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    setSelectedTier(defaultTier);
  }, [defaultTier]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentTier = TIERS[selectedTier];

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleWhatsAppCheckout = () => {
    const name = buyerName.trim() || 'Kreator';
    const wa = buyerWhatsApp.trim() || '-';
    const email = buyerEmail.trim() || '-';
    const msg = `Halo Mas Agus (AUDIRA MDA), saya ingin memesan Lisensi Resmi:\n\n` +
      `📦 Paket: *${currentTier.name}*\n` +
      `💰 Harga: *${currentTier.price}*\n` +
      `👤 Nama: ${name}\n` +
      `📱 WhatsApp: ${wa}\n` +
      `📧 Email: ${email}\n` +
      `💳 Metode Bayar: ${paymentMethod.toUpperCase()}\n\n` +
      `Mohon info rekening/QRIS dan konfirmasi akses lisensi digital saya. Terima kasih!`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in font-display">
      {/* Backdrop click to close */}
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div className="relative w-full max-w-[720px] max-h-[92vh] overflow-y-auto rounded-3xl border-2 border-line-strong bg-card p-5 sm:p-7 shadow-2xl z-10 text-paper">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-line pb-4 mb-5">
          <div className="flex flex-col gap-1">
            <div className="inline-flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-ping" />
              <p className="font-mono text-[11px] uppercase tracking-wider text-accent font-bold">
                FORMULIR PEMESANAN LISENSI RESMI
              </p>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-paper">
              Beli Lisensi AUDIRA Skill Motion 3D
            </h3>
            <p className="text-xs text-muted">
              Sekali bayar · Lisensi seumur hidup · Bebas watermark untuk klien dan monetisasi.
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
        <div className="mb-5">
          <label className="block text-xs font-mono uppercase text-dim font-bold mb-2">
            Pilih Paket Lisensi:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(TIERS) as ProductTier[]).map((tierKey) => {
              const t = TIERS[tierKey];
              const isSelected = selectedTier === tierKey;
              return (
                <button
                  key={tierKey}
                  type="button"
                  onClick={() => setSelectedTier(tierKey)}
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

        {/* Selected Tier Summary Box */}
        <div className="mb-6 rounded-2xl border border-line bg-ink p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg text-paper">
                {currentTier.name}
              </span>
              <span className="rounded bg-accent/20 border border-accent/40 px-2 py-0.5 font-mono text-[10px] font-bold text-accent">
                {currentTier.badge}
              </span>
            </div>
            <ul className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-muted">
              {currentTier.highlights.map((h, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-start sm:items-end shrink-0 border-t sm:border-t-0 sm:border-l border-line sm:pl-4 pt-3 sm:pt-0">
            <span className="text-[11px] text-dim">Total Investasi:</span>
            <span className="text-2xl font-black text-accent">{currentTier.price}</span>
            {currentTier.originalPrice && (
              <span className="text-xs text-dim line-through">{currentTier.originalPrice}</span>
            )}
          </div>
        </div>

        {/* Buyer Information Inputs */}
        <div className="mb-6 space-y-3">
          <label className="block text-xs font-mono uppercase text-accent font-bold">
            Data Penerima Lisensi Digital:
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
              <span className="text-[10px] text-dim font-mono">Bicara Mas Agus</span>
            </button>
          </div>
        </div>

        {/* Payment Detail Details Accordion */}
        {paymentMethod === 'qris' && (
          <div className="mb-6 rounded-2xl border border-line bg-ink p-4 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="p-3 bg-white rounded-xl shrink-0 shadow-md">
              {/* QRIS Visual Mock */}
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
              <span className="text-accent font-bold text-sm">{currentTier.price}</span>
            </div>
          </div>
        )}

        {paymentMethod === 'wa' && (
          <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-xs text-muted flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-paper mb-0.5">Pemesanan Langsung ke WhatsApp Mas Agus</p>
              <p className="leading-relaxed">
                Format naskah pemesanan akan otomatis tersusun rapi. Tim AUDIRA akan langsung membalas dalam hitungan menit untuk konfirmasi file dan aktivasi lisensi.
              </p>
            </div>
          </div>
        )}

        {/* Primary Action Button */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleWhatsAppCheckout}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-4 text-sm sm:text-base font-bold text-ink shadow-xl shadow-orange-950/40 hover:bg-orange-500 transition-all active:scale-[0.99]"
          >
            <MessageCircle className="w-5 h-5 fill-ink" />
            <span>Konfirmasi &amp; Dapatkan Akses via WhatsApp ➔</span>
          </button>

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
            <span>Lisensi Seumur Hidup</span>
          </div>
        </div>
      </div>
    </div>
  );
};
