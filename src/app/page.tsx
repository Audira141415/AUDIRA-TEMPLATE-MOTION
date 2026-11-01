import Link from 'next/link';
import { ArrowRight, Plus } from 'lucide-react';
import { IdeaForm } from '@/components/landing/IdeaForm';
import { LazyVideo } from '@/components/landing/LazyVideo';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import { MoodDemo } from '@/components/landing/MoodDemo';
import { SimulationShowcase } from '@/components/landing/SimulationShowcase';
import { FORMAT_CARDS, REELS, ReelSample } from '@/components/landing/reels';

const SCRIPT_PREVIEW = [
  { who: 'Ash', me: false, text: 'Audira, gue mau resign besok. Gue mau full-time streaming game!' },
  { who: 'Audira', me: true, text: 'Pertanyaan cepat. Followers lo sekarang berapa?' },
  { who: 'Ash', me: false, text: 'Empat puluh orang. Tapi mereka loyal banget!' },
  { who: 'Audira', me: true, text: 'Tiga puluh sembilan itu akun bot. Satunya lagi nyokap lo.' },
];

const HOOKS = [
  { tag: '00:00.1', title: 'Suara masuk di detik pertama', reel: REELS[0] },
  { tag: 'Caption', title: 'Caption muncul kata per kata', reel: REELS[5] },
  { tag: 'Layar', title: 'Langkah yang disimpan penonton', reel: REELS[4] },
  { tag: 'Format', title: 'Chat dan ticker ala TV', reel: REELS[3] },
  { tag: 'Penutup', title: 'Hook yang memancing komentar', reel: REELS[2] },
];

const FAQ = [
  {
    q: 'Apa itu AUDIRA MOTION?',
    a: 'Studio pembuat reel vertikal. Kamu menulis satu ide, lalu AUDIRA MOTION menulis naskah, mengisi suara tiap karakter, dan merender video 1080×1920 siap unggah.',
  },
  {
    q: 'Apa saja yang dikerjakan otomatis?',
    a: 'Naskah dengan hook dan pertanyaan penutup, suara per karakter, caption kata per kata, gerak kamera, efek suara, dan render MP4. Semua timing dikunci ke suara.',
  },
  {
    q: 'Bisakah saya mengubah apa yang mereka katakan?',
    a: 'Bisa. Setiap baris dialog, emosi, dan hook penutup bisa diedit di studio sebelum dirender.',
  },
  {
    q: 'Di mana video bisa diunggah?',
    a: 'Instagram Reels, TikTok, dan YouTube Shorts. Teks diletakkan di area aman sehingga tidak tertutup tombol aplikasi.',
  },
  {
    q: 'Apakah karakter AI-nya dari perusahaan AI tertentu?',
    a: 'Tidak. Audira dan karakter lain adalah tokoh orisinal AUDIRA, bukan produk atau merek perusahaan mana pun.',
  },
  {
    q: 'Bahasa apa yang didukung?',
    a: 'Bahasa Indonesia sehari-hari, dari yang kalem sampai nyolot, dengan suara berbahasa Indonesia.',
  },
];

const Kicker: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8a8780]">{children}</p>
);

const ReelVideo: React.FC<{ reel: ReelSample; className?: string }> = ({ reel, className = '' }) => (
  <LazyVideo
    src={`/reels/${reel.file}.mp4`}
    poster={`/reels/${reel.file}.jpg`}
    label={`${reel.kind}: ${reel.title}`}
    className={className}
  />
);

const ReelTile: React.FC<{ reel: ReelSample }> = ({ reel }) => (
  <figure className="group relative w-[220px] shrink-0 overflow-hidden rounded-2xl border border-[#2c2b28] bg-black aspect-[9/16] sm:w-[250px]">
    <ReelVideo reel={reel} />
    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-12">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#ea580c]">{reel.kind}</span>
      <span className="mt-1 block text-[15px] font-bold leading-tight text-white">{reel.title}</span>
    </figcaption>
  </figure>
);

export default function LandingPage() {
  const rowA = [...REELS, ...REELS];
  const rowB = [...REELS.slice(7), ...REELS.slice(0, 7), ...REELS.slice(7), ...REELS.slice(0, 7)];

  return (
    <div className="min-h-screen bg-[#141413] font-display text-[#f4f3f0]">
      <style>{`
        @keyframes reel-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .reel-row { animation: reel-marquee 60s linear infinite; }
        .reel-row.reverse { animation-direction: reverse; }
        .reel-row:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .reel-row { animation: none; } }
      `}</style>

      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-[1200px] px-4 pb-14 pt-14 md:px-8 md:pt-20">
          <Kicker>Setiap reel di halaman ini dirender oleh AUDIRA MOTION</Kicker>
          <h1 className="mt-5 max-w-[880px] text-[52px] font-extrabold leading-[0.95] tracking-[-0.055em] sm:text-[84px]">
            Satu ide. Satu reel yang <span className="text-[#ea580c]">dibagikan.</span>
          </h1>
          <p className="mt-6 max-w-[560px] text-[18px] leading-relaxed text-[#b9b6ae]">
            Karakter yang berdebat, papan tulis yang menjelaskan, cerita yang bikin nonton sampai habis. Ditulis, disuarakan,
            dan dirender untuk kamu.
          </p>
          <div className="mt-8">
            <IdeaForm variant={0} />
          </div>
        </section>

        {/* 3D Simulation & What-If Hero Showcase ("One membership. Every format.") */}
        <SimulationShowcase />

        {/* Reel gallery */}
        <section aria-label="Contoh reel" className="flex flex-col gap-4 overflow-hidden py-16">
          <div className="reel-row flex w-max gap-4">
            {rowA.map((r, i) => (
              <ReelTile key={`a${i}`} reel={r} />
            ))}
          </div>
          <div className="reel-row reverse flex w-max gap-4">
            {rowB.map((r, i) => (
              <ReelTile key={`b${i}`} reel={r} />
            ))}
          </div>
        </section>

        {/* Formats */}
        <section id="format" className="scroll-mt-20 border-y border-[#2c2b28] bg-[#1a1a18] py-20">
          <div className="mx-auto max-w-[1200px] px-4 md:px-8">
            <Kicker>{FORMAT_CARDS.length} jenis reel</Kicker>
            <h2 className="mt-4 max-w-[900px] text-[40px] font-extrabold leading-[1] tracking-[-0.045em] sm:text-[60px]">
              Bikin ketawa. Bikin paham. Bikin <span className="text-[#ea580c]">nonton sampai habis.</span>
            </h2>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FORMAT_CARDS.map((c) => (
                <article key={c.reel.format} className="flex flex-col gap-4 rounded-3xl border border-[#2c2b28] bg-[#141413] p-5">
                  <span className="w-fit rounded-md bg-[#ea580c]/15 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#f08a4b]">
                    {c.name}
                  </span>
                  <h3 className="text-[30px] font-extrabold leading-none tracking-[-0.04em]">{c.name}</h3>
                  <p className="text-[15px] leading-relaxed text-[#b9b6ae]">{c.pitch}</p>
                  <div className="mx-auto w-full max-w-[260px] overflow-hidden rounded-2xl border border-[#2c2b28] aspect-[9/16]">
                    <ReelVideo reel={c.reel} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {c.topics.map((t) => (
                      <span key={t} className="rounded-lg border border-[#2c2b28] px-3 py-1.5 text-[13px] text-[#d6d3cc]">
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="text-[17px] font-bold tracking-[-0.01em]">{c.reel.title}</p>
                  <Link
                    href={`/studio?format=${c.reel.format}`}
                    className="mt-auto inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-white hover:text-[#ea580c]"
                  >
                    Buat yang seperti ini <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Moods */}
        <section id="mood" className="mx-auto max-w-[1200px] scroll-mt-20 px-4 py-24 md:px-8">
          <MoodDemo />
        </section>

        {/* How it works */}
        <section id="cara-kerja" className="mx-auto max-w-[1200px] scroll-mt-20 px-4 pb-24 md:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="text-[40px] font-extrabold leading-[1] tracking-[-0.045em] sm:text-[60px]">
              Satu baris masuk.
              <br />
              Satu reel <span className="text-[#ea580c]">keluar.</span>
            </h2>
            <p className="max-w-[320px] text-[17px] text-[#b9b6ae]">Kamu ketik idenya. Kami tulis, suarakan, dan render.</p>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-[1fr_1.3fr_0.9fr]">
            <div className="flex flex-col justify-between gap-10 rounded-3xl border border-[#2c2b28] bg-[#1c1c1a] p-6">
              <Kicker>01 · Kamu ketik</Kicker>
              <p className="text-[30px] font-extrabold leading-[1.1] tracking-[-0.035em]">
                Ash mau resign jadi streamer padahal followers-nya baru 40
                <span className="ml-0.5 inline-block h-[1em] w-[3px] translate-y-1 bg-[#ea580c]" aria-hidden />
              </p>
              <Kicker>Mood · Nyolot</Kicker>
            </div>
            <div className="flex flex-col gap-4 rounded-3xl border border-[#2c2b28] bg-[#1c1c1a] p-6">
              <Kicker>02 · Naskahnya · “Empat puluh followers”</Kicker>
              {SCRIPT_PREVIEW.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-snug ${
                    m.me ? 'self-end bg-[#ea580c] text-white' : 'bg-[#2a2926] text-[#f4f3f0]'
                  }`}
                >
                  <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] opacity-70">{m.who}</span>
                  {m.text}
                </div>
              ))}
              <p className="font-mono text-[11px] text-[#8a8780]">
                + 1 baris lagi · ditutup dengan “Empat puluh followers, cukup buat resign nggak?”
              </p>
            </div>
            <div className="flex flex-col gap-4 rounded-3xl border border-[#2c2b28] bg-[#1c1c1a] p-6">
              <Kicker>03 · Reel-nya</Kicker>
              <div className="mx-auto w-full max-w-[260px] overflow-hidden rounded-2xl border border-[#2c2b28] bg-black aspect-[9/16]">
                <video
                  src="/reels/banter-voice.mp4"
                  poster="/reels/banter.jpg"
                  controls
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-center text-[13px] text-[#8a8780]">Putar dengan suara · 21 detik</p>
            </div>
          </div>
        </section>

        {/* Stop the scroll */}
        <section className="border-y border-[#2c2b28] bg-[#1a1a18] py-20">
          <div className="mx-auto max-w-[1200px] px-4 md:px-8">
            <h2 className="text-[40px] font-extrabold leading-[1] tracking-[-0.045em] sm:text-[60px]">
              Dibuat untuk menghentikan <span className="text-[#ea580c]">scroll.</span>
            </h2>
            <div className="mt-12 flex gap-4 overflow-x-auto pb-4 snap-x">
              {HOOKS.map((h) => (
                <div key={h.title} className="w-[210px] shrink-0 snap-start">
                  <div className="overflow-hidden rounded-2xl border border-[#2c2b28] bg-black aspect-[9/16]">
                    <img src={`/reels/${h.reel.file}.jpg`} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[#ea580c]">{h.tag}</p>
                  <p className="mt-1 text-[18px] font-bold leading-tight tracking-[-0.02em]">{h.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto grid max-w-[1200px] scroll-mt-20 gap-10 px-4 py-24 md:grid-cols-[1fr_1.4fr] md:px-8">
          <h2 className="text-[44px] font-extrabold leading-none tracking-[-0.045em] sm:text-[60px]">Pertanyaan</h2>
          <div className="border-t border-[#3a3935]">
            {FAQ.map((f) => (
              <details key={f.q} className="group border-b border-[#2c2b28] py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold">
                  {f.q}
                  <Plus className="h-4 w-4 shrink-0 text-[#8a8780] transition-transform group-open:rotate-45" />
                </summary>
                <p className="mt-3 max-w-[560px] text-[15px] leading-relaxed text-[#b9b6ae]">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-[#2c2b28] bg-[#0f0f0e]">
          <div className="mx-auto max-w-[1200px] px-4 py-24 md:px-8">
            <h2 className="max-w-[760px] text-[48px] font-extrabold leading-[0.95] tracking-[-0.05em] sm:text-[76px]">
              Punya ide di catatan HP?
            </h2>
            <p className="mt-5 max-w-[480px] text-[17px] text-[#b9b6ae]">Ketik di sini. Satu kalimat cukup untuk satu reel.</p>
            <div className="mt-8">
              <IdeaForm variant={1} />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}