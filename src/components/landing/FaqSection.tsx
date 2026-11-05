'use client';

import React, { useState } from 'react';
import { Plus, Minus, MessageCircle, HelpCircle } from 'lucide-react';
import { FaqItem, DEFAULT_LANDING_CONFIG } from '@/types/landing';

export interface FaqSectionProps {
  faqs?: FaqItem[];
}

export const FaqSection: React.FC<FaqSectionProps> = ({ faqs: customFaqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = customFaqs && customFaqs.length > 0 ? customFaqs : DEFAULT_LANDING_CONFIG.faqs;

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="mx-auto max-w-[1000px] scroll-mt-10 px-4 py-16 md:px-8 md:py-24">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-1 font-mono text-xs uppercase tracking-[0.14em] text-accent">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Pertanyaan Umum</span>
        </div>
        <h2 className="mt-4 font-display text-[32px] sm:text-[44px] font-bold tracking-[-0.03em] text-paper">
          Tanya Jawab Seputar Skill Claude &amp; 29 Gaya 3D
        </h2>
        <p className="mt-2 text-sm sm:text-base text-muted max-w-xl mx-auto">
          Semua hal penting seputar cara install Skill Claude, 29 preset gaya 3D Remotion, lisensi komersial, dan garansi pendampingan.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={faq.id || idx}
              className={`overflow-hidden rounded-2xl border transition-colors ${isOpen
                  ? 'border-line-strong bg-card'
                  : 'border-line bg-tile hover:border-line-strong hover:bg-card'
                }`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left"
              >
                <span className="font-display text-base sm:text-lg font-bold text-paper">
                  {faq.question}
                </span>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line bg-ink text-muted">
                  {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
              </button>

              {isOpen && (
                <div className="border-t border-line-soft px-5 pb-6 pt-4 sm:px-6">
                  <p className="text-sm sm:text-[15px] leading-relaxed text-muted">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* WhatsApp Support Box */}
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-5 rounded-2xl border border-line bg-card p-6 sm:p-8">
        <div>
          <h4 className="font-display text-lg font-bold text-paper">
            Masih ada pertanyaan yang belum terjawab?
          </h4>
          <p className="mt-1 text-sm text-muted">
            Tanya langsung ke tim AUDIRA lewat WhatsApp. Kami balas secepatnya di jam kerja.
          </p>
        </div>

        <a
          href="https://wa.me/6285709666240?text=Halo%20Tim%20AUDIRA%2C%20saya%20mau%20tanya%20seputar%20Skill%20Claude%20dan%20Lisensi%2029%20Gaya%203D%20Remotion"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-ink hover:brightness-110 shadow-lg shadow-emerald-950/40 transition-all"
        >
          <MessageCircle className="h-4 w-4 fill-ink" />
          <span>Chat WhatsApp (+62 857-0966-6240)</span>
        </a>
      </div>
    </section>
  );
};
