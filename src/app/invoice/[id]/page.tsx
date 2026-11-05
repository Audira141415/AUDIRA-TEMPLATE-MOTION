import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { readOrders } from '@/lib/orders';
import { currentUser } from '@/lib/auth';
import { ShieldCheck, Printer, ArrowLeft, Download, CheckCircle2, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Faktur Resmi ${id} · AUDIRA Motion 3D`,
    robots: { index: false }
  };
}

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await currentUser();
  const orders = readOrders();
  const order = orders.find(o => o.id.toLowerCase() === id.toLowerCase());

  if (!order) {
    notFound();
  }

  // Security gate: customer can only view their own invoice (matched by email/wa), superadmin can view all
  const isSuperadmin = user?.role === 'superadmin';
  const isOwner = user && (
    order.customerEmail.toLowerCase() === user.email.toLowerCase() ||
    order.customerWhatsApp.replace(/\D/g, '') === user.email.replace(/\D/g, '')
  );

  // If not logged in, we still allow viewing if they have the exact link (common invoice link pattern for customers)
  // but if logged in and role is customer, they shouldn't view someone else's invoice
  if (user && !isSuperadmin && !isOwner && order.customerEmail !== '-') {
    // If user is logged in as someone else, block
    notFound();
  }

  const isPaid = order.status === 'verified' || order.status === 'sent' || order.status === 'completed';

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#f4f3f0] py-8 sm:py-12 px-4 print:bg-white print:text-black print:p-0">
      <div className="mx-auto max-w-[800px]">
        
        {/* Navigation & Action Bar (Hidden during print) */}
        <div className="flex items-center justify-between gap-4 mb-6 print:hidden">
          <Link
            href={isSuperadmin ? '/admin' : '/pesanan'}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke {isSuperadmin ? 'Admin Panel' : 'Pesanan Saya'}</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="print-btn"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-400 transition-all shadow-lg active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>

        {/* The Invoice Container */}
        <div className="rounded-3xl border border-white/10 bg-[#161615] p-6 sm:p-10 shadow-2xl relative overflow-hidden print:border-none print:shadow-none print:bg-white print:text-black print:p-0">
          
          {/* Watermark Stamp */}
          <div className="absolute top-10 right-6 sm:right-10 pointer-events-none select-none">
            <div className={`px-4 py-1.5 rounded-xl border-2 font-mono font-black text-xs sm:text-sm uppercase tracking-widest rotate-6 ${
              isPaid 
                ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-400 print:text-green-700 print:border-green-700' 
                : 'border-amber-500/60 bg-amber-950/40 text-amber-400 print:text-amber-700 print:border-amber-700'
            }`}>
              {isPaid ? 'LUNAS / VERIFIED' : 'MENUNGGU PEMBAYARAN'}
            </div>
          </div>

          {/* Header */}
          <div className="border-b border-white/10 pb-8 mb-8 print:border-black/20">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="flex size-7 items-center justify-center rounded-xl bg-accent text-ink font-black text-xs print:bg-black print:text-white">
                AU
              </span>
              <div>
                <h1 className="font-extrabold text-xl tracking-tight text-white print:text-black">
                  AUDIRA MULTIMEDIA DIGITAL
                </h1>
                <p className="font-mono text-[11px] text-white/50 print:text-black/60">
                  Official Creative Engine &amp; Commercial 3D Motion Licenses
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-white/40 print:text-black/60 font-mono text-[10px] uppercase">Diterbitkan Oleh</p>
                <p className="font-bold text-white print:text-black mt-0.5">AUDIRA MDA Studio</p>
                <p className="text-white/70 print:text-black/70">WhatsApp: +62 857-0966-6240</p>
                <p className="text-white/70 print:text-black/70">official@audira.my.id</p>
              </div>
              <div className="text-right">
                <p className="text-white/40 print:text-black/60 font-mono text-[10px] uppercase">Nomor Faktur</p>
                <p className="font-mono font-bold text-accent text-sm print:text-black mt-0.5">
                  INV/2026/XI/{order.id}
                </p>
                <p className="text-white/60 print:text-black/60 font-mono text-[11px]">
                  Tgl: {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          {/* Customer & Billing Info */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 mb-8 print:border-black/10 print:bg-gray-50">
            <p className="text-white/40 print:text-black/60 font-mono text-[10px] uppercase mb-2">Ditujukan Kepada</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="font-bold text-white print:text-black text-sm block">{order.customerName}</span>
                <span className="text-white/70 print:text-black/70 block mt-0.5">WhatsApp: {order.customerWhatsApp}</span>
                <span className="text-white/70 print:text-black/70 block">{order.customerEmail}</span>
              </div>
              <div className="sm:text-right">
                <span className="text-white/50 print:text-black/60 block text-[11px]">Metode Pembayaran:</span>
                <span className="font-bold text-white print:text-black">{order.paymentMethod}</span>
                <span className="text-[11px] text-white/50 print:text-black/60 block mt-1">Status Transaksi:</span>
                <span className={`font-mono text-xs font-bold uppercase ${isPaid ? 'text-emerald-400 print:text-green-700' : 'text-amber-400 print:text-amber-700'}`}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Product Items Table */}
          <div className="mb-8">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 print:border-black/20 font-mono text-[10px] uppercase text-white/40 print:text-black/60">
                  <th className="py-2.5">Deskripsi Produk</th>
                  <th className="py-2.5 text-center">Jumlah</th>
                  <th className="py-2.5 text-right">Harga</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 print:divide-black/10">
                <tr>
                  <td className="py-3.5">
                    <p className="font-bold text-white print:text-black text-sm">{order.tierName}</p>
                    <p className="text-white/60 print:text-black/70 text-[11px] mt-0.5">
                      Lisensi Komersial 29 Gaya 3D Remotion 4.0 + Source Code TypeScript + MCP Mesh Claude Code
                    </p>
                    {order.notes && (
                      <p className="text-[11px] text-accent/90 print:text-black/70 mt-1 italic">
                        Catatan: {order.notes}
                      </p>
                    )}
                  </td>
                  <td className="py-3.5 text-center font-mono text-white/80 print:text-black">1 Lisensi</td>
                  <td className="py-3.5 text-right font-mono font-bold text-white print:text-black text-sm">{order.amount}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t border-white/10 print:border-black/20">
                  <td colSpan={2} className="pt-4 text-right font-bold text-white/70 print:text-black/70 text-xs">Total Pembayaran:</td>
                  <td className="pt-4 text-right font-mono font-black text-accent print:text-black text-lg">{order.amount}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* License Key Box */}
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-5 mb-8 print:border-black/30 print:bg-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="font-mono text-[10px] uppercase text-cyan-300 print:text-black font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  KODE LISENSI RESMI TERVERIFIKASI
                </p>
                <p className="font-mono text-base sm:text-lg font-black text-white print:text-black tracking-wider mt-1">
                  {order.licenseKey}
                </p>
              </div>
              <div className="text-left sm:text-right text-[11px] text-cyan-200/70 print:text-black/70 font-mono">
                <span>HAK KOMERSIAL RESMI</span>
                <span className="block text-[10px]">Bebas Royalti · Siap Monetisasi</span>
              </div>
            </div>
          </div>

          {/* Legal Disclaimer & Digital Signature */}
          <div className="pt-6 border-t border-white/10 print:border-black/20 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-[11px] text-white/50 print:text-black/60">
            <div className="max-w-[420px] space-y-1">
              <p className="font-bold text-white/80 print:text-black">Ketentuan Lisensi Komersial:</p>
              <p>
                Lisensi ini memberikan hak penuh kepada pemegang faktur untuk memproduksi, merender, dan memonetisasi video MP4 yang dihasilkan tanpa pembagian royalti. Source code tidak dapat diperjualbelikan kembali secara mentah.
              </p>
            </div>
            
            <div className="text-right">
              <div className="inline-flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 print:text-black font-bold border border-emerald-500/30 px-2 py-1 rounded bg-emerald-950/20">
                <CheckCircle2 className="w-3 h-3" />
                AUDIRA GUARDIAN SHIELD VERIFIED
              </div>
              <p className="text-[10px] text-white/40 print:text-black/60 mt-1">
                Faktur ini sah dan diterbitkan secara digital tanpa tanda tangan basah.
              </p>
            </div>
          </div>

        </div>

      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.getElementById('print-btn')?.addEventListener('click', function() {
              window.print();
            });
          `
        }}
      />
    </div>
  );
}

