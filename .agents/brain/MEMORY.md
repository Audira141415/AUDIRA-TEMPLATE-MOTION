# MEMORY.md — AUDIRA TEMPLATE MOTION

> Persistent Project Memory & Active Sprint Tracker  
> **Status:** Production-Ready (Real SaaS Engine v1.2.0)  
> **Maintainer:** Agus Dwi Rianto (AUDIRA MDA)  

---

## 1. Project Snapshot
- **Proyek:** AUDIRA TEMPLATE MOTION (SaaS Video Generator 9:16 Kaliber BanterReels)
- **Teknologi Utama:** Next.js 15, React 19, Tailwind CSS, Web Audio API, Cartesia Sonic TTS, HyperFrames Engine.
- **Roster Karakter:**
  - Manusia: Ash (Streamer), Kai (Developer), June (Designer), Nara (Analyst), Reza (Corporate).
  - AI Bot: Claude (Honest AI), Bubble (ChatGPT), CyberCore (Supercomputer), BitBot (Retro 8-bit).
  - Lokasi: 24h Neon Diner, Modern Cafe, Tech Office, Podcast Studio, Cozy Bedroom.

---

## 2. Completed Milestones (v1.2.0 Production Release)
- [x] **Config & Environment Sync**:
  - Berhasil menghubungkan `CARTESIA_API_KEY` aktif dan `AUTH_SECRET` ke `.env.local`.
- [x] **Cast & Scene Picker + Shuffle 🎲**:
  - Komponen `CastPicker.tsx` dengan roster 5 karakter manusia, 4 AI avatar, dan 5 latar tempat vertikal 9:16.
  - Fitur `Shuffle Cast` acak 1-klik.
- [x] **Background Music (BGM) & Auto-Ducking Engine**:
  - `bgm-engine.ts`: 4 trek BGM bawaan (*Lofi Chill, News Pulse, Retro Arcade, Cyber Synth*).
  - Auto-ducking: volume musik otomatis turun ke 20% saat ada karakter berbicara, dan naik ke 100% saat jeda komedi / outro.
- [x] **Viral Social Toolkit**:
  - `ViralToolkit.tsx`: Generator judul viral, caption siap unggah dengan hook & CTA, hashtag rekomendasi algoritma, serta tombol 1-klik "Salin Semua".
- [x] **Dual Export System**:
  - Mode 1: Render Instan (5 detik di browser).
  - Mode 2: Cloud Studio Render (HyperFrames + Cartesia neural audio) ke MP4 1080x1920.
- [x] **Full Interactive Script Editor**:
  - Tambah Baris Dialog Baru (+), Hapus Baris, Tukar Pembicara (Swap Speaker), Geser Urutan (Reorder), dan Smart Time Rebalancing.
- [x] **Production Build Validation**:
  - `pnpm build` sukses 100% pada seluruh 10 rute App Router.
