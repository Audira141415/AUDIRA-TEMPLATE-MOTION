# 🎬 AUDIRA TEMPLATE MOTION & 3D CINEMATIC REMOTION ENGINE

> **Commercial Release v3.0.0 — Unified Dual-Engine Architecture**  
> Platform Generator Video Motion Vertikal (9:16) Otomatis Berbasis AI — Menggabungkan **AUDIRA Web Studio** (Next.js 15, React 19, Multi-Model LLM, Cartesia Indonesian TTS, Kinetic Captions, B-Roll Upload) dan **AUDIRA 3D Remotion Cinematic Engine** (Remotion 4.0, React Three Fiber 9.8, Three.js 0.186, 20 Signature 3D Styles, PBR Shaders, Kamera Terarah, & Headless MP4 Renderer).  
> **Arsitek & Founder**: Agus Dwi Rianto (AUDIRA MDA / Audira Sukses Mandiri)

---

## 📑 Daftar Isi

1. [Ringkasan Arsitektur Dual-Engine](#-ringkasan-arsitektur-dual-engine)
2. [Spesifikasi Lengkap Teknologi (Tech Stack)](#-spesifikasi-lengkap-teknologi-tech-stack)
3. [Engine 1: AUDIRA Web Studio (Port 3788)](#-engine-1-audira-web-studio-port-3788)
4. [Engine 2: AUDIRA 3D Remotion Cinematic Engine (20 Gaya 3D)](#-engine-2-audira-3d-remotion-cinematic-engine-20-gaya-3d)
5. [Tabel 20 Signature 3D Styles](#-tabel-20-signature-3d-styles)
6. [Sistem Unggah Media & B-Roll Bukti Visual](#-sistem-unggah-media--b-roll-bukti-visual)
7. [Integrasi AI Multi-Model (Ollama Offline + Cloud API)](#-integrasi-ai-multi-model-ollama-offline--cloud-api)
8. [Voiceover AI Bahasa Indonesia (Cartesia TTS)](#-voiceover-ai-bahasa-indonesia-cartesia-tts)
9. [Alur Kerja Lengkap (Cara Kerja Dari Ide ke Video)](#-alur-kerja-lengkap-cara-kerja-dari-ide-ke-video)
10. [Panduan Menjalankan & Perintah Eksekusi (Launchers)](#-panduan-menjalankan--perintah-eksekusi-launchers)
11. [Verifikasi Lingkungan & Smoke Test](#-verifikasi-lingkungan--smoke-test)
12. [Struktur Direktori Proyek](#-struktur-direktori-proyek)
13. [Otomasi Git Push (`save.bat`)](#-otomasi-git-push-savebat)
14. [Kontak & Lisensi Komersial](#-kontak--lisensi-komersial)

---

## 🏗️ Ringkasan Arsitektur Dual-Engine

Sistem ini menggabungkan dua engine rendering video terpisah dalam satu repositori yang saling melengkapi:

```
+----------------------------------------------------------------------------------------------------+
|                                    AUDIRA TEMPLATE MOTION                                          |
+----------------------------------------------------------------------------------------------------+
                   |                                                                |
                   v                                                                v
+-----------------------------------------+      +--------------------------------------------------+
|      ENGINE 1: AUDIRA WEB STUDIO        |      |      ENGINE 2: AUDIRA 3D REMOTION ENGINE         |
|             (Port 3788)                 |      |           (audira-skill-motion/)                 |
+-----------------------------------------+      +--------------------------------------------------+
| • Next.js 15.5 App Router + React 19    |      | • Remotion 4.0.539 + React Three Fiber 9.8.2     |
| • 21 Format Gerak Vertikal 9:16         |      | • Three.js 0.186.1 + Chromium Headless Shell     |
| • Multi-LLM (Ollama, Gemini, Claude)    |      | • 20 Signature 3D Kits (PBR & Prosedural)        |
| • Cartesia Indonesian Voiceover 24kHz   |      | • Kamera Direksi C1 Keyframes (Spherical Rig)    |
| • Kinetic Captions ($10%-$85% Y-Slider) |      | • Post-Processing: MSAA, AO, Bloom, DoF, Grade   |
| • Upload Media & Bukti B-Roll (10MB)    |      | • Headless Stills QA & Render MP4 4K 60FPS       |
| • Live Audio Mixer & 80% Auto-Ducking   |      | • Smoke Test Visual Matrix (_sheet.jpg)          |
+-----------------------------------------+      +--------------------------------------------------+
                   |                                                                |
                   v                                                                v
   [MP4 Reels / Shorts / TikTok 1080p]                     [Sinematik 3D Studio / 4K Eksklusif]
```

---

## 💻 Spesifikasi Lengkap Teknologi (Tech Stack)

### 1. Web Core & Frontend
- **Framework**: [Next.js](https://nextjs.org/) 15.5 (App Router, Server Components & Route Handlers)
- **UI Runtime**: [React](https://react.dev/) 19.0 & React-DOM 19.0
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v3.4 + `@tailwindcss/typography`
- **Design System**: Voynan-Grade Warm Dark Editorial (#0a0a09 ink, #ea580c accent, #fbf7ee paper)
- **Iconography**: [Lucide React](https://lucide.dev/) (200+ ikon SVG responsif)
- **State & Schema Validation**: [Zod](https://zod.dev/) v4.6

### 2. 3D Cinematic Motion & Rendering
- **Video Framework**: [Remotion](https://www.remotion.dev/) 4.0.539 (`@remotion/cli`, `@remotion/three`, `@remotion/renderer`, `@remotion/bundler`)
- **3D Graphics Engine**: [Three.js](https://threejs.org/) 0.186.1
- **React 3D Integration**: `@react-three/fiber` 9.8.2
- **Headless Browser**: Chromium Headless Shell (diunduh otomatis oleh `@remotion/renderer`)
- **Video & Audio Transcoder**: [FFmpeg](https://ffmpeg.org/) v8.1 + `ffprobe`

### 3. Voiceover & Audio Engine
- **Voiceover TTS**: [Cartesia AI](https://cartesia.ai/) Sonic-Multilingual (Model aksen Indonesia alami: Safira, Galang, Citra, Andi) dengan respons latensi rendah (*sub-200ms*) dan timestamp kata (*word-level timestamps*).
- **Fallback Audio**: Web Speech API native browser synthesis.
- **Audio Haptics & SFX**: Haptic click audio synthesize via Web Audio API oscillators, sound effect OOF, live ticker sound, dan ambient soundscapes.
- **BGM Engine**: Auto-ducking $80\%$ volume saat karakter berbicara, melembut otomatis dan kembali naik pada jeda narasi.

### 4. Inteligensi AI & LLM Orchestration
- **Offline / Local AI**: [Ollama](https://ollama.com/) HTTP Gateway (`http://localhost:11434`) untuk model open-source: `deepseek-r1:8b`, `qwen2.5:32b`, `gemma2:27b`.
- **DeepSeek R1 Thinking Stripper**: Pembersih otomatis blok internal `<think>...</think>` sebelum parsing schema JSON storyboard.
- **Cloud AI Multi-Model**:
  - Anthropic Claude 3.5 Sonnet (`@anthropic-ai/sdk`)
  - Google Gemini 1.5 Pro / Flash & 2.5 Flash
  - OpenAI GPT-4o / GPT-4o-mini
  - DeepSeek API & Groq Llama 3.3

---

## 🎨 Engine 1: AUDIRA Web Studio (Port 3788)

Akses browser: **[http://localhost:3788/studio](http://localhost:3788/studio)**

Web Studio menyediakan pengalaman kreasi linear 5 langkah terpadu (*Step-by-Step Workflow Stepper*):

### 1. Format & Pemeran (`FormatSelector.tsx` + `CastPicker.tsx`)
Pilihan 21 format gerak teruji dengan retensi tinggi:
1. **Roblox Obby & Skits**: Avatar Noob vs Pro, arena parkour lava berputar, efek suara OOF, saldo Robux R$, dan bubble chat Roblox.
2. **Character Banter (Skit Debat)**: Dua host berdebat, animasi mulut sinkron vokal, ekspresi emosional dinamis.
3. **Life as a Game (16-Bit Pixel RPG)**: Masalah hidup sehari-hari dikemas menjadi pertarungan bos SNES dengan bar HP dan menu aksi.
4. **Breaking News TV**: Siaran darurat dengan 3 mode (Chat Forensik WhatsApp, Anchor Studio, CCTV Live Cam) dan running ticker berjalan.
5. **Clean Explainer**: Data keuangan, diagram batang bertumbuh, checklist teratur, dan kartu persentase.
6. **Docu-Story**: Kisah nyata sejarah, foto arsip dengan pergerakan halus kamera Ken Burns, film grain, dan waveform audio.
7. **Whiteboard Live Drawing**: Gambar spidol marker otomatis di papan tulis putih dengan ilustrasi interaktif.
8. Serta format **Kinetic Type**, **Chat Story**, **Top List**, **Kuis Trivia**, **Versus Duel**, **Terminal Hack**, **Struk Kasir Thermal**, **Peta Perjalanan GPS**, **Resep Cepat**, **Retro VHS 1994**, dan **Papan Catatan Sticky Notes**.

### 2. Kinetic Captions Engine (`VisualSubtitlePanel.tsx`)
- **Slider Presisi Posisi Y**: Atur ketinggian teks subtitle secara leluasa dari $10\%$ (atas) hingga $85\%$ (bawah).
- **Instagram Reels & TikTok Safe-Zone Guide**: Overlay transparan area aman untuk mencegah teks terhalang tombol like, komentar, profil, atau judul akun.
- **5 Gaya Animasi Subtitle**: Highlight kata dinamis, Pop Bounce kinetik, Karaoke bar, Flash Word, dan Hormozi Box.
- **5 Font Premium**: Inter, Montserrat, Impact, The Bold Font, dan Komika Hand.

### 3. Media Upload & B-Roll Bukti Visual (`MediaUploaderModal.tsx`)
Lihat detail lengkap di bagian [Sistem Unggah Media](#-sistem-unggah-media--b-roll-bukti-visual).

---

## 🪐 Engine 2: AUDIRA 3D Remotion Cinematic Engine (20 Gaya 3D)

Direktori: `audira-skill-motion/`  
Akses Remotion Studio: `start_remotion.bat` atau `npm run remotion:dev` (Port 3000)

Engine 3D Remotion diciptakan khusus untuk kebutuhan video motion 3D berkualitas studio komersial tanpa ketergantungan pada video generator AI yang sering menghasilkan distorsi fisik atau teks rusak.

### Arsitektur Render 3D Prosedural
- **Tanpa Distorsi**: Geometri 3D dirakit langsung menggunakan primitif Three.js, instanced meshes, extrusion, dan procedural noise.
- **Dual Resolution Presets**:
  - `Preview`: $540 \times 960$ @ 30 FPS (Super cepat untuk approval dan review instan).
  - `Final`: $1080 \times 1920$ @ 60 FPS (Super tajam dengan MSAA, ground-truth ambient occlusion, dan tone-mapping neutral).
- **Spherical Camera Director**: Rig kamera bola parametrik (`[azimuth°, elevation°, distance, fov°]`) dengan interpolasi mulus C1 continuous keyframes.
- **Clash Checking**: Validasi urutan konstruksi otomatis tanpa GPU (`checkSequence()`) untuk menjamin tidak ada objek melayang atau bertabrakan sebelum proses render.

---

## 🌟 Tabel 20 Signature 3D Styles

| No | Nama Kit | Grup Kategori | Karakter Visual 3D | Contoh Prompt Siap Pakai |
|:---:|:---|:---|:---|:---|
| 01 | **BUILDFORGE** | Arsitektur | Bangunan dirakit tahap demi tahap dari tanah, pondasi, struktur baja, hingga interior modern. | `"/audira-motion Rumah dua lantai dirakit bertahap dari pondasi semen, struktur baja ringan, hingga instalasi kaca panorama modern."` |
| 02 | **WORLDFORGE** | Kosmik | Bola bumi 3D berputar megah di ruang hampa, atmosfer pendar biru, simulasi kerumunan, dan fisika skala global. | `"/audira-motion Simulasi fisika jutaan orang berkumpul di tebing pantai atmosferik raksasa dengan gelombang kejut."` |
| 03 | **VOXELVERSE** | Kosmik | Miniatur dunia 3D dari balok voxel, pangkalan survival, radar pertahanan perimeter, dan cuaca dinamis. | `"/audira-motion Pangkalan survival voxel di tengah hutan, radar pertahanan menyala melingkar dengan dinding pelindung."` |
| 04 | **PRECISION** | Sains | Iklan produk mewah industri / exploded view titanium, roda gigi meledak terurai lalu menyatu presisi. | `"/audira-motion Iklan 3D jam tangan mekanik mewah, close-up titanium dan roda gigi meledak terurai lalu menyatu lagi."` |
| 05 | **INNERWORKS** | Arsitektur | Membedah cara kerja mesin dengan casing transparan X-Ray cutaway dan kinematika poros berputar. | `"/audira-motion Cara kerja kipas angin turbin elektrik, casingnya transparan dan poros kumparan berputar di dalam."` |
| 06 | **CYBERFORGE** | Kosmik | Hologram 3D sci-fi, cincin telemetri HUD berputar, inti kuantum AI, dan grid neon siber. | `"/audira-motion Animasi hologram 3D inti kuantum AI dengan lingkaran telemetri HUD berputar dan grid neon siber."` |
| 07 | **DRAFTFORGE** | Arsitektur | Cetak biru arsitektur CAD, skema mesin dengan garis ukuran dimensi presisi ISO dan exploded view. | `"/audira-motion Skema cetak biru 3D mesin roket pendorong, garis ukuran dimensi presisi ISO lalu exploded view."` |
| 08 | **CLAYWORLD** | Taktil | Animasi stop-motion tanah liat / plastisin kenyal dengan tekstur sidik jari dan dunia diorama. | `"/audira-motion Cerita stop-motion monster kecil yang melompat kenyal di dunia jamur plastisin dan melambaikan tangan."` |
| 09 | **POLYVERSE** | Kosmik | Pulau melayang low-poly minimalis, pohon pinus bergoyang, air terjun kristal, dan fajar pastel. | `"/audira-motion Pulau melayang low-poly minimalis dengan pohon pinus bergoyang, sungai berkilau, dan fajar pastel."` |
| 10 | **TOONFORGE** | Taktil | Aksi anime cel-shaded 3D, kontur tinta tegas, garis kecepatan manga, dan semburan plasma kembar. | `"/audira-motion Aksi robot mecha tempur meluncur cepat dengan garis kecepatan manga dan semburan plasma kembar."` |
| 11 | **PAPERWORLD** | Taktil | Cerita miniatur kertas lipat (papercraft / origami), bayangan lipatan kertas, dan animasi popup book. | `"/audira-motion Cerita kertas tentang tukang kebun kecil yang mengembalikan warna ke kota origami."` |
| 12 | **PIXELSTORY** | Taktil | Sinematik 2.5D pixel-art isometrik dengan pencahayaan titik dinamis dan pantulan air hujan. | `"/audira-motion Animasi pixel tentang penjaga mercusuar yang menyalakan lampu saat badai malam. Musik saja."` |
| 13 | **GLASSCRAFT** | Sains | Spatial computing glassmorphism, kartu kaca buram (frosted glass), pembiasan prisma pelangi, dan tetesan kristal cair. | `"/audira-motion Kartu kaca buram melayang, pembiasan prisma spektrum pelangi, dan tetesan kristal cair."` |
| 14 | **NANOFORGE** | Sains | Sains mikroskopis 3D heliks ganda DNA bersinar, mikroskop Cryo-EM, dan vesikel sel berdenyut. | `"/audira-motion Sains mikroskopis 3D heliks ganda DNA bersinar dengan pasangan basa berputar dan vesikel sel berdenyut."` |
| 15 | **INKSTORY** | Kosmik | Lukisan tinta Timur (Sumi-e / Shan Shui), pegunungan berkabut, kaligrafi 3D, dan cap stempel merah. | `"/audira-motion Lukisan kaligrafi tinta Cina 3D di atas kertas beras tua dengan pegunungan Shan Shui dan cap stempel merah."` |
| 16 | **LIDARFORGE** | Sains | Survei drone LiDAR 3D, elevasi titik awan (point cloud), tirai laser menyapu lembah, dan koordinat GPS. | `"/audira-motion Survei drone LiDAR 3D titik awan ketinggian tanah, tirai laser menyapu lembah, telemetri GPS."` |
| 17 | **CIRCUITFORGE** | Sains | Motherboard PCB 3D makro, jalur tembaga presisi, chip BGA silikon, dan aliran pulsa listrik amber. | `"/audira-motion Sirkuit motherboard PCB 3D makro dengan jalur tembaga presisi, chip BGA silikon, dan arus elektron."` |
| 18 | **BRICKCRAFT** | Taktil | Balok mainan plastik 3D interlocking stud, snap presisi per blok, dan stop-motion meja kayu. | `"/audira-motion Animasi stop-motion balok plastik di atas meja kayu, potongan balok terbang dan snap membentuk rumah."` |
| 19 | **URBANFORGE** | Arsitektur | Maket arsitektur putih monokrom kota futuristik, bayangan matahari bergerak, dan proyeksi zonasi neon. | `"/audira-motion Maket arsitektur putih monokrom kota futuristik, bayangan matahari bergerak, proyeksi data zonasi neon."` |
| 20 | **TIMEFORGE** | Arsitektur | Evolusi satu objek atau lanskap arsitektur melintasi berabad-abad dalam satu sapuan waktu mulus. | `"/audira-motion Evolusi telepon genggam dari era batu bata analog 90-an sampai smartphone lipat masa kini."` |

---

## 🖼️ Sistem Unggah Media & B-Roll Bukti Visual

Sistem unggah media dirancang untuk menyematkan tangkapan layar chat WhatsApp, laporan rekening, bukti CCTV, grafik analitik, atau logo sponsor langsung ke dalam video vertikal:

### 1. Arsitektur API (`src/app/api/upload/route.ts`)
- **`POST /api/upload`**:
  - Menerima `multipart/form-data` dengan parameter `file` dan `label`.
  - Validasi tipe MIME: `image/png`, `image/jpeg`, `image/webp`, `image/gif`, `image/svg+xml`.
  - Batas ukuran file: **Maksimal 10 MB**.
  - Sanitasi nama file anti-injeksi: membersihkan karakter khusus dan menyematkan timestamp unik (`Date.now()`).
  - Penyimpanan langsung di folder `public/uploads/` sehingga file dapat diakses publik via `/uploads/<nama-file>`.
- **`GET /api/upload`**:
  - Mengembalikan daftar berkas di `public/uploads/` berformat JSON, diurutkan dari unggahan paling baru.
- **`DELETE /api/upload`**:
  - Menghapus berkas dari server secara aman dengan proteksi pencegahan *path-traversal*.

### 2. Antarmuka Studio (`MediaUploaderModal.tsx`)
- **Area Drag & Drop**: Tarik berkas dari file explorer dan lepas langsung di area unggah.
- **Stock B-Roll Presets**: Pilihan cepat tanpa perlu unggah sendiri:
  - `BUKTI CHAT WA`: Tangkapan layar pesan WhatsApp forensik.
  - `GRAFIK ANALITIK`: Statistik pertumbuhan metrik viral.
  - `CCTV FORENSIK`: Laporan investigasi kamera lapangan.
  - `ARSIP HISTORIS`: Dokumen lawas dekalsifikasi Ken Burns.
- **Galeri Berkas Tersimpan**: Pratinjau thumbnail, ukuran berkas, tombol pasang `[Pakai]`, dan hapus `[Trash]`.
- **Badge Indikator Media Aktif**: Menampilkan label B-Roll yang sedang menempel pada kanvas video dengan opsi pelepasan instan.

---

## 🤖 Integrasi AI Multi-Model (Ollama Offline + Cloud API)

AUDIRA MOTION mendukung generasi naskah otomatis tanpa biaya langganan API melalui **Ollama** lokal:

```bash
# Pastikan Ollama aktif di latar belakang (Port 11434)
ollama run deepseek-r1:8b
```

### Keunggulan Integrasi Ollama:
- **Gratis 100% & Tanpa Batas Kuota**: Berjalan sepenuhnya di perangkat lokal Anda tanpa koneksi internet.
- **DeepSeek R1 Thinking Filter**: Backend secara otomatis membuang token blok internal `<think>...</think>` yang diproduksi model reasoning lokal sehingga ekstraksi JSON selalu bersih dan valid.
- **Model yang Didukung**: `deepseek-r1:8b`, `qwen2.5:32b`, `qwen2.5-coder:32b`, `gemma2:27b`.

Untuk pengguna yang menggunakan Cloud API, sistem mendukung pemanggilan langsung ke **Google Gemini 2.5**, **Anthropic Claude 3.5 Sonnet**, **OpenAI GPT-4o**, dan **Groq** via tab konfigurasi admin (`/admin`).

---

## 🎙️ Voiceover AI Bahasa Indonesia (Cartesia TTS)

Endpoint: `src/app/api/voiceover/route.ts`

Sintesis suara ultra-cepat menggunakan model suara Cartesia beraksen Indonesia native:

| Persona Suara | Model Cartesia | Karakter & Kegunaan |
| :--- | :--- | :--- |
| **Safira** (`safira`) | Voice ID Resmi ID | Perempuan muda, ceria, artikulatif, ekspresif untuk konten viral & komedi |
| **Galang** (`galang`) | Voice ID Resmi ID | Laki-laki berwibawa, tenang, cocok untuk narator dokumenter & berita |
| **Citra** (`citra`) | Voice ID Resmi ID | Perempuan profesional, percaya diri, gaya presenter korporat / B2B |
| **Andi** (`andi`) | Voice ID Resmi ID | Laki-laki kasual, santai, gaya obrolan sehari-hari anak muda |

*Catatan: Jika `CARTESIA_API_KEY` belum terisi di `.env.local`, sistem secara otomatis mengaktifkan fallback ke Web Speech API bawaan browser.*

---

## 🔄 Alur Kerja Lengkap (Cara Kerja Dari Ide ke Video)

```
[1. IDE & PROMPT]
  Ketik ide premis di Studio atau pilih dari Katalog Prompt (/prompts).
  Pilih Mood (Hyped, Calm, Angry, dsb) dan Gaya Bahasa (Jakarta Gaul, Gen-Z, Formal).
           │
           ▼
[2. SINTESIS NASKAH (AI)]
  Ollama atau Cloud AI meracik naskah berdurasi 15s/30s/45s dengan skema ketat JSON.
  Otomatis menyematkan Hook 0.4 detik, dialog tajam, dan Outro magnet komentar.
           │
           ▼
[3. SUARA & AUDIO SYNC]
  1-Klik sinkronisasi suara via Cartesia TTS.
  Durasi video otomatis terkunci frame-by-frame mengikuti panjang gelombang vokal.
           │
           ▼
[4. VISUAL & SUBTITLE]
  Atur ketinggian subtitle dengan slider posisi Y.
  Unggah gambar bukti atau B-Roll via modal uploader.
  Sesuaikan gaya kanvas dan Safe-Zone Instagram/TikTok.
           │
           ▼
[5. RENDER & EXPORT]
  • Mode Web Studio: Pratinjau kanvas real-time dan export reel.
  • Mode 3D Remotion: Eksekusi rendering headless via Remotion Studio (start_remotion.bat)
    menghasilkan video 3D 1080p/4K 60FPS dengan pencahayaan PBR dan soft shadows.
```

---

## 🚀 Panduan Menjalankan & Perintah Eksekusi (Launchers)

Semua skrip peluncur telah disediakan dalam format batch `.bat` di folder utama untuk kemudahan 1-klik:

### 1. Menjalankan AUDIRA Web Studio (Port 3788)
Klik ganda file:
```cmd
start_web.bat
```
Atau via terminal manual:
```bash
npm run dev
# Server aktif di http://localhost:3788
```

### 2. Menjalankan AUDIRA 3D Remotion Studio (Port 3000)
Klik ganda file:
```cmd
start_remotion.bat
```
Atau via terminal manual:
```bash
npm run remotion:dev
# Remotion Studio aktif di http://localhost:3000
```

### 3. Pintasan Perintah Eksekusi Root (`package.json`)
Perintah-perintah berikut dapat dijalankan langsung dari direktori utama proyek:

| Perintah | Fungsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server Next.js Web Studio di Port 3788 |
| `npm run build` | Mengompilasi build produksi Next.js (lulus verifikasi typecheck & static generation) |
| `npm run start` | Menjalankan server produksi Next.js di Port 3788 |
| `npm run remotion:dev` | Membuka antarmuka interaktif Remotion Studio 3D |
| `npm run remotion:smoke` | Menjalankan visual QA smoke test pada 3 frame dan menghasilkan sheet ringkasan `_sheet.jpg` |
| `npm run remotion:check` | Memeriksa kesiapan lingkungan render (Node, npm, ffmpeg, ffprobe, disk, RAM, platform) |
| `npm run remotion:stills` | Merender kumpulan frame gambar diam dari komposisi terpilih |
| `npm run remotion:vo` | Menganalisis file audio voiceover untuk kalibrasi durasi panggung 3D |
| `npm run remotion:render` | Merender komposisi final resolusi tinggi ($1080 \times 1920$ @ 60 FPS) ke file MP4 |

---

## 🔍 Verifikasi Lingkungan & Smoke Test

Sebelum merender video 3D pertama kali, pastikan lingkungan sistem Anda telah terverifikasi:

```bash
# 1. Jalankan pemeriksaan kesiapan sistem
npm run remotion:check
```
*Output yang diharapkan:*
```
✓ Node.js ≥ 22.13: found 26.8.1
✓ npm: 11.19.0
✓ ffmpeg: version 8.1.1 ok
✓ ffprobe: ok
✓ Free disk ≥ 5 GB: 200 GB free
✓ RAM: 64 GB total
✓ Platform: Windows: run npm run smoke to confirm 3D rendering
✓ Project packages installed: ok
Ready.
```

```bash
# 2. Jalankan smoke test visual
npm run remotion:smoke
```
*Hasil smoke test akan otomatis merender frame 15, 90, dan 165 dari komposisi 3D dan menggabungkannya ke berkas:*
`audira-skill-motion/starter/out/smoke/_sheet.jpg`

---

## 📁 Struktur Direktori Proyek

```
f:/AUDIRA-TEMPLATE-MOTION/
├── audira-skill-motion/             # ENGINE 2: 3D REMOTION CINEMATIC ENGINE
│   ├── kits/                        # 20 Signature 3D Kits
│   │   ├── buildforge/              # 01. Konstruksi & perakitan arsitektur bertahap
│   │   ├── worldforge/              # 02. Fisika bola bumi & kerumunan atmosfer
│   │   ├── voxelverse/              # 03. Voxel sandbox & radar pertahanan base
│   │   ├── precision/               # 04. Industrial exploded view luxury product
│   │   ├── innerworks/              # 05. X-Ray cutaway mesin & kinematika
│   │   ├── cyberforge/              # 06. Hologram HUD telemetri sci-fi
│   │   ├── draftforge/              # 07. Cetak biru arsitektur CAD ISO
│   │   ├── clayworld/               # 08. Stop-motion tanah liat plastisin
│   │   ├── polyverse/               # 09. Low-poly minimalist floating island
│   │   ├── toonforge/               # 10. Cel-shaded anime & manga speed lines
│   │   ├── paperworld/              # 11. Origami papercraft popup book
│   │   ├── pixelstory/              # 12. 2.5D pixel-art diorama & point lights
│   │   ├── glasscraft/              # 13. Spatial glassmorphism & liquid prisms
│   │   ├── nanoforge/               # 14. Mikroskop Cryo-EM & DNA double helix
│   │   ├── inkstory/                # 15. Lukisan tinta Shan Shui Sumi-e
│   │   ├── lidarforge/              # 16. Survei drone LiDAR 3D point cloud
│   │   ├── circuitforge/            # 17. Motherboard PCB 3D & arus elektron
│   │   ├── brickcraft/              # 18. Tactile plastic interlocking studs
│   │   ├── urbanforge/              # 19. Maket arsitektur putih & sun shadows
│   │   └── timeforge/               # 20. Evolusi arsitektur lintas era
│   ├── references/                  # Panduan kualitas & referensi visual
│   ├── starter/                     # Proyek starter Remotion + R3F + Three.js
│   │   ├── src/Root.tsx             # Registrasi semua komposisi Preview & Final
│   │   ├── scripts/check-env.mjs    # Skrip verifikasi environment
│   │   └── scripts/stills.mjs       # Skrip visual QA rendering stills
│   ├── package.json                 # Dependensi Remotion 4.0 & Three.js 0.186
│   └── SKILL.md                     # Protokol agen Claude untuk /audira-motion
│
├── public/                          # ASSET PUBLIK & STATIC HOSTING
│   ├── 3d-kits/                     # Gambar referensi visual 20 gaya 3D
│   ├── audio/                       # SFX tombol haptik & musik latar (BGM)
│   ├── reels/                       # Video & poster bawaan 21 format motion
│   └── uploads/                     # Direktori penyimpanan unggahan B-Roll (10MB)
│
├── src/                             # ENGINE 1: AUDIRA WEB STUDIO (NEXT.JS 15)
│   ├── app/
│   │   ├── api/
│   │   │   ├── render/              # Endpoint eksekusi headless rendering MP4
│   │   │   ├── script/              # Endpoint LLM Script Generator (Ollama + Cloud)
│   │   │   ├── upload/              # Endpoint Multipart Media Upload & Gallery
│   │   │   └── voiceover/           # Endpoint Cartesia TTS suara Indonesia
│   │   ├── studio/                  # Halaman 5-Step Workspace Kreator
│   │   ├── prompts/                 # Hub Prompt Multi-Model & 20 Gaya 3D
│   │   ├── admin/                   # Panel pengaturan API Keys & render logs
│   │   ├── login/ & register/       # Autentikasi pengguna
│   │   ├── layout.tsx               # Root layout font & styling
│   │   └── page.tsx                 # Landing page Voynan-grade warm dark editorial
│   ├── components/
│   │   ├── landing/
│   │   │   ├── HeroSection.tsx          # Dual 9:16 Video Reels & Value Prop
│   │   │   ├── Remotion3DShowcase.tsx   # 4-Card 3D Showcase & 20 Kits Catalog
│   │   │   ├── ProductPackages.tsx      # 3 Paket (Rp29k, Rp49k, Rp69k)
│   │   │   ├── GallerySection.tsx       # 21 Format Video Gallery
│   │   │   ├── HowItWorksSection.tsx    # 3 Langkah Interaktif
│   │   │   ├── BundleSection.tsx        # Creator Lab Best Value Rp109k
│   │   │   └── FaqSection.tsx           # Accordion FAQ & Lisensi
│   │   ├── studio/
│   │   │   ├── WorkflowStepper.tsx      # 5-Step linear progress bar
│   │   │   ├── FormatSelector.tsx       # Pemilih format motion
│   │   │   ├── IdeaInputPanel.tsx       # Masukan ide & konfigurasi model AI
│   │   │   ├── ScriptEditorPanel.tsx    # Editor dialog per baris & voice sync
│   │   │   ├── VisualSubtitlePanel.tsx  # Slider Y-subtitle & media B-Roll
│   │   │   ├── MediaUploaderModal.tsx   # Drag-and-drop modal & galeri B-Roll
│   │   │   └── RenderLaunchpad.tsx      # Safe-zone overlay & ekspor MP4
│   │   └── video-engine/
│   │       └── MotionStage.tsx          # Player kanvas 9:16 interaktif
│   ├── lib/
│   │   ├── ai-universal.ts          # Orkestrator Ollama & Cloud LLM
│   │   ├── audio-mixer.ts           # Auto-ducking BGM engine
│   │   └── script-prompts.ts        # Generator prompt terstruktur
│   └── types/
│       └── motion.ts                # TypeScript Definisi SSOT Storyboard
│
├── start_web.bat                    # Skrip peluncur Next.js Web Studio (Port 3788)
├── start_remotion.bat               # Skrip peluncur Remotion 3D Studio (Port 3000)
├── save.bat                         # Skrip otomasi commit & push ke GitHub
├── package.json                     # Root konfigurasi & pintasan npm scripts
├── tsconfig.json                    # TypeScript compiler options
└── README.md                        # Dokumentasi resmi ini
```

---

## 🔄 Otomasi Git Push (`save.bat`)

Untuk menyimpan seluruh modifikasi dan mendorong ke repository GitHub secara aman tanpa konflik, jalankan:

```cmd
save.bat "feat: integrasi lengkap audira-skill-motion 20 gaya 3d dan media uploader"
```

Skrip `save.bat` secara otomatis:
1. Mendeteksi branch aktif (`master`).
2. Menghindari konflik dengan melakukan `git pull --rebase origin master`.
3. Menambahkan seluruh file modifikasi (`git add -A`).
4. Membuat commit pesan deskriptif.
5. Mendorong (*push*) ke repository resmi GitHub dengan status warna informatif.

---

## 👤 Kontak & Lisensi Komersial

- **Brand**: AUDIRA (Audira Multimedia Digital / Audira Sukses Mandiri)
- **Arsitek & Founder**: Agus Dwi Rianto
- **Website Resmi**: [https://audira.my.id](https://audira.my.id)
- **WhatsApp Layanan**: [+62 821-1200-1600](https://wa.me/6282112001600)
- **Email Resmi**: agusdwirianto@gmail.com
- **Repository GitHub**: [https://github.com/Audira141415/AUDIRA-TEMPLATE-MOTION.git](https://github.com/Audira141415/AUDIRA-TEMPLATE-MOTION.git)

---
*Dikembangkan dengan standar rekayasa perangkat lunak tertinggi, estetika visual Neo-Brutalisme Dark Editorial, prinsip anti-slop ketat, dan dedikasi penuh untuk kemandirian kreator Indonesia.*
