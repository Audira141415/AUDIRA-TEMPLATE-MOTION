'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Lock, 
  Sparkles, 
  ShoppingBag, 
  ArrowRight, 
  MessageCircle, 
  ShieldCheck, 
  Key,
  ExternalLink 
} from 'lucide-react';
import { PublicUser } from '@/lib/auth';

interface PanduanLockedGateProps {
  user: PublicUser;
}

export const PanduanLockedGate: React.FC<PanduanLockedGateProps> = ({ user }) => {
  return (
    <div className="mx-auto max-w-[800px] px-4 py-16 sm:py-24 font-display">
      <div className="rounded-3xl border-2 border-line bg-card p-6 sm:p-10 shadow-2xl space-y-6 text-center">
        
        {/* Lock Icon */}
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-accent/40 bg-accent/15 text-accent shadow-lg shadow-orange-950/30">
          <Lock className="w-8 h-8" />
        </div>

        {/* Badge & Heading */}
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 border border-accent/40 px-3 py-1 font-mono text-xs font-bold text-accent uppercase">
            Materi Khusus Pemilik Lisensi Resmi
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-paper tracking-tight">
            Akses Panduan Instalasi &amp; Prompt Studio Terkunci
          </h1>
          <p className="text-sm text-muted max-w-lg mx-auto leading-relaxed">
            Halo <strong className="text-paper">{user.name}</strong> (<span className="text-dim">{user.email}</span>). Buku panduan instalasi Remotion, script auto-installer terminal, dan generator 29 gaya 3D adalah materi eksklusif untuk akun yang telah memiliki lisensi aktif.
          </p>
        </div>

        {/* Value Proposition Box */}
        <div className="rounded-2xl border border-line bg-ink p-5 text-left text-xs space-y-3 max-w-md mx-auto">
          <span className="font-mono text-[11px] font-bold text-dim uppercase block">
            YANG ANDA DAPATKAN SETELAH MEMILIKI LISENSI:
          </span>
          <ul className="space-y-2 text-muted">
            <li className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Kode Lisensi Seumur Hidup (Lifetime) bebas royalti</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Akses penuh buku panduan 5 langkah &amp; auto-installer terminal</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Interactive Prompt Studio untuk 29 gaya visual 3D sinematik</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Garansi pendampingan setup 1-on-1 via WhatsApp sampai render berhasil</span>
            </li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/order"
            className="w-full sm:w-auto btn-primary py-3 px-6 text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 shadow-lg shadow-orange-950/40"
          >
            <Sparkles className="w-4 h-4 fill-ink" />
            <span>Beli Lisensi Sekarang (Mulai Rp149.000)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/pesanan"
            className="w-full sm:w-auto btn-outline py-3 px-5 text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-dim" />
            <span>Cek Status Pembayaran</span>
          </Link>
        </div>

        {/* Support Help */}
        <div className="border-t border-line pt-4 text-xs text-muted flex flex-col sm:flex-row items-center justify-center gap-2">
          <span>Sudah melakukan transfer pembayaran?</span>
          <a
            href={`https://wa.me/6285709666240?text=${encodeURIComponent(`Halo Tim AUDIRA, saya sudah transfer untuk akun ${user.email} (${user.name}) tapi akses panduan masih terkunci. Mohon bantuannya.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 font-bold hover:underline inline-flex items-center gap-1"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Konfirmasi ke Tim AUDIRA via WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
};
