# Audira Skill Motion 3D (v3.0.0 Commercial Release)

> **The Premier Autonomous 3D Cinematic Motion Director for Claude Code & Remotion.**  
> **Created & Engineered by:** Agus Dwi Rianto (AUDIRA MDA)  
> **License:** Paid Commercial Proprietary Software License (By Audira)

---

## 🎬 Apa Itu Audira Skill Motion?

**Audira Skill Motion** adalah platform *AI-driven autonomous motion design system* berbasis Claude Code, Remotion, dan React Three Fiber (Three.js WebGL). 

Dirancang khusus untuk memproduksi **video animasi 3D sinematik vertikal (9:16) 1080×1920 pada 60 FPS**, sistem ini mengubah naskah, ide kreatif, atau narasi suara (Voice-Over MP3) menjadi film animasi berkualitas tinggi secara otomatis tanpa memerlukan keahlian coding grafis 3D dari pengguna.

---

## 🏛️ 20 Signature Styles Mandiri

Audira Skill Motion dilengkapi dengan **20 mesin gaya (style engines)** prosedural independen yang dikelompokkan ke dalam 5 ranah industri:

```
├── 1. Edukasi, Arsitektur & Mesin
│   ├── INNERWORKS   # X-Ray Cutaway & Mekanika Mesin Transparan
│   ├── BUILDFORGE   # Perakitan Konstruksi Bangunan Tahap demi Tahap
│   ├── TIMEFORGE    # Evolusi Desain Fisik Benda Lintas Era
│   ├── DRAFTFORGE   # Cetak Biru CAD Teknik & Skema Paten Mesin
│   └── URBANFORGE   # Maket Kota Putih Monokrom, Bayangan Surya & Proyeksi Data
│
├── 2. Karakter & Cerita Taktil
│   ├── PIXELSTORY   # Sinematik 2.5D Pixel Art & Pencahayaan Per-Piksel
│   ├── PAPERWORLD   # Diorama Kertas Lipat Handmade (Paper Craft)
│   ├── CLAYWORLD    # Stop-Motion Animasi Tanah Liat / Plastisin (15 FPS)
│   ├── TOONFORGE    # Cel-Shaded 3D Anime, Kontur Tinta & Garis Kecepatan Manga
│   └── BRICKCRAFT   # Balok Mainan Plastik ABS Modular (Toy Bricks) & Stop-Motion Meja
│
├── 3. Dunia Geometris & Alam
│   ├── VOXELVERSE   # Miniatur Dunia Balok Voxel 3D
│   ├── WORLDFORGE   # Eksplorasi Lingkungan Dunia 3D Sinematik
│   └── POLYVERSE    # Low-Poly Minimalis, Pulau Melayang & Fajar Pastel
│
├── 4. Sains, Medis & Geografi
│   ├── NANOFORGE    # Biologi Molekuler, Heliks Ganda DNA & Mikroskop Cryo-EM
│   ├── INKSTORY     # Lukisan Kaligrafi Tinta Cina (Sumi-e / Shan Shui) & Cap Merah
│   └── LIDARFORGE   # Survei Drone LiDAR 3D, Titik Awan Elevasi & Sapuan Laser
│
└── 5. Teknologi Tinggi & Komersial
    ├── CYBERFORGE   # Hologram 3D Sci-Fi, Quantum Core & Telemetri HUD Taktis
    ├── PRECISION    # Iklan Produk Mewah 3D, Material CMF & Exploded View
    ├── GLASSCRAFT   # Spatial Computing Glassmorphism, Prisma Cairan & Refraksi
    └── CIRCUITFORGE # Makroskopik Motherboard PCB 3D & Aliran Pulsa Arus Elektron
```

---

## 🛠️ Tech Stack & Spesifikasi Inti

Proyek ini dibangun di atas kombinasi framework video dan grafis 3D mutakhir:
- **Video Engine:** Remotion (`remotion`, `@remotion/cli`, `@remotion/three` v4.0.539)
- **3D Graphics & WebGL:** Three.js (v0.186.1) & React Three Fiber (`@react-three/fiber` v9.8.2)
- **Frontend Core:** React 19 (`react`, `react-dom` v19.2.3), TypeScript (v5.9.3), Node.js (>=22.13.0 ESM)
- **AI Motion Director:** Claude Code Agentic Skill (`SKILL.md`)
- **Audio Processing:** FFmpeg / FFprobe dengan normalisasi siaran EBU R128 (-14 LUFS)

*Baca dokumentasi teknis lengkap dan arsitektur pipeline di [`TECH_STACK.md`](TECH_STACK.md).*

---

## ⚡ Cara Menjalankan & Quick Start

### 1. Instalasi Otomatis (Windows):
Cukup klik ganda file [`setup.bat`](setup.bat) di root folder proyek, atau jalankan via terminal:
```bash
npm run setup
```

### 2. Auto-Sync ke GitHub:
Klik ganda file [`save.bat`](save.bat) untuk otomatis menyimpan commit dan push ke repositori GitHub `Audira141415/AUDIRA-SKILL-MOTION`.

### 3. Perintah Instan di Claude Code:
Cukup ketik `/audira-motion` diikuti dengan ide ceritamu:
```bash
/audira-motion Aku mau bikin video makro sirkuit PCB motherboard 3D dengan aliran elektron menyala ke prosesor silikon. Ada VO MP3.
```

### 4. Alur Produksi:
1. **Guided Brief:** Claude menganalisis pesan, durasi, dan memilih gaya terbaik dari 20 styles secara otomatis.
2. **Audio Sync Checkpoint:** Mengukur panjang gelombang suara narasi hingga presisi milidetik.
3. **Render Preview (540×960 @ 30 FPS):** Pratinjau kilat untuk review dan revisi visual (`npm run smoke` atau `npm run stills`).
4. **Render Final (1080×1920 @ 60 FPS):** Render sinematik ultra tajam dengan normalisasi audio standar industri media sosial (−14 LUFS).

---

## 🔒 Lisensi Berbayar & Hak Cipta (By Audira)

Perangkat lunak ini dilindungi oleh **Lisensi Komersial Berbayar Resmi**:
- **Pemilik Hak Cipta & Pencipta:** **Agus Dwi Rianto (AUDIRA MDA)**
- **Izin Penggunaan:** Pembeli lisensi berhak menghasilkan dan memonetisasi video komersial tanpa batas (YouTube, TikTok, Reels, iklan TV, klien).
- **Larangan Keras:** Dilarang memperjualbelikan, membagikan gratis, membocorkan kode sumber, mengunggah ke repositori publik, atau mendistribusikan ulang prompt dan 20 kit mesin ini dalam bentuk apa pun.
- *Lihat rincian lengkap di file [LICENSE.md](LICENSE.md) dan [LICENSE_AND_REQUIREMENTS.md](LICENSE_AND_REQUIREMENTS.md).*

---

## 📚 Panduan Lengkap Dokumentasi

- [`TECH_STACK.md`](TECH_STACK.md) — Rincian lengkap arsitektur teknologi, library, dan hardware requirements.
- [`START_HERE.md`](START_HERE.md) — Panduan cepat 3 langkah untuk pemula.
- [`INSTALLATION_GUIDE.md`](INSTALLATION_GUIDE.md) — Cara setup komputer (Node.js, ffmpeg, Claude Code).
- [`USER_GUIDE.md`](USER_GUIDE.md) — Panduan lengkap alur kerja dari ide hingga final render.
- [`EXAMPLE_PROMPTS.md`](EXAMPLE_PROMPTS.md) — Inspirasi dan contoh prompt untuk seluruh 20 gaya.
- [`BRAND_KIT.md`](BRAND_KIT.md) — Konfigurasi identitas brand (`audira-brand.json`).
- [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md) — Solusi masalah teknis dan pesan error.
- [`CHANGELOG.md`](CHANGELOG.md) — Riwayat pembaruan dan evolusi versi.

---

**AUDIRA MDA © 2026 Agus Dwi Rianto. All Rights Reserved.**

