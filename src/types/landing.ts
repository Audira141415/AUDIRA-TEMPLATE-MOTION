export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  avatarText: string;
  metric: string;
  metricLabel: string;
  kitUsed: string;
  quote: string;
}

export interface TrustStatItem {
  value: string;
  label: string;
  desc: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface LandingConfig {
  hero: {
    badge: string;
    titleLine1: string;
    titleHighlight: string;
    description: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    showIdeaForm: boolean;
    statPills: string[];
  };
  sectionVisibility: {
    hero: boolean;
    pricing: boolean;
    showcase3D: boolean;
    gallery: boolean;
    dfyService: boolean;
    testimonials: boolean;
    howItWorks: boolean;
    bundleComparison: boolean;
    faq: boolean;
    stickyCta: boolean;
  };
  pricingTiers: {
    starter: {
      name: string;
      price: string;
      originalPrice: string;
      badge: string;
      tagline: string;
    };
    master: {
      name: string;
      price: string;
      originalPrice: string;
      badge: string;
      tagline: string;
    };
    lab: {
      name: string;
      price: string;
      originalPrice: string;
      badge: string;
      tagline: string;
    };
  };
  dfyPlans: {
    single: {
      name: string;
      badge: string;
      countBadge: string;
      price: string;
      originalPrice: string;
      priceSubtitle: string;
      desc: string;
      slaText: string;
      buttonText: string;
    };
    bundle: {
      name: string;
      badge: string;
      countBadge: string;
      price: string;
      originalPrice: string;
      savingsNote: string;
      desc: string;
      slaText: string;
      buttonText: string;
    };
    retainer: {
      name: string;
      badge: string;
      countBadge: string;
      price: string;
      originalPrice: string;
      savingsNote: string;
      desc: string;
      slaText: string;
      buttonText: string;
    };
  };
  testimonials: TestimonialItem[];
  trustStats: TrustStatItem[];
  faqs: FaqItem[];
  contact: {
    whatsappNumber: string;
    csLabel: string;
    bcaAccountNumber: string;
    bcaAccountName: string;
  };
  promoBanner: {
    enabled: boolean;
    badge: string;
    text: string;
    link: string;
  };
  updatedAt: string;
}

export const DEFAULT_LANDING_CONFIG: LandingConfig = {
  hero: {
    badge: 'Audira Skill Motion 3D · Commercial Release',
    titleLine1: 'Video animasi 3D sinematik 60 FPS.',
    titleHighlight: 'Diarahkan otomatis oleh AI.',
    description: 'Platform sutradara gerak 3D otonom berbasis Claude Code, Remotion, dan React Three Fiber. Pilih dari berbagai Signature 3D Styles: arsitektur CAD, exploded view titanium, miniatur voxel, hingga origami kertas. Render MP4 vertikal 1080×1920 @ 60 FPS bebas watermark.',
    primaryCtaText: 'Pilih Lisensi 3D (Mulai Rp149k)',
    primaryCtaLink: '#produk',
    secondaryCtaText: 'Lihat Koleksi Gaya 3D',
    secondaryCtaLink: '#hasil',
    showIdeaForm: true,
    statPills: [
      'Koleksi Gaya 3D Sinematik 60 FPS',
      'Remotion 4.0 + Three.js PBR',
      '1080×1920 60 FPS'
    ]
  },
  sectionVisibility: {
    hero: true,
    pricing: true,
    showcase3D: true,
    gallery: true,
    dfyService: true,
    testimonials: true,
    howItWorks: true,
    bundleComparison: true,
    faq: true,
    stickyCta: true
  },
  pricingTiers: {
    starter: {
      name: 'Starter 3D Pack',
      price: 'Rp149.000',
      originalPrice: 'Rp299.000',
      badge: 'STARTER LISENSI',
      tagline: '5 Koleksi Gaya 3D Paling Populer'
    },
    master: {
      name: 'Master Director Pack',
      price: 'Rp299.000',
      originalPrice: 'Rp599.000',
      badge: 'PILIHAN UTAMA SUTRADARA',
      tagline: 'Seluruh Koleksi Signature 3D Lengkap'
    },
    lab: {
      name: 'Creator Lab Ultimate',
      price: 'Rp499.000',
      originalPrice: 'Rp999.000',
      badge: 'ALL-ACCESS SUITE · BEST VALUE',
      tagline: 'Aset Lengkap + Brand Kit + AI Lokal Offline'
    }
  },
  dfyPlans: {
    single: {
      name: 'Paket Satuan',
      badge: 'UJI COBA',
      countBadge: '1 Video',
      price: 'Rp349.000',
      originalPrice: 'Rp550.000',
      priceSubtitle: '/ video reel',
      desc: 'Pilihan ideal untuk menguji kualitas video AUDIRA atau promo kilat campaign produk Anda.',
      slaText: 'Pengerjaan kilat 24 jam',
      buttonText: 'Order Video Satuan'
    },
    bundle: {
      name: 'Paket 5 Video',
      badge: 'STARTER CREATOR',
      countBadge: '5 Video Reels',
      price: 'Rp1.399.000',
      originalPrice: 'Rp1.745.000',
      savingsNote: 'Hanya ~Rp279.000 per video (Hemat Rp346.000)',
      desc: 'Sempurna untuk mengisi feed selama 1–2 minggu penuh. Menguji variasi angle dan format konten berbeda.',
      slaText: 'Penyelesaian bertahap 2–4 hari kerja',
      buttonText: 'Pesan Paket 5 Video Sekarang'
    },
    retainer: {
      name: 'Monthly Retainer',
      badge: 'DOMINASI BULANAN',
      countBadge: '15 Video / Bulan',
      price: 'Rp3.490.000',
      originalPrice: 'Rp5.500.000',
      savingsNote: 'Hanya ~Rp232.000 per video (Hemat Rp1.745.000)',
      desc: 'Untuk bisnis, agency, atau personal brand yang ingin konsisten upload 1 video tiap 2 hari tanpa repot punya karyawan video editor.',
      slaText: 'Prioritas antrean kilat VIP & direct line Tanya AUDIRA',
      buttonText: 'Konsultasi Retainer Bulanan'
    }
  },
  testimonials: [
    {
      id: '1',
      name: 'Budi Santoso',
      role: 'Principal Architect & 3D Visualizer, Surabaya',
      avatarText: 'BS',
      metric: '15 Menit',
      metricLabel: 'Dari biasanya 3 hari render',
      kitUsed: 'BUILDFORGE & DRAFTFORGE',
      quote: 'Format BUILDFORGE dan DRAFTFORGE benar-benar memangkas waktu bikin video animasi presentasi arsitektur. Klien properti saya kagum melihat perakitan struktur baja bertahap 60 FPS yang mulus tanpa perlu render berjam-jam di software 3D berat.'
    },
    {
      id: '2',
      name: 'Rian Pratama',
      role: 'Tech Creator & Gadget Reviewer, Jakarta',
      avatarText: 'RP',
      metric: '480k Views',
      metricLabel: 'Dalam 2 minggu penayangan',
      kitUsed: 'PRECISION & CYBERFORGE',
      quote: 'Exploded view jam tangan titanium di kit PRECISION membuat video komersial brand gadget saya tampak sekelas iklan Apple. Ditambah normalisasi vokal Cartesia Indonesia, retensi penonton di Reels naik drastis.'
    },
    {
      id: '3',
      name: 'Sarah Melati',
      role: 'Managing Director Agensi Kreatif, Bandung',
      avatarText: 'SM',
      metric: '5 Klien UMKM',
      metricLabel: 'Balik modal di hari pertama',
      kitUsed: 'CREATOR LAB ULTIMATE',
      quote: 'Paket Creator Lab seharga Rp499.000 adalah investasi digital terbaik tahun ini. Sekali bayar, kami punya koleksi lengkap variasi gaya 3D dan full codebase Remotion untuk melayani video reels puluhan klien tanpa bayar royalti bulanan.'
    }
  ],
  trustStats: [
    { value: 'MULTI', label: 'Gaya 3D Sinematik', desc: 'Arsitektur, Taktil, Sains & Komersial' },
    { value: '60 FPS', label: 'Fluid Motion', desc: '1080×1920 Vertikal Ultra-Smooth' },
    { value: '100%', label: 'Bebas Royalti', desc: 'Hak Cipta Penuh untuk Klien & Iklan' },
    { value: '< 24 Jam', label: 'SLA Terima Beres', desc: 'Pengerjaan Kilat Studio AUDIRA' }
  ],
  faqs: [
    {
      "id": "faq-1",
      "question": "Apa sebenarnya yang saya dapatkan saat membeli produk ini?",
      "answer": "Anda membeli Paket Lengkap AI Creative Suite yang terdiri dari: (1) Skill Resmi Claude Code (AUDIRA Motion Director & MCP Mesh) yang melatih Claude bertindak sebagai sutradara gerak 3D otonom di terminal/editor Anda, (2) Koleksi Lengkap Signature Styles & Source Code 3D Remotion 4.0 berbasis React Three Fiber 60 FPS, (3) Buku Panduan Instalasi Lengkap 5 Langkah & Auto-Installer di portal pelanggan resmi dari nol sampai video pertama Anda berhasil dirender, dan (4) Lisensi Komersial Seumur Hidup (Lifetime) bebas royalti."
    },
    {
      "id": "faq-2",
      "question": "Bagaimana cara menginstal dan mengaktifkan Skill ini ke Claude Code?",
      "answer": "Sangat praktis dan cepat! Buka terminal di laptop/PC Anda pada folder proyek, lalu daftarkan MCP Server ke Claude Code dengan perintah satu baris. Seketika Claude akan mengenali seluruh gaya visual 3D, arsitektur Remotion, dan perintah /audira-motion untuk meriset naskah, menyusun storyboard Three.js, serta merender video secara otomatis. Panduan visual lengkap terbuka otomatis di portal pelanggan Anda setelah pembelian."
    },
    {
      "id": "faq-3",
      "question": "Apakah saya harus bisa coding atau paham Three.js untuk memakainya?",
      "answer": "Sama sekali tidak wajib! Itulah tujuan utama Skill Claude ini diciptakan. Claude yang akan menulis komponen Three.js, mengatur pencahayaan PBR, memposisikan kamera 3D, menyinkronkan audio, dan memicu perintah render Remotion untuk Anda. Anda cukup mengetikkan ide produk atau naskah dalam Bahasa Indonesia biasa, dan Claude yang mengurus seluruh eksekusi teknisnya."
    },
    {
      "id": "faq-4",
      "question": "Apa saja koleksi gaya visual 3D yang didapatkan dan bagaimana Claude memilihnya?",
      "answer": "Claude dibekali logika cerdas untuk menganalisis topik naskah Anda dan otomatis memilihkan gaya visual paling menjual dari berbagai preset: Arsitektur & CAD (BUILDFORGE & DRAFTFORGE), Taktil & Stop-Motion (CLAYFORGE lempung, PAPERFORGE origami, KNITFORGE rajutan), Teknologi & Hardware (PRECISION exploded view titanium, CYBERFORGE hologram Matrix, CHIPFORGE PCB), serta Sains (GEOFORGE lapisan tanah, COSMOFORGE antariksa). Anda juga bisa meminta gaya spesifik langsung ke Claude."
    },
    {
      "id": "faq-5",
      "question": "Apakah harus berlangganan Claude Pro atau bisa pakai model AI lain?",
      "answer": "Skill ini dirancang optimal untuk Claude 3.5 Sonnet / 3.7 Sonnet melalui Claude Code CLI atau Claude Desktop. Namun, arsitektur MCP kami juga kompatibel dengan Cursor IDE, Windsurf, VS Code (ekstensi Cline / Roo Code), serta dapat dikombinasikan dengan API OpenAI GPT-4o, Google Gemini, atau model AI offline lokal (Ollama Qwen-Coder) tanpa biaya langganan bulanan ke AUDIRA."
    },
    {
      "id": "faq-6",
      "question": "Apakah video hasil rendernya boleh dipakai untuk komersial dan dijual ke klien?",
      "answer": "100% Boleh dan Bebas Royalti! Seluruh video MP4 resolusi 1080×1920 60 FPS yang Anda render adalah hak milik Anda sepenuhnya. Anda bebas menggunakannya untuk monetisasi di TikTok, YouTube Shorts, Instagram Reels, iklan berbayar (Meta/TikTok Ads), maupun menjual jasa pembuatan video motion graphic seharga jutaan rupiah ke klien agensi."
    },
    {
      "id": "faq-7",
      "question": "Bagaimana jika saya gaptek atau butuh bantuan saat proses instalasi?",
      "answer": "Anda tidak sendirian. Kami menyediakan Garansi Pendampingan 1-on-1 via WhatsApp Resmi Tim AUDIRA (+62 821-1200-1600). Selain itu, Anda mendapatkan akses ke portal pelanggan (/admin & /pesanan) dan buku panduan instalasi 5 langkah. Tim teknis kami siap memandu via chat atau remote screen sharing sampai video pertama Anda berhasil dirender di laptop Anda."
    },
    {
      "id": "faq-8",
      "question": "Bisa dibuatkan video terima beres kalau saya tidak punya waktu operasikan Claude sendiri?",
      "answer": "Tentu saja bisa! Kami menyediakan layanan VIP Done-For-You (Jasa Terima Beres 24 Jam). Anda cukup mengirimkan materi atau link produk di WhatsApp, tim kreator AUDIRA yang akan meriset angle viral, menyusun naskah persuasif, memilihkan style 3D terbaik, menyinkronkan audio suara AI jernih, dan mengirimkan file video MP4 siap posting dalam waktu 24 jam."
    }
  ],
  contact: {
    whatsappNumber: '6282112001600',
    csLabel: 'Tanya AUDIRA',
    bcaAccountNumber: '8691888291',
    bcaAccountName: 'Agus Dwi Rianto'
  },
  promoBanner: {
    enabled: true,
    badge: 'PROMO SPESIAL 2026',
    text: 'Gratis Bundling AUDIRA Skill Mesh (MCP Server) + Panduan Lengkap untuk Setiap Pembelian Lisensi Resmi',
    link: '#produk'
  },
  updatedAt: new Date().toISOString()
};

