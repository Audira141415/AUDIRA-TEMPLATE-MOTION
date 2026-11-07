# ⚡ AUDIRA SKILL MOTION 3D — Comprehensive Tech Stack Specification

> **Version:** `4.1.0 Commercial Release`  
> **Author & Creator:** AUDIRA (Agus Dwi R)  
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
│    • Style Engine Selector (1 of 68 Kits)              │
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

## 3. 🎨 68 Procedural Style Engines (Kits)

AUDIRA SKILL MOTION dilengkapi **68 modul gaya prosedural** independen di direktori `/kits`:

| Kategori Industri | Style Engine | Karakteristik Visual & Implementasi Teknis |
| :--- | :--- | :--- |
| **1. Edukasi, Arsitektur & Investigasi** | `INNERWORKS` | X-Ray Cutaway, transmisi mekanika roda gigi transparan & exploded view. |
| | `BUILDFORGE` | Simulasi perakitan konstruksi arsitektur bertahap (*piece-by-piece assembly*). |
| | `TIMEFORGE` | Morfologi fisik benda bertransformasi melintasi era sejarah dengan penanda tahun. |
| | `DRAFTFORGE` | Skema cetak biru (CAD Blueprint), garis dimensi teknis presisi & callout ISO. |
| | `URBANFORGE` | Maket tata kota monokrom putih, kalkulasi bayangan matahari & proyeksi zonasi cyan. |
| | `VINTAGEFORGE`| Manuskrip Da Vinci, arsiran tinta ukir tembaga antik (*cross-hatching*) & patina emas. |
| | `CHALKCRAFT` | Papan tulis batu tulis gelap berdebu kapur mikro, partikel 3D & persamaan kuantum. |
| | `FILMNOIR` | Sinematik Film Noir 1940s, kontras chiaroscuro, aspal basah & bayangan tirai venetian. |
| | `MEMPHISDIORAMA` | Maket arsitektur meja 1980s Ettore Sottsass, terrazzo & bayangan jatuh ungu keras. |
| | `VISUALINVESTIGATION` | Meja forensik jurnalisme visual, denah ruang sidang berlabel, stabilo merah & Mute-Test. |
| | `HISTORYMAP` | Peta perang & geopolitik sejarah, pergeseran batas wilayah kekaisaran & panah manuver taktis. |
| **2. Karakter, Taktil & Peradaban** | `AUDIRABOT` | Maskot 3D resmi AUDIRA, visor ekspresif OLED, levitasi plasma pendorong, dan lengan artikulasi penunjuk komponen. |
| | `TOYDIORAMA` | Panggung teater miniatur 3D, karakter toy blocky bermaterial matte plastic & soft clay, footlights hangat & anotasi kertas berselotip. |
| | `WATERCOLOR` | Buku cerita anak cat air Eropa 3D, kertas 300gsm cold-press & sketsa garis pensil halus. |
| | `ISLAMICDOCUMENTARY` | Folk Islam & era keemasan, pola bintang 8 Arabesque Girih, siluet kubah/menara masjid & oud akustik. |
| | `PIXELSTORY` | Visual 2.5D pixel art dengan pencahayaan per-piksel dan tipografi retro 8-bit. |
| | `HD2D` | Sprite pixel 2D di dalam diorama 3D pencahayaan fisik dengan lentera 2400K & DOF tilt-shift. |
| | `PAPERWORLD` | Diorama origami lipatan kertas buatan tangan dengan tekstur serat kertas nyata. |
| | `CLAYWORLD` | Stop-motion animasi plastisin / tanah liat dengan simulasi cap sidik jari (15 FPS). |
| | `TOONFORGE` | Cel-shaded anime 3D, garis kontur tinta tebal, dan garis aksi manga dinamis (*speed lines*). |
| | `BRICKCRAFT` | Simulasi balok mainan plastik ABS modular (stud geometry) & stop-motion macro meja. |
| | `ISOCRAFT` | Isometrik komik tinta tebal, bayangan biru datar, dan mekanisme dalam *see-through*. |
| | `RETROWAVE` | 80s Synthwave, horizon grid neon tak berujung & scanline tabung monitor CRT. |
| **3. Alam, Liminal & Geometri** | `VOXELVERSE` | Miniatur dunia balok voxel 3D dengan pencahayaan ambient occlusion mikro. |
| | `WORLDFORGE` | Eksplorasi lanskap lingkungan 3D sinematik dengan sapuan kamera dramatis. |
| | `POLYVERSE` | Dunia low-poly minimalis, pulau melayang bertingkat, dan palet warna pastel Monument Valley. |
| | `BACKROOMS` | Koridor liminal 3D kuning, lampu neon berkedip stokastik & guncangan kamera VHS 90-an. |
| **4. Sains & Geospasial** | `NANOFORGE` | Mikroskop biologi molekuler Cryo-EM, heliks ganda DNA bersinar & aliran vesikel sel. |
| | `INKSTORY` | Lukisan kaligrafi tinta Cina klasik (Sumi-e / Shan Shui), efek basah kertas beras & cap merah cinnabar. |
| | `LIDARFORGE` | Titik awan data survei drone (point cloud), pemetaan elevasi warna & tirai pemindai laser. |
| | `THERMALFORGE`| Kamera termal FLIR, spektrum Ironbow suhu panas-dingin & hotspot telemetri. |
| | `SATELLITEBRIEFING` | Rekognisi geospasial satelit OSINT 3D, zoom orbital logaritmik & retikel target amber. |
| **5. Komersial, Pasar & High-Tech** | `CYBERFORGE` | Hologram 3D futuristik, inti komputasi kuantum, kisi neon siber & telemetri HUD. |
| | `PRECISION` | Sinematografi iklan produk mewah 3D, material CMF fotorealistik & pergerakan makro studio. |
| | `GLASSCRAFT` | Desain spatial computing dengan kartu kaca buram (*frosted glass*), refraksi prisma & cairan kristal. |
| | `FLUIDFORGE` | Gerak cairan abstrak ferrofluid nol-gravitasi, bola logam krom iridescent & cincin kaustik. |
| | `DATAPHYSICAL` | Fisikalisasi data 3D, patung statistik keping aluminium sikat, akrilik teal & kayu walnut. |
| | `TRADINGTERMINAL` | Antarmuka terminal trading bursa finansial & crypto, candlestick 3D, order book depth wall & live price. |
| | `CIRCUITFORGE` | Makroskopik motherboard PCB 3D, komponen SMT, dan aliran elektron bercahaya ke CPU. |
| | `BRUTALFORGE` | 3D Neo-Brutalism pop, outline hitam 4px tegas, bayangan jatuh keras & warna neon menyengat. |
| | `KINTSUGI` | Wabi-Sabi keramik porselen matte minimalis & lelehan urat emas bercahaya (*liquid gold*). |
| | `TEXTVOYAGE` | Tipografi monolitik 3D spasial raksasa tempat kamera melesat menembus rongga huruf. |
| | `DEVFORGE` | Jendela 3D spatial IDE, typewriter syntax code, game asset spawning, dan badge revenue kinetik. |
| **6. Ekspansi v4.2** | `MISTISFORGE` | Kampung malam berkabut dengan pelita, rumpun bambu, rumah panggung, dan beringin berakar gantung. |
|  | `FOODFORGE` | Hidangan hero di meja kayu gelap, uap bercahaya dari belakang, bahan jatuh gerak lambat. |
|  | `TACTICBOARD` | Papan taktik 3D dengan koin pemain bernomor, jalur umpan kuning, dan replay gol emas di stadion bokeh. |
|  | `WAYANGFORGE` | Panggung wayang kulit dengan kelir bercahaya, blencong, gamelan, dan bingkai batik kawung. |
|  | `DISASTERSIM` | Balok bumi terbelah dengan lempeng menunjam, cincin gempa, gelombang tsunami, dan kota pesisir mini. |
|  | `SCALEFORGE` | Zoom out logaritmik tanpa putus di atas penggaris ukur, dari studio putih ke luar angkasa. |
|  | `SATISFYFORGE` | Studio pastel mulus dengan aksi presisi: iris, tuang, dan masuk pas. |
|  | `COMICFORGE` | Komik Barat 3D: garis tinta tebal, titik Ben-Day, warna CMYK, panel halaman yang ditembus kamera. |
|  | `ABYSSFORGE` | Ubur-ubur berdenyut cyan-magenta, salju laut, dan meteran kedalaman sonar menuju predator bercahaya. |
|  | `RISOFORGE` | Zine cetak risograph: tinta spot overprint, butiran halftone, cetakan sedikit meleset, lapisan kertas pop-up. |
|  | `Y2KCHROME` | Gumpalan krom cair di atas awan aqua dengan gelembung pelangi dan kilau lensa. |
|  | `FELTCRAFT` | Diorama wol dan flanel berjahit tangan dengan boneka berbulu halus yang bergerak patah-patah. |
|  | `ANATOMIX` | Jantung 3D transparan di atas proyektor hologram teal dengan aliran darah merah dan biru. |
|  | `UKIYOFORGE` | Lapisan kertas cetak kayu dengan ombak bercakar, gunung kembar, perahu, dan matahari merah. |
|  | `STAINEDGLASS` | Jendela lancet dan rose berwarna permata dengan bingkai timah, genangan cahaya warna di lantai batu. |
|  | `SULAMFORGE` | Pemidangan kayu dengan tusuk satin sutra, jarum baja, dan kain songket bersulam emas. |
|  | `MOSAICFORGE` | Ribuan tessera keramik dan emas berkilau tersusun mengikuti kontur gambar di atas nat kapur. |
|  | `MARBLEMUSEUM` | Patung dada marmer bergaya Yunani-Romawi di galeri merah tua dengan pilar, bingkai emas, dan kartu label museum. |
|  | `TERRARIUM` | Toples kaca berisi lumut, pakis, jamur, dan siput dengan siklus siang-malam. |
|  | `SKETCHFORGE` | Sketsa pensil grafit di buku sketsa yang berubah jadi rangka, tanah liat, lalu objek berwarna satu aksen. |
|  | `DREAMCORE` | Ruang kolam berubin dengan awan di dalam ruangan, pintu melayang di air, dan tangga menuju entah ke mana. |
|  | `GACHAREVEAL` | Panggung summon gelap, kapsul bergetar naik kelas warna, kartu foil berputar dan terbuka. |
|  | `ARCADECRT` | Ruang arcade malam, layar CRT melengkung dengan scanline dan glow, lalu menyelam ke dunia voxel. |
|  | `MANUSCRIPT` | Meja penyalin naskah bercahaya lilin dengan kitab beriluminasi emas dan lontar bertali. |
|  | `GLITCHFORGE` | Render studio bersih yang terkoyak glitch RGB, blok piksel, pixel sorting, layar no signal, lalu pulih. |

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

## 6. 🎬 Arsitektur Peningkatan Sinematik Komersial (Professional Core)

Sistem ini dilengkapi rangkaian modul sinematik tingkat lanjut di `src/core/`:
- **Secondary Motion & Spring Physics (`motion/spring.ts`):** Menggunakan diferensial pegas harmonik teredam *(damped harmonic oscillator)* deterministik untuk animasi *overshoot*, *rebound*, *wobble*, dan *anticipation* alami (12 Prinsip Animasi Disney).
- **Organic Handheld Camera Kinematics (`camera/handheld.ts`):** Mensimulasikan *micro-drift* harmonik ($0.05^\circ$) dan efek kamera dinamis seperti *Hitchcock Dolly-Zoom (Vertigo effect)* serta *Whip-Pan* berkecepatan tinggi.
- **3D World-Space Tracking Callouts (`hud/TrackedPin3D.tsx`):** Menancapkan pin radar bercahaya, garis siku presisi, dan kartu telemetri data langsung ke koordinat vertex 3D mesh $[X, Y, Z]$ yang auto-menghadap kamera (*billboarded*).
- **PBR Realism & Shaders (`materials/fresnel.ts` & `materials/noiseTexture.ts`):** Shading Schlick Fresnel untuk rim kontur bercahaya tajam dan generator tekstur mikro (*micro-roughness / brushed metal* tanpa unduhan eksternal).
- **Hollywood Finishing Profiles (`render/FinishingPresets.ts` & `render/Post.tsx`):** Grading warna kelas bioskop (`CINEMA_TEAL_ORANGE`, `APPLE_STUDIO_CLEAN`, `CYBER_NEON_VOID`) dilengkapi *chromatic aberration*, *optical vignette*, dan *micro film grain*.
- **Automated Visual QC Gate (`scripts/visual-audit.mjs`):** Pengecekan otomatis *mobile safe-zone* (TikTok/Reels), rasio kontras teks WCAG AA ($\ge 4.5:1$), dan anggaran frame WebGL ($\le 120$ draw calls).

---

## 7. 🚀 Rangkuman Perintah Produksi

```bash
# 1. Menyiapkan dependensi
npm run setup

# 2. Cek kesiapan hardware dan WebGL GPU
npm run check-env

# 3. Audit visual mandiri (Safe-zone, Contrast WCAG, WebGL budget)
npm run audit:visual

# 4. Uji coba render kilat (Smoke test)
npm run smoke

# 5. Buka Remotion Studio visual di browser
npm run dev

# 6. Analisis naskah suara (Voice-Over)
npm run vo -- public/audio/narasi.mp3

# 7. Render final sinematik 1080x1920 60 FPS
npm run render:final -- --comp=ShowcaseFinal --vo=public/audio/narasi.mp3 --out=out/final.mp4
```

