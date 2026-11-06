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
import { OrderRecord } from '@/lib/orders';

interface PanduanLockedGateProps {
  user: PublicUser;
  pendingOrder?: OrderRecord | null;
}

export const PanduanLockedGate: React.FC<PanduanLockedGateProps> = ({ user, pendingOrder }) => {
  const isPendingActivation = Boolean(pendingOrder && !pendingOrder.isLicenseActive);

  return (
    <div className="mx-auto max-w-[800px] px-4 py-16 sm:py-24 font-display">
      <div className="rounded-3xl border-2 border-line bg-card p-6 sm:p-10 shadow-2xl space-y-6 text-center">
        
        {/* Lock Icon */}
        <div className={`mx-auto flex size-16 items-center justify-center rounded-2xl border ${
          isPendingActivation 
            ? 'border-amber-500/50 bg-amber-950/30 text-amber-400 shadow-amber-950/30' 
            : 'border-accent/40 bg-accent/15 text-accent shadow-orange-950/30'
        } shadow-lg`}>
          <Lock className="w-8 h-8" />
        </div>

        {/* Badge & Heading */}
        <div className="space-y-2">
          {isPendingActivation ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-950/60 border border-amber-600/60 px-3 py-1 font-mono text-xs font-bold text-amber-400 uppercase">
              Menunggu Aktivasi Lisensi oleh Superadmin
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 border border-accent/40 px-3 py-1 font-mono text-xs font-bold text-accent uppercase">
              Materi Khusus Pemilik Lisensi Resmi
            </span>
          )}

          <h1 className="text-2xl sm:text-4xl font-black text-paper tracking-tight">
            {isPendingActivation 
              ? 'Lisensi Anda Sedang Menunggu Verifikasi Superadmin' 
              : 'Akses Panduan Instalasi & Prompt Studio Terkunci'}
          </h1>
          <p className="text-sm text-muted max-w-lg mx-auto leading-relaxed">
            Halo <strong className="text-paper">{user.name}</strong> (<span className="text-dim">{user.email}</span>).{' '}
            {isPendingActivation ? (
              <>Pesanan Anda untuk paket <strong className="text-accent">{pendingOrder?.tierName}</strong> telah kami terima. Namun, akses buku panduan dan prompt studio baru dapat dibuka setelah Superadmin AUDIRA mengaktifkan lisensi Anda.</>
            ) : (
              <>Buku panduan instalasi Remotion, script auto-installer terminal, dan generator 29 gaya 3D adalah materi eksklusif untuk akun yang telah memiliki lisensi aktif.</>
            )}
          </p>
        </div>

        {/* Pending Activation Info Box */}
        {isPendingActivation && pendingOrder && (
          <div className="rounded-2xl border border-amber-500/40 bg-amber-950/20 p-5 text-left text-xs space-y-3 max-w-lg mx-auto">
            <div className="flex items-center justify-between border-b border-amber-800/40 pb-2">
              <span className="font-mono text-[11px] font-bold text-amber-400 uppercase">
                RINCIAN PESANAN MENUNGGU AKTIVASI:
              </span>
              <span className="font-mono text-[10px] text-amber-300 bg-amber-900/50 px-2 py-0.5 rounded border border-amber-700">
                {pendingOrder.id}
              </span>
            </div>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-muted">Paket:</span>
                <span className="text-paper font-bold">{pendingOrder.tierName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Nominal:</span>
                <span className="text-accent font-bold">{pendingOrder.amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted">Kode Lisensi:</span>
                <span className="text-cyan-400 font-bold bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded">
                  {pendingOrder.licenseKey}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Status Lisensi:</span>
                <span className="text-amber-400 font-bold">Belum Diaktifkan Superadmin</span>
              </div>
            </div>
            <p className="text-[11px] text-amber-200/90 pt-1">
              Sudah transfer pembayaran? Segera kirim bukti transfer ke WhatsApp Tim AUDIRA. Superadmin kami akan mengaktifkan lisensi Anda dalam 5 menit.
            </p>
          </div>
        )}

        {/* Value Proposition Box (if not pending) */}
        {!isPendingActivation && (
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
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {isPendingActivation ? (
            <>
              <a
                href={`https://wa.me/6285709666240?text=${encodeURIComponent(`Halo Tim AUDIRA, saya ingin mengaktifkan lisensi pesanan ${pendingOrder?.id} (${pendingOrder?.tierName}) atas nama ${user.name} (${user.email}). Berikut saya lampirkan bukti pembayaran.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto btn-primary py-3 px-6 text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-950/40"
              >
                <MessageCircle className="w-4 h-4 fill-black" />
                <span>Minta Aktivasi ke WhatsApp Superadmin ➔</span>
              </a>

              <Link
                href="/admin"
                className="w-full sm:w-auto btn-outline py-3 px-5 text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2"
              >
                <span>Buka Dashboard Pelanggan</span>
              </Link>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Support Help */}
        <div className="border-t border-line pt-4 text-xs text-muted flex flex-col sm:flex-row items-center justify-center gap-2">
          <span>{isPendingActivation ? 'Butuh bantuan aktivasi cepat?' : 'Sudah melakukan transfer pembayaran?'}</span>
          <a
            href={`https://wa.me/6285709666240?text=${encodeURIComponent(`Halo Tim AUDIRA, saya membutuhkan bantuan aktivasi untuk akun ${user.email} (${user.name}).`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 font-bold hover:underline inline-flex items-center gap-1"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Chat Langsung Tim AUDIRA via WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
};

