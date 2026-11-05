# MEMORY.md — AUDIRA TEMPLATE MOTION

> Persistent Project Memory & Active Sprint Tracker  
> **Status:** Production-Ready (Real SaaS Engine v2.0.0 Pro)  
> **Maintainer:** Agus Dwi Rianto (AUDIRA MDA)  
> **Server Port:** Strictly 3788 (`http://localhost:3788`)  

---

## 1. Project Snapshot
- **Proyek:** AUDIRA TEMPLATE MOTION (SaaS Video Generator Multi-Format Kaliber BanterReels & Explainer)
- **Teknologi Utama:** Next.js 15 App Router, React 19, Tailwind CSS v4, Web Audio API, Cartesia Sonic TTS (Bahasa Indonesia `id`), GSAP Video Engine.
- **Roster Karakter:**
  - Manusia: Ash (Streamer), Kai (Developer), June (Designer), Audira (Analyst), Reza (Corporate).
  - AI Bot: Claude (Honest AI), Bubble (ChatGPT), CyberCore (Supercomputer), BitBot (Retro 8-bit).
  - Lokasi: 24h Neon Diner, Modern Cafe, Tech Office, Podcast Studio, Cozy Bedroom.

---

## 2. Completed Milestones (v2.0.0 Ultimate Studio Release)
- [x] **Full Brand Purge & Unified Rebranding to AUDIRA**:
  - Dieliminasi seluruh nama lama (NARA) dan distandarisasi ke **AUDIRA** di seluruh UI, API, meta tag, dan database template.
- [x] **AI Interconnection Hub (`/admin`)**:
  - `AiInterconnectionTab.tsx`: Dukungan untuk Anthropic Claude, Google Gemini, OpenAI, Groq, DeepSeek, OpenRouter, dan **AUDIRA Route** (`http://localhost:20128/v1`).
  - Model fallbacks otomatis untuk Google Gemini (`gemini-2.5-flash`, `gemini-1.5-flash`).
- [x] **Natural Indonesian Voiceover Studio (`/api/voiceover` & `VoiceOverTab.tsx`)**:
  - Cartesia Sonic multi-voice engine dengan bahasa Indonesia murni (`language: "id"`): Citra, Galang, Safira, Andi.
  - Preview suara langsung per baris dialog dan kontrol emosi.
- [x] **⚡ One-Click Batch Voice Sync & Exact Timestamps Calibration**:
  - Tombol 1-klik di Script Editor untuk mensintesis audio Cartesia untuk seluruh naskah secara paralel, lalu mengkalibrasi durasi baris dan word timestamps dengan presisi 100%.
- [x] **🎵 Studio Audio Mixer**:
  - Sliders independen untuk Suara Voiceover (0–100%), Musik BGM (0–100%), dan Efek SFX (0–100%).
  - Pemilih trek preset BGM + upload audio kustom (`.mp3` / `.wav`) dengan auto-ducking.
- [x] **✨ Kinetic Caption Animation Styles (Word-by-Word)**:
  - 5 Gaya Animasi: `Bounce Pop [MrBeast]`, `Karaoke Sweep [Ali Abdaal]`, `Single Word Flash [Retention]`, `Hormozi Box`, `Standard Highlight`.
  - Drag-to-position vertikal interaktif langsung di canvas dengan panduan Safe Zone.
- [x] **🔤 Popular Creator Font Family Selector**:
  - 5 Pilihan Font Creator: `Montserrat Black`, `Impact`, `The Bold Font`, `Komika Axis`, `Inter`.
- [x] **🤖 Magic AI Auto-Emoji**:
  - Injeksi otomatis emoji kinetik viral pada kata-kata kunci (cuan, rahasia, gila, bocor, views, viral, algoritma, bahaya, dll.).
- [x] **🔄 Undo / Redo History Stack (Ctrl+Z / Ctrl+Y)**:
  - Stack snapshot naskah 25-tingkat dengan shortcut keyboard universal.
- [x] **📐 Multi-Aspect Ratio Canvas Switcher**:
  - Tombol switcher instan di canvas: `9:16` (TikTok/Reels), `1:1` (Instagram Feed/Square), dan `16:9` (YouTube Landscape).
- [x] **🖼️ Custom B-Roll / Screenshot Evidence Upload**:
  - Slot upload foto/dokumen/tangkapan layar bukti yang langsung ter-render dinamis di `CleanExplainerTemplate`, `BreakingNewsTemplate` (Chat Leaks / CCTV), dan `DocuStoryTemplate` (Ken Burns Effect).
- [x] **📁 Render History Vault (`RenderHistoryModal.tsx`)**:
  - Modal penyimpanan video hasil render dengan pemutar MP4 langsung, tombol download MP4, dan salin tautan publik.
- [x] **🧭 Guided 5-Step Creator Workflow Wizard (`WorkflowStepper.tsx`, `StepNavigationBar.tsx`, `RenderLaunchpad.tsx`)**:
  - Alur kreasi terpadu langkah demi langkah:
    1. **Langkah 1 (Format & Cast)**: Pilih format visual (25 archetypes) & pemeran karakter.
    2. **Langkah 2 (Ide & AI Prompt)**: Ketik ide / mood emosi & racik naskah AI otomatis.
    3. **Langkah 3 (Naskah & Suara AI)**: Edit dialog, 1-klik Sync Suara Cartesia AI Indonesia, Auto-Emoji, upload screenshot bukti.
    4. **Langkah 4 (Visual & Audio Mixer)**: Gaya subtitle kinetik (MrBeast/Ali Abdaal), font kreator, drag posisi teks, volume mixer BGM/SFX.
    5. **Langkah 5 (Render & Viral Kit)**: Pre-Flight Checklist, 1-klik Render Video MP4 HD, download MP4, dan salin judul + caption medsos.
  - Dilengkapi tombol navigasi antar-langkah (`[Kembali]` dan `[Lanjut ➔]`), indikator persentase progres, dan toggle mode fleksibel.
- [x] **🏠 Native Local Ollama LLM Gateway (`http://localhost:11434`)**:
  - Terverifikasi **AKTIF** (PID 32352 / 32180, versi `0.40.13`).
  - Terhubung langsung ke AUDIRA Studio Pro & Admin AI Gateway via endpoint OpenAI-kompatibel (`/v1/chat/completions`).
  - 6 Model lokal terdeteksi: `deepseek-r1:8b`, `qwen3:8b`, `deepseek-r1:32b`, `qwen2.5:32b`, `qwen2.5-coder:32b`, `gemma2:27b`.
  - Inferensi lokal teruji 100% offline, bebas kuota, dan lolos uji ping (latency ~1900ms).
- [x] **Zero TypeScript Errors**:
  - `pnpm tsc --noEmit` lolos 100% tanpa error.

---

## 3. Commercial E-Commerce & Production Sales Release (v3.0.0 Ready-To-Sell)
- [x] **29 Signature 3D Cinematic Videos (1080×1920 @ 60 FPS)**:
  - Seluruh 29 gaya sinematik 3D terintegrasi dari `AUDIRA_STYLE_SHOWCASE_2026/deliver/` ke `public/3d-kits/` dan `public/reels/`.
  - Normalisasi audio broadcast -14.1 LUFS, 10.00 detik durasi, 0 broken media / 0 mock assets.
- [x] **Interactive Order & Checkout Modal (`OrderModal.tsx`)**:
  - Pilihan paket instan (Starter Rp49.000, Master Director Rp79.000, Creator Lab Rp109.000, DFY Rp199.000).
  - Pilihan jalur pembayaran: QRIS Instan (BCA, Mandiri, BRI, GoPay, OVO, ShopeePay), Transfer Bank Manual BCA, dan 1-Klik WhatsApp Direct Checkout dengan template naskah pesanan otomatis.
- [x] **Social Proof & Verified Testimonials (`TestimonialsSection.tsx`)**:
  - Studi kasus & ulasan dari arsitek 3D visualizer, tech reviewer YouTube/TikTok, dan pemilik agensi digital.
  - 4 pilar metrik: 29 Gaya 3D, 60 FPS Fluid Motion, 100% Bebas Royalti, < 24 Jam SLA DFY.
- [x] **Sticky Conversion Bottom Bar (`StickyCtaBar.tsx`)**:
  - Floating bar responsif yang muncul otomatis saat scroll melewati hero section untuk mendorong konversi tanpa mengganggu navigasi.
- [x] **Direct WhatsApp VIP Support Widget (`WhatsAppFloatingWidget.tsx`)**:
  - Floating badge di kanan bawah dengan tooltip bantuan cepat untuk calon pembeli.
- [x] **Production Build Clean**:
  - `npm run build` sukses mengompilasi 12 rute statis/dinamis, 0 error. Server aktif di port 3788.
