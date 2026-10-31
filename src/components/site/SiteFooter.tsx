import Link from 'next/link';

const COLUMNS = [
  {
    title: 'Produk',
    links: [
      { href: '/studio', label: 'Studio' },
      { href: '/prompts', label: 'Prompt siap salin' },
      { href: '/#format', label: '20 format' },
      { href: '/#mood', label: 'Tujuh mood' },
    ],
  },
  {
    title: 'Panduan',
    links: [
      { href: '/#cara-kerja', label: 'Cara kerja' },
      { href: '/#faq', label: 'FAQ' },
    ],
  },
  {
    title: 'AUDIRA',
    links: [
      { href: 'https://audira.my.id', label: 'audira.my.id' },
      { href: 'mailto:official@audira.my.id', label: 'Kontak' },
    ],
  },
];

export const SiteFooter: React.FC = () => (
  <footer className="border-t border-[#2c2b28] bg-[#0f0f0e] font-display text-[#f4f3f0]">
    <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-8">
      <div>
        <p className="text-[17px] font-extrabold tracking-[-0.02em]">
          AUDIRA <span className="text-[#ea580c]">Motion</span>
        </p>
        <p className="mt-3 max-w-[260px] text-[14px] leading-relaxed text-[#8a8780]">
          Ketik satu ide, dapat reel vertikal yang sudah ditulis, disuarakan, dan dirender.
        </p>
      </div>
      {COLUMNS.map((col) => (
        <div key={col.title}>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8a8780]">{col.title}</p>
          <ul className="mt-4 space-y-3 text-[14px]">
            {col.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-[#d6d3cc] transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="border-t border-[#2c2b28]">
      <p className="mx-auto max-w-[1200px] px-4 py-6 text-[13px] text-[#8a8780] md:px-8">© 2026 Audira Multimedia Digital</p>
    </div>
  </footer>
);
