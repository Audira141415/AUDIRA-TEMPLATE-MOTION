'use client';

import React, { useState } from 'react';
import { Plus, Minus, MessageCircle, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'Apakah harus punya Claude Pro atau bayar langganan bulanan?',
    answer:
      'Tidak perlu. AUDIRA Template Motion dapat digunakan langsung di web browser tanpa langganan wajib. Anda bisa memakai mesin Web Studio langsung, menghubungkannya ke Ollama AI lokal di laptop (100% gratis & offline tanpa batas kuota), atau memasukkan API key Anda sendiri (Claude 3.5 Sonnet, OpenAI GPT-4o, Google Gemini, atau DeepSeek R1).',
  },
  {
    question: 'Berapa spesifikasi laptop / PC yang dibutuhkan?',
    answer:
      'Untuk menggunakan Web Studio di browser dan merender format 2D (Explainer, Whiteboard, Kinetic Type, Chat, dll.), laptop standar dengan RAM 8GB sudah sangat lancar. Jika Anda ingin menjalankan model AI lokal Ollama 4B (Qwen3.5-4B-3D-Coder) secara offline, disarankan RAM 16GB dengan prosesor modern atau kartu grafis (NVIDIA GTX/RTX atau Apple Silicon M-series).',
  },
  {
    question: 'Apakah video hasilnya boleh dipakai untuk komersial dan proyek klien?',
    answer:
      '100% Boleh dan bebas royalti! Seluruh video MP4 1080p yang Anda render menjadi hak milik Anda sepenuhnya. Anda bebas memonetisasinya di TikTok, YouTube Shorts, Instagram Reels, akun afiliasi, hingga menjual jasa pembuatan video ke klien agensi.',
  },
  {
    question: 'Bagaimana cara kerja suara voiceover Bahasa Indonesia di AUDIRA?',
    answer:
      'AUDIRA dilengkapi integrasi mesin suara vokal Bahasa Indonesia (Cartesia Sonic AI & Browser Speech Engine) dengan 7 pilihan mood karakter: Kalem, Hangat, Motivasi, Hyped, Frustrasi, Marah, hingga Nyolot. Setiap kata yang diucapkan otomatis tersinkronisasi presisi milidetik dengan animasi subtitel karaoke di layar.',
  },
  {
    question: 'Apa bedanya AUDIRA dengan prompt tool biasa yang ada di internet?',
    answer:
      'Tool biasa hanya memberikan teks prompt polos yang harus Anda copy-paste ke After Effects atau Premiere Pro secara manual berjam-jam. AUDIRA adalah ekosistem video engine lengkap: naskah ditulis otomatis oleh AI, disuarakan oleh vokal AI bahasa Indonesia, ditata ke canvas vertikal 9:16, dan dirender jadi file MP4 1080p 60 FPS siap upload.',
  },
  {
    question: 'Bagaimana jika saya bingung atau butuh panduan langsung?',
    answer:
      'Tim pengembang AUDIRA menyediakan layanan support cepat melalui WhatsApp resmi di 0857-0966-6240. Kami siap membantu membimbing instalasi skill, konfigurasi AI lokal, hingga video pertama Anda berhasil dirender.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
          Sebelum kamu mulai bikin video.
        </h2>
        <p className="mt-2 text-sm sm:text-base text-muted max-w-xl mx-auto">
          Semua hal penting seputar cara pakai, lisensi komersial, spek hardware, dan dukungan teknis.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={faq.question}
              className={`overflow-hidden rounded-2xl border transition-colors ${
                isOpen
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

      {/* WhatsApp Support Box (Voynan Trust Element) */}
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
          href="https://wa.me/6285709666240?text=Halo%20AUDIRA%2C%20saya%20mau%20tanya%20seputar%20AUDIRA%20Template%20Motion"
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
