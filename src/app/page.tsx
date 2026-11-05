'use client';

import React, { useState } from 'react';
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
import { StickyCtaBar } from '@/components/landing/StickyCtaBar';
import { WhatsAppFloatingWidget } from '@/components/landing/WhatsAppFloatingWidget';

export default function LandingPage() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<ProductTier>('lab');

  const handleOpenOrderModal = (tier: ProductTier = 'lab') => {
    setSelectedTier(tier);
    setIsOrderModalOpen(true);
  };

  const handleCloseOrderModal = () => {
    setIsOrderModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-ink font-display text-paper antialiased selection:bg-accent selection:text-ink">
      {/* 1. Header Navigation */}
      <SiteHeader />

      <main className="flex flex-col">
        {/* 2. Hero Section (#top) - Dual 9:16 Video Reels, Headline, Value Prop & Idea Input */}
        <HeroSection />

        {/* 3. Product Packages (#produk) - 3 Tiers (Starter Rp49k, Master Rp79k, Creator Lab Rp109k) */}
        <ProductPackages 
          onBuyTier={handleOpenOrderModal} 
        />

        {/* 4. AUDIRA Remotion 3D Engine Showcase (#remotion-3d) - 29 Signature Styles */}
        <Remotion3DShowcase />

        {/* 5. Interactive Video Gallery (#hasil) - 29 Signature 3D Styles, 5 Pillars, Single Play Lock */}
        <GallerySection activeTab="all" />

        {/* 6. VIP Done-For-You Agency Service (#jasa) - Terima Beres 24 Jam by AUDIRA Studio */}
        <DoneForYouSection />

        {/* 7. Social Proof & Case Studies (#testimoni) - Kreator, Arsitek, & Agensi */}
        <TestimonialsSection />

        {/* 8. How It Works (#cara-kerja) - 3 Steps (Ketik -> Suarakan -> Render) + Live Demo */}
        <HowItWorksSection />

        {/* 9. Bundle Creator Lab (#bundle) - Best Value Rp109k + Feature Comparison Table */}
        <BundleSection 
          onBuyTier={handleOpenOrderModal} 
        />

        {/* 10. FAQ Accordion (#faq) - Hardware Specs, Ollama/Claude, Commercial License, WhatsApp Support */}
        <FaqSection />
      </main>

      {/* 11. Footer with Heroic CTA Banner & Support */}
      <SiteFooter />

      {/* 12. Sticky Floating Conversion Bar (Appears on Scroll) */}
      <StickyCtaBar onOpenOrderModal={handleOpenOrderModal} />

      {/* 13. Direct WhatsApp Quick Support Floating Widget */}
      <WhatsAppFloatingWidget />

      {/* 14. Interactive Checkout & License Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={handleCloseOrderModal}
        defaultTier={selectedTier}
      />
    </div>
  );
}
