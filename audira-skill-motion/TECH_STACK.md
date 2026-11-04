# ⚡ AUDIRA SKILL MOTION 3D — Comprehensive Tech Stack Specification

> **Version:** `3.0.0 Commercial Release`  
> **Author & Creator:** Agus Dwi Rianto (AUDIRA MDA)  
> **Repository:** [https://github.com/Audira141415/AUDIRA-SKILL-MOTION.git](https://github.com/Audira141415/AUDIRA-SKILL-MOTION.git)  
> **Official License:** Proprietary Commercial License (By Audira)

---

## 1. 🏗️ High-Level Architecture Overview

AUDIRA SKILL MOTION 3D menggabungkan tiga pilar teknologi tingkat tinggi:
1. **Agentic AI Director:** Claude Code Skill (`SKILL.md`) yang memahami brief naskah, mengarahkan kamera, mengorkestrasi timing audio, dan memilih gaya 3D.
2. **Programmatic Video Synthesis:** Remotion Engine yang merender frame video berbasis kode React dengan akurasi milidetik (*frame-accurate determinism*).
3. **Procedural 3D WebGL Canvas:** Three.js + React Three Fiber yang menjalankan simulasi 3D real-time di dalam browser Chromium tanpa perlu software render berat konvensional (Blender/Maya).

```
┌────────────────────────────────────────────────────────┐
│           USER BRIEF / SCRIPT / AUDIO MP3              │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│    Claude Code Autonomous Director (SKILL.md)          │
│    • Guided Brief Analysis                             │
│    • Style Engine Selector (1 of 20 Kits)              │
│    • Voice-Over (VO) Millisecond Waveform Sync         │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│             Remotion Programmatic Video Core           │
│   • Remotion Composition Pipeline (Root.tsx)           │
│   • Deterministic Timeline (useCurrentFrame)           │
│   • Frame Rate Control (30 FPS Preview / 60 FPS Final) │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│         Procedural 3D Canvas (Three.js + R3F)          │
│   • React Three Fiber (@react-three/fiber v9.8)        │
│   • @remotion/three ThreeCanvas Bridge                 │
│   • WebGL GPU ANGLE / Headless Chromium Renderer       │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│          FFmpeg Post-Processing & Audio Mastering      │
│   • Multi-thread Segmented Rendering                   │
│   • EBU R128 (-14 LUFS / True Peak < -1 dBFS)          │
│   • H.264 / AAC 1080×1920 60 FPS Vertical Master       │
└────────────────────────────────────────────────────────┘
```

---

## 2. 📦 Core Dependencies & Frameworks

### A. Video & Animation Core
- **`remotion` (`^4.0.539`)**: Inti framework pembuatan video terprogram dalam React. Mengontrol frame rate, durasi, komposisi hierarki, dan sinkronisasi audio.
- **`@remotion/cli` (`^4.0.539`)**: CLI runner untuk menjalankan preview lokal (`remotion studio`), render still previews, dan eksekusi batch render.
- **`@remotion/renderer` (`^4.0.539`)**: Engine headless browser (Chromium) yang mengekstrak setiap frame kanvas menjadi bitstream video berkualitas tinggi.
- **`@remotion/bundler` (`^4.0.539`)**: Webpack-based bundler yang mengoptimalkan seluruh bundle TypeScript dan React sebelum dikirim ke engine render.
- **`@remotion/google-fonts` (`^4.0.539`)**: Loader otomatis tipografi Google Fonts tanpa delay latensi jaringan selama render.

### B. 3D Graphics & Canvas Bridge
- **`three` (`^0.186.1`)**: Library grafis 3D standar industri WebGL. Mengatur mesh, geometri, material, shader GLSL kustom, pencahayaan, dan kamera proyektif.
- **`@react-three/fiber` (`^9.8.2`)**: Reconciler deklaratif React untuk Three.js yang memungkinkan pembuatan scene 3D secara modular dan reaktif.
- **`@remotion/three` (`^4.0.539`)**: Komponen jembatan (`ThreeCanvas`) yang menyinkronkan frame Remotion dengan loop render Three.js agar deterministik (tanpa desinkronisasi timestamp).

### C. Language & Build Runtime
- **`react` & `react-dom` (`^19.2.3`)**: Versi modern React dengan arsitektur compiler terbaru untuk performa render kanvas maksimal.
- **`typescript` (`^5.9.3`)**: Sistem tipe data statis ketat (*strict typing*) untuk memastikan integritas props antar komponen scene 3D.
- **Node.js (`>=22.13.0 LTS`)**: Runtime JavaScript modern dengan dukungan native ES Modules (`type: "module"`).

---

## 3. 🎨 20 Procedural Style Engines (Kits)

AUDIRA SKILL MOTION dilengkapi 20 modul gaya prosedural independen di direktori `/kits`:

| Kategori Industri | Style Engine | Karakteristik Visual & Implementasi Teknis |
| :--- | :--- | :--- |
| **1. Edukasi & Rekayasa** | `INNERWORKS` | X-Ray Cutaway, transmisi mekanika roda gigi transparan & exploded view. |
| | `BUILDFORGE` | Simulasi perakitan konstruksi arsitektur bertahap (*piece-by-piece assembly*). |
| | `TIMEFORGE` | Morfologi fisik benda bertransformasi melintasi era sejarah dengan penanda tahun. |
| | `DRAFTFORGE` | Skema cetak biru (CAD Blueprint), garis dimensi teknis presisi & callout ISO. |
| | `URBANFORGE` | Maket tata kota monokrom putih, kalkulasi bayangan matahari & proyeksi zonasi cyan. |
| **2. Karakter & Taktil** | `PIXELSTORY` | Visual 2.5D pixel art dengan pencahayaan per-piksel dan tipografi retro 8-bit. |
| | `PAPERWORLD` | Diorama origami lipatan kertas buatan tangan dengan tekstur serat kertas nyata. |
| | `CLAYWORLD` | Stop-motion animasi plastisin / tanah liat dengan simulasi cap sidik jari (15 FPS). |
| | `TOONFORGE` | Cel-shaded anime 3D, garis kontur tinta tebal, dan garis aksi manga dinamis (*speed lines*). |
| | `BRICKCRAFT` | Simulasi balok mainan plastik ABS modular (stud geometry) & stop-motion macro meja. |
| **3. Alam & Geometri** | `VOXELVERSE` | Miniatur dunia balok voxel 3D dengan pencahayaan ambient occlusion mikro. |
| | `WORLDFORGE` | Eksplorasi lanskap lingkungan 3D sinematik dengan sapuan kamera dramatis. |
| | `POLYVERSE` | Dunia low-poly minimalis, pulau melayang bertingkat, dan palet warna pastel Monument Valley. |
| **4. Sains & Geografi** | `NANOFORGE` | Mikroskop biologi molekuler Cryo-EM, heliks ganda DNA bersinar & aliran vesikel sel. |
| | `INKSTORY` | Lukisan kaligrafi tinta Cina klasik (Sumi-e / Shan Shui), efek basah kertas beras & cap merah cinnabar. |
| | `LIDARFORGE` | Titik awan data survei drone (point cloud), pemetaan elevasi warna & tirai pemindai laser. |
| **5. Komersial & High-Tech** | `CYBERFORGE` | Hologram 3D futuristik, inti komputasi kuantum, kisi neon siber & telemetri HUD. |
| | `PRECISION` | Sinematografi iklan produk mewah 3D, material CMF fotorealistik & pergerakan makro studio. |
| | `GLASSCRAFT` | Desain spatial computing dengan kartu kaca buram (*frosted glass*), refraksi prisma & cairan kristal. |
| | `CIRCUITFORGE` | Makroskopik motherboard PCB 3D, komponen SMT, dan aliran elektron bercahaya ke CPU. |

---

## 4. 🎛️ Audio Processing & Standard Mastering

- **Voice-Over Millisecond Sync:** Menggunakan script `starter/scripts/vo-analyze.mjs` berbasis `ffprobe` dan filter audio `silencedetect` untuk memetakan jeda vokal dan tempo bicara.
- **Standar Normalisasi Audio Broadcast:**
  - Integrated Loudness: **`-14 LUFS`** (Standar wajib YouTube Shorts, Instagram Reels, dan TikTok).
  - True Peak Limit: **`< -1.0 dBFS`** (Mencegah distorsi inter-sample clipping pada kompresi AAC seluler).
  - Audio Sample Rate: **`48 kHz 24-bit Stereo`**.

---

## 5. 💻 Kebutuhan Sistem & Spesifikasi Hardware

| Komponen | Spesifikasi Minimum | Spesifikasi Sangat Direkomendasikan |
| :--- | :--- | :--- |
| **Sistem Operasi** | Windows 10/11 (64-bit), macOS 13+, Ubuntu 22.04 LTS | Windows 11 (64-bit) / macOS Sonoma |
| **Prosesor (CPU)** | Intel Core i5 / AMD Ryzen 5 (4 Cores) | Intel Core i7/i9, AMD Ryzen 7/9, Apple Silicon (M1/M2/M3 Pro/Max) |
| **Kartu Grafis (GPU)** | GPU Terintegrasi dengan akselerasi WebGL 2.0 | NVIDIA GeForce RTX 3060+ / Apple GPU M-series |
| **RAM** | 8 GB RAM | 16 GB – 32 GB RAM |
| **Kapasitas Disk** | 5 GB ruang kosong (SSD) | 20 GB+ NVMe SSD |
| **Perangkat Lunak Pendukung** | Node.js `>=22.13.0`, Git, FFmpeg | Node.js 22 LTS, Git terbaru, FFmpeg 7+ |

---

## 6. 🚀 Rangkuman Perintah Produksi

```bash
# 1. Menyiapkan dependensi
npm run setup

# 2. Cek kesiapan hardware dan WebGL GPU
npm run check-env

# 3. Uji coba render kilat (Smoke test)
npm run smoke

# 4. Buka Remotion Studio visual di browser
npm run dev

# 5. Analisis naskah suara (Voice-Over)
npm run vo -- public/audio/narasi.mp3

# 6. Render final sinematik 1080x1920 60 FPS
npm run render:final -- --comp=ShowcaseFinal --vo=public/audio/narasi.mp3 --out=out/final.mp4
```

