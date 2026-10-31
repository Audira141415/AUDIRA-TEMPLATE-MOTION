import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0e0e11] text-[#f4f3f0] flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="w-16 h-16 rounded-2xl bg-orange-600 flex items-center justify-center text-2xl font-black mb-4 border-2 border-black shadow-brutal">
        404
      </div>
      <h1 className="text-3xl font-black mb-2">Halaman Tidak Ditemukan</h1>
      <p className="text-zinc-400 text-sm max-w-md mb-6">
        Reel atau halaman yang kamu cari mungkin telah dipindahkan atau belum dibuat.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider shadow-brutal-sm border border-black transition-transform active:translate-y-0.5"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}

