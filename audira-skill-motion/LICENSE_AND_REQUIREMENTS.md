# Lisensi dan Persyaratan — Audira Skill Motion

**Produk:** Audira Skill Motion (Audira Motion 3D)  
**Versi:** 3.0.0 Commercial Edition  
**Pencipta & Pemegang Lisensi:** Agus Dwi Rianto (AUDIRA MDA)  
**Lisensi:** Lisensi Komersial Berbayar (Proprietary Paid Commercial Software License)  
**Hak Cipta © 2026 Agus Dwi Rianto. Seluruh Hak Dilindungi Undang-Undang.**

---

## 1. Lisensi Resmi Berbayar (By Audira / Agus Dwi Rianto)

Audira Skill Motion adalah produk perangkat lunak komersial berbayar yang dilindungi oleh Undang-Undang Hak Cipta No. 28 Tahun 2014 dan konvensi hak cipta internasional.

### Hak Penggunaan yang Diperbolehkan:
- **Produksi Video Komersial Tanpa Batas:** Anda berhak merender video animasi 3D 60 FPS vertikal tanpa batas untuk keperluan komersial, agensi periklanan, konten monetisasi YouTube/TikTok/Reels, portofolio, dan pekerjaan klien berbayar.
- **Kepemilikan Penuh Hasil Render:** Seluruh file video final (.mp4, .mov) yang dihasilkan adalah 100% milik Anda tanpa kewajiban membayar royalti tambahan ke Audira.
- **Instalasi Komputer:** Dipasang pada workstation pribadi pembeli sesuai lisensi per-kursi (seat) yang telah dibeli.

### Batasan & Larangan Keras:
- **DILARANG MENJUAL KEMBALI (NO RESALE):** Anda dilarang mendistribusikan ulang, menjual kembali, menyewakan, atau membundel ulang source code, prompt `SKILL.md`, 20 kit procedural engine, atau dokumentasi Audira Skill Motion kepada pihak ketiga.
- **DILARANG BERBAGI PUBLIK:** Anda dilarang mengunggah file repositori atau paket instalasi ke repositori publik (GitHub, GitLab, Google Drive publik, forum, atau grup publik).
- **HAK KEKAYAAN INTELEKTUAL:** Seluruh hak cipta arsitektur kode, generator matematika prosedural, dan instruksi AI tetap berada di tangan **Agus Dwi Rianto (Audira)**.

*Untuk rincian teks hukum lengkap, lihat file `LICENSE.md`.*

---

## 2. Persyaratan Perangkat Lunak

| Perangkat Lunak | Versi | Sumber | Catatan |
|---|---|---|---|
| **Claude Code** | Terbaru | Anthropic | Memerlukan akun Claude berbayar (Pro, Max, Team, Enterprise) atau API Anthropic |
| **Node.js + npm** | ≥ 22.13 (LTS) | <https://nodejs.org> | Mesin eksekusi JavaScript/TypeScript |
| **ffmpeg + ffprobe** | Terbaru | Komputer lokal | Menganalisis voice-over, contact sheet, dan normalisasi audio |
| **Remotion** | 4.0.539 | Otomatis lewat `npm ci` | Framework render video terprogram |
| **Three.js & React Three Fiber** | 0.186 / 9.8 | Otomatis lewat `npm ci` | Mesin grafis 3D WebGL real-time |
| **Chrome Headless Shell** | Otomatis | Diunduh Remotion | Browser headless untuk rendering 60 FPS |

**Rekomendasi Spesifikasi:**
- **Mac:** Chip Apple Silicon (M1/M2/M3/M4) dengan GPU terintegrasi.
- **PC Windows/Linux:** Prosesor multi-core dengan GPU diskret (NVIDIA RTX / AMD Radeon).
- *Catatan:* Jika GPU tidak terdeteksi, render beralih ke mode software CPU (`swangle`) yang membutuhkan waktu lebih lama.

---

## 3. Lisensi Dependensi Pihak Ketiga

| Komponen | Lisensi | Ketentuan Penggunaan |
|---|---|---|
| **Remotion** | Remotion License | Gratis untuk perorangan, organisasi nirlaba, dan perusahaan dengan maksimal 3 karyawan. Perusahaan lebih besar wajib membeli *Remotion Company License* di <https://remotion.dev/license>. |
| **Three.js** | MIT | Bebas dipakai secara komersial |
| **React & React DOM** | MIT | Bebas dipakai secara komersial |
| **@react-three/fiber** | MIT | Bebas dipakai secara komersial |
| **TypeScript** | Apache-2.0 | Bebas dipakai secara komersial |
| **Font Manrope, Space Grotesk, Silkscreen, Instrument Serif, Anton** | SIL Open Font License 1.1 | Disertakan di dalam paket dan legal dipakai dalam video |

---

## 4. Keamanan & Aset Pengguna

- Paket ini **tidak** menyertakan aset proprietary berlisensi milik pihak ketiga tanpa izin. Semua geometri, partikel, sirkuit PCB, maket kota, dan efek visual dibentuk secara prosedural murni menggunakan matematika Three.js.
- File audio narasi (Voice-Over), musik latar, dan logo brand yang Anda masukkan ke dalam proyek adalah tanggung jawab Anda sendiri mengenai hak siar komersialnya.
