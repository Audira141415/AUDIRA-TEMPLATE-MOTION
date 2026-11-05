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
    description: 'Platform sutradara gerak 3D otonom berbasis Claude Code, Remotion, dan React Three Fiber. Pilih dari 29 Signature 3D Styles: arsitektur CAD, exploded view titanium, miniatur voxel, hingga origami kertas. Render MP4 vertikal 1080×1920 @ 60 FPS bebas watermark.',
    primaryCtaText: 'Pilih Lisensi 3D (Mulai Rp149k)',
    primaryCtaLink: '#produk',
    secondaryCtaText: 'Lihat 29 Gaya Sinematik',
    secondaryCtaLink: '#hasil',
    showIdeaForm: true,
    statPills: [
      '29 Gaya 3D Sinematik 60 FPS',
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
      tagline: 'Seluruh 29 Koleksi Signature 3D Lengkap'
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
      quote: 'Paket Creator Lab seharga Rp499.000 adalah investasi digital terbaik tahun ini. Sekali bayar, kami punya 29 variasi gaya 3D dan full codebase Remotion untuk melayani video reels puluhan klien tanpa bayar royalti bulanan.'
    }
  ],
  trustStats: [
    { value: '29', label: 'Gaya 3D Sinematik', desc: 'Arsitektur, Taktil, Sains & Komersial' },
    { value: '60 FPS', label: 'Fluid Motion', desc: '1080×1920 Vertikal Ultra-Smooth' },
    { value: '100%', label: 'Bebas Royalti', desc: 'Hak Cipta Penuh untuk Klien & Iklan' },
    { value: '< 24 Jam', label: 'SLA Terima Beres', desc: 'Pengerjaan Kilat Studio AUDIRA' }
  ],
  faqs: [
    {
      id: 'faq-1',
      question: 'Apakah harus punya Claude Pro atau bayar langganan bulanan?',
      answer: 'Tidak perlu langganan bulanan. AUDIRA Motion adalah aset sekali bayar untuk seumur hidup. Anda bisa menjalankannya di laptop/PC dengan Remotion CLI / Claude Code (/audira-motion), menghubungkannya ke Ollama AI lokal di laptop (100% gratis & offline tanpa batas kuota), atau memasukkan API key Anda sendiri (Claude 3.5 Sonnet, OpenAI GPT-4o, Google Gemini, atau DeepSeek R1).'
    },
    {
      id: 'faq-2',
      question: 'Berapa spesifikasi laptop / PC yang dibutuhkan?',
      answer: 'Untuk menjalankan Remotion 3D di komputer atau laptop, RAM 8GB–16GB sudah sangat lancar. Mesin 3D Three.js dan WebGL memanfaatkan akselerasi GPU perangkat keras Anda (NVIDIA GeForce, AMD Radeon, Intel Iris/Arc, atau Apple Silicon M-series). Untuk menjalankan model AI lokal Ollama (Qwen3.5-4B 3D-Coder) secara offline tanpa kuota, disarankan minimal RAM 16GB.'
    },
    {
      id: 'faq-3',
      question: 'Apakah video hasilnya boleh dipakai untuk komersial dan proyek klien?',
      answer: '100% Boleh dan bebas royalti! Seluruh video MP4 1080p yang Anda render menjadi hak milik Anda sepenuhnya. Anda bebas memonetisasinya di TikTok, YouTube Shorts, Instagram Reels, akun afiliasi, hingga menjual jasa pembuatan video ke klien agensi.'
    },
    {
      id: 'faq-4',
      question: 'Bagaimana cara kerja suara voiceover Bahasa Indonesia di AUDIRA?',
      answer: 'AUDIRA dilengkapi integrasi mesin suara vokal Bahasa Indonesia (Cartesia Sonic AI & Browser Speech Engine) dengan 7 pilihan mood karakter: Kalem, Hangat, Motivasi, Hyped, Frustrasi, Marah, hingga Nyolot. Setiap kata yang diucapkan otomatis tersinkronisasi presisi milidetik dengan animasi subtitel karaoke di layar.'
    },
    {
      id: 'faq-5',
      question: 'Apa bedanya AUDIRA dengan prompt tool biasa yang ada di internet?',
      answer: 'Tool biasa hanya memberikan teks prompt polos yang harus Anda copy-paste ke After Effects atau Premiere Pro secara manual berjam-jam. AUDIRA adalah ekosistem video engine lengkap: naskah ditulis otomatis oleh AI, disuarakan oleh vokal AI bahasa Indonesia, ditata ke canvas vertikal 9:16, dan dirender jadi file MP4 1080p 60 FPS siap upload.'
    },
    {
      id: 'faq-6',
      question: 'Bisa dibuatkan video terima beres kalau saya tidak punya waktu edit sendiri?',
      answer: 'Bisa banget! Kami menyediakan layanan VIP Done-For-You (Jasa Terima Beres 24 Jam). Anda cukup mengirimkan materi atau link produk di WhatsApp, tim AUDIRA yang akan meriset angle viral, menyusun naskah persuasif, mengisi suara AI jernih, dan menganimasikan videonya hingga siap upload. Harga mulai Rp349.000 per video atau Rp1.399.000 untuk paket 5 video.'
    },
    {
      id: 'faq-7',
      question: 'Bagaimana jika saya bingung atau butuh panduan langsung?',
      answer: 'Tim pengembang AUDIRA menyediakan layanan support cepat melalui WhatsApp resmi di 0857-0966-6240. Kami siap membantu membimbing instalasi skill, konfigurasi AI lokal, hingga video pertama Anda berhasil dirender.'
    }
  ],
  contact: {
    whatsappNumber: '6285709666240',
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

