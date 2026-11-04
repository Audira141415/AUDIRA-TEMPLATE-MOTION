import React from 'react';
import { SiteHeader } from '@/components/site/SiteHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { ProductPackages } from '@/components/landing/ProductPackages';
import { Remotion3DShowcase } from '@/components/landing/Remotion3DShowcase';
import { GallerySection } from '@/components/landing/GallerySection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { BundleSection } from '@/components/landing/BundleSection';
import { FaqSection } from '@/components/landing/FaqSection';
import { SiteFooter } from '@/components/site/SiteFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ink font-display text-paper antialiased selection:bg-accent selection:text-ink">
      {/* 1. Header Navigation */}
      <SiteHeader />

      <main className="flex flex-col">
        {/* 2. Hero Section (#top) - Dual 9:16 Video Reels, Headline, Value Prop & Idea Input */}
        <HeroSection />

        {/* 3. Product Packages (#produk) - 3 Tiers (Explainer Rp29k, Skits Rp49k, 3D Rp69k) + Upgrade Callout */}
        <ProductPackages />

        {/* 4. AUDIRA Remotion 3D Engine Showcase (#remotion-3d) - 20 Signature Styles, 4-Card Row */}
        <Remotion3DShowcase />

        {/* 5. Interactive Video Gallery (#hasil) - Voynan-Grade Cards, 3 Tags, Quote Snippet, Single Play Lock */}
        <GallerySection activeTab="gaming" />

        {/* 6. How It Works (#cara-kerja) - 3 Steps (Ketik -> Suarakan -> Render) + Live Demo */}
        <HowItWorksSection />

        {/* 7. Bundle Creator Lab (#bundle) - Best Value Rp109k + Feature Comparison Table */}
        <BundleSection />

        {/* 8. FAQ Accordion (#faq) - Hardware Specs, Ollama/Claude, Commercial License, WhatsApp Support */}
        <FaqSection />
      </main>

      {/* 9. Footer with Heroic CTA Banner & Support */}
      <SiteFooter />
    </div>
  );
}
