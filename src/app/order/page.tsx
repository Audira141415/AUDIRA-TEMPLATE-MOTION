'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft, 
  MessageCircle,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { OrderModal, ProductTier } from '@/components/landing/OrderModal';
import { DfyPlanId } from '@/components/landing/DoneForYouSection';

function OrderFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawTier = searchParams.get('tier');
  const validTier: ProductTier = (rawTier && ['starter', 'master', 'lab', 'dfy'].includes(rawTier))
    ? (rawTier as ProductTier)
    : 'lab';

  const rawPlan = searchParams.get('plan');
  const validPlan: DfyPlanId = (rawPlan && ['single', 'bundle', 'retainer'].includes(rawPlan))
    ? (rawPlan as DfyPlanId)
    : 'bundle';

  const couponParam = searchParams.get('coupon') || undefined;

  const [currentTier, setCurrentTier] = useState<ProductTier>(validTier);
  const [currentPlan, setCurrentPlan] = useState<DfyPlanId>(validPlan);

  useEffect(() => {
    setCurrentTier(validTier);
  }, [validTier]);

  useEffect(() => {
    setCurrentPlan(validPlan);
  }, [validPlan]);

  const handleTierChange = (tier: ProductTier, dfyPlan?: DfyPlanId) => {
    setCurrentTier(tier);
    if (dfyPlan) setCurrentPlan(dfyPlan);

    // Keep URL synced live with user's in-form tier changes
    const search = new URLSearchParams();
    search.set('tier', tier);
    if (tier === 'dfy' && (dfyPlan || currentPlan)) {
      search.set('plan', dfyPlan || currentPlan);
    }
    if (couponParam) {
      search.set('coupon', couponParam);
    }
    const newUrl = `/order?${search.toString()}`;
    window.history.replaceState({ modal: 'order', tier, dfyPlan }, '', newUrl);
  };

  const handleBackToCatalog = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/#produk');
    }
  };

  return (
    <div className="w-full">
      {/* Top Breadcrumb & Return Nav */}
      <div className="mx-auto max-w-[760px] px-4 pt-8 pb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <button
          type="button"
          onClick={handleBackToCatalog}
          className="inline-flex items-center gap-1.5 font-bold text-accent hover:text-orange-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Halaman Utama</span>
        </button>

        <div className="flex items-center gap-3 text-dim font-mono text-[11px]">
          <Link href="/#produk" className="hover:text-paper transition-colors">
            Katalog Lisensi
          </Link>
          <span>/</span>
          <span className="text-paper font-semibold">Formulir Checkout Resmi</span>
        </div>
      </div>

      {/* Heroic Title */}
      <div className="mx-auto max-w-[760px] px-4 pb-6 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 mb-2">
          <span className="flex h-2 w-2 rounded-full bg-accent animate-ping" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent">
            HALAMAN PEMESANAN RESMI
          </span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-paper tracking-tight">
          Aktivasi Lisensi &amp; Jasa AUDIRA Motion
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-muted">
          Pilih lisensi digital atau paket Terima Beres. File, instruksi setup Claude Code, dan bantuan WhatsApp diproses instan.
        </p>
      </div>

      {/* Embedded Standalone Order Form */}
      <div className="mx-auto max-w-[760px] px-4 pb-12">
        <OrderModal
          isOpen={true}
          onClose={handleBackToCatalog}
          defaultTier={currentTier}
          defaultDfyPlan={currentPlan}
          initialCoupon={couponParam}
          onTierChange={handleTierChange}
          standalone={true}
        />

        {/* Security & Guarantee Trust Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl border border-line bg-card flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-accent font-bold">
              <Lock className="w-4 h-4" />
              <span>Enkripsi Aman</span>
            </div>
            <p className="text-[11px] text-muted leading-relaxed">
              Transaksi langsung terverifikasi dengan QRIS Bank Nasional dan BCA resmi.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl border border-line bg-card flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Bebas Royalti</span>
            </div>
            <p className="text-[11px] text-muted leading-relaxed">
              Semua video hasil render 1080p 60 FPS bebas watermark untuk klien &amp; ads.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl border border-line bg-card flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <BookOpen className="w-4 h-4" />
              <span>Buku Panduan</span>
            </div>
            <p className="text-[11px] text-muted leading-relaxed">
              Termasuk akses panduan instalasi 5 langkah di <Link href="/panduan" className="text-accent underline">/panduan</Link>.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl border border-line bg-card flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <MessageCircle className="w-4 h-4" />
              <span>Setup 1-on-1</span>
            </div>
            <p className="text-[11px] text-muted leading-relaxed">
              Tim AUDIRA siap mendampingi lewat WhatsApp jika ada kendala instalasi.
            </p>
          </div>
        </div>

        {/* FAQ Quick Link Accordion Note */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl border border-line bg-tile text-xs">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-4 h-4 text-accent shrink-0" />
            <span className="text-muted">
              Punya pertanyaan seputar spesifikasi komputer atau lisensi?
            </span>
          </div>
          <Link
            href="/#faq"
            className="font-bold text-accent hover:underline shrink-0"
          >
            Baca Tanya Jawab (FAQ) ➔
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <div className="min-h-screen bg-ink font-display text-paper antialiased selection:bg-accent selection:text-ink">
      <SiteHeader />
      <main>
        <Suspense
          fallback={
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center text-muted">
              <div className="size-8 rounded-full border-2 border-accent border-t-transparent animate-spin mb-3" />
              <p className="text-xs font-mono">Memuat formulir pemesanan resmi AUDIRA...</p>
            </div>
          }
        >
          <OrderFormContent />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
