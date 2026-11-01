# 🎬 AUDIRA TEMPLATE MOTION
> **Satu Ide. Satu Reel Motion Jadi.**  
> Platform Generator Video Motion Vertikal (9:16) Otomatis Berbasis AI — Dilengkapi Multi-Model LLM (Cloud + Ollama Lokal), Cartesia Voiceover Bahasa Indonesia, Kinetic Subtitle Kustom, Pengunggah Media Bukti (B-Roll), dan Renderer Headless HyperFrames ke MP4.

---

## 📑 Daftar Isi
1. [Ringkasan Arsitektur & Alur Kerja](#-ringkasan-arsitektur--alur-kerja)
2. [5 Langkah Alur Kerja Creator (Dari Ide Sampai Jadi Video)](#-5-langkah-alur-kerja-creator)
3. [Fitur Unggulan Sistem](#-fitur-unggulan-sistem)
4. [Stack Unggah Media & B-Roll Bukti Visual](#-stack-unggah-media--b-roll-bukti-visual)
5. [Integrasi AI Multi-Model & Ollama Lokal](#-integrasi-ai-multi-model--ollama-lokal)
6. [Voiceover AI Bahasa Indonesia (Cartesia TTS)](#-voiceover-ai-bahasa-indonesia-cartesia-tts)
7. [Struktur Proyek & File Kunci](#-struktur-proyek--file-kunci)
8. [Instalasi & Menjalankan Web (Port 3788)](#-instalasi--menjalankan-web-port-3788)
9. [Konfigurasi Lingkungan (`.env.local`)](#-konfigurasi-lingkungan-envlocal)
10. [Otomasi Git Push (`save.bat`)](#-otomasi-git-push-savebat)
11. [Kepemilikan & Kontak](#-kepemilikan--kontak)

---

## 🏗️ Ringkasan Arsitektur & Alur Kerja

```
+-----------------------------------------------------------------------------------+
|                            AUDIRA TEMPLATE MOTION                                 |
+-----------------------------------------------------------------------------------+
       |
       v
+------------------+       +-------------------+       +-----------------------+
|  1. FORMAT &     | ----> |  2. IDE & PROMPT  | ----> |  3. NASKAH & SUARA    |
|     PEMERAN      |       |     AI GENERATOR  |       |     CARTESIA TTS      |
|  - 6 Archetypes  |       |  - Ollama Lokal   |       |  - Audisi Suara ID    |
|  - 8 Human Cast  |       |  - Gemini / GPT-4o|       |  - Batch 1-Click Sync |
|  - 6 AI Avatar   |       |  - Claude/DeepSeek|       |  - Auto-Emoji Viral   |
+------------------+       +-------------------+       +-----------------------+
                                                                   |
                                                                   v
+------------------+       +-------------------+       +-----------------------+
| 6. RENDER VAULT  | <---- | 5. RENDER ENGINE  | <---- | 4. VISUAL & B-ROLL    |
|    & DOWNLOAD    |       |    & VIRAL KIT    |       |    SUBTITLE MIXER     |
|  - Riwayat MP4   |       |  - HyperFrames CLI|       |  - Upload Bukti/Chat  |
|  - Auto Save JSON|       |  - H.264 MP4 1080p|       |  - Kinetic Subtitle Y |
|  - Direct Stream |       |  - Tag & Caption  |       |  - BGM Auto-Ducking   |
+------------------+       +-------------------+       +-----------------------+
```

---

## 🎯 5 Langkah Alur Kerja Creator

Sistem dirancang dengan alur linear terpandu 5 langkah (*Step-by-Step Workflow Stepper*) agar kreator pemula maupun profesional dapat menghasilkan video berkualitas tinggi dalam hitungan detik:

```
[1. Format & Pemeran] ➔ [2. Ide & Prompt AI] ➔ [3. Naskah & Beat] ➔ [4. Visual & Subtitle] ➔ [5. Render & Export]
```

### Langkah 1: Format & Karakter (`FormatSelector.tsx` + `CastPicker.tsx`)
- Pilih salah satu dari **6 Format Gerak**:
  1. **Character Banter (Skit Debat)**: Manusia vs AI dengan animasi mulut sinkron bicara, kedipan mata, dan ruang neon 2D.
  2. **Whiteboard Live Drawing**: Gambar spidol marker otomatis di papan tulis putih dengan efek tangan nyata.
  3. **Life as a Game (16-bit Pixel RPG)**: Masalah hidup sehari-hari dikemas menjadi pertempuran turn-based era SNES.
  4. **Breaking News TV**: Siaran investigasi darurat dengan 3 mode kamera (Chat Forensik WA, Studio Anchor, Field CCTV Live) dan running ticker bawah.
  5. **Clean Explainer**: Tipografi kinetik, grafik modern yang bergerak naik, dan tahapan langkah terstruktur.
  6. **Docu-Story**: Dokumenter investigasi retro dengan efek Ken Burns pada arsip foto, film grain vintage, dan audio wavebars.
- Pilih pemeran manusia (Ash, Reza, Maya, Dimas, Tari, Bayu, Sinta, Eko) dan avatar AI (Sage, Vesper, Byte, Echo, Nyx, Kira).

### Langkah 2: Ide & AI Prompt Generator (`IdeaInputPanel.tsx`)
- Masukkan ide mentah atau topik konten (contoh: *"Mengapa banyak startup bangkrut di tahun kedua?"*).
- Pilih Mood / Emosi Pembawaan: **Hyped**, **Warm**, **Calm**, **Motivational**, **Frustrated**, **Angry**, atau **Rude**.
- Pilih Mesin AI: **Ollama Lokal** (100% offline & gratis), **Google Gemini**, **OpenAI GPT-4o**, **Anthropic Claude**, **DeepSeek**, **Groq**, **Mistral**, atau **Auto-Detect**.
- Klik **"Racik Naskah Viral"** — AI otomatis merumuskan naskah dengan Hook 0.4 detik, dialog tajam, dan Outro magnet komentar.

### Langkah 3: Editor Naskah & Kalibrasi Suara (`ScriptEditorPanel.tsx`)
- Edit teks dialog per baris, ganti pembicara, geser urutan baris (*up/down*), dan sesuaikan emosi spesifik baris.
- **Audisi Suara Cartesia**: Klik tombol `[Suara]` di tiap baris untuk mendengarkan pelafalan bahasa Indonesia alami secara instan.
- **Batch Voice Sync**: 1-Klik sinkronisasi seluruh dialog dengan Cartesia TTS — durasi video otomatis dihitung presisi sesuai panjang rekaman audio.
- **Auto-Emoji**: 1-Klik injeksi emoji viral kinetik pada kata kunci penting (uang, cuan, rahasia, viral, algoritma, dll.).
- **Upload Bukti**: Tombol cepat untuk membuka galeri dan mengunggah tangkapan layar bukti percakapan.

### Langkah 4: Visual, Kinetic Subtitle & Audio Mixer (`VisualSubtitlePanel.tsx`)
- **Kinetic Subtitle Engine**:
  - Slider presisi ketinggian vertikal ($10\%$ hingga $85\%$ layar) agar bebas tabrakan dengan teks judul atau area safe-zone Reels/TikTok.
  - Pilihan ukuran font (*Kecil*, *Sedang*, *Besar Kinetic Pop*).
  - Gaya wadah box (*Shadow Minimal*, *Glassmorphism*, *Solid Brutal*, *Cyber Glow*).
  - Warna highlight kata aktif dinamis (*Emas*, *Oranye*, *Emerald*, *Cyan*, *Ungu*, *Putih*).
- **B-Roll & Bukti Visual**:
  - Pasang screenshot WhatsApp, bukti rekening, foto lapangan, atau diagram analitik langsung ke canvas.
- **Canvas Visual Inspector**:
  - Toggle tampil/sembunyikan Layer Header, Layer Grafik Utama, Layer Subtitle, dan Layer Outro Hook.
  - Ganti tema estetika background (*Obsidian Slate*, *Cyber Matrix*, *Indigo Bloom*, *Amber Studio*, *Neon Cyber*).
- **Audio Mixer & Auto-Ducking**:
  - Musik latar (BGM) otomatis meredup (*ducking* $80\%$) saat karakter berbicara dan kembali bervolume normal saat jeda dialog.

### Langkah 5: Render Launchpad & Export MP4 (`RenderLaunchpad.tsx` + `ExportModal.tsx`)
- Pratinjau langsung di kanvas vertikal 9:16 dengan tombol toggle **Instagram Reels Safe Area Overlay**.
- **Viral Toolkit**: Generate deskripsi konten siap-copas, hashtag relevan, dan checklist retensi.
- Klik **"Mulai Render MP4"** — HyperFrames CLI memproses komposisi video frame-by-frame menjadi file MP4 1080x1920 30FPS.
- **Riwayat Vault**: Akses semua video yang pernah dirender kapan saja, putar langsung, atau unduh ke perangkat lokal.

---

## ✨ Fitur Unggulan Sistem

| Fitur | Deskripsi |
| :--- | :--- |
| **Multi-Model LLM** | Mendukung Ollama Lokal (offline), Gemini 2.5 Flash, GPT-4o, Claude 3.5, DeepSeek R1, Groq Llama, dan Mistral. |
| **Cartesia TTS Indonesia** | Voiceover beraksen Indonesia native (Safira, Galang, Citra, Andi) dengan output audio 24kHz dan timestamp kata presisi. |
| **DeepSeek R1 Thinking Filter** | Otomatis membersihkan blok internal `<think>...</think>` dari model reasoning lokal sebelum parsing JSON. |
| **Kinetic Captions** | Animasi teks muncul kata-demi-kata (*word-by-word pop*) dengan highlight warna real-time. |
| **Safe Zone Overlay** | Garis panduan area aman Instagram Reels & TikTok agar teks tidak tertutup ikon like, komentar, atau caption aplikasi. |
| **Media & B-Roll Stack** | Unggah gambar bukti ke `public/uploads/` dengan sistem penamaan aman, galeri historis, dan preset cepat. |
| **HyperFrames Renderer** | Rendering headless berbasis Node.js yang cepat dan hemat resource tanpa ketergantungan browser eksternal berat. |
| **Render Vault** | Manajemen riwayat render lengkap dengan pencarian, pemutar video, ukuran file, dan unduhan langsung. |

---

## 🖼️ Stack Unggah Media & B-Roll Bukti Visual

Sistem unggah media terintegrasi penuh untuk mendukung kebutuhan video investigasi, konten drama, dan ulasan produk:

### 1. Spesifikasi Endpoint API (`src/app/api/upload/route.ts`)
- **`POST /api/upload`**:
  - Menerima `FormData` multipart dengan field `file` dan `label` (opsional).
  - Validasi tipe MIME: `image/png`, `image/jpeg`, `image/webp`, `image/gif`, `image/svg+xml`.
  - Validasi ukuran file maksimal: **10 MB**.
  - Sanitasi nama file: membersihkan karakter ilegal dan menambahkan penanda waktu unik (`Date.now()`).
  - Disimpan langsung di folder `public/uploads/` sehingga dapat diakses via URL publik `/uploads/<nama-file>`.
- **`GET /api/upload`**:
  - Mengembalikan daftar seluruh file yang ada di `public/uploads/` berformat JSON, diurutkan dari yang terbaru, lengkap dengan URL, ukuran byte, dan waktu pembuatan.
- **`DELETE /api/upload`**:
  - Menghapus file secara aman dari server berdasarkan parameter `filename` (dilengkapi proteksi *path traversal*).

### 2. Antarmuka Pengguna (`MediaUploaderModal.tsx`)
- **Drag-and-Drop Area**: Drop gambar langsung dari file explorer ke browser.
- **Label Tagging**: Beri label penanda (contoh: `BUKTI CHAT WA`, `GRAFIK CUAN`, `ARSIP A1`).
- **Stock Presets**: 4 preset bawaan siap pakai (`BUKTI CHAT WA`, `GRAFIK ANALITIK`, `CCTV FORENSIK`, `ARSIP HISTORIS`).
- **Galeri Unggahan**: Pratinjau thumbnail, tombol 1-klik `[Pakai]`, dan tombol `[Hapus]`.
- **Indikator Media Aktif**: Menampilkan media yang sedang terpasang di kanvas video dengan tombol pelepasan instan.

---

## 🧠 Integrasi AI Multi-Model & Ollama Lokal

AUDIRA mendukung pembuatan naskah baik melalui cloud API maupun model open-source lokal via **Ollama**:

### Menggunakan Ollama Lokal (100% Offline & Gratis)
Pastikan Ollama terinstal dan berjalan di latar belakang:
```bash
# Cek apakah Ollama aktif di port 11434
curl http://localhost:11434/api/tags
```

Model yang didukung dan telah diverifikasi:
- `deepseek-r1:8b` *(Rekomendasi untuk dialog sarkas & investigasi)*
- `qwen3:8b` / `qwen2.5:32b` *(Rekomendasi untuk dialog natural bahasa Indonesia)*
- `qwen2.5-coder:32b`
- `gemma2:27b`

> **Catatan Teknis**: Backend secara otomatis menyaring tag `<think>...</think>` yang dikeluarkan oleh keluarga model DeepSeek R1 sebelum melakukan ekstraksi JSON storyboard, menjamin parsing selalu valid dan bebas error.

---

## 🎙️ Voiceover AI Bahasa Indonesia (Cartesia TTS)

Endpoint `/api/voiceover` menyediakan sintesis suara berkecepatan tinggi (*sub-200ms*) dengan kualitas studio:

| Karakter | Model Suara Cartesia | Karakteristik Vokal |
| :--- | :--- | :--- |
| **Safira** (`safira`) | Voice ID Resmi Cartesia ID | Vokal perempuan muda, ramah, artikulatif, ekspresif |
| **Galang** (`galang`) | Voice ID Resmi Cartesia ID | Vokal laki-laki berwibawa, presenter berita, tenang |
| **Citra** (`citra`) | Voice ID Resmi Cartesia ID | Vokal perempuan profesional, nada tegas ala eksekutif |
| **Andi** (`andi`) | Voice ID Resmi Cartesia ID | Vokal laki-laki kasual, santai, gaya percakapan anak muda |

Fitur ini menyertakan fallback cerdas ke Web Speech API bawaan browser jika kunci API Cartesia belum dikonfigurasi.

---

## 📁 Struktur Proyek & File Kunci

```
f:/AUDIRA-TEMPLATE-MOTION/
├── public/
│   ├── audio/              # Efek suara & musik latar (BGM)
│   ├── reels/              # Preset stock poster & bukti visual
│   └── uploads/            # Direktori penyimpanan unggahan media kustom
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── render/     # Endpoint eksekusi HyperFrames render ke MP4
│   │   │   ├── script/     # Endpoint LLM Script Generator (Cloud + Ollama)
│   │   │   ├── upload/     # Endpoint Multipart Upload, Gallery & Deletion
│   │   │   ├── vault/      # Endpoint manajemen riwayat MP4 render
│   │   │   └── voiceover/  # Endpoint Cartesia TTS suara bahasa Indonesia
│   │   ├── studio/         # Halaman utama studio kreator (5-Step Workspace)
│   │   ├── prompts/        # Hub prompt viral & template ide
│   │   └── page.tsx        # Landing page AUDIRA TEMPLATE MOTION
│   ├── components/
│   │   ├── studio/
│   │   │   ├── WorkflowStepper.tsx      # Bilah progres 5-langkah kreator
│   │   │   ├── FormatSelector.tsx       # Pemilih 6 format archetypes
│   │   │   ├── IdeaInputPanel.tsx       # Input ide, mood, dan model AI
│   │   │   ├── ScriptEditorPanel.tsx    # Editor naskah, audisi suara, & beat
│   │   │   ├── VisualSubtitlePanel.tsx  # Pengatur posisi subtitle & bukti B-Roll
│   │   │   ├── MediaUploaderModal.tsx   # Modal drag-and-drop & galeri unggahan
│   │   │   ├── RenderLaunchpad.tsx      # Preview reel, viral kit, & export MP4
│   │   │   └── RenderHistoryModal.tsx   # Modal riwayat video yang pernah jadi
│   │   └── video-engine/
│   │       ├── MotionStage.tsx              # Player kanvas 9:16 interaktif
│   │       ├── CharacterBanterTemplate.tsx  # Template animasi skits 2D
│   │       ├── WhiteboardTemplate.tsx       # Template marker drawing
│   │       ├── PixelRpgTemplate.tsx         # Template 16-bit RPG
│   │       ├── BreakingNewsTemplate.tsx     # Template berita TV investigasi
│   │       ├── CleanExplainerTemplate.tsx   # Template grafik & presentasi B2B
│   │       └── DocuStoryTemplate.tsx        # Template dokumenter sinematik
│   ├── lib/
│   │   ├── ai-universal.ts # Router orkestrasi seluruh provider AI
│   │   ├── audio-mixer.ts  # Auto-ducking engine & loop background music
│   │   └── templates.ts    # Database konfigurasi awal demo storyboard
│   └── types/
│       └── motion.ts       # Definisi TypeScript SSOT storyboard
├── save.bat                # Skrip 1-klik auto commit & push ke GitHub
├── start_web.bat           # Skrip eksekusi instan server Next.js di port 3788
└── stop_web.bat            # Skrip terminasi bersih proses port 3788
```

---

## 🚀 Instalasi & Menjalankan Web (Port 3788)

Aplikasi ini berjalan di **Port 3788** guna mencegah konflik dengan layanan lokal lainnya:

### Prasyarat
- Node.js versi 18.18 atau lebih baru
- `pnpm` (disarankan) atau `npm`

### 1. Pasang Dependensi
```bash
pnpm install
```

### 2. Jalankan Server Dev
Jalankan melalui skrip otomatis:
```cmd
start_web.bat
```
Atau via terminal manual:
```bash
pnpm dev -p 3788
```
Buka browser di: **[http://localhost:3788/studio](http://localhost:3788/studio)**

### 3. Menghentikan Server
Jalankan skrip terminasi:
```cmd
stop_web.bat
```

---

## 🔑 Konfigurasi Lingkungan (`.env.local`)

Buat file `.env.local` di direktori akar proyek:

```env
# Port Aplikasi AUDIRA
PORT=3788

# Cartesia AI (Voiceover Bahasa Indonesia Natural)
CARTESIA_API_KEY=sk_car_xxxxxxxxxxxxxxxxxxxxxxxx

# Ollama Endpoint (Opsional jika menggunakan model lokal)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_DEFAULT_MODEL=deepseek-r1:8b

# Cloud AI API Keys (Opsional - sesuai kebutuhan provider yang ingin diaktifkan)
GEMINI_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxx
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🔄 Otomasi Git Push (`save.bat`)

Untuk menyimpan seluruh modifikasi dan mendorong ke repository GitHub secara aman, jalankan skrip `save.bat`:

```cmd
save.bat "Pesan commit perubahan terbaru"
```

Skrip `save.bat` melakukan:
1. Pengecekan remote URL repository (`https://github.com/Audira141415/AUDIRA-TEMPLATE-MOTION.git`).
2. Deteksi branch aktif secara otomatis (`master` / `main`).
3. Auto-staging seluruh file modifikasi.
4. Pembuatan commit message terstruktur.
5. `git pull --rebase` untuk menghindari konflik merge.
6. Push langsung ke GitHub dengan status warna informatif.

---

## 👤 Kepemilikan & Kontak

- **Brand**: AUDIRA (Audira Multimedia Digital / Audira Sukses Mandiri)
- **Author**: Agus Dwi Rianto
- **Website**: [https://audira.my.id](https://audira.my.id)
- **WhatsApp**: [+62 821-1200-1600](https://wa.me/6282112001600)
- **Email**: agusdwirianto@gmail.com
- **Repository**: [https://github.com/Audira141415/AUDIRA-TEMPLATE-MOTION.git](https://github.com/Audira141415/AUDIRA-TEMPLATE-MOTION.git)

---
*Dibuat dengan standar kualitas tinggi, estetika Neo-Brutalisme Dark, dan arsitektur anti-slop.*
