'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PromoBanner } from '@/components/landing/PromoBanner';
import { SiteHeader } from '@/components/site/SiteHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { ProductPackages } from '@/components/landing/ProductPackages';
import { Remotion3DShowcase } from '@/components/landing/Remotion3DShowcase';
import { GallerySection } from '@/components/landing/GallerySection';
import { DoneForYouSection } from '@/components/landing/DoneForYouSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { BundleSection } from '@/components/landing/BundleSection';
import { FaqSection } from '@/components/landing/FaqSection';
import { SiteFooter } from '@/components/site/SiteFooter';
import { OrderModal, ProductTier } from '@/components/landing/OrderModal';
import { DfyPlanId } from '@/components/landing/DoneForYouSection';
import { StickyCtaBar } from '@/components/landing/StickyCtaBar';
import { LandingConfig, DEFAULT_LANDING_CONFIG } from '@/types/landing';

export default function LandingPage() {
  const [config, setConfig] = useState<LandingConfig>(DEFAULT_LANDING_CONFIG);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<ProductTier>('lab');
  const [selectedDfyPlan, setSelectedDfyPlan] = useState<DfyPlanId>('bundle');
  const previousUrlRef = useRef<string | null>(null);

  useEffect(() => {
    fetch('/api/landing-config')
      .then((res) => res.json())
      .then((data) => {
        if (data.config) {
          setConfig(data.config);
        }
      })
      .catch((err) => {
        console.error('Gagal memuat konfigurasi landing page:', err);
      });
  }, []);

  // Synchronize modal state with URL deep-linking and browser navigation (Back / Forward)
  useEffect(() => {
    const parseUrlAndApply = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const pathname = window.location.pathname;
      const hash = window.location.hash;

      const isOrderUrl = pathname === '/order' || params.get('order') === 'open' || params.get('order') === 'true' || hash === '#order';
      const tierParam = params.get('tier') as ProductTier | null;
      const planParam = params.get('plan') as DfyPlanId | null;

      if (isOrderUrl || tierParam) {
        if (tierParam && ['starter', 'master', 'lab', 'dfy'].includes(tierParam)) {
          setSelectedTier(tierParam);
        }
        if (planParam && ['single', 'bundle', 'retainer'].includes(planParam)) {
          setSelectedDfyPlan(planParam);
        }
        setIsOrderModalOpen(true);
      } else {
        setIsOrderModalOpen(false);
      }
    };

    // Check on initial mount
    parseUrlAndApply();

    // Listen to browser Back / Forward events
    const handlePopState = () => {
      parseUrlAndApply();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenOrderModal = (tier: ProductTier = 'lab', dfyPlan: DfyPlanId = 'bundle') => {
    setSelectedTier(tier);
    setSelectedDfyPlan(dfyPlan);
    setIsOrderModalOpen(true);

    if (typeof window !== 'undefined') {
      // Remember where the user was before opening the modal
      if (window.location.pathname !== '/order') {
        previousUrlRef.current = window.location.pathname + window.location.search + window.location.hash;
      }

      // Update URL to /order?tier=... cleanly without full page refresh
      const search = new URLSearchParams();
      search.set('tier', tier);
      if (tier === 'dfy' && dfyPlan) {
        search.set('plan', dfyPlan);
      }
      const newUrl = `/order?${search.toString()}`;
      window.history.pushState({ modal: 'order', tier, dfyPlan }, '', newUrl);
    }
  };

  const handleTierChange = (tier: ProductTier, dfyPlan?: DfyPlanId) => {
    setSelectedTier(tier);
    if (dfyPlan) setSelectedDfyPlan(dfyPlan);

    if (typeof window !== 'undefined') {
      const search = new URLSearchParams();
      search.set('tier', tier);
      if (tier === 'dfy' && (dfyPlan || selectedDfyPlan)) {
        search.set('plan', dfyPlan || selectedDfyPlan);
      }
      const newUrl = `/order?${search.toString()}`;
      window.history.replaceState({ modal: 'order', tier, dfyPlan }, '', newUrl);
    }
  };

  const handleCloseOrderModal = () => {
    setIsOrderModalOpen(false);

    if (typeof window !== 'undefined' && window.location.pathname === '/order') {
      const returnTo = previousUrlRef.current && !previousUrlRef.current.startsWith('/order')
        ? previousUrlRef.current
        : '/#produk';
      window.history.pushState({}, '', returnTo);
    }
  };

  return (
    <div className="min-h-screen bg-ink font-display text-paper antialiased selection:bg-accent selection:text-ink">
      {/* 0. Top Promo Announcement Banner */}
      {config.promoBanner?.enabled && (
        <PromoBanner {...config.promoBanner} />
      )}

      {/* 1. Header Navigation */}
      <SiteHeader />

      <main className="flex flex-col">
        {/* 2. Hero Section (#top) - Dual 9:16 Video Reels, Headline, Value Prop & Idea Input */}
        {config.sectionVisibility.hero && (
          <HeroSection config={config.hero} />
        )}

        {/* 3. Product Packages (#produk) - 3 Tiers (Starter, Master, Creator Lab) */}
        {config.sectionVisibility.pricing && (
          <ProductPackages 
            onBuyTier={handleOpenOrderModal}
            pricingConfig={config.pricingTiers}
          />
        )}

        {/* 4. AUDIRA Remotion 3D Engine Showcase (#remotion-3d) - Signature Styles */}
        {config.sectionVisibility.showcase3D && (
          <Remotion3DShowcase />
        )}

        {/* 5. Interactive Video Gallery (#hasil) - Signature 3D Styles, 5 Pillars, Single Play Lock */}
        {config.sectionVisibility.gallery && (
          <GallerySection activeTab="all" />
        )}

        {/* 6. VIP Done-For-You Agency Service (#jasa) - Terima Beres 24 Jam by AUDIRA Studio */}
        {config.sectionVisibility.dfyService && (
          <DoneForYouSection 
            onBuyPlan={(planId) => handleOpenOrderModal('dfy', planId)} 
            dfyConfig={config.dfyPlans}
          />
        )}

        {/* 7. Social Proof & Case Studies (#testimoni) - Kreator, Arsitek, & Agensi */}
        {config.sectionVisibility.testimonials && (
          <TestimonialsSection 
            items={config.testimonials}
            stats={config.trustStats}
          />
        )}

        {/* 8. How It Works (#cara-kerja) - 3 Steps (Ketik -> Suarakan -> Render) + Live Demo */}
        {config.sectionVisibility.howItWorks && (
          <HowItWorksSection />
        )}

        {/* 9. Bundle Creator Lab (#bundle) - Best Value Rp499k + Feature Comparison Table */}
        {config.sectionVisibility.bundleComparison && (
          <BundleSection 
            onBuyTier={handleOpenOrderModal} 
          />
        )}

        {/* 10. FAQ Accordion (#faq) - Hardware Specs, Ollama/Claude, Commercial License, WhatsApp Support */}
        {config.sectionVisibility.faq && (
          <FaqSection faqs={config.faqs} />
        )}
      </main>

      {/* 11. Footer with Heroic CTA Banner & Support */}
      <SiteFooter />

      {/* 12. Sticky Floating Conversion Bar (Appears on Scroll) */}
      {config.sectionVisibility.stickyCta && (
        <StickyCtaBar onOpenOrderModal={handleOpenOrderModal} />
      )}

      {/* 13. Interactive Checkout & License Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={handleCloseOrderModal}
        defaultTier={selectedTier}
        defaultDfyPlan={selectedDfyPlan}
        onTierChange={handleTierChange}
      />
    </div>
  );
}
